---
applyTo: "apps/frontend/**"
---

- Use Next.js 15 App Router with TypeScript (strict). Prefer Server Components; add "use client" only where interactivity/state is needed.
- Dev server runs on port 3002. Backend CORS should allow `http://localhost:3002` in dev.
- State/data: RTK Query + React Redux. Set `baseUrl: "/api"`; attach auth headers in `prepareHeaders` when available.
- Forms: React Hook Form + Zod. Validate on server too for trust boundaries.
- Auth: NextAuth (JWT). Keep tokens server-only; never expose secrets; wrap app with provided `NextAuthProvider` and `ReduxProvider`.
- UI: Tailwind + ShadCN. Keep primitives in `components/ui`; compose variants with `class-variance-authority`.
- Performance: use `next/image` and `next/font`; stream with Suspense where useful; minimize client JS.
- SEO: use Metadata API; add `app/sitemap.ts` and `app/robots.ts` when routes stabilize; consider JSON-LD for key pages.
- Error/empty/loading states must be explicit (skeletons or placeholders).
- Lint/typecheck: `yarn lint`, `yarn type-check`; no implicit `any`, no unused exports.
- Do not call Prisma or other Node-only libs from the client. Do not store secrets in client code. Do not use npm in this repo.

Roadmap discipline:

- Follow `Roadmap.md` and work sequentially: Phase 1 (MVP) → Phase 2 (Advanced) → Phase 3 (Premium/Integrations).
- If a requested change is out-of-phase, implement only if it unblocks the current phase, otherwise note as “Next steps”.

Env discipline:

- Always check both envs before changing behavior: `apps/frontend/.env.local` and `apps/backend/.env`.
- Ensure `FRONTEND_URL=http://localhost:3002` in backend `.env` for CORS in dev; do not commit secrets.

Phase overview (summary):

- Phase 1: Auth, profile, uploads, collections, basic search/UI. Keep UI pragmatic and fast.
- Phase 2: Collaboration (shared collections, workspaces), citation graph/formatting, enhanced UI.
- Phase 3: Billing (Stripe/SSLCommerz), admin panel, external APIs, QA & launch.
