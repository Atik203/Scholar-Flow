# Stripe Product Catalog & Webhook Setup (ShipFast Demo Inspired)

This guide shows how to reproduce the Stripe workflow demonstrated in [marclou/stripe-sub](https://github.com/marclou/stripe-sub) while keeping the amount of custom code to a minimum. It focuses on configuring Stripe (Product Catalog, Checkout, and Webhooks) so it can be slotted into the existing ScholarFlow billing module.

> **Scope**
>
> - Stripe Product Catalog with recurring prices
> - Hosted Checkout Sessions that create subscriptions
> - Webhook endpoint (mirrors `app/api/webhook/stripe/route.js` in the demo)
> - Notes for test vs production

---

## 1. Prerequisites

- Stripe account with "Test mode" enabled.
- Stripe CLI installed (<https://stripe.com/docs/stripe-cli#install>). Used to generate webhook signing secrets and forward events to `localhost`.
- Access to the ScholarFlow repository (or the ShipFast demo) for the webhook handler.
- Node.js v18+ and Yarn Berry already set up for local development.

Optional but recommended:

- `stripe-mock` or API request logs open in the Stripe dashboard for debugging.

---

## 2. Configure the Product Catalog

1. **Create Products**
   - Go to **Stripe Dashboard → Product Catalog → + Add product**.
   - Mirror the plans you want to expose in the app (for example `ScholarFlow Pro`, `ScholarFlow Team`).
   - Upload marketing copy and icons if you want them to appear in Stripe-hosted checkout.

2. **Add Recurring Prices**
   - For each product, add at least one recurring price (monthly/annual).
   - Set **Billing period** to `Monthly` or `Yearly` and choose the `Standard pricing` model.
   - Toggle **Trial period** if you offer one (e.g. 14 days).
   - Press **Save price** and note the generated `price_...` ID. You can add multiple prices to the same product.

3. **(Optional) Assign price metadata**
   - If you need to differentiate tiers in your code, add metadata (e.g. `planTier=pro`, `interval=monthly`).
   - Metadata is available in the webhook payload (`session.line_items.data[].price.metadata`).

---

## 3. Enable Stripe-hosted Pricing Table (optional but convenient)

If you plan to embed the Pricing Table iframe like in ScholarFlow:

1. Navigate to **Payments → Products → Pricing tables** and click **Create pricing table**.
2. Choose the recently created products/prices and configure the layout.
3. Enable **Collect customer emails** and **Allow promotion codes** if desired.
4. Copy the `pricing_table_...` ID for `NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID`.

> ⚠️ Pricing tables must be hosted in a top-level browsing context. Wrapping the billing page with `DashboardLayout` keeps the iframe in the main document so the Payment Request API isn’t blocked.

---

## 4. Configure Customer Portal (optional)

If you want Stripe to manage upgrades/downgrades:

1. **Billing → Customer Portal → Configure**.
2. Enable `Allow customers to update subscriptions` and `Allow cancellation`.
3. Copy the generated **Portal link** base URL. The backend can call `stripe.billingPortal.sessions.create` to redirect customers there.

---

## 5. Create the Webhook Endpoint

The ShipFast demo listens for two events: `checkout.session.completed` and `customer.subscription.deleted`. ScholarFlow’s backend does the same.

### 5.1 Local Development via Stripe CLI

```bash
stripe login                       # authorise CLI with your account
stripe listen --events \
  checkout.session.completed,customer.subscription.deleted \
  --forward-to http://localhost:3000/api/webhook/stripe
```

The command prints a `whsec_...` signing secret. Store it in `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 5.2 Dashboard Endpoint (Production)

1. Go to **Developers → Webhooks → + Add endpoint**.
2. URL: `https://your-domain.com/api/webhook/stripe`.
3. Select the same event types (`checkout.session.completed`, `customer.subscription.deleted`).
4. Save and copy the signing secret; update the production environment variable store (e.g. Vercel/Render secrets).

> 🔒 Keep the signing secret private. Regenerate it if it ever leaks.

---

## 6. Environment Variables

Add these to both local and production environments. For ScholarFlow, update `apps/frontend/.env.example`, `apps/backend/.env.example`, and the actual `.env` files.

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_PRICE_TEAM_ANNUAL=price_...
# Optional pricing table embed
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=pricing_table_...
```

If you rely on the product catalog metadata rather than hard-coded price IDs, replace the explicit `STRIPE_PRICE_*` variables with a single lookup call (`stripe.prices.list({ product: ... })`).

---

## 7. Align Webhook Logic with the Demo

`app/api/webhook/stripe/route.js` in marclou/stripe-sub does the following:

1. Verifies the signature with `stripe.webhooks.constructEvent`.
2. On `checkout.session.completed`:
   - Retrieves the session + customer.
   - Finds or creates a user by email.
   - Grants access (`user.hasAccess = true`, `user.priceId = price.id`).
3. On `customer.subscription.deleted`:
   - Fetches the subscription and finds the user by `customerId`.
   - Revokes access (`user.hasAccess = false`).

Ensure ScholarFlow’s backend mirrors this logic (it already does in `billing.service.ts`/`webhook.controller.ts`). Adjust model fields if your schema differs from ShipFast’s `User` document.

---

## 8. Test the Integration

1. **Create Checkout Session from the App**
   - Use a test user account and open the billing page.
   - Complete checkout with Stripe’s test card `4242 4242 4242 4242` + any future date and CVC.
   - Confirm that the webhook logs the event and the database grants access.

2. **Trigger Cancellation**
   - From Stripe Dashboard: open the test subscription → `Cancel subscription now`.
   - The webhook should revoke access. Verify the user record reflects the change.

3. **Replay Events (optional)**
   - Use Stripe CLI: `stripe trigger customer.subscription.deleted` to double-check idempotency.

4. **Monitor Stripe Logs**
   - Open **Developers → Logs** to confirm each webhook attempt succeeds (HTTP 200).

---

## 9. Production Launch Checklist

- [ ] Switch `sk_test_...` / `pk_test_...` to live keys.
- [ ] Replace the webhook secret with the live endpoint version.
- [ ] Rebuild and redeploy ScholarFlow with the new environment variables.
- [ ] Re-run the onboarding flow using a real card (Stripe allows $0 live test products) before inviting customers.
- [ ] Configure email notifications or alerts for failed payments via Stripe Billing settings.

Following these steps keeps the Stripe-side configuration minimal while matching the marclou/stripe-sub demo. All heavy lifting (subscription creation, access revocation, customer portal) is handled by Stripe-hosted surfaces plus the single webhook handler.
