# Scholar-Flow Cursor AI Rules

## Backend Module Architecture
- Feature modules live under `apps/backend/src/app/modules/` with structure: controller, service, routes, validation schemas.
- Routes register ONLY in `apps/backend/src/app/routes` — never register ad-hoc routes elsewhere.
- Controllers must be thin; all business logic belongs in services.
- Services use Prisma client from shared singleton; handle transactions explicitly when needed.
- Zod for request body, param, and query validation; reject early on failure.

## Database Operations — $queryRaw Critical Rule
- CRITICAL: All database operations MUST use `$queryRaw` or `$executeRaw` instead of standard Prisma Client methods for optimal performance.
- This applies to: SELECT, INSERT, UPDATE, DELETE, aggregation, complex joins.
- Use template literal syntax for SQL injection prevention: `WHERE email = ${email}`
- Use `prisma.$queryRaw<Type[]>` for proper typing.
- Select only required fields; never use `SELECT *`.
- Use `LIMIT ${limit} OFFSET ${skip}` for pagination; never return unbounded lists.
- EXCEPTION — OAuth operations MUST keep standard Prisma Client upsert:
  - `createAccount()`
  - `createOrUpdateUser()`
  - `createOrUpdateUserWithOAuth()`
  Changing these to raw queries causes P2002 unique constraint errors.

## TypedSQL & Raw SQL Files
- Raw SQL statements live in `apps/backend/prisma/sql/` with ONE statement per file.
- File names must be valid JavaScript identifiers (no leading dashes) because they become generated function names.
- Use positional parameters `$1`, `$2` with optional `-- @param {Type} $1:name` comments.
- After adding/modifying SQL, run `yarn db:generate` to regenerate typed functions.
- Import generated functions from `@prisma/client/sql`.
- Execute typed queries with `prisma.$queryRawTyped(queryName(...params))` or `prisma.$queryRaw(...)`.
- Always apply pending migrations BEFORE running `prisma generate --sql`.
- Every new TypedSQL query must have at least one test verifying shape and performance assumptions.
- Above any raw query usage, add a comment referencing the originating `.sql` file.

## Frontend Component & Design Standards
- Prefer Next.js Server Components; add `"use client"` ONLY when interactivity or state is required.
- Use `next/image` and `next/font`; stream large UI with Suspense to avoid unnecessary client bundles.
- Consult `docs/UI_DESIGN.md` BEFORE creating new pages or components.
- Component taxonomy:
  - `components/auth/` — Authentication related
  - `components/layout/` — Navigation, headers, sidebars
  - `components/ui/` — ShadCN primitives
  - `components/customUI/` — Custom components
- Design system: OKLCH color system, `max-w-[1440px]` container width, established Typography heading scales.
- Use existing hover effects (lift, scale, glow) and transitions.
- SEO: use Metadata API; ensure canonical URLs; plan sitemap + robots when routes stabilize.
- Accessibility: WCAG 2.1 AA compliance, proper ARIA labels, roles, focus states, keyboard navigation.

## Sonner Toast & Error Handling Patterns
- Use Sonner via ToastProvider functions ONLY:
  - `showErrorToast`, `showSuccessToast` from `@/components/providers/ToastProvider`
  - `showApiErrorToast` from `@/lib/errorHandling`
- NEVER import `toast` directly from `sonner`.
- Use custom error handling hooks:
  - `useErrorHandler` for generic errors
  - `useQueryErrorHandler` for RTK Query queries
  - `useMutationErrorHandler` for mutations
- Smart retry: auto-retry on network/server errors, manual retry for client errors.
- Error classification: Network (retry), Client 4xx (fix required), Server 5xx (retry).
- All auth methods must use try/catch with `ApiError` for consistent error responses.
- Feature-specific error classes must extend `ApiError` with standardized format:
  ```typescript
  {
    success: false,
    message: string,
    statusCode: number,
    errorCode?: string,
    details?: object,
    timestamp: string
  }
  ```

## Production-Ready Security & Performance Standards
- Debug logging is allowed ONLY in development; always gate with `process.env.NODE_ENV !== "production"`.
- Replace all `any` types with proper interfaces (e.g., `AuthenticatedRequest`).
- Apply feature-specific rate limiters to all mutation endpoints, especially uploads.
- Use `performanceMonitor` middleware and add `X-Response-Time` headers.
- Health check endpoints must exist:
  - `/api/health` — Basic health status
  - `/api/health/detailed` — Full system health
  - `/api/health/live` — Kubernetes liveness probe
  - `/api/health/ready` — Kubernetes readiness probe
- BigInt handling: cast to integer in SQL for JSON serialization to avoid issues.
- Memory monitoring: track heap usage and memory thresholds in health checks.

## pgvector Detailed Rules
- Only run similarity queries if `USE_PGVECTOR=true`.
- `PaperChunk.embedding` column type is `vector`; migrations manage any transition from JSON fallback.
- Use a service helper to format float arrays into vector literals (`[x,y,z]`).
- Similarity operators: `<->` (L2), `<=>` (cosine), `<#>` (negative inner product). Align index operator class with chosen operator.
- Create IVF index (`ivfflat`) only after sufficient data volume; document chosen `lists` parameter.
- Limit result sets (e.g., `LIMIT 10`); avoid full vector scans.
- Guard against mismatched dimensionality; validate embedding array length before insert.
- Add round-trip test (insert + similarity query) when modifying embedding logic.

## Auth Specifics
- Frontend authentication state is managed via Redux Toolkit (in addition to better-auth session).
- OAuth account creation MUST use standard Prisma upsert pattern; do NOT convert to raw SQL.
- Password strength indicators on register forms.
- Auth guards for protected routes.
- All auth functions must have JSDoc comments.
- Authentication-related code requires minimum 90% test coverage.
- Comprehensive integration tests required for all auth endpoints and flows.

## Workflow & Documentation Discipline
- Follow phase discipline strictly; see `Roadmap.md` before starting new features.
- Ship only in-phase work; defer out-of-scope requests unless they unblock the current milestone.
- Prefer shipping a thin vertical slice over broad incomplete scaffolding.
- Do NOT create README.md, OPTIMIZATION.md, CHANGELOG.md, or PERFORMANCE.md files for minor updates or every change.
- Inline documentation only; comments explain WHY not WHAT.
- Quality gates before merge:
  1. `yarn build` succeeds
  2. `yarn type-check` clean
  3. `yarn lint` zero errors
  4. Tests pass; add/adjust tests for new logic
  5. No secrets committed
  6. No obvious N+1 or unbounded queries
  7. WCAG 2.1 AA for new UI components
  8. Migrations are additive (backwards compatible)
  9. Update public docs (README, SCHEMA, ENVIRONMENT) for changed public behavior
  10. Keep PR scope tight with summary + checklist

## Development Server Ports
- Frontend dev server: port 3000
- Backend dev server: port 5000

---

## Next.js 16 Rules (upgrade complete — June 2026)

### Async Request APIs — enforced, no exceptions
ALL of these are async in v16 and must be awaited:
  const { id } = await props.params
  const { q } = await props.searchParams
  const store = await cookies()
  const list = await headers()
  const draft = await draftMode()
Never access these synchronously — it throws at runtime.

Type helpers available after next typegen:
  Page:   PageProps<'/dashboard/(app)/papers/[id]'>
  Layout: LayoutProps
  Route:  RouteContext

### Routing — proxy.ts replaces middleware.ts
middleware.ts has been renamed to proxy.ts.
The exported function is named proxy (not middleware).
Read proxy.ts before any auth or routing task.
Never recreate middleware.ts.
Add new protected routes to the matcher array in proxy.ts.

### React Compiler is enabled
reactCompiler: true in next.config.ts.
Do NOT add useMemo, useCallback, or React.memo() to new components.
The compiler handles all memoization automatically.
Manual memoization on compiler-enabled code causes double-memoization.

### Caching — updated API
revalidateTag now requires second argument:
  revalidateTag('papers', 'max')       → background revalidation
  updateTag('user-profile')            → immediate update (Server Actions)
  refresh()                            → refresh client router

Stable imports (no unstable_ prefix):
  import { cacheLife, cacheTag } from 'next/cache'

### Turbopack
Default for both next dev and next build.
No flags needed. Config at top-level turbopack: {} in next.config.ts.
Dev artifacts go to .next/dev (not .next).

### Images
Use images.remotePatterns only — images.domains is removed.
S3 and Cloudflare R2 configured in remotePatterns.

### next lint removed
Use: eslint . (not next lint)
ESLint flat config format is now default.
