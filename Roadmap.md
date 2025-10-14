# Scholar-Flow Development Roadmap

Author: Atik
Last Updated: October 3, 2025

## Phase 1 – MVP (Weeks 1–6)

Goal: Get a working core platform with minimal but functional features.

### Week 1 – Project Setup & Foundations (Author: Atik) ✅

- [x] Setup & Configuration (monorepo, Next.js 15, Node.js backend)
- [x] TypeScript, ESLint, Prettier, Husky hooks
- [x] Prisma with PostgreSQL (User, Paper, Collection tables)
- [x] Auth.js authentication (Google + email/password)
- [x] Environment setup & Tailwind CSS + ShadCN UI + Redux Toolkit

### Week 2 – User Auth & Profile (Author: Atik) ✅

- [x] Sign up / login / logout with Google OAuth
- [x] JWT-based authentication with comprehensive testing
- [x] User profile management & role-based access control
- [x] Production-ready error handling & unique constraint management

### Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface
- [x] Responsive sidebar with collapsible navigation & mobile hamburger menu
- [x] CSS Grid system with professional backdrop blur effects
- [x] Custom theme integration with light/dark mode support

### Week 3 – Paper Upload & Storage (Author: Atik) ✅

- [x] Password reset, email verification & user profile management
- [x] Cloud storage integration (AWS S3) with file upload system
- [x] Paper upload page (PDF, DOCX) with metadata extraction
- [x] Modern paper viewing interface with fallback support

### Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: Atik) ✅

- [x] Advanced search page with comprehensive filters & fuzzy search
- [x] Modern papers list with real-time search functionality
- [x] Enhanced dashboard with improved navigation & quick actions
- [x] Component architecture cleanup & duplicate code removal

### Week 4 – Basic Collections (Author: Atik + Salman) ✅

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
- [x] Collection invitation system with email notifications (Author: Atik) ✅

### Week 4.5 – Advanced Workspace Management (Author: Atik) ✅

**Key Features Delivered:**

- [x] Workspace settings and management interface with modern UI (Author: Atik) ✅
- [x] Comprehensive workspace invitation system with email notifications (Author: Atik) ✅
- [x] Role-based permission management (OWNER/ADMIN/TEAM_LEAD/PRO_RESEARCHER/RESEARCHER) (Author: Atik) ✅
- [x] Workspace member management with add/remove/role update functionality (Author: Atik) ✅
- [x] Invitation tracking system (sent/received invitations) (Author: Atik) ✅
- [x] Accept/decline invitation workflow with status management (Author: Atik) ✅
- [x] Real-time workspace updates and cache invalidation (Author: Atik) ✅
- [x] Workspace edit functionality (name/description updates) (Author: Atik) ✅
- [x] Activity logging for workspace actions and member changes (Author: Atik) ✅
- [x] Advanced permission checks and security controls (Author: Atik) ✅
- [x] Production-grade error handling and input validation (Author: Atik) ✅
- [x] AWS SDK v3 migration for improved performance and modern tooling (Author: Atik) ✅
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

### Week 5 – AI Summarization and Chat (Author: Atik) ✅

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

### Week 5.5 – Performance Optimization & Production Hardening (Author: Atik) ✅

- [x] Next.js compiler optimizations (SWC, modularizeImports, code splitting)
- [x] Font & image optimization (AVIF/WebP, display swap, cache headers)
- [x] React Query & component optimization (staleTime, memo, useMemo)
- [x] Redis caching with free tier limits (30MB, 50KB per key)
- [x] Database indexing (8 composite indexes on Paper, CollectionPaper)
- [x] PWA implementation (service worker, offline support, manifest.json)
- [x] Skeleton loading states (Dashboard, PaperCard, Table, Form)
- [x] Production security headers (CSP, HSTS, X-Frame-Options)
- [x] SEO enhancements (robots.txt, JSON-LD schema, Open Graph)
- [x] HTTP caching middleware with ETag support

### Week 6 – Stripe Payment and Analytics System (Author: Atik) ✅

- [x] Stripe integration with live subscription billing (v1.1.6)
- [x] Implement webhook handling for subscription events
- [x] Add support for multiple payment methods (credit card, PayPal, etc.)
- [x] Manage subscription upgrades/downgrades and proration
- [x] Subscription plans & premium features (Stripe checkout, dashboard billing UI)
- [x] Added billing page to dashboard with plan details and real-time status
- [x] Modern Analytics Dashboard: Improved chart colors, legends, dark mode, progress bars
- [x] Admin Analytics dashboard with user management and system information

### Week 6 – Annotation & Collaboration (Author: Salman) ✅

- [x] PDF highlighting & annotation
- [x] Save user/paper comments
- [x] Research notes system
- [x] Academic citation export (BibTeX/EndNote, APA/MLA/IEEE)
- [x] Threaded research discussions & activity log

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

- [ ] Advanced AI summarization & insights
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
Current Status: Week 6 Phase 1 Complete – Annotation & Collaboration system launched (PDF annotations, comments, research notes) ✅ (Author: Atik)
Last Updated: January 15, 2025
