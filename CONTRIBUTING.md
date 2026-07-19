# Contributing to Scholar-Flow

Thanks for your interest in contributing! This guide walks you through setting up the project, making changes, and submitting them.

## Prerequisites

Make sure you have these installed before starting:

- **Node.js >= 24** (check with `node --version`)
- **Yarn >= 4.9.2** (check with `yarn --version` — the project uses Yarn Berry, not npm)
- **PostgreSQL 15+** with the **pgvector** extension enabled
- **Git** (for cloning and creating pull requests)

> If you're new to the project, start with the [Quickstart Guide](./docs/QUICKSTART.md) to get running in 5 minutes.

## Project Overview

This is a **Turborepo** monorepo with three workspaces:

| Workspace | Directory | Port | Purpose |
|-----------|-----------|------|---------|
| `@scholar-flow/frontend` | `apps/frontend/` | 3000 | Next.js 16 web app |
| `@scholar-flow/backend` | `apps/backend/` | 5000 | Express.js REST API |
| `@scholar-flow/socket-server` | `apps/socket-server/` | 5001 | Socket.io real-time server |

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/Atik203/Scholar-Flow.git
cd Scholar-Flow

# 2. Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env

# 3. Install dependencies, generate Prisma client
yarn setup

# 4. Run database migrations
yarn db:migrate

# 5. (Optional) Seed sample data
yarn db:seed

# 6. Start all dev servers
yarn dev:turbo
```

For detailed setup, see [docs/SETUP.md](./docs/SETUP.md) and [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md).

## Useful Scripts

Run these from the repo root:

| Command | What it does |
|---------|-------------|
| `yarn dev:turbo` | Start all three dev servers (frontend, backend, socket-server) |
| `yarn dev:frontend` | Start frontend only |
| `yarn dev:backend` | Start backend only |
| `yarn build` | Build all packages for production |
| `yarn lint` | Run ESLint across all packages |
| `yarn type-check` | TypeScript type checking |
| `yarn test` | Run all test suites |
| `yarn db:migrate` | Apply database migrations |
| `yarn db:generate` | Re-generate Prisma client (`--sql` flag always) |
| `yarn db:studio` | Open Prisma Studio (GUI database browser) |
| `yarn db:seed` | Seed database with sample data |
| `yarn db:reset` | Reset database (dev only — drops all data) |
| `yarn setup` | Install + Prisma generate |
| `yarn format` | Format code with Prettier |

## Branching and Commits

### Branch Structure

This project uses a **strict one-way branch flow**: changes always move forward.

```
feature-branch → atik → dev → main
```

No reverse merges are allowed (dev→atik, main→dev, main→atik are all blocked by automation).

### For Contributors (non-admin)

1. Branch off `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/my-feature
   ```

2. Make changes, commit using [Conventional Commits](https://www.conventionalcommits.org/):

   | Prefix | Example |
   |--------|---------|
   | `feat:` | `feat: add DOI import button` |
   | `fix:` | `fix: handle empty paper title` |
   | `docs:` | `docs: update setup guide` |
   | `chore:` | `chore: bump dependencies` |
   | `refactor:` | `refactor: extract upload service` |
   | `test:` | `test: add billing webhook tests` |

3. Push and create a PR into `dev`:

   ```bash
   git push origin feat/my-feature
   ```

4. After review, squash-merge into `dev`. The `dev` → `main` merge happens automatically via GitHub Actions.

### For Admins (Atik)

Push directly to the `atik` branch. GitHub Actions auto-merges `atik → dev`, then triggers `dev → main`.

### Code Style

- **TypeScript strict** — no implicit `any`, no `@ts-ignore`
- **Backend**: use `catchAsync`, `ApiError`, `sendResponse`, and Zod validation for all routes
- **Frontend**: prefer Server Components; only add `"use client"` when you need interactivity; use RTK Query for API calls (never raw `fetch`)
- **React Compiler** is enabled — do NOT add `useMemo`, `useCallback`, or `memo()` manually
- Add or update tests when changing behavior

## Your First PR

1. Find an open issue or feature you want to work on
2. Comment on the issue to let others know you're working on it
3. Follow the branching flow above
4. Run `yarn type-check` and `yarn lint` before submitting
5. Open a PR with a clear description of what you changed and why

## Environment Variables

- Backend env: `apps/backend/.env`
- Frontend env: `apps/frontend/.env.local`
- Socket-server env: `apps/socket-server/.env`

Never commit `.env` files or real secrets. See [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) for the full list.

## Pull Request Checklist

- [ ] Build passes (`yarn build`)
- [ ] TypeScript checks pass (`yarn type-check`)
- [ ] Lint passes (`yarn lint`)
- [ ] Tests pass (`yarn test`)
- [ ] No secrets committed
- [ ] Description explains _what_ and _why_ (not just _how_)
- [ ] Linked to relevant issue (if any)

## Conduct and Security

- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md)
- Report vulnerabilities via [SECURITY.md](./SECURITY.md)

Thank you for contributing!
