# Scholar-Flow Copilot Instructions

## Project Overview
Scholar-Flow is an AI-powered research paper SaaS collaboration platform.
- Next.js 16 App Router, React 19.2, TypeScript strict
- better-auth for authentication (migrated from NextAuth.js v4)
- Redux Toolkit Query for state management
- Tailwind CSS + shadcn/ui
- Express.js backend with Prisma + PostgreSQL
- Turborepo v2.5.8 + Yarn Berry v4.9.2

## Auth & Session
- Auth config: `apps/frontend/src/lib/auth/better-auth.ts`
- Auth client: `apps/frontend/src/lib/auth/authClient.ts`
- API route: `apps/frontend/src/app/api/auth/[...auth]/route.ts`
- proxy.ts handles auth guards (not middleware.ts)
- Redux authSlice persists accessToken for backend API calls
- OAuth: Google + GitHub via backend API

## Backend Integration
- All API calls go through RTK Query in `apps/frontend/src/redux/`
- Backend base URL: `NEXT_PUBLIC_API_BASE_URL`
- Auth endpoints: `POST /api/auth/signin`, `POST /api/auth/oauth/signin`
- JWT tokens signed with `NEXTAUTH_SECRET` (also used by better-auth)

## Code Style
- Server Components by default; `"use client"` only when needed
- Use `next/image` and `next/font`
- OKLCH color system, `max-w-[1440px]` container
- Use ToastProvider functions (not sonner directly)
- All auth functions have try/catch with `ApiError`

## Quality Gates
1. `yarn build` succeeds
2. `yarn type-check` clean
3. `yarn lint` zero errors
4. Tests pass
5. No secrets committed
6. WCAG 2.1 AA for new UI

---

## Next.js 16 Upgrade Notes (June 2026)

### Breaking changes — know these before writing any frontend code

**Async params/searchParams/cookies/headers (enforced)**
All must be awaited — synchronous access throws at runtime in v16.
```typescript
// ALWAYS — v16 required
const { id } = await props.params
const { q } = await props.searchParams
const store = await cookies()

// NEVER — throws at runtime in v16
const { id } = props.params
```

Type helpers (run `yarn workspace @scholar-flow/frontend exec next typegen`):
```typescript
// Page component
export default async function Page(props: PageProps<'/papers/[id]'>) {
  const { id } = await props.params
}

// Layout component
export default async function Layout(props: LayoutProps) {
  const { id } = await props.params
}

// API route
export async function GET(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params
}
```

**proxy.ts replaces middleware.ts**
Auth guards are in proxy.ts (not middleware.ts).
Read proxy.ts before any auth task.
Never recreate middleware.ts.

**React Compiler is ON — no manual memoization**
Do NOT add: useMemo, useCallback, React.memo()
The compiler memoizes automatically.

**Caching APIs updated**
```typescript
// Background revalidation
revalidateTag('papers', 'max')

// Immediate update (user sees change instantly)
updateTag('user-profile')

// Stable imports
import { cacheLife, cacheTag } from 'next/cache'
```

**Lint command changed**
Use: `eslint .`
Not: `next lint` (removed in v16)

**Images**
Use remotePatterns only — domains config removed.
