# CACHE OPTIMIZATION CONTRACT — FROZEN PREFIX
# This block is always first. Never modify between calls.
# DeepSeek, Kimi, GLM, MiMo: cache matches from byte 0.
# Any edit before byte N invalidates everything after it.

## Prefix stability rules (all models)
- System prompt + tool definitions: STATIC — frozen between calls
- File reads: DYNAMIC — always appended at END of context only
- User message: always last
- Conversation history: append-only, never rewrite earlier turns
- Never inject timestamps, dates, or session-specific values here

## Qwen 3.x cache activation requirement
Qwen models need minimum 1024 tokens to activate prefix caching.
This AGENTS.md + skills content must stay above 1024 tokens total.
Do not shorten this file.

## Agent behavior (cache-preserving)
- Understand the full goal before ANY tool call
- One tool call at a time — no parallel speculation
- Read each file ONCE per session unless you edited it
- Do not re-read files to verify — trust what is in context
- Never duplicate file content across turns — reference by path
- Stop when goal is achieved — do not add unrequested changes

## Multi-Model Cache Optimization
This project supports multiple AI models with prefix caching:
- **DeepSeek V4 Pro / DeepSeek Flash**: Cache hits from byte 0 on matching prefix
- **Kimi K2.6**: Cache hits from byte 0 on matching prefix
- **GLM-4 / MiMo**: Cache hits from byte 0 on matching prefix
- **Qwen 3.x**: Requires minimum 1024 tokens to activate prefix caching
- **Optimization strategy**: Keep AGENTS.md + skills content above 1024 tokens total
- **Rule**: Never inject timestamps, dates, or session-specific values in the frozen prefix
- **Rule**: Never modify the frozen prefix block between calls — any edit before byte N invalidates everything after it

---

# Scholar-Flow AI Agent Instructions

## Product
Scholar-Flow is an AI-powered research paper SaaS collaboration platform.
Target users: researchers, students, professors, academic teams.
Version: 1.3.1 — Next.js 16, React 19.2, better-auth, Prisma 7.8.0

Core features:
- Research paper upload with AI metadata extraction (title/author/abstract)
- TipTap rich text editor: auto-save, drafts, export PDF/DOCX
- Collections and workspaces with role-based access
- Email sharing with permission management (view/edit)
- Stripe billing: checkout, webhooks, customer portal
- Admin dashboard: real-time CPU/memory/storage/DB metrics (10s refresh)
- pgvector semantic search
- PDF preview (secure iframe)
- AWS S3 for all file storage

---

## Monorepo Structure
Root: Turborepo v2.5.8 + Yarn Berry v4.9.2
  apps/frontend/    → Next.js 16 app (package: @scholar-flow/frontend)
  apps/backend/     → Express.js API (package: @scholar-flow/backend)
  docs/             → Documentation
  .cursor/rules/    → Cursor AI guidelines (read-only)
  figma-make/       → Figma-generated component references

---

## Frontend (apps/frontend)
Framework: Next.js 16 App Router
Language: TypeScript strict mode
State: Redux Toolkit Query (RTK Query) — NOT plain Redux
Auth: better-auth (Google OAuth, GitHub OAuth, email/password) — migrated from NextAuth.js v4
UI: Tailwind CSS + shadcn/ui
Forms: React Hook Form + Zod
Editor: TipTap (tiptap-extension-resizable-image, tiptap-resizable-image)
Virtualization: react-window
Sanitization: sanitize-html
File structure:
  apps/frontend/src/app/         → App Router pages and layouts
  apps/frontend/components/      → Reusable UI components
  apps/frontend/lib/             → Utilities, auth config, API clients
  apps/frontend/redux/           → RTK Query slices and store config
  apps/frontend/proxy.ts         → Auth guards and route protection (replaces middleware.ts)

---

## Backend (apps/backend)
Runtime: Node.js >=22, Express.js, TypeScript
ORM: Prisma 7.8.0 (always use --sql flag: yarn db:generate)
Database: PostgreSQL + pgvector extension
Auth: JWT + bcrypt (refresh tokens, rate limiting)
Storage: AWS S3 (presigned URLs only — never expose credentials)
Payments: Stripe (checkout + webhooks + customer portal)
Validation: Zod schemas
File structure:
  apps/backend/src/app/          → Controllers, routes, middleware
  apps/backend/prisma/           → schema.prisma + migrations
  apps/backend/scripts/          → Seed and utility scripts

---

## Exact Commands (always use Yarn — never npm, never pnpm)
yarn dev:turbo           → start both apps via Turborepo
yarn dev:frontend        → frontend only
yarn dev:backend         → backend only
yarn build               → production build (both)
yarn lint                → ESLint (both)
yarn type-check          → TypeScript check (both, needs build first)
yarn test                → test suite
yarn format              → Prettier
yarn clean               → clean all build artifacts
yarn db:migrate          → prisma migrate dev
yarn db:generate         → prisma generate --sql  ← always --sql
yarn db:studio           → Prisma Studio
yarn db:seed             → seed database
yarn db:reset            → prisma migrate reset --force
yarn setup               → install + generate (use for fresh setup)

---

## Architecture Rules
Frontend and backend are fully decoupled — REST API only.
Frontend: UI, RTK Query, NextAuth sessions, Redux state.
Backend: business logic, Prisma, S3, Stripe, JWT.
NEVER import backend code into frontend.
NEVER use Prisma in frontend.
NEVER bypass the REST API layer.
NEVER store files locally in production — use S3.
NEVER expose AWS credentials or S3 bucket names in frontend code.

---

## Authentication Rules
Frontend: NextAuth.js only — Google/GitHub OAuth + email/password.
Backend: JWT + bcrypt + refresh tokens.
NEVER suggest better-auth or any auth replacement.
NEVER bypass auth middleware on protected routes.
NEVER store raw passwords — always bcrypt.
Session validation: backend verifies JWT, frontend uses NextAuth session.

### Auth-state persistence (learned the hard way in 1.2.2)

After any auth-state dispatch (`setCredentials` / `clearCredentials`) and BEFORE any `window.location.href` navigation, you MUST `await persistor.flush()`. redux-persist schedules localStorage writes on a microtask; a hard navigation kills that microtask and the next page rehydrates stale state. The 401 cascade and "wrong user shown" bugs in 1.2.1 came from skipping this.

- `apps/frontend/src/lib/authHelpers.ts:signInWithCredentials` and `:completeOAuthSignIn` both call `await flushAuthState()` before returning
- `apps/frontend/src/lib/auth/signout.ts` is the canonical 7-step purge — copy that order, do not invent a new flow
- OAuth callback pages MUST use `window.location.href` on success, not `router.push` / `router.replace` (soft nav keeps the old tree mounted)

### better-auth client/server boundary

`authClient` (from `lib/auth/authClient.ts`) transitively imports `better-auth/next-js` and `node:crypto` — both server-only. Never import `authClient` from any client-side auth utility (`signout.ts`, `authHelpers.ts`, etc.). Clear better-auth cookies via `document.cookie` directly. The ChunkLoadError in 1.2.2 came from violating this.

### RTK Query auth-guard pattern

`shouldFetchUser = Boolean(accessToken && accessToken.length > 0)` — never use `isAuthenticated` alone for guarding queries. Stale persist rehydration can leave `isAuthenticated: true` with `accessToken: null`. The dev-only `console.warn` in `apiSlice.ts:prepareHeaders` surfaces this and must stay.

### OAuth profile preservation

`createOrUpdateUserWithOAuth` and `createOrUpdateUser` must NEVER overwrite `name` or `image` on update — only fill them in if the existing value is empty. Custom uploads (S3) and renamed profiles belong to the user, not the OAuth provider. `emailVerified` is always refreshed.

---

## Stripe Rules (critical — production money flows)
Webhooks are the ONLY source of truth for subscription status.
NEVER update subscription roles from frontend.
ALWAYS verify Stripe webhook signatures before processing.
Customer portal accessed via backend endpoint only.
Webhook handlers MUST be idempotent (safe to replay).
Test mode and live mode keys are different — never mix them.
Before touching billing code: read the webhook handler first.

---

## AWS S3 Rules (critical — user data)
ALL file operations use presigned URLs.
NEVER stream files through the backend if avoidable.
NEVER hardcode S3 bucket names in frontend.
NEVER expose AWS_ACCESS_KEY or AWS_SECRET in frontend.
Image resizing happens server-side before S3 upload.
PDF upload goes through backend S3 route — not direct from browser.

---

## pgvector Rules (critical — AI features)
pgvector powers semantic search on research papers.
NEVER drop vector columns or vector indexes.
NEVER run prisma migrate reset in production.
Always use yarn db:generate --sql after schema changes.
Embedding dimension is fixed — never change vector size in production.
queryRaw is required for pgvector operations (Prisma limitation).

---

## TipTap Editor Rules
Auto-save uses debounce — never call save on every keystroke.
Draft and publish states are separate fields.
Image uploads go to S3 via backend — never base64 inline.
Export PDF/DOCX uses server-side rendering — do not use browser print.
resizable-image extension is installed — use it for image nodes.

---

## RTK Query Rules
All API calls go through RTK Query slices in apps/frontend/redux/.
Use cache invalidation tags correctly — providesTags / invalidatesTags.
NEVER make raw fetch calls in components.
NEVER put API logic inside React components.
Optimistic updates must have rollback on error.

---

## Admin Dashboard Rules
Metrics refresh every 10 seconds — do not change this interval.
CPU calculation uses os.cpus() idle/total delta — do not simplify.
Storage estimation: 10x actual DB usage, minimum 100GB baseline.
Health thresholds: green <50%, blue <70%, yellow <85%, red >85%.
Admin routes require admin role check middleware — never skip it.
Code splitting with React.lazy is required for admin panel.

---

## File Read Priority by Task Type
Before starting any task, identify which services are involved,
then read these files first (one read per session):

Billing/Stripe task:
  → apps/backend/src/app/modules/Billing/ (billing or webhook routes)
  → check for stripe.webhooks.constructEvent usage

S3/upload task:
  → apps/backend/src/app/ (upload or storage routes)
  → check presigned URL generation

Auth task:
  → apps/frontend/lib/auth/better-auth.ts (better-auth config)
  → apps/frontend/proxy.ts (auth guards, matcher array)
  → apps/backend/src/app/middleware/auth.ts (JWT verification)

pgvector/search task:
  → apps/backend/prisma/schema.prisma (vector column definition)
  → apps/backend/src/app/ (search routes using queryRaw)

TipTap/editor task:
  → apps/frontend/components/tiptap-templates/ (editor components)
  → check auto-save debounce and S3 image upload handler

RTK Query task:
  → apps/frontend/src/redux/api/ (relevant slice)
  → check providesTags and invalidatesTags

Admin task:
  → apps/backend/src/app/modules/Admin/ (admin routes, metrics calculation)
  → check admin role middleware

WebSocket/Collaboration task (Phase 10):
  → apps/socket-server/src/server.ts (Render-deployed WebSocket server)
  → apps/backend/src/app/modules/WebSocket/socketServer.ts (in-app socket.io setup)
  → apps/frontend/src/lib/yjs/useCollabSync.ts (Y.js + socket.io provider)
  → apps/frontend/src/hooks/useDiscussionSocket.ts (live discussion hook)
  → apps/frontend/src/components/discussions/LiveDiscussionFeed.tsx
  → check NEXT_PUBLIC_WS_URL env var in all .env files
  → verify socket.io JWT auth handshake matches backend JWT_SECRET

Notification/Analytics task (Phase 7):
  → apps/backend/src/app/modules/Notification/ (broadcast, SSE, settings)
  → apps/backend/src/app/modules/Analytics/ (personal, workspace, usage, export)
  → apps/backend/src/app/modules/Reports/ (admin reports + CSV/JSON gen)
  → apps/backend/src/app/modules/AuditLog/ (admin audit + export)
  → apps/backend/src/app/modules/Webhooks/ (outbound webhooks + deliveries)
  → apps/frontend/src/hooks/useNotificationStream.ts (SSE consumer)
  → apps/frontend/src/components/notifications/ (bell + list components)
  → apps/frontend/src/components/analytics/ (PageHeader, StatCard, etc.)
  → check notificationBroadcaster usage and NotificationStreamProvider mount

Cache/revalidation task:
  → Check if updateTag or revalidateTag('tag','max') is appropriate
  → Read existing Server Actions for revalidateTag patterns

Prisma/DB task:
  → apps/backend/prisma/schema.prisma (always read first)
  → check vector columns and composite indexes before migrations

---

## Before Implementing Anything
1. State the goal in one sentence
2. List all services involved (S3, Stripe, pgvector, Auth, TipTap, Admin, SSE, Analytics)
3. List exact files you will read
4. Identify risks: breaking webhooks, losing vectors, auth bypass, S3 exposure, SSE leaks
5. State your implementation approach
6. THEN write code

Do not generate any code before completing steps 1-5.

---

## Never Do
- Never use pnpm, npm, npx — always yarn
- Never forget --sql on yarn db:generate
- Never import backend into frontend
- Never use Prisma in frontend
- Never store files locally in production
- Never expose AWS credentials in frontend
- Never update subscription status from frontend
- Never remove pgvector columns or vector indexes
- Never remove composite indexes without review
- Never run prisma migrate reset in production
- Never run prisma db push in production
- Never add console.log for debugging
- Never install packages without user confirmation
- Never touch .env.production files
- Never commit .env or .env.production
- Never call save on every TipTap keystroke
- Never make raw fetch calls inside React components
- Never skip Stripe webhook signature verification
- Never skip admin role middleware
- Never use synchronous params, searchParams, cookies(), or headers()
- Never recreate middleware.ts — proxy.ts is the replacement
- Never add useMemo/useCallback/memo() — React Compiler handles it
- Never use next lint — it is removed in v16, use eslint . directly
- Never use images.domains — use images.remotePatterns only
- Never use unstable_cacheLife or unstable_cacheTag prefix
- Never call revalidateTag with one argument — requires 'max' second arg

## Always Do
- Run yarn type-check after TypeScript changes
- Run yarn db:generate after schema changes (with --sql)
- Run yarn lint after significant changes
- Use presigned URLs for all S3 operations
- Keep Stripe webhook handlers idempotent
- Keep RTK Query cache tags consistent
- Keep Redux slices in apps/frontend/redux/
- Keep admin panel code-split with React.lazy
- Follow the 5-step pre-implementation checklist above
- Always await params, searchParams, cookies(), headers()
- Always use proxy.ts for new auth guard patterns
- Use updateTag for immediate user-facing updates
- Use revalidateTag('tag', 'max') for background cache invalidation
- Use PageProps<'/path'>, LayoutProps, RouteContext type helpers

---

## Next.js 16 Specific Rules

### Async Request APIs (Breaking change — fully enforced in v16)
params, searchParams, cookies(), headers(), draftMode()
are ALL async. Must always be awaited.

  CORRECT:
    const { id } = await props.params
    const store = await cookies()
    const list = await headers()

  NEVER:
    const { id } = props.params  (synchronous — removed in v16)
    const store = cookies()      (synchronous — removed in v16)

Type helpers (generated by next typegen):
  Page components:   PageProps<'/path/[param]'>
  Layout components: LayoutProps
  Route handlers:    RouteContext

### Routing
middleware.ts is renamed to proxy.ts in this project.
The exported function is named proxy, not middleware.
NEVER recreate middleware.ts — use proxy.ts only.
matcher config in proxy.ts controls auth guards.

### Auth — better-auth
better-auth replaces NextAuth.js v4.
Auth config: lib/auth/better-auth.ts
Auth client: lib/auth/authClient.ts (useSession, signIn, signOut)
API route: app/api/auth/[...auth]/route.ts
Session is managed by better-auth with backend sync via callbacks.
Redux authSlice persists the actual accessToken for backend API calls.

### Caching APIs
revalidateTag now requires second argument:
  revalidateTag('papers', 'max')       — background revalidation
  updateTag('user-profile')            — immediate update (Server Actions)
  refresh()                            — refresh client router

Stable imports (no unstable_ prefix):
  import { cacheLife, cacheTag } from 'next/cache'

### Turbopack (now default)
Turbopack is default for next dev and next build.
No --turbopack flag needed in scripts.
turbopack config is top-level in next.config.ts (not experimental).
Filesystem caching enabled: experimental.turbopackFileSystemCacheForDev
Dev output goes to .next/dev (not .next).

### React 19.2 + React Compiler
React Compiler is enabled (reactCompiler: true in next.config.ts).
Do NOT add useMemo, useCallback, or memo() manually.
The compiler handles memoization automatically.
Adding manual memoization on top will cause double-memoization bugs.

### Image Configuration
images.domains is removed — use images.remotePatterns only.
S3/R2 domains must be in remotePatterns with hostname only.
minimumCacheTTL is set to 60s (overriding v16 default of 4hrs).
imageSizes no longer includes 16px by default.

### Commands updated for v16
yarn dev   → uses Turbopack automatically (no flag needed)
yarn build → uses Turbopack automatically (no flag needed)
yarn lint  → runs eslint . (not next lint — removed in v16)

---

## Additional Constraints from .cursor/rules/ (read-only source)

### Backend Module Architecture
- Feature modules live under `apps/backend/src/app/modules/` with structure: controller, service, routes, validation schemas.
- Routes register ONLY in `apps/backend/src/app/routes` — never register ad-hoc routes elsewhere.
- Controllers must be thin; all business logic belongs in services.
- Services use Prisma client from shared singleton; handle transactions explicitly when needed.
- Zod for request body, param, and query validation; reject early on failure.

### Database Operations
- **Prefer Prisma ORM** (`findMany`, `create`, `update`, `delete`, `upsert`, `count`, etc.) for new database operations — typed queries provide better type safety, refactoring support, and readability.
- **Keep existing `$queryRaw` / `$executeRaw` calls as-is** — do not rewrite working raw SQL unless there is a specific performance or correctness issue.
- **When raw SQL is needed** (pgvector similarity, complex aggregations, CTEs not supported by Prisma):
  - Use template literal syntax for SQL injection prevention: `WHERE email = ${email}`
  - Use `prisma.$queryRaw<Type[]>` for proper typing.
  - Select only required fields; never use `SELECT *`.
  - Use `LIMIT ${limit} OFFSET ${skip}` for pagination; never return unbounded lists.
- **EXCEPTION — OAuth operations MUST keep standard Prisma Client upsert:**
  - `createAccount()`, `createOrUpdateUser()`, `createOrUpdateUserWithOAuth()`
  - Changing these to raw queries causes P2002 unique constraint errors.

### TypedSQL & Raw SQL Files
- Raw SQL statements live in `apps/backend/prisma/sql/` with ONE statement per file.
- File names must be valid JavaScript identifiers (no leading dashes) because they become generated function names.
- Use positional parameters `$1`, `$2` with optional `-- @param {Type} $1:name` comments.
- After adding/modifying SQL, run `yarn db:generate` to regenerate typed functions.
- Import generated functions from `@prisma/client/sql`.
- Execute typed queries with `prisma.$queryRawTyped(queryName(...params))` or `prisma.$queryRaw(...)`.
- Always apply pending migrations BEFORE running `prisma generate --sql`.
- Every new TypedSQL query must have at least one test verifying shape and performance assumptions.
- Above any raw query usage, add a comment referencing the originating `.sql` file.

### Frontend Component & Design Standards
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

### Sonner Toast & Error Handling Patterns
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

### Production-Ready Security & Performance Standards
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

### pgvector Detailed Rules
- Only run similarity queries if `USE_PGVECTOR=true`.
- `PaperChunk.embedding` column type is `vector`; migrations manage any transition from JSON fallback.
- Use a service helper to format float arrays into vector literals (`[x,y,z]`).
- Similarity operators: `<->` (L2), `<=>` (cosine), `<#>` (negative inner product). Align index operator class with chosen operator.
- Create IVF index (`ivfflat`) only after sufficient data volume; document chosen `lists` parameter.
- Limit result sets (e.g., `LIMIT 10`); avoid full vector scans.
- Guard against mismatched dimensionality; validate embedding array length before insert.
- Add round-trip test (insert + similarity query) when modifying embedding logic.

### Auth Specifics
- Frontend authentication state is managed via Redux Toolkit (in addition to NextAuth session).
- OAuth account creation MUST use standard Prisma upsert pattern; do NOT convert to raw SQL.
- Password strength indicators on register forms.
- Auth guards for protected routes.
- All auth functions must have JSDoc comments.
- Authentication-related code requires minimum 90% test coverage.
- Comprehensive integration tests required for all auth endpoints and flows.

### Role-Based Access Control (Phase 5+)
- Use the `requireRole(role)` factory from `apps/backend/src/app/middleware/requireRole.ts` for new RBAC routes. Convenience wrappers: `requireTeamLead`, `requireAdmin`.
- Apply the middleware AFTER `authMiddleware` in the route chain (RBAC needs an authenticated user first).
- Reject with `ApiError(403, "Insufficient permissions. Required: {role}, got: {userRole}")` — do not silently 200.
- For per-resource ownership checks (e.g. "only the workspace owner can edit settings"), perform the check inside the service via raw SQL or Prisma where/select, not in the middleware.
- For frontend role gating in `AppSidebar`, set `minRole: USER_ROLES.TEAM_LEAD` on the navigation item — `hasRoleAccess` handles the rest.
- Use `lib/auth/roles.ts` constants (`USER_ROLES.RESEARCHER`, etc.) and `hasRoleAccess(userRole, requiredRole)` — never compare role strings directly.

### Email Delivery (Phase 5+)
- Transactional emails route through `emailService` in `apps/backend/src/app/shared/emailService.ts`.
- Dispatcher priority: Resend (if `RESEND_API_KEY` is set in env) → existing SMTP/Gmail transporter.
- Resend uses the built-in `fetch` API (`https://api.resend.com/emails`); no SDK dependency.
- Never add new SMTP providers without keeping Gmail as the fallback — never break local dev for users without the env var.
- New email templates are methods on `EmailService` (e.g. `sendTeamInvitationEmail(data)`); HTML is inlined in the method for now. If a template gets large, refactor to a `templates/` directory but keep the dispatcher call signature stable.
- Email send failures are logged but NEVER thrown — the main flow (invitation, etc.) must complete even if email delivery fails. Surface failures via `console.error` in dev, silent in production.

### Workflow & Documentation Discipline
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

### Development Server Ports
- Frontend dev server: port 3000
- Backend dev server: port 5000

---

## Project Repository
**GitHub:** https://github.com/Atik203/Scholar-Flow

---

## Implementation Tracking
**Before starting any task, check `IMPLEMENTATION.md` to understand:**
1. What phase is currently active
2. What has been completed (marked `[x]`)
3. What is pending (marked `[ ]`)
4. Current status and focus area

**How to use IMPLEMENTATION.md:**
- Read it first to understand the project roadmap
- Check the "Current Status" section at the bottom
- Identify which phase items are unchecked
- Do not work on items from future phases unless explicitly requested
- Mark completed items as `[x]` after implementation

**Current Status:** Phase 10 ✅ — COMPLETE (Release 1.3.1)
- Phase 1 ✅ (Static Marketing Pages — 18-20 pages done)
- Phase 2 ✅ (Auth & Onboarding Pages — 5-6 pages done)
- Phase 3 ✅ (Dashboard Shell & Core Pages)
- Phase 4 ✅ (Papers & Collections)
- Phase 5 ✅ (Workspaces & Team)
- Phase 6 ✅ (Discussions, Notes & Citations — Notebook hierarchy, 7 new pages, 2 new citation formats, 3 new RTK slices)
- Phase 7 ✅ (Analytics, Notifications & Admin — Real SSE broadcaster, 8 new admin pages, 7 new user-facing pages, 8 new RTK slices, persisted notification settings, `useNotificationStream` hook + `NotificationBell` popover, 6 new Prisma models)
- Phase 8 ✅ (Architecture stabilization — unified entry points, removed dead code, fixed `any` types, standardized exports, 14 new pages)
- Phase 9 ✅ (Polish & Performance — 8 remaining pages, invitation backend, WCAG 2.1 AA, code splitting, Cache-Control headers)
- Phase 10 ✅ (AI context persistence, chat overhaul, token optimization, Vercel production stability)
- Next.js 16 migration ✅ (Async APIs, proxy.ts, React Compiler, Turbopack default)
- better-auth migration ✅ (replaced NextAuth.js v4)
- Prisma v7 migration ✅ (driver adapter required)
- Current focus: Release 1.3.1 — AI architecture overhaul, Vercel crash fix, build fixes
- Framework: Next.js 16, React 19.2, Turbopack default, Prisma 7.8.0
- React Compiler: enabled (do not add manual memoization)

---

## Project Context Generation (Repomix)
**Repomix** is installed as a dev dependency for generating AI-friendly project snapshots.

### When to regenerate
- After major structural changes (new directories, moved files)
- After adding new dependencies or build tools
- Before asking a new AI agent to work on the project
- When the project context seems stale

### How to generate
```bash
# From project root
npx repomix
# Or using the configured output
yarn repomix
```

**Output file:** `repomix-output.xml` (8MB+ AI-friendly project snapshot)

### What repomix includes
- All source code (TS, TSX, JS, JSX, CSS, SCSS, JSON, Prisma, SQL)
- Configuration files (package.json, tsconfig, etc.)
- Documentation (README, AGENTS.md, IMPLEMENTATION.md, etc.)
- Excludes: node_modules, images, LaTeX files, build artifacts, logs

### What repomix ignores (configured in repomix.config.ts)
- **scholar-flow-overleaf/** — LaTeX thesis/document files (SRS, chapters, images)
- **response_image/** — Generated image responses
- **images/** — Static image assets
- **node_modules/**, **.yarn/** — Package dependencies
- **.next/**, **dist/**, **out/** — Build outputs
- **.git/**, **.turbo/**, **.vercel/** — VCS & deployment artifacts
- **.vscode/**, **.cursor/**, **.agents/**, **.figma/** — IDE & tool configs
- **CHANGELOG.md**, **LICENSE.md**, **CODE_OF_CONDUCT.md** — Meta docs
- **Logs, coverage, media files** — Non-code assets

### Using repomix output with AI
1. Run `npx repomix` to generate `repomix-output.xml`
2. Provide the file to an AI agent for full project context
3. The AI gets a complete, token-efficient project snapshot
4. Reference specific files by path when asking questions

**Note:** The `repomix-output.xml` is already generated and available in the project root.

---

## Query Performance Rules — Target: <50ms per Prisma query event

### Verified Current State
- Prisma singleton is already globalThis-cached in `apps/backend/src/app/shared/prisma.ts`. Do not rewrite it as a plain module-level `new PrismaClient`.
- Adapter is `@prisma/adapter-pg` (node-postgres TCP pooling). DO NOT switch back to `@prisma/adapter-ppg` (HTTP-based, no keep-alive, 1500-2500ms per query from Bangladesh to US East).
- `PaperChunk.embedding` is enabled via `Unsupported("vector")`. HNSW index is created via migration.
- There are two `paper.service.ts` files. Active file is `apps/backend/src/app/modules/papers/paper.service.ts` (imported by `paper.controller.ts`).
- `@prisma/sqlcommenter-query-insights` is installed and wired into the singleton for Query Insights attribution.
- `prisma/seed.js` was modified to import `PrismaPg` adapter + generated client instead of raw `@prisma/client` (Prisma 7 requires adapter for client instantiation).

### Terminal Query-Time Visibility
- The singleton registers a Prisma `$on('query')` listener in development.
- Any query event over 50ms is logged to the terminal as:
  `[SLOW QUERY] {duration}ms | {query first 150 chars} | params: {params first 80 chars}`
- This logging is the primary measurement tool — do not remove it.
- After each optimization, restart the backend and hit the affected endpoints; watch the terminal for slow-query warnings before/after.

### Select Discipline
- All list queries must use explicit `select`.
- Never fetch `embedding` or binary file content in list views.
- PaperChunk list views select `id, content, page, idx, paperId` only.

### Relation Loading
- Add `relationLoadStrategy: 'join'` only to `findMany` calls. It is invalid on `findFirst`, `create`, `update`, `upsert`.
- Keep explicit `select` inside every `include`.

### Pagination
- Cursor-based pagination for papers, search, workspaces, notifications, and activity logs.
- Keep offset pagination only where `skip` is bounded by a small constant (e.g., cursor exclusion `skip: 1`).

### Indexes
- New indexes use `CREATE INDEX CONCURRENTLY IF NOT EXISTS`.
- Verify exact table/column case against `schema.prisma`.
- HNSW vector index uses `vector_cosine_ops` with `m = 16, ef_construction = 64`.

### Version Alignment
- Keep `@prisma/client`, `prisma`, and `@prisma/adapter-*` on the same minor version.

### Verification Workflow
1. Apply one optimization at a time.
2. Restart `yarn dev:backend`.
3. Hit the affected endpoint(s) from the frontend or with `curl`.
4. Check the terminal for `[SLOW QUERY]` output.
5. Confirm duration dropped below 50ms before moving to the next fix.
6. Run `yarn type-check` and `yarn lint` after each significant change.

---

## Local Development Database

### Database Setup

**Primary: Prisma Postgres (Cloud)** — used for both local dev and production
- `DATABASE_URL` = Accelerate endpoint in `.env` (runtime queries via proxy)
- `DIRECT_DATABASE_URL` = Direct PostgreSQL URL for migrations and adapter
- No local database needed — Prisma Cloud manages it

**Fallback: PostgreSQL 18 in WSL** (for offline dev or cloud issues)
- Install: `sudo apt install -y postgresql-18 postgresql-18-pgvector`
- Start:   `sudo pg_ctlcluster 18 main start`
- Stop:    `sudo pg_ctlcluster 18 main stop`
- Status:  `sudo pg_lsclusters`
- Default port: 5432

### Database Initialization (after fresh install)
```bash
# Create the database
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'admin';"
sudo -u postgres psql -c "CREATE DATABASE scholarflow_dev;"

# Enable required extensions
sudo -u postgres psql -d scholarflow_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
sudo -u postgres psql -d scholarflow_dev -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# Run migrations (overriding DATABASE_URL for local introspection)
DATABASE_URL="postgres://postgres:admin@localhost:5432/scholarflow_dev" yarn db:migrate

# Generate client and seed
yarn db:generate --sql
DATABASE_URL="postgres://postgres:admin@localhost:5432/scholarflow_dev" yarn db:seed
```

### Environment Strategy
- `.env` → Local development (`DIRECT_DATABASE_URL = postgres://postgres:admin@localhost:5432/scholarflow_dev`)
- `.env.production` → Cloud/Production (`DIRECT_DATABASE_URL` points to Prisma Cloud or deployed DB)
- The PG adapter picks up `DIRECT_DATABASE_URL` from whichever `.env` is loaded
- Never commit `.env` or `.env.production` (already in `.gitignore`)

### Migration Discipline
- ALWAYS use `yarn db:migrate` — never `prisma db push`
- Fresh local DB = all migrations apply cleanly → no drift
- If drift appears locally: create reconciliation migration via `prisma migrate dev --create-only --name <name>`
- If drift appears on cloud: create a reconciliation migration, do NOT reset
- `prisma.config.ts` uses `DATABASE_URL` for migration, `DIRECT_DATABASE_URL` for directUrl
- Run `yarn db:generate --sql` after every migration
- When `prisma migrate dev` prompts for a new migration name (no pending migrations), press Ctrl+C and use `prisma migrate dev --create-only --name <name>` instead, then `prisma migrate deploy` to apply

### Migration Drift (learned the hard way)
The schema in `schema.prisma` has accumulated columns and tables that were added to the production database via `prisma db push` (bypassing migration history). This causes `ColumnNotFound` errors when migrating a new database. Detection:
```bash
# Compare current DB columns with schema
psql "postgres://postgres:admin@localhost:5432/scholarflow_dev" -At -c "SELECT column_name FROM information_schema.columns WHERE table_name = '<ModelName>' AND table_schema = 'public' ORDER BY ordinal_position;"
```
Fix: Run `prisma migrate dev --create-only --name reconcile_schema_drift` with `DATABASE_URL` pointing to the drift-free database. Review the generated SQL carefully — it may contain destructive operations (column drops, type changes) if the schema diverged. Apply with `prisma migrate deploy`.

### Adapter Configuration
- Adapter: `@prisma/adapter-pg` with `pg` driver (TCP connection pooling)
- Connection: passes `DIRECT_DATABASE_URL` to adapter
- Works with any standard `postgres://` URL (local, cloud, any provider)
- Pooling: `pg` driver pools TCP connections natively (no extra config needed)
- DO NOT use `@prisma/adapter-ppg` — no HTTP keep-alive, 1500ms+ per query with cloud DB latency from Bangladesh

### Seed Script
- Location: `apps/backend/prisma/seed.js` (CommonJS)
- Script: `yarn db:seed` → runs `ts-node prisma/seed.js`
- Uses `@prisma/adapter-pg` with `PrismaPg` adapter (imported from generated client)
- Default password for all demo users: `password123`
- Demo users: admin@scholarflow.com, researcher@scholarflow.com, pro.researcher@scholarflow.com, teamlead@scholarflow.com
- Must override `DATABASE_URL` + `DIRECT_DATABASE_URL` to local URL when seeding local DB (WSL fallback) or Prisma Cloud URLs when seeding cloud DB

### Performance Verification Workflow
1. Ensure local PG18 is running: `sudo pg_ctlcluster 18 main start`
2. Start backend: `yarn dev:backend`
3. Hit any DB endpoint from dashboard or curl
4. Terminal shows `[SLOW QUERY] {duration}ms` for any query >50ms
5. On localhost: expect <10ms (vs 240ms to US East)
6. On deployed US East backend: expect <50ms
7. If >50ms with local DB, check for missing indexes or N+1 queries
