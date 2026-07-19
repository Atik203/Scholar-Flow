# Scholar-Flow Documentation Update Plan

## Goal

Every doc in this repository should be readable and followable by a first-time contributor who has never seen this codebase, with zero assumed knowledge beyond basic terminal usage and git.

## Writing Standard (apply to every file)

- Numbered steps, one action per step
- Every command in its own code block, copy-pasteable exactly as-is
- State the exact directory to run each command from
- Explain what the command does in one plain sentence before it
- Show expected output or a success indicator after key steps
- Include a "Troubleshooting" section at the bottom for common errors
- Include a "Prerequisites" section at the top (what must already be installed/done before starting this guide)
- No jargon without a one-line explanation on first use
- Use relative links to other docs/ files when referencing them
- Add a "Verify it worked" checkpoint after any multi-step setup
- Keep tone friendly and encouraging, not terse or assumed-expert

## Execution Sections

Sections are processed in order. Each section gets its own git commit and push.

---

## Section 1: Root-Level Docs

Files: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`

### README.md

- Status: Updated
- Current issues: Fixed Node badge, removed conflicting license badge, added socket-server, updated Quick Start to use `yarn setup`, fixed commands, updated testing section
- Target audience: Both (new contributor + team member)
- Todos:
  - [x] Fix Node version badge from ">=22" to ">=24"
  - [x] Fix license badge — removed the badge, added note about UNLICENSED
  - [x] Remove Railway/Render mentions; replace with "Vercel (Frontend + REST API) + Render (WebSocket)"
  - [x] Add socket-server to "Project Structure" section
  - [x] Remove `yarn reset` (doesn't exist); add `yarn setup:clean`
  - [x] Update "Quick Start" to use `yarn setup`
  - [x] Add "Quickstart" link to documentation section
  - [x] Verified internal links

### CONTRIBUTING.md

- Status: Rewritten
- Current issues: Full rewrite with correct versions, aligned branching, socket-server, PR workflow
- Target audience: New contributor
- Todos:
  - [x] Fix Node.js prerequisite from ">=18" to ">=24"
  - [x] Fix Yarn prerequisite from ">=4" to ">=4.9.2"
  - [x] Update dev commands to mention 3 processes
  - [x] Align branching section with BRANCH_FLOW.md
  - [x] Add socket-server as third workspace
  - [x] PostgreSQL listed as required
  - [x] Add links to docs/QUICKSTART.md, docs/SETUP.md, docs/ENVIRONMENT.md, docs/BRANCH_FLOW.md
  - [x] Add "your first PR" workflow
  - [x] Add conventional commit types table

### SECURITY.md

- Status: Updated
- Current issues: Fixed email typo, added links to docs, minor polish
- Target audience: External contributors/security researchers
- Todos:
  - [x] Fixed email (was matikurrahaman0305@gmail.com → atikurrahaman0305@gmail.com)
  - [x] Added links to docs/ENVIRONMENT.md and docs/DEPLOY.md
  - [x] Added principle of least privilege note

### CODE_OF_CONDUCT.md

- Status: Updated
- Current issues: Added our pledge section, clarified scope
- Target audience: All contributors
- Todos:
  - [x] Added "Our Pledge" section with specific commitments
  - [x] Clarified enforcement scope
  - [x] Minor formatting improvements

---

## Section 2: Setup & Environment

Files: `docs/SETUP.md`, `docs/DEVELOPMENT.md`, `docs/ENVIRONMENT.md`

### docs/SETUP.md

- Status: Rewritten
- Target audience: New contributor
- Todos:
  - [x] Rewrote entirely with correct versions, architecture, commands, and order
  - [x] Prerequisites: Node >=24, Yarn >=4.9.2, PostgreSQL 15+
  - [x] Added socket-server to architecture
  - [x] Fixed command order: migrate before generate
  - [x] Primary dev command is `yarn dev:turbo`
  - [x] Removed deployment section (links to DEPLOY.md)
  - [x] Removed "Ready for Implementation" checklist
  - [x] Added "Verify everything works" with curl commands
  - [x] Added links to all related docs
  - [x] Added troubleshooting section

### docs/DEVELOPMENT.md

- Status: Rewritten
- Target audience: Team member / active contributor
- Todos:
  - [x] Rewrote as active development workflow guide (not "project template")
  - [x] Removed `setup.bat` reference
  - [x] Correct Node (>=24) and Yarn (>=4.9.2)
  - [x] Added socket-server to project structure
  - [x] Removed feature checklists (links to IMPLEMENTATION.md instead)
  - [x] Added common dev tasks: new page, new API route, new DB model, RTK Query
  - [x] Added quality checks section (lint, type-check, test)
  - [x] Added migration workflow section
  - [x] No deployment section — links to DEPLOY.md
  - [x] Added troubleshooting for dev issues

### docs/ENVIRONMENT.md

- Status: Rewritten and restructured
- Target audience: Both (new contributor + team member)
- Todos:
  - [x] Removed NextAuth.js references; consistent "better-auth" usage
  - [x] Restructured: Quick Start → Backend (DB, Server, Auth, OAuth, Email, AI, S3, Stripe, SSLCommerz, Redis, Doc Conversion, Uploads) → Frontend (Auth, URLs, OAuth, Flags, Stripe, Analytics) → Socket-server → Production Notes
  - [x] Fixed all formatting issues
  - [x] REDIS_URL moved to proper Redis section
  - [x] Added socket-server env vars section
  - [x] Added better-auth callback URLs
  - [x] Added "Quick Start" summary at top
  - [x] Verified all vars against .env.example files
  - [x] Added note about NEXTAUTH_SECRET/BETTER_AUTH_SECRET alias

---

## Section 3: Database & Redis

Files: `docs/ERD.md`, `docs/REDIS_SETUP.md`, plus new `docs/DATABASE.md`

### docs/ERD.md

- Status: Updated
- Target audience: Team member / database contributor
- Todos:
  - [x] Added "How to Read This Document" section at top
  - [x] Added note: Prisma schema is the source of truth
  - [x] Added Phase 7-10 tables section (Notifications, Admin, AI, Collaboration)
  - [x] Added pgvector column note on PaperChunk
  - [x] Added links to LucidChart diagrams

### docs/REDIS_SETUP.md

- Status: Updated and restructured
- Target audience: New contributor
- Todos:
  - [x] Added REDIS_URL as primary connection string option
  - [x] Added Upstash as Option 4 (serverless Redis)
  - [x] Added manual verification step with redis-cli ping
  - [x] Pinned Docker tag to `redis:7-alpine`
  - [x] Rewrote with clearer section headers and options

### docs/DATABASE.md (NEW)

- Status: Missing — needs creation
- Why needed: DB setup knowledge is scattered across SETUP.md, ENVIRONMENT.md, REDIS_SETUP.md, and AGENTS.md. A single focused guide is needed.
- Target audience: New contributor
- Todos:
- [x] Created `docs/DATABASE.md`
- [x] PostgreSQL installation (local, WSL, Docker)
- [x] pgvector extension setup
- [x] Create database and user
- [x] Prisma migration workflow (migrate → generate → seed)
- [x] Prisma Studio usage
- [x] Common DB troubleshooting
- [x] Migration discipline checklist
- [x] Prisma client usage tips (typed queries vs raw SQL)
- [x] Drift detection and reconciliation

---

## Section 4: Deployment & Operations

Files: `docs/DEPLOY.md`, `docs/BRANCH_FLOW.md`, plus new `docs/QUICKSTART.md`, `docs/TESTING.md`

### docs/DEPLOY.md

- Status: Updated
- Target audience: DevOps / team member deploying
- Todos:
  - [x] Fixed Node.js version (22.x → 24.x) in Oracle Cloud section
  - [x] Updated Ubuntu to 24.04 LTS
  - [x] Added socket-server deployment to Oracle Cloud section
  - [x] Added WebSocket systemd service + Nginx config
  - [x] Added "Prerequisites" section at top
  - [x] Added `yarn setup` instead of manual install steps

### docs/BRANCH_FLOW.md

- Status: Updated
- Target audience: Team member
- Todos:
  - [x] Updated last-updated date to July 2026
  - [x] Clarified hotfix flow with explicit commands
  - [x] Added note that auto-flow carries hotfix forward

### docs/QUICKSTART.md (NEW)

- Status: Missing — needs creation
- Why needed: No single 5-minute "get running" guide exists. A new contributor doesn't know which file to read first.
- Target audience: New contributor (first 15 minutes)
- Todos:
- [x] Created `docs/QUICKSTART.md`
- [x] 10 numbered steps: clone → env → DB → install → migrate → seed → dev → verify → open → done
- [x] Each step has exactly one copy-paste command
- [x] Links to detailed docs for each step
- [x] "Expected output" after key steps

### docs/TESTING.md (NEW)

- Status: Missing — needs creation
- Why needed: No testing documentation exists
- Target audience: Contributor writing/running tests
- Todos:
- [x] Created `docs/TESTING.md`
- [x] How to run tests (all, frontend, backend, watch mode)
- [x] Test structure and conventions
- [x] Writing new tests (with examples for frontend + backend)
- [x] Mocking Prisma guide
- [x] CI/CD test expectations
- [x] Testing priority areas

---

## Section 5: Legal, Policy & AI Docs

Files: `LICENSE.md`, `docs/PROMPTING_GUIDE.md`, `docs/TERMS.md`

### LICENSE.md

- Status: Resolved conflict
- Current issues: Rewrote to match package.json (UNLICENSED), kept Apache 2.0 text as reference with clear disclaimer
- Target audience: Legal / all contributors
- Todos:
  - [x] Resolved UNLICENSED vs Apache 2.0 conflict
  - [x] Aligned with package.json — project is UNLICENSED, all rights reserved
  - [x] Kept Apache 2.0 text as "Reference Only" with clear note that it is not the active license
  - [x] README.md badge already updated in Section 1

### docs/PROMPTING_GUIDE.md

- Status: Updated
- Target audience: AI agents / developers using AI tools
- Todos:
  - [x] Updated version references (1.1.0 → 1.3.1)
  - [x] Updated Next.js 15 → 16 references
  - [x] Quick verification pass — no other stale content found

### docs/TERMS.md

- Status: No changes needed (legal EULA)
- Target audience: Legal / users
- Todos:
  - [x] Confirmed — no changes needed for this legal document

---

## Suggested New Files Summary

| File | Purpose | Section |
|------|---------|---------|
| `docs/QUICKSTART.md` | 10-step "get running in 5 minutes" | Section 4 |
| `docs/DATABASE.md` | PostgreSQL + pgvector + Prisma setup and workflow | Section 3 |
| `docs/TESTING.md` | How to run and write tests | Section 4 |

---

## Root-Level File Conflicts Needing Attention

| File | Issue | Action |
|------|-------|--------|
| `package.json` | `"license": "UNLICENSED"` — conflicts with LICENSE.md and README badge | Cannot modify (outside scope). Flag in README.md and LICENSE.md. |
| `package.json` | `"node": ">=24.0.0"` — all docs say 20+ or 22+ | Update all docs to >=24 |

---

## Execution Order

1. **Section 1: Root-Level Docs** — ✅ Complete. Updated README.md (Node badge, license, Quick Start, socket-server, commands), rewrote CONTRIBUTING.md (versions, branching, PR workflow), fixed SECURITY.md email + links, updated CODE_OF_CONDUCT.md (Our Pledge).
2. **Section 2: Setup & Environment** — ✅ Complete. Rewrote SETUP.md (correct versions, commands, architecture, verify step), rewrote DEVELOPMENT.md (active workflow guide with common tasks), rewrote ENVIRONMENT.md (restructured, fixed formatting, added socket-server section, better-auth consistency).
3. **Section 3: Database & Redis** — ✅ Complete. Updated REDIS_SETUP.md (REDIS_URL, Upstash, verify step, pinned Docker), updated ERD.md (how-to-read, pgvector, Phase 7-10 tables), created DATABASE.md (full PostgreSQL + pgvector + Prisma guide).
4. **Section 4: Deployment & Operations** — ✅ Complete. Fixed DEPLOY.md (Node 24, Oracle socket-server, Ubuntu 24.04), updated BRANCH_FLOW.md (hotfix commands, date), created QUICKSTART.md (10-step beginner guide), created TESTING.md (testing conventions, examples, mocking).
5. **Section 5: Legal & Polish** — ✅ Complete. Resolved LICENSE.md UNLICENSED conflict (Apache 2.0 text kept as reference), updated PROMPTING_GUIDE.md versions (1.1.0→1.3.1, Next.js 15→16), confirmed TERMS.md needs no changes.

Each section is committed and pushed independently.
