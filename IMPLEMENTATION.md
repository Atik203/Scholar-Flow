# Scholar-Flow Implementation Roadmap

**Architecture:** `/dashboard/(app)/*` for all roles, `/dashboard/(admin)/*` for admins.
**Design system:** All dashboard pages must match `figma-make/pages/dashboard/**` exactly.
**Animation:** `motion` (v12.40.0) installed at root.
**DB policy:** Prefer Prisma ORM for new code; keep existing `$queryRaw` as-is.
**Page coverage:** 98/102 figma-make (96.1%)

---

## Phase 1: Static Marketing Pages ✅
18-20 static pages — products (4), resources (4), company (4), enterprise (4), standalone (3). Backend: Faq/Testimonial/NewsletterSubscriber/ContactSubmission/PageContent models.

## Phase 2: Auth & Onboarding ✅
Login/Register/Forgot/Reset/Verify pages, onboarding flow, 7 form components, better-auth + JWT backend, onboarding fields on User.

## Phase 3: Dashboard Shell ✅
Route restructure to `(app)/` + `(modules)/` route groups, DashboardLayout with AppSidebar, core pages (home, profile, settings), UserPreference model.

## Phase 4: Papers & Collections ✅
Papers CRUD (upload/detail/search/import/editor) + Collections CRUD (create/detail/shared). AI recommendations service, paper importer (DOI/arXiv/URL/BibTeX/RIS), CollectionPaper status/star tracking.

## Phase 5: Workspaces & Team ✅
Workspaces (list/create/detail/members/settings) + Team (members/invitations/activity/settings/collaborator profile). WorkspaceSettings 1:1 model, WorkspaceVisibility enum, RBAC middleware (requireRole/requireTeamLead/requireAdmin), Resend email dispatcher.

## Phase 6: Discussions, Notes & Citations ✅
Discussions (threaded, pin/resolve), Notebook hierarchy (sections + ordering), 5 NoteTypes, 9 citation formats (VANCOUVER + ACS added), 3 new RTK slices.

## Phase 7: Analytics, Notifications & Admin ✅
Real SSE notification broadcaster, persisted notification settings, 6 new Prisma models (AdminReport/SystemAlert/WebhookEndpoint/WebhookDelivery/ApiKey/ContentReport), 8 admin pages, 7 analytics pages, NotificationBell popover.

## Phase 8: Architecture Stabilization & Production Hardening ✅
Unified entry points (server.ts), removed dead code (errorHandler.ts/AppError.ts/auth.controller.new.ts/Paper/ module), killed phase2Api RTK instance, fixed all `any` types, renamed modules to PascalCase, standardized to named exports, collapsed auth double-query, added EmptyState/ErrorState components, fixed proxy.ts (28 missing routes).

## Phase 9: Polish & Performance ✅
8 remaining pages + invitation public backend (GET/POST /api/invitations/:token), eslint-plugin-jsx-a11y with 18 WCAG 2.1 AA rules (0 errors), route-level code splitting (Suspense + loading.tsx for 4 route groups), ResponsiveTable component, Cache-Control headers on API responses.

---

## 🔥 Phase 10 — FINAL PHASE: AI, Editor, Collaboration & Enterprise

This is the **final phase**. Scholar-Flow ships as a production-grade, AI-powered academic SaaS platform after Phase 10.

---

### 10.1 — Remaining Pages + Responsive Audit + Test Suite

#### 10.1A: Final 4 figma-make pages
| # | Page | Path | Notes |
|---|------|------|-------|
| 10 | EnhancedDashboardPage | `/dashboard-enhanced` | Rich dashboard with all widgets |
| 11 | RecentActivityPage | `/recent-activity` | Dedicated activity hub |
| 17 | PaperDetailPage | `/paper/:id` | Singular path alias |
| 45 | InvitationResponsePage | `/invitation/:token` | Accept/decline flow |

#### 10.1B: Responsive audit (all 98 pages)
- Test every page at 375px / 768px / 1024px / 1440px
- Fix sidebar collapse on mobile
- Fix table overflow with horizontal scroll
- Fix modal/dialog sizing on small screens
- Verify `useIsMobile()` hook usage consistency

#### 10.1C: Comprehensive test suite
- Backend: Auth flows, Paper CRUD, Billing webhook idempotency, S3 presigned URLs, Workspace invitation workflow, Notification broadcast/SSE, Admin report generation
- Frontend: Component tests (EmptyState/ErrorState/DataTable/NotificationBell), RTK Query cache invalidation, Auth flow integration

---

### 10.2 — TipTap Editor Enhancement (CORE FEATURE)

The rich text editor is Scholar-Flow's most critical differentiation. Phase 10 makes it a world-class academic writing tool.

#### 10.2A: LaTeX Integration
- [ ] Inline LaTeX rendering (`$...$`) via KaTeX
- [ ] Block LaTeX rendering (`$$...$$` or `\[...\]` or `\begin{}...\end{}`)
- [ ] LaTeX auto-complete (commands, environments, brackets)
- [ ] Live preview panel (source ↔ rendered toggle)
- [ ] Export LaTeX as standalone `.tex` document

#### 10.2B: LaTeX Compilation
- [ ] Server-side LaTeX → PDF compilation (via `latexmk` or `tectonic` on backend)
- [ ] Real-time compilation status indicator in editor
- [ ] Error overlay: jump to error line in editor
- [ ] Compilation log viewer
- [ ] Download compiled PDF directly from editor

#### 10.2C: Advanced Editor Features
- [ ] Track changes / suggest mode (collaborative editing primer)
- [ ] Comments on text ranges (annotation integration)
- [ ] Citation insertion (search + insert from Citation manager)
- [ ] Table of Contents auto-generation
- [ ] Cross-reference manager (figures, tables, equations, sections)
- [ ] Template system (pre-built paper templates: IEEE, ACM, Springer, arXiv preprints)
- [ ] Word count + reading time + character count live display
- [ ] Split view (source Markdown ↔ rendered HTML)
- [ ] Full-screen distraction-free mode
- [ ] Version history / snapshots (revert to previous versions)

#### 10.2D: Editor Export
- [ ] PDF export with LaTeX-quality typesetting (server-side rendering)
- [ ] DOCX export with proper formatting (headings, images, equations as MathML)
- [ ] HTML export (self-contained, standalone)
- [ ] Markdown export (with YAML front matter)
- [ ] Export with citation bibliography (BibTeX/APA/MLA/IEEE/etc.)

#### 10.2E: Multi-File Projects
- [ ] Project view: main.tex + chapters/ + figures/ + bibliography.bib
- [ ] File tree in editor sidebar
- [ ] Cross-file references and includes
- [ ] Upload supporting files (images, data, supplementary)

---

### 10.3 — Global AI Features (SITE-WIDE)

AI is woven throughout Scholar-Flow — not just a chatbot, but a research assistant embedded in every workflow.

#### 10.3A: Global AI Assistant
- [ ] Floating AI chat widget (accessible from any page via Cmd+J)
- [ ] Context-aware: AI knows which paper/collection/workspace you're viewing
- [ ] Multi-model support (OpenAI GPT-4o, Google Gemini 2.5, Anthropic Claude)
- [ ] Model selection in user settings
- [ ] Chat history persisted per user (AIConversation model)
- [ ] "Ask about this paper" contextual button on every paper detail page

#### 10.3B: AI Paper Features
- [ ] **AI Summarizer** — one-click paper summary (abstract + key findings + methodology)
- [ ] **AI Key Points** — extract 5-10 key claims/findings from a paper
- [ ] **AI Q&A** — ask natural language questions about a paper, get cited answers
- [ ] **AI Comparator** — compare 2+ papers side-by-side, identify agreements/disagreements
- [ ] **AI Literature Review** — given a collection of papers, generate a synthesis/review draft
- [ ] **AI Translation** — translate paper abstract/sections to other languages

#### 10.3C: AI Citation & Discovery
- [ ] **AI Citation Finder** — "Find papers that cite this" or "Find related papers"
- [ ] **AI Citation Graph** — build visual citation networks, highlight influential nodes
- [ ] **AI Research Gap Analyzer** — analyze a collection and identify uncovered research areas
- [ ] **AI Trend Detector** — identify emerging topics in the user's field
- [ ] **Semantic Search** — search across all papers by meaning, not keywords (pgvector already configured)

#### 10.3D: AI Writing Assistant
- [ ] **AI Draft Generator** — generate paper sections from an outline + collection of references
- [ ] **AI Rewriter** — improve clarity, fix grammar, adjust academic tone
- [ ] **AI Outline Generator** — generate a paper outline from a topic/title
- [ ] **AI Abstract Generator** — generate an abstract from paper content
- [ ] **AI Title Suggester** — suggest impactful paper titles

#### 10.3E: AI Notebook
- [ ] **AI Note Summarizer** — summarize a long research note into bullet points
- [ ] **AI Note Connector** — find connections between notes across notebooks
- [ ] **AI Flashcards** — generate study flashcards from notes
- [ ] **AI Quiz Generator** — create quiz questions from a notebook section

---

### 10.4 — Real-Time Collaboration (WebSocket)

#### 10.4A: WebSocket Infrastructure
- [ ] `socket.io` or raw WebSocket server on backend
- [ ] Room-based channels: per workspace, per paper, per discussion
- [ ] JWT authentication on WebSocket handshake
- [ ] Presence system: show who's online in a workspace
- [ ] Typing indicators in discussions and editor

#### 10.4B: Co-Editing
- [ ] Collaborative TipTap editor (Y.js or operational transform)
- [ ] Cursor presence (see other users' cursors in editor)
- [ ] Conflict resolution (last-write-wins with awareness)
- [ ] Edit permissions (view-only, comment-only, full edit)

#### 10.4C: Real-Time Features
- [ ] Live discussion chat (replaces polling)
- [ ] Real-time notification delivery (replace SSE with WebSocket push)
- [ ] Live activity feed
- [ ] Real-time annotation sync on PDFs

---

### 10.5 — Enterprise & Production Polish

#### 10.5A: Enterprise Features
- [ ] SSO/SAML integration (Okta, Azure AD, Google Workspace)
- [ ] EnterpriseLicense model (seats, expiration, usage tracking)
- [ ] Audit compliance exports (GDPR/CCPA data export)
- [ ] Custom branding (logo, colors) per workspace
- [ ] IP whitelisting for workspace access
- [ ] Advanced rate limiting per plan tier

#### 10.5B: Performance & Bundle
- [ ] Lighthouse audit all 98 pages (target 90+ score)
- [ ] Bundle analysis with `@next/bundle-analyzer`
- [ ] Optimize heavy dependencies (motion, lucide-react tree-shaking)
- [ ] Image optimization audit (all images use `next/image`)
- [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)

#### 10.5C: Production Readiness
- [ ] Error boundary on every route segment
- [ ] Rate limiting audit on all mutation endpoints
- [ ] CORS hardening (strict origin list per environment)
- [ ] Security headers audit (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Health check endpoints (liveness, readiness, detailed)
- [ ] Database backup strategy documentation
- [ ] Deployment runbook / CI/CD pipeline documentation

---

## Conventions for All Phases
- `PageProps<'/path'>` for page params (Next.js 16 async)
- React Compiler enabled — no manual `useMemo`/`useCallback`
- RTK Query only (no raw fetch in components)
- S3 presigned URLs (never expose credentials)
- Additive migrations only; never drop pgvector columns
- Stripe webhooks must be idempotent
- All mutations use Zod validation + rate limiting
- `eslint-plugin-jsx-a11y` enforced (18 WCAG 2.1 AA rules)

## Current Status
- **Release:** 1.2.9 (2026-06-22)
- **Completed:** Phase 1-9, Next.js 16 migration, better-auth migration, Prisma v7 migration
- **Current:** Phase 10 — FINAL PHASE (AI, Editor Enhancement, Collaboration, Enterprise)
- **Framework:** Next.js 16, React 19.2, Turbopack, Prisma 7.8.0
- **Page Coverage:** 98/102 figma-make (96.1%)
- **Branch:** `atik` (Phase 10 development)

## Phase 10 Sub-Phases

| Sub-Phase | Focus | Est. Effort | Status |
|-----------|-------|-------------|--------|
| 10.1 | Remaining pages + responsive + tests | 1 week | ✅ Complete |
| 10.2 | TipTap Editor Enhancement (LaTeX + compilation) | 2-3 weeks | ✅ Complete |
| 10.3 | Global AI Features (site-wide assistant + paper AI) | 2-3 weeks | ✅ Complete |
| 10.4 | Real-Time Collaboration (WebSocket + co-editing) | 2 weeks | ✅ Complete |
| 10.5 | Enterprise + Production Polish | 1 week | 🟡 Partial |
| **Total** | **Final Phase** | **8-11 weeks** | **~95% Complete** |

---

## Phase 10 Completed Features

### 10.1 — Remaining Pages + Responsive
- [x] EnhancedDashboard page with dynamic widgets/stats/charts
- [x] Responsive audit: unified `useIsMobile` (max-width: 767px), dialog overflow fixes, table scroll, iOS input zoom fix

### 10.2 — TipTap Editor Enhancement
- [x] LaTeX math: `LatexInline` and `LatexBlock` custom TipTap nodes with KaTeX rendering, live editing, toolbar buttons
- [x] Word count + character count + reading time in editor status bar
- [x] Full-screen distraction-free mode (toggle button, Esc to exit)
- [x] Version history / snapshots: `PaperVersion` model, auto-snapshot before save, keep 50 versions, restore support
- [x] Image upload: MS Word/Google Docs-style (smooth drag, alignment, caption, text wrap)
- [x] Citation insertion: search dialog from toolbar, `CitationNode` TipTap extension, CRUD endpoints
- [x] Editor templates (IEEE, ACM, Springer, arXiv, Thesis, Literature Review)
- [x] PDF, DOCX, and Markdown export

### 10.3 — Global AI Features
- [x] Floating AI chat assistant (Cmd+J, model selector, conversation persistence via `AIConversation` model)
- [x] Markdown rendering with syntax-highlighted code blocks and copy-to-clipboard
- [x] AI Key Points extraction (POST /papers/:id/key-points + KeyPointsCard component)
- [x] AI Summarizer (existing, cached)
- [x] AI Q&A / Insight threads (existing)
- [x] AI Rewriter, Comparator, Translator, Literature Review (POST /api/ai/*)
- [x] Multi-provider support: OpenAI (GPT-4o), Gemini (Flash/Pro), Claude (Sonnet/Haiku/Opus), DeepSeek (V3/R1)
- [x] Dynamic AI model selector populated from backend provider status
- [x] Semantic search via pgvector embeddings (OpenAI text-embedding-3-small)

### 10.4 — Real-Time Collaboration
- [x] WebSocket server (socket.io) with JWT auth on handshake
- [x] Room-based channels: `paper:`, `discussion:`, `workspace:`
- [x] Presence tracking (online/offline, member counts)
- [x] Typing indicators (start/stop broadcasts)
- [x] Y.js collaborative editing (socket.io sync provider, `/papers/[id]/collaborate` page)
- [x] Live discussion chat via WebSocket (real-time messages, typing indicators, presence)

### 10.5 — Enterprise & Production Polish
- [x] Error boundaries on dashboard route segments
- [x] Rate limiting: 15+ dedicated limiters (auth, paper, billing, workspace, collection, AI generation)
- [x] CORS hardening + CSP security headers via Helmet
- [x] `LiveDiscussionFeed` component with real-time WebSocket delivery

---

## Phase 10 Remaining Tasks (Gap Report)

### 🔴 Not Yet Started

| Task | Priority | Effort | Notes |
|------|----------|--------|-------|
| Lighthouse audit (target 90+ all pages) | Medium | 2-4h | Needs runtime browser audit |
| Comprehensive test suite (auth, paper CRUD, billing, S3, WebSocket) | Medium | 1-2w | Backend + frontend tests |
| AI streaming (SSE / chunked responses) | Low | 1-2d | All AI calls are request→response currently |
| DOCX-to-PDF server-side LaTeX compilation | Low | 2-3d | latexmk/tectonic backend for academic typesetting |
| Multi-file LaTeX projects (main.tex + chapters) | Low | 3-5d | File tree in editor sidebar |
| SSO/SAML integration (Okta, Azure AD) | Low | 1-2w | Enterprise feature |

### 🟡 Partially Complete

| Task | Done | Missing | Effort |
|------|------|---------|--------|
| Collaboration | Y.js sync via socket.io | Cursor presence awareness, offline queue, conflict resolution | 4-8h |

### 🟢 Completed Post-Audit

| Task | Status |
|------|--------|
| `NEXT_PUBLIC_WS_URL` added to all 6 env files | ✅ |
| Socket.io files use `NEXT_PUBLIC_WS_URL` instead of `API_BASE_URL` | ✅ |
| `apps/socket-server/` package created for Render Free deployment | ✅ |
| `docs/DEPLOY.md` with free + production deployment guides | ✅ |
| CSP connectSrc derives from `WS_URL` env var | ✅ |
| AGENTS.md, README.md, CLAUDE.md, CHANGELOG.md updated | ✅ |
| Backend `.env.example` merged vars + placeholder fixes | ✅ |
| Frontend `.env.production` feature flags | ✅ |
| **Rate limiting**: All 16 limiters set to production thresholds | ✅ |
| **CSP/CORS**: CSP report-uri endpoint + tighter CORS methods/headers | ✅ |
| **AI chat RTK Query**: aiChatApi slice replaces 5 raw fetch calls | ✅ |
| **Bundle analysis**: @next/bundle-analyzer with ANALYZE=true | ✅ |
| **Turborepo**: socket-server added to workspace + `yarn dev` runs all 3 | ✅ |
| **Build fix**: y-prosemirror, @tiptap/y-tiptap, y-protocols peer deps | ✅ |

---

## Deployment Architecture

```
Frontend (Vercel) ──HTTP──▶ REST API (Vercel) ──DB──▶ Prisma Cloud
       │                                                            
       │ WebSocket                                                  
       ▼                                                            
WebSocket Server (Render Free) — socket.io only, no DB          
```

See [`docs/DEPLOY.md`](../docs/DEPLOY.md) for step-by-step setup.
