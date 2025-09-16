# 📅 Week-by-Week Sprint Plan

> Full project details: [Google Doc](https://docs.google.com/document/d/10oG-05TTcYJD59hSRSaZbu1y9ygjzwUv26wyUCYi5_w/edit?usp=sharing)

Phase 1 – MVP (Weeks 1–6)
Goal: Get a working core platform with minimal but functional features.

---

Week 1 – Project Setup & Foundations (Author: Atik) ✅

- [x] Setup & Configuration
  - [x] Initialize monorepo / Next.js 15 + Node.js backend ✅
  - [x] Configure TypeScript, ESLint, Prettier, Husky hooks ✅
  - [x] Setup Prisma with PostgreSQL database schema (initial tables: User, Paper, Collection) ✅
  - [x] Setup Auth.js authentication (Google + email/password) ✅

- [x] Environment & DevOps
  - [x] Setup .env variables and config for local and staging environments ✅
  - [x] Integrate Tailwind CSS + ShadCN UI + Redux Toolkit store ✅

---

Week 2 – User Auth & Profile (Author: Atik) ✅

- [x] Implement sign up / login / logout ✅
- [x] OAuth authentication (Google OAuth with upsert handling) ✅
- [x] Comprehensive authentication testing suite ✅
- [x] Production-ready error handling and unique constraint management ✅
- [x] JWT-based authentication with secure token management ✅
- [x] Implement user profile page (basic: name, email, avatar) ✅
- [x] Basic role-based access control for future admin support ✅
- [x] Write first Prisma migrations for User table + seeds ✅

**✅ Major Achievement:** OAuth Authentication System completed with proper Prisma upsert patterns.

---

Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface ✅
- [x] Implement shadcn/ui sidebar component with collapsible navigation ✅
- [x] Add responsive mobile hamburger menu with sheet overlay ✅
- [x] Fix sidebar positioning using CSS Grid system (2-3 columns) ✅
- [x] Desktop: Fixed sidebar positioning, only content area scrolls ✅
- [x] Mobile/Tablet: Hidden sidebar with hamburger menu (< 1024px) ✅
- [x] Comprehensive responsive design for all device breakpoints ✅
- [x] Custom theme integration with seamless light/dark mode ✅
- [x] Role-based navigation filtering and user permission system ✅
- [x] Professional backdrop blur effects and smooth animations ✅
- [x] Modern z-index layering and layout conflict resolution ✅

**✅ Major UI/UX Redesign:** Completed modern SaaS-style dashboard with responsive design and role-based navigation.

Week 3 – Paper Upload & Storage

- [x] Add password reset & email verification flow & forgot password ✅ (Author: Atik+Salman)
- [x] Add API to update/edit user profile ✅ (Author: Atik)
- [x] Implement Personal Information Update feature with enhanced validation ✅ (Author: Atik)
- [x] Implement Delete Account feature with confirmation dialog ✅ (Author: Atik)

**✅ Final Update (September 6, 2025):** All user profile management features completed and documented by Atik.

- [ ] Connect to cloud storage for file uploads
- [ ] Build paper upload page (PDF, DOCX)
- [ ] Store metadata (title, author, year) in DB
- [ ] Extract text content from uploaded PDFs
- [ ] Store original file in cloud storage (AWS S3)
- [ ] UI for viewing uploaded papers

---

---

Week 4 – Basic Collections

- [ ] Implement “Create Collection” flow
- [ ] Add papers to collections
- [ ] Collection listing page
- [ ] Basic search & filter (by title, author)
- [ ] Backend routes for CRUD on collections & papers

---

Week 5 – AI Summarization & Semantic Search

- [ ] Integrate OpenAI/LLM API for summarization
- [ ] Implement summary generation & store in DB
- [ ] Implement vector search with embeddings (e.g., Pinecone / Supabase vector)
- [ ] Search papers by semantic meaning

---

Week 6 – Annotation & Comments

- [ ] Enable highlighting & annotations in PDF viewer
- [ ] Comment threads under papers
- [ ] Save annotations/comments linked to user & paper
- [ ] Basic activity log for user interactions

---

---

Phase 2 – Advanced Features (Weeks 7–14)
Goal: Add collaboration tools, advanced research utilities, and improve UI.

---

Week 7 – Citation Graph

- [ ] Parse references from uploaded papers
- [ ] Store citation relationships in DB
- [ ] Generate citation graph visualization (D3.js or Cytoscape.js)

---

Week 8 – Citation Formatting

- [ ] Generate citations in APA, MLA, IEEE formats
- [ ] “Copy Citation” button
- [ ] Export all citations in a collection to a .bib / Word file

---

Week 9 – Shared Collections (Team Collaboration)

- [ ] Add CollectionMember table with roles: Owner, Editor, Viewer
- [ ] Invite users via email
- [ ] Role-based permissions on editing/viewing

---

Week 10 – Team Workspace

- [ ] Separate dashboard for team projects
- [ ] Team-level collections
- [ ] Activity feed showing changes by collaborators

---

Week 11 – Enhanced UI

- [ ] Improve dashboard UI with analytics (e.g., number of papers, most cited authors)
- [ ] Add dark/light theme toggle
- [ ] Improve mobile responsiveness

---

Week 12 – Versioning

- [ ] Track versions of uploaded papers
- [ ] View change history of annotations & summaries

---

Week 13 – AI Research Assistant

- [ ] Chat with uploaded papers (contextual retrieval)
- [ ] Multi-document question answering

---

Week 14 – Polishing & Bug Fixes

- [ ] Final pass on Phase 2 features
- [ ] Fix UI glitches
- [ ] Improve performance & query optimization

---

---

Phase 3 – Premium & Integrations (Weeks 15–20)
Goal: Monetization, admin tools, and external integrations.

---

Week 15 – Payment System

- [ ] Integrate Stripe for international payments
- [ ] Integrate SSLCommerz for local payments
- [ ] Setup subscription plans in DB (Plan, Subscription tables)
- [ ] Payment success/failure webhooks

---

Week 16 – Subscription Features

- [ ] Restrict premium features (e.g., team size, AI assistant limit)
- [ ] Upgrade/Downgrade plan flow
- [ ] Invoice & billing history

---

Week 17 – Admin Panel

- [ ] Admin dashboard for managing users, papers, collections
- [ ] Admin tools for banning, content removal
- [ ] Analytics on platform usage

---

Week 18 – External API Integrations

- [ ] Integrate CrossRef API for metadata lookup
- [ ] Integrate Semantic Scholar / arXiv API for paper search/import

---

Week 19 – Final QA

- [ ] Security audit
- [ ] Code review & cleanup
- [ ] Add tests for core features

---

Week 20 – Launch

- [ ] Deploy production build
- [ ] Marketing page setup
- [ ] Onboarding guide for first-time users

---

✅ Total Duration: 20 weeks (~5 months)
