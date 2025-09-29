# ScholarFlow AI Integration Playbook

> Comprehensive step-by-step TODO guide for introducing large-language-model powered experiences across the ScholarFlow platform. This document aligns with the current monorepo architecture (Next.js 15 frontend + Express/Prisma backend) and the UI/UX system described in `README.md`, `docs/DEVELOPMENT.md`, and `docs/UI_DESIGN.md`.

---

## 📌 Goals

- Deliver consistent AI-assisted researcher workflows (metadata extraction, summarisation, recommendations).
- Support multiple model providers (OpenAI, Gemini, DeepSeek) with easy swapping/fallback.
- Preserve ScholarFlow's production-grade standards (security, performance, reliability).
- Provide a clear TODO roadmap for engineers, designers, and product stakeholders.

---

## 🧱 Architecture Snapshot

| Layer                                                  | Current Design                                                                      | AI Integration Focus                                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend (Next.js 15, App Router)**                  | Tailwind + ShadCN UI, Redux Toolkit Query, NextAuth                                 | AI UI components (assistant panel, metadata chips), optimistic updates, toast-driven feedback, accessibility. |
| **Backend (Express + Prisma + PostgreSQL + pgvector)** | Modular controllers/services, raw SQL via `$queryRaw`, Zod validation, typed errors | Provider-agnostic AI service layer, task queue triggers, embeddings pipeline, rate-limited APIs.              |
| **Shared**                                             | Yarn Berry, Turborepo, monitored health endpoints, performance middleware           | Central config for AI providers, tracing/metrics for prompts & costs, feature flags.                          |
| **DevOps**                                             | Vercel frontend, Railway/Render backend, S3 storage, Redis jobs                     | Secrets management, canary deploys, usage monitoring, rollback strategy.                                      |

### High-Level Flow

1. **Trigger** (user uploads paper / requests summary / asks assistant).
2. **Frontend UX** shows intent capture (form, command palette) and initiates RTK Query mutation.
3. **Backend Controller** validates request (`validateRequest`, `AuthenticatedRequest`), forwards to AI Orchestrator.
4. **AI Orchestrator** selects provider (OpenAI → Gemini → DeepSeek fallback), manages prompt, embeds results, persists metadata.
5. **Response** returns typed payload to frontend; UI renders with success/error toasts, optional streaming updates.

---

## 🔐 Environment & Configuration Checklist

Keep `.env.example` in sync for both apps whenever variables change.

| Variable                           | Scope    | Purpose                                                         | Status                   |
| ---------------------------------- | -------- | --------------------------------------------------------------- | ------------------------ |
| `OPENAI_API_KEY`                   | Backend  | Default provider for embeddings, summarisation, recommendations | ✅ Added                 |
| `GEMINI_API_KEY`                   | Backend  | Secondary provider for multimodal prompts or fallback           | ✅ Added (needs value)   |
| `DEEPSEAK_API_KEY`                 | Backend  | Cost-effective fallback provider (text-only)                    | ✅ Added                 |
| `AI_PROVIDER_FALLBACK_ORDER`       | Backend  | Comma-separated order (`openai,gemini,deepseek`)                | ✅ Added                 |
| `AI_FEATURES_ENABLED`              | Both     | Feature-flag for gating AI endpoints/UI                         | ✅ Added                 |
| `AI_REQUEST_TIMEOUT_MS`            | Backend  | Hard cap to avoid hanging calls                                 | ✅ Added (default 15000) |
| `NEXT_PUBLIC_AI_ASSISTANT_ENABLED` | Frontend | Toggle UI components without redeploy                           | ✅ Added                 |

**TODO:**

- [x] Update `apps/backend/src/app/config/index.ts` to expose new AI config keys.
- [ ] Extend `docs/ENVIRONMENT.md` with provider instructions and rate limits.
- [ ] Store production secrets in Vercel/Railway dashboards, never in repo.

---

## 🧠 Backend Integration Roadmap

### 1. Core AI Service Layer

- [ ] Create `apps/backend/src/app/modules/ai/ai.service.ts` with provider-agnostic interface (`generateSummary`, `extractMetadata`, `embedText`).
- [ ] Define provider adapters (`openai.provider.ts`, `gemini.provider.ts`, `deepseek.provider.ts`) using Zod to validate responses.
- [ ] Implement round-robin/fallback strategy respecting `AI_PROVIDER_FALLBACK_ORDER` and per-provider timeout.
- [ ] Add structured logging (`performanceMonitor`, request/response size, provider cost estimates) and redact prompt sensitive content.

### 2. Feature Hooks

- [ ] **Metadata Extraction:** integrate service into existing paper upload pipeline (after S3 upload). Persist to `PaperMetadata` table via `$executeRaw` with upsert.
- [ ] **Summaries & Highlights:** create `/api/papers/:id/summary` endpoint (rate-limited by `paperOperationLimiter`). Cache results in Redis for 1h.
- [ ] **Recommendation Engine:** background job to compute related papers using vector similarity (`pgvector`). Store embeddings in `PaperEmbedding` table.

### 3. Resilience & Observability

- [ ] Add circuit breaker thresholds (3 consecutive failures → temporary provider skip).
- [ ] Emit metrics (`X-Response-Time`, custom `X-AI-Provider` headers) for Grafana/DataDog ingestion.
- [ ] Write integration tests (Jest + Supertest) with provider mocks.
- [ ] Document runbooks in `docs/ERROR_HANDLING.md` for AI-specific errors (429, 5xx, invalid response schema).

---

## 🎨 Frontend & UI/UX TODOs

### 1. Discovery & Researcher UX

- [ ] Add AI Assistant entry points in dashboard (`app/(authenticated)/dashboard/page.tsx`): command palette button + contextual suggestion cards.
- [ ] Design ShadCN-based modals for "Summarise Paper", "Generate Research Questions", with clear states (loading, success, retry).
- [ ] Use `useMutationErrorHandler` + `showApiErrorToast` for consistent feedback.
- [ ] Provide skeleton loaders while AI responses stream; fallback message when feature disabled (respect `NEXT_PUBLIC_AI_ASSISTANT_ENABLED`).

### 2. Forms & Validation

- [ ] Extend `apps/frontend/src/lib/validators.ts` with schemas for AI prompts (max length, language selection, tone).
- [ ] Build reusable `AIModelSelector` component for future provider choices; default hidden unless feature flag enabled.
- [ ] Ensure accessibility (ARIA live regions for streaming text, keyboard-friendly controls).

### 3. State & Data Fetching

- [ ] Add RTK Query endpoints under `apiSlice.ai` (e.g., `generateSummary`, `askAssistant`). Implement automatic retries for 502/503, no retry for 4xx.
- [ ] Cache recent AI responses in Redux store for offline recall and analytics.
- [ ] Add optimistic UI when submitting prompts; allow cancelation via AbortController.

### 4. Visual & Interaction Design

- [ ] Update `docs/UI_DESIGN.md` with AI component patterns, illustrating light/dark mode variants.
- [ ] Collaborate with design to craft iconography for provider badges (OpenAI/Gemini/DeepSeek).
- [ ] Incorporate micro-interactions (typing indicator, progress bar) consistent with existing motion tokens.

---

## 🔄 Data & Model Lifecycle

1. **Embedding Pipeline**
   - [ ] Create Prisma migration for `PaperEmbedding` table with `vector` column (1536 dims for OpenAI `text-embedding-3-small`).
   - [ ] Background worker (Redis queue) to re-embed papers when metadata updates or provider changes.
   - [ ] Expose `/api/papers/:id/related` endpoint leveraging cosine similarity.

2. **Prompt Templates**
   - [ ] Store versioned prompt templates in `apps/backend/src/app/modules/ai/prompts/`. Use Markdown + placeholders.
   - [ ] Add admin UI to tweak prompt weights (Phase 2).

3. **Cost Tracking**
   - [ ] Log token usage per request; schedule nightly job to aggregate costs per workspace.
   - [ ] Surface cost dashboards (Phase 3) once usage stabilises.

---

## 🛡️ Security & Compliance Checklist

- [ ] Never log raw prompts/responses that may contain PII.
- [ ] Mask API keys in all logs, ensure `NODE_ENV !== "production"` before emitting debug output.
- [ ] Enforce role-based permissions (only workspace members with `canUseAI` flag can access certain endpoints).
- [ ] Add rate limiting for AI endpoints (tight thresholds, e.g., 20 req/min per user).
- [ ] Evaluate data residency requirements; document provider regions and compliance posture.
- [ ] Add privacy notice update explaining AI usage and opt-out choices.

---

## 🧪 Testing Strategy

- [ ] Unit tests for provider adapters (simulated API responses, throttle behaviour).
- [ ] Contract tests using recorded fixtures (VCR-style) stored under `apps/backend/src/__tests__/fixtures/ai/`.
- [ ] E2E tests (Playwright/Cypress) covering submit → loading → success/failure flows.
- [ ] UX regression tests to ensure accessible focus order and keyboard support.
- [ ] Load tests for AI endpoints using k6/Artillery with mock providers to verify rate limits and timeouts.

---

## 🚀 Deployment & Ops

- [ ] Configure staged rollout (feature flag + canary environment) before global enablement.
- [ ] Add observability dashboards (latency, error %, cost per provider, request volume per workspace).
- [ ] Document rollback plan (disable flag, clear queues, invalidate caches).
- [ ] Create on-call playbook for common AI incidents (provider outage, latency spike, malformed response).

---

## 📅 Suggested Milestones

1. **Milestone A – Foundations (1 sprint)**
   - Config keys, provider adapters, metadata extraction.
2. **Milestone B – User-Facing MVP (1 sprint)**
   - Summary endpoint, frontend UI, assistant modal, logging/metrics.
3. **Milestone C – Intelligence Layer (2 sprints)**
   - Recommendations, embeddings, cost tracking, admin tooling.
4. **Milestone D – Optimisation & Compliance (ongoing)**
   - Fine-tune prompts, add analytics, expand provider list, user feedback loops.

---

## 📎 Reference Artifacts

- `README.md` — high-level product overview.
- `docs/ERROR_HANDLING.md` — update with AI error taxonomy.
- `docs/UI_DESIGN.md` — expand with AI component guidelines.
- `apps/backend/src/app/config/index.ts` — central config; ensure new vars added here.
- `apps/frontend/src/lib/validators.ts` — extend for AI prompt validation.

---

## ✅ Completion Definition

An AI feature is considered production-ready only when:

- [ ] Feature flag guards are in place across backend + frontend.
- [ ] Load tests demonstrate <2s p95 latency and <1% error rate for the targeted workflow.
- [ ] Observability dashboards and alerting thresholds configured.
- [ ] Security review completed (secrets, data handling, PII audit).
- [ ] UX copy, empty states, and accessibility verified by design QA.
- [ ] Documentation updated (this playbook, `docs/ENVIRONMENT.md`, release notes).

---

## 📣 Notes for Collaborators

- Keep branches focused (one AI feature per PR) and follow conventional commits.
- Include sample prompt/response payloads in PR descriptions for reviewer context.
- Coordinate with product/design for user research before exposing AI features widely.
- Gather anonymised feedback through in-app surveys once assistant ships.

---

Need changes or clarifications? Open a conversation in `#ai-integrations` or file an issue with the `ai` label.
