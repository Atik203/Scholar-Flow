# Contributing to Scholar-Flow

Thanks for your interest in contributing! This guide will help you set up, develop, and submit changes.

## Development Workflow

- Package manager: Yarn Berry (v4). Please use `yarn`, not `npm`.
- Monorepo: apps/frontend (Next.js) and apps/backend (Express + Prisma)

### Prerequisites

- Node.js >= 18
- Yarn >= 4
- PostgreSQL (local or Prisma Postgres)

### Setup

```bash
# Install deps
yarn install

# Generate Prisma client
yarn db:generate

# Run database migrations
yarn db:migrate

# Start dev (both apps via turbo)
yarn dev
```

### Useful scripts (from repo root)

- `yarn dev` – run all dev servers
- `yarn build` – build all packages
- `yarn lint` – run linters
- `yarn type-check` – TS checks across packages
- `yarn db:migrate` – run Prisma migrations
- `yarn db:studio` – open Prisma Studio
- `yarn db:reset` – reset DB (dev only)

## Branching and Commits

- Use feature branches: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Keep PRs small and focused.

## Coding Standards

- TypeScript strict, no implicit any.
- Backend: use `catchAsync`, `ApiError`, `sendResponse`, and Zod validation.
- Frontend: prefer Server Components, Tailwind + ShadCN; use RTK Query for data.
- Add or update tests when changing behavior.

## Environment

- Backend env in `apps/backend/.env`; Frontend in `apps/frontend/.env.local`.
- Respect `FRONTEND_URL` for CORS in backend config.
- Never commit secrets.

## Pull Requests

- Link issues and describe changes clearly.
- Include screenshots or logs for UI or error changes when useful.
- Ensure CI passes: build, lint, type-check, tests.

## Conduct and Security

- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Report vulnerabilities via [SECURITY](./SECURITY.md).

Thank you for contributing!
