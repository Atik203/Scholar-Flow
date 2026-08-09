/* eslint-disable */
/**
 * Phase D — admin payment/subscription E2E against the local backend (:5000).
 * Uses the real Stripe test API: creates a real charge, refunds it through
 * the admin endpoint, exercises subscriber actions + plan CRUD, verifies
 * revenue consistency and 403 guards.
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");

const API = "http://localhost:5000/api";
const results = [];
const ok = (name, cond, extra) => {
  results.push({ name, pass: !!cond, extra: extra ?? "" });
  console.log(`${cond ? "PASS" : "FAIL"} | ${name}${extra ? ` | ${extra}` : ""}`);
};

(async () => {
  // --- env ---
  const env = {};
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)="?(.*?)"?$/.exec(line);
    if (m) env[m[1]] = m[2];
  }
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" });
  const pg = new Client({ connectionString: env.DIRECT_DATABASE_URL });
  await pg.connect();

  const sign = (id, email) =>
    jwt.sign({ sub: id, email }, env.NEXTAUTH_SECRET, { expiresIn: "1h" });

  const api = async (p, { method = "GET", token, body } = {}) => {
    const res = await fetch(`${API}${p}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    let json = null;
    try { json = await res.json(); } catch { /* noop */ }
    return { status: res.status, json };
  };

  const [adminRow, researcherRow] = await Promise.all([
    pg.query(`SELECT id, email FROM "User" WHERE email = 'admin@scholarflow.com' LIMIT 1`),
    pg.query(`SELECT id, email FROM "User" WHERE email = 'researcher@scholarflow.com' LIMIT 1`),
  ]);
  const adminId = adminRow.rows[0].id;
  const researcherId = researcherRow.rows[0].id;
  const adminToken = sign(adminId, adminRow.rows[0].email);
  const researcherToken = sign(researcherId, researcherRow.rows[0].email);

  // ============ 1. REAL REFUND ============
  const customer = "cus_V1wYwKN2kvI43E"; // existing test customer (user's own)
  const pm = await stripe.paymentMethods.create({
    type: "card",
    card: { token: "tok_visa" },
  });
  const pi = await stripe.paymentIntents.create({
    amount: 1999,
    currency: "usd",
    customer,
    payment_method_types: ["card"],
    metadata: { purpose: "admin-e2e-refund-test" },
  });
  const confirmed = await stripe.paymentIntents.confirm(pi.id, {
    payment_method: pm.id,
  });
  ok("PI created + confirmed (paid)", confirmed.status === "succeeded", confirmed.id);

  const paymentId = (
    await pg.query(
      `INSERT INTO "Payment" (id, "userId", provider, "amountCents", currency, "transactionId", status, raw, "createdAt", "updatedAt", "isDeleted")
       VALUES (gen_random_uuid(), $1, 'STRIPE', 1999, 'USD', $2, 'SUCCEEDED', $3::jsonb, NOW(), NOW(), false)
       RETURNING id`,
      [adminId, `e2e_${Date.now()}`, JSON.stringify({ payment_intent: pi.id })]
    )
  ).rows[0].id;
  ok("Payment row seeded", true);

  const refundRes = await api(`/admin/payments/${paymentId}/refund`, {
    method: "POST",
    token: adminToken,
  });
  ok("Refund endpoint 200", refundRes.status === 200, JSON.stringify(refundRes.json?.message ?? refundRes.status));

  const refunds = await stripe.refunds.list({ payment_intent: pi.id });
  ok("REAL Stripe refund exists", refunds.data.length > 0 && refunds.data[0].status === "succeeded",
    `refund ${refunds.data[0]?.id} amount ${refunds.data[0]?.amount}`);

  const payRow = (await pg.query(`SELECT status, raw->>'refundedBy' AS "refundedBy" FROM "Payment" WHERE id = $1`, [paymentId])).rows[0];
  ok("Payment row REFUNDED locally", payRow.status === "REFUNDED", `status=${payRow.status}`);
  ok("refundedBy recorded", payRow.refundedBy === adminId);

  const audit = await pg.query(
    `SELECT COUNT(*)::int AS n FROM "ActivityLogEntry" WHERE "entityId" = $1 AND action = 'refunded'`,
    [paymentId]
  );
  ok("Audit entry written", audit.rows[0].n >= 1);

  const rev = await api("/admin/analytics/revenue?timeRange=30d", { token: adminToken });
  ok("Total revenue excludes refunded payment", rev.status === 200 && rev.json?.data?.totalRevenue?.amount === 0,
    `totalRevenue=${rev.json?.data?.totalRevenue?.amount}`);

  // Guard: refund a non-SUCCEEDED row -> 400
  const failedId = (
    await pg.query(
      `INSERT INTO "Payment" (id, "userId", provider, "amountCents", currency, "transactionId", status, "createdAt", "updatedAt", "isDeleted")
       VALUES (gen_random_uuid(), $1, 'STRIPE', 500, 'USD', $2, 'FAILED', NOW(), NOW(), false)
       RETURNING id`,
      [adminId, `e2e_fail_${Date.now()}`]
    )
  ).rows[0].id;
  const guardRes = await api(`/admin/payments/${failedId}/refund`, { method: "POST", token: adminToken });
  ok("Refund guard: FAILED payment rejected 400", guardRes.status === 400, String(guardRes.status));

  // ============ 2. REVENUE CONSISTENCY ============
  ok("MRR excludes trial subscription", rev.json?.data?.mrr?.amount === 0, `mrr=${rev.json?.data?.mrr?.amount}`);
  ok("activeUsers excludes trial", rev.json?.data?.metrics?.activeUsers === 0,
    `activeUsers=${rev.json?.data?.metrics?.activeUsers}`);
  ok("ARPU consistent (0)", rev.json?.data?.metrics?.arpu === 0, `arpu=${rev.json?.data?.metrics?.arpu}`);

  const plansRes = await api("/admin/plans", { token: adminToken });
  const proMonthly = plansRes.json?.data?.find((p) => p.code === "pro_monthly");
  ok("Plans page MRR == analytics MRR (0)", proMonthly?.monthlyRevenueCents === 0,
    `plansMRR=${proMonthly?.monthlyRevenueCents}`);

  const topCust = await api("/admin/analytics/top-customers?limit=10", { token: adminToken });
  ok("Top customers 200 + array", topCust.status === 200 && Array.isArray(topCust.json?.data));

  const subsList = await api("/admin/analytics/subscribers?page=1&limit=10&status=TRIALING", { token: adminToken });
  ok("TRIALING filter maps gracefully (no 500)", subsList.status === 200,
    `status=${subsList.status}`);

  // ============ 3. SUBSCRIBER ACTIONS (live trial sub) ============
  const subRes = await api("/admin/subscribers?limit=25", { token: adminToken });
  const trial = subRes.json?.data?.find((s) => s.planName === "Pro");
  ok("Subscribers list returns trial sub", !!trial, JSON.stringify(trial ? { id: trial.subscriptionId, status: trial.status } : {}));

  if (trial) {
    const sid = trial.subscriptionId;
    const strSubId = "sub_1U2ZnmFhnMriScoZwI1jzRIR";

    const c1 = await api(`/admin/subscribers/${sid}/cancel-at-period-end`, { method: "POST", token: adminToken });
    const str1 = await stripe.subscriptions.retrieve(strSubId);
    ok("Cancel at period end (Stripe)", c1.status === 200 && str1.cancel_at_period_end === true, `status=${c1.status}`);

    const c2 = await api(`/admin/subscribers/${sid}/reactivate`, { method: "POST", token: adminToken });
    const str2 = await stripe.subscriptions.retrieve(strSubId);
    ok("Reactivate (Stripe)", c2.status === 200 && str2.cancel_at_period_end === false, `status=${c2.status}`);

    const annual = plansRes.json?.data?.find((p) => p.code === "pro_annual");
    const c3 = await api(`/admin/subscribers/${sid}/change-plan`, {
      method: "POST",
      token: adminToken,
      body: { priceId: annual.stripePriceId },
    });
    const str3 = await stripe.subscriptions.retrieve(strSubId);
    const row3 = (
      await pg.query(
        `SELECT p.code FROM "Subscription" s JOIN "Plan" p ON s."planId" = p.id WHERE s.id = $1`,
        [sid]
      )
    ).rows[0];
    ok("Change plan (Stripe price swap)", c3.status === 200 && str3.items.data[0].price.id === annual.stripePriceId,
      `stripe=${str3.items.data[0].price.id}`);
    ok("Change plan (local planId)", row3.code === "pro_annual", `local=${row3.code}`);

    // restore to monthly
    await api(`/admin/subscribers/${sid}/change-plan`, {
      method: "POST",
      token: adminToken,
      body: { priceId: proMonthly.stripePriceId },
    });
    const rowRestored = (
      await pg.query(`SELECT p.code FROM "Subscription" s JOIN "Plan" p ON s."planId" = p.id WHERE s.id = $1`, [sid])
    ).rows[0];
    ok("Plan restored to pro_monthly", rowRestored.code === "pro_monthly", `local=${rowRestored.code}`);
  }

  // ============ 4. PLAN CRUD ============
  const created = await api("/admin/plans", {
    method: "POST",
    token: adminToken,
    body: { code: `e2e_plan_${Date.now()}`, name: "E2E Plan", priceCents: 9900, currency: "USD", interval: "month" },
  });
  ok("Plan created", created.status === 200 && !!created.json?.data?.id, String(created.status));
  const planId = created.json?.data?.id;

  if (planId) {
    const upd = await api(`/admin/plans/${planId}`, {
      method: "PATCH",
      token: adminToken,
      body: { name: "E2E Plan Renamed" },
    });
    ok("Plan updated", upd.status === 200 && upd.json?.data?.name === "E2E Plan Renamed");

    const tog = await api(`/admin/plans/${planId}/toggle`, { method: "POST", token: adminToken });
    ok("Plan toggled inactive", tog.status === 200 && tog.json?.data?.active === false);

    const del = await api(`/admin/plans/${planId}`, { method: "DELETE", token: adminToken });
    ok("Plan soft-deleted", del.status === 200 && del.json?.data?.isDeleted === true);
  }

  // ============ 5. 403 GUARDS ============
  for (const [name, p, method] of [
    ["payments", "/admin/payments", "GET"],
    ["refund", `/admin/payments/${paymentId}/refund`, "POST"],
    ["subscribers", "/admin/subscribers", "GET"],
    ["subscriber action", "/admin/subscribers/123/cancel-now", "POST"],
    ["plan create", "/admin/plans", "POST"],
    ["revenue", "/admin/analytics/revenue", "GET"],
  ]) {
    const r = await api(p, { method, token: researcherToken, body: method === "POST" ? { priceId: "price_x" } : undefined });
    ok(`403 guard: researcher blocked from ${name}`, r.status === 403, `got ${r.status}`);
  }

  // cleanup e2e payment rows
  await pg.query(`DELETE FROM "Payment" WHERE "transactionId" LIKE 'e2e%'`);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n===== E2E SUMMARY: ${results.length - failed.length}/${results.length} passed =====`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  MISSING: ${f.name}`));
    process.exitCode = 1;
  }
  await pg.end();
})().catch((e) => {
  console.error("E2E ERROR:", e.message);
  process.exit(1);
});
