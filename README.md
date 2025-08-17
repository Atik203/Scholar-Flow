# Scholar-Flow - AI-Powered Research Paper Collaboration Hub

## 🚀 Project Template Status

**This repository now contains a complete project template!** The firewall issues have been resolved and the Scholar-Flow application template has been successfully created based on the comprehensive specification below.

### What's Included

✅ **Complete Monorepo Structure** with frontend and backend applications  
✅ **Next.js Frontend** with TypeScript, Tailwind CSS, and Auth.js  
✅ **Express Backend** with Prisma, PostgreSQL, and JWT authentication  
✅ **Comprehensive Database Schema** with pgvector support for AI features  
✅ **Development Setup Scripts** and environment configuration  
✅ **Production-Ready Architecture** following the detailed specifications below

### Quick Start

For Windows users:

```bash
# Clone the repository
git clone <repository-url>
cd Scholar-Flow

# Run the Windows setup script
setup.bat

# Or setup manually:
yarn install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# Configure database and start development
yarn db:migrate
yarn dev
```

**See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.**

---

## Original Specification

Updated for Postgres + pgvector, Next.js (App Router) frontend on port 3000, and a separate Node.js + Express backend with Prisma.
This document outlines the architecture, features, and implementation details for Scholar-Flow, a SaaS platform designed to help researchers manage academic papers, collaborate with teams, and leverage AI for enhanced workflows.

## 1) Product Overview

- Name: Scholar-Flow
- Type: SaaS platform for research paper organization, collaboration, and AI assistance
- Audience: Researchers, students, professors, academic teams, institutions
- Goal: Help users upload, manage, annotate, and collaborate on academic papers; power workflows with AI (summaries, semantic search, citation tooling, literature review assistance); provide team workspaces and paid plans.

## 2) System Architecture (Separated Frontend and Backend)

High level

- Frontend Web App (Next.js, Vercel):
  - Next.js App Router (React, TypeScript, Tailwind, ShadCN).
  - Auth handled by Auth.js (NextAuth) with JWT sessions.
  - Calls the backend API with Bearer JWT; uses RTK Query for data fetching.
- Backend API (Node.js, Express, Prisma, Postgres):
  - A dedicated service (Railway/Render/Fly.io). Single source of truth for business logic.
  - Validates Auth.js JWT via shared NEXTAUTH_SECRET (HS256) or JWKS if using asymmetric signing.
  - Exposes REST endpoints for papers, annotations, search, collections, workspaces, billing.
  - Handles payment webhooks (Stripe/SSLCommerz) and writes Payment/Subscription records.
- Worker/Jobs Service (optional but recommended):
  - Handles heavy tasks: file parsing, OCR, chunking, embeddings, AI pipelines.
  - Queue with Redis + BullMQ. Workers consume jobs and persist results via Prisma.
- Database & Storage:
  - Postgres 15+ with pgvector extension; accessed via Prisma.
  - Object storage (S3-compatible) for PDFs and assets; signed URLs from backend.
  - CDN in front of storage for fast delivery.
- Observability & Operations:
  - PostHog/Amplitude for product analytics; OpenTelemetry/logging for API observability.
  - Alerting on queue backlogs, failed webhooks, and AI provider errors.

Data flow highlights

- Upload: Frontend uploads file -> Backend pre-signs S3 URL -> Client uploads -> Backend enqueues “ingest” job -> Worker parses/OCRs -> chunks + embeddings -> records in DB -> UI shows progress.
- Auth: Frontend signs in via Auth.js -> stores JWT -> sends to Backend in Authorization header -> Backend enforces RBAC.
- Billing: Frontend starts checkout -> redirects to provider -> provider posts webhook to Backend -> Backend activates Subscription -> notifies Frontend via polling or SSE/Webhook to client.

## 3) Core Features

A. Paper Management

- Upload PDFs/DOCX/LaTeX, import via DOI/arXiv/OpenAlex/Semantic Scholar.
- OCR for scanned docs (Tesseract); parse text; extract title/authors/abstract via regex + NLP.
- Smart tagging (topics/methods) via OpenAI/HF; short AI summaries.
- Bulk import with progress tracking.

B. Citation & References

- Citation formatting (APA/MLA/IEEE).
- Citation graph visualization; missing-citation suggestions (LLM + similarity).
- Export citations; per-collection bibliography.

C. Semantic Search & Discovery

- Chunked text (500–1,000 tokens, 50–100 overlap), embeddings per chunk (1536 or 3072 dims).
- pgvector with ivfflat index and cosine distance; filters by workspace, year, tags.
- Similar papers recommender; trends via keyword extraction.

D. Collaboration

- Annotations: highlights, comments, notes; threading; version history and revert.
- Collections per workspace with membership; activity logs; sharing controls.
- Real-time comments/annotation updates via WebSocket/SSE.

E. AI Writing Assistance

- Abstract generator, literature review outliner.
- Self-plagiarism check via cosine similarity across user’s papers.

F. Payments & Plans

- Stripe (global), SSLCommerz (BD). Freemium + Pro + Institutional.
- Webhooks update Payments/Subscriptions; customer portal links for Stripe.

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
- Papers
  - POST /papers/upload-url – get pre-signed upload URL
  - POST /papers/import – import by DOI/API providers
  - GET /papers – list/filter; supports semantic=true for vector search
  - GET /papers/:id – detail with metadata
  - DELETE /papers/:id – soft delete
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

## 7) UI/UX – Page-by-Page (Frontend Next.js)

Global Chrome

- Sidebar: Dashboard, Papers, Collections, Upload, Graph, Teams, Billing, Admin
- Header: Global search, notifications, quick actions, profile menu
- Mobile FAB: Upload / New annotation

1. Landing (Marketing)

- Hero CTA, features, pricing, testimonials; analytics events.

1. Auth

- OAuth (Google/ORCID/GitHub) or email magic link; profile completion (name, institution, role).

1. Onboarding

- Upload/import first paper; create workspace and collection; invite teammates; guided tips.

1. Dashboard

- Recent uploads, recommended papers, active collections, notifications; quick actions.

1. Papers Library

- Search bar with keyword/semantic toggle; filters; list/grid; bulk actions (add to collection, export citations).

1. Paper Detail / Reader

- PDF viewer + extracted-text toggle; annotation panel (threaded); AI actions (summarize, cite, paraphrase); versioning and revert.

1. Collections

- List + detail (papers grid, activity, access control); drag-and-drop; invites; export.

1. Semantic Search / Discovery

- Ranked results with similarity score; snippet previews; similar-papers panel; trends.

1. Citation Graph

- Interactive graph (D3/Cytoscape); cluster/filter; node panel with open/cite actions.

1. Upload / Import

- Drag-drop; OCR toggle; import by DOI/URL or providers; background job status.

1. Annotation History

- Version timeline; side-by-side diff; restore.

1. Team / Workspace

- Workspace list and details; members and roles; invites; activity log.

1. Billing

- Plan status; upgrade/checkout; payment history; invoices; customer portal link.

1. Admin

- User management; payments analytics (MRR, churn); system logs; API keys & quotas.

1. Settings / Profile

- Profile, security, integrations (ORCID, Scholar), BYO OpenAI key, data export/delete.

1. Help / Docs

- FAQs, tutorials, support tickets; in-app tooltips.

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

## 12) Next Steps

- Implement Auth.js JWT strategy; add backend middleware to validate tokens and attach user context.
- Build upload flow with S3 pre-signed URLs and background ingest job.
- Implement vector search queries using pgvector + raw SQL; add ivfflat index.
- Wire Stripe/SSLCommerz checkout and webhooks; create Subscription/Payment write paths.
- Harden RBAC at workspace and collection boundaries; add activity logging for sensitive flows.
