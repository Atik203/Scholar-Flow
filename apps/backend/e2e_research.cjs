/**
 * Phase P9 - Research Module E2E (self-cleaning)
 *
 * Covers the Research module surfaces: discussions (scoped + general +
 * pin/resolve/messages + ownership), annotations (create/update/reply/
 * versions/delete), citations (insert, paper-citations, export, history,
 * download, delete), activity log (list/summary/entity/export), access
 * control (anon 401), and ownership guards (foreign 403).
 *
 * Runs against the SHARED dev/prod database - every user/workspace/paper
 * uses a unique timestamp suffix and is deleted in teardown.
 * Re-runnable: no fixed emails, no global-count assertions.
 *
 * Run: node apps/backend/e2e_research.cjs
 */

const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (name) => `e2e.research.${name}.${TS}@scholarflow.com`;

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

const uploadPdf = async (token, workspaceId) => {
  const form = new FormData();
  form.append("file", new Blob([PDF_BYTES], { type: "application/pdf" }), "e2e-research.pdf");
  form.append("workspaceId", workspaceId);
  form.append("tags", JSON.stringify(["e2e", "research"]));
  const res = await fetch(`${BASE}/papers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, id: json?.data?.paper?.id };
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

// Minimal valid single-page PDF (same builder as e2e_papers.cjs)
function buildPdf() {
  const line1 =
    "Hello Scholar Flow E2E. This is a research paper used for automated " +
    "testing of the extraction pipeline. It contains enough text to pass " +
    "the scanned document heuristic and verify chunking and embedding.";
  const line2 =
    "Second paragraph confirms multi-line extraction works end to end.";
  const stream =
    `BT /F1 10 Tf 72 720 Td(${line1}) Tj 0 -14 Td(${line2}) Tj ET\n`;
  const objects = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>",
    `<</Length ${stream.length}>>stream\n${stream}endstream`,
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj${body}endobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}
const PDF_BYTES = buildPdf();

(async () => {
  console.log(`\n=== e2e_research (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok));

  // ---------- Setup: fresh users ----------
  const researcherEmail = EMAIL("res");
  const proEmail = EMAIL("pro");
  let r = await register("Research User", researcherEmail);
  ok("register researcher 201", r.status === 201);
  const researcherId = r.json?.data?.user?.id;
  r = await register("Pro Research User", proEmail);
  ok("register pro 201", r.status === 201);
  const proId = r.json?.data?.user?.id;
  const resTok = await login(researcherEmail);
  const proTok = await login(proEmail);
  ok("researcher + pro tokens", Boolean(resTok) && Boolean(proTok));

  // Workspaces + papers
  r = await api("/workspaces", { method: "POST", token: resTok, body: { name: `E2E Research WS ${TS}` } });
  const resWs = r.json?.data?.workspace ?? r.json?.data;
  ok("researcher creates workspace", r.status === 201 && Boolean(resWs?.id));
  r = await api("/workspaces", { method: "POST", token: proTok, body: { name: `E2E Pro WS ${TS}` } });
  const proWs = r.json?.data?.workspace ?? r.json?.data;
  ok("pro creates workspace", r.status === 201 && Boolean(proWs?.id));

  const upA = await uploadPdf(resTok, resWs?.id);
  ok("researcher uploads paper A", upA.status === 201 && Boolean(upA.id), `status=${upA.status}`);
  const upB = await uploadPdf(proTok, proWs?.id);
  ok("pro uploads paper B", upB.status === 201 && Boolean(upB.id), `status=${upB.status}`);
  const paperA = upA.id;
  const paperB = upB.id;
  if (!paperA || !paperB) { console.error("setup failed - aborting"); process.exit(1); }

  // ---------- Access control (anon) ----------
  r = await api("/discussions");
  ok("anon blocked from discussions (401)", r.status === 401);
  r = await api("/annotations/user");
  ok("anon blocked from annotations (401)", r.status === 401);
  r = await api("/citations/history");
  ok("anon blocked from citations (401)", r.status === 401);
  r = await api("/activity-log");
  ok("anon blocked from activity-log (401)", r.status === 401);

  // ---------- Discussions ----------
  r = await api("/discussions", {
    method: "POST", token: resTok,
    body: { paperId: paperA, title: `E2E thread ${TS}`, content: "E2E discussion body", tags: ["e2e"] },
  });
  const threadId = r.json?.data?.thread?.id ?? r.json?.data?.id;
  ok("create scoped discussion (paper)", r.status === 201 && Boolean(threadId), `status=${r.status}`);

  r = await api("/discussions/general", {
    method: "POST", token: proTok,
    body: { title: `E2E general ${TS}`, content: "General discussion", tags: ["e2e"] },
  });
  const generalId = r.json?.data?.thread?.id ?? r.json?.data?.id;
  ok("create general discussion", r.status === 201 && Boolean(generalId), `status=${r.status}`);

  r = await api("/discussions/mine", { token: resTok });
  const mine = r.json?.data?.threads ?? r.json?.threads ?? [];
  ok("my discussions include scoped thread", r.status === 200 && mine.some((t) => t.id === threadId), `status=${r.status}`);

  r = await api("/discussions", { token: resTok });
  const all = r.json?.data?.threads ?? r.json?.threads ?? [];
  ok("scoped threads visible in all-discussions", r.status === 200 && all.some((t) => t.id === threadId), `status=${r.status}`);
  ok("general threads scoped to creator (pro's not visible)", !all.some((t) => t.id === generalId));

  r = await api(`/discussions/${threadId}/pin`, { method: "PATCH", token: proTok });
  ok("foreign user cannot pin (403)", r.status === 403, `status=${r.status}`);
  r = await api(`/discussions/${threadId}/pin`, { method: "PATCH", token: resTok });
  ok("owner pins thread", r.status === 200 && r.json?.data?.isPinned === true, `status=${r.status}`);
  r = await api(`/discussions/${threadId}/resolve`, { method: "PATCH", token: resTok });
  ok("owner resolves thread", r.status === 200 && r.json?.data?.isResolved === true, `status=${r.status}`);

  r = await api("/discussions/messages", {
    method: "POST", token: resTok,
    body: { threadId, content: "E2E reply message" },
  });
  ok("add message to thread", r.status === 201, `status=${r.status}`);
  r = await api(`/discussions/${threadId}`, { token: resTok });
  const threadDetail = r.json?.data?.thread ?? r.json?.data;
  ok("thread detail includes message", r.status === 200 && (threadDetail?._count?.messages ?? threadDetail?.messages?.length ?? 0) >= 1, `status=${r.status}`);
  r = await api(`/discussions/${threadId}`, { method: "DELETE", token: proTok });
  ok("foreign user cannot delete (403/404)", r.status === 403 || r.status === 404, `status=${r.status}`);
  r = await api(`/discussions/${threadId}`, { method: "DELETE", token: resTok });
  ok("owner deletes thread", r.status === 200, `status=${r.status}`);

  // ---------- Annotations ----------
  r = await api("/annotations", {
    method: "POST", token: resTok,
    body: {
      paperId: paperA,
      type: "HIGHLIGHT",
      anchor: { page: 1, coordinates: { x: 10, y: 10, width: 50, height: 12 }, selectedText: "Hello Scholar Flow E2E" },
      text: "E2E annotation",
      color: "#FFD700",
    },
  });
  const annId = r.json?.data?.annotation?.id ?? r.json?.data?.id;
  ok("create annotation", (r.status === 200 || r.status === 201) && Boolean(annId), `status=${r.status}`);

  r = await api(`/annotations/paper/${paperA}`, { token: resTok });
  const anns = r.json?.data ?? [];
  ok("paper annotations include ours", r.status === 200 && anns.some((a) => a.id === annId), `status=${r.status}`);

  r = await api(`/annotations/${annId}/reply`, { method: "POST", token: resTok, body: { text: "E2E annotation reply" } });
  ok("reply to annotation", r.status === 200 || r.status === 201, `status=${r.status}`);

  r = await api(`/annotations/${annId}/versions`, { token: resTok });
  ok("annotation versions list", r.status === 200, `status=${r.status}`);

  r = await api(`/annotations/${annId}`, { method: "PUT", token: resTok, body: { text: "E2E annotation updated", color: "#00BFFF" } });
  ok("update annotation", r.status === 200, `status=${r.status}`);

  r = await api(`/annotations/${annId}`, { method: "DELETE", token: resTok });
  ok("delete annotation", r.status === 200, `status=${r.status}`);

  // ---------- Citations ----------
  r = await api("/citations/insert", {
    method: "POST", token: resTok,
    body: { sourcePaperId: paperA, targetPaperId: paperB, context: "E2E citation link" },
  });
  ok("insert citation A->B", r.status === 200 || r.status === 201, `status=${r.status}`);

  r = await api(`/citations/paper/${paperA}`, { token: resTok });
  const cites = r.json?.data ?? [];
  ok("paper citations include B (graph data)", r.status === 200 && cites.some((c) => c.targetPaper?.id === paperB), `status=${r.status}`);

  r = await api("/citations/export", {
    method: "POST", token: resTok,
    body: { paperIds: [paperA], format: "APA", includeAbstract: false, includeKeywords: false },
  });
  ok("export citations (APA)", (r.status === 200 || r.status === 201) && r.json?.data?.count >= 1, `status=${r.status}`);

  r = await api("/citations/history", { token: resTok });
  const hist = r.json?.data?.exports ?? [];
  const exportId = hist.find((e) => e.format === "APA")?.id;
  ok("history includes export", r.status === 200 && Boolean(exportId), `status=${r.status} n=${hist.length}`);

  if (exportId) {
    r = await api(`/citations/${exportId}/download`, { token: resTok });
    ok("download export returns content", r.status === 200 && Boolean(r.json?.data?.content), `status=${r.status}`);

    r = await api(`/citations/${exportId}`, { method: "DELETE", token: resTok });
    ok("delete export", r.status === 200, `status=${r.status}`);
  }

  // ---------- Activity Log ----------
  r = await api("/activity-log", { token: resTok, body: undefined, method: "GET" });
  const entries = r.json?.data?.entries ?? r.json?.entries ?? [];
  ok("activity log lists entries", r.status === 200 && Array.isArray(entries) && entries.length > 0, `status=${r.status} n=${entries.length}`);

  r = await api("/activity-log/summary", { token: resTok });
  ok("activity summary has totals", r.status === 200 && typeof r.json?.data?.totalActivities === "number", `status=${r.status}`);

  r = await api(`/activity-log/entity/paper/${paperA}`, { token: resTok });
  ok("entity activity for paper", r.status === 200 && Array.isArray(r.json?.data), `status=${r.status}`);

  r = await api("/activity-log/export?format=csv", { token: resTok });
  ok("activity export csv content", r.status === 200 && typeof r.json?.data?.content === "string" && r.json?.data?.content.length > 0, `status=${r.status}`);

  // ---------- Role matrix (API level) ----------
  r = await api(`/papers?limit=5`, { token: proTok });
  const proPapers = r.json?.data?.items ?? r.json?.items ?? [];
  ok("pro cannot list researcher's papers (scoped)", r.status === 200 && !proPapers.some((p) => p.id === paperA), `status=${r.status}`);

  // ---------- Teardown (self-cleaning) ----------
  r = await api(`/workspaces/${resWs?.id}`, { token: resTok, method: "DELETE" });
  ok("teardown: researcher deletes workspace", r.status === 200, `status=${r.status}`);
  r = await api(`/workspaces/${proWs?.id}`, { token: proTok, method: "DELETE" });
  ok("teardown: pro deletes workspace", r.status === 200, `status=${r.status}`);

  for (const id of [researcherId, proId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { token: adminTok, method: "DELETE" });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_research: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });
