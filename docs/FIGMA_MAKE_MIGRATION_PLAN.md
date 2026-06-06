# Figma-Make to Production Migration Plan

Author: Copilot + Atik  
Date: 2026-03-19  
Status: In Progress

## Objective

Migrate figma-make UI designs into production for public pages and auth pages while preserving existing app behavior and backend contracts.

Initial target pages:

- Home
- Products (all subpages)
- Resources (all subpages)
- Company (all subpages)
- Enterprise (all subpages)
- Pricing
- FAQ
- Register
- Login
- Shared Navbar and Footer

## Non-Negotiables

- Keep existing provider chain in app layout unchanged.
- Keep existing auth endpoint contracts unless intentionally revised.
- Preserve working billing checkout flow.
- Avoid route regressions: all links must point to existing routes.
- Use ToastProvider helpers, not direct Sonner imports.
- Use Prisma Client model methods by default.
- Use raw SQL only for complex or performance-critical cases.

## Architecture Strategy

### Frontend Strategy

1. Shared layout first:

- Navbar
- Footer
- Route/link harmonization

1. Section-by-section route migration:

- Products
- Resources
- Company
- Enterprise
- Home/Pricing/FAQ

1. Auth migration:

- Register (UI + behavior-safe refactor)
- Login (UI + behavior-safe refactor)
- Keep callbackUrl and OAuth redirects compatible

1. Reliability pass:

- Remove invalid links
- Remove direct toast imports
- Ensure responsive behavior
- Ensure no hydration and TypeScript errors

### Backend Strategy

1. Contract freeze for Phase 1 migration:

- `/auth/register`
- `/auth/signin`
- `/auth/oauth/*`
- `/billing/checkout-session`

1. Backend changes only if required by frontend behavior:

- Keep response shape stable
- Keep existing status code and error format conventions
- Add validation if new fields are introduced

1. Data access conventions:

- Default to Prisma Client methods for CRUD and relations
- Use `$queryRaw`/`$executeRaw` only when Prisma cannot express needed SQL cleanly
- Never use `$queryRawUnsafe`

## Work Breakdown

### Wave 1: Foundation (Current)

- [x] Footer migrated and route-safe links applied
- [x] Register page moved to ToastProvider helpers
- [x] Pricing page moved to ToastProvider helpers
- [x] FAQ/docs/papers critical route fixes
- [x] Tailwind dynamic class safelist added
- [x] Type-check pass after migration edits

### Wave 2: Public Section Completion

- [ ] Products pages polish (route + CTA correctness)
- [ ] Resources pages polish (route + CTA correctness)
- [ ] Company pages polish (contact flow and links)
- [ ] Enterprise pages polish (sales and support routes)
- [ ] FAQ/Pricing UX parity updates from figma-make

### Wave 3: Auth Pages

- [ ] Login visual parity + behavior verification
- [ ] Register visual parity + behavior verification
- [ ] OAuth flow compatibility verification
- [ ] Error message and loading-state consistency

### Wave 4: Backend Alignment (If Needed)

- [ ] Verify frontend expectation vs backend response contracts
- [ ] Add minimal backend adjustments only if mismatch exists
- [ ] Add/adjust tests for any changed backend behavior

### Wave 5: Final QA and Hardening

- [ ] Full route sweep for migrated pages
- [ ] Mobile and desktop visual QA
- [ ] Accessibility pass (labels, focus, keyboard)
- [ ] Lint/type-check/build gates
- [ ] Regression checklist sign-off

## Validation Checklist

For each migrated page:

- [ ] Route loads successfully
- [ ] No 404/invalid links from CTA or nav
- [ ] No direct `toast` import from Sonner
- [ ] No console runtime errors
- [ ] Responsive across common breakpoints
- [ ] Matches figma-make visual intent

For auth/billing flows:

- [ ] Register success and failure paths
- [ ] Login success and failure paths
- [ ] OAuth start and callback flows
- [ ] Pricing unauthenticated redirect to login
- [ ] Pricing authenticated checkout session creation

## Rollback and Safety

- Keep changes in small, focused commits by page family.
- Any broken section can be reverted independently.
- Do not mix backend refactor with broad UI replacement in a single commit.

## Current Next Actions

1. Continue section migration with Company + Enterprise link and UX consistency checks.
1. Complete remaining route fixes across Products/Resources pages.
1. Start Login/Register parity cleanup while preserving behavior contracts.
