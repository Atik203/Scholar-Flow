# pgvector Semantic Search Skill

## When to use this skill
Any task involving: semantic search, embeddings, vector similarity,
AI metadata extraction, search ranking, paper recommendations.

## Pre-task checklist
1. Read schema.prisma first — locate vector columns
2. Check embedding dimension (must not change)
3. Check existing queryRaw patterns for vector ops

## Key patterns
Embedding generation: OpenAI or similar → float array → stored as vector
Search: queryRaw with <-> (L2) or <=> (cosine) operator
Index: IVFFlat or HNSW — check which is used before adding new ones
Metadata extraction: title/author/abstract extracted from PDF on upload

## Critical constraints
- Prisma does not natively support vector type — always use queryRaw
- NEVER use prisma.$queryRawUnsafe with user input — use parameterized
- NEVER drop vector columns or vector indexes
- NEVER change the embedding dimension in production
- NEVER run prisma migrate reset — it drops pgvector extension
- After schema changes: yarn db:generate (with --sql flag)
- pgvector extension must be created before first migration

## Files to read first
apps/backend/prisma/schema.prisma → vector column definitions
apps/backend/src/app/ → search routes
