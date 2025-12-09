# ScholarFlow Feasibility Analysis & Presentation Deck

**Senior-Level Presentation | December 8, 2025**

**Project**: ScholarFlow - AI-Powered Research Paper Collaboration Hub  
**Survey Period**: November-December 2025  
**Total Responses**: 32 Academic Researchers  
**Project Status**: Complete Platform (MVP + Advanced Features)

---

## 🎯 Presentation Overview

This document provides a complete feasibility analysis for ScholarFlow based on comprehensive survey data from 29 academic researchers across 10 universities.

### Slide Criteria

1. **Survey Attendee Statistics**
2. **Survey Result Table**
3. **List of Selected Features**
4. **SWOT & Strategy**

---

## 1. Survey Attendee Statistics

### Survey Design

- **Tool**: Google Forms with 21 comprehensive questions
- **Structure**: 5 demographic + 10 feature priority + 6 adoption questions
- **Data Source**: Survey response charts (auto-generated)
- **Analysis**: Python notebook with statistical breakdowns

### Demographic Breakdown

#### 👤 Role Distribution

![Role Distribution](../response_image/1.png)

- **86.2%** Undergraduate Students (primary target)
- **3.4%** Masters Students
- **3.4%** PhD Students
- **3.4%** Faculty/Professors
- **3.4%** Other (Research Assistants, Industry)

#### 📚 Field of Study

![Field of Study](../response_image/2.png)

- **67%+** Computer Science / IT (dominant segment)
- **15%** Engineering (Civil, Electrical, Mechanical)
- **10%** Medical Sciences (Pharmacy)
- **8%** Social Sciences (Economics, Sociology)

#### 🎓 Academic Level

![Academic Level](../response_image/3.png)

- **58.6%** 3rd Year Undergraduates (peak research intensity)
- **17.2%** 2nd Year Undergraduates
- **6.9%** Masters Students
- **6.9%** Non-students (professionals)

#### 🎂 Age Distribution

![Age Distribution](../response_image/4.png)

- **75.9%** Ages 22-25 (Gen-Z digital natives)
- **13.8%** Ages 18-21
- **10.3%** Ages 26-30

#### 🏛️ Institution Footprint

![Institution Footprint](../response_image/5.png)

- **47.4%** United International University (UIU) - Primary launch campus
- **52.6%** Other universities (NSU, AIUB, BRAC, IUT, Khulna, etc.)
- **10 unique** educational institutions represented

**Strategic Insight:** Strong concentration in UIU provides ideal beta testing ground. CS/IT dominance aligns perfectly with our tech-forward feature set (AI, cloud, collaboration).

---

## 2. Survey Result Table & Strategic Decisions

| Question                | Top Responses (% share)                                                     | Strategic Decision                                                                                     |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Q6: Current Tools**   | Browser PDFs 34.5%, Local folders 31.0%, Cloud storage 31.0%, No tool 27.6% | Build importers for folders/cloud storage. Highlight workflow upgrades for "no tool" segment.          |
| **Q7: Reading Cadence** | Rarely 48.3%, Multiple/day 20.7%, Few times/week 20.7%                      | Design flexible engagement journeys: nudge infrequent readers, power-user views for daily researchers. |
| **Q8: Pain Points**     | Notes/highlights 44.8%, Finding papers 37.9%, Organization 31.0%            | Prioritize universal annotation, knowledge graph tagging, smarter retrieval.                           |
| **Q9: Collaboration**   | Work alone 55.2%, Share via chat/email 20.7%                                | Lead with "from solo to shared" messaging. Emphasize lightweight workspace invites.                    |
| **Q10: Satisfaction**   | Score 3: 41.4%, Average: 3.31/5                                             | Showcase ScholarFlow as upgrade path from "meh" tooling. Demo delight moments.                         |
| **Q11: Need Intensity** | Moderate-to-extreme: 72.4%                                                  | Justifies investing in richer discovery & onboarding flows immediately.                                |
| **Q12: Interest**       | Very interested: 51.7%, Extremely: 6.9%                                     | Highlight social proof + waitlist CTA to convert warm intent.                                          |
| **Q13: Org/Search**     | Collections/Upload/Search: 55.2%                                            | Keep Collections + Unified Library above the fold in product tours.                                    |
| **Q14: Reading/Notes**  | In-browser annotation: 69.0%, Shared note hub: 51.7%                        | Showcase PDF viewer + Research Notes screens on demo slide.                                            |
| **Q15: AI Priorities**  | Compare papers & mind maps: 65.5%, Summaries: 62.1%                         | Position AI Insights as "copilot" not gimmick. Include workflow story.                                 |
| **Q16: Collaboration**  | Role-based access: 62.1%, Shared workspaces: 58.6%                          | Bring permissions UI mockup into feasibility story.                                                    |
| **Q17: Analytics**      | Reading overview: 55.2%, Activity tracking: 51.7%                           | Reinforce analytics roadmap. Justify dashboard investments.                                            |
| **Q18: Free Tier**      | Likely: 31.0%, Very likely: 27.6%                                           | Offer free core plan with upgrade hooks (storage, AI limits).                                          |
| **Q19: Concerns**       | Privacy/cost themes: ~7.7% each                                             | Dedicate trust slide to security, encryption, pricing transparency.                                    |
| **Q20: Extras**         | Referencing: 10%, Plagiarism: 10%, LMS sync: 10%, Offline: 10%              | Capture in backlog. Mention as "future enhancements" slide.                                            |

---

## 3. List of Selected Features

### Core Feature Set Based on Survey Data

#### 1. Unified Paper Library

**Survey Validation:** 55.2% demand for collections, 55.2% for advanced search

**Features:**

- Smart collections with public/private permissions
- Advanced search (full-text, author, date, type, keywords)
- Bulk upload with drag-and-drop
- AI-powered metadata extraction (title, author, abstract)
- Duplicate detection via SHA-256 hashing
- Tags and labels for organization
- Filters and sorting options
- Grid/list view toggle

**Technical Stack:**

- PostgreSQL full-text search with `ts_vector`
- Composite indexes for hot query paths
- S3 for file storage with CloudFront CDN
- Prisma ORM with raw SQL for performance

---

#### 2. Rich PDF & Document Editor

**Survey Validation:** 69.0% want in-browser annotation, 51.7% need centralized notes

**Features:**

- TipTap-based rich text editor with full toolbar
- Extensions: bold, italic, lists, tables, code blocks, links
- Image upload with drag-and-drop (S3 integration)
- Auto-save with debounced updates (1s delay)
- Manual save with real-time status indicators
- Draft/publish workflow
- Export to PDF and DOCX with embedded images
- Share functionality with email notifications
- View/Edit permission management
- Title editing and metadata control
- Mobile-responsive design
- Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)

**Technical Stack:**

- TipTap (ProseMirror-based)
- React Hook Form + Zod validation
- AWS S3 for image storage
- PDFKit for PDF generation
- docx library for DOCX export

---

#### 3. AI Research Assistant

**Survey Validation:** 65.5% want paper comparison, 62.1% need summaries

**Features:**

- Multi-provider AI service (Gemini 2.5-flash-lite primary, OpenAI GPT-4o-mini fallback)
- Automatic paper summaries (executive summary + key findings)
- Intelligent chat with full paper context
- Context retention across entire chat session
- Streaming responses for real-time interaction
- Caching for performance optimization
- Rate limiting and quota management
- Error handling with graceful fallbacks

**Roadmap (Phase 2-3):**

- Compare multiple papers side-by-side
- Mind map and key point generation
- Related paper suggestions (pgvector similarity)
- Citation extraction and graph visualization
- AI-powered study assistant (quiz generation)

**Technical Stack:**

- Google Generative AI (Gemini)
- OpenAI API (GPT-4o-mini)
- Redis caching for API responses
- Token counting and optimization
- Streaming API for progressive rendering

---

#### 4. Collaboration Suite

**Survey Validation:** 62.1% need role-based access, 58.6% want shared workspaces

**Features:**

- Shared workspaces with team members
- 5-tier role system:
  - **Owner**: Full control, billing, delete workspace
  - **Admin**: Manage members, settings, cannot delete workspace
  - **Editor**: Create/edit/delete papers and collections
  - **Viewer**: Read-only access to all content
  - **Researcher**: View and contribute to assigned papers
- Workspace invitation system with email notifications
- Accept/decline invitation workflow with status tracking
- Member management (add/remove/update roles)
- Activity logging for workspace actions
- Real-time cache invalidation
- Permission-based API access control
- Workspace settings management (name, description, plan)

**Collections Collaboration:**

- Shared collections for classes/projects
- Permission inheritance from workspace
- Collection-level access control (view/edit)
- Paper-collection relationship management

**Technical Stack:**

- PostgreSQL with complex permission queries
- JWT for authentication and role verification
- Email service (Resend/SendGrid) for notifications
- Redis for session management
- RTK Query for real-time updates

---

#### 5. Analytics & Insights Dashboard

**Survey Validation:** 55.2% want reading overview, 51.7% need activity tracking

**Features:**

**Personal Analytics:**

- Reading overview dashboard with key metrics
- Papers read, collections created, notes written
- Reading streak and consistency tracking
- Time spent on platform
- Most active days/hours

**Workspace Analytics:**

- Team activity feed
- Member contribution metrics
- Paper upload trends
- Collection growth over time
- Collaboration patterns

**Admin System Monitoring:**

- Real-time system health dashboard
- CPU usage (intelligent calculation using os module)
- Memory usage with visual progress bars
- Storage analytics (dynamic estimation)
- Database connectivity status
- Performance monitoring (response times)
- Auto-refresh every 10 seconds
- Health cards with color-coded status
- Production-grade HTTP caching

**Technical Stack:**

- RTK Query with polling (10s intervals)
- Node.js `os` module for system metrics
- Lazy loading with code splitting
- Performance optimization with memoization
- Auto-colored progress bars based on thresholds

---

#### 6. Subscription & Billing System

**Survey Validation:** 58.6% likely to try free tier, cost concerns addressed

**Features:**

- Stripe integration with live subscription billing
- Hosted checkout for seamless payment
- Customer portal for self-service management
- Plan-aware metadata and role updates
- Webhook-driven subscription sync
- Multiple payment methods (credit card, PayPal)
- Upgrade/downgrade with proration
- Billing dashboard with plan details
- Real-time status indicators
- Subscription history and invoices

**Pricing Tiers:**

- **Free**: 100MB, 10 papers/month, 5 collections, 50 AI queries
- **Pro ($9.99/month)**: 10GB, unlimited papers, unlimited collections, 500 AI queries
- **Team ($29.99/month)**: 100GB, everything Pro, unlimited workspaces, team features
- **Student Discount**: 50% off with .edu email

**Technical Stack:**

- Stripe Checkout API
- Stripe Customer Portal
- Webhook event handling
- Prisma for subscription state management
- Next.js API routes for backend integration

---

#### 7. Security & Authentication

**Survey Validation:** Privacy/security top concern (~7.7%)

**Features:**

- Google OAuth 2.0
- GitHub OAuth
- Email/password with bcrypt (12 rounds)
- JWT access tokens (1h expiry)
- Refresh tokens (7d expiry)
- Password reset with email verification
- Rate limiting on all endpoints
- Input sanitization and Zod validation
- CORS protection with whitelist
- Secure session management
- Production security headers:
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME sniffing protection)

**Technical Stack:**

- NextAuth.js for OAuth
- JWT for token management
- bcrypt for password hashing
- express-rate-limit
- helmet.js for security headers
- Zod for input validation

---

#### 8. Modern UI/UX Design

**Survey Validation:** 75.9% Gen-Z users (ages 22-25) expect modern interface

**Features:**

- Next.js 15 App Router with React 19
- Tailwind CSS with custom design system
- ShadCN UI component library (40+ components)
- Dark mode with system preference detection
- Responsive design (mobile-first)
- Skeleton loading states for perceived performance
- Toast notifications with Sonner
- Error boundaries with retry logic
- Accessibility (WCAG compliant)
- Progressive Web App (PWA) capabilities
- Optimistic UI updates
- Smooth animations and transitions

**Technical Stack:**

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v3
- ShadCN UI components
- Framer Motion for animations
- React Query for data fetching

---

## 4. SWOT Analysis & Strategy

### SWOT Analysis

| **Internal Factors**                                                                                                                                                                                                                                                                                                      | **External Factors**                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STRENGTHS**                                                                                                                                                                                                                                                                                                             | **OPPORTUNITIES**                                                                                                                                                                                                                                                                                                                                                      |
| • Strong market validation (72.4% need, 58.6% high interest)<br>• 102 Figma screens ready for implementation<br>• Full-stack MVP (Next.js 15, Express, PostgreSQL, Prisma)<br>• Dual AI integration (Gemini + OpenAI)<br>• 86.2% undergraduate target, UIU concentration (47.4%)<br>• First-mover advantage in Bangladesh | • Underserved market (satisfaction only 3.31/5)<br>• Low switching costs (100% use free tools)<br>• High AI demand (82.7% want summarization)<br>• Freemium model with clear upsell (58.6% willing to pay)<br>• Campus network effects for viral growth<br>• Global EdTech expansion opportunity                                                                       |
| **WEAKNESSES**                                                                                                                                                                                                                                                                                                            | **THREATS**                                                                                                                                                                                                                                                                                                                                                            |
| • Zero brand awareness and social proof<br>• Technical complexity (real-time collab, AI management)<br>• Solo founder resource constraints<br>• Privacy concerns (48.3% moderate, 10.3% extreme)<br>• Untested pricing strategy<br>• Third-party dependencies (OAuth, S3, Stripe, AI APIs)                                | • Incumbent dominance (Drive 79.3%, Notion 37.9%, Zotero 27.6%)<br>• Differentiation risk (24.1% "not sure" about adoption)<br>• Price-sensitive student market (41.4% may resist subscriptions)<br>• Data privacy compliance costs (GDPR, CCPA)<br>• AI API cost volatility<br>• Feature creep risk (10+ diverse requests)<br>• Adoption friction and churn potential |

---

### Strategy

**Campus-First Growth with AI Differentiation**

Launch beta at UIU targeting 100 users with free Pro tier. Differentiate through modern UI/UX and multi-provider AI. Implement freemium: Free (100MB, 10 papers/month, 50 AI queries) → Pro ($9.99/month) → Team ($29.99/month). Address privacy via transparent policies and SOC 2 roadmap. Expand via campus ambassadors to NSU, AIUB, BRAC. Convert solo researchers (55.2%) with "from solo to shared" messaging. Provide one-click import from Zotero/Mendeley. Scale to 500 users across 5 universities (Phase 2), then pursue national/international expansion (Phase 3).

---

**Prepared by:** Md. Atikur Rahaman (Atik203)  
**Date:** December 8, 2025  
**Project:** ScholarFlow - AI-Powered Research Paper Collaboration Hub  
**Version:** 2.1 (Condensed - 4 Core Criteria)
