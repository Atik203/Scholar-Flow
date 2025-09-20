## v1.0.9

Release date: 2025-09-21  
Authors: @Atik203, @Salman

### Overview

- PDF & DOCX text extraction completed with unified pipeline
- High‑fidelity DOCX preview via docx-preview (with mammoth fallback)
- Improved PDF preview robustness and error handling
- Enhanced Extracted Text UI: continuous, justified reading mode + dark‑theme filters

### Feature Details – v1.0.9

#### Document Extraction & Preview – v1.0.9

- Unified extraction service for PDF and DOCX with better format preservation
- DOCX preview renders in-app using `docx-preview`; falls back to `mammoth`
- PDF preview uses iframe fallback with improved loading/retry UX
- Extracted Text section now supports continuous, justified layout and copy-all

#### Backend Fixes – v1.0.9

- Awaited `storage.getSignedUrl` in `paper.controller.getFileUrl` to return string URLs
- Standardized API responses with `sendSuccessResponse`

#### Frontend Improvements – v1.0.9

- `DocumentPreview` type detection via MIME + filename/URL heuristics
- Passed `file.contentType` to all preview usages for accurate rendering
- Dark-theme-friendly styling for page filters and controls

### Status – v1.0.9

#### Completed Milestones – v1.0.9

- PDF/DOCX text extraction and in-app preview experience
- Continuous extracted text reading mode with justified layout

#### In Progress – v1.0.9

- AI summarization & semantic search (Phase 1 Week 5)

### Deployment Notes – v1.0.9

- Backward compatible with v1.0.8
- Ensure S3 CORS allows GET from frontend origin for preview fetches
- Signed URLs are short-lived; UI will re-request as needed
