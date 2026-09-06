# Payment & Subscription System — Manual Browser Test Checklist

> Status: API-level E2E is green (31/31 checks, `apps/backend/e2e_admin.cjs`).
> This checklist covers the **browser-level** walkthrough that cannot be
> automated — run it before declaring the system production-ready.
>
> Environment: local dev (frontend :3000, backend :5000) with **Stripe test
> mode** (`sk_test_`). Never mix live keys.

## Prep

1. Backend running: `yarn dev:backend` (ts-node-dev hot-reloads).
2. Frontend running: `yarn dev:frontend`.
3. `stripe listen --forward-to http://localhost:5000/webhooks/stripe` in a
   terminal; copy the printed `whsec_...` into `apps/backend/.env`
   `STRIPE_WEBHOOK_SECRET`, then restart the backend.
4. Stripe test cards:
   - `4242 4242 4242 4242` — succeeds
   - `4000 0000 0000 0002` — declines (for payment-failure tests)
5. Log in as:
   - `admin@scholarflow.com` / `password123` (ADMIN)
   - `researcher@scholarflow.com` / `password123` (RESEARCHER / free)
   - `pro.researcher@scholarflow.com` / `password123` (PRO_RESEARCHER)
   - `teamlead@scholarflow.com` / `password123` (TEAM_LEAD)

---

## 1. Pricing page (`/pricing`)

- [ ] **Dynamic catalog**: prices/names come from the Plan table — edit a
      plan's price in admin (`/dashboard/admin/plans`), refresh `/pricing`,
      the card shows the new price. (Pro was $29 hardcoded; now reads the DB.)
- [ ] **Deactivated plan disappears**: toggle a plan inactive in admin →
      after refresh the plan card shows "— / Currently unavailable" and the
      CTA is disabled ("Not available"); checkout of that price is rejected
      with 400 PLAN_UNAVAILABLE.
- [ ] Unauthenticated → click a paid plan CTA → lands on `/login` with
      `callbackUrl=/pricing` → after login returns to `/pricing`.
- [ ] Authenticated → Pro CTA → Stripe hosted checkout opens (14-day trial,
      $0 first invoice, no card required).
- [ ] Cancel checkout → redirected to `/dashboard/billing/cancel` (not 404).
- [ ] Monthly/Annual toggle changes the price shown and the price ID used.
- [ ] Enterprise CTA → `/contact` (never checkout).
- [ ] Free CTA → `/dashboard`.
- [ ] FAQ copy consistent: free plan = 10 papers, 14-day trial on all paid
      plans (pricing, `/faq`, landing-page FAQ section).

## 2. Checkout → role grant (THE critical flow)

- [ ] As `researcher@...` (free): buy **Pro monthly** with `4242...`.
- [ ] Return to `/dashboard/billing?session_id=...` → "Syncing…" indicator →
      success toast → URL cleaned to `/dashboard/billing`.
- [ ] Billing page shows: plan **Pro**, badge **Active**, "Trial ends"
      (≈14 days), **Manage Subscription** button.
- [ ] Sidebar now shows Pro-only items (Citation Graph, Research Map).
- [ ] Analytics usage page (`/dashboard/(app)/analytics/usage`) unlocked.
- [ ] DB check: `User.role = PRO_RESEARCHER`, `Subscription` row ACTIVE with
      `trialEnd` set, `WebhookEvent` checkout.session.completed = processed.
- [ ] **Buy Team monthly** as a NEW free user → role becomes TEAM_LEAD,
      TEAM_LEAD dashboard sections appear.
- [ ] **Double-buy guard**: while a Pro subscription is ACTIVE, clicking a
      paid plan CTA → error toast "You already have an active subscription"
      (400 ALREADY_SUBSCRIBED) — never a second Stripe checkout.
- [ ] `stripe trigger checkout.session.completed` → recorded as `failed`
      ("Missing required metadata") but Stripe receives HTTP 200 (no retry
      storm). This is expected for CLI fixtures.

## 3. Billing page (`/dashboard/billing`) — all roles

- [ ] **RESEARCHER (free)**: shows Free plan, "Upgrade plan" button,
      upgrade card.
- [ ] **PRO_RESEARCHER / TEAM_LEAD**: NEVER shows "Upgrade plan" — always
      "Manage Subscription" + "Explore plans". (Regression: this was the
      "Pro plan shows upgrade plan" bug.)
- [ ] **PAST_DUE state**: set the subscription past due (see §5 test card
      `4000...0002`) → amber banner "Payment failed — access continues until
      {grace date}", status badge "Past due", Manage button available.
- [ ] **Canceled-at-period-end**: cancel in Stripe portal → rose card
      "Subscription canceled — access continues until {date}".
- [ ] Error state: stop the backend → billing page shows error card with
      "Try again" (never silent FREE display).

## 4. Stripe Customer Portal

- [ ] "Manage Subscription" opens the Stripe portal.
- [ ] In portal: update payment method, cancel at period end, reactivate.
- [ ] Return to the app → data refreshes (role/status/cancel state updated
      within ~30s via polling).

## 5. Payment failure / grace / downgrade (money-critical)

- [ ] Pro user, change card to `4000 0000 0000 0002` in portal, wait for
      next charge attempt (or use `stripe trigger invoice.payment_failed`).
- [ ] Notification bell shows "Payment failed" (SYSTEM notification).
- [ ] DB: `Subscription.status = PAST_DUE`, a `Payment` row with
      `status = FAILED` exists (failed-payments metric is no longer always 0).
- [ ] Billing page shows the grace banner; user KEEPS Pro role during grace.
- [ ] **Sweep test** (optional, needs DB access): backdate the subscription's
      `expiresAt` to >7 days ago → within the hourly sweep the role reverts
      to RESEARCHER and status becomes EXPIRED (or run
      `runSubscriptionSweep()` directly via ts-node).
- [ ] After downgrade: billing page shows Free + upgrade card again.

## 6. Admin panel — Subscriptions & Revenue (`/dashboard/admin/subscriptions`)

- [ ] Loads as ADMIN; MRR / ARR / Total Revenue / Active Subscribers cards.
- [ ] **Trial exclusion**: a user in a 14-day trial is NOT in MRR/ARPU/
      Active Subscribers (trial shows only in "Subscriptions by Status").
- [ ] **Revenue Trend chart** renders daily bars; tooltip shows date +
      amount; empty state when no payments in range.
- [ ] Time range selector (7d/30d/90d/1y) + Refresh button work.
- [ ] "Payment Insights": failed count matches FAILED Payment rows;
      success rate = succeeded/(succeeded+failed).
- [ ] Top Paying Customers: one row per user, total spent excludes refunds.

## 7. Admin panel — Subscribers (`/dashboard/admin/subscribers`)

- [ ] Table lists all subscriptions; status filter + pagination work.
- [ ] **Cancel at period end** (ACTIVE row) → row shows "Cancel scheduled";
      verify in Stripe dashboard the subscription has cancel_at_period_end.
- [ ] **Reactivate** → "Cancel scheduled" disappears; Stripe confirmed.
- [ ] **Change plan** → dialog lists active plans → switch Pro↔Team →
      success toast; role changes via webhook within seconds; verify the
      Stripe subscription's price changed.
- [ ] **Cancel now** → confirm dialog → subscription canceled; role reverts
      to RESEARCHER; "Canceled" badge; audit log entry.
- [ ] Audit trail: `/dashboard/admin/audit` shows `canceled_at_period_end`,
      `reactivated`, `plan_changed`, `canceled_now` entries.

## 8. Admin panel — Payments (`/dashboard/admin/payments`)

- [ ] Search by email / transaction id (300ms debounce — one request per
      pause, not per keystroke).
- [ ] Refund a SUCCEEDED payment → button shows "Refunding…" spinner →
      success toast → row becomes REFUNDED; **money actually returned**
      (check Stripe dashboard → Payments → Refunds, and the customer sees
      the refund).
- [ ] Refund button hidden on REFUNDED/FAILED/PENDING rows.
- [ ] Page shows "This page revenue" + "Total payments".
- [ ] After a refund, the Subscriptions page revenue refreshes (tag
      invalidation) without manual reload.

## 9. Admin panel — Plans (`/dashboard/admin/plans`)

- [ ] **New plan** dialog: create a test plan (code/name/price/interval) →
      card appears with interval label + short price ID.
- [ ] **Edit price** → a NEW Stripe price is created (check Stripe dashboard →
      Products → the price list shows the new amount) and the card's price
      ID changes; `/pricing` shows the new price after refresh.
- [ ] **Edit name** → Stripe product renamed (both monthly + annual variants
      share the product).
- [ ] **Checkout with edited price**: after an edit, a new user can still
      start checkout with the plan's new price ID (DB-driven validation) and
      the webhook still grants the correct role (plan-code-based mapping).
- [ ] Existing subscribers keep their price until renewal (reprice per-user
      via Subscribers → Change plan).
- [ ] **Deactivate/Activate** toggle → "Inactive" badge; deactivated plans
      vanish from `/pricing` and checkout rejects them (400 PLAN_UNAVAILABLE).
- [ ] **Delete** a plan without subscribers → removed (soft-delete);
      delete blocked for plans with ACTIVE subscribers.
- [ ] Creating a duplicate `code` → error toast.

## 10. Admin panel — Reports (`/dashboard/admin/reports`)

- [ ] Generate on a FINANCIAL report → **file downloads** (CSV/JSON) — not
      a 404 page (this was broken).
- [ ] Report row status updates to READY after generation.
- [ ] Export content matches Payment rows (amounts in dollars, includes
      refunded payments with their status).

## 11. Role guards & redirects

- [ ] As RESEARCHER/TEAM_LEAD, visiting any `/dashboard/admin/*` URL →
      redirected to `/dashboard` (no blank page) + access-denied toast.
- [ ] As ADMIN, all pages above load normally.
- [ ] Logged-out user hitting `/dashboard/billing` → `/login?callbackUrl=...`.

## 12. Idempotency / duplicate safety (API level, optional)

- [ ] Replay the same webhook payload twice → second delivery skipped
      (WebhookEvent unique on provider+eventId).
- [ ] `stripe trigger charge.refunded` → processed cleanly (dashboard
      refunds sync to local Payment rows when the charge's invoice matches).

---

## Known non-issues (verified, don't retest)

- `invoice.parent.subscription_details.subscription` is the correct
  invoice→subscription link on API `2025-09-30.clover` (docs-confirmed).
- Amount formatting is consistent (backend dollars for analytics, cents
  ÷100 on payments/plans pages).
- Single currency (USD) is a supported scope — multi-currency is not.
- `TRIALING` as a subscribers filter maps to ACTIVE (no 500).

## Sign-off gate

- [ ] All boxes above pass.
- [ ] `yarn build`, `yarn lint` (0 errors), `yarn type-check` green.
- [ ] Production deploy: set live Stripe keys + production webhook endpoint,
      re-run §2 and §5 once with live keys on a staging account.
- [ ] Rotate secrets from the earlier security incident BEFORE going live
      (Stripe live keys, AWS, NEXTAUTH_SECRET, GitHub tokens).
