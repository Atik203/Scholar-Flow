import cron from "node-cron";
import prismaClient from "../../shared/prisma";
import { SUBSCRIPTION_STATUS } from "./billing.constant";

/**
 * Subscription sweeper
 *
 * Handles lifecycle transitions that Stripe webhooks cannot guarantee:
 * - PAST_DUE subscriptions (payment failed) past their grace period
 *   must be downgraded to RESEARCHER. Stripe keeps retrying dunning for
 *   days/weeks and only sends customer.subscription.deleted when dunning
 *   ends — the paid role would otherwise persist long after payment stopped.
 * - ACTIVE subscriptions with cancelAtPeriodEnd = true whose period has
 *   ended (renewal impossible) are treated the same way.
 *
 * Runs hourly. Grace period configurable via SUB_GRACE_DAYS (default 7).
 */

const GRACE_DAYS = Number(process.env.SUB_GRACE_DAYS || 7);

const logDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SubscriptionSweeper]", ...args);
  }
};

type ExpiredSubscriptionRow = {
  id: string;
  userId: string;
  status: string;
};

const findExpiredSubscriptions = async (): Promise<ExpiredSubscriptionRow[]> => {
  return prismaClient.$queryRaw<ExpiredSubscriptionRow[]>`
    SELECT s.id, s."userId", s.status
    FROM "Subscription" s
    WHERE (
        s.status = 'PAST_DUE'
        OR (s.status = 'ACTIVE' AND s."cancelAtPeriodEnd" = true)
      )
      AND s."expiresAt" < NOW() - make_interval(days => ${GRACE_DAYS})
      AND s."isDeleted" = false
      AND EXISTS (
        SELECT 1
        FROM "User" u
        WHERE u.id = s."userId"
          AND u.role != 'RESEARCHER'
      )
    LIMIT 100
  `;
};

const downgradeUserToFree = async (userId: string): Promise<void> => {
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
};

export const runSubscriptionSweep = async (): Promise<number> => {
  const expired = await findExpiredSubscriptions();

  for (const subscription of expired) {
    try {
      await downgradeUserToFree(subscription.userId);

      await prismaClient.$executeRaw`
        UPDATE "Subscription"
        SET
          status = ${SUBSCRIPTION_STATUS.EXPIRED}::"SubscriptionStatus",
          "canceledAt" = NOW(),
          "updatedAt" = NOW()
        WHERE id = ${subscription.id}
      `;

      logDebug(
        `Downgraded user ${subscription.userId} to RESEARCHER (subscription ${subscription.id}, status ${subscription.status})`
      );
    } catch (error) {
      console.error(
        `[SubscriptionSweeper] Failed to process subscription ${subscription.id}:`,
        error
      );
    }
  }

  if (expired.length > 0) {
    logDebug(`Sweep complete: ${expired.length} subscription(s) expired`);
  }

  return expired.length;
};

let sweeperStarted = false;

export const startSubscriptionSweeper = (): void => {
  if (sweeperStarted || process.env.VERCEL === "1") {
    return;
  }

  // Run hourly at minute 5 to avoid the top-of-the-hour webhook burst
  cron.schedule("5 * * * *", () => {
    runSubscriptionSweep().catch((error) => {
      console.error("[SubscriptionSweeper] Sweep run failed:", error);
    });
  });

  sweeperStarted = true;
  logDebug(`Subscription sweeper started (grace period: ${GRACE_DAYS} days)`);
};
