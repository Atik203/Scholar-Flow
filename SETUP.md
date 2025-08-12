# ScholarFlow Project - Setup Guide

## 🏗️ Architecture Overview

### Monorepo Structure

```
Project-Info/
├── apps/
│   ├── frontend/          # Next.js 15 + React 19 + TypeScript
│   └── backend/           # Node.js + Express + Prisma + PostgreSQL
├── packages/
│   └── shared/            # Shared utilities (ready for expansion)
├── docs/                  # Documentation
└── scripts/               # Setup and deployment scripts
```

### Technology Stack

**Frontend (Next.js App)**

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS + ShadCN UI components
- 🔐 NextAuth.js for authentication
- 🏪 Redux Toolkit Query for state management
- 📱 Fully responsive design
- 🎯 TypeScript for type safety

**Backend (Node.js API)**

- 🚀 Express.js with TypeScript
- 🗄️ Prisma ORM with PostgreSQL
- 🔒 JWT authentication with role-based access
- 📊 Complete data models for papers, annotations, collections
- 🎛️ API routes for all core features
- 🛡️ Security middleware (CORS, Helmet, Rate Limiting)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- Yarn 4.5+ (Berry)
- PostgreSQL 15+ with pgvector extension
- Redis (optional, for background jobs)

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Setup

```bash
# Backend configuration
cp apps/backend/.env.example apps/backend/.env

# Frontend configuration
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 3. Configure Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/scholar_sphere"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

#### Frontend (.env.local)

```env
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
DATABASE_URL="postgresql://username:password@localhost:5432/scholar_sphere"
```

### 4. Database Setup

```bash
# Generate Prisma client
yarn db:generate

# Run database migrations
yarn db:migrate

# Seed sample data (optional)
yarn db:seed
```

### 5. Start Development Servers

```bash
yarn dev
```

This starts:

- **Frontend**: <http://localhost:3002> (per apps/frontend/package.json)
- **Backend API**: <http://localhost:5000>

## 📋 Available Scripts

```bash
# Development
yarn dev                 # Start both frontend and backend
yarn build               # Build both applications
yarn type-check          # TypeScript type checking
yarn lint                # Lint both applications

# Database
yarn db:migrate          # Run Prisma migrations
yarn db:generate         # Generate Prisma client
yarn db:studio           # Open Prisma Studio
yarn db:seed             # Seed sample data

# Individual apps
cd apps/frontend && yarn dev    # Frontend only
cd apps/backend && yarn dev     # Backend only
```

## 🎯 What's Included

### ✅ Completed Features

- **🏗️ Complete Project Structure**: Monorepo with frontend and backend
- **🔐 Authentication System**: NextAuth.js setup with JWT sessions
- **📊 Database Schema**: Complete Prisma schema with all models
- **🎨 UI Components**: Basic UI components with Tailwind CSS
- **📡 API Structure**: Express routes with proper middleware
- **🛡️ Security**: CORS, Helmet, Rate limiting, JWT validation
- **📱 Responsive Design**: Mobile-first responsive layout
- **⚡ Build System**: Turbo for optimized builds
- **📝 TypeScript**: Full TypeScript configuration

### 🚧 Ready for Implementation

- **📄 File Upload**: S3 pre-signed URLs structure ready
- **🤖 AI Features**: OpenAI integration placeholder
- **🔍 Vector Search**: pgvector schema ready for embeddings
- **💳 Payments**: Stripe/SSLCommerz webhook structure
- **👥 Collaboration**: Real-time annotations structure
- **📊 Analytics**: Usage tracking models in place

## 🔧 Development Workflow

### 1. Frontend Development

```bash
cd apps/frontend
yarn dev
```

- Modify pages in `src/app/`
- Add components in `src/components/`
- Update API calls in `src/store/api/`

### 2. Backend Development

```bash
cd apps/backend
yarn dev
```

- Add routes in `src/routes/`
- Modify middleware in `src/middleware/`
- Update database schema in `prisma/schema.prisma`

### 3. Database Changes

```bash
# After modifying schema.prisma
yarn db:migrate
yarn db:generate
```

## 🚀 Deployment

### Frontend and Backend (Vercel Monorepo)

We deploy both apps on Vercel using the Monorepo + Turborepo flow. See: <https://vercel.com/docs/monorepos/turborepo>

Create two Vercel Projects pointing to different root directories in this repo:

1. Frontend Project

- Root Directory: `apps/frontend`
- Framework Preset: Next.js
- Install Command: `yarn install`
- Build Command: `yarn build`
- Output: auto (Next.js)
- Env vars: copy from `apps/frontend/.env.example` to Vercel Project settings

2. Backend Project (Express/Node)

- Root Directory: `apps/backend`
- Runtime: Node.js
- Install Command: `yarn install`
- Build Command: `yarn build` (runs `tsc` per package.json)
- Start Command (Preview/Dev only): `node dist/server.js`
- Env vars: copy from `apps/backend/.env.example` to Vercel Project settings

Important notes for the backend on Vercel:

- Vercel is serverless-first. Long-running servers (`app.listen`) are not supported on the Edge or Serverless Functions.
- For production on Vercel, expose your API via Serverless Functions. The common pattern is to export the Express `app` as the default handler from an `api/index.ts` and remove direct `app.listen` calls in that path.
- Until refactoring is complete, you can use Preview deployments for quick checks or deploy the backend to another host. We’ll add a serverless entrypoint in a follow-up.

Optional serverless entry (to be implemented later):

```ts
// apps/backend/api/index.ts
import app from "../src/serverless-app"; // express app without app.listen
export default app;
```

Then in `apps/backend/vercel.json` (optional):

```json
{
  "functions": {
    "api/**/*.ts": { "runtime": "nodejs22.x" }
  },
  "routes": [{ "src": "/(.*)", "dest": "/api/index.ts" }]
}
```

## 🧪 Testing

The project is ready for testing:

- ✅ TypeScript compilation passes
- ✅ Build process completes successfully
- ✅ Development servers start correctly
- ✅ All dependencies installed properly

## 📚 Next Implementation Steps

1. **Authentication Flow**
   - Configure OAuth providers (Google, GitHub)
   - Implement user registration/onboarding

2. **File Upload System**
   - Implement S3 pre-signed URL generation
   - Add file processing pipeline

3. **AI Integration**
   - Connect OpenAI API
   - Implement semantic search with pgvector

4. **Payment System**
   - Configure Stripe/SSLCommerz
   - Implement subscription logic

5. **Real-time Features**
   - Add WebSocket for live collaboration
   - Implement real-time annotations

## 🐛 Troubleshooting

### Common Issues

**Dependency Conflicts**

```bash
rm -rf node_modules .yarn/cache
yarn install
```

**Database Connection**

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Install pgvector extension: `CREATE EXTENSION vector;`

**Build Errors**

```bash
yarn type-check  # Check for TypeScript errors
yarn lint        # Check for linting issues
```

## 📞 Support

- Review the [comprehensive specification](README.md) for detailed requirements
- Check the [database schema](apps/backend/prisma/schema.prisma) for data models
- Examine API routes in `apps/backend/src/routes/` for endpoint documentation

The template is ready for development and includes all the foundational elements specified in the original requirements. You can now start implementing specific features based on your priorities.
