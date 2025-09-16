# GitHub Copilot Instructions

## Project Overview

**Project Name**: ScholarFlow  
**Type**: AI-Powered Research Paper Collaboration Hub  
**Architecture**: Monorepo with Next.js frontend and Express.js backend  
**Phase**: Phase 1 Development (MVP) - Authentication Complete ✅  
**Project Start**: August 2025  
**Developer**: Md. Atikur Rahaman (GitHub: Atik203)

## Core Standards

### Package Manager & Environment

- Use Yarn Berry (v4) only. Never use `npm` in this repo.
- Dev entrypoint: `yarn dev:turbo` (runs frontend and backend together).
- Keep `.env` in sync. When adding a variable, document it and update both apps' `.env.example`.
- Default ports: frontend `3000`, backend `5000`.

### Technology Stack

- Frontend: Next.js 15 + TypeScript + Tailwind CSS + ShadCN UI + Redux Toolkit Query + NextAuth.js + React Hook Form + Zod
- Backend: Express.js + TypeScript + PostgreSQL + Prisma ORM + JWT + bcrypt + Zod
- Database: PostgreSQL with `pgvector` extension (AI features ready)

## ✅ Major Recent Completions

- Paper Management System (Sep 17, 2025): S3 integration, PDF processing, metadata extraction, advanced search, modern UI/UX.
- OAuth Authentication System: Google/GitHub OAuth, JWT management, production-grade error handling, 5/5 integration tests passing.

## Golden Rules (must-follow)

1. TypeScript everywhere. No implicit `any`.
2. File naming: `module.type.ts` (e.g., `auth.controller.ts`, `user.service.ts`, `paper.validation.ts`, `paper.routes.ts`).
3. Validation with Zod on all inputs. Backend: use request validators + `validateRequest` middleware. Frontend: use `zodResolver` with React Hook Form.
4. Error handling: wrap route handlers with `catchAsync`; throw `ApiError` for expected failures; let `globalErrorHandler` map Prisma/validation errors.
5. Auth: Use standard Prisma upsert patterns for OAuth account linking and user/session records.
6. Database access (important):
   - Prefer `prisma.$queryRaw` for reads and `prisma.$executeRaw` for writes with parameterized queries (tagged templates or placeholders).
   - Never use `prisma.$queryRawUnsafe`. ESLint enforces this.
   - Use Prisma Client model ops only where established (OAuth upserts, seed/bootstrap, selective user/workspace creation). Otherwise stick to `$queryRaw/$executeRaw`.
   - Always paginate and filter; don’t ship unbounded queries.
7. Security: Never log secrets. Enforce strict CORS, secure cookies, sanitize inputs, and validate all user-controlled data.
8. Performance: Paginate, add indexes, and cache hot reads when applicable (follow patterns already present in services).
9. Git hygiene: Conventional commits, small focused PRs, descriptive titles, linked issues, and stick to the current Roadmap phase.

## Repository Structure (high-level)

- `apps/backend/src/app/`
  - `modules/` feature folders (e.g., `Auth/`, `User/`, `Paper/`, `Collection/`)
  - `middleware/` (`auth.ts`, `validateRequest.ts`, `globalErrorHandler.ts`)
  - `shared/` (`prisma.ts`, `catchAsync.ts`, token utilities)
  - `errors/` (`ApiError.ts`)
- `apps/frontend/src/`
  - `app/` (Next.js App Router pages and routes)
  - `components/` + `components/customUI/form/` (e.g., `ScholarFlowForm.tsx`)
  - `lib/validators.ts` (Zod schemas for common flows: auth, profile, paper, collection)
  - `redux/`, `hooks/`, `lib/`, `middleware/`
- `docs/` and `.github/` contain process and agent guidance

## Day-to-day Commands

```bash
# Bootstrap
yarn install

# Dev (both apps)
yarn dev:turbo

# Database (run from repo root)
yarn db:migrate    # Prisma migrate dev
yarn db:generate   # Generate Prisma client (+ TypedSQL artifacts)
yarn db:studio     # Open Prisma Studio

# Quality gates
yarn lint
yarn type-check
yarn build
yarn test
```

## Backend Patterns (what to copy)

- Use the shared Prisma instance from `apps/backend/src/app/shared/prisma.ts`.
- Prefer `$queryRaw`/`$executeRaw` with parameterization:
  - Use tagged template literals: ``await prisma.$queryRaw`SELECT \* FROM "User" WHERE id = ${userId}```
  - Or positional placeholders: `await prisma.$queryRaw('SELECT ... WHERE id = $1', userId)`
  - Never build SQL via string concatenation.
- Known allowed Prisma Client model ops: OAuth upserts, specific user/workspace bootstrap paths (see `Auth` and `papers` services). Otherwise, stick to raw ops.
- Controllers: use `catchAsync` to wrap handlers and throw `ApiError` for invalid input, forbidden/unauthorized, and not-found cases.
- Validation: define Zod schemas and enforce with `validateRequest` middleware. Do not trust request bodies or query params.
- Error handling: `globalErrorHandler` maps `ApiError`, Prisma client errors, and generic failures to consistent responses.
- Auth middleware: `auth.ts` decodes JWT, loads user via `$queryRaw`, and enforces roles/permissions.

## Frontend Patterns (what to copy)

- App Router structure under `apps/frontend/src/app/*`.
- Forms: React Hook Form + Zod resolver; prefer shared schemas in `lib/validators.ts`.
- UI: ShadCN components; use `components/customUI/form/ScholarFlowForm.tsx` for common form wiring.
- State/data: RTK Query for API calls; align endpoints and shapes with backend controllers.
- Auth: NextAuth integration is present; keep environment vars in sync and avoid leaking secrets to the client.

## Environment & Feature Flags

- Common variables used across the repo include (non-exhaustive): `DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, S3/AWS creds, `FRONTEND_URL`, `BACKEND_URL`, `USE_PGVECTOR`, and feature flags (e.g., upload toggles).
- When you introduce a new variable:
  - Add it to both apps' `.env.example`.
  - Reference it through a config module; never access `process.env` ad-hoc all over the code.
  - Document it in PR description and, if needed, in `docs/ENVIRONMENT.md`.

## Phase 1 MVP Scope

1. User Authentication & Profile Management ✅
   - Google OAuth + email/password, user profile, password reset.
2. Paper Upload & Storage ✅
   - File processing, S3 storage, PDF metadata, advanced search, responsive UI.
3. Basic Collections 🚧
   - Create/manage collections, assign papers, sharing/permissions, filtering.

## Roadmap Discipline

- Always consult `Roadmap.md` and work sequentially: finish Phase 1 before starting Phase 2/3.
- Map any change to current phase. Defer out-of-phase ideas to “Next steps” in the PR.
- Keep PRs small and scoped to one milestone/feature.

## Documentation Update Protocol

When changing authentication, UI/UX, or core patterns:

1. Update `.cursor/rules/*.mdc` with new or revised patterns.
2. Update `.github/instructions/*.md` with implementation guidance as needed.
3. Update `docs/UI_DESIGN.md` for UI component or layout changes.
4. Update `Roadmap.md` to reflect progress/completion.
5. Add feature flags to both backend and frontend `.env.example` files.
6. Update `README.md` only for major milestones or architecture changes.

## Common Pitfalls to Avoid

- Using `npm` or adding `package-lock.json`. Use Yarn Berry only.
- Writing raw SQL with string concatenation or using `$queryRawUnsafe`.
- Using Prisma Client model methods where `$queryRaw/$executeRaw` is the standard (outside of the documented exceptions).
- Skipping Zod validation or bypassing `validateRequest`.
- Throwing generic `Error` in controllers instead of `ApiError`.
- Unbounded queries without pagination or missing indexes on hot paths.
- Adding environment variables without updating `.env.example` and docs.
- Mixing Phase 1 and later-phase features in a single PR.

---

Last updated: Phase 1 MVP Development — Paper Management System Completed ✅ (Sep 17, 2025)

Next milestone: Complete Phase 1 collections features (create/assign papers to collections) before Phase 2.
