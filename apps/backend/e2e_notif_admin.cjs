/**
 * Phase - Notifications + Analytics + Admin E2E (self-cleaning)
 *
 * Covers: notifications (create via invite, cursor list, read/star/delete,
 * settings GET/PUT, SSE auth+headers), analytics (personal, reading-session
 * IDOR regression, workspace lead-gate, usage Pro-gate, CSV export, admin
 * AI usage), admin (NaN-param sanitization, user filters, metrics honesty,
 * private Cache-Control, role update, reports lifecycle, webhooks CRUD,
 * audit log), anon + role 403s. Unique timestamped users; full teardown.
 *
 * Run: node apps/backend/e2e_notif_admin.cjs
 */

const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (name) => `e2e.notif.${name}.${TS}@scholarflow.com`;

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
  return { status: res.status, json, headers: res.headers };
};

const login = async (email) => {
  const r = await api("/auth/signin", { method: "POST", body: { email, password: "password123" } });
  return r.json?.data?.accessToken;
};

const register = async (name, email) => {
  const r = await api("/auth/register", {
    method: "POST",
    body: { firstName: name, lastName: "E2E", email, password: "password123", role: "RESEARCHER" },
  });
  return { status: r.status, json: r.json };
};

(async () => {
  console.log(`\n=== e2e_notif_admin (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok));

  // ---------- Setup ----------
  let r = await register("Notif User", EMAIL("res"));
  ok("register researcher 201", r.status === 201);
  const resId = r.json?.data?.user?.id;
  r = await register("Notif Lead", EMAIL("lead"));
  ok("register lead-user 201", r.status === 201);
  const leadId = r.json?.data?.user?.id;
  const resTok = await login(EMAIL("res"));
  const leadTok = await login(EMAIL("lead"));
  ok("tokens", Boolean(resTok) && Boolean(leadTok));

  // Grant TEAM_LEAD to the lead user (admin action, also tested below)
  r = await api(`/admin/users/${leadId}/role`, {
    method: "PATCH", token: adminTok, body: { role: "TEAM_LEAD" },
  });
  ok("admin grants TEAM_LEAD", r.status === 200, `status=${r.status}`);

  r = await api("/workspaces", { method: "POST", token: leadTok, body: { name: `E2E Notif WS ${TS}` } });
  const leadWs = r.json?.data?.workspace ?? r.json?.data;
  ok("lead creates workspace", r.status === 201 && Boolean(leadWs?.id), `status=${r.status}`);

  // ---------- Anon 401 ----------
  r = await api("/notifications");
  ok("anon blocked from notifications (401)", r.status === 401);
  r = await api("/notifications/settings");
  ok("anon blocked from settings (401)", r.status === 401);
  r = await api("/notifications/stream");
  ok("anon blocked from stream (401)", r.status === 401);
  r = await api("/admin/users");
  ok("anon blocked from admin (401)", r.status === 401);

  // ---------- Notifications (via workspace invite -> INVITE notification) ----------
  r = await api(`/workspaces/${leadWs?.id}/invite`, {
    method: "POST", token: leadTok,
    body: { email: EMAIL("res"), role: "EDITOR" },
  });
  ok("lead invites researcher", r.status === 200 || r.status === 201, `status=${r.status}`);

  r = await api("/notifications?limit=10", { token: resTok });
  const notifs = r.json?.data ?? [];
  ok("researcher has INVITE notification", r.status === 200 && notifs.some((n) => n.type === "INVITE"), `status=${r.status} n=${notifs.length}`);

  const target = notifs.find((n) => n.type === "INVITE");
  if (target) {
    r = await api(`/notifications/${target.id}/read`, { method: "PUT", token: resTok });
    ok("mark notification read", r.status === 200, `status=${r.status}`);
    r = await api(`/notifications/${target.id}/star`, { method: "PUT", token: resTok });
    ok("star notification", r.status === 200, `status=${r.status}`);
    r = await api(`/notifications/${target.id}`, { method: "DELETE", token: resTok });
    ok("delete notification", r.status === 200, `status=${r.status}`);
  }

  r = await api("/notifications/unread-count", { token: resTok });
  ok("unread count numeric", r.status === 200 && typeof r.json?.data?.count === "number", `status=${r.status}`);

  r = await api("/notifications/read-all", { method: "PUT", token: resTok });
  ok("mark all read", r.status === 200, `status=${r.status}`);

  r = await api("/notifications?limit=abc", { token: resTok });
  ok("NaN limit sanitized (200)", r.status === 200, `status=${r.status}`);

  // Settings GET/PUT (real persistence)
  r = await api("/notifications/settings", { token: resTok });
  ok("settings GET 200", r.status === 200 && Boolean(r.json?.data?.muteAll !== undefined), `status=${r.status}`);
  r = await api("/notifications/settings", { method: "PUT", token: resTok, body: { muteAll: true, digestFrequency: "daily" } });
  ok("settings PUT muteAll", r.status === 200 && r.json?.data?.muteAll === true, `status=${r.status}`);
  r = await api("/notifications/settings", { token: resTok });
  ok("settings persisted", r.status === 200 && r.json?.data?.digestFrequency === "daily", `status=${r.status}`);
  r = await api("/notifications/settings", { method: "PUT", token: resTok, body: { muteAll: false } });
  ok("settings unmute", r.status === 200, `status=${r.status}`);

  // SSE endpoint: auth + content-type (short-lived connection)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const sseRes = await fetch(`${BASE}/notifications/stream?token=${resTok}`, {
      headers: { Accept: "text/event-stream" },
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timeout);
    const ct = sseRes?.headers?.get("content-type") ?? "";
    ok("SSE stream auth + content-type", Boolean(sseRes?.ok) && ct.includes("text/event-stream"), `ct=${ct}`);
  } catch {
    ok("SSE stream auth + content-type", false, "fetch threw");
  }

  // ---------- Analytics ----------
  r = await api("/analytics/personal?timeRange=week", { token: resTok });
  ok("personal analytics 200", r.status === 200 && Boolean(r.json?.data?.stats), `status=${r.status}`);
  r = await api("/analytics/personal?timeRange=garbage", { token: resTok });
  ok("invalid timeRange coerced (200)", r.status === 200, `status=${r.status}`);

  r = await api("/analytics/personal/reading-session", { method: "POST", token: resTok, body: {} });
  const sessionEventId = r.json?.data?.id;
  ok("start reading session", (r.status === 200 || r.status === 201) && Boolean(sessionEventId), `status=${r.status}`);

  // IDOR regression: another user cannot finalize this session
  r = await api(`/analytics/personal/reading-session/${sessionEventId}`, { method: "PATCH", token: leadTok, body: { units: 500 } });
  ok("IDOR: foreign stop blocked (404)", r.status === 404, `status=${r.status}`);

  r = await api(`/analytics/personal/reading-session/${sessionEventId}`, { method: "PATCH", token: resTok, body: { units: 12 } });
  ok("owner stops own session", r.status === 200, `status=${r.status}`);

  r = await api(`/analytics/workspace/${leadWs?.id}?timeRange=month`, { token: resTok });
  ok("non-lead blocked from workspace analytics (403)", r.status === 403, `status=${r.status}`);
  r = await api(`/analytics/workspace/${leadWs?.id}?timeRange=month`, { token: leadTok });
  ok("lead reads own workspace analytics", r.status === 200, `status=${r.status}`);

  r = await api("/analytics/usage?timeRange=week", { token: resTok });
  ok("researcher blocked from usage (403)", r.status === 403, `status=${r.status}`);
  r = await api("/analytics/usage?timeRange=week", { token: leadTok });
  ok("lead reads usage report", r.status === 200, `status=${r.status}`);

  const expRes = await fetch(`${BASE}/analytics/usage/export?format=csv`, {
    headers: { Authorization: `Bearer ${leadTok}` },
  });
  ok("usage CSV export 200", expRes.status === 200 && (expRes.headers.get("content-disposition") ?? "").includes("attachment"), `status=${expRes.status}`);

  r = await api("/analytics/admin/ai-usage?timeRange=week", { token: adminTok });
  ok("admin AI usage 200", r.status === 200, `status=${r.status}`);
  r = await api("/analytics/admin/ai-usage", { token: resTok });
  ok("researcher blocked from admin AI usage (401/403)", r.status === 401 || r.status === 403, `status=${r.status}`);

  // ---------- Admin ----------
  r = await api("/admin/users");
  ok("researcher blocked from admin (401/403)", r.status === 401 || r.status === 403, `status=${r.status}`);

  r = await api("/admin/users?page=abc&limit=xyz", { token: adminTok });
  ok("NaN page/limit sanitized (200)", r.status === 200, `status=${r.status}`);

  const usersRes = await fetch(`${BASE}/admin/users?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${adminTok}` },
  });
  const cacheControl = usersRes.headers.get("cache-control") ?? "";
  ok("admin responses Cache-Control private", usersRes.status === 200 && cacheControl.includes("private"), `cc=${cacheControl}`);

  r = await api("/admin/users/recent?page=1&limit=5&role=ADMIN", { token: adminTok });
  const recentUsers = r.json?.data ?? [];
  ok("recent users role filter applied", r.status === 200 && recentUsers.every((u) => u.role === "ADMIN"), `status=${r.status} n=${recentUsers.length}`);

  r = await api("/admin/system/metrics", { token: adminTok });
  const metrics = r.json?.data;
  const cpuTier = metrics?.health?.cpu;
  ok("metrics 4-tier cpu status", r.status === 200 && ["healthy", "degraded", "warning", "critical"].includes(cpuTier), `status=${r.status} cpu=${cpuTier}`);
  ok("metrics has no fake io/bandwidth", !("ioPercentage" in (metrics?.performance?.disk ?? {})) && !("bandwidth" in (metrics?.performance?.network ?? {})));
  ok("metrics cpu usage numeric", typeof metrics?.performance?.cpu?.usage === "number");

  r = await api("/admin/health", { token: adminTok });
  ok("health storage percentage numeric", r.status === 200 && typeof r.json?.data?.storage?.percentageUsed === "number", `status=${r.status}`);

  // Reports lifecycle
  r = await api("/admin/reports", {
    method: "POST", token: adminTok,
    body: { name: `E2E Report ${TS}`, type: "USER", format: "CSV" },
  });
  const reportId = r.json?.data?.id;
  ok("create report", (r.status === 200 || r.status === 201) && Boolean(reportId), `status=${r.status}`);
  if (reportId) {
    r = await api(`/admin/reports/${reportId}/generate`, { method: "POST", token: adminTok });
    ok("generate report", r.status === 200, `status=${r.status}`);
    r = await api("/admin/reports?page=1&limit=10", { token: adminTok });
    const reports = r.json?.data ?? [];
    ok("reports list includes ours", r.status === 200 && reports.some((rp) => rp.id === reportId), `status=${r.status}`);
    r = await api(`/admin/reports/${reportId}`, { method: "DELETE", token: adminTok });
    ok("delete report", r.status === 200, `status=${r.status}`);
  }

  // Audit log
  r = await api("/admin/audit-log?page=abc&limit=5", { token: adminTok });
  ok("audit log NaN-safe 200", r.status === 200, `status=${r.status}`);

  // Webhooks
  r = await api("/admin/webhooks/endpoints", {
    method: "POST", token: adminTok,
    body: { name: `E2E Hook ${TS}`, url: "https://example.com/hook", events: ["user.created"] },
  });
  const hookId = r.json?.data?.id ?? r.json?.data?.endpoint?.id;
  ok("create webhook endpoint", (r.status === 200 || r.status === 201) && Boolean(hookId), `status=${r.status}`);
  r = await api("/admin/webhooks/endpoints", {
    method: "POST", token: adminTok,
    body: { name: `E2E Bad Hook ${TS}`, url: "file:///etc/passwd", events: ["user.created"] },
  });
  ok("non-http(s) webhook URL rejected (400)", r.status === 400, `status=${r.status}`);
  if (hookId) {
    r = await api(`/admin/webhooks/endpoints/${hookId}/rotate-secret`, { method: "POST", token: adminTok });
    ok("rotate webhook secret", r.status === 200, `status=${r.status}`);
    r = await api(`/admin/webhooks/endpoints/${hookId}/deliveries?page=1&limit=5`, { token: adminTok });
    ok("list deliveries", r.status === 200, `status=${r.status}`);
    r = await api(`/admin/webhooks/endpoints/${hookId}`, { method: "DELETE", token: adminTok });
    ok("delete webhook endpoint", r.status === 200, `status=${r.status}`);
  }

  // ---------- Teardown ----------
  r = await api(`/workspaces/${leadWs?.id}`, { token: leadTok, method: "DELETE" });
  ok("teardown: lead deletes workspace", r.status === 200, `status=${r.status}`);
  for (const id of [resId, leadId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { token: adminTok, method: "DELETE" });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_notif_admin: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });
