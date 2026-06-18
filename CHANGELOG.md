# Scholar-Flow Release Notes

## Release 1.2.6 — Phase 6: Discussions, Notes & Citations (2026-06-19)

**Release date:** 2026-06-19
**Theme:** Full Phase 6 implementation — `Notebook` / `NotebookSection` schema hierarchy, notebook-aware note metadata, general discussion threads, citation manager with 2 new formats (Vancouver + ACS), 7 new dashboard pages, 3 new RTK slices, and sidebar additions.

---

### ✨ Highlights

- **New `Notebook` + `NotebookSection` schema models** — additive migration; `Notebook` has a `Default` auto-created on first list, `NotebookSection` cascades on notebook delete
- **`NoteType` enum** — `QUICK | LITERATURE | METHODOLOGY | FINDINGS | IDEA` (matches figma ResearchNotesPage type filter)
- **`NoteVisibility` enum** — `PRIVATE | WORKSPACE | PUBLIC` (matches figma visibility pills)
- **`ResearchNote` extended** with nullable `notebookId`, `sectionId`, `noteType`, `visibility`, `isStarred`, `wordCount`, `excerpt`; 5 new composite indexes for notebook/section/type/star lookups; existing `$queryRaw` path kept intact per Query Performance Rules
- **Backend `Notebook` module (13 endpoints)** — `GET/POST/PATCH/DELETE /notebooks`, full sections CRUD, `GET/POST /notebooks/:id/notes`, `PATCH /notebooks/notes/:id/move`; auto-creates a "My Notes" notebook + "General" section on first read
- **Backend discussion enhancements** — `GET /discussions/mine` (union of threads I created + threads in my workspaces, with `scope/search/tags/isPinned/isResolved` filters, pinned-first ordering, lastReply preloaded), `POST /discussions/general` for personal threads, `PATCH /discussions/:id/pin` and `/:id/resolve` toggles (creator-only)
- **Backend citation manager** — `GET /citations/formats` returns all 9 supported formats (added **Vancouver** and **ACS**), `GET /citations/manager` returns user's papers with authors/year/journal extracted from `Paper.metadata` JSON
- **`CitationFormat` enum extended** with `VANCOUVER` and `ACS`; export route zod schema widened
- **3 new RTK Query slices** — `notebookApi` (13 hooks), `discussionApi` (9 hooks), `citationApi` (5 hooks); proper granular cache tags (`Notebook` LIST + per-id, `NotebookSection` scoped per notebook, `Note` scoped per notebook, `Discussion` LIST + per-id, `Citation`, `CitationExport`)
- **7 new dashboard pages matching figma-make exactly:**
  - `/dashboard/discussions` — list with search/status/pinned/tags filter card, inline-expand thread preview, pin/resolve/delete actions, empty state, guidelines block
  - `/dashboard/discussions/new` — RHF-free form (title, content, tags), uses `useCreateGeneralDiscussionMutation`
  - `/dashboard/discussions/[id]` — header with pin/resolve toggles, top-level message list, inline reply input with Enter-to-send
  - `/dashboard/notes` — 3-pane notebook (Notebooks | Notes List | Editor/Preview) with type-filter chips, star toggle, AI summary panel (disabled, ready for Phase 8)
  - `/dashboard/notes/new` — full form (title, content, notebook/section pickers, type, visibility, tags)
  - `/dashboard/notes/[id]` — read-only single-note view with "Open in editor" link
  - `/dashboard/citations` — tabs for Papers / Graph / History; format grid (8 formats), paper selection list with checkboxes + search, live preview, AI Citation Finder card (PRO-gated, Phase 8), static SVG citation graph (PRO-gated; `// TODO Phase 8` to wire to `Citation` model), export history with delete
- **Sidebar additions** — `Discussions` and `Notes` top-level groups (min role `RESEARCHER`); `Research > Citations` path updated from `/dashboard/research/citations` to `/dashboard/citations`
- **Plain-text editor** for notes (matches figma); TipTap integration deferred to Phase 9 per locked-in plan

### 🔧 Backend

- 2 additive Prisma migrations:
  - `20260619000000_phase6_notebook_hierarchy` — creates `Notebook`, `NotebookSection`, `NoteType`, `NoteVisibility`; extends `ResearchNote` with 7 nullable fields + 5 indexes
  - `20260619000100_phase6_citation_formats` — adds `VANCOUVER` and `ACS` to `CitationFormat` enum
- 2 new Zod-based controllers: `notebook.controller.ts`, `notebook.routes.ts`
- `discussion.service.ts` extended: `createGeneralThread`, `getMyDiscussions`, `togglePin`, `toggleResolve`
- `citationExport.service.ts` extended: `formatVancouver`, `formatACS`, `getFormats`, `getManagerView`
- New `GET /citations/formats` and `GET /citations/manager` routes
- `note.controller.ts` extended with `updateMetadata` + `getNoteFull` (Prisma-based, not breaking the existing `$queryRaw` path)

### 🎨 Frontend

- 3 new RTK Query slices: `notebookApi`, `discussionApi`, `citationApi`
- `apiSlice.tagTypes` extended: `Notebook`, `NotebookSection`, `Discussion`, `DiscussionMessage`, `Citation`, `CitationExport`
- 7 new pages (see above), all client components using RTK Query (no raw fetch in components)
- `AppSidebar` updated with new top-level entries

### ✅ Quality Gates

- `yarn type-check` — clean for both apps
- `yarn build` — succeeds for both apps; new routes appear in build output
- `yarn lint` — clean for all Phase 6 files (one pre-existing backend error in `collection.controller.ts` unchanged, 14 pre-existing warnings unchanged)
- `yarn test` — 13 new Notebook validation unit tests pass; 3 pre-existing test failures unchanged (unrelated to Phase 6: `ai-providers-smoke`, `paper.summary.service`, `auth-password-reset`)
- 1 legacy stub removed: `apps/frontend/src/app/dashboard/(modules)/discussions/page.tsx` (pre-Phase 3 stub, no longer referenced)
- `yarn db:generate --sql` clean

### 🔮 Phase 7 / 8 / 9 Hooks Preserved

- SSE notifications on new discussion messages → Phase 7
- Real `Citation` model graph wiring + AI summary / AI Citation Finder enable → Phase 8
- TipTap rich-text editor for notes → Phase 9
- Team-shared notebooks (already supported via `visibility: WORKSPACE`) → Phase 8

---

## Release 1.2.5 — Phase 5: Workspaces & Team (2026-06-19)

**Release date:** 2026-06-19
**Theme:** Full Phase 5 implementation — 8 new dashboard pages, `WorkspaceSettings` schema model, 14-endpoint Team module, role-based middleware, Resend email dispatcher, and 20 legacy route files removed (Phase 3 cleanup debt).

---

### ✨ Highlights

- **8 new pages** matching the figma-make design exactly:
  - `/dashboard/workspaces` — list with gradient cards, mini weekly-activity chart, 5-stat summary, search, All/Owned/Shared tabs
  - `/dashboard/workspaces/create` — standalone form with 5-color theme picker
  - `/dashboard/workspaces/shared` — 3 tabs (Shared With Me / Received Invites / Sent Invites)
  - `/dashboard/workspaces/[id]` — 5 tabs (Overview / Collections / Papers / Members / Settings) + 4 modals (Invite / Edit / CreateCollection / Delete with typed confirmation)
  - `/dashboard/team` — members list, search + role + status filters, action menu (View Profile / Change Role / Manage Workspaces / Remove), invite modal with role + permission description
  - `/dashboard/team/invitations` — 3 stat cards, shareable invite link, 3-way type filter, 5-way status filter, Accept/Decline/Resend/Cancel actions
  - `/dashboard/team/activity` — 4 stat cards (Papers / Comments / Active Members / Activity Score), members sidebar, activity feed with 8+ activity types, time-range filter
  - `/dashboard/team/settings` — 6 tabs (General / Permissions / Notifications / Security / Integrations / Danger Zone) with 24+ toggles, save indicator, delete confirmation modal
  - `/dashboard/team/collaborator/[id]` — public profile with cover image, follow/message/more menu, 3 tabs (Papers / Collections / Activity), copy-to-clipboard email
- **WorkspaceSettings 1:1 model** — color, sharing, member defaults, security, allowed email domains; cascades on workspace delete
- **WorkspaceVisibility enum** — `PRIVATE | INVITE_ONLY | PUBLIC` (denormalized on `Workspace` for fast list rendering)
- **Team module (14 endpoints)** — gated by new `requireTeamLead` middleware; members, stats, activity, invitations (sent/received/cancel/resend), settings
- **Workspace module extensions (6 new endpoints)** — `/settings`, `/activity`, `/stats`, `/papers`, `/collections`; keep `Workspace.color` in sync when settings change
- **Resend email dispatcher (additive)** — all transactional emails now route through `Resend` when `RESEND_API_KEY` is set; falls back to existing Gmail SMTP transporter otherwise. No code changes required to keep using Gmail
- **New `sendTeamInvitationEmail` method** — gradient header HTML, role chip, optional personal message, deep link to `/dashboard/team/invitations`
- **Role-based middleware stack** — `requireRole(role)` factory with `requireTeamLead` / `requireAdmin` convenience wrappers; centralizes RBAC enforcement on the new `teamRoutes` group
- **`AppSidebar` Team submenu** — collapsible group (min role `TEAM_LEAD`) with Members / Invitations / Activity / Team Settings items

---

### 🏗️ Backend

#### Database (additive migration — no destructive ops)
- New `WorkspaceSettings` model: `workspaceId` (unique FK, cascade delete), `color`, `coverImageKey`, `iconKey`, `allowExternalSharing`, `allowDownload`, `defaultMemberRole` (enum), `requireApprovalForJoin`, `allowMemberInvites`, `allowPublicCollections`, `aiFeaturesEnabled`, `enforce2FAForMembers`, `allowedEmailDomains` (string array)
- New `WorkspaceVisibility` enum + denormalized `color` and `visibility` columns on `Workspace` for fast list rendering without settings join
- Backfill: every existing workspace got a default `WorkspaceSettings` row and a default `color = 'blue'` value during the migration
- New composite indexes: `Workspace(isDeleted, visibility)`, `WorkspaceSettings(workspaceId, isDeleted)`
- `TeamActivity` does NOT need a new model — reuses `ActivityLogEntry` with `entity = "team"` (or `entityId = null` for global team events)

#### API endpoints (new, 14 Team + 6 Workspace)
- `GET    /api/team/members` — cursor paginated, filter by `search` / `role` / `status` (TEAM_LEAD+)
- `GET    /api/team/members/:userId` — single member detail (TEAM_LEAD+)
- `PATCH  /api/team/members/:userId` — change role (TEAM_LEAD+)
- `DELETE /api/team/members/:userId` — soft-delete user (ADMIN only)
- `GET    /api/team/stats` — total / active / inactive / pending / paper / collection counts
- `GET    /api/team/activity` — cursor paginated `ActivityLogEntry` feed (entity, memberId, startDate, endDate filters)
- `GET    /api/team/activity/summary` — counts by entity, by severity, recent 10, trends
- `GET    /api/team/invitations/sent` — paginated sent invitations
- `GET    /api/team/invitations/received` — paginated received invitations
- `POST   /api/team/invitations` — send invitation; reuses `WorkspaceInvitation` table; sends email via Resend/Gmail
- `DELETE /api/team/invitations/:id` — cancel pending invitation
- `POST   /api/team/invitations/:id/resend` — re-send invitation email
- `GET    /api/team/settings` — deep-merged with defaults from `UserPreference.metadata.teamSettings`
- `PATCH  /api/team/settings` — partial update by category
- `GET    /api/workspaces/:id/settings` — `WorkspaceSettings` row
- `PATCH  /api/workspaces/:id/settings` — owner-only; syncs `Workspace.color` denormalized column
- `GET    /api/workspaces/:id/stats` — papers, collections, members, storage estimate
- `GET    /api/workspaces/:id/activity` — cursor paginated activity
- `GET    /api/workspaces/:id/papers` — papers in workspace
- `GET    /api/workspaces/:id/collections` — collections in workspace

#### Files
- `apps/backend/src/app/middleware/requireRole.ts` — typed `requireRole` factory + `requireTeamLead` / `requireAdmin` wrappers
- `apps/backend/src/app/modules/Team/{team.controller,team.service,team.routes,team.validation}.ts` — new module
- `apps/backend/src/app/modules/Workspace/workspace.{controller,service,validation,routes}.ts` — extended with 6 new endpoints + settings DTO
- `apps/backend/src/app/shared/emailService.ts` — added `_sendViaResend` (HTTP fetch) + `sendTeamInvitationEmail`; dispatcher branches on `RESEND_API_KEY`
- `apps/backend/src/app/config/index.ts` — `config.resend.{apiKey, fromAddress}` from env
- `apps/backend/src/app/routes/index.ts` — `router.use("/team", teamRoutes)`
- `apps/backend/prisma/schema.prisma` — `WorkspaceSettings` model + `WorkspaceVisibility` enum + denormalized fields
- `apps/backend/prisma/migrations/20260618_phase5_workspace_settings/migration.sql` — additive migration

---

### 🎨 Frontend

#### New RTK Query slice
- `apps/frontend/src/redux/api/teamApi.ts` — 15 endpoints, 1 new tag type (`Team`); fully typed request/response shapes
- `apps/frontend/src/redux/api/workspaceApi.ts` — 6 new endpoints (settings, activity, stats, papers, collections); `WorkspaceColor` / `WorkspaceVisibility` type exports
- `apps/frontend/src/redux/api/apiSlice.ts` — added `"Team"` to `tagTypes`

#### New components
- `components/workspace/WorkspaceCard.tsx` — gradient header, owner badge, 3-stat grid, color picker (5 swatches), `getWorkspaceColor` helper
- `components/team/RoleBadge.tsx` — admin/team-lead/member/viewer badges with role icons
- `components/team/StatusDot.tsx` — active/pending/inactive/invited status indicators with pulse animation

#### Updated
- `components/layout/AppSidebar.tsx` — new `Team` collapsible submenu (Members / Invitations / Activity / Team Settings), `Mail` + `Clock` icons added
- `redux/api/apiSlice.ts` — registered `Team` tag type

#### Build cleanup (debt from Phase 3)
- Removed `apps/frontend/src/app/dashboard/(modules)/workspaces/*` (5 files) — legacy duplicates of `(app)/workspaces/*`
- Removed `apps/frontend/src/app/dashboard/(roles)/{admin,pro-researcher,team-lead}/workspaces/*` (15 files) — 1-line re-exports that were broken when `(modules)` was cleaned
- This was a Phase 3 cleanup debt that the production build had been silently failing on

---

### 🧪 Quality

- `yarn type-check` — passes (both apps)
- `yarn build` — passes (both apps)
- `yarn lint` (backend) — 0 new errors (1 pre-existing error in `collection.controller.ts` line 1763 unchanged)
- `yarn lint` (frontend) — pre-existing env issue with `eslint-config-next` resolution from root `node_modules`, unrelated to this release
- All 8 Phase 5 routes verified in the production build output:
  ```
  /dashboard/workspaces             ○ (Static)
  /dashboard/workspaces/[id]        ƒ (Dynamic)
  /dashboard/workspaces/create      ○ (Static)
  /dashboard/workspaces/shared      ○ (Static)
  /dashboard/team                   ○ (Static)
  /dashboard/team/activity          ○ (Static)
  /dashboard/team/collaborator/[id] ƒ (Dynamic)
  /dashboard/team/invitations       ○ (Static)
  /dashboard/team/settings          ○ (Static)
  ```
- 13 atomic commits pushed to `atik` branch — one per page (or grouping), reviewable independently

---

### 📦 Dependencies

- **No new packages** added at root or in apps
- Resend uses the built-in `fetch` API (no SDK dep)
- All other dependencies unchanged

---

### 🔜 What's next

Phase 6 — Discussions, Notes & Citations (3 pages: list/thread/new, notebook/detail/new, manager/export/history) + `Notebook` and `NotebookSection` models. The backend already has `DiscussionThread` and `DiscussionMessage` from Phase 2 — only the frontend pages and `Notebook` model are needed.

---

## Release 1.2.4 — Prisma v7 Migration & Local Dev DB (2026-06-17)

**Release date:** 2026-06-17
**Theme:** Prisma ORM v7 upgrade, adapter optimization, local PostgreSQL for development, migration drift resolution.

### Changed
- **Prisma ORM v7.8.0** — upgraded from v6.16.3 across all packages (client, adapters, CLI)
- **Adapter:** switched from `@prisma/adapter-ppg` (HTTP-based, 1500-2500ms latency) to `@prisma/adapter-pg` (TCP pooled, <50ms)
- **Query performance:** added slow-query logging (>50ms threshold), cursor pagination on all list endpoints, explicit `select` on nested includes
- **Search:** migrated from `ILIKE '%term%'` to pg_trgm similarity search

### Fixed
- **Migration drift:** 27 migrations now apply cleanly; reconciliation migration for schema drift caused by past `prisma db push` usage
- **Seed script:** updated for Prisma v7 adapter requirement (`PrismaPg` + generated client)
- **Script tag warning:** replaced raw `<script>` with `next/script` (Script component) in root layout

### Infrastructure
- **Local dev database:** PostgreSQL 18 in WSL with pgvector + pg_trgm extensions
- **Environment strategy:** `.env` for local, `.env.production` for cloud
- **Query Insights:** `@prisma/sqlcommenter-query-insights` wired into Prisma singleton

### Schema
- Added `onboardingCompleted`, `onboardingStep` to User
- New tables: `Faq`, `Testimonial`, `NewsletterSubscriber`, `ContactSubmission`, `PageContent`, `UserPreference`
- New enums: `NotificationType`, `ContactSubmissionStatus`; `MAGIC_LINK` added to `TokenType`
- Notification model rebuilt (removed `payload`/`readAt`/`updatedAt`/`isDeleted`, added `title`/`message`/`read`/`starred`/`actionUrl`/`actorId`/`resourceId`)

### Docs
- `AGENTS.md`: Query Performance Rules, Local Development Database, Migration Drift sections
- All documentation updated for Prisma v7 workflow

## Release 1.2.3 — Phase 4: Papers & Collections (2026-06-16)

**Release date:** 2026-06-16
**Theme:** Full Phase 4 implementation — 10 new dashboard pages, schema migration (12 fields, 2 enums), AI recommendations, paper importer, CollectionPaper PATCH.

### New Features
- **Papers dashboard:** list (grid/table), upload (file/DOI/arXiv/URL with processing queue), search (keyword + status filter), editor (create/list), import (BibTeX/RIS parser)
- **Collections dashboard:** list (workspace filter, color cards), create (2-step wizard, visibility, color), detail (grid/list, bulk select, star toggle, invite), shared (pending/sent invites)
- **AI recommendations:** suggested collections, paper suggestions, recommended papers (tag-based fallback)
- **Paper importer:** DOI (CrossRef), arXiv (arXiv API), URL (PDF download), BibTeX/RIS parser, Zotero/Mendeley/EndNote stubs
- **CollectionPaper PATCH:** `PATCH /collections/:id/papers/:pid` for reading status + star toggle

### Schema
- `CollectionVisibility` (PRIVATE/TEAM/PUBLIC), `CollectionPaperStatus` (TO_READ/READING/COMPLETED/ARCHIVED) enums
- Paper: `tags`, `language`, `citationCount`; Collection: `visibility`, `tags`, `coverImage`, `color`; CollectionPaper: `status`, `isStarred`
- GIN indexes on Paper.tags, Collection.tags; composite indexes for visibility/status filtering
- `isPublic` preserved for backward compat; backfill synced `visibility`

### Bug Fixes
- **Duplicate endpoint:** removed `getAllUsers` from `userApi` (conflicted with `adminApi`), migrated DashboardPage import
- **Paper upload:** fixed `tags` array serialization in form data (was `String()` instead of `JSON.stringify()`)

### Cleanup
- Removed 81 legacy files: `(modules)/papers/`, `(modules)/collections/`, all role-segmented re-exports (`(roles)/admin/`, `(roles)/pro-researcher/`, `(roles)/researcher/`)
- `proxy.ts` already redirects legacy role URLs → canonical `/dashboard/*` paths

### Deferred
- AI insights sidebar, annotation toolbar, export UI → Phase 8
- Semantic search (pgvector) → Phase 8
- Global multi-paper AI assistant → Phase 8

---

## Release 1.2.2 — Patch: Auth reliability + admin sidebar unification (2026-06-16)

**Release date:** 2026-06-16
**Theme:** Patch release. No new features. Two production-impacting bugs fixed: (1) OAuth account switching lost user state and produced 401s from stale Redux-Persist, (2) every OAuth login reset the user's uploaded profile picture to the provider's avatar.

---

### 🐛 Critical bug fixes

#### 1. OAuth account switching — stale Redux-Persist caused 401s and wrong user shown

**Symptom:** After signing out of Google Account A and signing in with Google Account B, the dashboard showed a stale/generic user and the backend logged `Auth Middleware - Authorization header: undefined` followed by `GLOBAL ERROR HANDLER CAUGHT: 'Unauthorized access'`. Switching accounts appeared to "succeed" (toast shown) but the user data was wrong.

**Root cause:** Three independent issues compounded:
- `clearCredentials` on sign-out cleared in-memory Redux, but redux-persist's localStorage write was scheduled on a microtask that got killed by the subsequent `window.location.replace`. The next page rehydrated stale state.
- The OAuth callback used soft navigation (`router.push` / `router.replace`) which kept the previous React tree mounted. `useGetCurrentUserQuery` and other dashboard queries could fire with the stale (or no) access token.
- `useGetCurrentUserQuery` was gated only by `Boolean(accessToken || isAuthenticated)` — if Redux said `isAuthenticated: true` from a stale persist rehydration but the token was null, it fired a request with no `Authorization` header.

**Fix:**
- `apps/frontend/src/lib/auth/signout.ts` — full rewrite as a 7-step purge: reset RTK cache → `persistor.purge()` → `clearCredentials` → `flushPersistedState()` → `clearAuthCookie` → direct `document.cookie` clear for `better-auth.session_token` (and related) → best-effort `DELETE /api/auth/session/delete` (with 2s `AbortController` timeout) → `window.location.href` (hard nav).
- `apps/frontend/src/redux/storeAccess.ts` — added `setAppPersistor` / `getPersistor` accessors; `ReduxProvider` now registers the persistor on mount.
- `apps/frontend/src/lib/auth/authHelpers.ts` — both `signInWithCredentials` and `completeOAuthSignIn` now call `await flushAuthState()` (which awaits `persistor.flush()`) BEFORE returning, guaranteeing the new credentials are written to localStorage before the caller navigates.
- `apps/frontend/src/app/auth/callback/{page,google/page,github/page}.tsx` — final `router.push` / `router.replace` on success replaced with `window.location.href` so the next page rehydrates from a freshly-written localStorage.
- `apps/frontend/src/components/providers/AuthProvider.tsx` — `shouldFetchUser` tightened to `Boolean(accessToken && accessToken.length > 0)` (must be a non-empty string, not just truthy `isAuthenticated`). `fetchedUserVersionKey` now includes `email`, so account switches always trigger a `setCredentials` re-sync.
- `apps/frontend/src/redux/api/apiSlice.ts` — added dev-only `console.warn` when a request fires without a token. This is the diagnostic that surfaced the bug; safe to keep (gated on `NODE_ENV !== 'production'`).

**Removed:** The `authClient.signOut()` call from the sign-out flow. It was importing `authClient` from `authClient.ts`, whose transitive imports pulled server-only modules (`better-auth/next-js`, `node:crypto`) into the client bundle, breaking the client/server boundary. Clearing the better-auth cookies directly via `document.cookie` is sufficient and safe.

#### 2. OAuth sign-in reset custom profile picture and name

**Symptom:** A user who uploaded a custom avatar via the profile page (stored in S3) saw it replaced by the OAuth provider's avatar on every subsequent OAuth sign-in. Same bug affected `name`.

**Root cause:** `apps/backend/src/app/modules/Auth/auth.service.ts:createOrUpdateUserWithOAuth` (and the parallel `createOrUpdateUser`) overwrote `name` and `image` on every upsert:

```ts
update: {
  name: userData.name ?? "",
  image: userData.image ?? "",
  emailVerified: new Date(),
}
```

**Fix:**
- `createOrUpdateUserWithOAuth` now reads the existing user's `name` and `image` first, and only fills them in on update if the existing values are empty. `emailVerified` is always refreshed; `role` is preserved as before.
- `createOrUpdateUser` (defense in depth — currently only called by tests, not by any sign-in flow) got the same treatment. Imported `Prisma.UserUpdateInput` for proper typing.

**Behavior matrix:**

| Scenario | Result |
|---|---|
| First OAuth sign-in (new user) | name + image = provider's values |
| Returning user, no custom upload | name + image = provider's values (preserved from first login) |
| Returning user, uploaded custom S3 image | image preserved ✅ |
| Returning user, customized their name | name preserved ✅ |
| Email verification timestamp | Always refreshed on every OAuth login |

---

### 🧪 Quality

- `yarn type-check` — passes (both apps)
- `yarn lint` (backend) — 0 errors
- `yarn lint` (frontend) — pre-existing env issue with `eslint-config-next` resolution from root `node_modules`, unrelated to this release

---

### 🔜 What's next

Phase 4 — Papers & Collections (10-12 pages): paper upload flow, paper list with grid/table view, paper detail with AI insights, collection CRUD, collection sharing.

---

## Release 1.2.1 — Phase 3 of IMPLEMENTATION.md (Dashboard Shell & Core Pages)

**Release date:** June 2026
**Theme:** Consolidate role-segmented dashboard routing, ship new dashboard home + admin pages, and add a user preference data layer.

---

### ✨ Highlights

- **New route group architecture** — consolidated four role-segmented route groups (`(roles)/{researcher,pro-researcher,team-lead,admin}/`) into two clean groups: `(app)/` for all users and `admin/` for admins only. This unlocks natural code-splitting in Next.js 16.
- **Single canonical `DashboardLayout` with `variant` prop** — `variant="app" | "admin"` switches accent color, sidebar contents, and admin badge.
- **Admin role guard** — `<ProtectedRoute requiredRole={USER_ROLES.ADMIN}>` in `admin/layout.tsx`; non-admins get a 403/redirect instead of seeing admin pages.
- **New Dashboard Home** at `/dashboard` with stats cards, quick actions, activity feed, recent papers, and top collections.
- **New admin pages** — Admin Overview, User Management, Subscriptions, System Health, Admin Settings — all at `/dashboard/admin/*`.
- **User preference data layer** — `UserPreference` model + `GET /api/user/preferences`, `PUT /api/user/preferences`, `GET /api/user/activity` endpoints.
- **Backward-compat redirects** in `proxy.ts` for legacy URLs like `/dashboard/researcher/papers` → `/dashboard/papers`.

---

### 🏗️ Backend

#### Database
- Added `UserPreference` model (`id`, `userId` unique, `theme`, `language`, `timezone`, `emailDigest`, `defaultCitationStyle`, `compactMode`, `metadata`, timestamps)
- Added `User.preference` back-relation
- Schema synced via `prisma db push` (Prisma Accelerate environment)

#### API endpoints (new)
- `GET /api/user/preferences` — idempotent; auto-creates default row on first access
- `PUT /api/user/preferences` — Zod-validated; partial update
- `GET /api/user/activity` — paginated `ActivityLogEntry` feed

#### Files
- `apps/backend/prisma/schema.prisma` — new `UserPreference` model
- `apps/backend/src/app/modules/User/user.validation.ts` — `updatePreferencesSchema`
- `apps/backend/src/app/modules/User/user.service.ts` — `getPreferences`, `updatePreferences`, `getActivity`
- `apps/backend/src/app/modules/User/user.controller.ts` — new controller methods
- `apps/backend/src/app/modules/User/user.routes.ts` — new routes + Swagger docs

---

### 🎨 Frontend

#### New route groups
- `apps/frontend/src/app/dashboard/(app)/layout.tsx` — single dashboard layout (route group, no URL change)
- `apps/frontend/src/app/dashboard/(app)/page.tsx` — new Dashboard Home
- `apps/frontend/src/app/dashboard/admin/layout.tsx` — admin-only layout (regular folder, URL = `/dashboard/admin`)
- `apps/frontend/src/app/dashboard/admin/page.tsx` — admin overview
- `apps/frontend/src/app/dashboard/admin/{users,subscriptions,system,settings}/page.tsx` — 4 admin pages

#### Updated components
- `apps/frontend/src/components/layout/DashboardLayout.tsx` — `variant: "app" | "admin"` prop; admin badge in header
- `apps/frontend/src/components/layout/AppSidebar.tsx` — `variant` prop; admin sidebar hides workspace switcher
- `apps/frontend/src/components/workspace/WorkspaceSwitcher.tsx` — accepts `variant` prop
- `apps/frontend/src/lib/auth/roles.ts` — added `getDashboardBasePath(role)`; deprecated `getRoleDashboardBasePath`
- `apps/frontend/proxy.ts` — legacy URL redirects + reduced `protectedRoutes` to `["/dashboard"]`

#### RTK Query
- `useGetPreferencesQuery`, `useUpdatePreferencesMutation`, `useGetActivityQuery` added to `userApi`
- New tag types: `UserPreferences`, `UserActivity`

#### Bug fix
- Patched `next-themes@0.4.6` via idempotent `scripts/patch-next-themes.cjs` + `postinstall` hook to fix React 19/Next.js 16 "Encountered a script tag while rendering React component" error. Source: [shadcn-ui PR #10238](https://github.com/shadcn-ui/ui/pull/10238).

---

### 🧪 Quality

- `yarn type-check` — passes (both apps)
- `yarn build` — passes
- `yarn lint` (backend) — 0 errors, 9 pre-existing warnings
- `yarn lint` (frontend) — pre-existing env issue with `eslint-config-next` resolution from root `node_modules`, unrelated to Phase 3
- `IMPLEMENTATION.md` updated with all Phase 3 items marked `[x]`

---

### 🐛 Edge cases addressed

- **#1** (admin scope): chose 4 IMPLEMENTATION.md pages over 7 figma-make pages for in-scope Phase 3 delivery
- **#7** (admin role guard): `ProtectedRoute requiredRole={USER_ROLES.ADMIN}` in `admin/layout.tsx`
- **#8** (deprecated helpers): `getRoleDashboardBasePath` kept for back-compat with JSDoc `@deprecated`; new `getDashboardBasePath` is canonical
- **#9, #20** (proxy.ts cleanup): role-segment redirect logic removed; `protectedRoutes` reduced to `["/dashboard"]`; legacy URL redirects added
- **#10** (route group collision): avoided by using regular `admin/` folder (not `(admin)/` route group) for admin pages
- **#11** (DashboardPage): kept in `components/DashboardPage.tsx`; new `(app)/page.tsx` is the dedicated home
- **#12** (admin-overview components): moved to `apps/frontend/src/app/dashboard/admin/components/`
- **#13, #14** (onboarding guard): called only in `(app)/layout.tsx`, not duplicated in `admin/layout.tsx`
- **#15** (RTK tag consistency): new tags `UserPreferences`, `UserActivity` added to `apiSlice` tag types

---

### 🔜 What's next

Phase 4 — Papers & Collections (10-12 pages): paper upload flow, paper list with grid/table view, paper detail with AI insights, collection CRUD, collection sharing.

---

## Release 1.2.0 — Phase 2 of IMPLEMENTATION.md (Auth & Onboarding Pages)

### Highlights
- 5 auth pages rewritten with figma-make design (login, register, forgot/reset password, verify email)
- 6-step onboarding flow at `/onboarding`
- 7 new form components (FloatingInput, DatePicker, MultiSelect, ToggleField, SearchInput, SelectField, SliderField)
- `onboardingCompleted` + `onboardingStep` fields added to `User` model
- `PUT /user/onboarding` endpoint
