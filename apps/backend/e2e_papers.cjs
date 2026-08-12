/* eslint-disable */
/**
 * Phase 5 — paper module E2E against the local backend (:5000).
 * Covers: upload, access matrix (anon 401 / other-user 403 / owner 200),
 * signed URLs, AI endpoints, semantic search, editor versions, annotations.
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const API = "http://localhost:5000/api";
const results = [];
const ok = (name, cond, extra) => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? "PASS" : "FAIL"} | ${name}${extra ? " | " + extra : ""}`);
};

// Minimal valid single-page PDF with byte-accurate xref offsets.
// Text length > 100 chars so poppler passes the scanned-PDF heuristic.
function buildPdf() {
  const line1 =
    "Hello Scholar Flow E2E. This is a research paper used for automated " +
    "testing of the extraction pipeline. It contains enough text to pass " +
    "the scanned document heuristic and verify chunking and embedding. " +
    "The quick brown fox jumps over the lazy dog while researchers index " +
    "their collections with semantic vectors and retrieve them by cosine.";
  const line2 =
    "Second paragraph confirms multi-line extraction works end to end.";
  // 10pt font so ~120 chars fit per line (24pt truncated at ~50 chars)
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
  const env = {};
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)="?(.*?)"?$/.exec(line);
    if (m) env[m[1]] = m[2];
  }

  const api = async (p, { method = "GET", token, body, form } = {}) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    let payload;
    if (form) {
      payload = form;
    } else if (body) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const res = await fetch(`${API}${p}`, { method, headers, body: payload });
    let json = null;
    try { json = await res.json(); } catch {}
    return { status: res.status, json };
  };

  const login = async (email) => {
    const r = await api("/auth/signin", { method: "POST", body: { email, password: "password123" } });
    if (!r.json?.data?.accessToken) {
      console.log(`[login-debug] ${email}: status=${r.status} msg=${r.json?.message ?? JSON.stringify(r.json).slice(0, 120)}`);
    }
    return r.json?.data?.accessToken;
  };

  const adminToken = await login("admin@scholarflow.com");
  const researcherToken = await login("researcher@scholarflow.com");
  const proToken = await login("pro.researcher@scholarflow.com");
  ok("logins work", Boolean(adminToken && researcherToken && proToken));

  // Researcher's own workspace (create one — seed users have none)
  const wsCreate = await api("/workspaces", {
    method: "POST",
    token: researcherToken,
    body: { name: `E2E WS ${Date.now()}` },
  });
  const researcherWs = wsCreate.json?.data?.workspace ?? wsCreate.json?.data;
  ok("researcher workspace created", Boolean(researcherWs?.id), `status=${wsCreate.status} id=${researcherWs?.id}`);

  // Other user's workspace (for cross-workspace upload test)
  const wsPro = await api("/workspaces", {
    method: "POST",
    token: proToken,
    body: { name: `E2E Pro WS ${Date.now()}` },
  });
  const proWs = wsPro.json?.data?.workspace ?? wsPro.json?.data;

  // ============ UPLOAD ============
  const form = new FormData();
  form.append("file", new Blob([PDF_BYTES], { type: "application/pdf" }), "e2e-paper.pdf");
  form.append("workspaceId", researcherWs?.id ?? "");
  form.append("tags", JSON.stringify(["e2e", "test"]));
  const up = await fetch(`${API}/papers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${researcherToken}` },
    body: form,
  });
  const upJson = await up.json().catch(() => ({}));
  const paperId = upJson?.data?.paper?.id;
  ok("upload 201 + paperId", up.status === 201 && Boolean(paperId), `status=${up.status}`);

  // Workspace membership guard
  const form2 = new FormData();
  form2.append("file", new Blob([PDF_BYTES], { type: "application/pdf" }), "x.pdf");
  form2.append("workspaceId", proWs?.id ?? "00000000-0000-0000-0000-000000000000");
  const up2 = await fetch(`${API}/papers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${researcherToken}` },
    body: form2,
  });
  ok("upload to foreign workspace rejected (403)", up2.status === 403, `status=${up2.status}`);

  const up3 = await fetch(`${API}/papers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${researcherToken}` },
    body: (() => {
      const f = new FormData();
      f.append("file", new Blob([PDF_BYTES], { type: "application/pdf" }), "y.pdf");
      return f;
    })(),
  });
  ok("upload without workspaceId rejected (400)", up3.status === 400, `status=${up3.status}`);

  if (!paperId) {
    console.log("\n===== ABORTED: upload failed, remaining checks skipped =====");
    process.exitCode = 1;
    return;
  }

  // ============ ACCESS MATRIX ============
  const anonGet = await api(`/papers/${paperId}`);
  ok("anon read 401", anonGet.status === 401, `status=${anonGet.status}`);

  const tlGet = await api(`/papers/${paperId}`, { token: proToken });
  ok("other-user read 403", tlGet.status === 403, `status=${tlGet.status}`);

  const ownGet = await api(`/papers/${paperId}`, { token: researcherToken });
  ok("owner read 200", ownGet.status === 200, `status=${ownGet.status}`);

  const tlFile = await api(`/papers/${paperId}/file-url`, { token: proToken });
  ok("other-user file-url 403", tlFile.status === 403, `status=${tlFile.status}`);
  const ownFile = await api(`/papers/${paperId}/file-url`, { token: researcherToken });
  ok("owner file-url 200", ownFile.status === 200 && Boolean(ownFile.json?.data?.url));

  const tlPreview = await api(`/papers/${paperId}/preview-url`, { token: proToken });
  ok("other-user preview-url 403", tlPreview.status === 403, `status=${tlPreview.status}`);

  const tlPatch = await api(`/papers/${paperId}`, {
    method: "PATCH",
    token: proToken,
    body: { title: "hacked" },
  });
  ok("other-user PATCH 403", tlPatch.status === 403, `status=${tlPatch.status}`);

  const tlDelete = await api(`/papers/${paperId}`, { method: "DELETE", token: proToken });
  ok("other-user DELETE 403", tlDelete.status === 403, `status=${tlDelete.status}`);

  const tlChunks = await api(`/papers/${paperId}/chunks`, { token: proToken });
  ok("other-user chunks 403", tlChunks.status === 403, `status=${tlChunks.status}`);

  const tlStatus = await api(`/papers/${paperId}/processing-status`, { token: proToken });
  ok("other-user processing-status 403", tlStatus.status === 403, `status=${tlStatus.status}`);

  const tlProcess = await api(`/papers/${paperId}/process`, { method: "POST", token: proToken });
  ok("other-user process 403", tlProcess.status === 403, `status=${tlProcess.status}`);

  const tlSummary = await api(`/papers/${paperId}/summary`, { method: "POST", token: proToken, body: {} });
  ok("other-user AI summary 403", tlSummary.status === 403, `status=${tlSummary.status}`);

  const tlCtx = await api("/ai-context/resolve", {
    method: "POST",
    token: proToken,
    body: { type: "paper", id: paperId },
  });
  const leaked = JSON.stringify(tlCtx.json ?? "").includes("Hello Scholar");
  ok("ai-context blocked for non-member (no leak)", tlCtx.status !== 200 && !leaked, `status=${tlCtx.status}`);

  const ownSummary = await api(`/papers/${paperId}/summary`, { method: "POST", token: researcherToken, body: {} });
  ok("owner AI summary 200", ownSummary.status === 200, `status=${ownSummary.status}`);

  // Annotations
  const anonAnn = await api(`/annotations/paper/${paperId}`);
  ok("anon annotations 401", anonAnn.status === 401, `status=${anonAnn.status}`);
  const tlAnn = await api(`/annotations/paper/${paperId}`, { token: proToken });
  ok("other-user annotations 403", tlAnn.status === 403, `status=${tlAnn.status}`);

  // ============ PROCESSING + SEARCH ============
  const proc = await api(`/papers/${paperId}/process`, { method: "POST", token: researcherToken });
  ok("owner process 200", proc.status === 200, `status=${proc.status}`);

  // Poll processing status
  let finalStatus = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const st = await api(`/papers/${paperId}/processing-status`, { token: researcherToken });
    const s = st.json?.data?.processingStatus;
    if (s === "PROCESSED" || s === "FAILED") { finalStatus = s; break; }
  }
  ok("processing reached terminal state", finalStatus === "PROCESSED" || finalStatus === "FAILED", `status=${finalStatus}`);

  const chunks = await api(`/papers/${paperId}/chunks`, { token: researcherToken });
  ok("chunks endpoint 200", chunks.status === 200, `status=${chunks.status}`);

  // Semantic search (needs OPENAI key + USE_PGVECTOR — both set)
  const sem = await api(`/search/semantic?q=Hello%20Scholar&limit=5`, { token: researcherToken });
  ok("semantic search 200", sem.status === 200, `status=${sem.status} fallback=${sem.json?.data?.fallback ?? "none"}`);

  // ============ EDITOR VERSIONS ACCESS ============
  const edCreate = await api("/editor", {
    method: "POST",
    token: researcherToken,
    body: { title: "E2E editor paper", workspaceId: researcherWs?.id ?? null, content: "<p>draft</p>" },
  });
  const edId =
    edCreate.json?.data?.id ??
    edCreate.json?.data?.paper?.id ??
    edCreate.json?.data?.editorPaper?.id;
  ok("editor paper created", Boolean(edId), `status=${edCreate.status}`);
  if (edId) {
    const tlVersions = await api(`/editor/${edId}/versions`, { token: proToken });
    ok("other-user editor versions 403", tlVersions.status === 403, `status=${tlVersions.status}`);
    const ownVersions = await api(`/editor/${edId}/versions`, { token: researcherToken });
    ok("owner editor versions 200", ownVersions.status === 200, `status=${ownVersions.status}`);
  }

  // ============ CLEANUP ============
  await api(`/papers/${paperId}`, { method: "DELETE", token: researcherToken });
  if (edId) await api(`/editor/${edId}`, { method: "DELETE", token: researcherToken });
  if (researcherWs?.id) await api(`/workspaces/${researcherWs.id}`, { method: "DELETE", token: researcherToken });
  if (proWs?.id) await api(`/workspaces/${proWs.id}`, { method: "DELETE", token: proToken });
  ok("cleanup done", true);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n===== PAPERS E2E: ${results.length - failed.length}/${results.length} passed =====`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  MISSING: ${f.name}`));
    process.exitCode = 1;
  }
})().catch((e) => {
  console.error("E2E ERROR:", e.message);
  process.exit(1);
});
