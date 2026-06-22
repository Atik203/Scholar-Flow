# Scholar-Flow Project Template

This project template provides a complete foundation for the Scholar-Flow AI-powered research paper collaboration platform as described in the [comprehensive README](README.md).

## Project Structure

```
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # Node.js/Express backend API
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL 15+ with pgvector extension
- Redis (for background jobs)

### Development Setup

1. **Clone and install dependencies:**

   ```bash
   # For Windows users, run the setup script
      setup.bat

      # Or manually:
      yarn install
   ```

2. **Set up environment variables:**

   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

3. **Configure database:**

   ```bash
   # Update DATABASE_URL in both .env files
   # Run migrations
   yarn db:migrate
   ```

4. **Start development servers:**
   ```bash
   yarn dev
   ```

This will start:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Implemented

### ✅ Basic Structure

- [x] Monorepo setup with Turbo
- [x] Next.js frontend with TypeScript
- [x] Express backend with TypeScript following Apollo Healthcare pattern
- [x] Prisma schema with complete data model
- [x] Backend modular architecture (modules/User, modules/Auth, etc.)
- [x] Windows setup script (setup.bat)
- [x] Environment configuration files
- [x] GitHub Copilot instructions

### ✅ Completed (Phases 1-9)

- [x] Monorepo with Turborepo + Yarn Berry
- [x] better-auth authentication + JWT backend
- [x] Core UI components + design system
- [x] Dashboard pages for all roles
- [x] Paper upload/management with AI metadata extraction
- [x] Collections CRUD + workspace/team features
- [x] Discussions (threaded), Notes, Citations (9 formats)
- [x] Analytics, Notifications (SSE), Admin dashboard
- [x] Next.js 16 migration + React Compiler + Turbopack
- [x] Prisma v7 + pgvector semantic search
- [x] 98/102 figma-make pages (96.1%)

### 🚧 Phase 10 — FINAL (95% complete)

- [x] AI: Floating chat assistant (Cmd+J), rewriter, comparator, translator, literature review, key points
- [x] Editor: LaTeX (KaTeX), version history, full-screen mode, citations, templates, Markdown/DOCX/PDF export
- [x] Real-Time: WebSocket (socket.io), Y.js collaborative editing, live discussions
- [x] Production: Error boundaries, rate limiting (15+ limiters), CORS/CSP headers
- [ ] Lighthouse audit (target 90+)
- [ ] Comprehensive test suite
- [ ] AI streaming (SSE)

### ⏳ Future (Post-Launch)

- [ ] SSO/SAML integration (Okta, Azure AD)
- [ ] Multi-file LaTeX projects + compilation
- [ ] Bundle analysis + Core Web Vitals optimization
- [ ] Enterprise licensing + audit exports

## API Endpoints

The backend provides the following API endpoints:

- `GET /health` - Health check
- `POST /api/auth/session/validate` - Validate JWT session
- `GET /api/papers` - List papers
- `GET /api/papers/:id` - Get paper details
- Additional endpoints for annotations, collections, workspaces, etc.

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
# Additional keys for AWS, OpenAI, Stripe, etc.
```

### Frontend (.env.local)

```
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
DATABASE_URL=postgresql://...
# OAuth provider keys
```

## Database Setup

1. Install PostgreSQL with pgvector extension
2. Create database: `scholar_flow`
3. Run migrations: `yarn db:migrate`
4. Generate Prisma client: `yarn db:generate`

## Deployment

### Frontend (Vercel)

- Deploy to Vercel with environment variables
- Set build command: `yarn build`
- Set output directory: `apps/frontend/.next`

### Backend (Railway/Render/Fly.io)

- Deploy as Docker container or Node.js app
- Set start command: `yarn start`
- Configure environment variables

## Next Steps

1. **Complete Authentication Flow**
   - Implement OAuth providers
   - Add user registration/profile completion

2. **File Upload System**
   - S3 pre-signed URLs
   - Background processing pipeline

3. **Vector Search**
   - Implement pgvector queries
   - Add embedding generation

4. **Payment Integration**
   - Stripe checkout flow
   - Webhook handling

5. **AI Features**
   - OpenAI integration for summaries
   - Semantic search capabilities

## Support

For questions or issues:

1. Check the [comprehensive README](README.md) for detailed specifications
2. Review the Prisma schema for data model details
3. Examine the API route implementations for endpoint behavior

## License

MIT License - See [LICENSE](LICENSE) for details.
