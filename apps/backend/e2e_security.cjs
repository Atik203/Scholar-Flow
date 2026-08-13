/**
 * Phase - Security E2E (self-cleaning)
 *
 * Covers the real TOTP 2FA flow end-to-end: status -> generate -> wrong
 * code rejected -> valid code (computed locally with the same RFC 6238
 * algorithm) enables 2FA -> signin WITHOUT code blocked (TWO_FACTOR_
 * REQUIRED) -> signin with wrong code blocked -> signin with valid code
 * succeeds -> disable -> plain signin works again. Plus sessions list /
 * ownership guard, privacy settings persistence, anon 401s.
 *
 * Run: node apps/backend/e2e_security.cjs
 */

const crypto = require("crypto");

const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (name) => `e2e.sec.${name}.${TS}@scholarflow.com`;

let pass = 0;
let fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? " | " + JSON.stringify(extra).slice(0, 200) : ""}`); }
};

const api = async (path, opts = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(BASE + path, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
};

const login = async (email, twoFactorCode) => {
  const body = { email, password: "password123" };
  if (twoFactorCode) body.twoFactorCode = twoFactorCode;
  const r = await api("/auth/signin", { method: "POST", body });
  return { status: r.status, json: r.json };
};

const register = async (name, email) => {
  const r = await api("/auth/register", {
    method: "POST",
    body: { firstName: name, lastName: "E2E", email, password: "password123", role: "RESEARCHER" },
  });
  return { status: r.status, json: r.json };
};

// --- Local TOTP (RFC 6238) — mirrors the backend implementation ---
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Decode(b32) {
  let bits = 0, value = 0;
  const out = [];
  for (const ch of b32.toUpperCase().replace(/=+$/, "")) {
    const idx = B32.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}
function totp(secret, when = Date.now()) {
  const counter = Math.floor(when / 1000 / 30);
  const msg = Buffer.alloc(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const h = crypto.createHmac("sha1", base32Decode(secret)).update(msg).digest();
  const o = h[h.length - 1] & 0x0f;
  const bin =
    ((h[o] & 0x7f) << 24) |
    ((h[o + 1] & 0xff) << 16) |
    ((h[o + 2] & 0xff) << 8) |
    (h[o + 3] & 0xff);
  return String(bin % 1e6).padStart(6, "0");
}

(async () => {
  console.log(`\n=== e2e_security (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok.json?.data?.accessToken) || adminTok.status === 200);

  // ---------- Setup ----------
  const aEmail = EMAIL("a");
  const bEmail = EMAIL("b");
  let r = await register("Sec User A", aEmail);
  ok("register user A 201", r.status === 201);
  const aId = r.json?.data?.user?.id;
  r = await register("Sec User B", bEmail);
  ok("register user B 201", r.status === 201);
  const bId = r.json?.data?.user?.id;
  const aTok = (await login(aEmail)).json?.data?.accessToken;
  ok("user A token", Boolean(aTok));

  // ---------- Anon 401 ----------
  r = await api("/user/2fa/status");
  ok("anon blocked from 2fa status (401)", r.status === 401);
  r = await api("/user/sessions");
  ok("anon blocked from sessions (401)", r.status === 401);
  r = await api("/user/privacy");
  ok("anon blocked from privacy (401)", r.status === 401);

  // ---------- 2FA setup flow ----------
  r = await api("/user/2fa/status", { token: aTok });
  ok("2fa status starts disabled", r.status === 200 && r.json?.data?.enabled === false, `status=${r.status}`);

  r = await api("/user/2fa/generate", { method: "POST", token: aTok });
  const secret = r.json?.data?.secret;
  const qrUrl = r.json?.data?.qrCodeUrl;
  ok("generate returns base32 secret + otpauth url", r.status === 200 && typeof secret === "string" && secret.length >= 16 && String(qrUrl).startsWith("otpauth://totp/"), `len=${secret?.length}`);

  // Wrong code rejected
  r = await api("/user/2fa/verify", { method: "POST", token: aTok, body: { code: "000000" } });
  ok("wrong code rejected (400)", r.status === 400, `status=${r.status}`);

  // Valid code (computed locally) enables 2FA
  const validCode = totp(secret);
  r = await api("/user/2fa/verify", { method: "POST", token: aTok, body: { code: validCode } });
  ok("valid TOTP enables 2FA", r.status === 200 && r.json?.data?.enabled === true, `status=${r.status} code=${validCode}`);

  r = await api("/user/2fa/status", { token: aTok });
  ok("2fa status now enabled", r.status === 200 && r.json?.data?.enabled === true, `status=${r.status}`);

  // ---------- Signin enforcement ----------
  let s = await login(aEmail);
  ok("signin without code blocked (401)", s.status === 401, `status=${s.status}`);
  ok("signin without code says TWO_FACTOR_REQUIRED", s.json?.message === "TWO_FACTOR_REQUIRED", `msg=${s.json?.message}`);

  s = await login(aEmail, "000000");
  ok("signin with wrong code blocked", s.status === 401, `status=${s.status}`);

  const code2 = totp(secret);
  s = await login(aEmail, code2);
  ok("signin with valid code succeeds", s.status === 200 && Boolean(s.json?.data?.accessToken), `status=${s.status}`);

  // ---------- Sessions (real rows; ownership guard) ----------
  r = await api("/user/sessions", { token: aTok });
  ok("sessions list 200 array", r.status === 200 && Array.isArray(r.json?.data), `status=${r.status} n=${r.json?.data?.length}`);
  r = await api("/user/sessions/00000000-0000-0000-0000-000000000000", { method: "DELETE", token: aTok });
  ok("terminate unknown session 404", r.status === 404, `status=${r.status}`);

  // ---------- Privacy persistence ----------
  r = await api("/user/privacy", { token: aTok });
  ok("privacy defaults", r.status === 200 && r.json?.data?.profileVisibility === "public", `status=${r.status}`);
  r = await api("/user/privacy", {
    method: "PUT", token: aTok,
    body: { profileVisibility: "team", allowDataSharing: true },
  });
  ok("privacy update 200", r.status === 200, `status=${r.status}`);
  r = await api("/user/privacy", { token: aTok });
  ok("privacy persisted", r.status === 200 && r.json?.data?.profileVisibility === "team" && r.json?.data?.allowDataSharing === true, `status=${r.status}`);

  // ---------- Disable 2FA + plain signin ----------
  r = await api("/user/2fa/disable", { method: "POST", token: aTok });
  ok("disable 2FA", r.status === 200 && r.json?.data?.enabled === false, `status=${r.status}`);
  r = await api("/user/2fa/status", { token: aTok });
  ok("status disabled after disable", r.status === 200 && r.json?.data?.enabled === false, `status=${r.status}`);
  s = await login(aEmail);
  ok("plain signin works after disable", s.status === 200 && Boolean(s.json?.data?.accessToken), `status=${s.status}`);

  // ---------- Teardown ----------
  for (const id of [aId, bId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { method: "DELETE", token: adminTok.json?.data?.accessToken });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_security: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });
