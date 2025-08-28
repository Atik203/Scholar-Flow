# GitHub Copilot AI Agent Instructions

## Project Overview

**Project Name**: ScholarFlow  
**Type**: AI-Powered Research Paper Collaboration Hub  
**Architecture**: Monorepo with Next.js frontend and Express.js backend  
**Phase**: Phase 1 Development (MVP) - Authentication Complete ✅
**Project Start**: August 2025
**Developer**: Md. Atikur Rahaman (GitHub: Atik203)

- use yarn dev:turbo to run frontend and backend
- Package manager: Yarn (Berry). Do not use npm in this repo.
- Check for any .env file changes
- Document any new environment variables required for features
- For any UI/UX changes or component decisions, FIRST consult `docs/UI_DESIGN.md` (canonical phased UI blueprint) and only summarize deltas in PRs.

## ✅ Major Recent Completion

**OAuth Authentication System:** Production-ready with Google/GitHub OAuth, JWT management, comprehensive error handling, and full integration test suite (5/5 tests passing).

## Technology Stack

### Frontend (apps/frontend)

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components + Styled Coloring + Animation
- **State Management**: Redux Toolkit Query (RTK Query)
- **Authentication**: NextAuth.js (Auth.js) with JWT strategy
- **Forms**: React Hook Form + Zod validation

### Frontend Improvements & Design System

**IMPORTANT**: All frontend improvements must follow the phased approach outlined in `Improvements.md` and update tracking documents.

**Key Documents:**

- **Improvements.md**: Complete roadmap with 5 phases and checkboxes
- **CHANGELOG.md**: Implementation progress tracking
- **UI_DESIGN.md**: UI/UX design guidelines
- **Roadmap.md**: Project roadmap

**Implementation Workflow:**

1. Check current phase in `Improvements.md`
2. Follow DRY patterns and existing design system
3. After completion: ✅ Update checkboxes, 📝 Update CHANGELOG.md, 🔄 Update progress
4. Maintain OKLCH color system and `max-w-[1440px]` container width

**Current Phase**: Phase 1 (Core Design System & Navigation) - CRITICAL
**Next Priority**: Modern SaaS Navbar with Dropdowns
**Project Start**: August 2025
**Developer**: Md. Atikur Rahaman (GitHub: Atik203)

### Backend (apps/backend)

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM with raw query using TypeSQL
- **Authentication**: JWT-based with bcrypt
- **Architecture**: Modular feature-based structure (controllers, services, routes, schemas)
- **File Structure**:

## Raw Queries & TypedSQL

TypedSQL preview feature is enabled in `schema.prisma` (`previewFeatures = ["postgresqlExtensions", "typedSql"]`).

Workflow:

1. Add `.sql` files under `apps/backend/prisma/sql/` (filenames must be valid JS identifiers, not start with `$`).
2. Run `yarn db:generate` (root script) or `yarn workspace @scholar-flow/backend db:generate` – both invoke `prisma generate --sql` to produce typed functions.
3. Import generated functions from `@prisma/client/sql`.
4. Execute with `prisma.$queryRawTyped(queryFunction(...params))` for full type safety.

Current helper scripts:

- Backend: `db:generate` (one-off) and `db:generate:watch` (continuous) include `--sql`.
- Root: `db:generate` also includes `--sql`.

Example simple pagination query files now present:

```
prisma/sql/getUsersWithPagination.sql
prisma/sql/countUsers.sql
```

Example usage in service (see `apps/backend/src/app/modules/User/user.service.ts`):

```ts
import { getUsersWithPagination, countUsers } from "@prisma/client/sql";
// const rows = await prisma.$queryRawTyped(getUsersWithPagination(limit, skip));
// const totalRow = await prisma.$queryRawTyped(countUsers());
```

Guidelines:

- Prefer Prisma Client query builder for dynamic filters; introduce TypedSQL when:
  - Complex joins / aggregations not ergonomic in Prisma Client
  - Performance-critical read paths where explicit SQL + indexes are tuned
- When adding parameters, use positional `$1`, `$2`, etc. and optionally type comments:
  `-- @param {Int} $1:limit` `-- @param {Int} $2:skip`
- For array parameters in Postgres, use `= ANY($1)` (inference supported).
- Keep SQL files focused (one statement per file) for clearer generated types.

Quality & Safety:

- Always apply pending migrations before running `prisma generate --sql`.
- Avoid dynamic column injection; if unavoidable, fall back to `$queryRawUnsafe` with strong validation.
- Ensure any new raw queries are covered by at least one unit/integration test before merging.

Add a short comment referencing the originating `.sql` file above any usage site in code for traceability.

### pgvector Integration (Similarity Search)

We use the `pgvector` Postgres extension for embedding similarity on `PaperChunk.embedding`.

Current state:

- Schema defines `embedding Unsupported("vector")?`
- Migration `20250817165000_add_pgvector_column` enables the extension and converts the column.
- Fallback before extension: earlier migration used JSON; new migration upgrades when extension available.

Environment variables:

```
DATABASE_URL=...                # Normal connection (can be Accelerate)
DIRECT_DATABASE_URL=...         # Superuser / direct connection for extension management
USE_PGVECTOR=true               # Feature flag to run similarity code
```

Install dependency (already added): `pgvector` (Node helper – mainly for future client-side formatting if needed).

Manual steps (run once per database):

1. Connect with superuser: `psql $DIRECT_DATABASE_URL`
2. `CREATE EXTENSION IF NOT EXISTS vector;`
3. Run migrations: `yarn db:migrate`
4. (Optional) Create IVF index after data grows: `CREATE INDEX paperchunk_embedding_ivfflat_idx ON "PaperChunk" USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);`

Inserting embeddings:
Use `embedding.service.ts` (`embeddingService.saveChunkEmbedding(id, floatArray)`) which builds a vector literal and updates the row.

Similarity search (raw SQL example):

```sql
SELECT id, "paperId", idx, page, content, (embedding <-> $1) AS distance
FROM "PaperChunk"
ORDER BY embedding <-> $1
LIMIT 10;
```

Use `<->` (L2), `<#>` (negative inner product), `<=>` (cosine distance) depending on model; adjust index ops accordingly.

Testing checklist before enabling in prod:

- Extension exists (`SELECT extname FROM pg_extension WHERE extname='vector';`)
- Column type is `vector` (`\d+ "PaperChunk"`)
- Insert & search round trip works.

## Roadmap-driven workflow

- Always consult `Roadmap.md` and work sequentially: complete Phase 1 before Phase 2, then Phase 3.
- When proposing changes, map them to the current phase; defer out-of-phase work to "Next steps".
- Prefer small PRs that align with the current milestone; avoid mixing cross-phase scope in one change.

## Development Guidelines

### Code Style & Patterns

1. **Feature-based modular structure**: Separate concerns with service, controller, routes per feature
2. **TypeScript First**: All code must be properly typed, no implicit `any`
3. **Error Handling**: Use catchAsync wrapper and ApiError class consistently
4. **Response Format**: Use consistent API response format with sendResponse utility
5. **Validation**: Use Zod for all input validation, never trust client data
6. **Database**: Use Prisma with proper transaction handling
   - **IMPORTANT**: Prefer standard Prisma operations over raw SQL when possible
   - Use TypedSQL only for complex queries that can't be expressed in Prisma Client
   - Always add clear documentation when using raw queries to prevent issues
7. **Testing**: Comprehensive tests for critical features (auth, payments, data integrity)
   - Unit tests for services and business logic
   - Integration tests for API endpoints and database operations
   - Test coverage for authentication flows and error scenarios
8. **Authentication**:
   - Use standard Prisma upsert for OAuth account management
   - Implement proper token refresh and expiry handling
   - Always test authentication flows thoroughly
9. **Lint/Format**: Enforce ESLint + Prettier; no unused exports or implicit any
10. **Git hygiene**: Conventional commits, small PRs, descriptive titles, linked issues

### Phase 1 MVP Features (Current Priority)

1. **User Authentication & Profile Management**
   - Sign up/login with Google OAuth + email/password
   - User profile management
   - Password reset functionality

2. **Paper Upload & Storage**
   - File processing and text extraction

3. **Basic Collections**
   - Create and manage paper collections
   - Add/remove papers from collections
   - Share collections with other users
   - Basic permission management

### Environment Setup

- **Backend**: Port 5000, uses `apps/backend/.env`
- **Frontend**: Port 3000 (per script), uses `apps/frontend/.env.local`
- **Database**: PostgreSQL with pgvector extension (future)

Environment discipline:

- Before changing behavior, check both env files for active config: `apps/backend/.env` and `apps/frontend/.env.local`.
- Backend config keys load via `apps/backend/src/config/index.ts`. Respect `FRONTEND_URL` (use `http://localhost:3000` in dev) for CORS.
- Never commit secrets; propose placeholders and document required variables when adding features.

## Current Project Status

### ✅ Completed (Phase 1 Progress)

- [x] Monorepo setup with Turbo
- [x] Basic project structure with modular architecture
- [x] Backend modular architecture with feature-based structure
- [x] Prisma schema with comprehensive data model
- [x] Frontend setup with Next.js and ShadCN UI components
- [x] **OAuth Authentication System (PRODUCTION READY)**
  - [x] Google OAuth integration with proper upsert handling
  - [x] GitHub OAuth configuration ready
  - [x] JWT-based authentication with secure token management
  - [x] Comprehensive integration test suite (5/5 tests passing)
  - [x] Production-ready error handling and unique constraint management
  - [x] Login/Register UI with form validation and responsive design
  - [x] Password strength indicators and error state handling
- [x] Windows setup script (setup.bat)
- [x] TypedSQL integration with fallback patterns
- [x] pgvector extension setup for future AI features
- [x] **UI Design Blueprint and Documentation**
  - [x] Complete phase-based UI design documentation
  - [x] Feature flag strategy implementation
  - [x] Component taxonomy and accessibility standards

### 🚧 In Progress

- [ ] User profile management UI
- [ ] File upload with cloud storage
- [ ] Password reset functionality

## Important Commands

```bash
# Bootstrap
yarn install

# Development via turbo (if configured)


# Prisma (from repo root)
## Key Files to Understand

yarn db:migrate   # Run database migrations

# Backend only
1. **Backend Entry**: `apps/backend/src/server.ts`

# Frontend only
3. **API Routes**: `apps/backend/src/app/routes/index.ts`
```

4. **Frontend Layout**: `apps/frontend/src/app/layout.tsx`

## Common Patterns

export const userService = {
getAllFromDB: async (params: any, options: IPaginationOptions) => {
// Implementation with pagination
},
getByIdFromDB: async (id: string) => {
// Implementation
},
};

````

### Backend Controller Pattern

```typescript
// user.controller.ts
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllFromDB(req.query, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});
```

### Authentication Service Pattern (CRITICAL)

```typescript
// ALWAYS use standard Prisma upsert for OAuth accounts
// DO NOT change to raw queries - causes constraint errors
async createAccount(userId: string, accountData: IAccountData) {
  try {
    const account = await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: accountData.provider,
          providerAccountId: accountData.providerAccountId,
        },
      },
      update: {
        // Update existing account tokens
        refresh_token: accountData.refresh_token,
        access_token: accountData.access_token,
        expires_at: accountData.expires_at,
        // ... other fields
      },
      create: {
        // Create new account
        userId,
        type: accountData.type,
        provider: accountData.provider,
        // ... all required fields
      },
    });
    return account;
  } catch (error) {
    console.error("Error creating account:", error);
    throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
  }
}
```

### Testing Pattern

```typescript
// Integration tests for critical features
describe("AuthService OAuth Integration", () => {
  it("should handle OAuth sign-in for new user", async () => {
    const result = await authService.handleOAuthSignIn(
      mockOAuthProfile,
      mockAccountData
    );
    expect(result).toBeDefined();
    expect(result.email).toBe(mockOAuthProfile.email);
  });

  it("should handle duplicate account creation (upsert)", async () => {
    // First creation
    await authService.createAccount(userId, accountData);
    // Second creation should not fail
    const result = await authService.createAccount(userId, updatedAccountData);
    expect(result).toBeDefined();
  });
});
````

### Frontend API Pattern

```typescript
// Use RTK Query for API calls
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
  }),
});
```

## Development Best Practices

1. **Always use TypeScript**: No `any` unless unavoidable; enable strict mode
2. **Error Handling**: Wrap async with `catchAsync`; surface typed errors via `ApiError`
3. **Validation**: Validate all inputs with Zod; never trust client data
4. **Testing**: Target core business logic and critical flows; keep tests fast and deterministic
5. **Authentication**: Use standard Prisma upsert for OAuth; test all auth flows comprehensively
6. **Database**: Prefer Prisma Client over raw SQL; document any raw queries with warnings
7. **Security**: Hide secrets; strict CORS; secure cookies; helmet; input sanitization
8. **Performance**: Paginate, index DB queries, cache hot reads (Redis)
9. **Observability**: Structured logs, minimal PII; add tracing hooks for later OpenTelemetry
10. **Docs**: Update README/DEVELOPMENT after notable changes
    - Also update `docs/UI_DESIGN.md` when altering navigation, global layout, or introducing new surface areas; keep README high‑level only.
    - Update `.cursor/rules` and `.github/instructions/` files when establishing new patterns
    - Document any new feature flags in both backend and frontend .env.example files
11. **Release discipline**: Keep main green; use PR checks; avoid breaking changes without migration notes

## Frontend (Next.js) Best Practices for SaaS

### Routing, Data, and Rendering

- Prefer Server Components; use Client Components only when interaction/state is needed
- Use App Router layouts for shared chrome; colocation of route handlers where appropriate
- Fetch on the server when possible; leverage Next.js caching (ISR) for marketing pages
- Use `revalidate`/tag-based invalidation (`revalidateTag`, `revalidatePath`) for content updates
- Choose runtime per route: Edge for fast public pages, Node for Prisma/Node-only libs

### SEO & Metadata

- Use the Metadata API in `layout.tsx`/`page.tsx` (`title`, `description`, `openGraph`, `twitter`, `alternates.canonical`, `robots`)
- Implement `generateMetadata` for dynamic routes (paper, collection, user)
- Add `app/sitemap.ts` and `app/robots.ts`; include dynamic entries for papers/collections
- Include structured data (JSON-LD) for Organization, WebSite, BreadcrumbList, Article/ScholarlyArticle
- Generate dynamic OG images (`@vercel/og`) for shareable pages

### Performance & UX

- Use `next/image` and `next/font` (self-host fonts); preconnect/prefetch critical resources
- Minimize client JS; split by route/segment; use streaming/Suspense and skeletons for perceived speed
- Debounce searches; paginate or infinite-scroll large lists; avoid N+1 client fetches
- Avoid heavy client-only UI libs when headless + Tailwind suffices

### Accessibility & i18n

- Ensure proper landmarks, labels, focus states, and keyboard navigation
- Maintain color contrast; respect reduced motion
- Plan for i18n (e.g., `next-intl`/`next-i18next`), locale routing, and `hreflang` when applicable

### Auth, Security, and Middleware

- Keep client state minimal; prefer server data flows via RSC
- Handle loading/empty/error states explicitly in UI components

- Consider a PWA manifest for offline reading; track Core Web Vitals and fix regressions
- Load third-party scripts with `next/script` and non-blocking strategies

### Environments & Config

- Separate envs: development, staging, production

- Database migrations via Prisma in CI prior to deploy; generate client on build
- Protect main with required checks; use preview deployments for PRs (frontend)

### Tenancy & Data Isolation

- Scope all data by tenant/team/workspace identifiers; enforce in queries/services
- Consider row-level security (future) or service guardrails to prevent cross-tenant access

### Security

- JWT best practices: short-lived access tokens, refresh rotation, revoke on logout
- HTTP security headers (helmet), rate limiting, input validation, file type/size limits
- Regular dependency audits; pin critical packages; monitor CVEs

### Billing & Plans

- Stripe subscriptions (trial, proration, dunning); webhooks for lifecycle events
- Usage metering where applicable (e.g., AI calls, storage) with daily aggregation
- Grace periods and feature gates based on plan entitlements

### Files & Storage

- Object storage (AWS S3/R2); presigned URLs for upload/download; virus scanning pipeline optional
- CDN for static assets; immutable cache headers; image optimization on the edge (frontend)

### Observability & Ops

- Centralized logs with request IDs; error reporting (e.g., Sentry) for frontend/backend
- Metrics: basic uptime, request latency, error rate; budget SLOs and alerts
- Backups: daily DB backups with restore drills; migration rollback plan

### Background Jobs

- Queue for long-running tasks (e.g., BullMQ with Redis); idempotent handlers and retries

### API & Versioning

- REST with semantic status codes; document in README or OpenAPI (future)
- Version endpoints for breaking changes; sunset policy

## Troubleshooting

### Common Issues

- **Database Connection**: Check `DATABASE_URL` in env files
- **TypeScript Errors**: Run `yarn type-check` to see all errors
- **Build Failures**: Check dependencies and TypeScript configuration
- **Port Conflicts**: Ensure ports 3000 (frontend) and 5000 (backend) are available

### Getting Help

- Check `DEVELOPMENT.md` for detailed setup instructions
- Refer to Next.js, Prisma, and Express.js documentation

---

**Last Updated**: Phase 1 MVP Development - OAuth Authentication System Completed ✅  
**Next Milestone**: Follow Roadmap.md — continue Phase 1 (user profiles, uploads, collections) before Phase 2.

## Recent Major Completion

### OAuth Authentication System ✅

- **Status**: Production-ready and fully tested
- **Implementation**: Standard Prisma upsert patterns (no raw SQL for account management)
- **Testing**: Comprehensive integration test suite (5/5 tests passing)
- **Security**: Proper error handling, token management, unique constraint handling
- **UI/UX**: Complete login/register flows with form validation and responsive design
- **Patterns**: Documented best practices for future authentication work

**Key Achievement**: Resolved P2002 unique constraint violations with proper OAuth account upsert handling.

## Documentation Update Protocol

When making significant changes to authentication, UI/UX, or core patterns:

1. Update relevant `.cursor/rules/*.mdc` files with new patterns
2. Update `.github/instructions/*.md` files with implementation guidance
3. Update `docs/UI_DESIGN.md` for any UI changes or new component patterns
4. Update `Roadmap.md` to reflect completion status
5. Add feature flags to both backend and frontend `.env.example` files
6. Update main `README.md` only for major milestones or architecture changes

## Frontend Improvements Tracking Protocol

**CRITICAL**: All frontend improvements must update tracking documents to maintain progress visibility.

### When Implementing Frontend Features:

1. **Before Starting:**
   - Check current phase in `Improvements.md`
   - Review specific feature requirements and dependencies
   - Understand existing design system (OKLCH colors, component patterns)

2. **During Implementation:**
   - Follow DRY patterns from `Improvements.md`
   - Use existing component variants and styling
   - Maintain consistency with current theme and spacing
   - Implement TypeScript-first with proper typing

3. **After Completion:**
   - ✅ Check off completed items in `Improvements.md` checkboxes
   - 📝 Update `CHANGELOG.md` with implementation details
   - 🔄 Update progress percentages in tracking dashboard
   - 📚 Add implementation notes and code examples
   - 🎯 Update status (Pending → In Progress → Completed)

### Required Updates for Each Feature:

````markdown
#### ✅ [Feature Name]

- **Status**: ✅ Completed
- **Started**: [Date]
- **Completed**: [Date]
- **Files**: [File paths]
- **Progress**: 100%

**Implementation Notes:**

- [Key implementation details]
- [Dependencies added]
- [Testing performed]

**Code Example:**

```tsx
// Relevant code snippet
```
````

```

### Current Implementation Status:
- **Phase 1**: 8% complete (1/12 items in progress)
- **Overall Progress**: 2% complete (1/54 total items)
- **Next Priority**: Modern SaaS Navbar with Dropdowns
- **Target**: Complete Phase 1 by August 2025
- **Project Start**: August 2025
- **Developer**: Md. Atikur Rahaman (GitHub: Atik203)
```
