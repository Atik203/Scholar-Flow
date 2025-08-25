---
applyTo: "apps/backend/**"
---

## ✅ Phase 1 Status: OAuth Authentication System Complete

Production-ready authentication with comprehensive testing and proper error handling.

## Development Standards

- Use Express + TypeScript with feature modules: service -> controller -> routes. Place routes under `src/app/routes` (canonical).
- Error handling: wrap async handlers with `catchAsync`; throw `ApiError`; use `globalErrorHandler` and `sendResponse` for consistency.
- Validation: Zod for all inputs at the route boundary. Sanitize inputs; rate-limit sensitive endpoints.
- Auth: JWT (access/refresh). Store secrets in `.env` only; never log secrets. Use `auth` middleware for protected routes.
- Prisma: write queries in services; paginate via helper; update schema via migrations, then `prisma generate`.
- Config is centralized in `src/config/index.ts` (loads `.env`). Respect `FRONTEND_URL` for CORS; default API port is 5000.
- Logging: use morgan in non-production; prefer structured logs for app-level events.
- Testing: unit test services; integration test routes. Keep tests fast and deterministic.
- Lint/typecheck on each change: `yarn lint`, `yarn type-check`. Avoid implicit `any`, unused exports.
- Do not create new endpoints outside `src/app/routes`. Do not use npm; use Yarn v4 workspaces.

## ✅ Authentication Implementation Standards

**CRITICAL: Use established OAuth patterns only**

- **OAuth Account Management**: ALWAYS use standard Prisma upsert for OAuth accounts (proven pattern)
- **Database Operations**: Prefer Prisma Client operations. Document any raw SQL usage with clear warnings
- **Error Handling**: Comprehensive ApiError usage with consistent error messages ✅
- **Testing Coverage**: All authentication flows have integration tests (5/5 passing) ✅
- **Security**: JWT with proper expiry, refresh token rotation, input validation ✅

## TypedSQL & Database

- Use TypedSQL for complex queries that can't be expressed in Prisma Client
- Raw SQL files under `apps/backend/prisma/sql/` with typed functions
- Always run `yarn db:generate` after adding new .sql files
- Ensure migrations are applied before generating SQL types

Roadmap discipline:

- Follow `Roadmap.md` sequence strictly: complete Phase 1 items (auth ✅, uploads, collections, basic search) before Phase 2, then Phase 3.
- If a feature request is out-of-phase, document it and add minimal scaffolding only if needed to unblock Phase 1.

Env discipline:

- Always check both envs: `apps/backend/.env` and `apps/frontend/.env.local` for integration points.
- Backend CORS should use `FRONTEND_URL` (use `http://localhost:3000` in dev). Never commit secrets; document new keys.
- Use feature flags: `FEATURE_*` variables for gating backend features

Phase overview (summary):

- Phase 1: Auth ✅, profile, file uploads (S3 planned), paper/collection CRUD, basic search.
- Phase 2: Collaboration (roles, shared collections/workspaces), citation graph/formatting, improved UI.
- Phase 3: Billing (Stripe/SSLCommerz), admin tooling, external integrations, QA and launch.
