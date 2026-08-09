# Paper Module — Manual Browser Test Checklist

> Status: API-level E2E green (29/29 checks, `apps/backend/e2e_papers.cjs`) —
> access lockdown, upload, extraction pipeline, semantic search, editor
> versions, annotations. This checklist covers the browser-level walkthrough.
>
> Environment: local dev (frontend :3000, backend :5000). Stripe not needed.

## Prep
1. Backend + frontend running (`yarn dev:backend`, `yarn dev:frontend`).
2. Login as `researcher@scholarflow.com` / `password123` (has a workspace),
   `pro.researcher@scholarflow.com` / `password123`, and an admin.
3. Have a real PDF + a DOCX file handy (2-3 pages each).

---

## 1. Upload (`/dashboard/papers/upload`)
- [ ] File tab: drag & drop a PDF → "Uploading..." → "Uploaded — processing
      queued" (no fake stage timers) → **View** button opens the paper.
- [ ] Success toast only when uploads actually succeed; failed files show
      their error in the queue.
- [ ] Uploading without a workspace → error toast (workspace required).
- [ ] Tags + language fields are sent with the upload.
- [ ] DOI / arXiv / URL / Smart-URL imports still work and navigate to the
      paper.
- [ ] Uploading a file >50MB → rejected (multer cap).

## 2. Paper list (`/dashboard/papers`)
- [ ] Workspace filter shows only workspaces you belong to.
- [ ] Cursor "Load More" pagination works.
- [ ] UPLOADED papers show a Process button; PROCESSING shows progress;
      FAILED shows Retry.

## 3. Paper detail (`/dashboard/papers/[id]`)
- [ ] Processing status polls until PROCESSED (title/metadata appear).
- [ ] **Preview PDF** toggles the iframe; if the signed URL fails the error
      state shows instead of hanging.
- [ ] **Download original** (DOCX) downloads a file (no popup blocker).
- [ ] Edit metadata → save; **Generate with AI** fills title/abstract/tags
      AND persists them to the paper (not only the edit form).
- [ ] AI panels are **independently toggled**: Key Points / AI Summary /
      Insights / AI Tools — each opens alone.
- [ ] AI Summary: tone/audience/focus options; cached vs refreshed badges;
      model shown.
- [ ] Insights: model selector defaults to the first provider-catalog model
      (no hardcoded gemini); send → thread appears; history persists.
- [ ] **AI Tools (new)**: Rewrite (text or paper title, tone), Translate
      (target language), Compare (pick a second paper), Literature Review
      (optional topic) — each returns AI output rendered safely.
- [ ] Delete (confirm dialog) → back to list.
- [ ] Relations + Collaborate links work (collaborate = editor paper only).

## 4. Search (`/dashboard/papers/search`)
- [ ] Query hits the **backend** global search (papers tab): title/author/
      tag/abstract matches, pagination, results from shared workspaces too.
- [ ] Empty/error states render properly.

## 5. Semantic search (dashboard search or `/search/semantic`)
- [ ] A PROCESSED paper with chunks returns semantic hits for related
      queries (OpenAI key + USE_PGVECTOR=true).
- [ ] Workspace members can semantically search shared papers (uploader
      + workspace scope).
- [ ] Papers with no embeddings fall back gracefully (fallback flag), and
      the **hourly backfill sweep** re-embeds them (verify after ~1h or via
      `runEmbeddingBackfill()` directly).

## 6. Annotations (`/dashboard/(modules)/research/annotations`)
- [ ] Open a paper → annotations load (auth required — anon gets 401).
- [ ] Highlight/underline/strikethrough + comments work; versions list works.

## 7. Editor papers (collaborate / `/dashboard/papers/editor`)
- [ ] Create editor paper → auto-save → publish → versions list.
- [ ] Another user cannot read versions or content of your editor paper
      (403) — access is uploader/workspace-member only.

## 8. Access control spot-checks (no login / wrong user)
- [ ] Logged OUT: direct visit to `/dashboard/papers/[id]` → redirected to
      login (401 API).
- [ ] Logged in as a DIFFERENT user: paper detail → 403-style "not found"
      error state; Preview/Download buttons never work for foreign papers.
- [ ] Deleting/editing a foreign paper is impossible from the UI.
- [ ] `/papers/dev/workspace` no longer exists (dev backdoor removed).

---

## Known non-issues / notes
- DOC files upload but extraction marks them FAILED ("DOC not supported —
  convert to DOCX") — by design; the upload UI accepts them, so expect the
  FAILED state for .doc.
- `ai-context/resolve` for an unauthorized paper returns an error without
  leaking content (by design).
- Embedding model is `EMBEDDING_MODEL` env (default text-embedding-3-small,
  1536 dims — changing dimension needs a column migration).
- Semantic search uses cosine `<=>` — matches the HNSW vector_cosine_ops index.

## Sign-off gate
- [ ] All boxes pass.
- [ ] `yarn build`, `yarn lint` (0 errors), `yarn type-check` green.
- [ ] `node apps/backend/e2e_papers.cjs` → 29/29 PASSED.
