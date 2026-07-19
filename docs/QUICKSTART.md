# Scholar-Flow Quickstart

Get Scholar-Flow running on your machine in 10 steps. This guide is for **absolute beginners** — no prior knowledge of the codebase assumed.

**Time to complete:** ~10-15 minutes

## Prerequisites

- **Node.js 24+** — check with `node --version`
- **Yarn 4.9.2+** — check with `yarn --version`
- **PostgreSQL 15+** — running on your machine or in Docker
- **Git** — installed and configured

> Don't have PostgreSQL yet? See the [Database Setup Guide](./DATABASE.md). For Docker users, run:
> ```bash
> docker run -d --name scholar-pg -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=scholarflow_dev -p 5432:5432 postgres:16
> ```

## Step-by-Step

### Step 1: Clone the repository

```bash
git clone https://github.com/Atik203/Scholar-Flow.git
cd Scholar-Flow
```

### Step 2: Copy environment templates

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env
```

### Step 3: Set your database connection

Edit `apps/backend/.env` and set the two database URLs:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
```

Replace `postgres:admin` with your actual PostgreSQL username and password.

### Step 4: Install dependencies

```bash
yarn setup
```

Run from: repo root
This installs everything and generates the Prisma client. Takes ~30-60 seconds.

### Step 5: Create database tables

```bash
yarn db:migrate
```

Run from: repo root
If prompted for a name, type `initial_setup` and press Enter.

### Step 6: (Optional) Add sample data

```bash
yarn db:seed
```

This creates demo accounts you can log into. See the output for email/password combos.

### Step 7: Start the dev servers

```bash
yarn dev:turbo
```

Run from: repo root
This starts all three services. Wait until you see:

```
ready - started server on http://localhost:3000
Server running on port 5000
Socket server running on port 5001
```

### Step 8: Verify the backend

Open a new terminal and run:

```bash
curl http://localhost:5000/api/health
```

Expected output (something like):
```json
{"status":"ok","timestamp":"..."}
```

### Step 9: Open the app

Open http://localhost:3000 in your browser. You should see the Scholar-Flow login page.

If you seeded the database, log in with:
- **Email:** `admin@scholarflow.com`
- **Password:** `password123`

### Step 10: You're done! 🎉

You now have a fully running Scholar-Flow development environment. Here's what to do next:

- Read the [Setup Guide](./SETUP.md) for detailed configuration options
- Read the [Development Guide](./DEVELOPMENT.md) for day-to-day workflow
- Read the [Environment Variables Guide](./ENVIRONMENT.md) to configure OAuth, AI, S3, etc.
- Read the [Contributing Guide](../CONTRIBUTING.md) to start making changes

## Troubleshooting

**"command not found: yarn"** → Install Yarn Berry: `corepack enable && corepack prepare yarn@4.9.2 --activate`

**"ECONNREFUSED" at database** → PostgreSQL isn't running. Start it with `sudo pg_ctlcluster 18 main start` or your Docker container.

**"Port 3000 already in use"** → Kill the process: `lsof -ti:3000 | xargs kill -9`

**"Cannot find module '@prisma/client'"** → Run `yarn db:generate`

## Related Docs

- [Setup Guide](./SETUP.md) — detailed setup
- [Environment Variables](./ENVIRONMENT.md) — all env vars explained
- [Development Guide](./DEVELOPMENT.md) — common dev tasks
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector
- [Redis Setup](./REDIS_SETUP.md) — optional Redis
