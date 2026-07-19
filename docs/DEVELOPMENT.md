# Scholar-Flow Development Guide

This guide covers day-to-day development workflows: how to add features, fix bugs, run quality checks, and work with the monorepo.

## Prerequisites

You should have completed the [Setup Guide](./SETUP.md) first. By now you should have:

- A running PostgreSQL database
- Three dev servers running on ports 3000, 5000, and 5001
- Access to http://localhost:3000 in your browser

## Project Structure (Where Things Live)

```
apps/
├── frontend/src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Login, register, etc.
│   │   ├── layout/       # Navigation, sidebar, header
│   │   ├── ui/           # shadcn/ui primitives
│   │   └── customUI/     # Project-specific components
│   ├── lib/              # Utilities, auth config, API clients
│   └── redux/            # RTK Query slices and store
├── backend/src/
│   └── app/
│       ├── modules/      # Feature modules (Papers, Auth, Billing, etc.)
│       │   └── [Module]/
│       │       ├── [name].controller.ts
│       │       ├── [name].service.ts
│       │       ├── [name].routes.ts
│       │       └── [name].validation.ts
│       ├── middleware/    # Auth, rate limiting, error handling
│       ├── routes/        # Route registration
│       └── shared/        # Prisma singleton, email service, etc.
├── socket-server/
│   └── src/
│       └── server.ts     # Socket.io server entry point
```

## Common Development Tasks

### Adding a new page (frontend)

```bash
# Create the page file
mkdir -p apps/frontend/src/app/papers/new
touch apps/frontend/src/app/papers/new/page.tsx
```

Pages use the App Router. If the page needs interactive state, add `"use client"` at the top. Otherwise it's a Server Component by default (preferred).

```typescript
// apps/frontend/src/app/papers/new/page.tsx
import { NewPaperForm } from "@/components/papers/NewPaperForm"

export default function NewPaperPage() {
  return <NewPaperForm />
}
```

### Adding a new API endpoint (backend)

Each feature has its own module directory under `apps/backend/src/app/modules/`:

```bash
# Create module files
touch apps/backend/src/app/modules/Reports/reports.controller.ts
touch apps/backend/src/app/modules/Reports/reports.service.ts
touch apps/backend/src/app/modules/Reports/reports.routes.ts
touch apps/backend/src/app/modules/Reports/reports.validation.ts
```

Then register the routes in `apps/backend/src/app/routes/index.ts`.

**Structure rules:**
- Controllers are thin — all business logic goes in services
- All request/response validation uses Zod schemas
- Use `catchAsync` for async error handling
- Use `ApiError` for known error responses
- Use `sendResponse` / `sendSuccessResponse` for consistent response format

### Adding a new database model

1. Edit `apps/backend/prisma/schema.prisma` to add your model
2. Run migrations and regenerate the client:

   ```bash
   yarn db:migrate        # Creates the migration file and applies it
   yarn db:generate       # Rebuilds the Prisma client with --sql flag
   ```

3. Use the new model in your service:

   ```typescript
   import { prisma } from "../../shared/prisma"

   const papers = await prisma.paper.findMany({ ... })
   ```

**Important:** Always use `yarn db:migrate` (not `prisma db push`) for schema changes. See [Database Guide](./DATABASE.md) for migration discipline.

### Working with RTK Query (frontend API calls)

All API calls go through RTK Query slices in `apps/frontend/redux/`. Never make raw `fetch` calls inside components.

```typescript
// redux/api/papersApi.ts
export const papersApi = createApi({
  reducerPath: "papersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getPapers: builder.query<Paper[], void>({
      query: () => "/papers",
    }),
  }),
})

// In a component:
const { data: papers, isLoading } = useGetPapersQuery()
```

### Adding environment variables

1. Add the variable to the appropriate `.env.example` file (frontend or backend)
2. Add it to both `.env` (local) and the Vercel dashboard (production)
3. Document it in [docs/ENVIRONMENT.md](./ENVIRONMENT.md)

## Quality Checks

Run these before committing or opening a PR:

```bash
# TypeScript type checking
yarn type-check

# ESLint (catch bugs and style issues)
yarn lint

# Run tests
yarn test
```

Run all three from the repo root. If any fail, fix the issues before pushing.

## Database Workflow

```bash
# After editing schema.prisma:
yarn db:migrate          # Create and apply migration
yarn db:generate         # Rebuild client with typed SQL

# View/edit data visually:
yarn db:studio           # Opens Prisma Studio in browser

# Reset dev database (drops all data):
yarn db:reset

# Re-seed after reset:
yarn db:seed
```

## Troubleshooting Dev Issues

**Problem: Changes not showing in the browser**
Cause: Next.js caches aggressively in dev.
Fix: Clear the Next.js cache with `rm -rf apps/frontend/.next` and restart.

**Problem: TypeScript errors after pulling new code**
Cause: New Prisma models or API endpoints added by someone else.
Fix: Run `yarn db:generate` to rebuild the client, then `yarn type-check`.

**Problem: "Module not found" errors**
Cause: A new dependency was added.
Fix: Run `yarn install` (or `yarn setup` if the Prisma schema also changed).

**Problem: Port conflict (EADDRINUSE)**
Cause: A previous dev server didn't shut down properly.
Fix: `lsof -ti:3000 | xargs kill -9` (replace 3000 with the port number).

## Related Docs

- [Setup Guide](./SETUP.md) — initial environment setup
- [Quickstart Guide](./QUICKSTART.md) — get running in 5 minutes
- [Branch Flow](./BRANCH_FLOW.md) — git branching strategy
- [Contributing Guide](../CONTRIBUTING.md) — how to submit PRs
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector + Prisma
- [Environment Variables](./ENVIRONMENT.md) — full env var reference
