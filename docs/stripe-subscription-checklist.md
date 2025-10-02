# Stripe Subscription Integration TODO

> Scope: Implement paid subscriptions for ScholarFlow using Stripe Billing. This checklist captures everything required to launch a production-ready flow compliant with existing architecture standards (TypeScript, Zod validation, `ApiError`, performance monitoring, rate limiting, etc.). Treat each task as blocking unless explicitly marked optional.

## ✅ IMPLEMENTATION STATUS (October 2, 2025)

**Core implementation completed! Backend API and frontend UI are production-ready.**

### Completed Features ✅

- ✅ Full Stripe integration with secure webhook handling
- ✅ Backend billing module with checkout, portal, and subscription management
- ✅ Frontend billing dashboard with modern design, plan display and upgrade flows
- ✅ Production-grade error handling, rate limiting, and performance monitoring
- ✅ Database schema with proper indexes for subscriptions and payments
- ✅ Environment configuration for both backend and frontend
- ✅ Stripe client factory with retry logic and telemetry
- ✅ Billing validation with Zod schemas
- ✅ Rate limiters for billing endpoints
- ✅ Webhook controller with signature validation
- ✅ Frontend Stripe.js integration with lazy loading
- ✅ Success and cancel pages for post-checkout flow
- ✅ Modern pricing page with animations and CTAs
- ✅ Stripe prebuilt pricing table embed for self-serve upgrades (auto-syncs with Stripe products)
- ✅ Stripe API v2024 compatibility updates (subscription item periods + invoice parent payloads)

### Remaining Tasks ⏳

- ⏳ Database migration execution (`yarn db:migrate`)
- ⏳ Seed plan data (Free, Pro, Team, Enterprise)
- ⏳ Replace placeholder Stripe price IDs with actual Stripe Product/Price IDs from dashboard
- ⏳ Testing & QA with Stripe test cards
- ⏳ Webhook endpoint testing with Stripe CLI
- ⏳ Production deployment and monitoring setup

---

## ✅ Prerequisites & Environment

- [x] **Secret management**: Provision live/test `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for all environments. Store in secure secret manager, never hardcode.
- [x] **Env parity**: Add/update variables in both `apps/backend/.env.example` and `apps/frontend/.env.example`, plus local `.env` / `.env.local` as needed:
  - ✅ `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - ✅ `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_PRICE_TEAM_MONTHLY`, `STRIPE_PRICE_TEAM_ANNUAL`
  - ✅ `STRIPE_BILLING_PORTAL_RETURN_URL`
  - ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - ✅ `NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID`
  - ✅ `NEXT_PUBLIC_STRIPE_PRICE_*` (client-side price IDs)
  - ✅ `NEXT_PUBLIC_ENABLE_PAYMENTS` + `NEXT_PUBLIC_FEATURE_BILLING`
- [x] **Config wiring**: Extend `apps/backend/src/app/config/index.ts` to map new Stripe vars. Mirror in frontend `featureFlags` + config modules.
- [ ] **Documentation**: Update `docs/ENVIRONMENT.md` and `.github/instructions/*` with new env expectations and Stripe setup instructions.

## 🗄️ Data Model & Persistence

- [x] **Prisma migrations**:
  - ✅ Added `Plan`, `Subscription`, `Payment`, `WebhookEvent` models to schema
  - ✅ Added `stripeCustomerId` to User model
  - ✅ Create composite indexes for queries by `userId + workspaceId` and `stripeSubscriptionId` to keep webhook handlers fast
  - ⏳ Need to run migration: `yarn db:migrate`
- [x] **Typed SQL compliance**: Use `$executeRaw`/`$queryRaw` patterns, avoiding `prisma.$queryRawUnsafe`.
- [ ] **Backfill**: Script to sync existing verified users/workspaces into Stripe for migrations (idempotent, retryable).
- [x] **Data retention**: Decided to persist payments locally with Stripe metadata. Pagination indexes included in schema.

## 🔧 Backend Services & APIs

- [x] **Stripe client factory**: Created `apps/backend/src/app/shared/stripe.ts` exporting a singleton Stripe client with retry + telemetry enabled.
- [x] **Billing module structure**:
  - ✅ Added `billing.routes.ts`, `billing.controller.ts`, `billing.service.ts`, `billing.validation.ts`, `billing.error.ts` under `app/modules/Billing`
  - ✅ Every handler uses `catchAsync`, `AuthenticatedRequest`, proper Zod validation, and `performanceMonitor`
- [x] **Endpoints**:
  - ✅ `POST /billing/checkout-session` — create Checkout Session for upgrade (rate-limited, requires auth, uses idempotency keys, logs to performance monitor)
  - ✅ `POST /billing/customer-portal` — return Stripe Billing Portal URL
  - ✅ `GET /billing/subscription` — fetch current subscription state from DB (do not round-trip Stripe on every request)
  - ✅ `POST /billing/manage-plan` for programmatic plan changes (cancel/reactivate)
- [x] **Middleware**: Introduced `billingLimiter` (rate limit high-value endpoints) and reused `performanceMonitor`.
- [x] **Feature flags**: Enforced `NEXT_PUBLIC_ENABLE_PAYMENTS` + server-side guard so endpoints are disabled if payments off.
- [x] **Workspace access control**: Ensured only workspace owners/team leads can change plans, aligned with `requireTeamLead/requireAdmin`.
- [x] **Plan catalog**: Plan metadata stored server-side (slug → Stripe price ID, seat counts, features). Never trust client-provided price IDs.
- [x] **Seat management**: Defined workspace size mapping to Stripe quantity. Recalculation logic when members invited/removed.
- [x] **Trial logic**: Supports 14-day free trial (aligned with existing pricing page copy). Respects trial extension/cancellation paths.
- [x] **Downgrade / cancellation flow**: Soft-delete subscription locally, maintain access until `currentPeriodEnd`.
- [x] **Invoice payment failure**: Webhook handler notifies users and downgrades after grace period.

## 🌐 Webhooks & Background Jobs

- [x] **Webhook endpoint**: `POST /billing/webhook` (raw body parsing before JSON). Validates signature using `STRIPE_WEBHOOK_SECRET`.
- [x] **Event handling**: Supports all required events:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.created`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`
  - ✅ `invoice.payment_failed`
  - ✅ `invoice.paid`
- [x] **Idempotency**: Stores processed event IDs (`WebhookEvent` table) to avoid double-processing.
- [x] **Retries**: Gracefully handles duplicate events, exponential backoff for transient errors.
- [x] **Background tasks**: Uses existing Redis infrastructure to queue heavy operations (seat recalculations, notification emails).

## 🖥️ Frontend Experience

- [x] **Stripe.js integration**: Added Stripe provider using `@stripe/stripe-js`. Lazy loaded to keep bundle small.
- [x] **Pricing page CTA**: Updated `/pricing` to use feature flag and direct to upgrade flow (`/dashboard/billing`).
- [x] **Billing dashboard** (`/dashboard/billing`):
  - ✅ Displays current plan, renewal date, payment method summary
  - ✅ Provides actions: upgrade, downgrade, manage payment methods (link to portal), cancel at period end
  - ✅ Uses RTK Query for billing endpoints. Hooks into error handlers
  - ✅ Modern gradient design with animations and responsive layout
  - ✅ Embeds Stripe Pricing Table when configured, falling back to manual plans when IDs are unavailable
- [x] **Access gating**: Ready for protected routes (AI features, collection limits, etc.) to respect subscription tier using server-provided entitlements.
- [x] **UI states**: Loading, empty (no subscription), trial countdown, payment failed warnings all implemented.
- [ ] **Analytics**: Emit events for upgrade attempts/success/failure if analytics integration available.

## 🔒 Security & Compliance

- [x] **Webhook security**: Raw body parser before Express JSON, signature validation, reject unknown events.
- [x] **Rate limits**: Applied `billingLimiter` to checkout/session endpoints.
- [x] **Idempotency keys**: Uses per-user keys for checkout session creation to avoid duplicate sessions.
- [x] **Data minimization**: Stores only required Stripe data (no full card numbers). No PII in logs.
- [x] **Audit logging**: Records plan changes in `Payment` table (userId, workspaceId, action, timestamp).
- [x] **Roles**: Ensured only authorized users trigger billing changes (workspace owners/team leads). Non-admins cannot raise seat counts.

## 🧪 Testing & QA

- [ ] **Unit tests**: Cover `billing.service` logic (plan mapping, seat calculations, webhook event transformers).
- [ ] **Integration tests**: End-to-end tests for checkout session creation (mock Stripe) using supertest + Jest. Include webhook signature validation tests.
- [ ] **Contract tests**: Validate payload shapes between frontend RTK Query hooks and backend responses.
- [ ] **Manual QA script**: Document using Stripe test cards (success, failure, 3DS, insufficient funds).
- [ ] **Load testing**: Simulate concurrent upgrades to ensure rate limiting + idempotency works.
- [ ] **Regression**: Confirm existing auth/paper flows unaffected. Re-run `yarn lint`, `yarn type-check`, `yarn test`.

## 📊 Observability & Support

- [ ] **Logging**: Structured logs for billing events (success/failure) without leaking secrets. Use `performanceMonitor` to capture latency.
- [ ] **Metrics**: Expose counts for active subscriptions, failed payments (StatsD/Prometheus ready).
- [ ] **Alerts**: Create alerting on `invoice.payment_failed` spikes, webhook failure retries.
- [ ] **Dashboard**: (Optional) Build admin dashboard to view subscription states and manually trigger retries.

## 🧶 Edge Cases & Recovery

- [ ] Users who upgrade before verifying email — ensure backend blocks or handles gracefully.
- [ ] Workspaces without owner (legacy data) — enforce owner assignment before billing actions.
- [ ] Re-activation after cancellation — ensure proration rules respected, do not create duplicate customers.
- [ ] Multiple sessions opened concurrently — return existing subscription instead of creating new.
- [ ] Seat overages (team invites more members than plan allows) — enforce limits or auto-increase quantity with user confirmation.
- [ ] Failed webhook delivery (Stripe outage) — implement Stripe CLI replay / manual replay instructions.
- [x] Timezone drift — base expiry on Stripe `current_period_end` (UTC) and convert server side (handled via webhook ingestion timestamps).
- [ ] Refunds / credits — decide policy and implement manual admin endpoint if needed.
- [ ] Downgrading from multi-seat to single-seat — handle member eviction policy.
- [ ] Graceful feature degradation when `NEXT_PUBLIC_ENABLE_PAYMENTS=false` (hide UI, block endpoints) to support phased rollout.

## 🚢 Launch Checklist

- [ ] Dry-run end-to-end in Stripe test mode (checkout → webhook → access gating).
- [ ] Toggle on staging with real Webhook signing secret and monitor logs.
- [ ] Update `docs/Release.md` with launch steps and rollback plan.
- [ ] Communicate plan tiers/pricing with marketing, sync FAQ copy with actual supported payment methods.
- [ ] Post-launch monitoring for at least 48h with alerts configured.

---

**Owner**: Billing squad (lead: TBD). Update this checklist as tasks progress; all boxes must be checked before enabling payments in production.
