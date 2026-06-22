# Scholar-Flow — Claude Quick Reference

## Stack
- **Frontend**: Next.js 16 App Router, React 19.2, TypeScript strict
- **Auth**: better-auth (replaced NextAuth.js v4)
- **State**: Redux Toolkit Query (RTK Query)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Backend**: Express.js, Prisma 7.8.0, PostgreSQL + pgvector
- **Package Manager**: Yarn Berry v4.9.2
- **Monorepo**: Turborepo v2.5.8

## Commands
```bash
# Development
yarn dev:turbo           # Start both frontend (3000) and backend (5000)
yarn dev:frontend        # Frontend only
yarn dev:backend         # Backend only

# Build & Quality
yarn build               # Production build (both)
yarn type-check          # TypeScript check (both)
yarn lint                # ESLint (both)
yarn test                # Test suite
yarn format              # Prettier

# Database
yarn db:migrate          # Prisma migrate dev
yarn db:generate         # Prisma generate --sql
yarn db:studio           # Prisma Studio
yarn db:seed             # Seed database

# Next.js 16 specific
yarn workspace @scholar-flow/frontend exec next typegen  # Generate PageProps/LayoutProps
```

## Next.js 16 Quick Reference
**Async required:**
- `await props.params`
- `await props.searchParams`
- `await cookies()`
- `await headers()`

**Type helpers:**
- `PageProps<'/path/[param]'>`
- `LayoutProps`
- `RouteContext`

**Auth file:** `proxy.ts` (NOT middleware.ts — renamed in v16)

**React Compiler ON:** Never add `useMemo`/`useCallback`/`memo()` manually

**Cache:**
- `revalidateTag('tag', 'max')` — background revalidation
- `updateTag('tag')` — immediate update
- `refresh()` — refresh client router

**Stable imports:**
```typescript
import { cacheLife, cacheTag } from 'next/cache'
```

**Turbopack:** Default for `next dev` and `next build` — no flags needed

## Auth Architecture
- **better-auth config**: `apps/frontend/src/lib/auth/better-auth.ts`
- **Auth client**: `apps/frontend/src/lib/auth/authClient.ts`
- **API route**: `apps/frontend/src/app/api/auth/[...auth]/route.ts`
- **proxy.ts**: `apps/frontend/proxy.ts` (auth guards, replaces middleware.ts)
- **Redux slice**: `apps/frontend/src/redux/auth/authSlice.ts`
- **Backend auth**: JWT + bcrypt + refresh tokens (Express)

## Critical Rules
- NEVER use npm or pnpm — always yarn
- NEVER import backend into frontend
- NEVER use Prisma in frontend
- NEVER expose AWS credentials in frontend
- NEVER update subscription status from frontend
- NEVER add console.log for debugging
- NEVER call save on every TipTap keystroke
- NEVER make raw fetch calls inside React components
- NEVER skip Stripe webhook signature verification

## File Structure
```
apps/frontend/src/app/         → App Router pages
apps/frontend/components/      → UI components
apps/frontend/lib/             → Utilities, auth, API clients
apps/frontend/redux/           → RTK Query slices
apps/frontend/proxy.ts         → Auth guards
apps/backend/src/app/          → Controllers, routes, middleware
apps/backend/prisma/           → Schema + migrations
```

## Current Phase
Phase 10 — FINAL PHASE (~98% Complete, Release 1.3.0-rc1)
- Next.js 16 upgrade ✅
- better-auth migration ✅
- Prisma v7 migration ✅
- Paper upload/import overhaul ✅
- Current: Release 1.3.0-rc1 — deployment docs, version sync, production hardening

## Resources
- GitHub: https://github.com/Atik203/Scholar-Flow
- AGENTS.md: Project rules and conventions
- IMPLEMENTATION.md: Roadmap and current status
