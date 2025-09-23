## v1.1.0

Release date: 2025-09-24  
Author: @Atik203

### Overview – v1.0.9

- Introduced preview-first Extraction Text experience: users see high-fidelity view/preview for DOCX/PDF
- Added Gotenberg-based DOCX→PDF conversion pipeline (Docker-friendly; EC2-ready)
- Editor is not included in this release; focus is view/preview + robust extraction for search

### Feature Details – v1.1.0

#### Preview & Conversion – v1.1.0

- Server-side DOCX→PDF conversion using Gotenberg for pixel-perfect previews
- Signed preview URL API prefers preview derivative when available; falls back to original
- Frontend renders PDF via iframe/pdf.js and DOCX via preview-first logic with fallbacks

#### Infra Notes – v1.1.0

- Provided docker-compose snippet for local Gotenberg (`gotenberg/gotenberg:8` on port 3008)
- EC2 deployment guidance: run Gotenberg container alongside backend; set `GOTENBERG_URL`

### Status – v1.1.0

#### Completed

- Preview-first view/preview for DOCX/PDF in Extraction Text
- Backend conversion pipeline via Gotenberg; signed preview URLs

#### Deferred

- Rich text editor (TipTap) and content editing API – planned next

### Deployment Notes – v1.1.0

- Set env vars: `DOCX_TO_PDF_ENGINE=gotenberg`, `GOTENBERG_URL=http://<host>:3008`
- Ensure S3 CORS permits GET from frontend origin; signed URLs short-lived
- Backward-compatible with v1.0.9
