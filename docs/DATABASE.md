# Database Setup Guide

This guide covers setting up PostgreSQL with the pgvector extension, configuring Prisma, and working with database migrations.

By the end of this guide, you'll have a running PostgreSQL database connected to Scholar-Flow with all tables created.

## Prerequisites

- **PostgreSQL 15+** installed (check with `psql --version`)
- **pgvector extension** available (required for semantic search features)
- **Git** — for cloning the repo (already done if you followed the Setup Guide)

## Step 1: Install PostgreSQL

### Option A: Ubuntu/Debian (WSL or Linux)

```bash
sudo apt install -y postgresql-18 postgresql-18-pgvector
sudo pg_ctlcluster 18 main start
```

### Option B: macOS (Homebrew)

```bash
brew install postgresql@18
brew install pgvector
brew services start postgresql@18
```

### Option C: Docker (Works on All Platforms)

```bash
docker run -d \
  --name scholar-postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=scholarflow_dev \
  -p 5432:5432 \
  pgvector/pgvector:pg18
```

This runs PostgreSQL 18 with pgvector pre-installed. The database `scholarflow_dev` is created automatically.

### Option D: Windows (Direct)

Download from [postgresql.org](https://www.postgresql.org/download/windows/) and install the EDB installer, selecting the pgvector component during installation.

## Step 2: Create the Database

Once PostgreSQL is running, create the database:

```bash
# Using createdb (simplest)
createdb scholarflow_dev

# Or using psql
sudo -u postgres psql -c "CREATE DATABASE scholarflow_dev;"
```

### Set a Password (if needed)

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'admin';"
```

## Step 3: Enable the pgvector Extension

```bash
sudo -u postgres psql -d scholarflow_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
sudo -u postgres psql -d scholarflow_dev -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

**What these do:**
- `vector` — enables AI-powered semantic search (stores embeddings)
- `pg_trgm` — enables trigram text search (for fuzzy matching)

### Verify pgvector is Enabled

```bash
sudo -u postgres psql -d scholarflow_dev -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

You should see a row with `extname = 'vector'`.

## Step 4: Configure Prisma Connection

In `apps/backend/.env`, set these two variables:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
```

Replace `postgres:admin` with your PostgreSQL username and password.

**Why two URLs?**
- `DATABASE_URL` — used by Prisma Accelerate (cloud proxy) for runtime queries
- `DIRECT_DATABASE_URL` — used by migrations and the pg adapter for direct connections

In local development, both can point to the same local database.

## Step 5: Run Migrations

```bash
yarn db:migrate
```

Run this from: the repo root

This creates all database tables defined in `apps/backend/prisma/schema.prisma`.

**First time:** Prisma will prompt for a migration name. Enter something descriptive like:
```
initial_setup_with_pgvector
```

**Expected output:**
```
Your database is now in sync with your schema.
```

### Migration Discipline Checklist

- [ ] Always use `yarn db:migrate` — never `prisma db push` (db push bypasses migration history)
- [ ] Run `yarn db:generate --sql` after every migration to rebuild the typed client
- [ ] Keep migrations additive (don't drop columns that might have data in production)
- [ ] Never drop pgvector columns or vector indexes in production
- [ ] If you see drift, create a reconciliation migration — don't reset

## Step 6: Generate the Prisma Client

```bash
yarn db:generate
```

Run this from: the repo root

This builds the Prisma client with typed SQL query support. Run this any time the schema changes.

## Step 7: (Optional) Seed Sample Data

```bash
yarn db:seed
```

This populates the database with demo users and sample data for development.

## Step 8: Verify with Prisma Studio

```bash
yarn db:studio
```

This opens a browser-based GUI at http://localhost:5555 where you can browse and edit database tables visually. It's a great way to inspect data during development.

## Common Database Workflows

### After Editing the Prisma Schema

```bash
# 1. Create migration and apply it
yarn db:migrate

# 2. Regenerate the client
yarn db:generate
```

### Reset Local Database (Drops ALL Data)

```bash
yarn db:reset
```

This runs `prisma migrate reset --force` — it drops all tables and re-runs all migrations. Use this when you want a clean slate. You'll need to re-seed after:

```bash
yarn db:seed
```

### View Database Manually

```bash
psql -d scholarflow_dev -c "\dt"           # List all tables
psql -d scholarflow_dev -c "\d Paper"       # Describe a specific table
```

### Check for Migration Drift

If the production database has changed outside of migrations (e.g., someone ran `prisma db push`), you may see drift. Detect it:

```bash
psql "postgres://postgres:admin@localhost:5432/scholarflow_dev" -At -c \
  "SELECT column_name FROM information_schema.columns WHERE table_name = 'Paper' AND table_schema = 'public' ORDER BY ordinal_position;"
```

Fix drift by creating a reconciliation migration:

```bash
yarn db:migrate --create-only --name reconcile_schema_drift
```

## Prisma Client Usage Tips

### Prefer Prisma ORM (typed queries)

```typescript
const papers = await prisma.paper.findMany({
  where: { workspaceId },
  select: { id: true, title: true, createdAt: true },
})
```

### Use Raw SQL Only When Needed

Raw SQL is required for pgvector operations and complex aggregations. Use `$queryRaw` with template literals:

```typescript
const results = await prisma.$queryRaw<PaperChunk[]>`
  SELECT id, content, page, idx
  FROM "PaperChunk"
  ORDER BY embedding <=> ${embedding}::vector
  LIMIT 10
`
```

### Select Only What You Need

Always use explicit `select` in list queries. Never fetch `embedding` or binary file content in list views.

## Troubleshooting

**Problem: `FATAL: role "postgres" does not exist`**
Cause: PostgreSQL was installed but no default user was created.
Fix: `sudo -u postgres createuser --superuser $USER` or use the OS user.

**Problem: `Extension "vector" not available`**
Cause: The pgvector extension isn't installed.
Fix: Install the `postgresql-18-pgvector` package (see Step 1), or use the Docker image with pgvector pre-installed.

**Problem: `Port 5432 already in use`**
Cause: Another PostgreSQL instance is running, or the port is occupied.
Fix: Check with `sudo lsof -i :5432` and stop the other process, or change the port in `.env`.

**Problem: `Error: getaddrinfo ENOTFOUND`**
Cause: PostgreSQL isn't running or the connection URL has a typo.
Fix: Start PostgreSQL (`sudo pg_ctlcluster 18 main start`) and double-check `DATABASE_URL`.

**Problem: Prisma migration fails with "no changes detected"**
Cause: Prisma doesn't see a difference between the schema and the database.
Fix: This is normal if you already applied the migration. If you need to force a new migration, make a real change to `schema.prisma` first.

## Related Docs

- [Setup Guide](./SETUP.md) — full environment setup
- [Environment Variables](./ENVIRONMENT.md) — env var reference
- [ERD Reference](./ERD.md) — entity relationship diagrams
- [Redis Setup](./REDIS_SETUP.md) — optional Redis for background jobs
