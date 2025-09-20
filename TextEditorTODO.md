# ScholarFlow Document Preview & Rich Text Editor Implementation Guide

Below is a focused, senior-level implementation guide and TODO list to preserve formatting by showing the original document (PDF/DOCX) in the Text Extraction section, add robust DOCX→PDF conversion for preview, keep extracted text for search/RAG only, and wire a future MS Word–like editor.

# ScholarFlow — Document Preview & Rich Text Editor Plan

Date: 2025-09-21
Status: Planned (start after Phase 1 collections core is stable)

## Objectives

- Preserve original formatting in the Text Extraction section by rendering the original document (PDF/DOCX) or a high-fidelity preview derivative (PDF).
- Keep extraction running in the background for search/embeddings, but don’t show broken plain text by default.
- Add a TipTap-based editor that edits sanitized HTML (not the binary). Enable future export to DOCX/PDF.
- Follow repo standards: Yarn Berry, Zod validation, ApiError, raw SQL via `prisma.$queryRaw`, rate limiting, performance monitoring, and standardized error responses.

## UX/Flows (high level)

- Upload → Process → View (Preview-first)
  - PDF: Render original via pdf.js/iframe.
  - DOCX: Prefer server-side DOCX→PDF derivative for pixel-perfect preview; while derivative is pending, fallback to client `docx-preview`. Switch automatically when ready.
- Advanced toggle exposes raw extracted text only for debugging.
- “Edit Document” opens a rich text editor bound to `Paper.contentHtml` with autosave.

## Backend (apps/backend)

### 1. Schema & Data Model

- `Paper.previewFileKey` TEXT NULL
- `Paper.previewMimeType` TEXT NULL (e.g., `application/pdf`)
- `Paper.originalMimeType` TEXT NOT NULL (persist from upload)
- `Paper.contentHtml` TEXT NULL (sanitized HTML used by editor)
- `Paper.extractionVersion` INTEGER DEFAULT 1

SQL migration (concept):

```sql
ALTER TABLE "Paper"
	ADD COLUMN IF NOT EXISTS "previewFileKey" TEXT,
	ADD COLUMN IF NOT EXISTS "previewMimeType" TEXT,
	ADD COLUMN IF NOT EXISTS "originalMimeType" TEXT,
	ADD COLUMN IF NOT EXISTS "contentHtml" TEXT,
	ADD COLUMN IF NOT EXISTS "extractionVersion" INTEGER DEFAULT 1;
```

### 2. DOCX→PDF Conversion Service

- Primary: Gotenberg (Docker). Fallback: LibreOffice (`soffice`) headless.
- Function: `convertDocxToPdf(buffer, opts)` with timeouts (2–5 min), size guardrails, and clear errors.
- Env:
  - `DOCX_TO_PDF_ENGINE=gotenberg|soffice`
  - `GOTENBERG_URL=<http://localhost:3008>`

### 3. Queue: Build Preview + Extract Text

- On upload or reprocess:
  - If `originalMimeType` is DOCX/DOC → convert to PDF, upload to `previews/<paperId>.pdf`, set `previewFileKey` + `previewMimeType`.
  - Extract text for search; sanitize HTML if produced; store in `Paper.contentHtml` when appropriate.
  - Set `processingStatus` and capture `processingError` if any. Use `performanceMonitor`.
- Apply feature rate limiters and follow standardized error format.

### 4. Signed Preview URL API

- GET `/papers/:id/preview-url` → `{ url: string; mime: string }`.
- Prefer `previewFileKey` (if exists) else original `fileKey`; 5–10 min expiry; add `Cache-Control: no-store`.
- Keep `/papers/:id/processing-status` non-cacheable during polling.

### 5. Editor Content API

- GET `/papers/:id/content` → returns sanitized HTML.
- PUT `/papers/:id/content` → validates (Zod), sanitizes (`DOMPurify`/`sanitize-html`), updates `Paper.contentHtml` via `$executeRaw`.
- Use `AuthenticatedRequest` types and `catchAsync` + `ApiError`.

### 6. Security & Validation

- Zod for all inputs; sanitize HTML server-side; never log secrets or full HTML content.
- Strict CORS using `FRONTEND_URL`; ensure S3 object ACLs and signed URL scopes are correct.
- Enforce rate limiting on preview-url and content endpoints.

## Frontend (apps/frontend)

### 1. Preview-first Extraction UI

- RTK Query endpoint: `getPaperPreviewUrl(paperId)` → `{ url, mime }` with smart retry and 403 refetch.
- Component `ExtractionViewer`:
  - If `mime` includes `pdf` → render `<PdfViewerFallback src={url} />`.
  - Else if `mime` is DOCX and no preview yet → render `<DocxClientPreview fileUrl={url} />` and poll for preview readiness.
  - Advanced toggle to show legacy raw text chunks.
- Adopt dark theme and accessible focus styles.

### 2. Rich Text Editor

- Component: `RichEditor` (TipTap + StarterKit + Underline + Link + TextAlign + Table). Load `paper.contentHtml`.
- Debounced autosave via `/papers/:id/content` with `useMutationErrorHandler` and `showApiErrorToast`.
- Toolbar with keyboard shortcuts, responsive and dark-friendly.

### 3. Error Handling & Retry

- Use enhanced `apiSlice` retry policies; classify 4xx vs 5xx; auto-retry on network/5xx.
- Never import `toast` directly; use `ToastProvider` helpers.

## Infra

- docker-compose (dev):

```yaml
version: '3.8'
services:
	gotenberg:
		image: gotenberg/gotenberg:8
		ports:
			- '3008:3000'
		environment:
			- LOG_LEVEL=info
		restart: unless-stopped
```

- Add `.env.example` entries in both apps:
  - Backend: `DOCX_TO_PDF_ENGINE`, `GOTENBERG_URL`
  - Frontend: no new vars; reuse base API URL

## Testing & QA

- Backend unit tests: conversion service (mock HTTP/exec), preview-url controller, content API validation.
- Integration: upload DOCX → preview-url returns PDF; upload PDF → preview-url returns original.
- Frontend: render PDF/docx-preview, 403 refetch logic, dark theme snapshot.
- E2E: large tables/lists/headings; verify no crashes and accurate preview.

## Edge Cases

- Very large files → stream to temp, increase timeouts, memory caps.
- Scanned PDFs (no text) → future OCR (Tesseract/Textract) path.
- Expired/403 signed URL → automatic refetch.
- Missing preview derivative → client DOCX fallback.
- Unsupported formats → show message + offer download.

## Acceptance Criteria

- Text Extraction view preserves formatting for PDF/DOCX using original or preview derivative; DOCX prefers preview PDF.
- Raw chunks hidden by default; available behind Advanced toggle.
- Editor saves sanitized HTML with debounce and robust error handling.
- Preview URLs refresh seamlessly on expiry (no user confusion).
- Dark theme and accessibility pass (focus rings, contrast, keyboard nav).

## Rollout Plan

1. Add schema + env + docker-compose for Gotenberg.
2. Implement conversion service + queue integration.
3. Add preview-url endpoint; update processing-status headers.
4. Replace Text Extraction UI with preview-first viewer.
5. Add editor content API + RichEditor component.
6. QA with complex PDFs/DOCX and polish.

## Future Enhancements

- Export edited HTML to DOCX/PDF via server (Gotenberg/LibreOffice) for fidelity.
- Annotations/comments over preview (pdf.js text layer, anchors for DOCX).
- Version history and diff for editor content.
- Generate embeddings from sanitized HTML for better semantic search.

## Immediate Next Steps Checklist

- [ ] Migration: add preview/content columns to `Paper`.
- [ ] Service: `convertDocxToPdf` (Gotenberg + soffice fallback).
- [ ] Worker: generate/upload preview PDF for DOCX; set preview fields.
- [ ] API: `GET /papers/:id/preview-url` (signed URL + mime).
- [ ] API: ensure `/papers/:id/processing-status` has `Cache-Control: no-store`.
- [ ] Frontend: `ExtractionViewer` to render preview-first and handle fallbacks.
- [ ] Frontend: Advanced toggle for raw chunks (default hidden).
- [ ] Frontend: RTK endpoint/hook for preview-url with retry/403 refresh.
- [ ] Infra: docker-compose for Gotenberg + env docs updates.
- [ ] QA: sample complex files; validate acceptance criteria.
