---
applyTo: "apps/backend/**"
---

# Backend Development Instructions

## ✅ Phase 1 Progress

- OAuth authentication, paper management, collections, and workspaces are production-ready.
- AI summarization + multi-provider insights shipped (Gemini primary, OpenAI fallback).
- Dashboard restructure delivered with role-based routing, admin tools, and workspace refinements.

Keep new work aligned with these shipped milestones and follow the standards below.

## 🚀 Production-Ready Improvements

### Security & Performance Standards

- **Debug Logging Control**: Auth middleware conditionally logs only in development (`NODE_ENV !== "production"`)
- **Type Safety**: Replace all `any` types with proper interfaces (use `AuthenticatedRequest` for authenticated routes)
- **Rate Limiting**: Apply paper-specific rate limiters (`paperUploadLimiter`, `paperListLimiter`, `paperOperationLimiter`) to all endpoints
- **Database Performance**: Add composite indexes for hot query paths (e.g., `Paper` queries by `uploaderId + workspaceId`)
- **Performance Monitoring**: Use `performanceMonitor` middleware to track response times and add `X-Response-Time` headers

### Error Handling Standards

- **Backend Error Classes**: Create feature-specific error classes (e.g., `PaperError`) extending `ApiError` for consistent error responses
- **Standardized Error Format**: All errors follow `{ success: false, message: string, statusCode: number, errorCode?: string, details?: object }`
- **Health Check Endpoints**: Comprehensive monitoring at `/api/health/*` (basic, detailed, live, ready probes)

### Production Pitfalls to Avoid

- ❌ Logging debug info in production (always check `NODE_ENV`)
- ❌ Using `any` types (use proper interfaces like `AuthenticatedRequest`)
- ❌ Missing rate limiting on upload/mutation endpoints
- ❌ Missing performance monitoring on critical paths
- ❌ Not handling BigInt serialization in JSON (cast to integer in SQL)

## Architecture & Structure

- **Structure**: Feature modules under `src/app/modules` (controller, service, routes, validation schemas)
- **Routes**: Register in `src/app/routes` only. No ad-hoc route registration elsewhere
- **Controllers**: Thin. Business logic belongs in services
- **Services**: Use Prisma client from shared singleton. Handle transactions explicitly when needed
- **Validation**: Zod for request bodies, params, queries. Reject early on failure

## Database Operations - Prisma Client vs Raw SQL Decision Tree

**PREFER Prisma Client when:**

- Simple CRUD operations
- Standard relationships and joins
- OAuth account management (CRITICAL: use upsert patterns)
- User management and basic queries

**Use `$queryRaw` / `$executeRaw` when:**

- Complex joins not ergonomic in Prisma Client
- Performance-critical read paths with explicit SQL + indexes
- Complex aggregations or window functions
- Bulk operations that need optimization

### Implementation Standards

```typescript
// ✅ CORRECT: Prisma Client for standard CRUD
const users = await prisma.user.findMany({
  where: { isDeleted: false },
  orderBy: { createdAt: "desc" },
  skip,
  take: limit,
});

// ✅ CORRECT: Use $queryRaw for complex/performance-critical queries
const users = await prisma.$queryRaw<User[]>`
  SELECT id, email, name, "createdAt"
  FROM "User"
  WHERE "isDeleted" = false
  ORDER BY "createdAt" DESC
  LIMIT ${limit} OFFSET ${skip}
`;
```

### Security & Performance

- **SQL Injection Prevention**: Use template literals: `WHERE email = ${email}`
- **Type Safety**: Use `prisma.$queryRaw<Type[]>` for proper typing (never `any[]`)
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

- **Phase 1**: Auth ✅, profile, file uploads (S3 integrated), paper/collection CRUD, basic search
- **Phase 2**: Collaboration (roles, shared collections/workspaces), citation graph/formatting, improved UI
- **Phase 3**: Billing (Stripe), admin tooling, external integrations, QA and launch
