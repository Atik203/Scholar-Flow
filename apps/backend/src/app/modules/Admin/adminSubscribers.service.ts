/**
 * Admin Subscribers Service
 *
 * Subscriber listing (reuses analytics subscriber query) + admin actions
 * that mutate the Stripe subscription directly:
 *   - cancel at period end
 *   - reactivate a canceled-at-period-end subscription
 *   - cancel now (immediate, prorated)
 *   - change plan (Stripe price swap; role syncs via the existing
 *     customer.subscription.updated webhook)
 *
 * All mutations write an activity-log audit entry.
 */

import prisma, { Prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import stripe, { isStripeError, logStripeError } from "../../shared/stripe";
import { analyticsService } from "./analytics.service";

type SubscriberRow = {
  id: string;
  userId: string;
  planId: string;
  status: string;
  providerSubscriptionId: string | null;
};

const resolveSubscription = async (id: string): Promise<SubscriberRow> => {
  const rows = await prisma.$queryRaw<SubscriberRow[]>`
    SELECT id, "userId", "planId", status::text, "providerSubscriptionId"
    FROM "Subscription"
    WHERE id = ${id}
      AND "isDeleted" = false
    LIMIT 1
  `;

  if (!rows[0]) {
    throw new ApiError(404, "Subscription not found");
  }

  return rows[0];
};

const getStripeSubscriptionId = (sub: SubscriberRow): string => {
  if (!sub.providerSubscriptionId) {
    throw new ApiError(400, "Subscription has no Stripe reference");
  }
  return sub.providerSubscriptionId;
};

const writeAudit = async (
  actorId: string,
  subscriptionId: string,
  action: string,
  details: Prisma.InputJsonValue
): Promise<void> => {
  await prisma.activityLogEntry.create({
    data: {
      userId: actorId,
      entity: "subscription",
      entityId: subscriptionId,
      action,
      severity: "WARNING",
      details,
    },
  });
};

const handleStripeError = (error: unknown, context: string): never => {
  if (isStripeError(error)) {
    logStripeError(error, context);
  }
  throw new ApiError(
    400,
    `Stripe operation failed: ${error instanceof Error ? error.message : "Unknown error"}`
  );
};

export const adminSubscribersService = {
  /**
   * List subscribers with pagination + status/plan filters
   */
  async listSubscribers(
    page: number,
    limit: number,
    status?: string,
    planId?: string
  ) {
    return analyticsService.getSubscriberDetails(page, limit, status, planId);
  },

  /**
   * Cancel a subscription at the end of the current period
   */
  async cancelAtPeriodEnd(subscriptionId: string, actorId: string) {
    const sub = await resolveSubscription(subscriptionId);

    if (sub.status !== "ACTIVE") {
      throw new ApiError(400, `Cannot cancel a ${sub.status} subscription`);
    }

    try {
      await stripe.subscriptions.update(
        getStripeSubscriptionId(sub),
        { cancel_at_period_end: true }
      );
    } catch (error) {
      handleStripeError(error, "admin cancel at period end");
    }

    await prisma.$executeRaw`
      UPDATE "Subscription"
      SET "cancelAtPeriodEnd" = true, "updatedAt" = NOW()
      WHERE id = ${sub.id}
    `;

    await writeAudit(actorId, subscriptionId, "canceled_at_period_end", {
      userId: sub.userId,
    });
  },

  /**
   * Reactivate a subscription that was canceled at period end
   */
  async reactivate(subscriptionId: string, actorId: string) {
    const sub = await resolveSubscription(subscriptionId);

    if (sub.status !== "ACTIVE") {
      throw new ApiError(400, `Cannot reactivate a ${sub.status} subscription`);
    }

    try {
      await stripe.subscriptions.update(
        getStripeSubscriptionId(sub),
        { cancel_at_period_end: false }
      );
    } catch (error) {
      handleStripeError(error, "admin reactivate");
    }

    await prisma.$executeRaw`
      UPDATE "Subscription"
      SET "cancelAtPeriodEnd" = false, "updatedAt" = NOW()
      WHERE id = ${sub.id}
    `;

    await writeAudit(actorId, subscriptionId, "reactivated", {
      userId: sub.userId,
    });
  },

  /**
   * Cancel immediately — Stripe cancels at period end with proration when
   * possible; the customer.subscription.deleted webhook finalizes the local
   * state (status CANCELED + role revert).
   */
  async cancelNow(subscriptionId: string, actorId: string) {
    const sub = await resolveSubscription(subscriptionId);

    if (sub.status !== "ACTIVE") {
      throw new ApiError(400, `Cannot cancel a ${sub.status} subscription`);
    }

    try {
      await stripe.subscriptions.cancel(getStripeSubscriptionId(sub));
    } catch (error) {
      handleStripeError(error, "admin cancel now");
    }

    await writeAudit(actorId, subscriptionId, "canceled_now", {
      userId: sub.userId,
    });
  },

  /**
   * Change the plan by swapping the Stripe price on the subscription item.
   * The customer.subscription.updated webhook updates the user's role from
   * the new price ID.
   */
  async changePlan(
    subscriptionId: string,
    priceId: string,
    actorId: string
  ) {
    const sub = await resolveSubscription(subscriptionId);

    const plan = await prisma.$queryRaw<
      Array<{ id: string; code: string; active: boolean }>
    >`
      SELECT id, code, active
      FROM "Plan"
      WHERE "stripePriceId" = ${priceId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!plan[0]) {
      throw new ApiError(400, "Unknown Stripe price ID — not a configured plan");
    }
    if (!plan[0].active) {
      throw new ApiError(400, `Plan ${plan[0].code} is inactive`);
    }

    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        getStripeSubscriptionId(sub)
      );
      const itemId = stripeSub.items.data[0]?.id;

      if (!itemId) {
        throw new ApiError(400, "Subscription has no items to reprice");
      }

      await stripe.subscriptions.update(stripeSub.id, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: "create_prorations",
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      handleStripeError(error, "admin change plan");
    }

    await prisma.$executeRaw`
      UPDATE "Subscription"
      SET "planId" = ${plan[0].id}, "updatedAt" = NOW()
      WHERE id = ${sub.id}
    `;

    await writeAudit(actorId, subscriptionId, "plan_changed", {
      userId: sub.userId,
      planCode: plan[0].code,
    });
  },
};
