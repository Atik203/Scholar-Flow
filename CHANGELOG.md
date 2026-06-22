# Scholar-Flow Release Notes

## Release 1.3.0-rc1 — Phase 10: FINAL PHASE (2026-06-22)

**Release date:** 2026-06-22
**Theme:** AI features, real-time collaboration, editor enhancements, production hardening.

---

### AI Features

- **Global AI Floating Assistant**: Cmd+J chat widget with markdown rendering, syntax-highlighted code blocks, copy-to-clipboard. 4 providers (OpenAI GPT-4o, Gemini Flash/Pro, Claude Sonnet/Haiku/Opus, DeepSeek V3/R1). Dynamic model selector from backend provider status. Conversations persisted to `AIConversation` + `AIConversationMessage` models.
- **AI Key Points**: `POST /papers/:id/key-points` extracts 5-10 key claims from paper content. `KeyPointsCard` component on paper detail page.
- **AI Rewriter**: `POST /api/ai/rewrite` — configurable tone, preserves meaning.
- **AI Comparator**: `POST /api/ai/compare` — side-by-side analysis of two papers.
- **AI Translator**: `POST /api/ai/translate` — translate to any language.
- **AI Literature Review**: `POST /api/ai/literature-review` — synthesize multiple papers.
- **Semantic Search**: pgvector embeddings via OpenAI `text-embedding-3-small` (1536-dim), batched at 20 chunks/API call.

### Editor Enhancements

- **LaTeX Math**: `LatexInline` and `LatexBlock` custom TipTap nodes with KaTeX rendering, click-to-edit, toolbar buttons.
- **Citation Insertion**: Search dialog from toolbar → `CitationNode` TipTap inline node. CRUD endpoints: `POST /citations/insert`, `GET /citations/paper/:id`.
- **Version History**: `PaperVersion` model, auto-snapshot before each save, keep 50 versions, restore support, `VersionHistoryDialog` UI.
- **Word Count + Reading Time**: Live stats in editor status bar via `CharacterCount` extension.
- **Full-Screen Mode**: Toggle via toolbar button, Esc to exit, Ctrl+S still saves.
- **Image Upload**: MS Word/Google Docs-style handling — smooth drag, alignment, caption, text wrap modes.
- **Template System**: 7 pre-built templates (IEEE, ACM, Springer, arXiv, Thesis, Literature Review, Blank) with `TemplateSelector` in toolbar.
- **Markdown Export**: `turndown`-based client-side export, downloadable `.md` file.

### Real-Time Collaboration (WebSocket)

- **WebSocket Server**: `socket.io` with JWT auth on handshake. `apps/socket-server/` for Render Free deployment. Room-based channels: `paper:`, `discussion:`, `workspace:`.
- **Y.js Collaborative Editing**: `useCollabSync` hook with socket.io sync provider. `/papers/[id]/collaborate` page with `Collaboration` extension.
- **Live Discussion Chat**: `LiveDiscussionFeed` component with real-time messages, typing indicators, online presence count. `useDiscussionSocket` hook.
- **Presence System**: Online/offline tracking, member counts, typing start/stop broadcasts.

### Production Hardening

- **Error Boundaries**: `/dashboard/error.tsx` covers all authenticated routes. `error.tsx` at root for catch-all.
- **Rate Limiting**: 16 dedicated limiters (auth, paper, billing, workspace, collection, AI generation). Added `workspaceMutationLimiter`, `collectionMutationLimiter`, `aiGenerationLimiter`.
- **CORS/CSP**: Helmet with strict CSP directives. CORS restricted to `FRONTEND_URL`. Anthropic/DeepSeek API domains whitelisted.
- **WebSocket CSP**: `connectSrc` derives from `WS_URL` env var for production WebSocket connections.
- **Deployment**: `docs/DEPLOY.md` with step-by-step guides for Vercel + Render Free ($0/mo) and Oracle Cloud Always Free ($0 forever).

### Env + Config

- Added `NEXT_PUBLIC_WS_URL` to all 6 env files for WebSocket base URL isolation.
- Added `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY` to all env files (with typo fix from `DEEPSEAK`).
- Added `DOCX_TO_PDF_ENGINE`, `DOCX_TO_PDF_QUALITY` with `soffice` default and 4 quality modes.
- Fixed `.env.example` merged vars bug and placeholder values.

---

## Release 1.2.9 — Phase 9: Polish, Performance & Final Pages (2026-06-20)

**Release date:** 2026-06-20
**Theme:** WCAG 2.1 AA accessibility, code splitting, 8 remaining figma-make pages, invitation backend, Lighthouse optimization, responsive components.

---

### Stream A+B: Final Pages + Invitation Backend

**8 new pages (98/102 figma-make covered — 96.1%):**
- `/dashboard/(app)/page-enhanced.tsx` — Enhanced Dashboard (6 stat cards + 2x2 activity grid)
- `/dashboard/(modules)/activity-log/recent/page.tsx` — Recent Activity (filter tabs + pagination)
- `/dashboard/(app)/papers/[id]/relations/page.tsx` — Paper Relations (citations + related papers)
- `/invitation/[token]/page.tsx` — Public Invitation Response (accept/decline via email link)
- `/dashboard/(modules)/resources/page.tsx` — Resources Index (4 cards)
- `/paper/[id]/page.tsx` → redirects to /dashboard/papers/:id
- `/research-notes/page.tsx` → redirects to /dashboard/notes
- `/admin-overview/page.tsx` → redirects to /dashboard/admin
- `/dashboard-enhanced/page.tsx` → redirects to /dashboard

**Backend — Public Invitation Endpoints:**
- `GET /api/invitations/:token` — public, returns workspace/inviter/role details
- `POST /api/invitations/:token/accept` — auth required, creates membership + activity log
- `POST /api/invitations/:token/decline` — auth required
- New `invitation.routes.ts` wired into routes/index.ts

### Stream C: Code Splitting

- Added `Suspense` boundary in `(app)/layout.tsx` with spinner fallback for route transitions
- Added `loading.tsx` skeleton files for admin/, analytics/, discover/, ai-insights/ route groups
- Admin page already uses 3 `React.lazy` components (AdminStatsCard, RecentUsersTable, SystemHealthIndicator)
- New `ResponsiveTable` UI component for mobile-responsive data tables

### Stream D: Accessibility (WCAG 2.1 AA)

- Installed `eslint-plugin-jsx-a11y` dev dependency
- Added 18 a11y lint rules: aria-props (error), aria-role (error), alt-text (warn), label-has-associated-control (warn), tabindex-no-positive (warn), heading-has-content (warn), html-has-lang (error), iframe-has-title (error), scope (error), etc.
- **0 a11y lint errors** across the codebase

### Stream E: Lighthouse Optimization

- Backend: `Cache-Control: private, max-age=30` on all GET /api/* responses
- Backend: `Vary: Authorization` header for proper cache keying
- Backend: Root handler version updated to 1.2.9
- Frontend: Next.js defaults (SWC minification, Turbopack tree-shaking, CSS optimization)

### Version Bumps

- Root package.json: 1.2.8 → 1.2.9
- Frontend package.json: 1.2.8 → 1.2.9
- Backend package.json: 1.2.8 → 1.2.9

### Page Coverage: 98/102 figma-make (96.1%)

Remaining 4 pages (Phase 10):
- #10 EnhancedDashboardPage (alternate URL, redirect exists)
- #11 RecentActivityPage (alternate URL, redirect exists)
- #45 InvitationResponsePage (alternate URL, public page exists)
- #19 PaperRelationsPage (exists at /papers/:id/relations)

---

## Release 1.2.8 — Phase 8: Architecture Stabilization & Production Hardening (2026-06-20)

**Release date:** 2026-06-20
**Theme:** System re-alignment — unified architecture, normalized API patterns, production hardening, UX polish, and 14 new pages matching figma-make design.

---

### Stream A: Architecture Normalization (Critical Fixes)

- **CD-1: Unified entry points** — deleted `src/index.ts` (diverged from server.ts), enhanced `server.ts` with CORS allowedOrigins from index.ts, updated `vercel.json` rewrites from `/api/index.js` to `/api/server.js`
- **CD-2: Removed dead errorHandler.ts** — deprecated by `globalErrorHandler.ts` (which handles Zod/Prisma/Postgres/JWT/Mongo errors). Verified zero references
- **CD-3: Killed phase2Api separate RTK instance** — migrated all 16 endpoints into existing slices (citationApi, discussionApi), unwrapped response types, extended DiscussionThread interface with author/participants, added ActivityLog tagType, removed from store.ts. Single apiSlice with shared cache invalidation across all 22 slices
- **CD-4: Removed AppError class** — migrated 3 files (auth.controller, oauth.controller, admin.service) to ApiError. ApiError has identical constructor + errorCode field
- **HD-5: Fixed any types** — 6 RTK endpoints + all nested fields (`metadata`, `filters`, `details`) replaced with proper interfaces (`TeamMember`, `WorkspaceSettings`, `CollectionStats`, `SaveSearchQueryRequest`, `TeamActivitySummary`, `PaginationMeta`). Extended TeamMember type with firstName/lastName/institution/fieldOfStudy/createdAt/_count

### Stream B: Architecture Normalization (Structure)

- **HD-1: Renamed modules to PascalCase** — `annotations/` → `Annotations/`, `notes/` → `Notes/`, `papers/` → `Papers/` for consistency with 19 other modules. Also renamed `StorageService.ts` → `storage.service.ts`. Updated 5 import sites
- **HD-2: Deleted dead Paper/ module** — stale `paper.service.ts` + `embedding.service.ts` (never wired into routes). Active module is `Papers/`
- **HD-3: Removed auth.controller.new.ts** — 185-line migration artifact never wired into routes. Canonical is `auth.controller.ts` (538 lines)
- **HD-4: Migrated routes into modules** — `citation.routes.ts` → `modules/CitationExport/`, `discussion.routes.ts` → `modules/Discussion/`, `activityLog.routes.ts` → `modules/ActivityLog/`. Removed stale legacy route comments from index.ts
- **HD-6: Standardized exports** — all controllers/services use named exports only. 36 files updated. Removed all `export default` lines. Converted all default imports to named imports via parsing engine

### Stream C: Database + Performance

- Added `@@index([userId, starred])` on Notification model for fast starred-notification queries
- Collapsed auth middleware from 2 sequential Prisma queries into single OR query — reduces auth latency by ~50% on cloud DB (40ms→20ms)
- Updated `Collection.isPublic` deprecation annotation → Phase 9 removal

### Stream D: Frontend UX

- **Shared `EmptyState` component** — icon + title + description + action button pattern, reusable across all 47 dashboard pages
- **Shared `ErrorState` component** — AlertCircle icon + error details + retry button with RefreshCcw icon
- **Proxy.ts overhaul** — added 28 missing public routes (forgot-password, reset-password, verify-email, onboarding, resources/*, products/*, company/*, enterprise, careers, integrations, support, press, legal, license, security, etc.), removed dead `getRoleFromCookies` function (always returned undefined), removed unused `legacyRoleSegments` constant, fixed authenticated redirect from `/dashboard/undefined` to `/dashboard`
- Removed 6 redundant `.enhanceEndpoints({ addTagTypes })` calls — tags already in apiSlice.tagTypes
- Moved `Notebook/notebook.validation.test.ts` to `__tests__/Notebook/`

### Phase 8 Features: 14 New Pages (Matching figma-make)

**Onboarding:**
- `/dashboard/onboarding/role` — Role selection page
- `/dashboard/onboarding/workspace` — Workspace create page

**Settings:**
- `/dashboard/settings/export` — Data export (CSV/JSON) with format selection
- `/dashboard/settings/integrations` — Integration settings (Slack, Discord, custom webhooks)

**Security:**
- `/dashboard/security` — Security dashboard with 2FA/sessions/privacy status
- `/dashboard/security/2fa` — TOTP authenticator setup/verify/disable
- `/dashboard/security/sessions` — Active sessions list with terminate action
- `/dashboard/privacy` — Privacy settings (profile visibility, activity tracking, data sharing)

**Help:**
- `/dashboard/help` — Help center with FAQ
- `/dashboard/help/shortcuts` — Keyboard shortcuts reference

**Research:**
- `/dashboard/research/citation-graph` — Citation network visualization
- `/dashboard/research/map` — Research topic map

**Notifications:**
- `/dashboard/notifications` — Root redirect to center

### New Backend Endpoints

- **ExportData:** `POST /api/user/export` — trigger data export (papers/collections/notes/profile)
- **Sessions:** `GET /api/user/sessions`, `DELETE /api/user/sessions/:id`
- **2FA:** `GET /api/user/2fa/status`, `POST /api/user/2fa/generate`, `POST /api/user/2fa/verify`, `POST /api/user/2fa/disable`
- **Privacy:** `GET /api/user/privacy`, `PUT /api/user/privacy`

### New RTK Query Hooks

- `useExportUsageAnalyticsQuery` → `GET /analytics/usage/export`
- `useLazyExportAuditLogQuery` → `GET /admin/audit-log/export`

### Sidebar Updates

- Added **Security** section (Dashboard, 2FA, Sessions, Privacy) — all roles
- Added **Help** section (Center, Shortcuts) — all roles
- Added **Discover → Explore** sub-item
- Consolidated 13 admin items under single `adminFeatures` array

---


