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

### 🚧 In Progress (Phase 1)

- [x] Complete User authentication module
- [x] Frontend Auth.js setup
- [ ] Paper upload and management
- [x] Database migrations
- [x] Frontend-backend integration

### ⏳ Planned (Phase 1)

- [ ] File upload with cloud storage
- [ ] Vector search with pgvector
- [ ] AI features (OpenAI integration)
- [ ] Basic collections functionality
- [ ] User profile management

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
