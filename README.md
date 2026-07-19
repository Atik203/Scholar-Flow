# ScholarFlow

> **AI-Powered Research Paper Collaboration Hub**

ScholarFlow is a modern research paper management and collaboration platform designed to streamline academic workflows. Upload, organize, search, and collaborate on research papers with AI-powered insights and smart organization features.

[![Version](https://img.shields.io/badge/version-1.3.1-blue)](./CHANGELOG.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-Node.js-green)](https://expressjs.com/)

> **Note on licensing:** The project `package.json` declares `"license": "UNLICENSED"`. See [LICENSE.md](./LICENSE.md) for details.

## 📦 Recent Releases

- **1.3.1 (2026-06-28)** — AI architecture overhaul: context persistence, metadata generation, context-aware chat, inline paper Q&A, token optimization, Vercel crash fix (uuid ESM + outputDirectory). See [CHANGELOG.md](./CHANGELOG.md).
- **1.3.0-rc1 (2026-10-01)** — Phase 10: AI assistant, WebSocket collab, editor templates, paper upload/import overhaul, smart URL import (IEEE/ResearchGate/Google Scholar/Semantic Scholar). See [CHANGELOG.md](./CHANGELOG.md).
- **1.2.9** — Phase 9: WCAG 2.1 AA, code splitting, 8 final pages, invitation backend.
- **1.2.8** — Phase 8: Architecture stabilization, 14 new pages, removed dead code.

## 🚀 Live Demo

- **Frontend**: [ScholarFlow App](https://scholar-flow-ai.vercel.app)
- **API**: [Backend API](https://scholar-flow-api.vercel.app/api/health)

## ✨ Features

### 📝 Rich Text Editing & Paper Management

- **Rich Text Editor**: Full-featured TipTap-based editor for research papers with advanced formatting, tables, lists, and more
- **Auto-save & Drafts**: Debounced auto-save, manual save, and draft/publish workflow with real-time status
- **Export to PDF/DOCX**: One-click export with embedded images and professional styling
- **Image Upload**: Drag-and-drop or paste images directly into the editor, with S3 storage and resizing
- **Smart Upload**: Drag-and-drop PDF upload with automatic metadata extraction
- **AI Metadata**: Automatic title, author, and abstract extraction from PDFs
- **Advanced Search**: Full-text search with filters (author, date, type, keywords)
- **PDF Preview**: Secure in-app PDF viewer with responsive design

### 🤝 Sharing & Collaboration

- **Email Sharing**: Share papers via email with permission management (view/edit)
- **Workspace Collaboration**: Invite users to collections and workspaces with role-based access
- **Real-Time Collaboration**: WebSocket-powered co-editing with Y.js, cursor presence, live discussion chat with typing indicators

### 🤖 AI-Powered Features (Phase 10)

- **Global AI Assistant**: Floating chat widget (Cmd+J) with markdown rendering, code highlighting, 4 providers (OpenAI/Gemini/Claude/DeepSeek)
- **AI Paper Tools**: Key Points extraction, Rewriter, Comparator, Literature Review, Translator
- **AI Summarizer**: One-click paper summaries with configurable tone, audience, and word limits
- **Semantic Search**: pgvector-powered meaning search across all papers
- **AI Metadata**: Automatic title, author, abstract extraction from PDFs

### 📝 Rich Text Editing

- **TipTap Editor**: Full-featured with LaTeX math (KaTeX), citations, 7 paper templates (IEEE/ACM/Springer/arXiv)
- **Version History**: Auto-snapshot before save, keep 50 versions, restore any version
- **Word Count + Reading Time**: Live stats in editor status bar
- **Full-Screen Mode**: Distraction-free writing with Esc to exit
- **Image Upload**: Drag-and-drop with alignment, captions, text wrap
- **Export**: PDF, DOCX, Markdown with one click

- **Multiple Auth Options**: Google OAuth, GitHub OAuth, and email/password
- **Secure Sessions**: JWT-based authentication with refresh tokens
- **Password Recovery**: Secure password reset with email verification
- **Production Security**: Rate limiting, input sanitization, CORS protection

### 🎯 Modern UI/UX

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Dashboard**: Quick access to papers, search, and collections
- **Real-time Feedback**: Loading states, error handling, and success notifications
- **Accessibility**: WCAG compliant with keyboard navigation support

### 💳 Billing & Subscription

- **Stripe Checkout**: Upgrade workspaces through secure hosted checkout with plan-aware metadata
- **Customer Portal Access**: Manage billing details, cancel, or reactivate subscriptions from Stripe without support tickets
- **Real-Time Sync**: Webhook-driven role updates keep dashboard permissions aligned with subscription status
- **Billing Dashboard Entry**: Dedicated navigation item and refreshed auth session to surface plan changes instantly

### 🛠️ Admin Dashboard & System Monitoring

- **Real-Time System Metrics**: Live monitoring with 10-second auto-refresh for CPU, memory, storage, and database
- **Accurate CPU Tracking**: Intelligent CPU usage calculation using idle/total times from Node.js os module
- **Smart Storage Analytics**: Dynamic storage estimation based on actual database usage with realistic percentages
- **Health Status Dashboard**: Comprehensive health cards (Database/Server/Storage/CPU) with automatic status classification
- **Performance Visualization**: Auto-colored progress bars that adapt based on metric values (green→blue→yellow→red)
- **System Information Panel**: Real-time platform, Node.js version, database version, memory, and uptime display
- **Production-Grade Architecture**: HTTP caching, rate limiting, admin-only access, lazy loading with code splitting

### 🏗️ Production-Ready Infrastructure

- **Performance Monitoring**: Response time tracking and health checks
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Database Optimization**: Composite indexes and query optimization
- **Scalable Architecture**: Microservices-ready with clean separation

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Redux Toolkit Query
- **Forms**: React Hook Form + Zod validation
- **Authentication**: better-auth (Google OAuth, GitHub OAuth, email/password)

### Backend

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3 for file management
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas

### DevOps & Tools

- **Package Manager**: Yarn Berry (v4.9.2)
- **Monorepo**: Turborepo for build optimization
- **Database**: PostgreSQL with pgvector (AI-ready)
- **Deployment**: Vercel (Frontend + REST API) + Render (WebSocket)
- **Monitoring**: Health checks and performance tracking

## 📁 Project Structure

```text
Scholar-Flow/
├── apps/
│   ├── frontend/          # Next.js 16 application (port 3000)
│   │   ├── src/app/       # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and configurations
│   │   └── redux/        # RTK Query state management
│   ├── backend/          # Express.js REST API (port 5000)
│   │   ├── src/app/      # Application logic
│   │   ├── prisma/       # Database schema and migrations
│   │   └── scripts/      # Utility scripts
│   └── socket-server/    # Socket.io real-time server (port 5001)
├── docs/                 # Project documentation
├── .github/             # GitHub workflows and templates
└── .cursor/             # Development rules and guidelines
```

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ (check with `node --version`)
- Yarn Berry v4.9.2+ (check with `yarn --version`)
- PostgreSQL 15+ with pgvector extension
- AWS S3 account (for file storage — optional for local dev without uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Atik203/Scholar-Flow.git
   cd Scholar-Flow
   ```

2. **Set up environment variables**

   ```bash
   # Copy environment templates
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env
   cp apps/socket-server/.env.example apps/socket-server/.env

   # Edit the .env files with your configurations
   ```

3. **Install dependencies, generate Prisma client, and build**

   ```bash
   yarn setup
   ```

   This runs `yarn install` followed by `prisma generate --sql` in one step.

4. **Set up the database**

   ```bash
   yarn db:migrate
   yarn db:seed
   ```

5. **Start development servers**

   ```bash
   yarn dev:turbo
   ```

   The application will be available at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)
   - WebSocket: [http://localhost:5001](http://localhost:5001)

## 🔧 Development Commands

```bash
# Development
yarn dev:turbo          # Start both frontend and backend
yarn dev:frontend       # Start only frontend
yarn dev:backend        # Start only backend

# Database
yarn db:migrate         # Run database migrations
yarn db:generate        # Generate Prisma client
yarn db:studio          # Open Prisma Studio
yarn db:seed            # Seed database with sample data

# Quality Assurance
yarn lint               # Run ESLint
yarn type-check         # TypeScript compilation check
yarn test               # Run test suite
yarn build              # Production build

# Utilities
yarn clean              # Clean build artifacts
yarn setup:clean        # Full clean reinstall (clean → install → generate)
```

### Content Management & Editing

- ✅ **Rich Text Editor**: TipTap-based, with advanced formatting, tables, lists, and image upload
- ✅ **Auto-save & Drafts**: Debounced auto-save, manual save, and draft/publish workflow
- ✅ **Export to PDF/DOCX**: One-click export with embedded images and professional styling
- ✅ **Image Upload**: Drag-and-drop or paste images, S3 storage, resizing
- ✅ **Email Sharing**: Share papers via email with permission management

### Authentication & Security

- ✅ **Authentication System**: Google/GitHub OAuth + email/password
- ✅ **Production Security**: Rate limiting, monitoring, error handling, admin-only access

### Paper Management

- ✅ **Paper Upload**: Multi-file drag-and-drop with S3 storage
- ✅ **Metadata Extraction**: AI-powered title, author, abstract extraction
- ✅ **Advanced Search**: Full-text search with comprehensive filters
- ✅ **PDF Preview**: Secure iframe-based PDF viewer

### Admin & System Monitoring

- ✅ **Real-Time System Metrics**: Live CPU, memory, storage, database monitoring with 10s auto-refresh
- ✅ **Accurate CPU Tracking**: Intelligent calculation using Node.js os module (idle/total times)
- ✅ **Smart Storage Analytics**: Dynamic estimation (10x usage, min 100GB) for realistic percentages
- ✅ **Health Dashboard**: Auto-classified status cards (healthy/degraded/unhealthy/warning/critical)
- ✅ **Performance Visualization**: Auto-colored bars (green→blue→yellow→red based on values)
- ✅ **System Information**: Real-time platform, versions, memory, uptime display

### User Experience

- ✅ **Dashboard**: Quick access and navigation with role-based routing
- ✅ **Responsive UI**: Mobile-first design with modern components
- ✅ **Lazy Loading**: Code splitting with React.lazy and Suspense boundaries

## 📚 Documentation

- [**Changelog**](./CHANGELOG.md) - Version history and release notes
- [**Roadmap**](./IMPLEMENTATION.md) - Phase-by-phase implementation plan and current status
- [**Quickstart**](./docs/QUICKSTART.md) - Get running in 5 minutes (start here if new)
- [**Setup Guide**](./docs/SETUP.md) - Detailed environment setup and architecture
- [**Environment Variables**](./docs/ENVIRONMENT.md) - All env vars explained
- [**Development Guide**](./docs/DEVELOPMENT.md) - Day-to-day development workflow
- [**Database Setup**](./docs/DATABASE.md) - PostgreSQL, pgvector, and Prisma guide
- [**Redis Setup**](./docs/REDIS_SETUP.md) - Redis configuration for background jobs
- [**Deployment Guide**](./docs/DEPLOY.md) - Deploy to Vercel + Render / Oracle Cloud
- [**Branch Flow**](./docs/BRANCH_FLOW.md) - Git branching strategy (atik → dev → main)
- [**Database Schema**](./docs/ERD.md) - ERD and relational schema reference
- [**Testing Guide**](./docs/TESTING.md) - How to run and write tests
- [**API Reference**](http://localhost:5000/api/docs) - Live Swagger UI when backend is running

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🧪 Testing

```bash
# Run all tests (via Turborepo)
yarn test

# Run frontend tests only
yarn workspace @scholar-flow/frontend test

# Run backend tests only
yarn workspace @scholar-flow/backend test

# Watch mode (frontend)
yarn workspace @scholar-flow/frontend test:watch
```

## 📄 License

This project is UNLICENSED — see the [LICENSE.md](./LICENSE.md) file for details. All rights reserved by the project maintainer unless otherwise stated.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent database toolkit
- [ShadCN UI](https://ui.shadcn.com/) for beautiful component library
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Atik203/Scholar-Flow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Atik203/Scholar-Flow/discussions)
- **Email**: [atikurrahaman0305@gmail.com](mailto:atikurrahaman0305@gmail.com)

---

⭐ **Star this repository** if you find it helpful!
