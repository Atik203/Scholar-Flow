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

- Status: Exists — update minor
- Current issues: Email address has typo? `matikurrahaman0305@gmail.com` vs `atikurrahaman0305@gmail.com` in other docs
- Target audience: External contributors/security researchers
- Todos:
  - [ ] Verify email matches README.md (atikurrahaman0305@gmail.com)
  - [ ] Add security-related `docs/` links (ENVIRONMENT.md for env var best practices)
  - [ ] Minor polish for readability

### CODE_OF_CONDUCT.md

- Status: Exists — minor update
- Current issues: Very minimal template, mostly links to external source
- Target audience: All contributors
- Todos:
  - [ ] Add project-specific contact section (email already listed, good)
  - [ ] Clarify enforcement scope for this project
  - [ ] Minor formatting improvements

---

## Section 2: Setup & Environment

Files: `docs/SETUP.md`, `docs/DEVELOPMENT.md`, `docs/ENVIRONMENT.md`

### docs/SETUP.md

- Status: Exists — needs heavy rewrite
- Current issues: Node.js says 20+ (should be 24+); `yarn db:generate` before `yarn db:migrate` (wrong order — migrations first); `yarn dev` outdated (starts 2 servers, but should be 3); Missing socket-server from architecture; "Yarn 4.5+" should be "4.9.2"; References `src/store/api/` (check if actual path); Deployment section says "Railway/Render/Fly.io" but actual config is Vercel; No Redis setup mention (covered elsewhere but not linked); No "verify it worked" checkpoint
- Target audience: New contributor
- Todos:
  - [ ] Rewrite "Prerequisites" with correct versions (Node >=24, Yarn >=4.9.2, PostgreSQL 15+)
  - [ ] Add socket-server to architecture diagram
  - [ ] Fix command order: `yarn db:migrate` then `yarn db:generate` (not the reverse)
  - [ ] Replace `yarn dev` with `yarn dev:turbo` as primary dev command
  - [ ] Add note that `yarn dev` starts 3 processes: frontend (:3000), backend (:5000), socket-server (:5001)
  - [ ] Remove deployment section (covered in DEPLOY.md — just link to it)
  - [ ] Remove "Ready for Implementation" checklist (this is a setup guide, not a roadmap)
  - [ ] Add "Verify everything works" section with curl commands
  - [ ] Add links to ENVIRONMENT.md, REDIS_SETUP.md, DEPLOY.md, BRANCH_FLOW.md
  - [ ] Add troubleshooting section for common first-time issues
  - [ ] Add `yarn setup` as the single bootstrap command

### docs/DEVELOPMENT.md

- Status: Exists — needs heavy rewrite
- Current issues: Title says "Project Template" (this is not a template, it's a live project); Refers to README.md as "comprehensive README" but doesn't link well; `setup.bat` referenced but file does not exist; `yarn dev` outdated; Missing socket-server; Node version wrong; Feature checklists are duplicating IMPLEMENTATION.md; API endpoints list is incomplete and has no base URL; Database setup section too brief; Deployment section outdated; No development workflow for common tasks
- Target audience: Team member / active contributor
- Todos:
  - [ ] Rewrite entirely as a development workflow guide, not a project template
  - [ ] Remove `setup.bat` reference (file does not exist)
  - [ ] Add correct Node (>=24) and Yarn (>=4.9.2) requirements
  - [ ] Add socket-server to project structure
  - [ ] Replace feature checklists with links to IMPLEMENTATION.md
  - [ ] Add section on how to run each app individually and together
  - [ ] Add section on common development tasks (new page, new API route, new DB model)
  - [ ] Add section on code quality checks (lint, type-check, test)
  - [ ] Add section on migration workflow
  - [ ] Remove deployment section (link to DEPLOY.md)
  - [ ] Add troubleshooting for dev server issues

### docs/ENVIRONMENT.md

- Status: Exists — needs restructure and accuracy fixes
- Current issues: NextAuth references remain (better-auth migration completed); Formatting broken in some list items (e.g., line 52 orphaned `- What:` fragment); REDIS_URL listed under "Frontend Flags" section (should be under Redis in Backend); OAuth callback URLs may use NextAuth pattern; No socket-server env vars documented; Some env vars documented that may not be used (SSLCommerz URLs dev example mentions localhost:3000, but payment pages may differ); Gotenberg section is thorough but could be a separate doc; Some descriptions assume knowledge (e.g., "Enable 2FA in Google Account")
- Target audience: Both (new contributor setting up + team member configuring)
- Todos:
  - [ ] Remove NextAuth.js references; use "better-auth" consistently
  - [ ] Restructure into clearer sections: Required → Database → Auth → OAuth → AI → S3 → Payments → Redis → Gotenberg
  - [ ] Fix broken list formatting throughout
  - [ ] Move REDIS_URL out of "Frontend Flags" into Redis section
  - [ ] Add socket-server env vars table
  - [ ] Add better-auth specific callback URLs
  - [ ] Add verification steps after each major section
  - [ ] Add "Quick Start" summary at the top (which 3-5 vars to set to get running)
  - [ ] Verify all documented env vars exist in actual .env.example files
  - [ ] Add note about NEXTAUTH_SECRET vs BETTER_AUTH_SECRET (both exist but one may alias the other)

---

## Section 3: Database & Redis

Files: `docs/ERD.md`, `docs/REDIS_SETUP.md`, plus new `docs/DATABASE.md`

### docs/ERD.md

- Status: Exists — minor updates
- Current issues: References NextAuth.js table names (Account, Session) — may differ from better-auth schema; No mention of newer models from Phases 7-10 (Analytics, Notifications, Admin models like AdminReport, SystemAlert, WebhookEndpoint, etc.; plus AIConversation, AIMetadata, AIKeyPoint from Phase 10); Good reference for existing devs but no "how to use this" guidance
- Target audience: Team member / database contributor
- Todos:
  - [ ] Add Phase 7-10 tables (Notification, NotificationSetting, AdminReport, SystemAlert, WebhookEndpoint, WebhookDelivery, ApiKey, ContentReport, AIConversation, AIMetadata, AIKeyPoint, PaperVersion, etc.)
  - [ ] Note that this is a simplified reference — Prisma schema is the source of truth
  - [ ] Add note about better-auth tables vs NextAuth tables if different
  - [ ] Add a "How to read this document" section at the top
  - [ ] Add links to Prisma schema file and ERD.md external LucidChart views
  - [ ] Add pgvector column note (PaperChunk.embedding as Unsupported("vector"))

### docs/REDIS_SETUP.md

- Status: Exists — good quality, minor alignment needed
- Current issues: REDIS_HOST/REDIS_PORT/REDIS_PASSWORD env var names differ from .env.example which prefers REDIS_URL; Docker command uses `redis:alpine` tag (latest vs pinned); No mention of Upstash as alternative in the setup options (mentioned in production section but not in options)
- Target audience: New contributor
- Todos:
  - [ ] Add note that .env.example uses `REDIS_URL` as the primary connection string
  - [ ] Add Upstash as Option 4 (serverless Redis, good for Vercel)
  - [ ] Add "Verify it worked" curl/redis-cli check after setup
  - [ ] Pin Docker image tag to `redis:7-alpine` for reproducibility

### docs/DATABASE.md (NEW)

- Status: Missing — needs creation
- Why needed: DB setup knowledge is scattered across SETUP.md, ENVIRONMENT.md, REDIS_SETUP.md, and AGENTS.md. A single focused guide is needed.
- Target audience: New contributor
- Todos:
  - [ ] Create new file `docs/DATABASE.md`
  - [ ] Section: PostgreSQL installation (local, WSL, Docker)
  - [ ] Section: pgvector extension setup
  - [ ] Section: Create database and user
  - [ ] Section: Prisma migration workflow (migrate → generate → seed)
  - [ ] Section: Prisma Studio usage
  - [ ] Section: Common DB troubleshooting
  - [ ] Section: Migration discipline checklist

---

## Section 4: Deployment & Operations

Files: `docs/DEPLOY.md`, `docs/BRANCH_FLOW.md`, plus new `docs/QUICKSTART.md`, `docs/TESTING.md`

### docs/DEPLOY.md

- Status: Exists — good quality, minor fixes needed
- Current issues: Node 22.x setup script used for Oracle Cloud (should be 24.x); Git clone URL uses HTTPS (verify it matches repo); Some env var names may differ from current .env.example (e.g., BETTER_AUTH_SECRET vs NEXTAUTH_SECRET)
- Target audience: DevOps / team member deploying
- Todos:
  - [ ] Fix Node.js version in Oracle Cloud section (22.x → 24.x)
  - [ ] Update Oracle Cloud Ubuntu version (22.04 → 24.04 recommended)
  - [ ] Verify all env var names against current .env.example files
  - [ ] Add socket-server deployment to Oracle Cloud section (currently only covers REST API)
  - [ ] Add "Prerequisites" section at top with links to Vercel/Render signup
  - [ ] Add verification curl commands in each deployment step (not just at end)

### docs/BRANCH_FLOW.md

- Status: Exists — good quality, minor updates
- Current issues: Date says "August 26, 2025" (needs refresh); Emoji usage is fine but inconsistent with other docs; Hotfix flow says "merge hotfix to atik" — this bypasses the `atik`→`dev`→`main` flow (contradiction)
- Target audience: Team member
- Todos:
  - [ ] Update last-updated date
  - [ ] Clarify hotfix flow: after merging hotfix to `atik`, does it auto-flow to `dev`→`main`?
  - [ ] Add note about conventional commit format expected by the flow

### docs/QUICKSTART.md (NEW)

- Status: Missing — needs creation
- Why needed: No single 5-minute "get running" guide exists. A new contributor doesn't know which file to read first.
- Target audience: New contributor (first 15 minutes)
- Todos:
  - [ ] Create `docs/QUICKSTART.md`
  - [ ] 10 numbered steps max: clone → install → env → DB → migrate → seed → dev → verify
  - [ ] Each step is exactly one copy-paste command
  - [ ] Links to detailed docs for each step (SETUP.md, ENVIRONMENT.md, etc.)
  - [ ] "You should see" checkpoints after key steps

### docs/TESTING.md (NEW)

- Status: Missing — needs creation
- Why needed: No testing documentation exists
- Target audience: Contributor writing/running tests
- Todos:
  - [ ] Create `docs/TESTING.md`
  - [ ] Section: How to run tests (all, frontend, backend)
  - [ ] Section: Test structure and conventions
  - [ ] Section: Writing new tests (with examples)
  - [ ] Section: Testing database operations (mocking Prisma)
  - [ ] Section: CI/CD test expectations

---

## Section 5: Legal, Policy & AI Docs

Files: `LICENSE.md`, `docs/PROMPTING_GUIDE.md`, `docs/TERMS.md`, `docs/CODE_OF_CONDUCT.md`

### LICENSE.md

- Status: Exists — needs resolution with package.json
- Current issues: Content says Apache 2.0, but root `package.json` has `"license": "UNLICENSED"`. This is a real conflict. README badge says Apache 2.0.
- Target audience: Legal / all contributors
- Todos:
  - [ ] Flag the Apache 2.0 vs UNLICENSED conflict
  - [ ] Align LICENSE.md with the actual license intent (if UNLICENSED is correct, update this doc; if Apache 2.0 is correct, update package.json — but updating package.json is outside docs/ scope)
  - [ ] For docs/: update README.md badge and any license references to match LICENSE.md content

### docs/PROMPTING_GUIDE.md

- Status: Exists — good quality, no significant changes needed
- Current issues: References Next.js 15 in some examples (actually 16); Some version references may be stale (v1.1.0 in examples); Very thorough and well-structured
- Target audience: AI agents / developers using AI tools
- Todos:
  - [ ] Update version references in examples (1.1.0 → 1.3.1)
  - [ ] Update Next.js 15 references to 16
  - [ ] Quick verification pass for stale content

### docs/TERMS.md

- Status: Exists — legal document, leave as-is
- Current issues: None — this is a legal EULA, not documentation
- Target audience: Legal / users
- Todos:
  - [ ] No changes needed (legal document)

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

1. **Section 1: Root-Level Docs** — README.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md
2. **Section 2: Setup & Environment** — SETUP.md, DEVELOPMENT.md, ENVIRONMENT.md
3. **Section 3: Database & Redis** — ERD.md, REDIS_SETUP.md, DATABASE.md (new)
4. **Section 4: Deployment & Operations** — DEPLOY.md, BRANCH_FLOW.md, QUICKSTART.md (new), TESTING.md (new)
5. **Section 5: Legal & Polish** — LICENSE.md, PROMPTING_GUIDE.md (no changes: TERMS.md)

Each section is committed and pushed independently.
