# GitHub Copilot AI Agent Instructions

## Project Overview

**Project Name**: Scholar-Flow  
**Type**: AI-Powered Research Paper Collaboration Hub  
**Architecture**: Monorepo with Next.js frontend and Express.js backend  
**Phase**: Phase 1 Development (MVP)

## Technology Stack

### Frontend (apps/frontend)

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components
- **State Management**: Redux Toolkit Query (RTK Query)
- **Authentication**: NextAuth.js (Auth.js) with JWT strategy
- **Forms**: React Hook Form + Zod validation

### Backend (apps/backend)

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with bcrypt
- **Architecture**: Modular feature-based structure (controllers, services, routes, schemas)
- **File Structure**:
  ```
  src/
  ├── app/
  │   ├── modules/          # Feature modules (User, Auth, Paper, etc.)
  │   ├── interfaces/       # TypeScript interfaces
  │   ├── middlewares/      # Express middlewares
  │   ├── routes/          # Route definitions
  │   └── errors/          # Error handling
  ├── config/              # Configuration
  ├── helpers/             # Utility functions
  └── shared/              # Shared utilities (prisma, catchAsync, etc.)
  ```

## Development Guidelines

### Code Style & Patterns

1. **Feature-based modular structure**: Separate concerns with service, controller, routes per feature
2. **TypeScript First**: All code must be properly typed
3. **Error Handling**: Use catchAsync wrapper and ApiError class
4. **Response Format**: Use consistent API response format with sendResponse utility
5. **Validation**: Use Zod for input validation
6. **Database**: Use Prisma with proper transaction handling
7. **Testing**: Prefer unit tests for services, integration tests for routes; keep a small e2e smoke path
8. **Lint/Format**: Enforce ESLint + Prettier; no unused exports or implicit any
9. **Git hygiene**: Conventional commits, small PRs, descriptive titles, linked issues

### Phase 1 MVP Features (Current Priority)

1. **User Authentication & Profile Management**
   - Sign up/login with Google OAuth + email/password
   - User profile management
   - Password reset functionality

2. **Paper Upload & Storage**
   - PDF/DOCX upload with metadata extraction
   - Cloud storage integration (planned: AWS S3)
   - File processing and text extraction

3. **Basic Collections**
   - Create and manage paper collections
   - Add/remove papers from collections
   - Basic search and filtering

4. **AI Features (Basic)**
   - Paper summarization using OpenAI API
   - Basic semantic search (planned: pgvector)

5. **Collaboration (Basic)**
   - Share collections with other users
   - Basic permission management

### File Naming Conventions

- **Backend Modules**: `moduleName.service.ts`, `moduleName.controller.ts`, `moduleName.routes.ts`
- **Frontend Components**: PascalCase for components, camelCase for files
- **API Routes**: RESTful conventions (`/api/users`, `/api/papers/:id`)

### Environment Setup

- **Backend**: Port 5000, uses apps/backend/.env
- **Frontend**: Port 3000, uses apps/frontend/.env.local
- **Database**: PostgreSQL with pgvector extension (future)

## Current Project Status

### ✅ Completed

- [x] Monorepo setup with Turbo
- [x] Basic project structure
- [x] Backend modular architecture
- [x] Prisma schema with comprehensive data model
- [x] Frontend setup with Next.js and basic UI components
- [x] Windows setup script (setup.bat)

### 🚧 In Progress (Phase 1)

- [ ] Complete User authentication module
- [ ] Paper upload and management
- [ ] Basic collections functionality
- [ ] Database migrations and seeding
- [ ] Frontend-backend integration

### 📋 Todo (Phase 1)

- [ ] File upload with cloud storage
- [ ] AI summarization integration
- [ ] Basic search functionality
- [ ] User profile management
- [ ] Collection sharing

## Important Commands

```bash
# Setup project (Windows)
setup.bat

# Development
npm run dev              # Start both frontend and backend
npm run db:migrate       # Run database migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio

# Backend only
cd apps/backend
npm run dev              # Start backend on port 5000

# Frontend only
cd apps/frontend
npm run dev              # Start frontend on port 3000
```

## Key Files to Understand

1. **Backend Entry**: `apps/backend/src/server.ts`
2. **Database Schema**: `apps/backend/prisma/schema.prisma`
3. **API Routes**: `apps/backend/src/app/routes/index.ts`
4. **Frontend Layout**: `apps/frontend/src/app/layout.tsx`
5. **Main Config**: Root `package.json` and `turbo.json`

## Common Patterns

### Backend Service Pattern

```typescript
// user.service.ts
export const userService = {
  getAllFromDB: async (params: any, options: IPaginationOptions) => {
    // Implementation with pagination
  },
  getByIdFromDB: async (id: string) => {
    // Implementation
  },
};
```

### Backend Controller Pattern

```typescript
// user.controller.ts
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllFromDB(req.query, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});
```

### Frontend API Pattern

```typescript
// Use RTK Query for API calls
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      // Add auth headers
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
  }),
});
```

## Development Best Practices

1. **Always use TypeScript**: No `any` unless unavoidable; enable strict mode
2. **Error Handling**: Wrap async with `catchAsync`; surface typed errors via `ApiError`
3. **Validation**: Validate all inputs with Zod; never trust client data
4. **Testing**: Target core business logic and critical flows; keep tests fast and deterministic
5. **Security**: Hide secrets; strict CORS; secure cookies; helmet; input sanitization
6. **Performance**: Paginate, index DB queries, cache hot reads (Redis)
7. **Observability**: Structured logs, minimal PII; add tracing hooks for later OpenTelemetry
8. **Docs**: Update README/DEVELOPMENT after notable changes
9. **Release discipline**: Keep main green; use PR checks; avoid breaking changes without migration notes

## Frontend (Next.js) Best Practices for SaaS

### Routing, Data, and Rendering

- Prefer Server Components; use Client Components only when interaction/state is needed
- Use App Router layouts for shared chrome; colocation of route handlers where appropriate
- Fetch on the server when possible; leverage Next.js caching (ISR) for marketing pages
- Use `revalidate`/tag-based invalidation (`revalidateTag`, `revalidatePath`) for content updates
- Choose runtime per route: Edge for fast public pages, Node for Prisma/Node-only libs

### SEO & Metadata

- Use the Metadata API in `layout.tsx`/`page.tsx` (`title`, `description`, `openGraph`, `twitter`, `alternates.canonical`, `robots`)
- Implement `generateMetadata` for dynamic routes (paper, collection, user)
- Add `app/sitemap.ts` and `app/robots.ts`; include dynamic entries for papers/collections
- Include structured data (JSON-LD) for Organization, WebSite, BreadcrumbList, Article/ScholarlyArticle
- Generate dynamic OG images (`@vercel/og`) for shareable pages

### Performance & UX

- Use `next/image` and `next/font` (self-host fonts); preconnect/prefetch critical resources
- Minimize client JS; split by route/segment; use streaming/Suspense and skeletons for perceived speed
- Debounce searches; paginate or infinite-scroll large lists; avoid N+1 client fetches
- Avoid heavy client-only UI libs when headless + Tailwind suffices

### Accessibility & i18n

- Ensure proper landmarks, labels, focus states, and keyboard navigation
- Maintain color contrast; respect reduced motion
- Plan for i18n (e.g., `next-intl`/`next-i18next`), locale routing, and `hreflang` when applicable

### Auth, Security, and Middleware

- Protect routes with `middleware.ts` and role checks; avoid exposing secrets to the client
- With NextAuth, keep tokens server-only; use secure cookies and short-lived JWTs
- Rate limit sensitive API routes; validate inputs on server with Zod

### Forms, State, and Data Fetching

- Use React Hook Form + Zod; provide optimistic updates when safe (RTK Query)
- Keep client state minimal; prefer server data flows via RSC
- Handle loading/empty/error states explicitly in UI components

### Analytics & Consent

- Add analytics (Vercel Analytics/GA4) with consent; anonymize and avoid PII
- Fire product events for signup, upload, share; disable analytics in development

### PWA & Web Vitals

- Consider a PWA manifest for offline reading; track Core Web Vitals and fix regressions
- Load third-party scripts with `next/script` and non-blocking strategies

### Marketing Pages (SaaS)

- Create `(marketing)` group for landing, pricing, blog/docs; statically generate with periodic revalidation
- Add FAQ/cost sections with schema.org `FAQPage`; use canonical URLs to avoid duplicates

## Production (SaaS) Guidance

### Environments & Config

- Separate envs: development, staging, production
- Centralize config with strongly-typed env parsing (e.g., Zod) and fail-fast on boot
- Secrets in platform store (GitHub Encrypted Secrets, Vercel/Cloud envs); never commit .env

### CI/CD

- GitHub Actions: lint, type-check, test, build on PR; deploy on main
- Database migrations via Prisma in CI prior to deploy; generate client on build
- Protect main with required checks; use preview deployments for PRs (frontend)

### Tenancy & Data Isolation

- Scope all data by tenant/team/workspace identifiers; enforce in queries/services
- Consider row-level security (future) or service guardrails to prevent cross-tenant access

### Security

- JWT best practices: short-lived access tokens, refresh rotation, revoke on logout
- HTTP security headers (helmet), rate limiting, input validation, file type/size limits
- Regular dependency audits; pin critical packages; monitor CVEs

### Billing & Plans

- Stripe subscriptions (trial, proration, dunning); webhooks for lifecycle events
- Usage metering where applicable (e.g., AI calls, storage) with daily aggregation
- Grace periods and feature gates based on plan entitlements

### Files & Storage

- Object storage (AWS S3/R2); presigned URLs for upload/download; virus scanning pipeline optional
- CDN for static assets; immutable cache headers; image optimization on the edge (frontend)

### Observability & Ops

- Centralized logs with request IDs; error reporting (e.g., Sentry) for frontend/backend
- Metrics: basic uptime, request latency, error rate; budget SLOs and alerts
- Backups: daily DB backups with restore drills; migration rollback plan

### Background Jobs

- Queue for long-running tasks (e.g., BullMQ with Redis); idempotent handlers and retries

### API & Versioning

- REST with semantic status codes; document in README or OpenAPI (future)
- Version endpoints for breaking changes; sunset policy

## Troubleshooting

### Common Issues

- **Database Connection**: Check DATABASE_URL in .env files
- **TypeScript Errors**: Run `npm run type-check` to see all errors
- **Build Failures**: Check dependencies and TypeScript configuration
- **Port Conflicts**: Ensure ports 3000 and 5000 are available

### Getting Help

- Check `DEVELOPMENT.md` for detailed setup instructions
- Refer to Next.js, Prisma, and Express.js documentation

---

**Last Updated**: Phase 1 MVP Development  
**Next Milestone**: Complete user authentication and paper upload functionality
