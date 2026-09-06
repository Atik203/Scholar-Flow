# Scholar-Flow Quickstart

Get running in ~5 minutes. For detailed explanations, see [Setup Guide](./SETUP.md).

## Prerequisites

- **Node.js 24+**, **Yarn 4.9.2+** (`corepack enable && corepack prepare yarn@4.9.2 --activate`)
- **PostgreSQL 15+** with pgvector
- **Git**

No PostgreSQL yet?
```bash
docker run -d --name scholar-pg -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=scholarflow_dev -p 5432:5432 pgvector/pgvector:pg18
```

## Quick Commands

```bash
# 1. Clone
git clone https://github.com/Atik203/Scholar-Flow.git && cd Scholar-Flow

# 2. Copy env templates
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env

# 3. Set DB connection (edit apps/backend/.env)
#    DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
#    DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev

# 4. Install deps + generate Prisma client
yarn setup

# 5. Create tables (prompted: type "initial_setup")
yarn db:migrate

# 6. (Optional) Seed demo data
yarn db:seed

# 7. Start all dev servers
yarn dev:turbo
```

## Verify

```bash
curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}
```

Open http://localhost:3000. If seeded, log in with `admin@scholarflow.com` / `password123`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `command not found: yarn` | `corepack enable && corepack prepare yarn@4.9.2 --activate` |
| `ECONNREFUSED` database | Start PostgreSQL or Docker container |
| `Port 3000 already in use` | `lsof -ti:3000 \| xargs kill -9` |
| `Cannot find module '@prisma/client'` | `yarn db:generate` |

## Next Steps

- [Setup Guide](./SETUP.md) — detailed configuration
- [Development Guide](./DEVELOPMENT.md) — day-to-day workflow
- [Environment Variables](./ENVIRONMENT.md) — OAuth, AI, S3 setup
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector
- [Contributing Guide](../CONTRIBUTING.md) — how to contribute
