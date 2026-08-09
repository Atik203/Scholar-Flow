/**
 * Admin Plans Service
 *
 * Read-only view over Plan + subscriber counts + monthly revenue
 * for the admin Plans page. MRR here matches the analytics page:
 * paying subscribers only (ACTIVE, non-trial, not canceled-at-period-end).
 */

import prisma from "../../shared/prisma";

export const adminPlansService = {
  async listPlansWithStats() {
    const plans = await prisma.plan.findMany({
      where: { isDeleted: false },
      orderBy: { priceCents: "asc" },
    });

    // Subscriber counts + paying-subscriber count per plan. "active" is the
    // MRR population: ACTIVE, non-trial, not canceled-at-period-end.
    const stats = await prisma.$queryRaw<
      Array<{
        planId: string;
        status: string;
        active: bigint;
        canceled: bigint;
        total: bigint;
      }>
    >`
      SELECT
        s."planId",
        s.status::text,
        COUNT(*) FILTER (
          WHERE s.status = 'ACTIVE'
            AND s."cancelAtPeriodEnd" = false
            AND (s."trialEnd" IS NULL OR s."trialEnd" <= NOW())
        )::bigint AS active,
        COUNT(*) FILTER (WHERE s.status = 'CANCELED')::bigint AS canceled,
        COUNT(*)::bigint AS total
      FROM "Subscription" s
      WHERE s."isDeleted" = false
      GROUP BY s."planId", s.status
    `;

    const aggregated = new Map<
      string,
      { active: number; canceled: number; total: number }
    >();
    for (const row of stats) {
      const entry = aggregated.get(row.planId) ?? {
        active: 0,
        canceled: 0,
        total: 0,
      };
      entry.total += Number(row.total);
      entry.active += Number(row.active);
      entry.canceled += Number(row.canceled);
      aggregated.set(row.planId, entry);
    }

    return plans.map((p) => {
      const s = aggregated.get(p.id) ?? { active: 0, canceled: 0, total: 0 };
      const monthlyRevenueCents =
        p.interval === "month"
          ? p.priceCents * s.active
          : Math.round((p.priceCents / 12) * s.active);
      return {
        ...p,
        activeSubscribers: s.active,
        canceledSubscribers: s.canceled,
        totalSubscribers: s.total,
        monthlyRevenueCents,
      };
    });
  },
};

