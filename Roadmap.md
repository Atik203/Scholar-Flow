# Scholar-Flow Development Roadmap

Author: @Atik203
Last Updated: October 3, 2025

## Phase 1 – MVP (Weeks 1–6)

Goal: Get a working core platform with minimal but functional features.

### Week 1 – Project Setup & Foundations (Author: @Atik203) ✅

- [x] Setup & Configuration (monorepo, Next.js 15, Node.js backend)
- [x] TypeScript, ESLint, Prettier, Husky hooks
- [x] Prisma with PostgreSQL (User, Paper, Collection tables)
- [x] Auth.js authentication (Google + email/password)
- [x] Environment setup & Tailwind CSS + ShadCN UI + Redux Toolkit

### Week 2 – User Auth & Profile (Author: @Atik203) ✅

- [x] Sign up / login / logout with Google OAuth
- [x] JWT-based authentication with comprehensive testing
- [x] User profile management & role-based access control
- [x] Production-ready error handling & unique constraint management

### Week 2.5 – Modern UI/UX Redesign (Author: @Atik203) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface
- [x] Responsive sidebar with collapsible navigation & mobile hamburger menu
- [x] CSS Grid system with professional backdrop blur effects
- [x] Custom theme integration with light/dark mode support

### Week 3 – Paper Upload & Storage (Author: @Atik203) ✅

- [x] Password reset, email verification & user profile management
- [x] Cloud storage integration (AWS S3) with file upload system
- [x] Paper upload page (PDF, DOCX) with metadata extraction
- [x] Modern paper viewing interface with fallback support

### Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: @Atik203) ✅

- [x] Advanced search page with comprehensive filters & fuzzy search
- [x] Modern papers list with real-time search functionality
- [x] Enhanced dashboard with improved navigation & quick actions
- [x] Component architecture cleanup & duplicate code removal

### Week 4 – Basic Collections (Author: @Atik203 + Salman) ✅

**Key Features Delivered:**

- [x] Create Collection flow with comprehensive CRUD operations (Author: Atik+Salman) ✅
- [x] Add papers to collections with permission-based access control (Author: Atik) ✅
- [x] Collection listing page with modern UI components (Author: Atik) ✅
- [x] Advanced search & filter functionality (Author: Atik) ✅
- [x] Backend CRUD operations for collections & papers (Author: Atik+Salman) ✅
- [x] Collection privacy controls (public/private) (Author: Atik) ✅
- [x] Paper-collection relationship management (Author: Atik) ✅
- [x] Permission-based sharing system (VIEW/EDIT permissions) (Author: Atik) ✅
- [x] Real-time cache invalidation and updates (Author: Atik) ✅
- [x] Collection invitation system with email notifications (Author: @Atik203) ✅

### Week 4.5 – Advanced Workspace Management (Author: @Atik203) ✅

**Key Features Delivered:**

- [x] Workspace settings and management interface with modern UI (Author: @Atik203) ✅
- [x] Comprehensive workspace invitation system with email notifications (Author: @Atik203) ✅
- [x] Role-based permission management (OWNER/ADMIN/TEAM_LEAD/PRO_RESEARCHER/RESEARCHER) (Author: @Atik203) ✅
- [x] Workspace member management with add/remove/role update functionality (Author: @Atik203) ✅
- [x] Invitation tracking system (sent/received invitations) (Author: @Atik203) ✅
- [x] Accept/decline invitation workflow with status management (Author: @Atik203) ✅
- [x] Real-time workspace updates and cache invalidation (Author: @Atik203) ✅
- [x] Workspace edit functionality (name/description updates) (Author: @Atik203) ✅
- [x] Activity logging for workspace actions and member changes (Author: @Atik203) ✅
- [x] Advanced permission checks and security controls (Author: @Atik203) ✅
- [x] Production-grade error handling and input validation (Author: @Atik203) ✅
- [x] AWS SDK v3 migration for improved performance and modern tooling (Author: @Atik203) ✅
- [x] Extract text content from uploaded PDFs & DOCX (Author: Atik+Salman) ✅
      Preview & Extraction improvements:
- [x] Gotenberg-based DOCX→PDF preview pipeline (Docker on EC2) for pixel‑perfect viewing (Author: Atik) ✅
- [x] Preview‑first Extraction Text: view/preview for DOCX/PDF (no rich text editor yet) (Author: Atik) ✅
- [x] Rich Text Editor Implementation with TipTap (Author: Atik) ✅
  - Complete TipTap-based editor with comprehensive toolbar and extensions
  - Auto-save functionality with debounced updates and real-time status indicators
  - Advanced image upload and resizing with S3 integration
  - Export to PDF and DOCX with embedded images and proper styling
  - Share functionality with email notifications and permission management
  - Draft/publish workflow with title editing and content persistence
  - Mobile-responsive design with keyboard shortcuts and accessibility support

### Week 5 – AI Summarization (Author: @Atik203) ✅

- [x] Integrate OpenAI/LLM API for summarization
- [x] Multi-provider AI service (Gemini 2.5-flash-lite primary, OpenAI secondary)
- [x] AI paper summarization with performance optimization
- [x] Intelligent paper insights with contextual chat
- [x] Paper context integration throughout chat session
- [x] Convert dashboard navigation to role-scoped routes with shared module wrappers
- [x] Launch admin overview workspace with production-ready analytics cards
- [x] Align workspace/member screens with new layout (name/email fixes, invitation UX)
- [x] Update middleware, redirects, and AppSidebar to honor role-based landing pages
- [x] Dynamic admin system monitoring with real-time metrics (CPU, memory, storage, database)
- [x] Accurate CPU usage calculation using Node.js os module with idle/total times
- [x] Smart storage tracking with dynamic estimation based on actual database usage
- [x] Real-time polling (10s) with RTK Query and comprehensive health status dashboard
- [x] Production-grade components (HealthCard, PerformanceBar, SystemInfoRow) with lazy loading

### Week 5.5 – Performance Optimization & Production Hardening (Author: @Atik203) ✅

### Phase 1-4 Complete: Lighthouse Score Achievement

- [x] **Phase 1 & 2 - Quick Wins & Critical Optimizations** ✅
  - [x] Next.js compiler optimizations (SWC, modularizeImports, optimizeCss)
  - [x] Route-based code splitting with dynamic imports
  - [x] Font loading optimization (display: swap, preload)
  - [x] Image optimization (AVIF, WebP, cache headers)
  - [x] React Query optimizations (staleTime, keepUnusedDataFor)
  - [x] Component-level optimization (React.memo, useMemo, useCallback)
  - [x] Redis caching with free tier optimization (30MB, 50KB limits)
  - [x] Database indexes (5 on Paper, 3 on CollectionPaper)
  - [x] HTTP caching middleware with ETag support

- [x] **Phase 3 - Advanced Optimizations** ✅
  - [x] PWA implementation with service worker (offline support, caching strategies)
  - [x] Manifest.json with app shortcuts and icons
  - [x] Skeleton loading states (PaperCard, Dashboard, Table, Form)
  - [x] Enhanced security headers (CSP, HSTS, X-Frame-Options)
  - [x] Progressive loading patterns for better UX

- [x] **Phase 4 - Security & SEO** ✅
  - [x] Production-grade CSP headers (prevent XSS, whitelist domains)
  - [x] HSTS with 1-year max-age and preload
  - [x] X-Frame-Options (DENY) and X-Content-Type-Options (nosniff)
  - [x] robots.txt with proper crawling rules
  - [x] Structured data (JSON-LD) for WebApplication schema
  - [x] Enhanced Open Graph and Twitter Card metadata
  - [x] PWA meta tags and viewport configuration

### Week 6 – Stripe Payment System (Author: @Atik203) ✅

- [x] Stripe integration with live subscription billing (v1.1.6)
- [x] Implement webhook handling for subscription events
- [x] Add support for multiple payment methods (credit card, PayPal, etc.)
- [x] Manage subscription upgrades/downgrades and proration
- [x] Subscription plans & premium features (Stripe checkout, dashboard billing UI)
- [x] Added billing page to dashboard with plan details and real-time status

- [ ] SSLCommerz integration

### Week 6.5 – Annotation & Comments

- [ ] Highlighting & annotations in PDF viewer
- [ ] Referencing system for academic citations with BibTeX/EndNote export and formatting (APA, MLA, IEEE)
- [ ] Save annotations/comments (user & paper)
- [ ] Research comment threads & activity log for user interactions
- [ ] Research Notes

---

## Phase 2 – Advanced Features (Weeks 7–14)

Goal: Collaboration tools, advanced research utilities, improved UI.

### Week 7-8 – Citation System

- [ ] Parse references & citation relationships
- [ ] Citation graph visualization & formatting (APA, MLA, IEEE)

### Week 9-10 – Team Collaboration

- [ ] Shared collections with role-based permissions
- [ ] Team workspace & activity feed

### Week 11-12 – Enhanced Features

- [ ] Dashboard analytics & versioning system
- [ ] Mobile responsiveness improvements

### Week 13-14 – AI Research Assistant

- [ ] Chat with uploaded papers & multi-document Q&A
- [ ] Final polishing & performance optimization

---

## Phase 3 – Premium & Integrations (Weeks 15–20)

Goal: Monetization, admin tools, external integrations.

### Week 17-18 – Admin & Integrations

- [ ] Admin panel & platform analytics
- [ ] External API integrations (CrossRef, Semantic Scholar)

### Week 19-20 – Launch Preparation

- [ ] Security audit & final QA
- [ ] Production deployment & marketing

---

Total Duration: 20 weeks (~5 months)
Current Status: Week 6.5 Complete – Billing & payments launched (Stripe subscriptions live, dashboard billing refresh) ✅ (Author: Atik)
Last Updated: October 1, 2025
