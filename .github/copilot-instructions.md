# GitHub Copilot Instructions

## Project Overview

**Project Name**: ScholarFlow  
**Type**: AI-Powered Research Paper Collaboration Hub  
**Architecture**: Monorepo with Next.js frontend and Express.js backend  
**Phase**: Phase 1 Development (MVP) - Authentication Complete ✅  
**Project Start**: August 2025  
**Developer**: Md. Atikur Rahaman (GitHub: Atik203)

## Core Standards

### Package Manager & Environment

- **Package Manager**: Use Yarn Berry (v4). Never use npm in this repo.
- **Development**: Use `yarn dev:turbo` to run frontend and backend
- **Environment**: Check for any .env file changes, document new environment variables
- **Ports**: Frontend 3000, Backend 5000

### Technology Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + ShadCN UI + Redux Toolkit Query + NextAuth.js
- **Backend**: Express.js + TypeScript + PostgreSQL + Prisma ORM + JWT + bcrypt
- **Database**: PostgreSQL with pgvector extension for AI features

## ✅ Major Recent Completion

**OAuth Authentication System:** Production-ready with Google/GitHub OAuth, JWT management, comprehensive error handling, and full integration test suite (5/5 tests passing).

## Development Guidelines

### Code Style & Patterns

1. **TypeScript First**: All code must be properly typed, no implicit `any`
2. **File Naming Convention**: Use dot notation for module files: `module.type.ts` (e.g., `auth.controller.ts`, `user.service.ts`, `paper.validation.ts`, `paper.routes.ts`)
3. **Error Handling**: Use catchAsync wrapper and ApiError class consistently
4. **Validation**: Use Zod for all input validation, never trust client data
5. **Testing**: Comprehensive tests for critical features (auth, payments, data integrity)
6. **Authentication**: Use standard Prisma upsert for OAuth account management
7. **Database**: Prefer Prisma Client over raw SQL; document any raw queries with warnings
8. **Security**: Hide secrets; strict CORS; secure cookies; input sanitization
9. **Performance**: Paginate, index DB queries, cache hot reads
10. **Git hygiene**: Conventional commits, small PRs, descriptive titles, linked issues

### Phase 1 MVP Features (Current Priority)

1. **User Authentication & Profile Management** ✅
   - Sign up/login with Google OAuth + email/password ✅
   - User profile management
   - Password reset functionality

2. **Paper Upload & Storage**
   - File processing and text extraction

3. **Basic Collections**
   - Create and manage paper collections
   - Add/remove papers from collections
   - Share collections with other users
   - Basic permission management

## Important Commands

```bash
# Bootstrap
yarn install

# Development
yarn dev:turbo

# Database
yarn db:migrate   # Run database migrations
yarn db:generate  # Generate Prisma client + TypedSQL

# Quality Checks
yarn lint
yarn type-check
yarn build
```

## Current Project Status

### ✅ Completed (Phase 1 Progress)

- [x] Monorepo setup with Turbo
- [x] Basic project structure with modular architecture
- [x] Backend modular architecture with feature-based structure
- [x] Prisma schema with comprehensive data model
- [x] Frontend setup with Next.js and ShadCN UI components
- [x] **OAuth Authentication System (PRODUCTION READY)**
  - [x] Google OAuth integration with proper upsert handling
  - [x] GitHub OAuth configuration ready
  - [x] JWT-based authentication with secure token management
  - [x] Comprehensive integration test suite (5/5 tests passing)
  - [x] Production-ready error handling and unique constraint management
  - [x] Login/Register UI with form validation and responsive design
  - [x] Password strength indicators and error state handling
- [x] Windows setup script (setup.bat)
- [x] TypedSQL integration with fallback patterns
- [x] pgvector extension setup for future AI features

### 🚧 In Progress

- [ ] User profile management UI
- [ ] File upload with cloud storage
- [ ] Password reset functionality

## Roadmap Discipline

- Always consult `Roadmap.md` and work sequentially: complete Phase 1 before Phase 2, then Phase 3
- When proposing changes, map them to the current phase; defer out-of-phase work to "Next steps"
- Prefer small PRs that align with the current milestone; avoid mixing cross-phase scope in one change

## Documentation Update Protocol

When making significant changes to authentication, UI/UX, or core patterns:

1. Update relevant `.cursor/rules/*.mdc` files with new patterns
2. Update `.github/instructions/*.md` files with implementation guidance
3. Update `docs/UI_DESIGN.md` for any UI changes or new component patterns
4. Update `Roadmap.md` to reflect completion status
5. Add feature flags to both backend and frontend `.env.example` files
6. Update main `README.md` only for major milestones or architecture changes

---

**Last Updated**: Phase 1 MVP Development - OAuth Authentication System Completed ✅  
**Next Milestone**: Follow Roadmap.md — continue Phase 1 (user profiles, uploads, collections) before Phase 2.
