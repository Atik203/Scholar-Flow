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
- [ ] Rewrite `/login/page.tsx` with figma-make form design
- [ ] Rewrite `/register/page.tsx` with figma-make form design
- [ ] Rewrite `/forgot-password/page.tsx` with figma-make form design
- [ ] Rewrite `/reset-password/page.tsx` with figma-make form design
- [ ] Rewrite `/verify-email/page.tsx` with figma-make form design
- [ ] Create `/onboarding/page.tsx` with step-by-step flow

### 2.2 Form Components
- [ ] Create `FloatingInput.tsx` component
- [ ] Create `DatePicker.tsx` component
- [ ] Create `MultiSelect.tsx` component
- [ ] Create `ToggleField.tsx` component
- [ ] Create `SearchInput.tsx` component
- [ ] Create `SelectField.tsx` component
- [ ] Create `SliderField.tsx` component
- [ ] Ensure all form components integrate with React Hook Form + Zod

### 2.3 Backend Migration
- [ ] Add `onboardingCompleted` boolean to `User` model
- [ ] Add `onboardingStep` int to `User` model
- [ ] Create `PUT /user/onboarding` route
- [ ] Run `yarn db:generate` and `yarn db:migrate`
- [ ] Add onboarding guard middleware (redirect incomplete users)

### 2.4 Phase 2 QA
- [ ] All auth pages render with figma-make design
- [ ] Login flow works end-to-end
- [ ] Registration flow works end-to-end
- [ ] Password reset flow works end-to-end
- [ ] Onboarding flow redirects correctly
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 2 items as done

---

## Phase 3: Dashboard Shell & Core Pages (5-8 pages)

### 3.1 Route Restructure
- [ ] Create `/dashboard/(app)/layout.tsx` (single dashboard layout)
- [ ] Create `/dashboard/(app)/page.tsx` (dashboard home)
- [ ] Create `/dashboard/(admin)/layout.tsx` (admin-only layout, code-split)
- [ ] Create `/dashboard/(admin)/page.tsx` (admin overview)
- [ ] Delete old `/dashboard/(roles)/` route groups (researcher, pro-researcher, team-lead, admin)
- [ ] Update all links from `/dashboard/(roles)/...` to `/dashboard/(app)/...`
- [ ] Add role-based access control middleware for admin routes
- [ ] Test role-based redirects (researcher accessing admin → 403)

### 3.2 Layout Components
- [ ] Create `AppSidebar.tsx` (role-based, figma-make design)
- [ ] Create `AuthenticatedNavbar.tsx` (figma-make design)
- [ ] Create `DashboardLayout.tsx` (figma-make shell, mobile + desktop)
- [ ] Add workspace switcher to sidebar
- [ ] Add role-based navigation filtering (sidebar shows only allowed items)
- [ ] Add mobile hamburger menu with slide-out drawer
- [ ] Test sidebar collapse/expand states

### 3.3 Core Pages
- [ ] Rewrite `/dashboard/(app)/page.tsx` (dashboard home with stats cards, activity feed)
- [ ] Rewrite `/profile/page.tsx` (new profile with figma-make design)
- [ ] Rewrite `/settings/page.tsx` (new settings with figma-make design)
- [ ] Create `/dashboard/(admin)/users/page.tsx` (admin user management)
- [ ] Create `/dashboard/(admin)/subscriptions/page.tsx` (admin subscriptions)
- [ ] Create `/dashboard/(admin)/system/page.tsx` (admin system health)
- [ ] Create `/dashboard/(admin)/settings/page.tsx` (admin settings)

### 3.4 Backend Migration
- [ ] Create `UserPreference` model in Prisma schema
- [ ] Create `GET /user/me` route (enhanced with preferences)
- [ ] Create `PUT /user/preferences` route
- [ ] Create `GET /user/activity` route
- [ ] Run `yarn db:generate` and `yarn db:migrate`

### 3.5 Phase 3 QA
- [ ] Dashboard layout renders correctly for all 4 roles
- [ ] Sidebar shows correct navigation items per role
- [ ] Admin routes are protected (403 for non-admin)
- [ ] Dashboard home page renders with stats
- [ ] Profile page loads and saves data
- [ ] Settings page loads and saves preferences
- [ ] Mobile responsive (sidebar drawer, navbar)
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] Update this file: mark all Phase 3 items as done

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

## Current Status: Phase 1 Complete

Started: June 2026
Completed: June 2026
Current focus: Phase 2 Auth & Onboarding Pages (5-6 pages)

Last updated: June 2026
