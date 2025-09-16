# Scholar-Flow Development Roadmap

> Full project details: [Google Doc](https://docs.google.com/document/d/10oG-05TTcYJD59hSRSaZbu1y9ygjzwUv26wyUCYi5_w/edit?usp=sharing)

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

### Week 4 – Basic Collections

- [ ] Extract text content from uploaded PDFs
- [ ] Create Collection flow & add papers to collections
- [ ] Collection listing page & advanced search/filter functionality
- [ ] Backend CRUD operations for collections & papers

### Week 5 – AI Summarization & Semantic Search

- [ ] Integrate OpenAI/LLM API for summarization
- [ ] Vector search with embeddings & semantic paper search
- [ ] Implement AI-powered search suggestions & filters

### Week 6 – Annotation & Comments

- [ ] Highlighting & annotations in PDF viewer
- [ ] Comment threads & activity log for user interactions
- [ ] Save annotations/comments (user & paper)
- [ ] Dashboard analytics & versioning system

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

### Week 15-16 – Payment System

- [ ] Stripe & SSLCommerz integration
- [ ] Subscription plans & premium features

### Week 17-18 – Admin & Integrations

- [ ] Admin panel & platform analytics
- [ ] External API integrations (CrossRef, Semantic Scholar)

### Week 19-20 – Launch Preparation

- [ ] Security audit & final QA
- [ ] Production deployment & marketing

---

Total Duration: 20 weeks (~5 months)
Current Status: Week 3.5 Complete – Modern paper management system with advanced search ✅
Last Updated: September 17, 2025
