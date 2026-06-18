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

## Phase 5: Workspaces & Team ✅
- [x] `/dashboard/(app)/workspaces` — list, create, detail, members, settings
- [x] `/dashboard/(app)/workspaces/[id]` — Overview / Collections / Papers / Members / Settings tabs
- [x] `/dashboard/(app)/workspaces/create` — standalone create page
- [x] `/dashboard/(app)/workspaces/shared` — 3 tabs (Shared / Received / Sent)
- [x] `/dashboard/(app)/team` — members list with filters, action menu, invite modal
- [x] `/dashboard/(app)/team/invitations` — received + sent invitations, resend/cancel
- [x] `/dashboard/(app)/team/activity` — 4 stat cards, members sidebar, activity feed
- [x] `/dashboard/(app)/team/settings` — 6 tabs (General / Permissions / Notifications / Security / Integrations / Danger Zone)
- [x] `/dashboard/(app)/team/collaborator/[id]` — public profile with cover, stats, follow/message
- [x] `WorkspaceSettings` 1:1 model with color, sharing, member defaults, security fields
- [x] `WorkspaceVisibility` enum (PRIVATE / INVITE_ONLY / PUBLIC)
- [x] Denormalized `Workspace.color` and `Workspace.visibility` for fast list rendering
- [x] `TeamActivity` reuses `ActivityLogEntry` (entity = "team")
- [x] Team backend module — 14 endpoints (members, stats, activity, invitations, settings)
- [x] `requireRole` / `requireTeamLead` / `requireAdmin` middleware (typed)
- [x] Workspace module extensions — 6 new endpoints (settings, activity, stats, papers, collections)
- [x] Resend email dispatcher (additive, Gmail fallback); new `sendTeamInvitationEmail`
- [x] `teamApi` RTK Query slice — 15 endpoints with proper cache tags
- [x] Workspace RTK extension — 6 new endpoints (settings, activity, stats, papers, collections)
- [x] 8 new pages, 7 new components (`WorkspaceCard`, `RoleBadge`, `StatusDot`, etc.)
- [x] `Team` submenu in `AppSidebar` (min role `TEAM_LEAD`)
- [x] Color theme picker (5 swatches: blue/purple/green/orange/pink) backed by `WorkspaceSettings.color`
- [x] 20 legacy route files removed (Phase 3 cleanup debt) — production build now passes for both apps

## Phase 6: Discussions, Notes & Citations ✅
- [x] `/dashboard/(app)/discussions` — list, thread, new
- [x] `/dashboard/(app)/notes` — notebook, detail, new
- [x] `/dashboard/(app)/citations` — manager, export, history
- [x] `Notebook`, `NotebookSection` models
- [x] `NoteType` enum (QUICK / LITERATURE / METHODOLOGY / FINDINGS / IDEA)
- [x] `NoteVisibility` enum (PRIVATE / WORKSPACE / PUBLIC)
- [x] `ResearchNote` extended with `notebookId`, `sectionId`, `noteType`, `visibility`, `isStarred`, `wordCount`, `excerpt` (nullable FKs, additive)
- [x] `CitationFormat` extended with `VANCOUVER` + `ACS` (2 new formats)
- [x] Backend `/notebooks` module (13 endpoints, auto-creates default notebook on first read)
- [x] Backend discussion enhancements: `getMyDiscussions`, `createGeneralThread`, `togglePin`, `toggleResolve`
- [x] Backend citation manager: `getManagerView`, `getFormats`
- [x] 3 new RTK slices: `notebookApi`, `discussionApi`, `citationApi`
- [x] Sidebar: `Discussions` + `Notes` top-level (RESEARCHER); `Research > Citations` path updated to `/dashboard/citations`
- [x] 13 new unit tests (Notebook validation schemas) all pass
- [x] `yarn type-check` + `yarn build` + `yarn lint` clean for Phase 6 files
Deferred to Phase 8: AI summary panel for notes (UI present, disabled), AI Citation Finder, real `Citation` model graph wiring.
Deferred to Phase 9: TipTap rich-text editor (Phase 6 uses plain-text + markdown preview, matches figma).

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
- **Release:** 1.2.6 (2026-06-19)
- **Completed:** Phase 1-6, Next.js 16 migration, better-auth migration, Prisma v7 migration
- **Current:** Phase 7 — Analytics, Notifications & Admin
- **Framework:** Next.js 16, React 19.2, Turbopack, Prisma 7.8.0
