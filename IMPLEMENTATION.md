# Scholar-Flow Implementation Roadmap

**Architecture:** `/dashboard/(app)/*` for all roles, `/dashboard/(admin)/*` for admins.
**Design system:** All dashboard pages must match `figma-make/pages/dashboard/**` exactly.
**Animation:** `motion` (v12.40.0) installed at root.
**DB policy:** Prefer Prisma ORM for new code; keep existing `$queryRaw` as-is.

---

## Phase 1: Static Marketing Pages ✅
18-20 pages: homepage sections, products (4), resources (4), company (4), enterprise (4), standalone (3). Backend: Faq/Testimonial/NewsletterSubscriber/ContactSubmission/PageContent models + routes.

## Phase 2: Auth & Onboarding ✅
5 auth pages (login/register/forgot/reset/verify), onboarding flow, 7 form components, onboarding fields on User model.

## Phase 3: Dashboard Shell ✅
Route restructure (`(app)/` + `(admin)/`), DashboardLayout variants, AppSidebar, core pages (dashboard home, profile, settings, admin pages), UserPreference model, user/activity endpoint.

## Phase 4: Papers & Collections ✅
10 pages: papers list/upload/detail/search/import/editor + collections list/create/detail/shared.
Schema: `CollectionVisibility` + `CollectionPaperStatus` enums, `tags`/`language`/`citationCount` on Paper, `visibility`/`tags`/`coverImage`/`color` on Collection, `status`/`isStarred` on CollectionPaper.
Backend: AI recommendations service, paper importer (DOI/arXiv/URL/BibTeX/RIS), CollectionPaper PATCH endpoint. 81 legacy files removed.
Deferred to Phase 8: AI insights sidebar, annotation toolbar, semantic search.

## Phase 5: Workspaces & Team (next)
- [ ] `/dashboard/(app)/workspaces` — list, create, detail, members, settings
- [ ] `/dashboard/(app)/team` — overview, invitations, activity
- [ ] `TeamActivity`, `WorkspaceSettings` models

## Phase 6: Discussions, Notes & Citations
- [ ] `/dashboard/(app)/discussions` — list, thread, new
- [ ] `/dashboard/(app)/notes` — notebook, detail, new
- [ ] `/dashboard/(app)/citations` — manager, export, history
- [ ] `Notebook`, `NotebookSection` models

## Phase 7: Analytics, Notifications & Admin
- [ ] `/dashboard/(app)/analytics`, `/dashboard/(app)/notifications`
- [ ] Admin: analytics, revenue, reports, users, webhooks, moderation
- [ ] `AdminReport`, `SystemAlert` models; SSE notifications

## Phase 8: Advanced Features
- [ ] Global AI assistant, discover/trending, integrations, advanced search
- [ ] `AIConversation`, `SearchQuery`, `Integration`, `EnterpriseLicense` models

## Phase 9: Polish & Performance
Animations, responsive audit, accessibility (WCAG 2.1 AA), Lighthouse 90+, code splitting, tests.

---

## Conventions for All Phases
- `PageProps<'/path'>` for page params (Next.js 16 async)
- React Compiler enabled — no manual `useMemo`/`useCallback`
- RTK Query only (no raw fetch in components)
- S3 presigned URLs (never expose credentials)
- Additive migrations only; never drop pgvector columns
- Stripe webhooks must be idempotent
- All mutations use Zod validation + rate limiting

## Current Status
- **Release:** 1.2.4 (2026-06-17)
- **Completed:** Phase 1-4, Next.js 16 migration, better-auth migration, Prisma v7 migration
- **Current:** Phase 5 — Workspaces & Team
- **Framework:** Next.js 16, React 19.2, Turbopack, Prisma 7.8.0
