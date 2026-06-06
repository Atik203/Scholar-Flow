# Prisma Migration Skill

## When to use this skill
Any task involving: schema changes, new models, new fields, indexes,
database migrations, seeding, schema introspection, pgvector columns.

## Pre-task checklist
1. Read apps/backend/prisma/schema.prisma COMPLETELY first
2. Check for vector columns (pgvector) — never accidentally drop them
3. Check composite indexes — note them before any changes
4. Check if migration is for dev or production

## Commands (exact)
Development migration:  yarn db:migrate   (prisma migrate dev)
Generate client:        yarn db:generate  (prisma generate --sql)
Reset dev DB:           yarn db:reset     (migrate reset --force)
View data:              yarn db:studio

ALWAYS run yarn db:generate after any schema change.
The --sql flag is required — it is already in the yarn script.

## pgvector special handling
pgvector extension must exist before any vector migration.
Vector columns use Unsupported("vector(N)") type in Prisma schema.
Vector operations require queryRaw — not standard Prisma client.
Prisma migrate reset DROPS the pgvector extension — never use in production.
Vector index (IVFFlat/HNSW) must be re-created manually after reset.

## Composite indexes
Scholar-Flow uses composite indexes for performance.
NEVER remove a composite index without user confirmation.
Check @@index entries in schema.prisma before any refactor.

## Critical constraints
- NEVER use prisma db push in production
- NEVER use prisma migrate reset in production
- ALWAYS use prisma migrate dev for development
- ALWAYS use prisma migrate deploy for production (CI/CD)
- ALWAYS preserve vector columns and their indexes
- ALWAYS run yarn db:generate after schema changes

## Files to read first
apps/backend/prisma/schema.prisma (always, always first)
