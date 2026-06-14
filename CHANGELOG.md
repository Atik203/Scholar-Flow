# Scholar-Flow Release Notes

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
