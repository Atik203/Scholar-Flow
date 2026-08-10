/**
 * Phase P5 — Collections + Workspaces + Team E2E (self-cleaning)
 *
 * Runs against the SHARED dev/prod database — every user/workspace/collection
 * it creates uses a unique timestamp suffix and is deleted in teardown.
 * Re-runnable: no fixed emails, no global-count assertions.
 *
 * Run: node apps/backend/e2e_collab.cjs
 */

const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (name) => `e2e.collab.${name}.${TS}@scholarflow.com`;

let pass = 0;
let fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${extra ? " | " + JSON.stringify(extra).slice(0, 200) : ""}`); }
};

const api = async (path, opts = {}) => {
  const res = await fetch(BASE + path, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
};

const login = async (email) => {
  const r = await api("/auth/signin", { method: "POST", body: { email, password: "password123" } });
  return r.json?.data?.accessToken;
};

const register = async (name, email, role) => {
  const r = await api("/auth/register", {
    method: "POST",
    body: { firstName: name, lastName: "E2E", email, password: "password123", role },
  });
  return { status: r.status, json: r.json };
};

(async () => {
  console.log(`\n=== e2e_collab (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok));

  // ---------- Setup: fresh users (unique emails) ----------
  const ownerEmail = EMAIL("owner");
  const memberEmail = EMAIL("member");
  const leadEmail = EMAIL("lead");
  const outsiderEmail = EMAIL("outsider");

  let r = await register("Collab Owner", ownerEmail, "ADMIN");
  ok("register owner 201", r.status === 201);
  const ownerId = r.json?.data?.user?.id;
  let ownerTok = await login(ownerEmail);
  ok("owner login", Boolean(ownerTok));

  r = await register("Collab Member", memberEmail, "RESEARCHER");
  ok("register member 201", r.status === 201);
  const memberId = r.json?.data?.user?.id;
  const memberTok = await login(memberEmail);

  r = await register("Collab Outsider", outsiderEmail, "RESEARCHER");
  ok("register outsider 201", r.status === 201);
  const outsiderId = r.json?.data?.user?.id;
  const outsiderTok = await login(outsiderEmail);

  r = await register("Collab Lead", leadEmail, "TEAM_LEAD");
  ok("register lead 201", r.status === 201);
  const leadId = r.json?.data?.user?.id;
  ok("user ids resolved", Boolean(ownerId && memberId && outsiderId && leadId));

  // SECURITY: register with role=ADMIN must be clamped to RESEARCHER
  const clampEmail = EMAIL("clamp");
  r = await register("Collab Clamp", clampEmail, "ADMIN");
  const clampId = r.json?.data?.user?.id;
  const clampTok = await login(clampEmail);
  r = await api("/team/members", { token: clampTok });
  ok("self-registration as ADMIN clamped (403 on team routes)", r.status === 403);

  // Promote the lead via admin (also exercises team updateMember ADMIN path)
  r = await api(`/team/members/${leadId}`, { token: adminTok, method: "PATCH", body: { role: "TEAM_LEAD" } });
  ok("admin promotes lead to TEAM_LEAD", r.status === 200);
  const leadTok = await login(leadEmail);

  // ---------- Workspaces ----------
  r = await api("/workspaces", { token: ownerTok, method: "POST", body: { name: `E2E WS ${TS}` } });
  ok("owner creates workspace 201", r.status === 201 && Boolean(r.json?.data?.id));
  const wsId = r.json?.data?.id;

  // ---------- Collections ----------
  r = await api("/collections", { token: ownerTok, method: "POST", body: { name: `E2E Coll ${TS}`, workspaceId: wsId, visibility: "PRIVATE" } });
  ok("owner creates collection 201", r.status === 201);
  const colId = r.json?.data?.id;

  r = await api(`/collections/${colId}`, { token: memberTok });
  ok("member cannot read foreign collection (403)", r.status === 403);

  r = await api(`/collections/${colId}/invite`, { token: ownerTok, method: "POST", body: { email: memberEmail, permission: "EDIT" } });
  ok("owner invites member (201)", r.status === 201);
  const cmId = r.json?.data?.memberId;

  r = await api("/collections/invites/received", { token: memberTok });
  const pendingInv = (r.json?.data || []).find((i) => i.collectionId === colId);
  ok("invite visible as received+PENDING", Boolean(pendingInv && pendingInv.status === "PENDING"));

  r = await api(`/collections/${colId}/accept`, { token: memberTok, method: "POST" });
  ok("member accepts collection invite", r.status === 200);

  r = await api(`/collections/${colId}`, { token: memberTok });
  ok("member reads shared collection (200)", r.status === 200 && r.json?.data?.id === colId);

  r = await api(`/collections/${colId}/invite`, { token: ownerTok, method: "POST", body: { email: memberEmail } });
  ok("re-invite ACCEPTED member -> 400", r.status === 400);

  r = await api(`/collections/${colId}`, { token: memberTok, method: "PATCH", body: { description: "edit by member" } });
  ok("EDIT member updates collection", r.status === 200);

  r = await api(`/collections/${colId}`, { token: memberTok, method: "DELETE" });
  ok("EDIT member cannot delete (403)", r.status === 403);

  r = await api(`/collections/${colId}`, { token: outsiderTok, method: "PATCH", body: { name: "hax" } });
  ok("outsider cannot update (403)", r.status === 403);

  // collection search scoping: owner finds own, lead/outsider do NOT
  const qTerm = encodeURIComponent(`E2E Coll ${TS}`);
  r = await api(`/collections/search?q=${qTerm}`, { token: ownerTok });
  ok("owner search finds own private collection", (r.json?.data || []).some((c) => c.id === colId));
  r = await api(`/collections/search?q=${qTerm}`, { token: leadTok });
  ok("non-member search does NOT leak private collection", !(r.json?.data || []).some((c) => c.id === colId));

  r = await api(`/collections/${colId}`, { token: ownerTok, method: "DELETE" });
  ok("owner deletes collection", r.status === 200);
  r = await api(`/collections/${colId}`, { token: ownerTok });
  ok("deleted collection 404", r.status === 404);

  // ---------- Workspace roles + invites ----------
  r = await api(`/workspaces/${wsId}/invite`, { token: ownerTok, method: "POST", body: { email: memberEmail, role: "EDITOR" } });
  ok("workspace invite (201)", r.status === 201);
  const wInvId = r.json?.data?.invitationId;

  r = await api("/workspaces/invites/received", { token: memberTok });
  ok("workspace invite visible to member (received)", (r.json?.data || []).some((i) => i.id === wInvId));

  r = await api(`/workspaces/${wsId}/accept`, { token: memberTok, method: "POST" });
  ok("member accepts workspace invite", r.status === 200);

  r = await api(`/workspaces/${wsId}`, { token: memberTok, method: "PATCH", body: { name: "hax" } });
  ok("EDITOR cannot rename workspace (403)", r.status === 403);

  r = await api(`/workspaces/${wsId}/members`, { token: memberTok, method: "POST", body: { email: outsiderEmail } });
  ok("EDITOR cannot add members (403)", r.status === 403);

  r = await api(`/workspaces/${wsId}/members`, { token: memberTok, method: "GET" });
  ok("member can list workspace members", r.status === 200 && Array.isArray(r.json?.data));

  // promotion to MANAGER (owner-only)
  r = await api("/workspaces", { token: ownerTok });
  const memberRow = (r.json?.data || []).find((w) => w.id === wsId); // no member rows here; find via members list
  r = await api(`/workspaces/${wsId}/members`, { token: ownerTok, method: "GET" });
  const memberRowId = (r.json?.data || []).find((m) => m.email === memberEmail)?.id;
  ok("member row found", Boolean(memberRowId));
  r = await api(`/workspaces/${wsId}/members/${memberRowId}`, { token: ownerTok, method: "PATCH", body: { role: "MANAGER" } });
  ok("owner promotes member to MANAGER", r.status === 200);

  // MANAGER can invite, but NOT as OWNER (escalation guard)
  r = await api(`/workspaces/${wsId}/invite`, { token: memberTok, method: "POST", body: { email: outsiderEmail, role: "EDITOR" } });
  ok("MANAGER invites outsider (201)", r.status === 201);

  r = await api(`/workspaces/${wsId}/invite`, { token: memberTok, method: "POST", body: { email: outsiderEmail, role: "OWNER" } });
  ok("MANAGER cannot invite as OWNER (403)", r.status === 403);

  r = await api("/workspaces/invites/received", { token: outsiderTok });
  const outInv = (r.json?.data || []).find((i) => i.workspaceName && i.status === "PENDING");
  ok("outsider sees pending invite", Boolean(outInv));

  r = await api(`/workspaces/${wsId}/accept`, { token: outsiderTok, method: "POST" });
  ok("outsider accepts invite", r.status === 200);

  // revoke/resend via the sent-invites flow (the outsider invite was SENT BY
  // the MANAGER, so check the manager's sent list)
  r = await api("/workspaces/invites/sent", { token: memberTok });
  const sentInv = (r.json?.data || []).find((i) => i.inviteeEmail === outsiderEmail);
  ok("manager sees sent invite", Boolean(sentInv));

  // ---------- Team scoping ----------
  // lead created no workspace yet; create one + invite member so they share
  r = await api("/workspaces", { token: leadTok, method: "POST", body: { name: `E2E Lead WS ${TS}` } });
  ok("lead creates workspace", r.status === 201);
  const leadWs = r.json?.data?.id;

  r = await api(`/workspaces/${leadWs}/invite`, { token: leadTok, method: "POST", body: { email: memberEmail, role: "VIEWER" } });
  ok("lead invites member (team-style)", r.status === 201);
  r = await api(`/workspaces/${leadWs}/accept`, { token: memberTok, method: "POST" });
  ok("member accepts lead invite", r.status === 200);

  r = await api("/team/members?limit=50", { token: leadTok });
  const teamList = r.json?.data || [];
  const teamEmails = teamList.map((u) => u.email);
  ok("team list scoped (200)", r.status === 200);
  ok("team list contains shared member", teamEmails.includes(memberEmail));
  ok("team list contains self", teamEmails.includes(leadEmail));
  ok("team list does NOT leak non-shared owner", !teamEmails.includes(ownerEmail));
  ok("team list does NOT leak outsider", !teamEmails.includes(outsiderEmail));

  r = await api(`/team/members/${ownerId}`, { token: leadTok, method: "PATCH", body: { role: "PRO_RESEARCHER" } });
  ok("lead cannot modify non-shared user (403)", r.status === 403);

  r = await api(`/team/members/${memberId}`, { token: leadTok, method: "PATCH", body: { role: "ADMIN" } });
  ok("lead cannot grant ADMIN (403)", r.status === 403);

  r = await api(`/team/members/${leadId}`, { token: leadTok, method: "PATCH", body: { role: "RESEARCHER" } });
  ok("cannot change own role (400)", r.status === 400);

  r = await api("/team/members", { token: outsiderTok });
  ok("RESEARCHER blocked from team routes (403)", r.status === 403);

  r = await api("/team/members", { token: memberTok });
  ok("member blocked from team routes (403)", r.status === 403);

  // analytics workspace IDOR: lead can read own ws analytics, not owner's
  r = await api(`/analytics/workspace/${leadWs}`, { token: leadTok });
  ok("lead reads own workspace analytics", r.status === 200);
  r = await api(`/analytics/workspace/${wsId}`, { token: leadTok });
  ok("lead cannot read foreign workspace analytics (403)", r.status === 403);

  // ---------- Notifications ----------
  r = await api("/notifications", { token: memberTok });
  const notifs = r.json?.data || [];
  ok("member received invite notifications", Array.isArray(notifs) && notifs.some((n) => n.type === "INVITE"));

  // ---------- Teardown (self-cleaning) ----------
  r = await api(`/workspaces/${wsId}`, { token: ownerTok, method: "DELETE" });
  ok("teardown: owner deletes workspace", r.status === 200);
  r = await api(`/workspaces/${leadWs}`, { token: leadTok, method: "DELETE" });
  ok("teardown: lead deletes workspace", r.status === 200);

  for (const id of [ownerId, memberId, leadId, outsiderId, clampId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { token: adminTok, method: "DELETE" });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_collab: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });
