# Scholar-Flow Setup Guide

From zero to running frontend + backend + WebSocket on your machine.

**Prerequisites:** Node.js 24+, Yarn 4.9.2+, Git, PostgreSQL 15+ with pgvector

> **New here?** Start with [Quickstart Guide](./QUICKSTART.md) for the 5-minute version, then come here for details.

---

## Progress Tracker

- [ ] Clone + env files
- [ ] Database connection
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Seed data (optional)
- [ ] Start servers
- [ ] Verify

---

## Step-by-Step

<details>
<summary><strong>Step 1</strong> — Clone repository & copy env files</summary>

**Clone the repo:**

```bash
git clone https://github.com/Atik203/Scholar-Flow.git
cd Scholar-Flow
```

**Copy environment templates:**

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env
```

`Run from:` repo root

The `.env` files already have safe development defaults. You only need to fill in your PostgreSQL connection string (next step) to get started. OAuth keys, S3 credentials, etc. can be added later.

</details>

<details>
<summary><strong>Step 2</strong> — Configure database connection</summary>

Open `apps/backend/.env` and update the two connection strings:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
```

> `DATABASE_URL` is used by Prisma Accelerate at runtime. `DIRECT_DATABASE_URL` is used by migrations and the pg adapter. Both point to the same local DB in development.

Replace `postgres:admin` with your actual PostgreSQL username and password. The database must exist before continuing:

```bash
# Option A: createdb
createdb scholarflow_dev

# Option B: psql
sudo -u postgres psql -c "CREATE DATABASE scholarflow_dev;"
```

**Expected:** `CREATE DATABASE`

</details>

<details>
<summary><strong>Step 3</strong> — Install dependencies & generate Prisma client</summary>

```bash
yarn setup
```

`Run from:` repo root

What this does:
1. `yarn install` — installs all dependencies for frontend, backend, and socket-server
2. `prisma generate --sql` — generates the Prisma client with typed SQL queries

**Expected output:**

```
Done in 30.5s
✔ Generated Prisma Client (v7.8.0) to ./.yarn/...
$ prisma generate --sql
✔ Generated Prisma Client (v7.8.0) to ./.yarn/...
```

**Takes ~30-60 seconds.** If you see module errors, run `yarn clean && yarn setup` to rebuild native addons.

</details>

<details>
<summary><strong>Step 4</strong> — Run database migrations</summary>

```bash
yarn db:migrate
```

`Run from:` repo root

This creates all tables defined in `apps/backend/prisma/schema.prisma`.

**First time only:** Prisma will prompt for a migration name. Enter something descriptive:

```
? Name of migration » initial_setup
```

**Expected output:**

```
Your database is now in sync with your schema.
```

</details>

<details>
<summary><strong>Step 5</strong> — (Optional) Seed sample data</summary>

```bash
yarn db:seed
```

`Run from:` repo root

Creates demo users so you can log in immediately:

| Email | Password | Role |
|-------|----------|------|
| admin@scholarflow.com | password123 | Admin |
| researcher@scholarflow.com | password123 | Researcher |
| pro.researcher@scholarflow.com | password123 | Pro Researcher |
| teamlead@scholarflow.com | password123 | Team Lead |

</details>

<details>
<summary><strong>Step 6</strong> — Start development servers</summary>

```bash
yarn dev:turbo
```

`Run from:` repo root

Starts all three apps in parallel via Turborepo:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js 16 web app |
| Backend API | http://localhost:5000 | Express.js REST API |
| WebSocket | http://localhost:5001 | Socket.io real-time server |

**Expected output:**

```
ready - started server on http://localhost:3000
Server running on port 5000
Socket server running on port 5001
```

> **Tip:** `yarn dev:frontend` and `yarn dev:backend` start individual apps if you only need one.

</details>

<details>
<summary><strong>Step 7</strong> — Verify everything works</summary>

In a new terminal:

```bash
# Backend health check
curl http://localhost:5000/api/health
```

**Expected response:**

```json
{"status":"ok","timestamp":"2026-07-26T12:00:00.000Z"}
```

Open http://localhost:3000 in your browser. If you seeded the database, log in with `admin@scholarflow.com` / `password123`.

</details>

---

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

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `Cannot find module '@prisma/client'` | Prisma client not generated | `yarn db:generate` |
| `getaddrinfo ENOTFOUND` at database | PostgreSQL not running | `sudo pg_ctlcluster 18 main start` or start Docker |
| `Port 3000 already in use` | Another process on the port | `lsof -ti:3000 \| xargs kill -9` |
| `ERR_DLOPEN_FAILED` | Node.js version mismatch | `yarn clean && yarn setup` |
| pgvector not found | Extension not installed | See [Database Setup Guide](./DATABASE.md) |
| Migration "no changes detected" | Schema up to date already | Make a real change to `schema.prisma` first |

---

## Related Docs

- [Quickstart Guide](./QUICKSTART.md) — get running in 5 minutes
- [Environment Variables](./ENVIRONMENT.md) — full env var reference
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector + Prisma
- [Redis Setup](./REDIS_SETUP.md) — optional Redis for background jobs
- [Development Guide](./DEVELOPMENT.md) — day-to-day dev workflow
- [Deployment Guide](./DEPLOY.md) — deploy to production
