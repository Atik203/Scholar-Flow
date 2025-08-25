---
applyTo: "apps/frontend/**"
---

## ✅ Phase 1 Status: Authentication UI Complete

OAuth authentication, login/register pages, and form validation are production-ready.

## Development Standards

- Use Next.js 15 App Router with TypeScript (strict). Prefer Server Components; add "use client" only where interactivity/state is needed.
- Dev server runs on port 3000. Backend CORS should allow `http://localhost:3000` in dev.
- State/data: RTK Query + React Redux. Set `baseUrl: "/api"`; attach auth headers in `prepareHeaders` when available.
- Forms: React Hook Form + Zod. Validate on server too for trust boundaries.
- Auth: NextAuth (JWT). Keep tokens server-only; never expose secrets; wrap app with provided `NextAuthProvider` and `ReduxProvider`.
- UI: Tailwind + ShadCN. Keep primitives in `components/ui`; compose variants with `class-variance-authority`.
- Performance: use `next/image` and `next/font`; stream with Suspense where useful; minimize client JS.
- SEO: use Metadata API; add `app/sitemap.ts` and `app/robots.ts` when routes stabilize; consider JSON-LD for key pages.
- Error/empty/loading states must be explicit (skeletons or placeholders).
- Lint/typecheck: `yarn lint`, `yarn type-check`; no implicit `any`, no unused exports.
- Do not call Prisma or other Node-only libs from the client. Do not store secrets in client code. Do not use npm in this repo.

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

## Authentication Patterns ✅

- Login/register pages follow established design with proper form validation
- OAuth integration with Google/GitHub providers working
- Error handling and loading states implemented
- Responsive design tested across breakpoints
- Password strength indicators and form validation in place

Roadmap discipline:

- Follow `Roadmap.md` and work sequentially: Phase 1 (MVP) → Phase 2 (Advanced) → Phase 3 (Premium/Integrations).
- If a requested change is out-of-phase, implement only if it unblocks the current phase, otherwise note as "Next steps".

Env discipline:

- Always check both envs before changing behavior: `apps/frontend/.env.local` and `apps/backend/.env`.
- Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env` for CORS in dev; do not commit secrets.
- Use feature flags from env: `NEXT_PUBLIC_FEATURE_*` variables for gating UI elements

Phase overview (summary):

- Phase 1: Auth ✅, profile, uploads, collections, basic search/UI. Keep UI pragmatic and fast.
- Phase 2: Collaboration (shared collections, workspaces), citation graph/formatting, enhanced UI.
- Phase 3: Billing (Stripe/SSLCommerz), admin panel, external APIs, QA & launch.
