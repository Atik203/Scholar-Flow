/**
 * E2E for the TipTap editor + versions + export surface (self-cleaning).
 * Runs against the SHARED dev/prod database — every user/workspace is
 * created with an e2e.editor.* email and removed in teardown.
 *
 * Covers: workspace-IDOR on create, editor role matrix (EDITOR writes,
 * VIEWER read-only, uploader-only publish), autosave (PATCH — no version)
 * vs manual save (PUT — version snapshot), version restore + edit gate,
 * sanitized public view, PDF/DOCX export headers, image upload limits
 * (413 oversized / 400 bad mime / 200 ok), content-size cap, honest list
 * pagination meta, anon 401s, ownership 404s, ai-chat CRUD.
 */
const BASE = "http://localhost:5000/api";
const TS = Date.now();
const EMAIL = (tag) => `e2e.editor.${tag}.${TS}@scholarflow.com`;
let pass = 0;
let fail = 0;

const ok = (name, cond, info = "") => {
  if (cond) {
    pass++;
    console.log(`  ok  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name} ${info}`);
  }
};

const api = async (path, opts = {}) => {
  const headers = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const isForm = opts.body instanceof FormData;
  if (!isForm) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, {
    method: opts.method || "GET",
    headers,
    body:
      opts.body === undefined
        ? undefined
        : isForm
          ? opts.body
          : JSON.stringify(opts.body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // binary response (PDF/DOCX exports)
  }
  return { status: res.status, json, raw: res };
};

const login = async (email) => {
  const r = await api("/auth/signin", {
    method: "POST",
    body: { email, password: "password123" },
  });
  return r.json?.data?.accessToken || null;
};

const register = async (name, email) => {
  const r = await api("/auth/register", {
    method: "POST",
    body: {
      firstName: name,
      lastName: "E2E",
      email,
      password: "password123",
      role: "RESEARCHER",
    },
  });
  return { status: r.status, json: r.json };
};

// Minimal valid 1x1 PNG
const PNG_1PX = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c626001000000ffff03000006000557bfabd40000000049454e44ae426082",
  "hex"
);

(async () => {
  console.log(`\n=== e2e_editor (${new Date().toISOString()}) ===`);
  const adminTok = await login("admin@scholarflow.com");
  ok("admin login", Boolean(adminTok));

  // ---------- Setup ----------
  const aEmail = EMAIL("a");
  const bEmail = EMAIL("b");
  const oEmail = EMAIL("out");
  let r = await register("Editor Owner", aEmail);
  ok("register owner 201", r.status === 201);
  const aId = r.json?.data?.user?.id;
  const aTok = r.json?.data?.accessToken;

  r = await register("Editor Member", bEmail);
  ok("register member 201", r.status === 201);
  const bId = r.json?.data?.user?.id;
  const bTok = r.json?.data?.accessToken;

  r = await register("Editor Outsider", oEmail);
  ok("register outsider 201", r.status === 201);
  const oId = r.json?.data?.user?.id;
  const oTok = r.json?.data?.accessToken;

  ok("tokens present", Boolean(aTok && bTok && oTok));

  r = await api("/workspaces", {
    token: aTok,
    method: "POST",
    body: { name: `E2E Editor ${TS}` },
  });
  ok("owner creates workspace 201", r.status === 201 && Boolean(r.json?.data?.id));
  const wsId = r.json?.data?.id;

  // ---------- Validation + IDOR ----------
  r = await api("/editor", {
    token: aTok,
    method: "POST",
    body: { title: "No workspace" },
  });
  ok("create without workspaceId rejected (400)", r.status === 400, `status=${r.status}`);

  r = await api("/editor", {
    token: oTok,
    method: "POST",
    body: { workspaceId: wsId, title: "IDOR attempt" },
  });
  ok("IDOR blocked: outsider cannot create in foreign workspace (403)", r.status === 403, `status=${r.status}`);

  r = await api("/editor", {
    token: aTok,
    method: "POST",
    body: { workspaceId: wsId, title: "E2E Editor Paper", content: "<p>v1</p>" },
  });
  ok("create editor paper 201", r.status === 201 && Boolean(r.json?.data?.paper?.id), `status=${r.status}`);
  const paperId = r.json?.data?.paper?.id;

  // ---------- Anon 401 matrix ----------
  for (const [m, p] of [
    ["GET", `/editor/${paperId}`],
    ["PUT", `/editor/${paperId}/content`],
    ["PATCH", `/editor/${paperId}/autosave`],
    ["DELETE", `/editor/${paperId}`],
    ["GET", `/editor/${paperId}/versions`],
    ["GET", `/editor/${paperId}/export/pdf`],
  ]) {
    r = await api(p, { method: m });
    ok(`anon ${m} ${p} (401)`, r.status === 401, `status=${r.status}`);
  }

  // ---------- Ownership ----------
  r = await api(`/editor/${paperId}`, { token: oTok });
  ok("outsider cannot read paper (404)", r.status === 404, `status=${r.status}`);
  r = await api(`/editor/${paperId}/content`, {
    token: oTok,
    method: "PUT",
    body: { content: "<p>hack</p>" },
  });
  ok("outsider cannot write (403)", r.status === 403, `status=${r.status}`);

  // ---------- Role matrix: invite member as EDITOR ----------
  r = await api(`/workspaces/${wsId}/invite`, {
    token: aTok,
    method: "POST",
    body: { email: bEmail, role: "EDITOR" },
  });
  ok("owner invites member as EDITOR (201)", r.status === 201, `status=${r.status}`);
  r = await api(`/workspaces/${wsId}/accept`, { token: bTok, method: "POST" });
  ok("member accepts invite", r.status === 200, `status=${r.status}`);

  r = await api(`/editor/${paperId}/autosave`, {
    token: bTok,
    method: "PATCH",
    body: { content: "<p>v1b autosaved by editor</p>" },
  });
  ok("EDITOR member autosave (200)", r.status === 200, `status=${r.status}`);
  r = await api(`/editor/${paperId}/versions`, { token: aTok });
  ok("autosave created no version (0)", r.status === 200 && (r.json?.data?.versions ?? []).length === 0, `n=${r.json?.data?.versions?.length}`);

  r = await api(`/editor/${paperId}/content`, {
    token: bTok,
    method: "PUT",
    body: { content: "<p>v2 manual by editor</p>" },
  });
  ok("EDITOR member manual save (200)", r.status === 200, `status=${r.status}`);
  r = await api(`/editor/${paperId}/versions`, { token: aTok });
  ok("manual save created version (1)", r.status === 200 && (r.json?.data?.versions ?? []).length === 1, `n=${r.json?.data?.versions?.length}`);
  const verId = r.json?.data?.versions?.[0]?.id;

  // ---------- Version restore + edit gate ----------
  r = await api(`/editor/${paperId}/versions/${verId}/restore`, {
    token: aTok,
    method: "POST",
  });
  ok("owner restores version (200)", r.status === 200, `status=${r.status}`);
  r = await api(`/editor/${paperId}`, { token: aTok });
  ok(
    "content reverted after restore",
    r.json?.data?.contentHtml === "<p>v1b autosaved by editor</p>",
    `got=${r.json?.data?.contentHtml}`
  );

  r = await api(`/editor/${paperId}/versions/${verId}/restore`, {
    token: oTok,
    method: "POST",
  });
  ok("outsider restore blocked (403)", r.status === 403, `status=${r.status}`);

  // ---------- Demote member to VIEWER (write must stop) ----------
  r = await api(`/workspaces/${wsId}/members`, { token: aTok });
  const bMemberRow = (r.json?.data ?? []).find((m) => m.userId === bId);
  ok("member row listed", Boolean(bMemberRow), `status=${r.status}`);
  if (bMemberRow) {
    r = await api(`/workspaces/${wsId}/members/${bMemberRow.id}`, {
      token: aTok,
      method: "PATCH",
      body: { role: "VIEWER" },
    });
    ok("demote member to VIEWER (200)", r.status === 200, `status=${r.status}`);
  }
  r = await api(`/editor/${paperId}/autosave`, {
    token: bTok,
    method: "PATCH",
    body: { content: "<p>viewer write attempt</p>" },
  });
  ok("VIEWER member autosave blocked (403)", r.status === 403, `status=${r.status}`);
  r = await api(`/editor/${paperId}`, { token: bTok });
  ok("VIEWER member can still read (200)", r.status === 200, `status=${r.status}`);

  // ---------- Sanitized publish + public view ----------
  r = await api(`/editor/${paperId}/content`, {
    token: aTok,
    method: "PUT",
    body: {
      title: "E2E Publish",
      content: '<p>safe</p><script>alert(1)</script><img src="x" onerror="alert(1)">',
    },
  });
  ok("owner updates content (200)", r.status === 200, `status=${r.status}`);
  r = await api(`/editor/${paperId}/publish`, {
    token: aTok,
    method: "POST",
    body: { title: "E2E Publish" },
  });
  ok("owner publishes (200)", r.status === 200, `status=${r.status}`);

  r = await api(`/public/editor/${paperId}`);
  ok("public view serves published paper (200)", r.status === 200, `status=${r.status}`);
  const pubContent = r.json?.data?.contentHtml ?? "";
  ok(
    "public content sanitized (no script/onerror)",
    !/<script|onerror/i.test(pubContent),
    `len=${pubContent.length}`
  );

  // Editor member cannot publish (uploader-only)
  r = await api("/editor", {
    token: aTok,
    method: "POST",
    body: { workspaceId: wsId, title: "Draft only" },
  });
  ok("create second paper 201", r.status === 201);
  const draftId = r.json?.data?.paper?.id;
  r = await api(`/public/editor/${draftId}`);
  ok("unpublished draft not public (404)", r.status === 404, `status=${r.status}`);
  r = await api(`/editor/${draftId}/publish`, {
    token: bTok,
    method: "POST",
    body: {},
  });
  ok("VIEWER member cannot publish (404 uploader-only)", r.status === 404, `status=${r.status}`);

  // ---------- Exports ----------
  const pdfRes = await fetch(`http://localhost:5000/api/editor/${paperId}/export/pdf`, {
    headers: { Authorization: `Bearer ${aTok}` },
  });
  const pdfBuf = Buffer.from(await pdfRes.arrayBuffer());
  ok(
    "PDF export returns PDF (200, %PDF header)",
    pdfRes.status === 200 && pdfBuf.subarray(0, 4).toString() === "%PDF",
    `status=${pdfRes.status} head=${pdfBuf.subarray(0, 4).toString()}`
  );

  const docxRes = await fetch(`http://localhost:5000/api/editor/${paperId}/export/docx`, {
    headers: { Authorization: `Bearer ${aTok}` },
  });
  const docxBuf = Buffer.from(await docxRes.arrayBuffer());
  ok(
    "DOCX export returns DOCX (200, PK header)",
    docxRes.status === 200 && docxBuf.subarray(0, 2).toString() === "PK",
    `status=${docxRes.status}`
  );

  // ---------- Image upload limits ----------
  const fd = new FormData();
  fd.append("image", new Blob([PNG_1PX], { type: "image/png" }), "tiny.png");
  r = await api("/editor/upload-image", { token: aTok, method: "POST", body: fd });
  ok("valid image upload (200 + url)", r.status === 200 && Boolean(r.json?.data?.url), `status=${r.status}`);

  const big = Buffer.concat([PNG_1PX, Buffer.alloc(5 * 1024 * 1024 + 64, 0)]);
  const fd2 = new FormData();
  fd2.append("image", new Blob([big], { type: "image/png" }), "big.png");
  r = await api("/editor/upload-image", { token: aTok, method: "POST", body: fd2 });
  ok("oversized image rejected (413)", r.status === 413, `status=${r.status}`);

  const fd3 = new FormData();
  fd3.append("image", new Blob([PNG_1PX], { type: "text/plain" }), "evil.txt");
  r = await api("/editor/upload-image", { token: aTok, method: "POST", body: fd3 });
  ok("bad mime rejected (400)", r.status === 400, `status=${r.status}`);

  // ---------- Content size cap ----------
  r = await api(`/editor/${paperId}/autosave`, {
    token: aTok,
    method: "PATCH",
    body: { content: "x".repeat(2_000_001) },
  });
  ok("oversized content rejected (400)", r.status === 400, `status=${r.status}`);

  // ---------- List pagination meta (honest total) ----------
  r = await api("/editor?limit=2&page=1", { token: aTok });
  ok(
    "list returns honest pagination meta",
    r.status === 200 && r.json?.meta?.total >= 2 && r.json?.meta?.totalPage >= 1,
    `status=${r.status} total=${r.json?.meta?.total} totalPage=${r.json?.meta?.totalPage}`
  );

  // ---------- Ai-chat CRUD (backend behind the optimistic delete) ----------
  r = await api("/ai-chat", {
    token: aTok,
    method: "POST",
    body: { title: "E2E chat", model: "gpt-4o-mini" },
  });
  const convId = r.json?.data?.id ?? r.json?.data?.conversation?.id;
  ok("create conversation (200/201)", (r.status === 201 || r.status === 200) && Boolean(convId), `status=${r.status}`);
  r = await api("/ai-chat", { token: aTok });
  ok(
    "conversation listed",
    r.status === 200 && (r.json?.data?.conversations ?? []).some((c) => c.id === convId),
    `status=${r.status}`
  );
  r = await api(`/ai-chat/${convId}`, { token: aTok });
  ok("conversation detail (200)", r.status === 200 && Array.isArray(r.json?.data?.messages), `status=${r.status}`);
  r = await api(`/ai-chat/${convId}`, { token: aTok, method: "DELETE" });
  ok("conversation deleted", r.status === 200, `status=${r.status}`);
  r = await api("/ai-chat", { token: aTok });
  ok(
    "conversation gone from list",
    r.status === 200 && !(r.json?.data?.conversations ?? []).some((c) => c.id === convId),
    `status=${r.status}`
  );

  // ---------- Teardown ----------
  r = await api(`/workspaces/${wsId}`, { token: aTok, method: "DELETE" });
  if (r.status !== 200) console.log(`  [cleanup warn] workspace delete -> ${r.status}`);
  for (const id of [aId, bId, oId]) {
    if (id) {
      r = await api(`/team/members/${id}`, { token: adminTok, method: "DELETE" });
      if (r.status !== 200) console.log(`  [cleanup warn] user ${id} delete -> ${r.status}`);
    }
  }

  console.log(`\n=== e2e_editor: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error("E2E ERROR:", e);
  process.exit(1);
});
