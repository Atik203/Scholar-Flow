# Scholar-Flow Release Notes

## Release 1.3.6 — Admin Console Fully Dynamic: System Actions, Persisted Settings & Real Exports (2026-09-20)

**Release date:** 2026-09-20
**Theme:** Every admin menu backed by real data — real system metrics and
actions (diagnostics, cache flush, log export), a persisted platform settings
store, real CSV/JSON exports, server-side aggregates, and removal of all
mock/dead UI.

---

### System monitoring — no more placeholder data

- `GET /admin/health` cache block now reports the real cache layer state
  (`cacheService` stats: configured / Redis connected / hit rate from actual
  lookups) instead of a hardcoded 85%.
- `GET /admin/system/metrics` returns the real PostgreSQL version
  (`current_setting('server_version')`) and derives server health from memory
  pressure + DB status; fake network byte counters were removed.
- New `POST /admin/system/diagnostics`: database ping + pool, heap/RSS memory,
  cache and runtime info aggregated into pass/warn/fail checks.
- New `POST /admin/system/clear-cache`: flushes Redis + the in-memory fallback;
  returns 409 when Redis is not connected. Cache keys are namespaced
  (`sf:cache:`) and cleared via SCAN/DEL — never FLUSHDB, because Bull PDF-queue
  keys share the same Redis database.
- New in-memory log ring buffer (last 1000 console lines, resets on restart)
  with `GET /admin/system/logs` and `GET /admin/system/logs/export`.

### Settings — persisted platform configuration

- New `SystemSetting` model + migration; `GET/PATCH /admin/settings` with Zod
  validation and an ActivityLogEntry audit trail on every write.
- Settings page fully wired: platform name, support email, session timeout,
  2FA requirement flag, notification toggles and storage quota; 2FA/backup rows
  now explain platform-managed behavior instead of dead Configure buttons.

### Exports & aggregates

- New `GET /admin/users/export` — filter-aware CSV (search/role/status, 10k cap)
  used by the Overview's Export button.
- `GET /admin/payments` now returns a full-filter `summary` (succeeded count,
  total revenue) in `meta` — no more page-scoped totals.
- New `GET /admin/reports/stats` — server-side status counts; reports page
  generates downloads through an RTK blob mutation instead of a raw fetch and
  gained pagination.
- Audit log CSV/JSON export now streams through the RTK blob hook (the old
  `window.open` pointed at a frontend route that never existed).

### Dashboard & page fixes

- Overview: real user export, user-growth chart + role-distribution widgets
  (previously unused endpoints), working recent-user role/deactivate/delete
  actions and pagination.
- AI Models: edit dialog's "Set as default" now calls the dedicated
  set-default endpoint (PATCH ignored it).
- Moderation: Resolve/Dismiss render for reports without a content preview.
- Webhooks: delete/event-type failures surface toasts; retry-delivery
  invalidates the endpoint's delivery list cache.
- Cleanup: dead PerformanceBar color prop, unused imports and refetch handles.

### Verification

- `yarn lint` 0 errors, `yarn type-check` green (3 packages), `yarn build` 3/3.
- Live-tested against the shared cloud DB as an admin: settings round-trip with
  audit, diagnostics, namespaced cache clear, log capture/export, users CSV,
  payments summary and reports stats all verified; no runtime errors.

---

## Release 1.3.5 — Team Collaboration Access, Real-Time Notification Delivery & Annotations UX (2026-09-19)

**Release date:** 2026-09-19
**Theme:** Derived team access for invited collaborators, push notifications for
every team/invite/share event, revocable workspace-scoped membership, annotations
UX overhaul, citation persistence, and realtime stack hardening.

---

### Team — collaboration access without role escalation

- **Derived Team access** (`GET /team/access`): the Team section now opens for
  TEAM_LEAD+ **or** an active member of someone else's workspace **or** an owner
  whose workspace has other members **or** anyone with a pending invitation.
  Invited RESEARCHER / PRO users get the sidebar on invite and lose it when the
  lead removes them — no global role promotion, no billing-side effects.
- **Members/Invitations/Activity** allow that derived access; role changes,
  settings and removal stay TEAM_LEAD+. Sidebar items and action buttons gate
  themselves by the same rule (settings page shows a lead-only notice).
- **Member removal is now workspace-scoped revocation**: soft-deletes the
  target's memberships + pending invitations in workspaces the lead owns and
  writes an activity-log entry. It no longer soft-deletes the whole user
  account (account deletion stays in the admin panel).
- Invitations: workspace-targeted sends (`workspaceId` verified against owned
  workspaces), Viewer/Editor/Manager labels mapped to workspace roles, page
  pagination, and the "Admin" invite that silently sent TEAM_LEAD is gone.
- Members list shows **real status + lastActive** derived from
  `ActivityLogEntry` (30-day inactivity window) instead of a hardcoded "active".
- ActivityLog `?userId=` horizontal-read closed (self or admin only); offset +
  cursor pagination now accepted and applied.
- Activity page: server-side member/date filters, cursor "load older" paging,
  accurate stat labels, 30s polling that pauses while reading older pages.

### Notifications — real-time push for every team event

- **New SSE pushes**: team invite sent / resent / cancelled, invite declined
  (workspace + team), role changed, removed from team, and paper-shared-by-email
  for registered recipients. Accept already pushed to the inviter.
- **Delivery preferences enforced at creation time** (`notificationSettingsService`):
  mute-all, in-app channel and per-category toggles are honored; all call sites
  now pass a category (PAPERS / DISCUSSIONS / COLLECTIONS / WORKSPACE / TEAM /
  BILLING / SECURITY / SYSTEM / ACHIEVEMENT). BILLING and SECURITY are
  transactional and always deliver; preference reads fail open and never create
  rows for recipients.
- **Instant read UX**: mark-as-read, mark-all, star and delete mutations are now
  optimistic (badge + lists update in the same frame, rollback on failure,
  filter-aware for read/starred views). The bell keeps a 15s poll as an
  offline/reconnect fallback behind SSE.
- SSE `notification.created` also invalidates derived Team access, so a new
  invitation opens the Team sidebar in the same second.

### Research — annotations, editor, citations

- **PDF Annotations overhaul**: collapsible "Your Papers" panel (300px ↔ 56px
  icon rail, persisted, search + PDF-ready filter, mobile Sheet drawer), notes
  are optional on every mark (empty text is valid and clearable), compact
  icon-only type picker with tooltips, viewport-clamped popup, edit-dialog state
  fix, confirmation dialogs for deletes, annotations query retry, and the
  annotations side panel defaults open only on xl screens.
- **Editor**: Templates tab creates papers pre-filled from the 7 templates;
  Settings tab persists autosave delay / font size / spellcheck and applies them
  live; a Collaborate button opens the collab route (after flushing pending
  saves); ShareModal has a working team-member picker and no more dead "Team" TODO.
- **Citations**: editor inserts now persist `Citation` rows through the
  access-checked `/citations/insert`; the citations page graph renders real
  citation links; export dialog downloads real files; history rows download and
  delete with toasts; ENDNOTE export requires Pro (enforced server-side); the
  duplicate `/dashboard/research/citations/*` subtree was deleted in favor of
  307 redirects to `/dashboard/citations`.

### Realtime & Sockets

- Fixed the dead socket hooks: `useCollabSync` and `useDiscussionSocket` now read
  auth via `getAppStore()` (the legacy `window.__REDUX_STORE__` was never set, so
  every realtime feature silently no-op'd).
- Collaboration: seeds the shared doc from saved HTML exactly once (skipped when
  peers are present), awareness returned via state with clientId-keyed cursors,
  presence cleanup by userId, and debounced persistence to
  `PATCH /editor/:id/autosave` so collaborative work is durable.
- Both socket servers: emit-side `guardRoom` (must have joined), room-scoped
  `editor:sync-request` (was a global broadcast), sync events added to the
  in-process server for parity, discussion message validation.
- Keep-alive now runs on the `(modules)` Research layout too; `render.yaml` uses
  `NEXTAUTH_SECRET` (the old `JWT_SECRET` key was dead config); the socket server
  joined the `turbo type-check` pipeline.

### Data & Infra

- Migrations: added then removed a redundant `ActivityLog` index after moving
  member lastActive to `ActivityLogEntry` (which already indexes userId+createdAt).
- Redis/Bull document queue actually runs: `REDIS_ENABLED` added to env files,
  `REDIS_URL` protocol typo fixed, and Bull v4 readiness now uses `isReady()`
  (Bull never emits a queue-level `ready` event, so the queue flag stayed false
  forever).
- Verification: backend + frontend lint 0 errors, `yarn type-check` green for all
  three packages, production builds succeed; member access, invite/decline
  notifications and preference enforcement verified live against the shared DB.

---

## Release 1.3.4 — Discover Live Research, Editor Alignment & Working Email Sharing (2026-09-08)

**Release date:** 2026-09-08
**Theme:** Live external research feeds in Discover, Google Docs-style text alignment,
permission-backed email sharing, analytics wiring, deployment hardening.

---

### Discover — live research (free APIs, no keys)

- **Trending Papers** (`/search/trending`): real live mix — OpenAlex recent works
  sorted by citation count (arXiv fallback) merged with accessible platform
  papers; `?limit=` supported.
- **For You** (`/search/recommendations`): real personalization — top 3 interest
  keywords from the user's paper tags + metadata drive per-keyword arXiv
  searches (OpenAlex fallback), each item annotated "Because you work on X";
  falls back to newest accessible papers when no interests exist.
- **Explore** (`/search/explore`, new): browse live arXiv submissions by 12
  whitelisted categories, paginated; unknown categories rejected with 400.
- External API calls are TTL-cached (10 min) with 10s timeouts — upstream
  failures degrade to platform data, never crash the endpoint (fixed XML-vs-JSON
  parse bug for arXiv Atom feeds).
- External cards everywhere: source badge, citation counts, "Open" to the
  original page, and **Save to Library** (reuses the import flow; auto-picks the
  user's first workspace; toast + navigate to the new paper).
- Discover landing page gained a live "Latest Research" strip (top 3 cs.AI).

### Analytics — papers read & reading time actually count

- New `POST /analytics/personal/view` records a `paper_view` UsageEvent
  (access-scoped, deduped to 1 per user+paper per 24h, workspaceId populated so
  workspace analytics finally see activity).
- Paper detail page fires the view once per paper; new `useReadingSessionTracker`
  hook starts a `reading_session` on load and closes it on unmount/tab-switch
  with minutes read; reading sessions now resolve the paper's workspaceId.
- Audited: annotation counts were already correctly wired (create + soft-delete).

### Text Editor — alignment works like Google Docs

- Fixed the permanently disabled align buttons: TipTap v3's stock
  `can().setTextAlign()` requires every configured type in the selection;
  `canSetTextAlign`/`setTextAlign` are now selection-aware (derived from the
  live extension config) — mouse-select any lines and align left/center/right/
  justify instantly.
- Alignable types extended to headings, paragraphs, **list items and
  blockquotes** (both ScholarFlowEditor and the simple template).

### Email Sharing — actually grants access (was email-only)

- New `PaperShare` model (unique paperId+email, permission view/edit,
  soft-delete) + migration applied to the shared cloud DB.
- `shareViaEmail` now persists the share (idempotent upsert re-activates) and
  sends permission-aware links — view → `/dashboard/papers/:id`, edit →
  `/dashboard/research/editor?paper=:id` (old `/papers/:id` was page-not-found).
- All paper access gates (`assertPaperAccess`, `assertEditorPaperAccess`,
  `assertEditorCanEdit`) grant access by the user's email; editor writes only
  for `edit` shares.
- New `GET /papers/:id/shares` (author/owner only) and
  `DELETE /papers/shares/:shareId`; ShareModal shows "Shared with" list with
  revoke — revocation drops access immediately (403 verified end-to-end).
- Verified live: share → recipient access → revoke → 403.

### Deployment & Reliability

- Render backend guide added to `docs/DEPLOY.md` (the app is a long-lived
  Express container — Vercel serverless breaks uploads/sockets/cron):
  `corepack enable` first (Yarn 4.9.2 pin), Node 24, root `yarn install`,
  env vars pasted in dashboard (`.env.production` is never read by the app).
- 404s now return clean JSON (`routeNotFound` responds directly), the global
  error handler is registered last, and `unhandledRejection`/`uncaughtException`
  guards keep the process alive — a bad request can no longer take the API down.
- `trust proxy` set to 1 hop (fixes express-rate-limit
  `ERR_ERL_PERMISSIVE_TRUST_PROXY` on Render/Vercel).
- Email dispatcher now falls back to SMTP/Gmail when Resend rejects a send
  (e.g. unverified gmail.com from-domain).
- Oracle Always Free docs updated to current 2 OCPU / 12 GB A1 limits.

### Docs & Repo

- AGENTS.md database section rewritten: one shared Prisma Cloud DB for local
  dev + production (no local/WSL database); hand-written migration +
  `prisma migrate deploy` path for the drift-prone shared DB.
- Production branch recreated from main (clean lineage, no conflicted merges).

---
