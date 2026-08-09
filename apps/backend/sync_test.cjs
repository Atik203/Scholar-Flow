const fs = require("fs");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const { Client } = require("pg");
const env = {};
for (const line of fs.readFileSync("E:/PROJECT/Scholar-Flow/apps/backend/.env", "utf8").split(/\r?\n/)) {
  const m = /^([A-Z0-9_]+)="?(.*?)"?$/.exec(line);
  if (m) env[m[1]] = m[2];
}
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" });
const pg = new Client({ connectionString: env.DIRECT_DATABASE_URL });
const API = "http://localhost:5000/api";
const api = async (p, { method = "GET", token, body } = {}) => {
  const res = await fetch(`${API}${p}`, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
};
const results = [];
const ok = (name, cond, extra) => { results.push({ name, pass: !!cond }); console.log(`${cond ? "PASS" : "FAIL"} | ${name}${extra ? " | " + extra : ""}`); };
(async () => {
  await pg.connect();
  const login = async (email) => (await api("/auth/signin", { method: "POST", body: { email, password: "password123" } })).json;
  const admin = await login("admin@scholarflow.com");
  const token = admin.data.accessToken;
  const researcher = await login("researcher@scholarflow.com");
  const rToken = researcher.data.accessToken;

  const plans = (await api("/admin/plans", { token })).json.data;
  const pro = plans.find((p) => p.code === "pro_monthly");
  const oldPriceId = pro.stripePriceId;
  ok("baseline: pro_monthly DB=2000 Stripe=2900", pro.priceCents === 2000);

  // 1) Edit price to $25 → must create a NEW Stripe price at 2500
  const upd = await api(`/admin/plans/${pro.id}`, { method: "PATCH", token, body: { priceCents: 2500 } });
  const newPriceId = upd.json?.data?.stripePriceId;
  ok("edit 2000 -> 2500 (200)", upd.status === 200, `new priceId=${String(newPriceId).slice(0,12)}`);
  ok("stripePriceId repointed", newPriceId && newPriceId !== oldPriceId);

  if (newPriceId) {
    const sp = await stripe.prices.retrieve(newPriceId);
    ok("REAL Stripe price at 2500", sp.unit_amount === 2500, `stripe=${sp.unit_amount}`);
  }

  // 2) Catalog reflects it
  const cat = (await api("/billing/catalog")).json.data;
  ok("catalog shows $25", cat.pro.monthly?.priceCents === 2500);

  // 3) Checkout accepts the NEW price id (DB validation, not env)
  const chk = await api("/billing/checkout-session", { method: "POST", token: rToken, body: { priceId: newPriceId } });
  ok("checkout accepts new price id", chk.status === 200, `status=${chk.status}`);

  // 4) Role mapping via plan code (mirror of getRoleFromStripePriceId)
  const row = (await pg.query(`SELECT code FROM "Plan" WHERE "stripePriceId" = $1 AND "isDeleted" = false LIMIT 1`, [newPriceId])).rows[0];
  const role = row?.code?.split("_")[0] === "pro" ? "PRO_RESEARCHER" : "RESEARCHER";
  ok("webhook role mapping: pro code -> PRO_RESEARCHER", role === "PRO_RESEARCHER", `code=${row?.code}`);

  // 5) Restore to $20 (user's intended price) — creates a Stripe price at 2000
  const rst = await api(`/admin/plans/${pro.id}`, { method: "PATCH", token, body: { priceCents: 2000 } });
  const restoredPriceId = rst.json?.data?.stripePriceId;
  const sp2 = restoredPriceId ? await stripe.prices.retrieve(restoredPriceId) : null;
  ok("restored DB=2000", rst.status === 200 && rst.json?.data?.priceCents === 2000);
  ok("restored Stripe price at 2000", sp2?.unit_amount === 2000, `stripe=${sp2?.unit_amount}`);
  const cat2 = (await api("/billing/catalog")).json.data;
  ok("catalog shows $20 again", cat2.pro.monthly?.priceCents === 2000);

  // 6) Deactivate the orphaned $25 price
  if (newPriceId) { try { await stripe.prices.update(newPriceId, { active: false }); ok("orphaned $25 price deactivated", true); } catch (e) { ok("orphan cleanup", false, e.message); } }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n===== SYNC E2E: ${results.length - failed.length}/${results.length} passed =====`);
  await pg.end();
  if (failed.length) process.exitCode = 1;
})().catch((e) => { console.error("E2E ERROR:", e.message); process.exit(1); });
