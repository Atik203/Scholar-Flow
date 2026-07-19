# Scholar-Flow Setup Guide

This guide walks you through setting up Scholar-Flow for local development from scratch. By the end, you'll have the frontend, backend API, and WebSocket server running on your machine.

## Prerequisites

Before starting, make sure you have these installed:

- **Node.js >= 24.0.0** — check with `node --version`
- **Yarn >= 4.9.2** (Berry) — check with `yarn --version`
- **PostgreSQL 15+** — running locally or via Docker
- **pgvector extension** — enabled in your PostgreSQL database
- **Git** — for cloning the repo

If you don't have PostgreSQL yet, see the [Database Setup Guide](./DATABASE.md) for installation instructions.

## Architecture Overview

This is a Turborepo monorepo with three apps:

```
Scholar-Flow/
├── apps/
│   ├── frontend/          # Next.js 16 web app (port 3000)
│   │   ├── src/app/       # App Router pages
│   │   ├── components/    # UI components (shadcn/ui)
│   │   └── redux/         # RTK Query state management
│   ├── backend/           # Express.js REST API (port 5000)
│   │   ├── src/app/       # Controllers, routes, middleware
│   │   └── prisma/        # Schema + migrations
│   └── socket-server/     # Socket.io real-time server (port 5001)
├── docs/                  # All documentation
└── .github/               # CI/CD workflows
```

Data flows: **Frontend** → HTTP/REST → **Backend** → Prisma → **PostgreSQL**.
Real-time features: **Frontend** → WebSocket → **Socket-server** (no database access).

## Step-by-Step Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/Atik203/Scholar-Flow.git
cd Scholar-Flow
```

### Step 2: Copy environment files

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env
```

Run this from: the repo root (`/path/to/Scholar-Flow`)

These are template files. You'll need to fill in your own values for secrets and API keys. For now, the defaults are enough to get the dev servers running.

### Step 3: Configure database connection

Open `apps/backend/.env` and set your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
```

Replace `postgres:admin` with your actual PostgreSQL username and password. The database must already exist — create it with:

```bash
createdb scholarflow_dev
```

Or via psql:

```bash
sudo -u postgres psql -c "CREATE DATABASE scholarflow_dev;"
```

### Step 4: Install dependencies and generate Prisma client

```bash
yarn setup
```

Run this from: the repo root

This command runs `yarn install` (installs all dependencies for all three apps) followed by `prisma generate --sql` (generates the Prisma client with typed SQL queries).

**Expected output:** You should see `Done in Xs` from Yarn, followed by Prisma generation messages with no errors.

### Step 5: Run database migrations

```bash
yarn db:migrate
```

Run this from: the repo root

This creates all the database tables defined in `apps/backend/prisma/schema.prisma`. The first time you run it, Prisma will prompt you for a migration name — enter something like `initial_setup`.

**Expected output:** `Your database is now in sync with your schema.`

### Step 6: (Optional) Seed sample data

```bash
yarn db:seed
```

Run this from: the repo root

This populates the database with demo users and sample data. Demo accounts created:

| Email | Password | Role |
|-------|----------|------|
| admin@scholarflow.com | password123 | Admin |
| researcher@scholarflow.com | password123 | Researcher |
| pro.researcher@scholarflow.com | password123 | Pro Researcher |
| teamlead@scholarflow.com | password123 | Team Lead |

### Step 7: Start development servers

```bash
yarn dev:turbo
```

Run this from: the repo root

This starts all three apps simultaneously using Turborepo's parallel execution:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js web app |
| Backend API | http://localhost:5000 | Express.js REST API |
| WebSocket | http://localhost:5001 | Socket.io real-time server |

**Expected output:** You'll see logs from all three services. Look for lines like `ready started server on http://localhost:3000` and `Server running on port 5000`.

## Running Individual Apps

If you only need one service (e.g., working only on the backend):

```bash
yarn dev:backend     # Backend only on port 5000
yarn dev:frontend    # Frontend only on port 3000
```

Run this from: the repo root

> Note: `yarn dev` also works — it starts all three apps using background processes. `yarn dev:turbo` is preferred because it gives cleaner parallel output.

## Verify Everything Works

Once the dev servers are running, run these checks:

```bash
# Check the backend health endpoint
curl http://localhost:5000/api/health

# Expected: { "status": "ok", ... }
```

```bash
# Check the frontend loads
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Expected: 200
```

Open http://localhost:3000 in your browser. You should see the Scholar-Flow login page.

## Available Scripts

| Command | What it does |
|---------|-------------|
| `yarn setup` | Install + Prisma generate (one-step bootstrap) |
| `yarn dev:turbo` | Start all three dev servers |
| `yarn dev:frontend` | Frontend only |
| `yarn dev:backend` | Backend only |
| `yarn build` | Build all apps for production |
| `yarn lint` | ESLint across all apps |
| `yarn type-check` | TypeScript type checking |
| `yarn test` | Run all tests |
| `yarn db:migrate` | Apply Prisma migrations |
| `yarn db:generate` | Re-generate Prisma client |
| `yarn db:studio` | Open Prisma Studio GUI |
| `yarn db:seed` | Seed sample data |
| `yarn db:reset` | Drop and recreate all tables (dev only) |
| `yarn format` | Format with Prettier |
| `yarn clean` | Remove build artifacts |

## Troubleshooting

**Problem: `Error: Cannot find module '@prisma/client'`**
Cause: Prisma client hasn't been generated.
Fix: Run `yarn db:generate`.

**Problem: `Error: getaddrinfo ENOTFOUND` at database connection**
Cause: PostgreSQL isn't running or the connection URL is wrong.
Fix: Start PostgreSQL (`sudo pg_ctlcluster 18 main start`) and verify `DATABASE_URL` in `apps/backend/.env`.

**Problem: `Port 3000 already in use`**
Cause: Another process is using the port.
Fix: Kill the process or change the port in `apps/frontend/package.json` (`next dev -p 3001`).

**Problem: `ERR_DLOPEN_FAILED` or native module errors**
Cause: Node.js version mismatch with compiled native addons.
Fix: Run `yarn clean && yarn setup` to rebuild everything.

**Problem: pgvector extension not found**
Cause: PostgreSQL doesn't have the vector extension installed.
Fix: See the [Database Setup Guide](./DATABASE.md) for pgvector installation.

## Related Docs

- [Quickstart Guide](./QUICKSTART.md) — get running in 5 minutes
- [Environment Variables](./ENVIRONMENT.md) — full env var reference
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector + Prisma
- [Redis Setup](./REDIS_SETUP.md) — optional Redis for background jobs
- [Development Guide](./DEVELOPMENT.md) — day-to-day dev workflow
- [Deployment Guide](./DEPLOY.md) — deploy to production
- [Branch Flow](./BRANCH_FLOW.md) — git strategy
