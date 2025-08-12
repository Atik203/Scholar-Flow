📅 Week-by-Week Sprint Plan 
Phase 1 – MVP (Weeks 1–6)
Goal: Get a working core platform with minimal but functional features.
________________________________________
Week 1 – Project Setup & Foundations
•	Setup & Configuration
o	Initialize monorepo / Next.js 15 + Node.js backend
o	Configure TypeScript, ESLint, Prettier, Husky hooks
o	Setup Prisma with MySQL database schema (initial tables: User, Paper, Collection)
o	Setup Auth.js authentication (Google + email/password)
•	Environment & DevOps
o	Setup .env variables and config for local and staging environments
o	Integrate Tailwind CSS + ShadCN UI + Redux Toolkit store
o	Connect to Supabase/Cloud storage for file uploads
________________________________________
Week 2 – User Auth & Profile
•	Implement sign up / login / logout
•	Implement user profile page (basic: name, email, avatar)
•	Add password reset & email verification flow
•	Basic role-based access control for future admin support
•	Write first Prisma migrations for User table + seeds
________________________________________
Week 3 – Paper Upload & Storage
•	Build paper upload page (PDF, DOCX)
•	Store metadata (title, author, year) in DB
•	Extract text content from uploaded PDFs
•	Store original file in cloud storage (Supabase S3 / Cloudflare R2)
•	Basic UI for viewing uploaded papers
________________________________________
Week 4 – Basic Collections
•	Implement “Create Collection” flow
•	Add papers to collections
•	Collection listing page
•	Basic search & filter (by title, author)
•	Backend routes for CRUD on collections & papers
________________________________________
Week 5 – AI Summarization & Semantic Search
•	Integrate OpenAI/LLM API for summarization
•	Implement summary generation & store in DB
•	Implement vector search with embeddings (e.g., Pinecone / Supabase vector)
•	Search papers by semantic meaning
________________________________________
Week 6 – Annotation & Comments
•	Enable highlighting & annotations in PDF viewer
•	Comment threads under papers
•	Save annotations/comments linked to user & paper
•	Basic activity log for user interactions
________________________________________
________________________________________
Phase 2 – Advanced Features (Weeks 7–14)
Goal: Add collaboration tools, advanced research utilities, and improve UI.
________________________________________
Week 7 – Citation Graph
•	Parse references from uploaded papers
•	Store citation relationships in DB
•	Generate citation graph visualization (D3.js or Cytoscape.js)
________________________________________
Week 8 – Citation Formatting
•	Generate citations in APA, MLA, IEEE formats
•	“Copy Citation” button
•	Export all citations in a collection to a .bib / Word file
________________________________________
Week 9 – Shared Collections (Team Collaboration)
•	Add CollectionMember table with roles: Owner, Editor, Viewer
•	Invite users via email
•	Role-based permissions on editing/viewing
________________________________________
Week 10 – Team Workspace
•	Separate dashboard for team projects
•	Team-level collections
•	Activity feed showing changes by collaborators
________________________________________
Week 11 – Enhanced UI
•	Improve dashboard UI with analytics (e.g., number of papers, most cited authors)
•	Add dark/light theme toggle
•	Improve mobile responsiveness
________________________________________
Week 12 – Versioning
•	Track versions of uploaded papers
•	View change history of annotations & summaries
________________________________________
Week 13 – AI Research Assistant
•	Chat with uploaded papers (contextual retrieval)
•	Multi-document question answering
________________________________________
Week 14 – Polishing & Bug Fixes
•	Final pass on Phase 2 features
•	Fix UI glitches
•	Improve performance & query optimization
________________________________________
________________________________________
Phase 3 – Premium & Integrations (Weeks 15–20)
Goal: Monetization, admin tools, and external integrations.
________________________________________
Week 15 – Payment System
•	Integrate Stripe for international payments
•	Integrate SSLCommerz for local payments
•	Setup subscription plans in DB (Plan, Subscription tables)
•	Payment success/failure webhooks
________________________________________
Week 16 – Subscription Features
•	Restrict premium features (e.g., team size, AI assistant limit)
•	Upgrade/Downgrade plan flow
•	Invoice & billing history
________________________________________
Week 17 – Admin Panel
•	Admin dashboard for managing users, papers, collections
•	Admin tools for banning, content removal
•	Analytics on platform usage
________________________________________
Week 18 – External API Integrations
•	Integrate CrossRef API for metadata lookup
•	Integrate Semantic Scholar / arXiv API for paper search/import
________________________________________
Week 19 – Final QA
•	Security audit
•	Code review & cleanup
•	Add tests for core features
________________________________________
Week 20 – Launch
•	Deploy production build
•	Marketing page setup
•	Onboarding guide for first-time users
________________________________________
✅ Total Duration: 20 weeks (~5 months)

