# Scholar-Flow UI / UX Design Blueprint

Status: Phase 1 (MVP) in progress  
Audience: Designers, Frontend engineers, Product  
Source Inputs: Existing `README.md`, `.cursor/rules`, `.github/copilot-instructions.md`, project roadmap, and detailed page specs provided by product.

This document translates product & roadmap intent into an implementable UI / UX plan, sequenced by Phases (1–3) to keep scope controlled. It also embeds guard‑rails so Cursor / Copilot and contributors understand priorities, naming, and interaction patterns.

---

## 1. Core Design System & Foundations

| Aspect        | Decision (MVP)                                                                        | Notes / Future Evolution                                          |
| ------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Framework     | Next.js 15 App Router (RSC-first)                                                     | Keep client components minimal; server fetch for data-heavy pages |
| Styling       | Tailwind CSS + ShadCN UI                                                              | Introduce design tokens layer (CSS vars) Phase 2 for theming      |
| Icons         | Lucide (via ShadCN) + Custom domain icons                                             | Add semantic search, vector icon, citation graph icon             |
| Typography    | System font stack (Phase 1)                                                           | Move to custom variable font Phase 2                              |
| Color Tokens  | `--bg`, `--fg`, `--accent`, annotation highlight scales                               | Ensure WCAG AA; export palette doc                                |
| Layout Grid   | 12-column desktop; 3-column composite (Sidebar / Main / Aux)                          | Collapses to single column mobile                                 |
| Breakpoints   | sm (640), md (768), lg (1024), xl (1280), 2xl (1536)                                  | Keep ≤3 layout shifts                                             |
| State Mgmt    | RTK Query per resource + lightweight slices (`auth`, `ui`, `search`, `notifications`) | Avoid over‑nesting; Phase 2 add entity adapters for lists         |
| Motion        | Reduced by default; subtle opacity/scale for modals, annotation pulse                 | Phase 2 add presence transitions                                  |
| Accessibility | Keyboard-first, focus rings visible, semantic landmarks                               | Audit each new page before merge                                  |
| i18n          | Deferred; structure strings map early                                                 | Phase 2 integrate `next-intl`                                     |

### Foundational Components (Phase 1 delivery)

- Sidebar (collapsible): nav groups, active state, responsive collapse logic
- Top Header: global search trigger, quick actions, notifications, user menu
- Global Search Command Palette (`cmd/ctrl + k`)

- Toast System (ShadCN `useToast` wrapper + slice integration for cross-page events)
- Skeleton + Progress indicators (upload, AI summarization placeholder)

- Modal / Drawer primitives (reuse ShadCN)
- FAB (mobile only) with contextual actions (Upload / Annotate)

### Naming Conventions

`/src/app/(app)/...` for authenticated areas (optional segmentation)

Component directories: `components/layout`, `components/navigation`, `components/papers`, `components/collections`, `components/graph`, `components/search`, `components/billing`, `components/admin`  
State slices: `store/slices/uiSlice.ts`, `authSlice.ts` etc. (Consider collocating RTK Query APIs inside `store/api/` – already present.)

## 2. Role / Permission Driven Visibility

| Role | Phase 1 | Phase 2 | Phase 3 |
| ---- | ------- | ------- | ------- |

Sidebar & Command Palette dynamically filter restricted routes. Re-render on auth state change.

---

## 3. Page Inventory Sequenced by Phases

### Phase 1 (MVP: Weeks 1–6)

Focus: Auth, Upload foundation, Basic Collections, Paper reading base, minimal dashboard.

| Priority | Page / Surface | Purpose | Core Components | API (initial) | Notes |
| -------- | -------------- | ------- | --------------- | ------------- | ----- |

| P0 | Landing (Marketing) | Conversion | Hero, FeatureCards, Pricing, Footer | Static | Can remain static until SEO iteration |
| P0 | Auth (Signup/Login/Reset/OAuth) | Access | AuthForms, OAuthButtons | `/auth/*` (backend or Supabase) | Form validation (Zod) |
| P0 | Onboarding Flow (Wizard) | First value | Stepper, UploadWidget, CollectionCreate | `/papers/upload`, `/collections` | Persist progress in `localStorage` |
| P0 | Dashboard (Lite) | Recent + Quick actions | RecentPapersList, QuickTiles, UploadCTA | `/papers?sort=recent` | AI suggestions deferred |
| P0 | Papers Library (List) | Browse & open | FiltersBar, PapersTable, EmptyState | `/papers` | Semantic toggle UI present but disabled flag |
| P0 | Paper Detail / Reader (Basic) | Read + annotate stub | PDFViewer (embed), MetadataHeader | `/papers/:id` | Annotations panel placeholder component |
| P1 | Collections List + Detail (Basic) | Grouping | CollectionsList, CollectionDetail | `/collections`, `/collections/:id` | Invitations deferred |
| P1 | Upload / Import (Basic) | Add content | UploadArea, ImportByDOIForm | `/papers/upload` | External source import deferred |
| P1 | Settings / Profile (Basic) | Edit profile | ProfileForm | `/me` | Integrations deferred |
| P2 (defer) | Global Semantic Search Page | (Flagged) | SearchBar, ResultsList, SimilarPanel | `/search/semantic` | Hidden until embeddings ready |

### Phase 2 (Advanced Collaboration & Intelligence)

Adds semantic search, shared collections, citation graph, expanded annotations.

| New / Expanded | Page / Surface                   | Enhancements                                                           |
| -------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Expanded       | Dashboard                        | AI recommendations, Timeline widget                                    |
| Expanded       | Paper Detail                     | Full annotations, comment threads, AI summarize / citation suggestions |
| New            | Semantic Search / Discovery      | Vector search UI, refinement chips, similarity scores                  |
| New            | Citation Graph                   | Interactive graph canvas + node detail panel                           |
| New            | Annotations History & Versioning | Version timeline, diff viewer                                          |
| New            | Team / Workspace Management      | Workspace list, member roles, invites                                  |
| Expanded       | Collections Detail               | Activity feed, invitations, permission badges                          |

### Phase 3 (Monetization, Admin, Integrations)

| Area         | Page / Surface         | Focus                                                |
| ------------ | ---------------------- | ---------------------------------------------------- |
| Billing      | Subscription & Billing | Plan upgrade, payment history, invoices              |
| Admin        | Admin Dashboard        | User management, metrics, logs                       |
| Integrations | External Imports       | arXiv / OpenAlex / CrossRef API forms & job statuses |
| AI Assistant | Chat with Papers       | Multi-doc QA (scoped)                                |
| Data         | Export & GDPR          | Account export, deletion workflow                    |

---

## 4. Component Architecture Mapping

| Category   | Components (Phase 1)                                                        | Later Additions                                            |
| ---------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Navigation | `Sidebar`, `NavItem`, `TopHeader`, `CommandPalette`                         | `WorkspaceSwitcher` (Phase 2)                              |
| Papers     | `PapersTable`, `PaperRow`, `PaperFilters`, `PaperDetailHeader`, `PDFViewer` | `AnnotationsPanel`, `AIActionBar`, `SemanticSnippet`       |
| Forms      | `AuthForm`, `SignupForm`, `UploadForm`, `ProfileForm`                       | `InviteMemberForm`, `BillingPortalLink`                    |
| Feedback   | `Toast`, `InlineError`, `LoadingSkeleton`, `ProgressBar`                    | `QuotaWarning`, `SemanticSearchBadge`                      |
| Search     | (placeholder toggle in library)                                             | `SemanticSearchBar`, `SearchResultItem`, `SimilarityScore` |
| Graph      | (deferred)                                                                  | `CitationGraphCanvas`, `GraphNodePanel`, `GraphControls`   |
| Billing    | (deferred)                                                                  | `PlanCard`, `UpgradeModal`, `InvoiceTable`                 |

---

## 5. State & Data Strategy

RTK Query APIs (prefix suggestion):

- `papersApi`: list, detail, upload mutation
- `collectionsApi`: list, create, add paper
- `authApi`: login, signup, profile fetch (hydrate `authSlice`)
- `userApi`: (future) for profile / preferences if separated

Slices:

- `auth`: `{ user, status, error }`
- `ui`: `{ sidebarCollapsed, theme, toasts[], commandPaletteOpen }`
- `notifications`: list + read state (Phase 2)

Persistence: Use `redux-persist` (or manual localStorage) only for lightweight keys: `theme`, `sidebarCollapsed`. Do NOT persist access tokens in localStorage if migrating to HTTP-only cookies (recommended).

---

## 6. Accessibility & Inclusive Design Checklist (Phase 1 Targets)

| Item                                                    | Status Goal           |
| ------------------------------------------------------- | --------------------- |
| Keyboard navigation across sidebar/header/forms         | 100%                  |
| Focus visible for interactive elements                  | 100%                  |
| Color contrast min 4.5:1 text, 3:1 UI icons             | Verified before merge |
| ARIA labels: Buttons (Upload, Search, Collapse Sidebar) | Required              |
| Motion reduced: `prefers-reduced-motion` respected      | Basic                 |

```bash
FEATURE_SEMANTIC_SEARCH=false
FEATURE_ANNOTATIONS=false
FEATURE_BILLING=false
```

Wrap deferred UI with small utility: `if (!isFeatureEnabled('SEMANTIC_SEARCH')) return null;`

---

## 8. Routing Plan (App Router)

Suggested structure (Phase 1 realized subset):

```bash
app/
  (marketing)/page.tsx                # Landing
  auth/
    login/page.tsx
    signup/page.tsx
    reset/page.tsx
  dashboard/page.tsx
  papers/
    page.tsx                          # Library
    [paperId]/page.tsx                # Reader
  collections/
    page.tsx
    [collectionId]/page.tsx
  upload/page.tsx
  settings/profile/page.tsx
  search/semantic/page.tsx            # (flagged)
  graph/[paperId]/page.tsx            # (deferred)
  billing/page.tsx                    # (Phase 3)
```

---

## 9. UX Micro-Patterns

- Upload: show optimistic row (status: Processing) then replace when server completes.
- Skeletons: Papers list (rows), Reader (page placeholders) while loading.
- Command Palette: fuzzy search across (Papers, Collections, Actions) – Phase 2 expanded dataset.
- Annotation Creation: highlight pulse animation (prefers-reduced-motion aware).
- Error Surfaces: Inline + toast dual strategy for destructive failures.

---

## 10. Analytics & Telemetry (Instrumentation Points)

Phase 1 events: `auth_login_success`, `paper_upload_started`, `paper_upload_completed`, `collection_created`, `onboarding_completed`, `paper_opened`.

---

## 11. Risk & Edge Case Mitigation

| Area                    | Risk                 | Mitigation                                 |
| ----------------------- | -------------------- | ------------------------------------------ |
| Large PDF               | Memory / slow render | Paginate viewer, lazy page canvas load     |
| Upload Failures         | User abandons        | Retry CTA + background job status poll     |
| State Drift             | Unsynced flags       | Central `featureFlags` module + type       |
| Annotation Scale        | Performance          | Virtualize list (Phase 2)                  |
| Semantic Search Latency | UX freeze            | Show streaming skeleton / progressive list |

---

## 12. Improvements vs Original Specification

Enhancements introduced here:

1. Formal feature flags to shield in-progress surfaces.
2. Structured component taxonomy for predictable imports & tree-shaking.
3. Accessibility checklist embedded from start (not an afterthought).
4. Analytics phased event map (prevents ad-hoc naming).
5. Routing layout plan ensures marketing vs app separation.
6. Risk table to anticipate performance & UX pitfalls early.
7. Naming standard for slices & APIs to align Copilot & Cursor generation.

---

## 13. Alignment with `.cursor` & Copilot Instructions

- Roadmap Discipline: Pages mapped explicitly to Phase 1/2/3; discourage off-phase merges.
- Typed SQL & Backend Limits: Semantic search & citation graph gated until embeddings infra stable.
- PgVector Feature Flag: UI uses `FEATURE_SEMANTIC_SEARCH` to avoid premature coupling.
- Quality Gates: Each shipped page requires lint + basic hydration test (smoke) before enabling link.
- Observability: Track minimal core events early to validate adoption.

Developers using Cursor / Copilot should reference this file before scaffolding new routes— auto-suggested filenames should follow the routing plan and component domains above.

---

## 14. Consistency & File Structure Review (Current Repo Notes)

Observed backend has both `src/app/routes` and `src/routes` – consider consolidating to a single routing entry to reduce confusion when mirroring frontend paths (recommended: keep `src/app/...` for modular feature pattern).  
Frontend currently minimal; add `components/layout` & `components/navigation` directories before expanding.  
Introduce `.env.example` entries for feature flags (see Section 7).  
Ensure `README.md` cross-links to this document (Add "UI Design Blueprint" section).  
Add a short badge or note in root README indicating current UI phase status.

---

## 15. Delivery Checklist (Phase 1 UI)

| Item                            | Status | Notes                            |
| ------------------------------- | ------ | -------------------------------- |
| Sidebar + Collapse Behaviour    | ☐      | Keyboard + ARIA support          |
| Top Header + User Menu          | ☐      | Avatar fallback initials         |
| Auth Pages (Login/Signup/Reset) | ☐      | Form validation messages         |
| Onboarding Wizard (2–3 steps)   | ☐      | Persist partial progress         |
| Upload Page (PDF only)          | ☐      | Drag-drop + size/type validation |
| Papers List (Keyword search)    | ☐      | Semantic toggle disabled tooltip |
| Paper Detail (Basic PDF embed)  | ☐      | Placeholder for annotations      |
| Collections List & Detail       | ☐      | Create + add paper action        |
| Profile Settings (Name/Avatar)  | ☐      | Avatar upload or placeholder     |
| Feature Flags Plumbed           | ☐      | `.env` + utility module          |
| Analytics Stub                  | ☐      | `track()` util + console log     |
| Accessibility Pass (Core pages) | ☐      | Keyboard script test             |

---

## 16. Next Steps After Phase 1 Freeze

1. Instrument real semantic search once embeddings + pgvector stable.
2. Expand annotation model & implement panel + real-time sync (WebSocket / Supabase Realtime).
3. Add citation graph canvas with progressive node loading + clustering.
4. Introduce billing flows; integrate Stripe portal link.
5. Add admin-focused metrics & user moderation UI.
6. Introduce design token extraction script (build-time) for theming.
7. Integrate i18n scaffolding to isolate strings early Phase 2.

---

## 17. Contributing Guidelines (UI Scope)

- Adhere to phase boundaries; off-phase features require product signoff.
- Every new component: include Story or at least a minimal usage doc (Phase 2 requirement; optional Phase 1 for core primitives).
- Avoid premature abstraction; duplicate small patterns twice before generalizing.
- Keep client components lean— server fetch where possible.
- Ensure dark mode readiness by using semantic Tailwind classes (`bg-background`, `text-foreground`, etc.) if tokenized.

---

## 18. Glossary

| Term            | Definition                                                      |
| --------------- | --------------------------------------------------------------- |
| Semantic Search | Vector-based retrieval using embeddings (pgvector)              |
| Collection      | User or team grouping of papers with metadata & permissions     |
| Annotation      | Highlight + optional threaded comment anchored to paper content |
| Citation Graph  | Network visualization of paper citation relationships           |

---

## 19. Change Log

| Date       | Change                     | Author        |
| ---------- | -------------------------- | ------------- |
| 2025-08-19 | Initial blueprint creation | Copilot Agent |

---

Questions or proposals for deviation: open issue with label `ui-design` referencing section number.
