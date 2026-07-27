h# ScholarFlow — SE Lab Presentation Speech Script

> **Simple words. Short sentences. Easy to remember.**
> Each member's TOTAL speaking time = **2 to 2.5 minutes max**.
> At non-native speaker pace (~90 words/min) — keep each slide to ~50–60 words.

---

## 👥 Member Assignment

| Order | Member     | Slides            | Topics                                           |
| ----- | ---------- | ----------------- | ------------------------------------------------ |
| 1st   | **Sourov** | 1 · 2 · 3 · 4     | Title, Problem, Motivation, Objectives           |
| 2nd   | **Salman** | 5 · 6 · 7 · 8     | Scope, Features (1/2), Features (2/2), Benchmark |
| 3rd   | **Atikur** | 9 · 10 · 11 · 12  | Comparison, Tech Stack, Architecture, UI (1/2)   |
| 4th   | **Pratay** | 13 · 14 · 15 · 16 | UI (2/2), Timeline, Conclusion, Thank You        |

---

---

# 🅦 SOUROV — Slides 1–4 · ~2 min total

---

### Slide 1 — Title _(~30 sec)_

Good morning everyone.
We are Team Phantom Devs.
Our project is **ScholarFlow** — an AI-powered research collaboration platform.
It helps researchers upload papers, get AI summaries, annotate, and collaborate — all in one place.

---

### Slide 2 — Problem _(~35 sec)_

Researchers today have **four big problems**.

One — they use four or more separate apps. No single place for everything.
Two — no AI help. They read every paper by hand.
Three — teams cannot collaborate easily.
Four — existing tools cost fifty to two-fifty dollars per month. Students cannot afford this.

ScholarFlow solves all four problems — in one affordable platform.

---

### Slide 3 — Motivation _(~35 sec)_

Why are we building ScholarFlow?

Because we face these problems ourselves — as students.

Switching apps wastes three or more hours every week.
Ninety-one percent of researchers get zero AI help.
Most tools are too expensive for students.

Our goal is one unified platform — with AI, affordable pricing, and team collaboration built in.

---

### Slide 4 — Objectives _(~35 sec)_

ScholarFlow has five objectives.

One — one platform for all papers.
Two — AI summaries, Q&A, and literature reviews.
Three — automatic metadata extraction on upload.
Four — shared workspaces with role-based access.
Five — a free tier for students, with affordable team plans.

These five objectives guide our entire development plan.

---

> **Sourov total: ~135 words → approx 1 min 30 sec to 2 min**

---

---

# 🅢 SALMAN — Slides 5–8 · ~2 min total

---

### Slide 5 — Project Scope _(~35 sec)_

Thank you. Now let me explain what ScholarFlow will deliver.

We have **four modules**.

One — Paper Upload with AI metadata extraction, stored on AWS S3.
Two — AI features: summaries, chat Q&A, and literature reviews.
Three — Team Workspaces with role-based access and annotations.
Four — Rich Text Editor with auto-save, export, and Stripe billing.

---

### Slide 6 — Features (1 of 2) _(~35 sec)_

Our first six features:

One — Smart Paper Upload — AI fills in all details automatically.
Two — AI Summarization — key findings in one click.
Three — AI Chat Q&A — ask questions about any paper.
Four — Rich Text Editor — auto-save, export PDF or DOCX.
Five — Smart Collections — organize with tags and search.
Six — Team Workspaces — shared library with role management.

---

### Slide 7 — Features (2 of 2) _(~35 sec)_

Six more features:

Seven — Citation Generator — APA, MLA, IEEE, BibTeX automatically.
Eight — PDF Annotations — highlight, add notes, bookmark, share with team.
Nine — Analytics Dashboard — usage and activity charts.
Ten — Subscription Billing — Stripe, free and pro plans.
Eleven — Admin Panel — user management and system metrics.
Twelve — Enterprise Security — JWT, OAuth, rate limiting, HTTPS.

All twelve are in our development roadmap.

---

### Slide 8 — Benchmark _(~30 sec)_

We compared with Paperpal, EndNote, Mendeley, and Zotero.

Paperpal — AI writing only, no reference management or team features.
EndNote — two hundred seventy-five dollars, zero AI.
Mendeley and Zotero — free, but no AI at all.

ScholarFlow plans to support all six benchmark features — at an affordable price.
This is a clear market gap we are targeting.

---

> **Salman total: ~135 words → approx 1 min 30 sec to 2 min**

---

---

# 🅐 ATIKUR — Slides 9–12 · ~2.5 min total

---

### Slide 9 — Comparison Matrix _(~35 sec)_

Thank you. This table compares twelve features across five platforms.

Green check — full support. Yellow dash — partial. Red cross — none.

ScholarFlow plans **twelve out of twelve**.
Paperpal and others score five or fewer.

No existing tool combines reference management, AI, and real-time collaboration together.
ScholarFlow will be the first.

---

### Slide 10 — Tech Stack _(~40 sec)_

Our technology stack has three layers.

**Frontend** — Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit, Better Auth.
We chose Next.js for fast server rendering and full TypeScript support.

**Backend** — Node.js 22, Express.js, Prisma ORM, JWT, Zod validation.
Express works perfectly with Prisma for type-safe database queries.

**Infrastructure** — PostgreSQL with pgvector, AWS S3, Redis, Stripe, Gemini 3.5 Flash, OpenAI GPT-5.5, Vercel.

One full-stack TypeScript monorepo — type-safe from end to end.

---

### Slide 11 — Architecture _(~40 sec)_

ScholarFlow uses a **three-tier decoupled architecture**.

**User layer** — researchers and students access via browser.

**Frontend layer** — Next.js on Vercel handles UI, auth, and state.

**Backend layer** — Express REST API on Railway handles all business logic.

The backend connects to three service groups:
PostgreSQL with pgvector and Redis for data.
AWS S3 and Stripe for files and billing.
Gemini 3.5 Flash and OpenAI GPT-5.5 for AI — with automatic fallback.

Frontend and backend communicate only through REST API. No shared code.

---

### Slide 12 — UI Preview (1 of 2) _(~30 sec)_

Now let me show the interface.

**Screen one — Dashboard.** See all papers, recent uploads, and progress. Upload, share, or export in one click.

**Screen two — Rich Text Editor.** Write research notes with full formatting. Auto-saves. Export to PDF or DOCX.

Clean, modern, and simple for any researcher.

---

> **Atikur total: ~145 words → approx 1 min 35 sec to 2 min 10 sec**

---

---

# 🅟 PRATAY — Slides 13–16 · ~2 min total

---

### Slide 13 — UI Preview (2 of 2) _(~30 sec)_

Thank you. Two more screens.

**Screen three — PDF Annotations.** Highlight text, add notes, bookmark — directly on the PDF. Saved and shareable with the team.

**Screen four — AI Chat.** Ask any question about a paper. Gemini 3.5 Flash and GPT-5.5 give smart answers — with automatic fallback between providers.

---

### Slide 14 — Timeline _(~40 sec)_

Our **eight-week plan**:

Week one — Project setup and database configuration.
Week two — Authentication and role-based access.
Week three — Paper upload with AI metadata extraction.
Week four — AI core: summarization, Q&A, semantic search.
Week five — Editor and collections.
Week six — Team workspaces and collaboration.
Week seven — Billing and admin dashboard.
Week eight — Testing, optimization, and deployment.

Eight weeks. Thirty-two deliverables. Turborepo monorepo with CI/CD from day one.

---

### Slide 15 — Conclusion _(~35 sec)_

ScholarFlow solves four real problems that researchers face every day.

The tech stack is modern, scalable, and cloud-native.
The plan is clear — eight weeks with thirty-two concrete deliverables.
The architecture is decoupled and can grow from students to large institutions.

Clear roadmap. Strong technical foundation. ScholarFlow is ready to be built.

---

### Slide 16 — Thank You _(~20 sec)_

Thank you for listening.

We are Team Phantom Devs.
This is ScholarFlow — an AI-powered research collaboration platform.

We welcome your questions.

GitHub: **github.com/Atik203/Scholar-Flow**

---

> **Pratay total: ~125 words → approx 1 min 20 sec to 1 min 50 sec**

---

---

## 🗒️ Quick Tips for Non-Native Speakers

- **Speak slowly and clearly.** Pause after every point.
- **Use the slide as your guide.** Look at it, then say what it shows.
- **Don't memorize word-for-word.** Know the main idea — speak naturally.
- **If you forget a word — describe it simply.** Simple is always better.
- **Practice your section 3 times.** You will feel confident on the day.
- **Make eye contact with the audience** — not the screen.
