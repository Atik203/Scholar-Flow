# Scholar-Flow Changelog

## v1.1.3 (2025-09-30) – Role-Based Dashboard Refresh

Author: @Atik203

### Highlights – v1.1.3

- **Role-Scoped Navigation**: Dashboard URLs now live under `/dashboard/{role}/…` with shared module wrappers and thin role exports for every surface.
- **Admin Workspace**: New admin overview with curated KPIs, action shortcuts, and consistent DashboardLayout usage across admin tools.
- **Middleware & Redirects**: Auth middleware, verify-email flows, and CTA buttons updated to respect role-specific landing pages.
- **Workspace UX Polish**: Members tab now shows accurate name + email metadata, plus unified layout across workspace tabs.
- **Sidebar Consistency**: AppSidebar + navigation config rewritten to map roles directly to refreshed routes.

### Technical Notes – v1.1.3

- Consolidated dashboard module exports to a shared `(modules)` directory consumed by `(roles)` wrappers.
- Added `getRoleDashboardUrl` helper and propagated through auth routes, CTA/Hero components, and research tools.
- Wrapped admin pages (overview, users, settings, system, analytics) with `DashboardLayout` for shell parity.
- Hardened middleware redirect logic to derive role slug from session and route users accordingly.
- Updated RTK Query-powered workspace views to rely on top-level member fields (`name`, `email`) returned by SQL joins.

## v1.1.2 (2025-09-30) – AI Integration Complete

Author: @Atik203

### Highlights – v1.1.2

- **Multi-Provider AI Service**: Comprehensive AI integration with Gemini 2.5-flash-lite (primary, free) and OpenAI gpt-4o-mini (secondary) with intelligent fallback system
- **AI Paper Summarization**: Production-grade paper summarization with performance optimization, caching, and comprehensive error handling
- **Intelligent Paper Insights**: Context-aware AI chat system allowing natural conversations about specific papers
- **Paper Context Integration**: AI maintains full awareness of paper content throughout entire chat conversations
- **Natural Language Interface**: Updated AI providers to return conversational responses for improved user experience
- **Cost-Effective Architecture**: Prioritized free AI models while maintaining high-quality responses and reliability

### Technical Implementation – v1.1.2

#### AI Service Architecture

- **BaseAiProvider Pattern**: Modular provider system with configurable fallback order ["gemini", "openai"]
- **Gemini Integration**: v1beta API with 2.5-flash-lite and 2.5-flash models, natural conversational responses
- **OpenAI Integration**: Cost-effective gpt-4o-mini model with structured JSON responses and error handling
- **Context Management**: Always include paper extracted text as context for AI insights and conversations
- **Performance Optimization**: Response caching, token usage monitoring, and request timeout handling
- **Production Testing**: 8/8 AI provider smoke tests passing with real API integration

#### Backend Improvements

- **Paper Controller**: Enhanced generateInsight endpoint to always include paper context
- **AI Cache System**: Intelligent caching for paper summaries and AI responses
- **Error Handling**: Production-grade error classes and fallback mechanisms
- **Provider Configuration**: Environment-based configuration with feature flags and API key management

#### Frontend Experience

- **Natural Chat Interface**: Fixed JSON response display, now shows conversational AI responses
- **Model Selection**: Updated AI model picker with Gemini prioritized as primary free option
- **Error Recovery**: Automatic retry logic for network errors and provider failover
- **Toast Integration**: Seamless error/success notifications using Sonner with proper retry handling

### Removed

- **Deepseek Provider**: Removed paid AI provider to focus on free, cost-effective solutions
- **JSON Chat Responses**: Eliminated technical JSON display in favor of natural conversation flow

## v1.1.1 (2025-09-24) – Rich Text Editor & Content Management

Author: @Atik203

### Highlights – v1.1.1

- **Complete Rich Text Editor Implementation**: Full-featured TipTap-based editor with comprehensive toolbar and extensions
- **Advanced Auto-save System**: Debounced content saving with real-time status indicators and Ctrl+S keyboard support
- **Export Functionality**: PDF and DOCX export with embedded images, proper styling, and metadata preservation
- **Image Management**: Advanced image upload with S3 integration, resizing capabilities, and drag-and-drop support
- **Sharing & Collaboration**: Email sharing with permission management and seamless integration with existing workspace system
- **Draft/Publish Workflow**: Complete content lifecycle management with title editing and version control

### Technical Implementation – v1.1.1

#### Frontend Features

- **TipTap Editor**: StarterKit, Typography, Superscript/Subscript, Text Alignment, Highlight, Task Lists
- **Advanced Image Handling**: ResizableImageWithPopover extension with S3 upload integration
- **Mobile-Responsive Design**: Collapsible toolbar, touch-friendly controls, and adaptive layouts
- **Accessibility Support**: ARIA labels, keyboard navigation, and screen reader compatibility
- **Error Handling**: Comprehensive retry logic, toast notifications, and graceful degradation

#### Backend Features

- **Content API Endpoints**: Full CRUD operations for editor papers with sanitized HTML storage
- **Export Services**: Puppeteer-based PDF generation and html-docx-js DOCX creation with image embedding
- **Auto-save System**: Lightweight endpoint for frequent content updates without full validation overhead
- **Security**: HTML sanitization, rate limiting, and permission-based access control
- **Performance**: Optimized database queries with proper indexing and caching strategies

#### Key Technical Details

- **Image Processing**: Automatic URL-to-base64 conversion for DOCX export compatibility
- **Content Sanitization**: DOMPurify-style HTML cleaning for XSS prevention
- **Database Integration**: Raw SQL queries via Prisma for optimized performance
- **Error Management**: Production-grade error classes and standardized API responses
- **Real-time Updates**: Debounced auto-save with conflict resolution and status tracking

---

## v1.1.0 (2025-09-24) – Preview-first Extraction & Gotenberg

Authors: @Atik203

### Highlights – v1.1.0

- Preview-first Extraction Text: shows high-fidelity view/preview for DOCX/PDF (no rich-text editor yet)
- DOCX→PDF preview pipeline using Gotenberg (Docker), suitable for EC2 deployment
- Keeps raw text extraction for search/embeddings while prioritizing accurate visual preview

### Details – v1.1.0

- Backend – Added DOCX→PDF conversion via Gotenberg service; signed preview URL API improvements
- Frontend – Updated extraction view to prefer preview/inline viewers (PDF iframe, DOCX preview), with fallbacks
- Infra – docker-compose snippet for running Gotenberg locally; guidance for EC2 deployment

---

## v1.0.9 (2025-09-21) – Document Extraction & Preview

Authors: @Atik203, @Salman

### Highlights

- PDF & DOCX extraction unified with improved formatting retention
- High‑fidelity DOCX preview using docx-preview with mammoth fallback
- Robust PDF preview with iframe fallback and error handling
- Signed URL response fix (await) and strict frontend typing
- Continuous Extracted Text view (justified, scrollable) with dark‑mode‑friendly filters

### Details

- Backend - Fixed `getFileUrl` to await `storage.getSignedUrl` returning a string - Standardized responses via `sendSuccessResponse`
- Frontend - `DocumentPreview`: MIME/extension detection; DOCX rendered via `docx-preview`, fallback to `mammoth`; Office Viewer button - `PdfViewerFallback`: improved loading and retry UX - All `DocumentPreview` callers now pass `file.contentType` - `ExtractedTextDisplay`: new Continuous view merges chunks into formatted, justified text; dark‑theme select styling; copy‑all action

---

## Roadmap Progress (Last Updated: September 24, 2025)

### Phase 1 – MVP (Weeks 1–6)

Goal: Get a working core platform with minimal but functional features.

### Week 1 – Project Setup & Foundations (Author: Atik) ✅

- [x] Setup & Configuration (monorepo, Next.js 15, Node.js backend)
- [x] TypeScript, ESLint, Prettier, Husky hooks
- [x] Prisma with PostgreSQL (User, Paper, Collection tables)
- [x] Auth.js authentication (Google + email/password)
- [x] .env setup for local/staging
- [x] Tailwind CSS + ShadCN UI + Redux Toolkit

### Week 2 – User Auth & Profile (Author: Atik) ✅

- [x] Sign up / login / logout
- [x] Google OAuth (upsert handling)
- [x] Auth testing suite
- [x] Error handling & unique constraint management
- [x] JWT-based authentication
- [x] User profile page (name, email, avatar)
- [x] Role-based access control (future admin)
- [x] Prisma migrations for User table + seeds
      **Major Achievement:** OAuth Authentication System completed (Prisma upsert patterns)

### Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface
- [x] Implemented shadcn/ui sidebar with collapsible navigation
- [x] Added responsive mobile hamburger menu with sheet overlay
- [x] Fixed sidebar positioning with CSS Grid (2-3 columns)
- [x] Desktop: Fixed sidebar, only content scrolls for modern UX
- [x] Mobile/Tablet: Hidden sidebar with hamburger menu (< 1024px)
- [x] Comprehensive responsive design across all device sizes
- [x] Custom theme integration with light/dark mode support
- [x] Role-based navigation filtering and user permissions
- [x] Professional backdrop blur effects and smooth animations
      **Major Achievement:** Production-ready responsive dashboard with modern SaaS design patterns

**Technical Implementation Details:**

- CSS Grid System: 12-column layout (sidebar: 2-3 cols, content: 9-10 cols)
- Responsive Breakpoints: Mobile (<640px), Tablet (640px-1024px), Desktop (≥1024px)
- Component Structure: ConditionalLayout → DashboardLayout → AppSidebar
- Mobile Navigation: Sheet component with hamburger menu trigger
- Modern UX Patterns: Fixed sidebar, backdrop blur headers, custom scrollbars
- Performance: Minimal layout shifts, smooth CSS transitions, optimized z-index stacking

### Week 3 – Paper Upload & Storage

- [x] Add password reset, email verification, forgot password ✅ (Author: Atik+Salman)
- [x] Add API to update/edit user profile ✅ (Author: Atik)
- [x] Implement Personal Information Update feature with enhanced validation ✅ (Author: Atik)
- [x] Implement Delete Account feature with confirmation dialog ✅ (Author: Atik)
- [x] Connect to cloud storage for file uploads ✅ (Author: Atik+Salman)
  - Implemented comprehensive AWS S3 cloud storage service with presigned URLs
  - Added secure file upload API endpoints with validation and error handling
  - Created modern drag-and-drop file upload component with progress tracking
  - Built file management interface with download/delete functionality
  - Added file metadata management and integrity checks
  - Implemented workspace-based access control for file operations
  - Added support for multiple file types (PDF, DOCX, DOC, TXT, RTF)
  - Configured environment variables for cloud storage settings
- [x] Build paper upload page (PDF, DOCX) ✅ (Author: Atik)
- [x] Store metadata (title, author, year) in DB ✅ (Author: Atik)
- [x] Store original file in cloud storage (AWS S3) ✅ (Author: Atik)
- [x] UI for viewing uploaded papers ✅ (Author: Atik)

**✅ Paper Upload & Storage Complete (September 17, 2025):** Paper management system implemented by Atik including S3 storage integration, basic PDF processing, metadata extraction, comprehensive upload UI, and modern paper viewing interface with fallback support.

### Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: Atik) ✅

- [x] Advanced search page with comprehensive filters and fuzzy search functionality
- [x] Modern papers list with real-time search and responsive design
- [x] Enhanced dashboard with improved navigation and role-based quick actions
- [x] PDF fallback viewer with robust error handling and graceful degradation
- [x] Sidebar navigation system with correct routing and mobile responsiveness
- [x] Dashboard component architecture cleanup and duplicate code removal
- [x] Modern SaaS-style interface with professional styling and animations

**✅ Major UI/UX Enhancement (September 17, 2025):** Complete interface overhaul with advanced search capabilities, modern paper management system, enhanced dashboard experience, and improved navigation architecture implemented by Atik.

### Week 4 – Basic Collections

- [x] Create Collection flow ✅ (Author: Atik+Salman)
- [x] Add papers to collections ✅ (Author: Atik)
- [x] Collection listing page (papers management interface) ✅ (Author: Atik)
- [x] Search & filter (title, author, fuzzy search) ✅ (Author: Atik)
- [x] Backend CRUD for collections & papers ✅ (Author: Atik+Salman)
- [x] Permission-based sharing system (VIEW/EDIT) ✅ (Author: Atik)
- [x] Collection invitation system with email notifications ✅ (Author: Atik)
- [x] Real-time cache invalidation and updates ✅ (Author: Atik)
- [x] Extract text content from uploaded PDFs ()

**✅ Collections Management Complete (September 19, 2025):** Comprehensive collection management system with permission-based sharing implemented by Atik+Salman. Features include CRUD operations, role-based access control (OWNER/EDIT/VIEW), invitation system, real-time updates, and modern UI components. PDF text extraction remains pending for Week 4.5.

### Week 4.5 – Advanced Workspace Management (Author: Atik) ✅

- [x] Workspace settings and management interface with modern UI ✅ (Author: Atik)
- [x] Comprehensive workspace invitation system with email notifications ✅ (Author: Atik)
- [x] Role-based permission management (OWNER/ADMIN/TEAM_LEAD/PRO_RESEARCHER/RESEARCHER) ✅ (Author: Atik)
- [x] Workspace member management with add/remove/role update functionality ✅ (Author: Atik)
- [x] Invitation tracking system (sent/received invitations) ✅ (Author: Atik)
- [x] Accept/decline invitation workflow with status management ✅ (Author: Atik)
- [x] Real-time workspace updates and cache invalidation ✅ (Author: Atik)
- [x] Workspace edit functionality (name/description updates) ✅ (Author: Atik)
- [x] Activity logging for workspace actions and member changes ✅ (Author: Atik)
- [x] Advanced permission checks and security controls ✅ (Author: Atik)
- [x] Production-grade error handling and input validation ✅ (Author: Atik)
- [x] AWS SDK v3 migration for improved performance and modern tooling ✅ (Author: Atik)

**✅ Advanced Workspace Management Complete (September 19, 2025):** Comprehensive workspace management system implemented by Atik including full CRUD operations, sophisticated role-based permission system, invitation workflow with email notifications, member management, activity logging, and AWS SDK v3 migration for enhanced performance. Features production-grade security controls, real-time updates, and modern UI components.

### Week 5 – AI Summarization & Semantic Search

- [ ] Integrate OpenAI/LLM API for summarization
- [ ] Summary generation & DB storage
- [ ] Vector search with embeddings
- [ ] Semantic paper search

### Week 6 – Annotation & Comments

- [ ] Highlighting & annotations in PDF viewer
- [ ] Comment threads under papers
- [ ] Save annotations/comments (user & paper)
- [ ] Activity log for user interactions

---

### Phase 2 – Advanced Features (Weeks 7–14)

Goal: Collaboration tools, advanced research utilities, improved UI.

### Week 7 – Citation Graph

- [ ] Parse references from uploaded papers
- [ ] Store citation relationships in DB
- [ ] Citation graph visualization (D3.js/Cytoscape.js)

### Week 8 – Citation Formatting

- [ ] Generate citations (APA, MLA, IEEE)
- [ ] Copy Citation button
- [ ] Export citations (.bib/Word)

### Week 9 – Shared Collections (Team Collaboration)

- [ ] CollectionMember table (roles: Owner, Editor, Viewer)
- [ ] Invite users via email
- [ ] Role-based permissions

### Week 10 – Team Workspace

- [ ] Team dashboard
- [ ] Team-level collections
- [ ] Activity feed for collaborators

### Week 11 – Enhanced UI

- [ ] Dashboard analytics (papers, cited authors)
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness

### Week 12 – Versioning

- [ ] Track paper versions
- [ ] Change history for annotations/summaries

### Week 13 – AI Research Assistant

- [ ] Chat with uploaded papers
- [ ] Multi-document Q&A

### Week 14 – Polishing & Bug Fixes

- [ ] Final pass on Phase 2 features
- [ ] UI fixes
- [ ] Performance & query optimization

---

### Phase 3 – Premium & Integrations (Weeks 15–20)

Goal: Monetization, admin tools, external integrations.

### Week 15 – Payment System

- [ ] Stripe integration (international)
- [ ] SSLCommerz integration (local)
- [ ] Subscription plans (Plan, Subscription tables)
- [ ] Payment webhooks

### Week 16 – Subscription Features

- [ ] Premium feature restrictions
- [ ] Upgrade/Downgrade flow
- [ ] Invoice & billing history

### Week 17 – Admin Panel

- [ ] Admin dashboard (users, papers, collections)
- [ ] Admin tools (ban, content removal)
- [ ] Platform analytics

### Week 18 – External API Integrations

- [ ] CrossRef API (metadata lookup)
- [ ] Semantic Scholar/arXiv API (paper search/import)

### Week 19 – Final QA

- [ ] Security audit
- [ ] Code review & cleanup
- [ ] Core feature tests

### Week 20 – Launch

- [ ] Production deployment
- [ ] Marketing page
- [ ] Onboarding guide

---

**Total Duration:** 20 weeks (~5 months)
