# ScholarFlow

> **AI-Powered Research Paper Collaboration Hub**

ScholarFlow is a modern research paper management and collaboration platform designed to streamline academic workflows. Upload, organize, search, and collaborate on research papers with AI-powered insights and smart organization features.

[![Version](https://img.shields.io/badge/version-1.1.1-blue)](./Release.md)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-Node.js-green)](https://expressjs.com/)

## 🚀 Live Demo

- **Frontend**: [ScholarFlow App](https://scholar-flow-ai.vercel.app)
- **API**: [Backend API](https://scholar-flow-api.vercel.app/api/health)

## ✨ Features

### � Rich Text Editing & Paper Management

- **Rich Text Editor**: Full-featured TipTap-based editor for research papers with advanced formatting, tables, lists, and more
- **Auto-save & Drafts**: Debounced auto-save, manual save, and draft/publish workflow with real-time status
- **Export to PDF/DOCX**: One-click export with embedded images and professional styling
- **Image Upload**: Drag-and-drop or paste images directly into the editor, with S3 storage and resizing
- **Smart Upload**: Drag-and-drop PDF upload with automatic metadata extraction
- **AI Metadata**: Automatic title, author, and abstract extraction from PDFs
- **Advanced Search**: Full-text search with filters (author, date, type, keywords)
- **PDF Preview**: Secure in-app PDF viewer with responsive design

### � Sharing & Collaboration

- **Email Sharing**: Share papers via email with permission management (view/edit)
- **Workspace Collaboration**: Invite users to collections and workspaces with role-based access

- **Multiple Auth Options**: Google OAuth, GitHub OAuth, and email/password
- **Secure Sessions**: JWT-based authentication with refresh tokens
- **Password Recovery**: Secure password reset with email verification
- **Production Security**: Rate limiting, input sanitization, CORS protection

### 🎯 Modern UI/UX

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Dashboard**: Quick access to papers, search, and collections
- **Real-time Feedback**: Loading states, error handling, and success notifications
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🏗️ Production-Ready Infrastructure

- **Performance Monitoring**: Response time tracking and health checks
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Database Optimization**: Composite indexes and query optimization
- **Scalable Architecture**: Microservices-ready with clean separation

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Redux Toolkit Query
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js

### Backend

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3 for file management
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas

### DevOps & Tools

- **Package Manager**: Yarn Berry (v4)
- **Monorepo**: Turborepo for build optimization
- **Database**: PostgreSQL with pgvector (AI-ready)
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)
- **Monitoring**: Health checks and performance tracking

## 📁 Project Structure

```
Scholar-Flow/
├── apps/
│   ├── frontend/          # Next.js 15 application
│   │   ├── src/app/       # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and configurations
│   │   └── redux/        # State management
│   └── backend/          # Express.js API server
│       ├── src/app/      # Application logic
│       ├── prisma/       # Database schema and migrations
│       └── scripts/      # Utility scripts
├── docs/                 # Project documentation
├── .github/             # GitHub workflows and templates
└── .cursor/             # Development rules and guidelines
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Yarn Berry (v4)
- AWS S3 account (for file storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Atik203/Scholar-Flow.git
   cd Scholar-Flow
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment templates
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env

   # Edit the .env files with your configurations
   ```

4. **Set up the database**

   ```bash
   yarn db:migrate
   yarn db:generate
   ```

5. **Start development servers**

   ```bash
   yarn dev:turbo
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

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
yarn reset              # Reset node_modules and rebuild
```

## 🌟 Current Features (v1.1.1)

- ✅ **Rich Text Editor**: TipTap-based, with advanced formatting, tables, lists, and image upload
- ✅ **Auto-save & Drafts**: Debounced auto-save, manual save, and draft/publish workflow
- ✅ **Export to PDF/DOCX**: One-click export with embedded images and professional styling
- ✅ **Image Upload**: Drag-and-drop or paste images, S3 storage, resizing
- ✅ **Email Sharing**: Share papers via email with permission management
- ✅ **Authentication System**: Google/GitHub OAuth + email/password
- ✅ **Paper Upload**: Multi-file drag-and-drop with S3 storage
- ✅ **Metadata Extraction**: AI-powered title, author, abstract extraction
- ✅ **Advanced Search**: Full-text search with comprehensive filters
- ✅ **PDF Preview**: Secure iframe-based PDF viewer
- ✅ **Dashboard**: Quick access and navigation
- ✅ **Responsive UI**: Mobile-first design with modern components
- ✅ **Production Security**: Rate limiting, monitoring, error handling

## 🗺️ Roadmap

### Phase 1 (Current) - Core Features

- [x] Authentication & User Management
- [x] Paper Upload & Storage
- [x] Rich Text Editor & Content Management
- [x] Export to PDF/DOCX
- [x] Image Upload & Sharing
- [ ] Collections & Organization (In Progress)

### Phase 2 - AI-Powered Features

- [ ] AI Research Assistant
- [ ] Smart Recommendations
- [ ] Paper Summarization
- [ ] Citation Analysis

### Phase 3 - Advanced Collaboration

- [ ] Real-time Collaboration
- [ ] Shared Workspaces
- [ ] Integration Hub (Zotero, Mendeley)
- [ ] Advanced Analytics

## 📚 Documentation

- [**API Documentation**](./docs/API.md) - Complete API reference
- [**UI Design System**](./docs/UI_DESIGN.md) - Component guidelines
- [**Development Guide**](./docs/DEVELOPMENT.md) - Setup and contribution guide
- [**Release Notes**](./docs/Release.md) - Version history and changes
- [**Roadmap**](./Roadmap.md) - Feature development timeline

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run integration tests
yarn test:integration

# Run frontend tests
yarn test:frontend

# Run backend tests
yarn test:backend
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](./LICENSE.md) file for details.

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

<div align="center">

[⭐Star this repository](https://github.com/Atik203/Scholar-Flow) if you find it helpful!

</div>
