import cron from "node-cron";
import prismaClient from "../../shared/prisma";

/**
 * Invitation sweeper
 *
 * Pending workspace/collection invitations now expire (INVITE_EXPIRY_DAYS,
 * default 7). Stripe-style lifecycle guarantees: the sweeper flips stale
 * PENDING rows to EXPIRED hourly so lists and accept endpoints never surface
 * zombie invites. Idempotent — only touches PENDING rows past expiry.
 */

const EXPIRY_DAYS = Number(process.env.INVITE_EXPIRY_DAYS || 7);

export const INVITE_EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

const logDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[InvitationSweeper]", ...args);
  }
};

export const runInvitationSweep = async (): Promise<number> => {
  const expired = await prismaClient.$queryRaw<Array<{ count: number }>>`
    SELECT (
      (SELECT COUNT(*) FROM "WorkspaceInvitation"
       WHERE status = 'PENDING' AND "isDeleted" = false
         AND "expiresAt" IS NOT NULL AND "expiresAt" < NOW())
      +
      (SELECT COUNT(*) FROM "CollectionMember"
       WHERE status = 'PENDING' AND "isDeleted" = false
         AND "expiresAt" IS NOT NULL AND "expiresAt" < NOW())
    )::int as count
  `;
  const total = expired[0]?.count ?? 0;

  if (total === 0) return 0;

  await prismaClient.$executeRaw`
    UPDATE "WorkspaceInvitation"
    SET status = 'EXPIRED', "updatedAt" = NOW()
    WHERE status = 'PENDING' AND "isDeleted" = false
      AND "expiresAt" IS NOT NULL AND "expiresAt" < NOW()
  `;
  await prismaClient.$executeRaw`
    UPDATE "CollectionMember"
    SET status = 'EXPIRED', "updatedAt" = NOW()
    WHERE status = 'PENDING' AND "isDeleted" = false
      AND "expiresAt" IS NOT NULL AND "expiresAt" < NOW()
  `;

  logDebug(`Expired ${total} pending invitation(s)`);
  return total;
};

let sweeperStarted = false;

export const startInvitationSweeper = (): void => {
  if (sweeperStarted || process.env.VERCEL === "1") {
    return;
  }

  // Hourly at minute 15 (offset from the subscription sweeper at minute 5)
  cron.schedule("15 * * * *", () => {
    runInvitationSweep().catch((error) => {
      console.error("[InvitationSweeper] Sweep run failed:", error);
    });
  });

  sweeperStarted = true;
  logDebug(`Invitation sweeper started (expiry: ${EXPIRY_DAYS} days)`);
};
