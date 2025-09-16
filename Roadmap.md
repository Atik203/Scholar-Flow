# Scholar-Flow Development Roadmap# Scholar-Flow Development Roadmap

> Full project details: [Google Doc](https://docs.google.com/document/d/10oG-05TTcYJD59hSRSaZbu1y9ygjzwUv26wyUCYi5_w/edit?usp=sharing)> Full project details: [Google Doc](https://docs.google.com/document/d/10oG-05TTcYJD59hSRSaZbu1y9ygjzwUv26wyUCYi5_w/edit?usp=sharing)

## Phase 1 – MVP (Weeks 1–6)## Phase 1 – MVP (Weeks 1–6)

Goal: Get a working core platform with minimal but functional features.Goal: Get a working core platform with minimal but functional features.

### Week 1 – Project Setup & Foundations (Author: Atik) ✅### Week 1 – Project Setup & Foundations (Author: Atik) ✅

- [x] Setup & Configuration (monorepo, Next.js 15, Node.js backend)

- [x] Setup & Configuration (monorepo, Next.js 15, Node.js backend)- [x] TypeScript, ESLint, Prettier, Husky hooks

- [x] TypeScript, ESLint, Prettier, Husky hooks- [x] Prisma with PostgreSQL (User, Paper, Collection tables)

- [x] Prisma with PostgreSQL (User, Paper, Collection tables)- [x] Auth.js authentication (Google + email/password)

- [x] Auth.js authentication (Google + email/password)- [x] Environment setup & Tailwind CSS + ShadCN UI + Redux Toolkit

- [x] Environment setup & Tailwind CSS + ShadCN UI + Redux Toolkit

### Week 2 – User Auth & Profile (Author: Atik) ✅

### Week 2 – User Auth & Profile (Author: Atik) ✅- [x] Sign up / login / logout with Google OAuth

- [x] JWT-based authentication with comprehensive testing

- [x] Sign up / login / logout with Google OAuth- [x] User profile management & role-based access control

- [x] JWT-based authentication with comprehensive testing- [x] Production-ready error handling & unique constraint management

- [x] User profile management & role-based access control

- [x] Production-ready error handling & unique constraint management### Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface

### Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅- [x] Responsive sidebar with collapsible navigation & mobile hamburger menu

- [x] CSS Grid system with professional backdrop blur effects

- [x] Complete dashboard redesign with modern SaaS-style interface- [x] Custom theme integration with light/dark mode support

- [x] Responsive sidebar with collapsible navigation & mobile hamburger menu

- [x] CSS Grid system with professional backdrop blur effects### Week 3 – Paper Upload & Storage (Author: Atik) ✅

- [x] Custom theme integration with light/dark mode support- [x] Password reset, email verification & user profile management

- [x] Cloud storage integration (AWS S3) with file upload system

### Week 3 – Paper Upload & Storage (Author: Atik) ✅- [x] Paper upload page (PDF, DOCX) with metadata extraction

- [x] Modern paper viewing interface with fallback support

- [x] Password reset, email verification & user profile management

- [x] Cloud storage integration (AWS S3) with file upload system### Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: Atik) ✅

- [x] Paper upload page (PDF, DOCX) with metadata extraction- [x] Advanced search page with comprehensive filters & fuzzy search

- [x] Modern paper viewing interface with fallback support- [x] Modern papers list with real-time search functionality

- [x] Enhanced dashboard with improved navigation & quick actions

### Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: Atik) ✅- [x] Component architecture cleanup & duplicate code removal

- [x] Advanced search page with comprehensive filters & fuzzy search### Week 4 – Basic Collections

- [x] Modern papers list with real-time search functionality- [ ] Extract text content from uploaded PDFs

- [x] Enhanced dashboard with improved navigation & quick actions- [ ] Create Collection flow & add papers to collections

- [x] Component architecture cleanup & duplicate code removal- [x] Collection listing page & advanced search/filter functionality

- [x] Backend CRUD operations for collections & papers

### Week 4 – Basic Collections

### Week 5 – AI Summarization & Semantic Search

- [ ] Extract text content from uploaded PDFs- [ ] Integrate OpenAI/LLM API for summarization

- [ ] Create Collection flow & add papers to collections- [ ] Vector search with embeddings & semantic paper search

- [x] Collection listing page & advanced search/filter functionality

- [x] Backend CRUD operations for collections & papers### Week 6 – Annotation & Comments

- [ ] Highlighting & annotations in PDF viewer

### Week 5 – AI Summarization & Semantic Search- [ ] Comment threads & activity log for user interactions

- [ ] Integrate OpenAI/LLM API for summarization- [x] Write first Prisma migrations for User table + seeds ✅

- [ ] Vector search with embeddings & semantic paper search

---

### Week 6 – Annotation & Comments

**✅ Major Achievement:** OAuth Authentication System completed with proper Prisma upsert patterns.

- [ ] Highlighting & annotations in PDF viewer

- [ ] Comment threads & activity log for user interactionsWeek 5 – AI Summarization & Semantic Searchgoogle.com/document/d/10oG-05TTcYJD59hSRSaZbu1y9ygjzwUv26wyUCYi5_w/edit?usp=sharing)

---

## Phase 2 – Advanced Features (Weeks 7–14)Phase 1 – MVP (Weeks 1–6)

Goal: Collaboration tools, advanced research utilities, improved UI.Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅Goal: Get a working core platform with minimal but functional features.

### Week 7-8 – Citation System- [x] Complete dashboard redesign with modern SaaS-style interface ✅---

- [ ] Parse references & citation relationships- [x] Implement shadcn/ui sidebar component with collapsible navigation ✅

- [ ] Citation graph visualization & formatting (APA, MLA, IEEE)

- [x] Add responsive mobile hamburger menu with sheet overlay ✅Week 1 – Project Setup & Foundations (Author: Atik) ✅

### Week 9-10 – Team Collaboration

- [x] Fix sidebar positioning using CSS Grid system (2-3 columns) ✅

- [ ] Shared collections with role-based permissions

- [ ] Team workspace & activity feed- [x] Desktop: Fixed sidebar positioning, only content area scrolls ✅- [x] Setup & Configuration

### Week 11-12 – Enhanced Features- [x] Mobile/Tablet: Hidden sidebar with hamburger menu (< 1024px) ✅ - [x] Initialize monorepo / Next.js 15 + Node.js backend ✅

- [ ] Dashboard analytics & versioning system- [x] Comprehensive responsive design for all device breakpoints ✅ - [x] Configure TypeScript, ESLint, Prettier, Husky hooks ✅

- [ ] Mobile responsiveness improvements

- [x] Custom theme integration with seamless light/dark mode ✅ - [x] Setup Prisma with PostgreSQL database schema (initial tables: User, Paper, Collection) ✅

### Week 13-14 – AI Research Assistant

- [x] Role-based navigation filtering and user permission system ✅ - [x] Setup Auth.js authentication (Google + email/password) ✅

- [ ] Chat with uploaded papers & multi-document Q&A

- [ ] Final polishing & performance optimization- [x] Professional backdrop blur effects and smooth animations ✅

---- [x] Modern z-index layering and layout conflict resolution ✅- [x] Environment & DevOps

- [x] Setup .env variables and config for local and staging environments ✅

## Phase 3 – Premium & Integrations (Weeks 15–20)

**✅ Major UI/UX Redesign:** Completed modern SaaS-style dashboard with responsive design and role-based navigation. - [x] Integrate Tailwind CSS + ShadCN UI + Redux Toolkit store ✅

Goal: Monetization, admin tools, external integrations.

---

### Week 15-16 – Payment System

Week 3 – Paper Upload & Storage (Author: Atik) ✅Week 2 – User Auth & Profile (Author: Atik) ✅

- [ ] Stripe & SSLCommerz integration

- [ ] Subscription plans & premium features- [x] Add password reset & email verification flow & forgot password ✅ (Author: Atik+Salman)- [x] Implement sign up / login / logout ✅

### Week 17-18 – Admin & Integrations- [x] Add API to update/edit user profile ✅ (Author: Atik)- [x] OAuth authentication (Google OAuth with upsert handling) ✅

- [ ] Admin panel & platform analytics- [x] Implement Personal Information Update feature with enhanced validation ✅ (Author: Atik)- [x] Comprehensive authentication testing suite ✅

- [ ] External API integrations (CrossRef, Semantic Scholar)

- [x] Implement Delete Account feature with confirmation dialog ✅ (Author: Atik)- [x] Production-ready error handling and unique constraint management ✅

### Week 19-20 – Launch Preparation

- [x] Connect to cloud storage for file uploads ✅ (Author: Atik)- [x] JWT-based authentication with secure token management ✅

- [ ] Security audit & final QA

- [ ] Production deployment & marketing- [x] Build paper upload page (PDF, DOCX) ✅ (Author: Atik)- [x] Implement user profile page (basic: name, email, avatar) ✅

---- [x] Store metadata (title, author, year) in DB ✅ (Author: Atik)- [x] Basic role-based access control for future admin support ✅

**Total Duration:** 20 weeks (~5 months) - [x] Store original file in cloud storage (AWS S3) ✅ (Author: Atik)- [x] Write first Prisma migrations for User table + seeds ✅

**Current Status:** Week 3.5 Complete - Modern paper management system with advanced search ✅

**Last Updated:** September 17, 2025- [x] UI for viewing uploaded papers ✅ (Author: Atik)

**✅ Major Achievement:** OAuth Authentication System completed with proper Prisma upsert patterns.

**✅ Paper Upload & Storage Complete (September 17, 2025):** Paper management system implemented by Atik including S3 storage, basic PDF processing, metadata extraction, and modern UI for paper viewing and management.

---

---

Week 2.5 – Modern UI/UX Redesign (Author: Atik) ✅

Week 3.5 – Enhanced UI/UX & Modern Paper Management (Author: Atik) ✅

- [x] Complete dashboard redesign with modern SaaS-style interface ✅

- [x] Advanced search page with filters and fuzzy search ✅- [x] Implement shadcn/ui sidebar component with collapsible navigation ✅

- [x] Modern papers list with real-time search functionality ✅- [x] Add responsive mobile hamburger menu with sheet overlay ✅

- [x] Enhanced dashboard with improved navigation and responsive design ✅- [x] Fix sidebar positioning using CSS Grid system (2-3 columns) ✅

- [x] PDF fallback viewer with proper error handling ✅- [x] Desktop: Fixed sidebar positioning, only content area scrolls ✅

- [x] Sidebar navigation updates with correct routing ✅- [x] Mobile/Tablet: Hidden sidebar with hamburger menu (< 1024px) ✅

- [x] Dashboard modernization with role-based quick actions ✅- [x] Comprehensive responsive design for all device breakpoints ✅

- [x] Component architecture cleanup and duplicate removal ✅- [x] Custom theme integration with seamless light/dark mode ✅

- [x] Role-based navigation filtering and user permission system ✅

**✅ Major Enhancement (September 17, 2025):** Complete UI/UX overhaul with advanced search, modern paper management interface, enhanced dashboard, and improved navigation system completed by Atik.- [x] Professional backdrop blur effects and smooth animations ✅

- [x] Modern z-index layering and layout conflict resolution ✅

---

**✅ Major UI/UX Redesign:** Completed modern SaaS-style dashboard with responsive design and role-based navigation.

Week 4 – Basic Collections

Week 3 – Paper Upload & Storage

- [ ] Extract text content from uploaded PDFs

- [ ] Implement "Create Collection" flow- [x] Add password reset & email verification flow & forgot password ✅ (Author: Atik+Salman)

- [ ] Add papers to collections- [x] Add API to update/edit user profile ✅ (Author: Atik)

- [x] Collection listing page ✅ (Author: Atik)- [x] Implement Personal Information Update feature with enhanced validation ✅ (Author: Atik)

- [x] Basic search & filter (by title, author) ✅ (Author: Atik)- [x] Implement Delete Account feature with confirmation dialog ✅ (Author: Atik)

- [x] Backend routes for CRUD on collections & papers ✅ (Author: Atik)

**✅ Final Update (September 6, 2025):** All user profile management features completed and documented by Atik.

**✅ Partial Update (September 17, 2025):** Basic paper management, search/filter functionality, and backend CRUD operations completed by Atik. PDF text extraction and collection creation features pending.

- [x] Connect to cloud storage for file uploads ✅ (Author: Atik)

---- [x] Build paper upload page (PDF, DOCX) ✅ (Author: Atik)

- [x] Store metadata (title, author, year) in DB ✅ (Author: Atik)

Week 5 – AI Summarization & Semantic Search- [x] Store original file in cloud storage (AWS S3) ✅ (Author: Atik)

- [x] UI for viewing uploaded papers ✅ (Author: Atik)

- [ ] Integrate OpenAI/LLM API for summarization

- [ ] Implement summary generation & store in DB**✅ Paper Upload & Storage Update (September 17, 2025):** Paper management system implemented by Atik including S3 storage, basic PDF processing, metadata extraction, and modern UI for paper viewing and management.

- [ ] Implement vector search with embeddings (e.g., Pinecone / Supabase vector)

- [ ] Search papers by semantic meaning---

---

Week 6 – Annotation & CommentsWeek 4 – Basic Collections

- [ ] Enable highlighting & annotations in PDF viewer- [ ] Implement “Create Collection” flow

- [ ] Comment threads under papers- [ ] Add papers to collections

- [ ] Save annotations/comments linked to user & paper- [ ] Collection listing page

- [ ] Basic activity log for user interactions- [ ] Basic search & filter (by title, author)

- [ ] Backend routes for CRUD on collections & papers

---

---

---

Week 5 – AI Summarization & Semantic Search

Phase 2 – Advanced Features (Weeks 7–14)

Goal: Add collaboration tools, advanced research utilities, and improve UI.- [ ] Integrate OpenAI/LLM API for summarization

- [ ] Implement summary generation & store in DB

---- [ ] Implement vector search with embeddings (e.g., Pinecone / Supabase vector)

- [ ] Search papers by semantic meaning

Week 7 – Citation Graph

---

- [ ] Parse references from uploaded papers

- [ ] Store citation relationships in DBWeek 6 – Annotation & Comments

- [ ] Generate citation graph visualization (D3.js or Cytoscape.js)

- [ ] Enable highlighting & annotations in PDF viewer

---- [ ] Comment threads under papers

- [ ] Save annotations/comments linked to user & paper

Week 8 – Citation Formatting- [ ] Basic activity log for user interactions

- [ ] Generate citations in APA, MLA, IEEE formats---

- [ ] "Copy Citation" button

- [ ] Export all citations in a collection to a .bib / Word file---

---Phase 2 – Advanced Features (Weeks 7–14)

Goal: Add collaboration tools, advanced research utilities, and improve UI.

Week 9 – Shared Collections (Team Collaboration)

---

- [ ] Add CollectionMember table with roles: Owner, Editor, Viewer

- [ ] Invite users via emailWeek 7 – Citation Graph

- [ ] Role-based permissions on editing/viewing

- [ ] Parse references from uploaded papers

---- [ ] Store citation relationships in DB

- [ ] Generate citation graph visualization (D3.js or Cytoscape.js)

Week 10 – Team Workspace

---

- [ ] Separate dashboard for team projects

- [ ] Team-level collectionsWeek 8 – Citation Formatting

- [ ] Activity feed showing changes by collaborators

- [ ] Generate citations in APA, MLA, IEEE formats

---- [ ] “Copy Citation” button

- [ ] Export all citations in a collection to a .bib / Word file

Week 11 – Enhanced UI

---

- [ ] Improve dashboard UI with analytics (e.g., number of papers, most cited authors)

- [ ] Add dark/light theme toggleWeek 9 – Shared Collections (Team Collaboration)

- [ ] Improve mobile responsiveness

- [ ] Add CollectionMember table with roles: Owner, Editor, Viewer

---- [ ] Invite users via email

- [ ] Role-based permissions on editing/viewing

Week 12 – Versioning

---

- [ ] Track versions of uploaded papers

- [ ] View change history of annotations & summariesWeek 10 – Team Workspace

---- [ ] Separate dashboard for team projects

- [ ] Team-level collections

Week 13 – AI Research Assistant- [ ] Activity feed showing changes by collaborators

- [ ] Chat with uploaded papers (contextual retrieval)---

- [ ] Multi-document question answering

Week 11 – Enhanced UI

---

- [ ] Improve dashboard UI with analytics (e.g., number of papers, most cited authors)

Week 14 – Polishing & Bug Fixes- [ ] Add dark/light theme toggle

- [ ] Improve mobile responsiveness

- [ ] Final pass on Phase 2 features

- [ ] Fix UI glitches---

- [ ] Improve performance & query optimization

Week 12 – Versioning

---

- [ ] Track versions of uploaded papers

---- [ ] View change history of annotations & summaries

Phase 3 – Premium & Integrations (Weeks 15–20)---

Goal: Monetization, admin tools, and external integrations.

Week 13 – AI Research Assistant

---

- [ ] Chat with uploaded papers (contextual retrieval)

Week 15 – Payment System- [ ] Multi-document question answering

- [ ] Integrate Stripe for international payments---

- [ ] Integrate SSLCommerz for local payments

- [ ] Setup subscription plans in DB (Plan, Subscription tables)Week 14 – Polishing & Bug Fixes

- [ ] Payment success/failure webhooks

- [ ] Final pass on Phase 2 features

---- [ ] Fix UI glitches

- [ ] Improve performance & query optimization

Week 16 – Subscription Features

---

- [ ] Restrict premium features (e.g., team size, AI assistant limit)

- [ ] Upgrade/Downgrade plan flow---

- [ ] Invoice & billing history

Phase 3 – Premium & Integrations (Weeks 15–20)

---Goal: Monetization, admin tools, and external integrations.

Week 17 – Admin Panel---

- [ ] Admin dashboard for managing users, papers, collectionsWeek 15 – Payment System

- [ ] Admin tools for banning, content removal

- [ ] Analytics on platform usage- [ ] Integrate Stripe for international payments

- [ ] Integrate SSLCommerz for local payments

---- [ ] Setup subscription plans in DB (Plan, Subscription tables)

- [ ] Payment success/failure webhooks

Week 18 – External API Integrations

---

- [ ] Integrate CrossRef API for metadata lookup

- [ ] Integrate Semantic Scholar / arXiv API for paper search/importWeek 16 – Subscription Features

---- [ ] Restrict premium features (e.g., team size, AI assistant limit)

- [ ] Upgrade/Downgrade plan flow

Week 19 – Final QA- [ ] Invoice & billing history

- [ ] Security audit---

- [ ] Code review & cleanup

- [ ] Add tests for core featuresWeek 17 – Admin Panel

---- [ ] Admin dashboard for managing users, papers, collections

- [ ] Admin tools for banning, content removal

Week 20 – Launch- [ ] Analytics on platform usage

- [ ] Deploy production build---

- [ ] Marketing page setup

- [ ] Onboarding guide for first-time usersWeek 18 – External API Integrations

---- [ ] Integrate CrossRef API for metadata lookup

- [ ] Integrate Semantic Scholar / arXiv API for paper search/import

## ✅ Total Duration: 20 weeks (~5 months)

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
