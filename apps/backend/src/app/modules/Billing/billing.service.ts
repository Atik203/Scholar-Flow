import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import config from "../../config";
import prismaClient from "../../shared/prisma";
import stripe, {
  getPlanNameFromPriceId,
  isStripeError,
  isValidPriceId,
  logStripeError,
  STRIPE_PRICE_IDS,
} from "../../shared/stripe";
import {
  BILLING_INTERVALS,
  PLAN_FEATURES,
  PLAN_TIERS,
  TRIAL_PERIOD_DAYS,
} from "./billing.constant";
import { BillingError } from "./billing.error";
import type {
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
} from "./billing.validation";

/**
 * Billing Service
 * Handles all Stripe integration logic for subscriptions
 */

/**
 * Get Stripe Price ID for a plan tier and interval
 */
const getPriceId = (planTier: string, interval: string): string | undefined => {
  const prices = config.stripe.prices;

  if (planTier === PLAN_TIERS.PRO) {
    return interval === BILLING_INTERVALS.MONTHLY
      ? prices.pro.monthly
      : prices.pro.annual;
  }

  if (planTier === PLAN_TIERS.TEAM) {
    return interval === BILLING_INTERVALS.MONTHLY
      ? prices.team.monthly
      : prices.team.annual;
  }

  if (planTier === PLAN_TIERS.ENTERPRISE) {
    return interval === BILLING_INTERVALS.MONTHLY
      ? prices.enterprise?.monthly
      : prices.enterprise?.annual;
  }

  return undefined;
};

/**
 * Get plan tier from Stripe price ID
 * Maps price IDs to plan tier codes
 */
const getPlanTierFromPriceId = (priceId: string): string => {
  const prices = config.stripe.prices;

  // Check Pro plans
  if (priceId === prices.pro.monthly || priceId === prices.pro.annual) {
    return PLAN_TIERS.PRO;
  }

  // Check Team plans
  if (priceId === prices.team.monthly || priceId === prices.team.annual) {
    return PLAN_TIERS.TEAM;
  }

  // Check Enterprise plans
  if (
    priceId === prices.enterprise?.monthly ||
    priceId === prices.enterprise?.annual
  ) {
    return PLAN_TIERS.ENTERPRISE;
  }

  throw BillingError.checkoutSessionCreationFailed(
    `Invalid or unconfigured price ID: ${priceId}`
  );
};

/**
 * Get or create Stripe customer for a user
 */
const getOrCreateStripeCustomer = async (
  userId: string,
  email: string,
  name?: string
): Promise<string> => {
  // Check if user already has a Stripe customer ID
  const user = await prismaClient.$queryRaw<
    Array<{ stripeCustomerId: string | null }>
  >`
    SELECT "stripeCustomerId"
    FROM "User"
    WHERE id = ${userId}
    LIMIT 1
  `;

  if (user[0]?.stripeCustomerId) {
    return user[0].stripeCustomerId;
  }

  // Create new Stripe customer
  try {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId,
      },
    });

    // Update user with Stripe customer ID
    await prismaClient.$executeRaw`
      UPDATE "User"
      SET "stripeCustomerId" = ${customer.id}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `;

    return customer.id;
  } catch (error) {
    if (isStripeError(error)) {
      logStripeError(error, "getOrCreateStripeCustomer");
    }
    throw BillingError.checkoutSessionCreationFailed(
      "Failed to create Stripe customer"
    );
  }
};

/**
 * Create a Stripe Checkout session for plan upgrade
 * Simplified to accept priceId directly (matches example project pattern)
 */
export const createCheckoutSession = async (
  userId: string,
  email: string,
  name: string | undefined,
  input: CreateCheckoutSessionInput
): Promise<{ sessionId: string; url: string }> => {
  const { priceId, workspaceId, successUrl, cancelUrl } = input;

  // Validate price ID
  if (!isValidPriceId(priceId)) {
    throw BillingError.checkoutSessionCreationFailed(
      `Invalid or unconfigured Stripe price ID: ${priceId}. Update STRIPE_PRICE_* env variables.`
    );
  }

  // Derive plan tier from price ID
  const planTier = getPlanTierFromPriceId(priceId);

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer(userId, email, name);

  // Check if user already has an active subscription
  const existingSubscription = await prismaClient.$queryRaw<
    Array<{ id: string; status: string }>
  >`
    SELECT id, status
    FROM "Subscription"
    WHERE "userId" = ${userId}
      AND status = 'ACTIVE'
      AND "isDeleted" = false
    LIMIT 1
  `;

  const mode: Stripe.Checkout.SessionCreateParams.Mode =
    existingSubscription.length > 0 ? "subscription" : "subscription";

  // Determine trial eligibility
  const hasUsedTrial = await prismaClient.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::int as count
    FROM "Subscription"
    WHERE "userId" = ${userId}
      AND "trialEnd" IS NOT NULL
      AND "isDeleted" = false
  `;

  const allowTrial =
    Number(hasUsedTrial[0]?.count || 0) === 0 &&
    existingSubscription.length === 0;

  try {
    // Create Checkout session with idempotency key
    const idempotencyKey = `checkout_${userId}_${priceId}_${Date.now()}`;

    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url:
          successUrl ||
          `${(config.reset_pass_link || config.frontend_url || "http://localhost:3000").replace("/reset-password", "")}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          cancelUrl ||
          `${(config.reset_pass_link || config.frontend_url || "http://localhost:3000").replace("/reset-password", "")}/pricing`,
        subscription_data: allowTrial
          ? {
              trial_period_days: TRIAL_PERIOD_DAYS,
              metadata: {
                userId,
                workspaceId: workspaceId || "",
                planTier,
              },
            }
          : {
              metadata: {
                userId,
                workspaceId: workspaceId || "",
                planTier,
              },
            },
        metadata: {
          userId,
          workspaceId: workspaceId || "",
          planTier,
          priceId,
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
      },
      {
        idempotencyKey,
      }
    );

    if (!session.url) {
      throw BillingError.checkoutSessionCreationFailed(
        "No session URL returned"
      );
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    if (isStripeError(error)) {
      logStripeError(error, "createCheckoutSession");
    }
    throw BillingError.checkoutSessionCreationFailed(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

/**
 * Create a Stripe Customer Portal session
 */
export const createPortalSession = async (
  userId: string,
  input: CreatePortalSessionInput
): Promise<{ url: string }> => {
  const { returnUrl } = input;

  // Get user's Stripe customer ID
  const user = await prismaClient.$queryRaw<
    Array<{ stripeCustomerId: string | null }>
  >`
    SELECT "stripeCustomerId"
    FROM "User"
    WHERE id = ${userId}
    LIMIT 1
  `;

  if (!user[0]?.stripeCustomerId) {
    throw BillingError.stripeCustomerNotFound(userId);
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user[0].stripeCustomerId,
      return_url: returnUrl || config.stripe.billingPortalReturnUrl,
    });

    return {
      url: session.url,
    };
  } catch (error) {
    if (isStripeError(error)) {
      logStripeError(error, "createPortalSession");
    }
    throw BillingError.portalSessionCreationFailed(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

/**
 * Get user's current subscription
 */
export const getUserSubscription = async (
  userId: string,
  workspaceId?: string
) => {
  const subscription = await prismaClient.$queryRaw<
    Array<{
      id: string;
      status: string;
      planId: string;
      currentPeriodEnd: Date | null;
      cancelAtPeriodEnd: boolean;
      trialEnd: Date | null;
      seats: number;
      providerSubscriptionId: string | null;
    }>
  >`
    SELECT
      s.id,
      s.status,
      s."planId",
      s."currentPeriodEnd",
      s."cancelAtPeriodEnd",
      s."trialEnd",
      s.seats,
      s."providerSubscriptionId"
    FROM "Subscription" s
    WHERE s."userId" = ${userId}
      ${workspaceId ? Prisma.sql`AND s."workspaceId" = ${workspaceId}` : Prisma.empty}
      AND s."isDeleted" = false
    ORDER BY s."createdAt" DESC
    LIMIT 1
  `;

  if (subscription.length === 0) {
    return null;
  }

  // Get plan details
  const plan = await prismaClient.$queryRaw<
    Array<{
      code: string;
      name: string;
      features: any;
    }>
  >`
    SELECT code, name, features
    FROM "Plan"
    WHERE id = ${subscription[0].planId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  return {
    ...subscription[0],
    plan: plan[0] || null,
    features:
      PLAN_FEATURES[subscription[0].planId as keyof typeof PLAN_FEATURES] || {},
  };
};

/**
 * Cancel subscription at period end
 */
export const cancelSubscription = async (
  userId: string,
  workspaceId?: string
): Promise<void> => {
  const subscription = await getUserSubscription(userId, workspaceId);

  if (!subscription) {
    throw BillingError.subscriptionNotFound(userId);
  }

  if (!subscription.providerSubscriptionId) {
    throw new Error("Subscription missing Stripe subscription ID");
  }

  try {
    // Cancel at period end via Stripe
    await stripe.subscriptions.update(subscription.providerSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local record
    await prismaClient.$executeRaw`
      UPDATE "Subscription"
      SET "cancelAtPeriodEnd" = true, "updatedAt" = NOW()
      WHERE id = ${subscription.id}
    `;
  } catch (error) {
    if (isStripeError(error)) {
      logStripeError(error, "cancelSubscription");
    }
    throw new Error(
      `Failed to cancel subscription: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Reactivate a canceled subscription
 */
export const reactivateSubscription = async (
  userId: string,
  workspaceId?: string
): Promise<void> => {
  const subscription = await getUserSubscription(userId, workspaceId);

  if (!subscription) {
    throw BillingError.subscriptionNotFound(userId);
  }

  if (!subscription.providerSubscriptionId) {
    throw new Error("Subscription missing Stripe subscription ID");
  }

  try {
    // Reactivate via Stripe
    await stripe.subscriptions.update(subscription.providerSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update local record
    await prismaClient.$executeRaw`
      UPDATE "Subscription"
      SET "cancelAtPeriodEnd" = false, "updatedAt" = NOW()
      WHERE id = ${subscription.id}
    `;
  } catch (error) {
    if (isStripeError(error)) {
      logStripeError(error, "reactivateSubscription");
    }
    throw new Error(
      `Failed to reactivate subscription: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const billingService = {
  createCheckoutSession,
  createPortalSession,
  getUserSubscription,
  cancelSubscription,
  reactivateSubscription,
  getPriceId,
  getOrCreateStripeCustomer,
};
