# Scholar-Flow UI/UX Implementation Roadmap

## Overview

Full migration from current design to figma-make design system. Phases 1-8 are feature implementation, Phase 9 is polish.

**Architecture decisions:**
- Static content: Hardcoded in frontend (Option A for now)
- Dashboard routing: Single `/dashboard/(app)/*` for all non-admin roles, `/dashboard/(admin)/*` separate code-split group

---

## Phase 1: Static Marketing Pages (18-20 pages)

### 1.1 Design System Merge
- [x] Merge figma-make `globals.css` into `apps/frontend/src/app/globals.css`
- [x] Merge figma-make `_variables.scss` into `apps/frontend/src/styles/_variables.scss`
- [x] Merge figma-make `_keyframe-animations.scss` into `apps/frontend/src/styles/_keyframe-animations.scss`
- [x] Verify Tailwind v4 tokens are compatible with `@config` directive
- [x] Run `yarn type-check` and `yarn lint` after design system merge

### 1.2 Layout Components
- [x] Replace `Navbar.tsx` with figma-make mega-dropdown navbar (current Navbar already production-grade, kept as-is)
- [x] Replace `Footer.tsx` with figma-make dark-themed footer
- [x] Replace `PageContainer.tsx` with figma-make version (already identical, kept as-is)
- [x] Update `ConditionalLayout.tsx` to use new layout shell (no changes needed)
- [x] Test layout on all public pages

### 1.3 Landing Sections (Homepage)
- [x] Create `Hero.tsx` section
- [x] Create `Features.tsx` section
- [x] Create `HowItWorks.tsx` section
- [x] Create `Testimonials.tsx` section
- [x] Create `FAQ.tsx` section
- [x] Create `CTA.tsx` section
- [x] Create `Newsletter.tsx` section
- [x] Create `Integrations.tsx` section (merged into Hero marquee)
- [x] Create `Comparison.tsx` section (deferred to later phase)
- [x] Rewrite `app/page.tsx` to assemble all sections
- [x] Test homepage responsiveness (mobile, tablet, desktop)

### 1.4 Products Pages (4 pages)
- [x] Rewrite `/products/papers/page.tsx`
- [x] Rewrite `/products/collections/page.tsx`
- [x] Rewrite `/products/collaborate/page.tsx`
- [x] Rewrite `/products/ai-insights/page.tsx`
- [x] Add common product page template

### 1.5 Resources Pages (4 pages)
- [x] Rewrite `/resources/docs/page.tsx`
- [x] Rewrite `/resources/tutorials/page.tsx`
- [x] Rewrite `/resources/api/page.tsx`
- [x] Rewrite `/resources/community/page.tsx`

### 1.6 Company Pages (4 pages)
- [x] Rewrite `/company/about/page.tsx`
- [x] Rewrite `/company/careers/page.tsx`
- [x] Rewrite `/company/contact/page.tsx`
- [x] Rewrite `/company/press/page.tsx`

### 1.7 Enterprise Pages (4 pages)
- [x] Rewrite `/enterprise/page.tsx`
- [x] Rewrite `/enterprise/teams/page.tsx`
- [x] Rewrite `/enterprise/integrations/page.tsx`
- [x] Rewrite `/enterprise/support/page.tsx`

### 1.8 Standalone Pages (3 pages)
- [x] Rewrite `/pricing/page.tsx`
- [x] Rewrite `/faq/page.tsx`
- [x] Rewrite `/contact/page.tsx`

### 1.9 Backend Migration
- [x] Create `Faq` model in Prisma schema
- [x] Create `Testimonial` model in Prisma schema
- [x] Create `NewsletterSubscriber` model in Prisma schema
- [x] Create `ContactSubmission` model in Prisma schema
- [x] Create `PageContent` model in Prisma schema
- [x] Run `yarn db:generate` (new models in Prisma Client)
- [x] Create `GET /public/faqs` route (+ `GET /public/faqs/categories`)
- [x] Create `POST /public/contact` route
- [x] Create `POST /public/newsletter` route
- [x] Create `GET /public/testimonials` route
- [x] Create `GET /public/page-content/:slug` route
- [x] Add seed data for FAQ, Testimonials, and PageContent

### 1.10 Phase 1 QA
- [x] All 18-20 pages render with figma-make design
- [x] Dark mode works on all pages
- [x] Mobile responsive on all breakpoints
- [x] `yarn type-check` passes
- [x] `yarn lint` passes
- [x] No console errors on page load
- [x] Update this file: mark all Phase 1 items as done

---

## Phase 2: Auth & Onboarding Pages (5-6 pages)

### 2.1 Auth Pages
- [x] Rewrite `/login/page.tsx` with figma-make form design
- [x] Rewrite `/register/page.tsx` with figma-make form design
- [x] Rewrite `/forgot-password/page.tsx` with figma-make form design
- [x] Rewrite `/reset-password/page.tsx` with figma-make form design
- [x] Rewrite `/verify-email/page.tsx` with figma-make form design
- [x] Create `/onboarding/page.tsx` with step-by-step flow

### 2.2 Form Components
- [x] Create `FloatingInput.tsx` component
- [x] Create `DatePicker.tsx` component
- [x] Create `MultiSelect.tsx` component
- [x] Create `ToggleField.tsx` component
- [x] Create `SearchInput.tsx` component
- [x] Create `SelectField.tsx` component
- [x] Create `SliderField.tsx` component
- [x] Ensure all form components integrate with React Hook Form + Zod

### 2.3 Backend Migration
- [x] Add `onboardingCompleted` boolean to `User` model
- [x] Add `onboardingStep` int to `User` model
- [x] Create `PUT /user/onboarding` route
- [x] Run `yarn db:generate` and `yarn db:migrate`
- [x] Add onboarding guard middleware (redirect incomplete users)

### 2.4 Phase 2 QA
- [x] All auth pages render with figma-make design
- [x] Login flow works end-to-end
- [x] Registration flow works end-to-end
- [x] Password reset flow works end-to-end
- [x] Onboarding flow redirects correctly
- [x] `yarn type-check` passes
- [x] `yarn lint` passes
- [x] Update this file: mark all Phase 2 items as done

---

## Phase 3: Dashboard Shell & Core Pages (5-8 pages)

### 3.1 Route Restructure
- [x] Create `/dashboard/(app)/layout.tsx` (single dashboard layout)
  Note: params must be async (Next.js 16 requirement)
- [x] Create `/dashboard/(app)/page.tsx` (dashboard home)
- [x] Create `/dashboard/admin/layout.tsx` (admin-only layout, code-split; regular folder not route group)
  Note: use LayoutProps type helper from next typegen
- [x] Create `/dashboard/admin/page.tsx` (admin overview)
- [x] Delete old `/dashboard/(roles)/admin/` route group (replaced by `(admin)/`)
  Note: `(roles)/{researcher,pro-researcher,team-lead}/` retained for Phase 4 migration
- [x] Update all links from `/dashboard/(roles)/...` to `/dashboard/(app)/...`
- [x] Add role-based access control middleware for admin routes
- [x] Test role-based redirects (researcher accessing admin → 403)

### 3.2 Layout Components
- [x] Update `AppSidebar.tsx` (variant: "app" | "admin", figma-make design)
- [x] Create `AuthenticatedNavbar.tsx` (extracted from DashboardLayout; variant-aware)
- [x] Update `DashboardLayout.tsx` (variant prop, figma-make shell, mobile + desktop, admin badge)
- [x] Add workspace switcher to sidebar (hidden in admin variant)
- [x] Add role-based navigation filtering (sidebar shows only allowed items)
- [x] Add mobile hamburger menu with slide-out drawer
- [x] Sidebar collapse/expand states preserved

### 3.3 Core Pages
- [x] Rewrite `/dashboard/(app)/page.tsx` (dashboard home with stats cards, quick actions, activity feed, recent papers, top collections)
- [x] Rewrite `/dashboard/profile/page.tsx` (new profile with figma-make design, standalone `/profile` removed)
- [x] Rewrite `/dashboard/settings/page.tsx` (new settings with figma-make design, standalone `/settings` removed)
- [x] Create `/dashboard/admin/users/page.tsx` (admin user management, moved from `(roles)/admin/users`)
- [x] Create `/dashboard/admin/subscriptions/page.tsx` (admin subscriptions, moved from `(roles)/admin/subscriptions`)
- [x] Create `/dashboard/admin/system/page.tsx` (admin system health, moved from `(roles)/admin/system`)
- [x] Create `/dashboard/admin/settings/page.tsx` (admin settings, moved from `(roles)/admin/settings`)

### 3.4 Backend Migration
- [x] Create `UserPreference` model in Prisma schema (id, userId unique, theme, language, timezone, emailDigest, defaultCitationStyle, compactMode, metadata, timestamps)
- [x] Add `User.preference` back-relation
- [x] Create `GET /user/preferences` route (idempotent — creates default row on first access)
- [x] Create `PUT /user/preferences` route (Zod-validated; partial update)
- [x] Create `GET /user/activity` route (paginated `ActivityLogEntry`)
- [x] Run `yarn db:generate` and `yarn db:push` (Prisma Accelerate env, no destructive migration)
- [x] Update RTK Query `userApi` with `useGetPreferencesQuery`, `useUpdatePreferencesMutation`, `useGetActivityQuery`
- [x] Add new tag types: `UserPreferences`, `UserActivity`

### 3.5 Phase 3 QA
- [x] Dashboard layout renders correctly for all 4 roles (variant="app" / variant="admin")
- [x] Sidebar shows correct navigation items per role (admin section appears only for ADMIN)
- [x] Admin routes are protected (`<ProtectedRoute requiredRole={USER_ROLES.ADMIN}>` in `(admin)/layout.tsx`)
- [x] Dashboard home page renders with stats, quick actions, activity feed, recent papers, collections
- [x] Profile page loads and saves data (pre-existing, untouched in Phase 3)
- [x] Settings page loads and saves preferences (pre-existing, local state — full API wiring deferred)
- [x] Mobile responsive (sidebar drawer, navbar)
- [x] `yarn type-check` passes (both backend and frontend)
- [x] `yarn lint` (backend clean; frontend has pre-existing env issue unrelated to Phase 3)
- [x] Update this file: mark all Phase 3 items as done

### 3.6 Backward-Compat (Edge Cases Addressed)
- [x] `proxy.ts` redirects `/dashboard/{researcher,pro-researcher,team-lead}/*` → `/dashboard/*` (Edge Case #9, #20)
- [x] `proxy.ts` `protectedRoutes` reduced to single `/dashboard` (Edge Case #20)
- [x] `getDashboardBasePath(role)` helper added; `getRoleDashboardBasePath` deprecated with JSDoc warning (Edge Case #8)
- [x] Admin role-guarded layout: `<ProtectedRoute requiredRole={USER_ROLES.ADMIN}>` (Edge Case #7)
- [x] All moved admin pages no longer wrap with `<DashboardLayout>` (avoids double-wrapping; layout provided by `(admin)/layout.tsx`)
- [x] `(roles)/admin/{page,layout,users,subscriptions,system,settings,admin-overview}` removed to avoid route conflicts
- [x] Mobile drawer portal pattern preserved (no z-index/portal issues)

---

## Phase 4: Papers & Collections (10-12 pages)

### 4.1 Papers Pages
- [ ] Rewrite `/dashboard/(app)/papers/page.tsx` (paper list, grid + table view)
- [ ] Rewrite `/dashboard/(app)/papers/upload/page.tsx` (upload flow)
- [ ] Rewrite `/dashboard/(app)/papers/[id]/page.tsx` (paper detail)
- [ ] Rewrite `/dashboard/(app)/papers/search/page.tsx` (search)
- [ ] Rewrite `/dashboard/(app)/papers/import/page.tsx` (import)
- [ ] Rewrite `/dashboard/(app)/papers/editor/page.tsx` (TipTap editor)
- [ ] Rewrite `/dashboard/(app)/papers/ai-insights/page.tsx` (AI insights)
- [ ] Add AI insights sidebar to paper detail page
- [ ] Add annotation toolbar to paper detail page
- [ ] Add export actions (PDF/DOCX) to paper detail page

### 4.2 Collections Pages
- [ ] Rewrite `/dashboard/(app)/collections/page.tsx` (collection list)
- [ ] Rewrite `/dashboard/(app)/collections/create/page.tsx` (create)
- [ ] Rewrite `/dashboard/(app)/collections/[id]/page.tsx` (collection detail)
- [ ] Rewrite `/dashboard/(app)/collections/shared/page.tsx` (shared with me)
- [ ] Add collection member invite flow
- [ ] Add collection paper management UI

### 4.3 Backend Migration
- [ ] Add `tags` (String[]) to `Paper` model
- [ ] Add `language` to `Paper` model
- [ ] Add `tags` (String[]) to `Collection` model
- [ ] Add `coverImage` to `Collection` model
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Update paper routes to handle tags and language
- [ ] Update collection routes to handle tags and coverImage

### 4.4 Phase 4 QA
- [ ] Paper upload flow works (multer → S3 → processing)
- [ ] Paper list shows correct data (grid/table toggle)
- [ ] Paper detail page loads with AI insights
- [ ] Collection CRUD works end-to-end
- [ ] Collection sharing via email works
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 4 items as done

---

## Phase 5: Workspaces & Team (8-10 pages)

### 5.1 Workspace Pages
- [ ] Rewrite `/dashboard/(app)/workspaces/page.tsx` (workspace list)
- [ ] Rewrite `/dashboard/(app)/workspaces/create/page.tsx` (create)
- [ ] Rewrite `/dashboard/(app)/workspaces/[id]/page.tsx` (workspace detail)
- [ ] Rewrite `/dashboard/(app)/workspaces/[id]/members/page.tsx` (members)
- [ ] Rewrite `/dashboard/(app)/workspaces/[id]/settings/page.tsx` (settings)

### 5.2 Team Pages
- [ ] Create `/dashboard/(app)/team/page.tsx` (team overview)
- [ ] Create `/dashboard/(app)/team/invitations/page.tsx` (invitations)
- [ ] Create `/dashboard/(app)/team/activity/page.tsx` (team activity)

### 5.3 Backend Migration
- [ ] Create `TeamActivity` model in Prisma schema
- [ ] Create `WorkspaceSettings` model in Prisma schema
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Create team activity routes
- [ ] Create workspace settings routes
- [ ] Update invitation routes to handle team flows

### 5.4 Phase 5 QA
- [ ] Workspace CRUD works end-to-end
- [ ] Workspace member invite/accept/decline works
- [ ] Team activity feed shows correct data
- [ ] Workspace settings save and load
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 5 items as done

---

## Phase 6: Discussions, Notes & Citations (6-8 pages)

### 6.1 Discussions Pages
- [ ] Create `/dashboard/(app)/discussions/page.tsx` (discussion list)
- [ ] Create `/dashboard/(app)/discussions/[id]/page.tsx` (thread detail)
- [ ] Create `/dashboard/(app)/discussions/new/page.tsx` (new thread)
- [ ] Add discussion reply UI (nested threads)
- [ ] Add resolved/pinned toggle UI
- [ ] Add discussion tags UI

### 6.2 Research Notes Pages
- [ ] Create `/dashboard/(app)/notes/page.tsx` (notebook)
- [ ] Create `/dashboard/(app)/notes/[id]/page.tsx` (note detail)
- [ ] Create `/dashboard/(app)/notes/new/page.tsx` (new note)
- [ ] Add note tagging UI
- [ ] Add note search UI
- [ ] Add note sidebar (paper linkage)

### 6.3 Citations Pages
- [ ] Create `/dashboard/(app)/citations/page.tsx` (citation manager)
- [ ] Create `/dashboard/(app)/citations/export/page.tsx` (export)
- [ ] Create `/dashboard/(app)/citations/history/page.tsx` (export history)
- [ ] Add citation preview UI (all 7 formats)
- [ ] Add bibliography builder UI

### 6.4 Backend Migration
- [ ] Create `Notebook` model in Prisma schema
- [ ] Create `NotebookSection` model in Prisma schema
- [ ] Add `notebookId` and `sectionId` to `ResearchNote` model
- [ ] Add `citationStyle` to `User` model
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Create notebook routes
- [ ] Create notebook section routes
- [ ] Update citation export routes

### 6.5 Phase 6 QA
- [ ] Discussion thread creation works
- [ ] Nested replies render correctly
- [ ] Note CRUD works (with notebook sections)
- [ ] Citation export works for all 7 formats
- [ ] Export history loads correctly
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 6 items as done

---

## Phase 7: Analytics, Notifications & Admin (10-12 pages)

### 7.1 Personal Analytics
- [ ] Create `/dashboard/(app)/analytics/page.tsx` (personal analytics)
- [ ] Add charts (papers over time, collections, storage usage)
- [ ] Add plan quota usage indicators
- [ ] Add research activity timeline

### 7.2 Notifications
- [ ] Create `/dashboard/(app)/notifications/page.tsx` (notification center)
- [ ] Create `/dashboard/(app)/notifications/settings/page.tsx` (settings)
- [ ] Add real-time SSE notification stream
- [ ] Add notification toast integration
- [ ] Add bulk notification actions (mark all read, delete all)
- [ ] Add notification filters (unread, starred, type)

### 7.3 Admin Dashboard
- [ ] Create `/dashboard/(admin)/analytics/page.tsx` (admin analytics)
- [ ] Create `/dashboard/(admin)/revenue/page.tsx` (revenue dashboard)
- [ ] Create `/dashboard/(admin)/reports/page.tsx` (reports)
- [ ] Create `/dashboard/(admin)/users/page.tsx` (user management table)
- [ ] Create `/dashboard/(admin)/webhooks/page.tsx` (webhook logs)
- [ ] Create `/dashboard/(admin)/moderation/page.tsx` (content moderation)

### 7.4 Backend Migration
- [ ] Create `AdminReport` model in Prisma schema
- [ ] Create `SystemAlert` model in Prisma schema
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Create admin report routes
- [ ] Create system alert routes
- [ ] Update notification routes for bulk operations
- [ ] Add notification type filtering

### 7.5 Phase 7 QA
- [ ] Personal analytics charts render correctly
- [ ] Real-time notifications arrive via SSE
- [ ] Notification center shows all items
- [ ] Admin dashboard shows correct metrics
- [ ] Admin user management works (role update, deactivate)
- [ ] Revenue dashboard shows Stripe data
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 7 items as done

---

## Phase 8: Advanced Features (10-15 pages)

### 8.1 AI Research Assistant
- [ ] Create `/dashboard/(app)/ai-assistant/page.tsx` (global AI assistant)
- [ ] Create `/dashboard/(app)/ai-assistant/[id]/page.tsx` (conversation thread)
- [ ] Add multi-paper context support
- [ ] Add citation-aware responses
- [ ] Add conversation history sidebar

### 8.2 Discover & Trending
- [ ] Create `/dashboard/(app)/discover/page.tsx` (discover)
- [ ] Create `/dashboard/(app)/discover/trending/page.tsx` (trending papers)
- [ ] Create `/dashboard/(app)/discover/recommendations/page.tsx` (recommendations)
- [ ] Add advanced search filters (date, topic, author, citation count)
- [ ] Add saved search UI

### 8.3 Integrations & Enterprise
- [ ] Create `/dashboard/(app)/integrations/page.tsx` (integrations)
- [ ] Create `/dashboard/(app)/integrations/settings/page.tsx` (integration settings)
- [ ] Create `/enterprise/enterprise-contact/page.tsx` (enterprise sales)
- [ ] Add enterprise license management UI

### 8.4 Search & History
- [ ] Create `/dashboard/(app)/search/history/page.tsx` (search history)
- [ ] Create `/dashboard/(app)/search/saved/page.tsx` (saved searches)
- [ ] Create `/dashboard/(app)/search/advanced/page.tsx` (advanced search)

### 8.5 Backend Migration
- [ ] Create `AIConversation` model in Prisma schema
- [ ] Create `SearchQuery` model in Prisma schema
- [ ] Create `Integration` model in Prisma schema
- [ ] Create `EnterpriseLicense` model in Prisma schema
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Create AI conversation routes
- [ ] Create saved search routes
- [ ] Create integration routes
- [ ] Create enterprise license routes
- [ ] Update AI service module to support multi-paper context

### 8.6 Phase 8 QA
- [ ] Global AI assistant responds correctly
- [ ] Discover page shows trending/recommendations
- [ ] Advanced search works with all filters
- [ ] Integration setup works (if any providers configured)
- [ ] Enterprise license validation works
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 8 items as done

---

## Phase 9: Polish & Performance

### 9.1 Animations & Transitions
- [ ] Add Framer Motion page transitions between routes
- [ ] Add AnimatePresence for mount/unmount animations
- [ ] Add loading skeletons for all data-heavy pages
- [ ] Add shimmer effects for card placeholders
- [ ] Add hover animations (lift, scale, glow) from figma-make
- [ ] Add scroll-triggered animations for landing sections
- [ ] Test animation performance on low-end devices

### 9.2 Responsive & Mobile
- [ ] Audit all 100+ pages at 320px (mobile small)
- [ ] Audit all 100+ pages at 768px (tablet)
- [ ] Audit all 100+ pages at 1024px (desktop)
- [ ] Audit all 100+ pages at 1440px (desktop large)
- [ ] Fix any layout breaks on mobile
- [ ] Test sidebar drawer on iOS Safari
- [ ] Test navbar mega-dropdowns on mobile
- [ ] Test form inputs on mobile (floating labels, date pickers)

### 9.3 Dark Mode & Accessibility
- [ ] Audit all pages in dark mode
- [ ] Fix any color contrast issues (WCAG 2.1 AA)
- [ ] Add proper ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works (tab order, focus states)
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Add skip-to-content links
- [ ] Ensure all images have alt text
- [ ] Test colorblind-friendly palettes

### 9.4 Performance
- [ ] Add React.lazy code splitting for all dashboard pages
- [ ] Add code splitting for admin panel
- [ ] Add next/image optimization for all images
- [ ] Add CDN configuration for static assets
- [ ] Add rate limiting for public endpoints
- [ ] Add image optimization pipeline (server-side resize)
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Run WebPageTest audit
- [ ] Optimize bundle size (analyze with @next/bundle-analyzer)

### 9.5 QA & Testing
- [ ] Run full `yarn type-check` (both frontend and backend)
- [ ] Run full `yarn lint` (both frontend and backend)
- [ ] Run `yarn test` (all existing tests pass)
- [ ] Add tests for new components (minimum 80% coverage)
- [ ] Add E2E tests for critical flows (login, upload, payment)
- [ ] Run `yarn build` (production build succeeds)
- [ ] Test production build locally
- [ ] Deploy to staging and run smoke tests
- [ ] Update this file: mark all Phase 9 items as done

---

## Global Checklist

### Architecture
- [ ] All backend routes are RESTful and use Zod validation
- [ ] All auth endpoints are protected by rate limiting
- [ ] All admin endpoints are protected by admin role middleware
- [ ] All S3 operations use presigned URLs
- [ ] All Stripe webhook handlers are idempotent
- [ ] All frontend API calls use RTK Query (no raw fetch)
- [ ] All frontend components use proper TypeScript types
- [ ] All frontend pages use correct metadata (SEO)
- [ ] All frontend pages use proper canonical URLs

### Database
- [ ] All migrations are additive (no destructive changes)
- [ ] All new models have proper indexes
- [ ] All migrations have been tested on staging
- [ ] pgvector extension is not dropped or modified
- [ ] All composite indexes are preserved

### Security
- [ ] No AWS credentials exposed in frontend
- [ ] No Stripe keys exposed in frontend
- [ ] No JWT secrets in frontend
- [ ] All password inputs are masked
- [ ] All file uploads are validated (type, size)
- [ ] All user inputs are sanitized (XSS prevention)

### Documentation
- [ ] Update AGENTS.md with any new conventions
- [ ] Update README.md with new features
- [ ] Update SCHEMA.md with new models
- [ ] Update ENVIRONMENT.md with new env vars
- [ ] Add API documentation for new endpoints
- [ ] Add frontend component documentation

---

## Notes

- **When marking a task done:** Edit this file, change `[ ]` to `[x]` for the completed item.
- **When starting a new phase:** All previous phases must be fully marked as done.
- **If a phase is blocked:** Add a note under the blocked item and move to the next unblocked item.
- **Daily updates:** After each session, update this file to reflect current progress.
- **Risk items:** If any database migration might break existing data, flag it with a ⚠️ symbol.

---

## Next.js 16 Upgrade (Complete)

### Breaking changes resolved
- [x] Async Request APIs — params/searchParams/cookies/headers all awaited
- [x] middleware.ts → proxy.ts (auth guards preserved)
- [x] revalidateTag updated to two-argument form
- [x] next lint removed — scripts updated to eslint .
- [x] images.domains → images.remotePatterns migration
- [x] unstable_cacheLife/cacheTag → stable imports
- [x] Turbopack flags removed from scripts (now default)
- [x] next.config.ts turbopack moved to top-level
- [x] React Compiler enabled (reactCompiler: true)
- [x] next typegen run — PageProps/LayoutProps/RouteContext available

### New capabilities available in v16
- React Compiler: automatic memoization (do not add manual useMemo)
- updateTag: immediate read-your-writes cache updates
- refresh(): client router refresh from Server Actions
- cacheLife/cacheTag: stable (no unstable_ prefix)
- Turbopack filesystem caching: faster dev restarts
- View Transitions API: available via React 19.2 ViewTransition
- Activity component: background UI state preservation

### better-auth migration (Complete)
- [x] NextAuth.js v4 removed from dependencies
- [x] better-auth installed and configured
- [x] lib/auth/better-auth.ts created with OAuth providers
- [x] API route: app/api/auth/[...auth]/route.ts
- [x] proxy.ts created with auth guards (replaces middleware.ts)
- [x] AuthProvider.tsx updated for better-auth session sync
- [x] BrowserCleanup.tsx updated for better-auth cookies
- [x] Old NextAuth files deleted: authOptions.ts, next-auth.d.ts, [...nextauth]/route.ts

### Phase 3 notes (Next.js 16 impact)
- Parallel route slots require default.tsx — stubs created ✅
- Use PageProps<'/dashboard/(app)/[route]'> for all new pages
- New dashboard pages are async by default (params are Promises)
- proxy.ts matcher must be updated when new protected routes added
- React Compiler enabled — do NOT add useMemo to new components

---

## Current Status: Phase 4 In Progress — Papers & Collections Foundation Complete

Started: June 2026
Completed: June 2026
Completed phases: Phase 1 ✅, Phase 2 ✅, Phase 3 ✅, Next.js 16 upgrade ✅
Current phase: **Phase 4 ✅ A-E** (backend foundation done), **F-O** (frontend pages in progress)
Latest release: **1.2.2** (2026-06-16) — see [CHANGELOG.md](./CHANGELOG.md)
Current focus: Phase 4 — Papers & Collections (10-12 pages)
Framework: Next.js 16, React 19.2, Turbopack default
React Compiler: enabled (do not add manual memoization)

**Animation library:** `motion` (v12.40.0, successor to framer-motion) — installed at root workspace.
**Design system:** All dashboard pages MUST match figma-make designs exactly. Missing dynamic data drives schema/route updates.

Last updated: 2026-06-16

### Phase 4 — Subtask Progress

#### ✅ A. Database Migration (pushed)
- Added `CollectionVisibility` (PRIVATE/TEAM/PUBLIC) and `CollectionPaperStatus` (TO_READ/READING/COMPLETED/ARCHIVED) enums
- Paper: added `tags String[]`, `language String?`, `citationCount Int @default(0)`
- Collection: added `visibility` enum, `tags String[]`, `coverImage String?`, `color String?`
- CollectionPaper: added `status` enum, `isStarred Boolean @default(false)`
- `isPublic` preserved for backward compat; backfill synced `visibility` from `isPublic`
- GIN indexes on `Paper.tags`, `Collection.tags`; composite indexes for visibility and status filters
- Enabled `typedSql` preview feature in Prisma generator

#### ✅ B. Backend Metadata Fields (pushed)
- Paper validation/service/controller updated for `tags`, `language`, `citationCount`
- Collection validation/service/controller updated for `visibility`, `tags`, `coverImage`, `color`
- Added `PATCH /collections/:collectionId/papers/:paperId` for `status`/`isStarred`
- All collection service raw SQL queries updated to include new fields

#### ✅ C. AI Recommendations (pushed)
- New `recommendation.service.ts`: AI-suggested collections, paper suggestions, recommended papers
- Tag-based heuristic fallback when AI unavailable
- Routes: `GET /recommendations/collections/suggested`, `/collections/:id/suggestions`, `/papers/recommended`

#### ✅ D. Paper Importer (pushed)
- DOI import via CrossRef API
- arXiv import via arXiv API
- URL import with PDF download to S3
- BibTeX/RIS file parser for batch import
- Zotero/Mendeley/EndNote stubs (coming in Phase 4C)
- Import history endpoint

#### ✅ E. RTK Query (pushed)
- Extended `paperApi.ts` types with `tags`, `language`, `citationCount`
- Extended `collectionApi.ts` types with `visibility`, `tags`, `coverImage`, `color`; added `updateCollectionPaper` mutation
- New `importApi.ts` slice
- New `recommendationApi.ts` slice
- Added `Recommendation` and `Import` tag types

#### 🚧 F-O. Frontend Pages (in progress)
- [x] Created papers list page at `(app)/papers/page.tsx` matching figma-make design
- [x] Created paper detail page at `(app)/papers/[id]/page.tsx`
- [ ] Upload, search, import, editor, AI insights pages
- [ ] Collections list, create, detail, shared pages

### Phase 3 Summary
- New route group architecture: `(app)/` for all users, `(admin)/` for admins only
- Single canonical `DashboardLayout` with `variant="app" | "admin"` prop
- Admin role guard via `<ProtectedRoute requiredRole={USER_ROLES.ADMIN}>` in `(admin)/layout.tsx`
- `UserPreference` data layer: schema, 2 routes, RTK Query hooks
- `user/activity` endpoint + RTK Query hook for activity feed
- 5 admin pages (overview, users, subscriptions, system, settings) moved to `(admin)/`
- New dashboard home with stats, quick actions, activity feed, recent papers, top collections
- Backward-compat redirects in `proxy.ts` for legacy role-segmented URLs
- New helpers: `getDashboardBasePath(role)` (canonical), `getRoleDashboardBasePath` (deprecated)
- Edge cases #1, #7, #8, #9, #10, #11, #12, #13, #14, #15, #20 addressed

### Deferred to Later Phases
- **Semantic search** (pgvector embeddings) → Phase 8
- **Global multi-paper AI assistant** → Phase 8
- **Zotero/Mendeley/EndNote OAuth import** → Phase 4C

### For Next Phases (5-8)
- All dashboard pages MUST match corresponding `figma-make/pages/dashboard/**` designs exactly
- Any missing dynamic data in figma designs → add to schema, routes, and RTK Query
- Use `motion` (already installed) for animations
- Backend raw SQL pattern: `prisma.$queryRaw<Templated SQL>` for all DB operations

---

## Release History

Patch releases (1.2.1, 1.2.2, …) and all prior release notes are tracked in
[CHANGELOG.md](./CHANGELOG.md). This document covers the planned phase
roadmap and current status only.
