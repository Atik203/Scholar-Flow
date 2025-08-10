# ScholarSphere Project Template - Setup Guide

## ✅ Template Created Successfully

This project template provides a complete foundation for the ScholarSphere AI-powered research paper collaboration platform. The template resolves the firewall issues encountered earlier and provides a production-ready starting point.

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
- Node.js 18+
- PostgreSQL 15+ with pgvector extension
- Redis (for background jobs - optional for basic setup)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Setup
```bash
# Backend configuration
cp apps/backend/.env.example apps/backend/.env

# Frontend configuration  
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 3. Configure Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/scholar_sphere"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

**Frontend (.env.local)**
```env
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
DATABASE_URL="postgresql://username:password@localhost:5432/scholar_sphere"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### 5. Start Development Servers
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 Available Scripts

```bash
# Development
npm run dev                # Start both frontend and backend
npm run build             # Build both applications
npm run type-check        # TypeScript type checking
npm run lint              # Lint both applications

# Database
npm run db:migrate        # Run Prisma migrations
npm run db:generate       # Generate Prisma client
npm run db:studio         # Open Prisma Studio
npm run db:seed           # Seed sample data

# Individual apps
cd apps/frontend && npm run dev    # Frontend only
cd apps/backend && npm run dev     # Backend only
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
npm run dev
```
- Modify pages in `src/app/`
- Add components in `src/components/`
- Update API calls in `src/store/api/`

### 2. Backend Development  
```bash
cd apps/backend
npm run dev
```
- Add routes in `src/routes/`
- Modify middleware in `src/middleware/`
- Update database schema in `prisma/schema.prisma`

### 3. Database Changes
```bash
# After modifying schema.prisma
npm run db:migrate
npm run db:generate
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd apps/frontend && npm run build`
3. Set environment variables in Vercel dashboard

### Backend (Railway/Render/Fly.io)
1. Deploy as Node.js application
2. Set start command: `cd apps/backend && npm start`
3. Configure environment variables
4. Add PostgreSQL database addon

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
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Database Connection**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Install pgvector extension: `CREATE EXTENSION vector;`

**Build Errors**
```bash
npm run type-check  # Check for TypeScript errors
npm run lint        # Check for linting issues
```

## 📞 Support

- Review the [comprehensive specification](README.md) for detailed requirements
- Check the [database schema](apps/backend/prisma/schema.prisma) for data models
- Examine API routes in `apps/backend/src/routes/` for endpoint documentation

The template is ready for development and includes all the foundational elements specified in the original requirements. You can now start implementing specific features based on your priorities.