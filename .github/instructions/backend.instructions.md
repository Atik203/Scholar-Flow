---
applyTo: "apps/backend/**"
---

# Backend Development Instructions

## ✅ Phase 1 Status: OAuth Authentication System Complete

Production-ready authentication with comprehensive testing and proper error handling.

## Architecture & Structure

- **Structure**: Feature modules under `src/app/modules` (controller, service, routes, validation schemas)
- **Routes**: Register in `src/app/routes` only. No ad-hoc route registration elsewhere
- **Controllers**: Thin. Business logic belongs in services
- **Services**: Use Prisma client from shared singleton. Handle transactions explicitly when needed
- **Validation**: Zod for request bodies, params, queries. Reject early on failure

## Database Operations - $queryRaw Optimization

**CRITICAL RULE**: All database operations MUST use `$queryRaw` or `$executeRaw` instead of Prisma Client methods for optimal performance.

### ✅ REQUIRED: Use $queryRaw for:

- All SELECT queries (findMany, findUnique, findFirst)
- All INSERT operations (create)
- All UPDATE operations (update, upsert)
- All DELETE operations (delete)
- All aggregation queries (count, groupBy)
- All complex joins and relationships

### 🔒 EXCEPTIONS: Keep Prisma Client ONLY for:

- **OAuth operations** that require complex constraint handling:
  - `createAccount()` - Provider constraint management
  - `createOrUpdateUser()` - Email constraint management
  - `createOrUpdateUserWithOAuth()` - Email verification handling

### Implementation Standards

```typescript
// ✅ CORRECT: Use $queryRaw with proper typing
const users = await prisma.$queryRaw<any[]>`
  SELECT id, email, name, "createdAt"
  FROM "User"
  WHERE "isDeleted" = false
  ORDER BY "createdAt" DESC
  LIMIT ${limit} OFFSET ${skip}
`;

// ❌ WRONG: Using Prisma Client
const users = await prisma.user.findMany({
  where: { isDeleted: false },
  orderBy: { createdAt: "desc" },
  skip,
  take: limit,
});
```

### Security & Performance

- **SQL Injection Prevention**: Use template literals: `WHERE email = ${email}`
- **Type Safety**: Use `prisma.$queryRaw<Type[]>` for proper typing
- **Field Selection**: Select only required fields, avoid `SELECT *`
- **Pagination**: Use `LIMIT ${limit} OFFSET ${skip}` for efficient pagination

## Authentication & Security

- **OAuth Account Management**: ALWAYS use standard Prisma upsert for OAuth accounts
- **Raw Query Warning**: Do NOT change OAuth account creation to raw queries - causes unique constraint errors (P2002)
- **Error Handling**: All auth methods must use try/catch with ApiError for consistent error responses
- **JWT**: Use JWT access + refresh. Use `auth` middleware for protected endpoints
- **CORS**: Use `FRONTEND_URL` env; default `http://localhost:3000` in dev

## Testing & Quality

- **Testing**: Add unit tests for non-trivial service logic; integration tests for new routes
- **Critical Features**: Authentication flows require comprehensive test coverage
- **Errors**: Throw `ApiError(status, message)`; avoid returning partial successes silently
- **Logging**: Avoid console noise. Use structured logs for important events

## Prisma & Database

- **Prisma**: After modifying schema run migrations then `yarn db:generate` (includes TypedSQL)
- **Raw SQL**: Keep raw SQL in `prisma/sql` (one statement per file)
- **TypedSQL**: Import from `@prisma/client/sql`; execute with `$queryRawTyped` or `$queryRaw`
- **pgvector**: Only run similarity queries if `USE_PGVECTOR=true`. Ensure extension exists before deploying usage
- **Pagination**: Use provided pagination helper; never return unbounded lists

## Environment & Configuration

- **Config**: Centralized in `src/config/index.ts` (loads `.env`)
- **CORS**: Respect `FRONTEND_URL` for CORS; default API port is 5000
- **Secrets**: Store secrets in `.env` only; never log secrets
- **Feature Flags**: Use `FEATURE_*` variables for gating backend features

## Code Quality

- **Lint/Typecheck**: Run `yarn lint` and `yarn type-check` on every change
- **TypeScript**: Avoid implicit `any`, unused exports
- **Dependencies**: Prefer standard libs and already-installed packages. Justify new deps in PR
- **Do not use npm**: Use Yarn v4 workspaces

## Roadmap Discipline

- Follow `Roadmap.md` sequence strictly: complete Phase 1 items (auth ✅, uploads, collections, basic search) before Phase 2, then Phase 3
- If a feature request is out-of-phase, document it and add minimal scaffolding only if needed to unblock Phase 1

## Phase Overview

- **Phase 1**: Auth ✅, profile, file uploads (S3 planned), paper/collection CRUD, basic search
- **Phase 2**: Collaboration (roles, shared collections/workspaces), citation graph/formatting, improved UI
- **Phase 3**: Billing (Stripe/SSLCommerz), admin tooling, external integrations, QA and launch
