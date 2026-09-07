import { Prisma } from "../../shared/prisma";
import { Request, Response } from "express";
import Stripe from "stripe";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import prismaClient from "../../shared/prisma";
import stripe from "../../shared/stripe";
import { STRIPE_WEBHOOK_EVENTS, SUBSCRIPTION_STATUS } from "./billing.constant";
import { BillingError } from "./billing.error";

type RawBodyRequest = Request & { rawBody?: Buffer | string };
type MutableRawBodyRequest = RawBodyRequest & { body?: unknown };

/**
 * Webhook handler for Stripe events
 * Raw body parsing required for signature verification
 */
type StripeWebhookEventType =
  (typeof STRIPE_WEBHOOK_EVENTS)[keyof typeof STRIPE_WEBHOOK_EVENTS];

const logDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

export const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      throw BillingError.webhookSignatureVerificationFailed();
    }

    if (!config.stripe.webhook_secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    const rawBody = await getRawBodyBuffer(req as RawBodyRequest);

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        config.stripe.webhook_secret
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown verification error";

      console.error("Webhook signature verification failed", {
        message: errorMessage,
      });

      throw BillingError.webhookSignatureVerificationFailed();
    }

    // Log webhook event
    if (process.env.NODE_ENV === "development") {
      console.log(`Received webhook event: ${event.type}`);
    }

    // Check for duplicate event (idempotency)
    const existingEvent = await prismaClient.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "WebhookEvent"
      WHERE provider = 'STRIPE'
        AND "eventId" = ${event.id}
      LIMIT 1
    `;

    if (existingEvent.length > 0) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Duplicate webhook event: ${event.id}, skipping`);
      }
      res.status(200).json({ received: true, duplicate: true });
      return;
    }

    // Store webhook event
    await prismaClient.$executeRaw`
      INSERT INTO "WebhookEvent" (id, provider, "eventId", type, payload, status, "receivedAt", "createdAt", "updatedAt", "isDeleted")
      VALUES (
        gen_random_uuid(),
        'STRIPE',
        ${event.id},
        ${event.type},
        ${JSON.stringify(event)}::jsonb,
        'pending',
        NOW(),
        NOW(),
        NOW(),
        false
      )
    `;

    // Process event
    try {
      await processStripeEvent(event);

      // Mark event as processed
      await prismaClient.$executeRaw`
        UPDATE "WebhookEvent"
        SET status = 'processed', "processedAt" = NOW(), "updatedAt" = NOW()
        WHERE "eventId" = ${event.id} AND provider = 'STRIPE'
      `;
    } catch (error) {
      // Mark event as failed
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await prismaClient.$executeRaw`
        UPDATE "WebhookEvent"
        SET status = 'failed', error = ${errorMessage}, attempts = attempts + 1, "updatedAt" = NOW()
        WHERE "eventId" = ${event.id} AND provider = 'STRIPE'
      `;

      console.error(`Failed to process webhook event ${event.id}:`, error);
    }

    res.status(200).json({ received: true });
  }
);

/**
 * Process Stripe webhook events
 */
async function processStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_ASYNC_PAYMENT_SUCCEEDED:
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_ASYNC_PAYMENT_FAILED:
      // Asynchronous payment methods only; checkout is card-only today,
      // so this is a graceful no-op when it arrives.
      logDebug(
        `Async checkout payment failed: ${(event.data.object as Stripe.Checkout.Session).id}`
      );
      break;

    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_ACTION_REQUIRED:
      // Customer must complete an additional authentication step. The
      // subscription stays as-is until the outcome event arrives.
      logDebug(
        `Payment action required on invoice ${(event.data.object as Stripe.Invoice).id}`
      );
      break;

    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
      await handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
        event.type as StripeWebhookEventType
      );
      break;

    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAID:
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case STRIPE_WEBHOOK_EVENTS.CHARGE_REFUNDED:
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      logDebug(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Extract raw body buffer from request for Stripe signature verification
 * Handles both local (express.raw) and Vercel serverless (direct Buffer) cases
 */
async function getRawBodyBuffer(req: RawBodyRequest): Promise<Buffer> {
  // Case 1: Check rawBody property (custom middleware)
  const possibleRawBody = req.rawBody;

  if (Buffer.isBuffer(possibleRawBody)) {
    logDebug("[Webhook] Raw body extracted from req.rawBody (Buffer)");
    (req as RawBodyRequest).rawBody = possibleRawBody;
    return possibleRawBody;
  }

  if (typeof possibleRawBody === "string") {
    logDebug("[Webhook] Raw body extracted from req.rawBody (string)");
    const buffer = Buffer.from(possibleRawBody, "utf8");
    (req as RawBodyRequest).rawBody = buffer;
    (req as MutableRawBodyRequest).body = buffer;
    return buffer;
  }

  // Case 2: Check req.body (Vercel serverless or express.raw)
  if (Buffer.isBuffer(req.body)) {
    logDebug(
      "[Webhook] Raw body extracted from req.body (Buffer) - Vercel mode"
    );
    (req as RawBodyRequest).rawBody = req.body;
    return req.body;
  }

  if (typeof req.body === "string") {
    logDebug("[Webhook] Raw body extracted from req.body (string)");
    const buffer = Buffer.from(req.body, "utf8");
    (req as RawBodyRequest).rawBody = buffer;
    (req as MutableRawBodyRequest).body = buffer;
    return buffer;
  }

  // Case 3: Check if body is already parsed JSON (should not happen, but handle gracefully)
  if (req.body && typeof req.body === "object") {
    console.error(
      "[Webhook] Body already parsed as JSON - cannot verify signature"
    );
    console.error(
      "[Webhook] This indicates body parsing middleware is running before webhook route"
    );
    throw BillingError.webhookRawBodyMissing();
  }

  // Case 4: Attempt to read from request stream if not yet consumed (e.g., serverless environments)
  if (!req.readableEnded && req.readable !== false) {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }

    if (chunks.length > 0) {
      const buffer = Buffer.concat(chunks);
      (req as RawBodyRequest).rawBody = buffer;
      (req as MutableRawBodyRequest).body = buffer;
      logDebug("[Webhook] Raw body captured by manual stream read");
      return buffer;
    }
  }

  console.error(
    "[Webhook] No raw body found in req stream after fallback attempts"
  );
  throw BillingError.webhookRawBodyMissing();
}

/**
 * Map a plan tier/code to the app role. Plan codes are `pro_*` / `team_*`
 * (Stripe price IDs are repointed when plans are edited, so matching on the
 * price ID would go stale — the code is stable).
 */
function getRoleFromPlanTier(
  tier: string
): "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" {
  if (tier === "pro") return "PRO_RESEARCHER";
  if (tier === "team") return "TEAM_LEAD";
  return "RESEARCHER";
}

/**
 * Resolve the user role for a Stripe price ID by looking up the Plan code.
 * Falls back to RESEARCHER when no plan row exists.
 */
async function getRoleFromStripePriceId(
  priceId: string
): Promise<"RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD"> {
  const plan = await prismaClient.$queryRaw<Array<{ code: string }>>`
    SELECT code
    FROM "Plan"
    WHERE "stripePriceId" = ${priceId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  return getRoleFromPlanTier(plan[0]?.code?.split("_")[0] ?? "");
}

/**
 * Handle checkout session completed event
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId;
  const workspaceId = session.metadata?.workspaceId || null;
  const stripePriceId = session.metadata?.priceId;
  const planTier = session.metadata?.planTier ?? null;

  if (!userId || !stripePriceId) {
    throw new Error("Missing required metadata in checkout session");
  }

  // Only grant access when payment actually settled. Checkout with
  // asynchronous payment methods completes before payment succeeds.
  if (session.payment_status !== "paid") {
    logDebug(
      `Checkout session ${session.id} not paid (${session.payment_status}), skipping subscription grant`
    );
    return;
  }

  // Get subscription from Stripe
  if (!session.subscription) {
    throw new Error("No subscription in checkout session");
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  const stripeSubscription = (await stripe.subscriptions.retrieve(
    subscriptionId
  )) as Stripe.Subscription;

  const { currentPeriodStart, currentPeriodEnd } =
    getSubscriptionPeriodBounds(stripeSubscription);

  const stripeCustomerId =
    typeof stripeSubscription.customer === "string"
      ? stripeSubscription.customer
      : (stripeSubscription.customer?.id ?? null);

  if (currentPeriodEnd === null) {
    throw BillingError.webhookProcessingFailed(
      STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED,
      "Stripe subscription missing current period end"
    );
  }

  // Determine billing interval (month/year) from Stripe subscription
  const subscriptionInterval =
    stripeSubscription.items.data[0]?.plan?.interval ?? "month";
  const normalizedInterval =
    subscriptionInterval === "year" ? "annual" : "monthly";

  // Find plan by Stripe price ID
  const planByPrice = await prismaClient.$queryRaw<
    Array<{ id: string; code: string }>
  >`
    SELECT id, code
    FROM "Plan"
    WHERE "stripePriceId" = ${stripePriceId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  let planId = planByPrice[0]?.id ?? null;

  if (!planId && planTier) {
    const fallbackCode = `${planTier}_${normalizedInterval}`;
    const fallbackPlan = await prismaClient.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Plan"
      WHERE code = ${fallbackCode}
        AND "isDeleted" = false
      LIMIT 1
    `;

    planId = fallbackPlan[0]?.id ?? null;
  }

  if (!planId) {
    throw new Error(`Plan not found for Stripe price ID: ${stripePriceId}`);
  }

  // Create subscription record
  const status = mapStripeStatus(stripeSubscription.status);
  const existingSubscription = await prismaClient.$queryRaw<
    Array<{ id: string }>
  >`
    SELECT id
    FROM "Subscription"
    WHERE "providerSubscriptionId" = ${stripeSubscription.id}
      AND "isDeleted" = false
    LIMIT 1
  `;

  const canceledAtSql =
    stripeSubscription.canceled_at != null
      ? Prisma.sql`to_timestamp(${Number(stripeSubscription.canceled_at)})`
      : Prisma.sql`NULL`;

  if (existingSubscription.length > 0) {
    await prismaClient.$executeRaw`
      UPDATE "Subscription"
      SET
        "planId" = ${planId},
        "workspaceId" = ${workspaceId},
        status = ${status}::"SubscriptionStatus",
        provider = 'STRIPE',
        "providerCustomerId" = ${stripeCustomerId},
        "providerSubscriptionId" = ${stripeSubscription.id},
        "cancelAtPeriodEnd" = ${stripeSubscription.cancel_at_period_end},
        "currentPeriodStart" = ${toTimestampSql(currentPeriodStart)},
        "currentPeriodEnd" = ${toTimestampSql(currentPeriodEnd)},
        "trialStart" = ${toTimestampSql(stripeSubscription.trial_start ?? null)},
        "trialEnd" = ${toTimestampSql(stripeSubscription.trial_end ?? null)},
        "canceledAt" = ${canceledAtSql},
        "expiresAt" = ${toTimestampSql(currentPeriodEnd)},
        "updatedAt" = NOW()
      WHERE id = ${existingSubscription[0].id}
    `;
  } else {
    await prismaClient.$executeRaw`
      INSERT INTO "Subscription" (
        id,
        "userId",
        "workspaceId",
        "planId",
        status,
        provider,
        "providerCustomerId",
        "providerSubscriptionId",
        "cancelAtPeriodEnd",
        "currentPeriodStart",
        "currentPeriodEnd",
        "trialStart",
        "trialEnd",
        "startedAt",
        "expiresAt",
        "createdAt",
        "updatedAt",
        "isDeleted"
      ) VALUES (
        gen_random_uuid(),
        ${userId},
        ${workspaceId},
        ${planId},
        ${status}::"SubscriptionStatus",
        'STRIPE',
        ${stripeCustomerId},
        ${stripeSubscription.id},
        ${stripeSubscription.cancel_at_period_end},
        ${toTimestampSql(currentPeriodStart)},
        ${toTimestampSql(currentPeriodEnd)},
        ${toTimestampSql(stripeSubscription.trial_start ?? null)},
        ${toTimestampSql(stripeSubscription.trial_end ?? null)},
        NOW(),
        ${toTimestampSql(currentPeriodEnd)},
        NOW(),
        NOW(),
        false
      )
    `;
  }

  // Update user role and Stripe subscription fields based on the plan tier
  // (metadata.planTier is set at checkout creation and stays stable)
  const userRole = getRoleFromPlanTier(planTier ?? "");

  await prismaClient.$executeRaw`
    UPDATE "User"
    SET
      role = ${userRole}::"Role",
      "stripeSubscriptionId" = ${stripeSubscription.id},
      "stripePriceId" = ${stripePriceId},
      "stripeCurrentPeriodEnd" = ${toTimestampSql(currentPeriodEnd)},
      "updatedAt" = NOW()
    WHERE id = ${userId}
  `;

  logDebug(
    `User ${userId} role updated to ${userRole} with subscription ${stripeSubscription.id}`
  );

  logDebug(
    `Subscription created/updated for user ${userId}: ${stripeSubscription.id}`
  );
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  eventType: StripeWebhookEventType
): Promise<void> {
  const status = mapStripeStatus(subscription.status);
  const { currentPeriodStart, currentPeriodEnd } =
    getSubscriptionPeriodBounds(subscription);

  if (currentPeriodEnd === null) {
    throw BillingError.webhookProcessingFailed(
      eventType,
      "Stripe subscription missing current period end"
    );
  }

  await prismaClient.$executeRaw`
    UPDATE "Subscription"
    SET
      status = ${status}::"SubscriptionStatus",
      "currentPeriodStart" = ${toTimestampSql(currentPeriodStart)},
      "currentPeriodEnd" = ${toTimestampSql(currentPeriodEnd)},
      "cancelAtPeriodEnd" = ${subscription.cancel_at_period_end},
      "canceledAt" = ${subscription.canceled_at ? Prisma.sql`to_timestamp(${Number(subscription.canceled_at)})` : null},
      "expiresAt" = ${toTimestampSql(currentPeriodEnd)},
      "updatedAt" = NOW()
    WHERE "providerSubscriptionId" = ${subscription.id}
  `;

  // Get the Stripe price ID and update user fields
  const stripePriceId = subscription.items.data[0]?.price?.id || null;

  if (stripePriceId) {
    // Find user by Stripe customer ID
    const customerId = getCustomerIdFromSubscription(subscription);

    if (!customerId) {
      logDebug(
        `Subscription ${subscription.id} has no customer reference, skipping user update`
      );
      return;
    }

    const user = await prismaClient.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "User"
      WHERE "stripeCustomerId" = ${customerId}
      LIMIT 1
    `;

    if (user.length > 0) {
      const userId = user[0].id;
      const userRole = await getRoleFromStripePriceId(stripePriceId);

      // Only update role if subscription is active
      if (status === SUBSCRIPTION_STATUS.ACTIVE) {
        await prismaClient.$executeRaw`
          UPDATE "User"
          SET
            role = ${userRole}::"Role",
            "stripeSubscriptionId" = ${subscription.id},
            "stripePriceId" = ${stripePriceId},
            "stripeCurrentPeriodEnd" = ${toTimestampSql(currentPeriodEnd)},
            "updatedAt" = NOW()
          WHERE id = ${userId}
        `;

        logDebug(`User ${userId} role updated to ${userRole}`);
      } else {
        // Just update subscription fields without changing role
        await prismaClient.$executeRaw`
          UPDATE "User"
          SET
            "stripeSubscriptionId" = ${subscription.id},
            "stripePriceId" = ${stripePriceId},
            "stripeCurrentPeriodEnd" = ${toTimestampSql(currentPeriodEnd)},
            "updatedAt" = NOW()
          WHERE id = ${userId}
        `;
      }
    }
  }

  logDebug(`Subscription updated: ${subscription.id}`);
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  await prismaClient.$executeRaw`
    UPDATE "Subscription"
    SET
      status = 'CANCELED'::"SubscriptionStatus",
      "canceledAt" = NOW(),
      "updatedAt" = NOW()
    WHERE "providerSubscriptionId" = ${subscription.id}
  `;

  // Find user by Stripe customer ID and revert to free tier
  const customerId = getCustomerIdFromSubscription(subscription);

  if (!customerId) {
    logDebug(
      `Subscription ${subscription.id} has no customer reference, skipping role revert`
    );
    return;
  }

  const user = await prismaClient.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM "User"
    WHERE "stripeCustomerId" = ${customerId}
    LIMIT 1
  `;

  if (user.length > 0) {
    const userId = user[0].id;

    // Revert user to RESEARCHER role (free tier) and clear Stripe fields
    await prismaClient.$executeRaw`
      UPDATE "User"
      SET
        role = 'RESEARCHER',
        "stripeSubscriptionId" = NULL,
        "stripePriceId" = NULL,
        "stripeCurrentPeriodEnd" = NULL,
        "updatedAt" = NOW()
      WHERE id = ${userId}
    `;

    logDebug(`User ${userId} role reverted to RESEARCHER (free tier)`);
  }

  logDebug(`Subscription canceled: ${subscription.id}`);
}

/**
 * Handle invoice paid event
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionField = getSubscriptionFromInvoice(invoice);
  if (!subscriptionField) {
    return;
  }

  const subscriptionId =
    typeof subscriptionField === "string"
      ? subscriptionField
      : subscriptionField.id;

  // Find subscription
  const subscription = await prismaClient.$queryRaw<
    Array<{ id: string; userId: string }>
  >`
    SELECT id, "userId"
    FROM "Subscription"
    WHERE "providerSubscriptionId" = ${subscriptionId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  if (subscription.length === 0) {
    console.warn(`Subscription not found for invoice: ${invoice.id}`);
    return;
  }

  // Record payment
  await prismaClient.$executeRaw`
    INSERT INTO "Payment" (
      id,
      "userId",
      "subscriptionId",
      provider,
      "amountCents",
      currency,
      "transactionId",
      status,
      raw,
      "createdAt",
      "updatedAt",
      "isDeleted"
    ) VALUES (
      gen_random_uuid(),
      ${subscription[0].userId},
      ${subscription[0].id},
      'STRIPE',
      ${invoice.amount_paid},
      ${invoice.currency.toUpperCase()},
      ${invoice.id},
      'SUCCEEDED',
      ${JSON.stringify(invoice)}::jsonb,
      NOW(),
      NOW(),
      false
    )
    ON CONFLICT ("transactionId")
    DO UPDATE SET
      status = 'SUCCEEDED',
      "updatedAt" = NOW()
  `;

  logDebug(`Invoice paid recorded: ${invoice.id}`);
}

/**
 * Handle invoice payment failed event
 */
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionField = getSubscriptionFromInvoice(invoice);
  if (!subscriptionField) {
    return;
  }

  const subscriptionId =
    typeof subscriptionField === "string"
      ? subscriptionField
      : subscriptionField.id;

  // Find subscription (needed for the payment record + notification)
  const subscription = await prismaClient.$queryRaw<
    Array<{ id: string; userId: string }>
  >`
    SELECT id, "userId"
    FROM "Subscription"
    WHERE "providerSubscriptionId" = ${subscriptionId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  if (subscription.length === 0) {
    console.warn(
      `Subscription not found for failed invoice: ${invoice.id}`
    );
    return;
  }

  // Update subscription status
  await prismaClient.$executeRaw`
    UPDATE "Subscription"
    SET
      status = 'PAST_DUE'::"SubscriptionStatus",
      "updatedAt" = NOW()
    WHERE "providerSubscriptionId" = ${subscriptionId}
  `;

  // Record the failed payment attempt (feeds the failed-payment metric
  // and gives the admin a visible failure trail). Idempotent per invoice.
  await prismaClient.$executeRaw`
    INSERT INTO "Payment" (
      id,
      "userId",
      "subscriptionId",
      provider,
      "amountCents",
      currency,
      "transactionId",
      status,
      raw,
      "createdAt",
      "updatedAt",
      "isDeleted"
    ) VALUES (
      gen_random_uuid(),
      ${subscription[0].userId},
      ${subscription[0].id},
      'STRIPE',
      ${invoice.amount_due},
      ${invoice.currency.toUpperCase()},
      ${invoice.id},
      'FAILED',
      ${JSON.stringify(invoice)}::jsonb,
      NOW(),
      NOW(),
      false
    )
    ON CONFLICT ("transactionId")
    DO UPDATE SET
      status = 'FAILED',
      "updatedAt" = NOW()
  `;

  // Notify the user about the failed payment (grace period is running)
  try {
    const { notificationService } = await import(
      "../Notification/notification.service"
    );

    await notificationService.createNotification({
      userId: subscription[0].userId,
      type: "SYSTEM",
      title: "Payment failed",
      message:
        "We couldn't charge your card for your subscription. Your paid plan continues during the grace period — update your payment method to avoid losing access.",
      actionUrl: "/dashboard/billing",
      resourceId: subscriptionId,
    });
  } catch (error) {
    // Notification failures must never fail the webhook itself
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Webhook] Failed to notify user about payment failure:",
        error
      );
    }
  }

  logDebug(`Invoice payment failed: ${invoice.id}`);
}

/**
 * Handle charge.refunded event — sync refunds issued from the Stripe
 * dashboard back to the local Payment row. Only full refunds flip the row;
 * partial refunds leave the payment SUCCEEDED.
 */
async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  // charge.invoice was removed from the SDK types on recent API versions —
  // probe the raw payload defensively.
  const invoiceId = (charge as unknown as { invoice?: string | null }).invoice;

  if (!invoiceId) {
    logDebug(`Charge ${charge.id} has no invoice reference, skipping`);
    return;
  }

  const isFullyRefunded = charge.amount_refunded >= charge.amount;

  const payment = await prismaClient.$queryRaw<
    Array<{ id: string; status: string }>
  >`
    SELECT id, status::text
    FROM "Payment"
    WHERE "transactionId" = ${invoiceId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  if (payment.length === 0) {
    logDebug(`No local payment for refunded charge ${charge.id}`);
    return;
  }

  if (payment[0].status !== "SUCCEEDED" || !isFullyRefunded) {
    logDebug(
      `Charge ${charge.id}: status ${payment[0].status}, fully refunded ${isFullyRefunded} — skipping`
    );
    return;
  }

  await prismaClient.$executeRaw`
    UPDATE "Payment"
    SET
      status = 'REFUNDED',
      raw = raw || ${JSON.stringify({ refundedAt: new Date().toISOString(), refundedBy: "stripe_dashboard" })}::jsonb,
      "updatedAt" = NOW()
    WHERE id = ${payment[0].id}
  `;

  logDebug(`Payment ${payment[0].id} marked REFUNDED (charge.refunded)`);
}

/**
 * Map Stripe subscription status to our enum
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return SUBSCRIPTION_STATUS.ACTIVE;
    case "past_due":
      return SUBSCRIPTION_STATUS.PAST_DUE;
    case "canceled":
    case "unpaid":
      return SUBSCRIPTION_STATUS.CANCELED;
    case "incomplete":
    case "incomplete_expired":
      return SUBSCRIPTION_STATUS.EXPIRED;
    default:
      return SUBSCRIPTION_STATUS.EXPIRED;
  }
}

type SubscriptionPeriodBounds = {
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
};

/**
 * Extract Stripe customer ID from a subscription, tolerating both the
 * string form and the expanded customer object.
 */
function getCustomerIdFromSubscription(
  subscription: Stripe.Subscription
): string | null {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : (subscription.customer?.id ?? null);
}

function toTimestampSql(seconds: number | null | undefined): Prisma.Sql {
  return seconds != null
    ? Prisma.sql`to_timestamp(${seconds})`
    : Prisma.sql`NULL`;
}

function getSubscriptionPeriodBounds(
  subscription: Stripe.Subscription
): SubscriptionPeriodBounds {  const items = subscription.items?.data ?? [];

  const referenceItem = items.reduce<Stripe.SubscriptionItem | undefined>(
    (latest, item) => {
      if (!latest) {
        return item;
      }

      return item.current_period_end > latest.current_period_end
        ? item
        : latest;
    },
    undefined
  );

  if (!referenceItem) {
    return {
      currentPeriodStart: null,
      currentPeriodEnd: null,
    };
  }

  return {
    currentPeriodStart: referenceItem.current_period_start ?? null,
    currentPeriodEnd: referenceItem.current_period_end ?? null,
  };
}

function getSubscriptionFromInvoice(
  invoice: Stripe.Invoice
): string | Stripe.Subscription | null {
  // Modern API versions (Basil+) link the invoice to its subscription
  // via the parent object, not the (now deprecated) top-level field.
  const subscriptionDetails = invoice.parent?.subscription_details;

  if (subscriptionDetails?.subscription) {
    return subscriptionDetails.subscription;
  }

  // Defensive fallbacks for older versions / other invoice shapes.
  // invoice.subscription no longer exists in current API types — probe it
  // defensively via unknown for the rare legacy payload.
  const parentSubscription =
    (invoice.parent as { subscription?: string | Stripe.Subscription } | null)
      ?.subscription ?? null;

  if (parentSubscription) {
    return parentSubscription;
  }

  return ((invoice as unknown as { subscription?: string | null })
    .subscription ?? null);
}

export const webhookController = {
  handleStripeWebhook,
};
