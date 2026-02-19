# ScholarFlow — 10 Minute UI/UX Demo Video Script (English)

> **Target Duration:** ~12–13 min recorded → Speed up to 1.1x → Final ~10 min  
> **Team:** Phantom Devs (4 members) | **University:** UIU  
> **4 Roles in System:** Researcher, Pro Researcher, Team Lead, Admin

---

## Section 1 — Project Introduction (Max 1 min)

**[0:00 – 1:00] ≈ 1 min | Show: Title Slide / Landing Page**

> "Hello everyone, welcome to our project demo.
>
> Our project is called **ScholarFlow** — an AI-Powered Research Paper Collaboration Hub.
>
> In today's academic world, researchers struggle with scattered files, poor collaboration tools, and no AI support for their daily workflow. ScholarFlow solves this by providing a unified platform where researchers can upload, organize, search, and collaborate on research papers — all powered by AI.
>
> Our platform supports **4 distinct user roles**:
>
> 1. **Researcher** — uploads, reads, and manages papers
> 2. **Pro Researcher** — unlocks AI features, citation graphs, and advanced analytics
> 3. **Team Lead** — creates and manages workspaces, invites team members
> 4. **Admin** — monitors the entire system, manages users, billing, and compliance
>
> We have designed **102 complete UI screens** in our Figma prototype. Let me walk you through the major ones."

---

## Section 2 — Major Prototyping Demo (4–5 min)

These are the **core, high-impact pages** that demonstrate the primary user journey and key features. Spend ~30–45 sec on each.

---

### 2.1 Authentication Flow (~45 sec)

**[1:00 – 1:45] | Pages: Login → Register → Forgot Password → Verify Email**

> "Let's start with the authentication system.
>
> Here is our **Login Page**, which supports three methods: Email and Password, Google OAuth, and GitHub OAuth. The design follows modern best practices with clear form validation and a clean layout.
>
> Moving to the **Registration Page** — users fill in their name, email, institution, field of study, and pick their role. This data helps us personalize their experience.
>
> We also have a complete **Forgot Password** and **Email Verification** flow with token-based security."

---

### 2.2 Onboarding Flow (~30 sec)

**[1:45 – 2:15] | Pages: Onboarding → Role Selection → Workspace Setup**

> "After registration, new users go through our **Onboarding Flow**. They select their role — Researcher, Pro Researcher, or Team Lead — and can create their first workspace or join an existing one. This ensures every user has a personalized starting point."

---

### 2.3 Dashboard (~45 sec)

**[2:15 – 3:00] | Pages: Dashboard / Enhanced Dashboard**

> "This is the main **Dashboard** — the home screen after login. It provides a quick overview of recent papers, active workspaces, team activity, and notifications. Users can immediately access their most-used features from here.
>
> We also designed an **Enhanced Dashboard** variant with richer analytics widgets and visualizations for Pro and Team Lead users."

---

### 2.4 Paper Management (~60 sec)

**[3:00 – 4:00] | Pages: All Papers → Upload → Paper Details → Search**

> "Paper management is the core of ScholarFlow.
>
> The **Papers Page** displays all uploaded papers with filtering by author, date, type, and keywords. Users can switch between grid and list views.
>
> The **Upload Page** supports drag-and-drop PDF, DOCX, and DOC files up to 50MB. Our backend automatically extracts metadata — title, authors, and abstract — using AI.
>
> The **Paper Detail Page** shows the complete paper with embedded PDF viewer, metadata, AI summary, and discussion threads.
>
> And the **Search Page** provides full-text search across all papers with advanced filters."

---

### 2.5 Workspaces & Collections (~45 sec)

**[4:00 – 4:45] | Pages: Workspaces → Workspace Details → Collections → Collection Details**

> "Collaboration happens through **Workspaces**. A Team Lead can create a workspace, invite members by email with specific roles, and manage permissions.
>
> Inside workspaces, users organize papers into **Collections** — think of them as folders grouped by topic or project. Collection members can have view or edit permissions."

---

### 2.6 AI Insights & Rich Text Editor (~45 sec)

**[4:45 – 5:30] | Pages: AI Insights → Text Editor → Research Page**

> "This is where ScholarFlow truly stands out. The **AI Insights Page** provides an interactive chat where users can ask questions about their papers and get intelligent, context-aware responses.
>
> Our **Rich Text Editor** is built on TipTap — it supports markdown, tables, image upload, auto-save, and one-click export to PDF and DOCX. Researchers can create drafts, collaborate, and publish directly from the editor."

---

## Section 3 — Minor Prototyping (2–3 min)

These are **supporting pages** that complete the user experience. Spend ~15–20 sec on each, showing them more quickly.

---

### 3.1 Analytics & Reports (~30 sec)

**[5:30 – 6:00] | Pages: Analytics → Personal Analytics → Workspace Analytics**

> "ScholarFlow includes a comprehensive **Analytics Dashboard** with personal reading statistics, workspace activity trends, and usage reports. Pro users can also export their analytics data."

---

### 3.2 Team Management (~25 sec)

**[6:00 – 6:25] | Pages: Team Members → Invitations → Team Activity → Team Settings**

> "Team Leads have access to a full **Team Management** module — they can view members, send invitations, track team activity, and configure workspace settings."

---

### 3.3 Notifications & Security (~25 sec)

**[6:25 – 6:50] | Pages: Notifications → Security Dashboard → 2FA → Active Sessions**

> "We designed a full **Notification Center** with history and customizable settings. There is also a **Security Dashboard** with two-factor authentication setup, active session management, and privacy controls."

---

### 3.4 Billing & Subscription (~20 sec)

**[6:50 – 7:10] | Pages: Billing → Pricing**

> "ScholarFlow uses a freemium model with Free, Pro, and Team tiers. The **Billing Page** shows current plan details, usage, and integrates with Stripe for secure payments. Our **Pricing Page** clearly compares all three plans."

---

### 3.5 Admin Panel (~40 sec)

**[7:10 – 7:50] | Pages: Admin Overview → User Management → Payments → Audit Log → Content Moderation**

> "Admins get a dedicated panel. The **Admin Overview** shows real-time system metrics — CPU, memory, storage, and database health. They can manage users and roles, review payments, audit system logs, manage API keys and webhooks, and moderate flagged content."

---

### 3.6 Search, Discovery & Help (~20 sec)

**[7:50 – 8:10] | Pages: Global Search → Discover → Trending → Help Center**

> "We also have **Global Search** with keyboard shortcuts, a **Discover** section with trending papers and AI recommendations, and a comprehensive **Help Center** with keyboard shortcuts documentation."

---

### 3.7 Marketing & Public Pages (~20 sec)

**[8:10 – 8:30] | Pages: Features → How It Works → FAQ → Enterprise**

> "For public-facing users, we designed marketing pages including Features, How It Works, FAQ, and an Enterprise section. These pages explain ScholarFlow's value proposition to potential users."

---

## Section 4 — SRS Overview (1–2 min)

**[8:30 – 10:00] | Show: SRS PDF or Overleaf document**

> "Now let me give a brief overview of our Software Requirements Specification document, which follows the IEEE Std 830-1998 standard.
>
> **Chapter 1 — Introduction:** We defined the purpose, scope, target demographics, technology stack, and design constraints. Our stack includes Next.js 15, Express, PostgreSQL with Prisma, AWS S3, and AI services from Google Gemini and OpenAI.
>
> **Chapter 2 — System Study:** We conducted a survey with 29 academic researchers across 10 universities. Key findings: 86.2% are undergraduates, 79.3% currently use Google Drive, and 82.7% want AI summarization. We documented demographic analysis, current tool landscape, and market validation — all with supporting charts.
>
> **Chapter 3 — System Analysis:** This includes our feasibility study — technical, economic, and operational — all rated feasible. We performed SWOT analysis, competitive analysis against Zotero, Mendeley, and Notion, and created a feature prioritization matrix with P0 critical features and P1/P2 enhancements.
>
> **Chapter 4 — System Design:** We documented context diagrams, use case diagrams with 33 use cases, data flow diagrams at Level 0 and Level 1, activity diagrams, the ERD, database schema, and SQL queries.
>
> Together, these chapters provide a thorough foundation for the development of ScholarFlow. Thank you for watching!"

---

## Timing Summary

| Section                  | Content                                                           | Target Time | Actual (before 1.1x)       |
| ------------------------ | ----------------------------------------------------------------- | ----------- | -------------------------- |
| **1. Introduction**      | Project overview, problem, 4 roles                                | 1 min       | ~1:10                      |
| **2. Major Prototyping** | Auth, Dashboard, Papers, Workspaces, AI, Editor                   | 4–5 min     | ~5:30                      |
| **3. Minor Prototyping** | Analytics, Team, Notifications, Billing, Admin, Search, Marketing | 2–3 min     | ~3:00                      |
| **4. SRS**               | Chapters 1–4, survey, feasibility, diagrams                       | 1–2 min     | ~1:30                      |
| **Total**                |                                                                   | **10 min**  | **~12:00 → 1.1x = ~10:54** |

## Recording Tips

1. **Screen Record** with OBS Studio (free) at 1080p, 30fps
2. Record voice **separately** on phone for clear audio, then sync in editor
3. Speak at a **natural pace** — the 1.1x speedup will tighten it naturally
4. **Hover your cursor** over UI elements as you describe them
5. Use **smooth scrolling** when showing long pages
6. Keep **transitions quick** between pages — no long pauses
