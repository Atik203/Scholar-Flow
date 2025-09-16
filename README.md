# Scholar-Flow

[![Phase](https://img.shields.io/badge/Phase-1%20MVP%20Development-blue)](./Roadmap.md)
[![Auth Status](https://img.shields.io/badge/Authentication-✅%20Complete-green)](./docs/AUTHENTICATION_ROUTING.md)
[![UI Status](https://img.shields.io/badge/UI%20Design-📋%20Documented-orange)](./docs/UI_DESIGN.md)

## AI-Powered Research Paper Collaboration Hub

Smart ingestion, semantic search, structured collaboration, and citation intelligence for researchers & academic teams.

[Roadmap](./Roadmap.md) · [Schema](./SCHEMA.md) · [UI Design Blueprint](./docs/UI_DESIGN.md) · [Environment](./docs/ENVIRONMENT.md)

---

## ✨ Key Capabilities (Phased Delivery)

| Area            | Phase 1 (MVP) ✅                                                   | Phase 2                         | Phase 3                                    |
| --------------- | ------------------------------------------------------------------ | ------------------------------- | ------------------------------------------ |
| Auth & Profiles | ✅ Email/OAuth, JWT, Profile, Personal Info Update, Delete Account | Password reset, roles expansion | Org SSO (future)                           |
| Papers          | Upload, metadata store                                             | OCR & full AI summaries         | Versioning & multi-format ingest           |
| Collections     | Create & list                                                      | Sharing, activity feed          | Advanced permissions & workspace analytics |
| Semantic Search | Flagged (pgvector infra)                                           | Vector search & recommendations | Multi-doc chat assistant                   |
| Annotations     | Placeholder                                                        | Full highlights + realtime      | History diff & export                      |
| Citation Graph  | Deferred                                                           | Interactive graph               | Advanced metrics & clustering              |
| Billing         | Deferred                                                           | Plans integration (Stripe/SSL)  | Usage-based quotas                         |
| Admin           | Deferred                                                           | Basic user mgmt                 | Platform analytics & moderation            |

**✅ Recent Major Completion:** OAuth Authentication System with Google/GitHub, JWT management, comprehensive testing, and User Profile Management System with Personal Information Update and Delete Account features.

Detailed per‑page UX & component plan lives in: **`docs/UI_DESIGN.md`** (kept out of this README to stay concise).

## 🚀 Quick Start

```bash
git clone <repository-url>
cd Scholar-Flow
yarn install
copy apps\backend\.env.example apps\backend\.env        # Windows
copy apps\frontend\.env.local.example apps\frontend\.env.local

yarn db:migrate
yarn dev
```

More: see `DEVELOPMENT.md`.

---

## 🧩 Architecture Snapshot

Monorepo (Yarn Berry + Turbo) with:

- `apps/frontend`: Next.js 15 (App Router, Tailwind, ShadCN, NextAuth, RTK Query)
- `apps/backend`: Express + TypeScript + Prisma (Postgres + pgvector)
- `packages/*`: Shared types / SEO utilities

Workers will process ingestion (OCR, embeddings) via a queue

## 🎯 Product Overview

Scholar-Flow helps researchers and teams:

- Ingest & organize academic papers
- Generate AI summaries & semantic retrieval
- Annotate & collaborate in collections
- Explore citation relationships
- Manage access, billing, and usage

## 🏗️ System Architecture (High Level)

Frontend (Next.js) ↔ Backend (Express/Prisma) ↔ Postgres (pgvector)  
Optional Worker (embeddings/OCR) ← queue (Redis)  
Object storage (S3/R2) for PDFs.  
Feature flags gate unfinished surfaces (see example env files).

## 📦 Core Feature Domains

| Domain                | Highlights (Current / Planned)                                  |
| --------------------- | --------------------------------------------------------------- |
| Paper Ingestion       | Upload, metadata extraction, queued processing (OCR/embeddings) |
| Collections           | Organize papers, future sharing & activity feed                 |
| Semantic Intelligence | pgvector-backed search (flagged until data + embeddings)        |
| Annotations           | Placeholder now → full highlight + realtime threads             |
| Citation Intelligence | Graph + formatting (Phase 2+)                                   |
| AI Assistance         | Summaries, suggestions (progressive rollout)                    |
| Billing & Plans       | Stripe + SSLCommerz integration (Phase 3)                       |
| Admin & Governance    | User management, metrics, moderation (Phase 3)                  |

## 4) Detailed Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind, ShadCN, Framer Motion; Forms with RHF + Zod; State with RTK Query + light UI slice.
- Backend API: Node.js, Express.js, Prisma ORM; Zod for input validation; Helmet, CORS; RBAC middleware by role and workspace membership.
- Workers: Node.js with BullMQ (Redis) for ingest/OCR/embeddings/AI tasks.
- Database: Postgres + Prisma; pgvector for embeddings (stored as Unsupported("vector") in Prisma, queried via raw SQL).
- AI: OpenAI, HuggingFace, LangChain, Tesseract.
- Storage: S3-compatible (R2/S3/MinIO) with signed URLs.
- Payments: Stripe SDK; SSLCommerz (sslcommerz-lts).
- DevOps: Vercel (frontend); Railway/Render/Fly.io (backend + workers); Redis for queues/cache.

## 5) Authentication & Authorization

- Auth.js (NextAuth) on the frontend app; JWT session strategy.
- Backend validates JWT (bearer) with shared secret; extracts userId and role.
- Workspace-based access: WorkspaceMember role gates access to papers/collections inside a workspace.
- Collection-level sharing for granular collaboration.
- Admin users can manage users, payments, and system settings.

## 6) API Surface (Backend Express)

- Auth
  - POST /auth/session/validate (optional ping) – verifies JWT valid/claims
- User Profile Management
  - GET /user/me – get current user profile
  - PUT /user/update-profile – update personal information with validation
  - DELETE /user/delete-account – soft delete account with confirmation
- Papers
  - POST /papers/upload-url – get pre-signed upload URL
  - POST /papers/import – import by DOI/API providers
  - GET /papers – list/filter; supports semantic=true for vector search
  - GET /papers/:id – detail with metadata
  - DELETE /papers/:id – soft delete
  - GET /papers/:id/file-url – short-lived signed URL for PDF preview (frontend uses react-pdf)
- Annotations
  - GET /papers/:id/annotations
  - POST /papers/:id/annotations
  - GET /papers/:id/annotations/versions
  - POST /papers/:id/annotations/versions/revert
- Collections
  - GET /collections
  - POST /collections
  - GET /collections/:id
  - POST /collections/:id/papers
  - POST /collections/:id/invite
- Search & AI
  - POST /search/semantic
  - GET /papers/:id/similar
  - POST /papers/:id/ai/summarize
  - POST /papers/:id/ai/citation-suggestions
- Graph
  - GET /graph/paper/:id
- Workspaces
  - POST /workspaces
  - POST /workspaces/:id/invite
  - PUT /workspaces/:id/members/:userId
  - GET /workspaces/:id/activities
- Billing
  - GET /subscriptions
  - POST /subscriptions/checkout
  - GET /payments
  - POST /payments/ssl/init
  - POST /webhooks/stripe
  - POST /webhooks/sslcommerz
- Admin
  - GET /admin/users
  - PUT /admin/users/:id
  - GET /admin/metrics

Security and cross-cutting

- CORS: allow frontend domain; block others by default.
- CSRF: not required for pure bearer APIs; ensure cookie usage is httpOnly/secure if used.
- Rate limiting: per-IP and per-user; stricter on AI endpoints.
- Input validation: Zod schemas on every route; sanitize filters for search.
- Audit logs and notifications for sensitive actions.

## 🖥️ UI / UX Documentation

**Full UI Design Blueprint:** [`docs/UI_DESIGN.md`](./docs/UI_DESIGN.md)

This document provides:

- Complete screen-by-screen structure and component taxonomy
- Phased UI delivery plan (Phase 1 → Phase 2 → Phase 3)
- Feature flag strategy and accessibility checklist
- Authentication UI patterns and state management
- Component architecture mapping and routing plan

**✅ Phase 1 Authentication UI:** Login, signup, and OAuth flows with comprehensive form validation, error handling, and responsive design.

## 8) Non-Functional Requirements

- Performance: paginate lists; stream large PDFs; index pgvector with ivfflat (cosine).
- Reliability: idempotent payment webhooks; store raw webhook payloads; retries with backoff.
- Background jobs: all heavy tasks (OCR/embeddings) offloaded; job results written back atomically.
- Security: signed URLs for file access; strict RBAC; input validation; secrets management (runtime env).
- Internationalization: i18n-ready; date-fns for formatting.
- Accessibility: keyboard-friendly annotations; ARIA for viewer controls.

## 9) Monetization

- Free: up to 100 papers, basic AI features, no shared collections.
- Pro ($10/mo): unlimited uploads, all AI tools, collaboration, priority queue.
- Institutional: workspace/institution-wide seats and SSO (future).

## 10) Database Schema Reference

The full Prisma data model has been moved to `SCHEMA.md` for clarity.

## 11) Deployment

- Frontend: Vercel project with environment-bound NEXTAUTH_SECRET, NEXT_PUBLIC_API_BASE_URL.
- Backend: Railway/Render/Fly.io container; set DATABASE_URL, JWT/Auth secrets, Stripe/SSL keys, S3 creds.
- Workers: Same platform as backend, separate process using the same codebase (monorepo) or separate repo.
- Migrations: Prisma migrate on backend deploy; maintain seed scripts for local/dev environments.

## ⏭️ Immediate Next Steps (Phase 1)

1. ✅ ~~Finalize Auth + profile endpoints integration~~ **COMPLETED** (Author: Atik)
2. Implement upload → ingest pipeline (with placeholder worker path)
3. Add pgvector migration & embeddings service stub (feature-flagged)
4. Collections basic CRUD + association
5. Prepare semantic search API skeleton (disabled until embeddings exist)

> For extended roadmap see `Roadmap.md`.

---

### 🤝 Contributing

Follow conventional commits, keep PRs small, and align with current phase. See `.cursor/rules` and `docs/UI_DESIGN.md` before adding new UI routes.

### 📄 Licensing

Proprietary – see `LICENSE.md` and `TERMS.md`.

### 📬 Contact

Open an issue or start a discussion for feature proposals. Tag design-related issues with `ui-design`.

---

_Generated & maintained with structured AI assistance. UI details intentionally extracted to keep this README high signal._
