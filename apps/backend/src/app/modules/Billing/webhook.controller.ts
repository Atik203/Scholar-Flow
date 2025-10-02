import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import prismaClient from "../../shared/prisma";
import stripe from "../../shared/stripe";
import { STRIPE_WEBHOOK_EVENTS, SUBSCRIPTION_STATUS } from "./billing.constant";
import { BillingError } from "./billing.error";

/**
 * Webhook handler for Stripe events
 * Raw body parsing required for signature verification
 */
export const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      throw BillingError.webhookSignatureVerificationFailed();
    }

    if (!config.stripe.webhook_secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhook_secret
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
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
      console.log(`Duplicate webhook event: ${event.id}, skipping`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // Store webhook event
    await prismaClient.$executeRaw`
      INSERT INTO "WebhookEvent" (id, provider, "eventId", type, payload, status, "receivedAt", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'STRIPE',
        ${event.id},
        ${event.type},
        ${JSON.stringify(event)}::jsonb,
        'pending',
        NOW(),
        NOW(),
        NOW()
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
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
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

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId;
  const workspaceId = session.metadata?.workspaceId || null;
  const planTier = session.metadata?.planTier;

  if (!userId || !planTier) {
    throw new Error("Missing required metadata in checkout session");
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

  // Find or create plan
  const plan = await prismaClient.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM "Plan"
    WHERE code = ${planTier}
      AND "isDeleted" = false
    LIMIT 1
  `;

  if (plan.length === 0) {
    throw new Error(`Plan not found: ${planTier}`);
  }

  // Create subscription record
  const status = mapStripeStatus(stripeSubscription.status);

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
      "currentPeriodStart",
      "currentPeriodEnd",
      "trialStart",
      "trialEnd",
      "startedAt",
      "expiresAt",
      "createdAt",
      "updatedAt"
    ) VALUES (
      gen_random_uuid(),
      ${userId},
      ${workspaceId},
      ${plan[0].id},
      ${status}::"SubscriptionStatus",
      'STRIPE',
      ${stripeSubscription.customer as string},
      ${stripeSubscription.id},
      to_timestamp(${Number(stripeSubscription.current_period_start)}),
      to_timestamp(${Number(stripeSubscription.current_period_end)}),
      ${stripeSubscription.trial_start ? Prisma.sql`to_timestamp(${Number(stripeSubscription.trial_start)})` : null},
      ${stripeSubscription.trial_end ? Prisma.sql`to_timestamp(${Number(stripeSubscription.trial_end)})` : null},
      NOW(),
      to_timestamp(${Number(stripeSubscription.current_period_end)}),
      NOW(),
      NOW()
    )
    ON CONFLICT ("providerSubscriptionId")
    DO UPDATE SET
      status = EXCLUDED.status,
      "currentPeriodStart" = EXCLUDED."currentPeriodStart",
      "currentPeriodEnd" = EXCLUDED."currentPeriodEnd",
      "expiresAt" = EXCLUDED."expiresAt",
      "updatedAt" = NOW()
  `;

  console.log(
    `Subscription created/updated for user ${userId}: ${stripeSubscription.id}`
  );
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const sub = subscription as any;
  const status = mapStripeStatus(subscription.status);

  await prismaClient.$executeRaw`
    UPDATE "Subscription"
    SET
      status = ${status}::"SubscriptionStatus",
      "currentPeriodStart" = to_timestamp(${Number(sub.current_period_start)}),
      "currentPeriodEnd" = to_timestamp(${Number(sub.current_period_end)}),
      "cancelAtPeriodEnd" = ${subscription.cancel_at_period_end},
      "canceledAt" = ${subscription.canceled_at ? Prisma.sql`to_timestamp(${Number(subscription.canceled_at)})` : null},
      "expiresAt" = to_timestamp(${Number(sub.current_period_end)}),
      "updatedAt" = NOW()
    WHERE "providerSubscriptionId" = ${subscription.id}
  `;

  console.log(`Subscription updated: ${subscription.id}`);
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

  console.log(`Subscription canceled: ${subscription.id}`);
}

/**
 * Handle invoice paid event
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionField = invoice.subscription as
    | string
    | Stripe.Subscription
    | null;
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
      "updatedAt"
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
      NOW()
    )
    ON CONFLICT ("transactionId")
    DO UPDATE SET
      status = 'SUCCEEDED',
      "updatedAt" = NOW()
  `;

  console.log(`Invoice paid recorded: ${invoice.id}`);
}

/**
 * Handle invoice payment failed event
 */
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionField = invoice.subscription as
    | string
    | Stripe.Subscription
    | null;
  if (!subscriptionField) {
    return;
  }

  const subscriptionId =
    typeof subscriptionField === "string"
      ? subscriptionField
      : subscriptionField.id;

  // Update subscription status
  await prismaClient.$executeRaw`
    UPDATE "Subscription"
    SET
      status = 'PAST_DUE'::"SubscriptionStatus",
      "updatedAt" = NOW()
    WHERE "providerSubscriptionId" = ${subscriptionId}
  `;

  // TODO: Send notification to user about failed payment

  console.log(`Invoice payment failed: ${invoice.id}`);
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

export const webhookController = {
  handleStripeWebhook,
};
