# ScholarSphere Project Template

This project template provides a complete foundation for the ScholarSphere AI-powered research paper collaboration platform as described in the [comprehensive README](README.md).

## Project Structure

```
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # Node.js/Express backend API
├── packages/
│   └── shared/            # Shared utilities and types
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ with pgvector extension
- Redis (for background jobs)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
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
   npm run db:migrate
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Implemented

### ✅ Basic Structure
- [x] Monorepo setup with Turbo
- [x] Next.js frontend with TypeScript
- [x] Express backend with TypeScript  
- [x] Prisma schema with complete data model
- [x] Auth.js (NextAuth) setup
- [x] Redux Toolkit Query for API state management
- [x] Basic UI components with Tailwind CSS

### 🚧 In Progress
- [ ] File upload with S3 integration
- [ ] Vector search with pgvector
- [ ] Payment integration (Stripe/SSLCommerz)
- [ ] AI features (OpenAI integration)
- [ ] Real-time collaboration
- [ ] PDF processing and OCR

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
2. Create database: `scholar_sphere`
3. Run migrations: `npm run db:migrate`
4. Generate Prisma client: `npm run db:generate`

## Deployment

### Frontend (Vercel)
- Deploy to Vercel with environment variables
- Set build command: `npm run build`
- Set output directory: `apps/frontend/.next`

### Backend (Railway/Render/Fly.io)
- Deploy as Docker container or Node.js app
- Set start command: `npm run start`
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