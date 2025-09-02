# Scholar-Flow Changelog

## Roadmap Progress (Last Updated: August 30, 2025)

### Phase 1 – MVP (Weeks 1–6)

Goal: Get a working core platform with minimal but functional features.

**Week 1 – Project Setup & Foundations (Author: Atik) ✅**

- Setup & Configuration (monorepo, Next.js 15, Node.js backend)
- TypeScript, ESLint, Prettier, Husky hooks
- Prisma with PostgreSQL (User, Paper, Collection tables)
- Auth.js authentication (Google + email/password)
- .env setup for local/staging
- Tailwind CSS + ShadCN UI + Redux Toolkit

**Week 2 – User Auth & Profile (Author: Atik) ✅**

- Sign up / login / logout
- Google OAuth (upsert handling)
- Auth testing suite
- Error handling & unique constraint management
- JWT-based authentication
- User profile page (name, email, avatar)
- Role-based access control (future admin)
- Prisma migrations for User table + seeds
  **Major Achievement:** OAuth Authentication System completed (Prisma upsert patterns)

**Week 3 – Paper Upload & Storage**

- Add password reset, email verification, forgot password ✅ (Author: Atik+Salman)
- Add API to update/edit user profile
- Connect to cloud storage for file uploads
- Build paper upload page (PDF, DOCX)
- Store metadata (title, author, year) in DB
- Extract text content from uploaded PDFs
- Store original file in cloud storage (AWS S3)
- UI for viewing uploaded papers

**Week 3.5 – Modern UI/UX Redesign (Author: Atik) ✅**

- Complete dashboard redesign with modern SaaS-style interface ✅
- Implemented shadcn/ui sidebar with collapsible navigation ✅
- Added responsive mobile hamburger menu with sheet overlay ✅
- Fixed sidebar positioning with CSS Grid (2-3 columns) ✅
- Desktop: Fixed sidebar, only content scrolls for modern UX ✅
- Mobile/Tablet: Hidden sidebar with hamburger menu (< 1024px) ✅
- Comprehensive responsive design across all device sizes ✅
- Custom theme integration with light/dark mode support ✅
- Role-based navigation filtering and user permissions ✅
- Professional backdrop blur effects and smooth animations ✅
  **Major Achievement:** Production-ready responsive dashboard with modern SaaS design patterns

**Technical Implementation Details:**

- CSS Grid System: 12-column layout (sidebar: 2-3 cols, content: 9-10 cols)
- Responsive Breakpoints: Mobile (<640px), Tablet (640px-1024px), Desktop (≥1024px)
- Component Structure: ConditionalLayout → DashboardLayout → AppSidebar
- Mobile Navigation: Sheet component with hamburger menu trigger
- Modern UX Patterns: Fixed sidebar, backdrop blur headers, custom scrollbars
- Performance: Minimal layout shifts, smooth CSS transitions, optimized z-index stacking

**Week 4 – Basic Collections**

- Create Collection flow
- Add papers to collections
- Collection listing page
- Search & filter (title, author)
- Backend CRUD for collections & papers

**Week 5 – AI Summarization & Semantic Search**

- Integrate OpenAI/LLM API for summarization
- Summary generation & DB storage
- Vector search with embeddings
- Semantic paper search

**Week 6 – Annotation & Comments**

- Highlighting & annotations in PDF viewer
- Comment threads under papers
- Save annotations/comments (user & paper)
- Activity log for user interactions

---

### Phase 2 – Advanced Features (Weeks 7–14)

Goal: Collaboration tools, advanced research utilities, improved UI.

**Week 7 – Citation Graph**

- Parse references from uploaded papers
- Store citation relationships in DB
- Citation graph visualization (D3.js/Cytoscape.js)

**Week 8 – Citation Formatting**

- Generate citations (APA, MLA, IEEE)
- Copy Citation button
- Export citations (.bib/Word)

**Week 9 – Shared Collections (Team Collaboration)**

- CollectionMember table (roles: Owner, Editor, Viewer)
- Invite users via email
- Role-based permissions

**Week 10 – Team Workspace**

- Team dashboard
- Team-level collections
- Activity feed for collaborators

**Week 11 – Enhanced UI**

- Dashboard analytics (papers, cited authors)
- Dark/light theme toggle
- Mobile responsiveness

**Week 12 – Versioning**

- Track paper versions
- Change history for annotations/summaries

**Week 13 – AI Research Assistant**

- Chat with uploaded papers
- Multi-document Q&A

**Week 14 – Polishing & Bug Fixes**

- Final pass on Phase 2 features
- UI fixes
- Performance & query optimization

---

### Phase 3 – Premium & Integrations (Weeks 15–20)

Goal: Monetization, admin tools, external integrations.

**Week 15 – Payment System**

- Stripe integration (international)
- SSLCommerz integration (local)
- Subscription plans (Plan, Subscription tables)
- Payment webhooks

**Week 16 – Subscription Features**

- Premium feature restrictions
- Upgrade/Downgrade flow
- Invoice & billing history

**Week 17 – Admin Panel**

- Admin dashboard (users, papers, collections)
- Admin tools (ban, content removal)
- Platform analytics

**Week 18 – External API Integrations**

- CrossRef API (metadata lookup)
- Semantic Scholar/arXiv API (paper search/import)

**Week 19 – Final QA**

- Security audit
- Code review & cleanup
- Core feature tests

**Week 20 – Launch**

- Production deployment
- Marketing page
- Onboarding guide

---

**Total Duration:** 20 weeks (~5 months)
