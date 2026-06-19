/**
 * Admin Plans Service
 *
 * Read-only view over Plan + subscriber counts + monthly revenue
 * for the admin Plans page.
 */

import prisma from "../../shared/prisma";

export const adminPlansService = {
  async listPlansWithStats() {
    const plans = await prisma.plan.findMany({
      where: { isDeleted: false },
      orderBy: { priceCents: "asc" },
    });

    // Subscriber count + monthly revenue per plan
    const stats = await prisma.subscription.groupBy({
      by: ["planId", "status"],
      where: { isDeleted: false },
      _count: { _all: true },
    });

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
      entry.total += row._count._all;
      if (row.status === "ACTIVE") entry.active += row._count._all;
      if (row.status === "CANCELED") entry.canceled += row._count._all;
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

