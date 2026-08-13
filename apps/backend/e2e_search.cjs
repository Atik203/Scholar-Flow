/**
 * Phase - Search + Discover + AI + Notes E2E (self-cleaning)
 *
 * Covers: global search (papers/collections/workspaces/notes/people ACL),
 * auto-recorded search history (server-side fix), history save/list,
 * trending, recommendations, sources, ai-search (soft-fail), semantic
 * search, notebook + section + note CRUD, note metadata/full, anon 401s,
 * cross-user scoping. Unique timestamped users; teardown deletes
 * everything via API.
 *
 * Run: node apps/backend/e2e_search.cjs
 */

const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (name) => `e2e.search.${name}.${TS}@scholarflow.com`;
const UNIQUE_Q = `e2equery${TS}`;

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

// Minimal valid single-page PDF (same builder as other e2e suites)
function buildPdf() {
  const line1 =
    "Hello Scholar Flow Search E2E. This is a research paper used for " +
    "automated testing of the search pipeline and semantic indexing.";
  const line2 = "Second paragraph confirms multi-line extraction works.";
  const stream = `BT /F1 10 Tf 72 720 Td(${line1}) Tj 0 -14 Td(${line2}) Tj ET\n`;
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

const uploadPdf = async (token, workspaceId, filename) => {
  const form = new FormData();
  form.append("file", new Blob([PDF_BYTES], { type: "application/pdf" }), filename);
  form.append("workspaceId", workspaceId);
  form.append("tags", JSON.stringify(["e2e", "search"]));
  const res = await fetch(`${BASE}/papers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, id: json?.data?.paper?.id };
};

(async () => {
  console.log(`\n=== e2e_search (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok));

  // ---------- Setup ----------
  let r = await register("Search User", EMAIL("res"));
  ok("register researcher 201", r.status === 201);
  const resId = r.json?.data?.user?.id;
  r = await register("Search Pro User", EMAIL("pro"));
  ok("register pro 201", r.status === 201);
  const proId = r.json?.data?.user?.id;
  const resTok = await login(EMAIL("res"));
  const proTok = await login(EMAIL("pro"));
  ok("tokens", Boolean(resTok) && Boolean(proTok));

  r = await api("/workspaces", { method: "POST", token: resTok, body: { name: `E2E Search WS ${TS}` } });
  const resWs = r.json?.data?.workspace ?? r.json?.data;
  r = await api("/workspaces", { method: "POST", token: proTok, body: { name: `E2E Search Pro WS ${TS}` } });
  const proWs = r.json?.data?.workspace ?? r.json?.data;
  const upA = await uploadPdf(resTok, resWs?.id, "e2e-search-a.pdf");
  ok("researcher uploads paper", upA.status === 201 && Boolean(upA.id), `status=${upA.status}`);
  const upB = await uploadPdf(proTok, proWs?.id, "e2e-search-b.pdf");
  ok("pro uploads paper", upB.status === 201 && Boolean(upB.id), `status=${upB.status}`);
  if (!upA.id || !upB.id) { console.error("setup failed"); process.exit(1); }

  // ---------- Anon 401 ----------
  r = await api(`/search?q=${UNIQUE_Q}`);
  ok("anon blocked from search (401)", r.status === 401);
  r = await api("/search/history");
  ok("anon blocked from history (401)", r.status === 401);
  r = await api("/search/trending");
  ok("anon blocked from trending (401)", r.status === 401);
  r = await api("/notebooks");
  ok("anon blocked from notebooks (401)", r.status === 401);

  // ---------- Global search ----------
  r = await api(`/search?q=${UNIQUE_Q}&type=all`, { token: resTok });
  const allData = r.json?.data;
  ok("search all 200", r.status === 200, `status=${r.status}`);
  ok("all search has paper group", Boolean(allData?.papers), JSON.stringify(Object.keys(allData || {})));

  // Create a paper with a known title (uploads leave title null until
  // metadata extraction finishes)
  const editorTitle = `EditorPaper${TS}`;
  r = await api("/editor", {
    method: "POST", token: resTok,
    body: { title: editorTitle, workspaceId: resWs?.id, content: "<p>e2e editor body</p>" },
  });
  const edPaperId = r.json?.data?.id ?? r.json?.data?.paper?.id ?? r.json?.data?.editorPaper?.id;
  ok("editor paper created", Boolean(edPaperId), `status=${r.status}`);

  r = await api(`/search?q=${editorTitle}&type=papers`, { token: resTok });
  const papers = r.json?.data?.papers?.items ?? [];
  ok("papers search returns own paper", r.status === 200 && papers.some((p) => p.id === edPaperId), `status=${r.status} n=${papers.length}`);
  ok("search scoped: pro's paper not in results", !papers.some((p) => p.id === upB.id));

  r = await api(`/search?q=${editorTitle}&type=papers`, { token: proTok });
  const proView = r.json?.data?.papers?.items ?? [];
  ok("foreign user cannot find researcher's paper", r.status === 200 && !proView.some((p) => p.id === edPaperId), `status=${r.status}`);

  r = await api(`/search?q=${UNIQUE_Q}&type=people`, { token: resTok });
  ok("people search non-admin -> silent empty", r.status === 200 && (r.json?.data?.people?.total ?? -1) === 0, `status=${r.status}`);
  r = await api(`/search?q=a&type=people`, { token: adminTok });
  ok("people search admin 200", r.status === 200 && r.json?.data?.people !== undefined, `status=${r.status}`);

  // ---------- History (auto-recorded by server) ----------
  r = await api(`/search?q=${UNIQUE_Q}&type=papers`, { token: resTok });
  ok("search 200 for history", r.status === 200);
  r = await api("/search/history?limit=20", { token: resTok });
  const hist = r.json?.data ?? [];
  ok("history auto-recorded query", r.status === 200 && hist.some((h) => h.query === UNIQUE_Q), `status=${r.status} n=${hist.length}`);

  r = await api("/search/history", { method: "POST", token: resTok, body: { query: `manual-${UNIQUE_Q}` } });
  ok("manual history save", r.status === 200 || r.status === 201, `status=${r.status}`);

  // ---------- Discover ----------
  r = await api("/search/trending", { token: resTok });
  ok("trending 200 array", r.status === 200 && Array.isArray(r.json?.data), `status=${r.status}`);
  r = await api("/search/recommendations", { token: resTok });
  ok("recommendations 200 array", r.status === 200 && Array.isArray(r.json?.data), `status=${r.status}`);
  r = await api(`/search/sources?q=Hello`, { token: resTok });
  ok("sources 200 array", r.status === 200 && Array.isArray(r.json?.data?.sources ?? r.json?.sources ?? []), `status=${r.status}`);
  r = await api("/search/ai-search", { method: "POST", token: resTok, body: { q: "Hello", mode: "summarize" } });
  ok("ai-search soft result", r.status === 200 && (r.json?.data?.summary || r.json?.data?.fallback), `status=${r.status}`);
  r = await api(`/search/semantic?q=Hello&limit=5`, { token: resTok });
  ok("semantic search 200", r.status === 200, `status=${r.status}`);
  r = await api("/recommendations/collections/suggested?limit=3", { token: resTok });
  ok("suggested collections 200 array", r.status === 200 && Array.isArray(r.json?.data), `status=${r.status}`);

  // ---------- Notebooks + Notes ----------
  r = await api("/notebooks", { method: "POST", token: resTok, body: { name: `E2E Notebook ${TS}`, color: "blue" } });
  const nbId = r.json?.data?.id;
  ok("create notebook", r.status === 201 && Boolean(nbId), `status=${r.status}`);

  r = await api(`/notebooks/${nbId}/sections`, { method: "POST", token: resTok, body: { name: "E2E Section" } });
  const secId = r.json?.data?.id;
  ok("create section", r.status === 201 && Boolean(secId), `status=${r.status}`);

  r = await api(`/notebooks/${nbId}/notes`, {
    method: "POST", token: resTok,
    body: { title: "E2E Note", content: "Note content for search", sectionId: secId, noteType: "QUICK", visibility: "PRIVATE", tags: ["e2e"] },
  });
  const noteId = r.json?.data?.id;
  ok("create note", r.status === 201 && Boolean(noteId), `status=${r.status}`);

  r = await api(`/notebooks/${nbId}/notes?query=${encodeURIComponent(JSON.stringify({ search: "E2E" }))}`, { token: resTok });
  const notes = r.json?.data ?? [];
  ok("list notes includes ours", r.status === 200 && notes.some((n) => n.id === noteId), `status=${r.status}`);

  r = await api(`/notes/${noteId}/metadata`, { method: "PATCH", token: resTok, body: { isStarred: true, title: "E2E Note Starred" } });
  ok("update note metadata", r.status === 200 && r.json?.data?.isStarred === true, `status=${r.status}`);

  r = await api(`/notes/${noteId}/full`, { token: resTok });
  ok("note full detail", r.status === 200 && r.json?.data?.title === "E2E Note Starred", `status=${r.status}`);

  r = await api(`/search?q=E2E+Note&type=notes`, { token: resTok });
  const noteResults = r.json?.data?.notes?.items ?? [];
  ok("notes search finds note", r.status === 200 && noteResults.some((n) => n.id === noteId), `status=${r.status}`);

  r = await api(`/notebooks/${nbId}`, { method: "DELETE", token: resTok });
  ok("delete notebook", r.status === 200, `status=${r.status}`);

  // ---------- Teardown ----------
  if (edPaperId) {
    r = await api(`/editor/${edPaperId}`, { token: resTok, method: "DELETE" });
    if (r.status !== 200) console.log(`  [cleanup warn] editor paper delete -> ${r.status}`);
  }
  r = await api(`/workspaces/${resWs?.id}`, { token: resTok, method: "DELETE" });
  ok("teardown: researcher workspace deleted", r.status === 200, `status=${r.status}`);
  r = await api(`/workspaces/${proWs?.id}`, { token: proTok, method: "DELETE" });
  ok("teardown: pro workspace deleted", r.status === 200, `status=${r.status}`);
  for (const id of [resId, proId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { token: adminTok, method: "DELETE" });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_search: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("E2E ERROR:", e); process.exit(1); });
