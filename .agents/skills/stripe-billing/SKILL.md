# Stripe Billing Skill

## When to use this skill
Any task involving: subscriptions, plans, checkout, webhooks,
customer portal, billing dashboard, payment methods, invoices.

## Pre-task checklist
1. Read the webhook handler file first
2. Identify which Stripe events are handled
3. Check webhook signature verification is present
4. Confirm idempotency key usage

## Key patterns
Checkout: backend creates session → frontend redirects to Stripe URL
Webhook: Stripe POSTs to /api/webhook → backend verifies sig → updates DB
Portal: backend creates portal session → frontend redirects
Role sync: webhook handler updates user role in DB — this is the only path

## Critical constraints
- NEVER update subscription status from frontend
- ALWAYS call stripe.webhooks.constructEvent before processing
- ALWAYS handle these events: checkout.session.completed,
  customer.subscription.updated, customer.subscription.deleted
- Webhook handlers must be idempotent (safe to process twice)
- Test keys (sk_test_) and live keys (sk_live_) are never mixed
- Customer portal URL comes from backend endpoint only

## Files to read first
apps/backend/src/app/ → billing routes and webhook handlers
