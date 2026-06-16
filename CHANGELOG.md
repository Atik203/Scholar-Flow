# Scholar-Flow Release Notes

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
