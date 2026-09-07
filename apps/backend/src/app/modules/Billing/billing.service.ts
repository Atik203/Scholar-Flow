import { Prisma } from "../../shared/prisma";
import config from "../../config";
import prismaClient from "../../shared/prisma";
import stripe, {
  isStripeError,
  isValidPriceId,
  logStripeError,
} from "../../shared/stripe";
import {
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
 * Get plan tier from Stripe price ID
 * Maps price IDs to plan tier codes. Only pro/team are purchasable via
 * checkout — enterprise is contact-sales only and never reaches here.
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

  throw BillingError.checkoutSessionCreationFailed(
    `Invalid or unconfigured price ID: ${priceId}`
  );
};

/**
 * Public price catalog — configured Stripe price IDs per plan/interval.
 * Used by GET /billing/prices so the frontend can start checkout
 * without knowing the raw price IDs.
 */
export const getAvailablePrices = () => {
  const prices = config.stripe.prices;
  return {
    pro: {
      monthly: prices.pro.monthly ?? null,
      annual: prices.pro.annual ?? null,
    },
    team: {
      monthly: prices.team.monthly ?? null,
      annual: prices.team.annual ?? null,
    },
    enterprise: {
      monthly: prices.enterprise?.monthly ?? null,
      annual: prices.enterprise?.annual ?? null,
    },
  };
};

type CatalogPlan = {
  name: string;
  priceCents: number;
  currency: string;
  interval: string;
  stripePriceId: string | null;
};

/**
 * Public plan catalog for the pricing page — derived from the Plan table so
 * admin edits (name, price, active toggle) show up immediately. Only ACTIVE
 * plans are listed; enterprise stays contact-sales only.
 */
export const getPublicCatalog = async (): Promise<{
  free: CatalogPlan;
  pro: { monthly: CatalogPlan | null; annual: CatalogPlan | null };
  team: { monthly: CatalogPlan | null; annual: CatalogPlan | null };
}> => {
  const plans = await prismaClient.$queryRaw<
    Array<{
      code: string;
      name: string;
      priceCents: number;
      currency: string;
      interval: string;
      active: boolean;
      stripePriceId: string | null;
    }>
  >`
    SELECT code, name, "priceCents", currency, interval, active, "stripePriceId"
    FROM "Plan"
    WHERE "isDeleted" = false
      AND active = true
    ORDER BY "priceCents" ASC
  `;

  const pick = (code: string): CatalogPlan | null => {
    const plan = plans.find((p) => p.code === code);
    if (!plan) return null;
    return {
      name: plan.name,
      priceCents: plan.priceCents,
      currency: plan.currency,
      interval: plan.interval,
      stripePriceId: plan.stripePriceId,
    };
  };

  return {
    free: {
      name: "Free",
      priceCents: 0,
      currency: "USD",
      interval: "month",
      stripePriceId: null,
    },
    pro: {
      monthly: pick("pro_monthly"),
      annual: pick("pro_annual"),
    },
    team: {
      monthly: pick("team_monthly"),
      annual: pick("team_annual"),
    },
  };
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

  // Resolve the plan from the DB (plan edits repoint stripePriceId at newly
  // created Stripe prices, so the env list alone is stale). Env-configured
  // price IDs remain valid as a legacy fallback for plans without a row.
  const planRow = await prismaClient.$queryRaw<Array<{ active: boolean; code: string }>>`
    SELECT active, code
    FROM "Plan"
    WHERE "stripePriceId" = ${priceId}
      AND "isDeleted" = false
    LIMIT 1
  `;

  let planTier: string;

  if (planRow.length > 0) {
    // A plan deactivated in the admin panel must not accept new checkouts
    if (!planRow[0].active) {
      throw BillingError.planUnavailable();
    }
    // Tier from the stable plan code (e.g. pro_monthly -> pro) — the price ID
    // itself changes whenever the plan price is edited.
    planTier = planRow[0].code.split("_")[0];
  } else {
    if (!isValidPriceId(priceId)) {
      throw BillingError.checkoutSessionCreationFailed(
        `Invalid or unconfigured Stripe price ID: ${priceId}. Update STRIPE_PRICE_* env variables.`
      );
    }
    planTier = getPlanTierFromPriceId(priceId);
  }

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

  if (existingSubscription.length > 0) {
    throw BillingError.alreadySubscribed(userId);
  }

  // Verify workspace ownership/membership when a workspace is attached
  if (workspaceId) {
    const access = await prismaClient.$queryRaw<Array<{ isMember: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM "Workspace" w
        WHERE w.id = ${workspaceId}
          AND w."isDeleted" = false
          AND (
            w."ownerId" = ${userId}
            OR EXISTS (
              SELECT 1
              FROM "WorkspaceMember" m
              WHERE m."workspaceId" = w.id
                AND m."userId" = ${userId}
                AND m."isDeleted" = false
            )
          )
      ) AS "isMember"
    `;

    if (!access[0]?.isMember) {
      throw BillingError.workspaceAccessDenied(workspaceId);
    }
  }

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
    // Create Checkout session with stable idempotency key
    // (unique per user+price+workspace — retries reuse it, preventing duplicates)
    const idempotencyKey = `checkout_${userId}_${priceId}_${workspaceId || "personal"}`;

    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode: "subscription",
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
          `${(config.reset_pass_link || config.frontend_url || "http://localhost:3000").replace("/reset-password", "")}/dashboard/billing/cancel`,
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
    ORDER BY
      CASE s.status
        WHEN 'ACTIVE' THEN 0
        WHEN 'PAST_DUE' THEN 1
        ELSE 2
      END,
      s."createdAt" DESC
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
    features: getPlanFeatures(plan[0]?.code),
  };
};

/**
 * Resolve the feature set for a plan code (e.g. "pro_monthly" → "pro").
 * PLAN_FEATURES is keyed by tier, so strip any interval suffix from the code.
 */
const getPlanFeatures = (planCode?: string | null): Record<string, unknown> => {
  if (!planCode) {
    return {};
  }

  const tier = planCode.split("_")[0] as keyof typeof PLAN_FEATURES;

  return PLAN_FEATURES[tier] || {};
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
  getOrCreateStripeCustomer,
  getAvailablePrices,
  getPublicCatalog,
};
