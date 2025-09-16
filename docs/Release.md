# v1.0.5

Release date: 2025-09-17  
Author: @Atik203

## Highlights

- Production-ready paper management (upload, S3 storage, metadata: title/authors/year)
- Reliable PDF preview via iframe (removed worker errors from react-pdf)
- Modern papers library with working search (title/abstract/authors)
- Advanced Search page with filters and fuzzy search
- Dashboard quick actions and links fixed; improved navigation
- Paper detail page: edit/delete working; authors update fixed

## What’s New

- Papers
  - Upload flow with S3 storage and metadata persistence
  - Paper detail page UI enhancements and robust actions
  - Library list: real-time search and better cards
  - Advanced Search page (filters + fuzzy search)
- Dashboard
  - Quick search and quick actions
  - Correct links to Papers and Advanced Search
- Navigation
  - Sidebar links corrected (/dashboard/papers, /dashboard/papers/search)

## Fixes

- PDF Preview: removed react-pdf worker usage; iframe-only viewer to prevent “fake worker” error
- Authors metadata: default empty array on create; safe merge on update; frontend null-safety
- Papers page search: connected input to list with fuzzy filtering
- Duplicate dashboard implementation removed; lint/format cleanup
- Broken/duplicate actions and icons in dashboard fixed

## Breaking/Notable Changes

- PdfPreview is now iframe-based only (no pdf.js worker configuration)
- Any prior workerSrc setup can be removed from client code

## Upgrade Notes

- After pulling:
  ```bash
  yarn install
  yarn lint && yarn type-check
  # Optional: clear Next cache if UI assets seem stale
  rmdir /s /q "apps\frontend\.next" 2> NUL & mkdir "apps\frontend\.next"
  yarn dev:turbo
  ```
- No env changes required for this release

## Known Issues / Next

- Extract text content from uploaded PDFs: pending (planned Week 4)
- Collections: create/assign flows pending (search/filter and CRUD are in)

## Checklist

- [x] Paper upload + S3 storage
- [x] Metadata (title/authors/year) saved/displayed
- [x] PDF preview stable (iframe)
- [x] Papers list search fixed
- [x] Advanced Search page
- [x] Dashboard links and actions updated
- [x] Authors update working
- [x] Docs updated (.github, .cursor, Roadmap, Changelog)

---

Project: Scholar-Flow • Monorepo (Next.js + Express) • Yarn Berry v4

- AI-powered features (summarization, recommendations) planned for Phase 2.0.0

## Checklist

- [x] Paper upload with S3 integration
- [x] PDF processing and metadata extraction
- [x] Advanced search with filters and full-text
- [x] Production-grade security measures
- [x] Performance monitoring and health checks
- [x] Comprehensive error handling system
- [x] Modern responsive UI/UX
- [x] Type safety improvements
- [x] Documentation updates

---
