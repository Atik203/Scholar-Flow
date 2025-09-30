---
applyTo: "apps/frontend/**"
---

# Frontend Development Instructions

## ✅ Phase 1 Progress (Week 5.5)

- Auth flows, modern dashboard shell, paper/collection/workspace tooling are live.
- Week 5 AI chat + summarization UI launched (Gemini-first with OpenAI fallback).
- Week 5.5 introduced role-scoped dashboard routing and admin overview UX refresh.

Keep new UI consistent with these delivered experiences and the standards below.

## 🚀 Advanced Error Handling (September 17, 2025)

### RTK Query Enhancement with Retry Logic

- **Enhanced API Slice**: Use retry configuration and error transformation with `retry(baseQuery, { maxRetries: 3 })`
- **Error Classification**: Network errors (auto-retry), client errors 4xx (manual fix), server errors 5xx (auto-retry)
- **Smart Retry Logic**: Auto-retry on network/server errors, skip retry on client errors

### Sonner Toast Integration

- **Use ToastProvider Functions**: Never import `toast` directly from Sonner
- **Proper Usage**: Use `showErrorToast`, `showSuccessToast` from `@/components/providers/ToastProvider`
- **Error Toast Best Practices**: Use `showApiErrorToast()` from `@/lib/errorHandling` - respects network error retry logic

### Custom Error Handling Hooks

- **Generic Error Handler**: `useErrorHandler(error, options)` for any error with automatic toast/logging
- **Query Error Handler**: `useQueryErrorHandler(queryResult, options)` with refetch capability
- **Mutation Error Handler**: `useMutationErrorHandler(mutationResult, retryFunction, options)` with retry logic

### Error Handling Standards

- **Smart Retry**: Auto-retry on network/server errors, manual retry for client errors
- **Consistent Messaging**: Use error utilities for consistent user-friendly error messages
- **Development Logging**: Detailed error logs only in development environment
- **Toast Integration**: Leverage existing Sonner setup with theme support and positioning

## Core Development Standards

- **Next.js App Router**: Prefer Server Components; add "use client" only where interactivity/state is needed
- **Dev Server**: Runs on port 3000. Backend CORS should allow `http://localhost:3000` in dev
- **State/Data**: RTK Query + React Redux. Set `baseUrl: "/api"`; attach auth headers in `prepareHeaders` when available
- **Forms**: React Hook Form + Zod. Validate on server too for trust boundaries
- **Auth**: NextAuth (JWT). Keep tokens server-only; never expose secrets; wrap app with provided `NextAuthProvider` and `ReduxProvider`
- **UI**: Tailwind + ShadCN. Keep primitives in `components/ui`; compose variants with `class-variance-authority`
- **Performance**: Use `next/image` and `next/font`; stream with Suspense where useful; minimize client JS
- **SEO**: Use Metadata API; add `app/sitemap.ts` and `app/robots.ts` when routes stabilize; consider JSON-LD for key pages
- **Error States**: Provide loading / empty / error UI for each data fetch
- **Accessibility**: Maintain focus states, labels, keyboard navigation

## UI/UX Guidelines

- **Consult `docs/UI_DESIGN.md` FIRST** before creating new pages or major UI changes
- Follow established authentication patterns for consistent user experience
- Use feature flags for incomplete features as documented in the UI design blueprint
- Maintain accessibility standards: keyboard navigation, focus states, ARIA labels
- Follow component taxonomy:
  - `components/auth/` - Authentication components ✅
  - `components/layout/` - Navigation and layout components
  - `components/ui/` - ShadCN primitives ✅
  - `components/customUI/` - Custom components

## Design System Standards

- **Colors**: Use OKLCH color system with existing success, warning, info variants
- **Typography**: Use Typography component with established heading scales
- **Spacing**: Use max-w-[1440px] container width and consistent padding scales
- **Animations**: Use existing hover effects (lift, scale, glow) and transitions

## Authentication Patterns ✅

- Login/register pages follow established design with proper form validation
- OAuth integration with Google/GitHub providers working
- Error handling and loading states implemented
- Responsive design tested across breakpoints
- Password strength indicators and form validation in place

## Code Quality

- **Lint/Typecheck**: Run `yarn lint` and `yarn type-check` on every change
- **TypeScript**: No implicit `any`, no unused exports
- **Performance**: Implement lazy loading, React.memo for expensive components
- **Accessibility**: WCAG 2.1 AA compliance, proper ARIA labels and roles
- **No Secrets**: Never expose private keys or tokens in client code
- **Do not use npm**: Use Yarn v4 workspaces

## Environment & Configuration

- **Environment**: Always check both envs before changing behavior: `apps/frontend/.env.local` and `apps/backend/.env`
- **CORS**: Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env` for CORS in dev; do not commit secrets
- **Feature Flags**: Use feature flags from env: `NEXT_PUBLIC_FEATURE_*` variables for gating UI elements

## Roadmap Discipline

- Follow `Roadmap.md` and work sequentially: Phase 1 (MVP) → Phase 2 (Advanced) → Phase 3 (Premium/Integrations)
- If a requested change is out-of-phase, implement only if it unblocks the current phase, otherwise note as "Next steps"

## Phase Overview

- **Phase 1**: Auth ✅, profile, uploads, collections, basic search/UI. Keep UI pragmatic and fast
- **Phase 2**: Collaboration (shared collections, workspaces), citation graph/formatting, enhanced UI
- **Phase 3**: Billing (Stripe/SSLCommerz), admin panel, external APIs, QA & launch

## Frontend Best Practices

### Routing, Data, and Rendering

- Prefer Server Components; use Client Components only when interaction/state is needed
- Use App Router layouts for shared chrome; colocation of route handlers where appropriate
- Fetch on the server when possible; leverage Next.js caching (ISR) for marketing pages
- Use `revalidate`/tag-based invalidation (`revalidateTag`, `revalidatePath`) for content updates

### SEO & Metadata

- Use the Metadata API in `layout.tsx`/`page.tsx` (`title`, `description`, `openGraph`, `twitter`, `alternates.canonical`, `robots`)
- Implement `generateMetadata` for dynamic routes (paper, collection, user)
- Add `app/sitemap.ts` and `app/robots.ts`; include dynamic entries for papers/collections
- Include structured data (JSON-LD) for Organization, WebSite, BreadcrumbList, Article/ScholarlyArticle

### Performance & UX

- Use `next/image` and `next/font` (self-host fonts); preconnect/prefetch critical resources
- Minimize client JS; split by route/segment; use streaming/Suspense and skeletons for perceived speed
- Debounce searches; paginate or infinite-scroll large lists; avoid N+1 client fetches
- Avoid heavy client-only UI libs when headless + Tailwind suffices

### Security

- JWT best practices: short-lived access tokens, refresh rotation, revoke on logout
- HTTP security headers (helmet), rate limiting, input validation, file type/size limits
- Regular dependency audits; pin critical packages; monitor CVEs
