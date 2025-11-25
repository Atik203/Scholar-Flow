import prisma from "../../shared/prisma";

export const analyticsService = {
  /**
   * Get revenue analytics for admin dashboard
   */
  async getRevenueAnalytics(timeRange: "7d" | "30d" | "90d" | "1y" = "30d") {
    const now = new Date();
    const rangeMap = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    const days = rangeMap[timeRange];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get active subscriptions count by status
    const subscriptionStats = await prisma.$queryRaw<
      Array<{ status: string; count: bigint }>
    >`
      SELECT 
        status::text,
        COUNT(*)::bigint as count
      FROM "Subscription"
      WHERE "isDeleted" = false
      GROUP BY status
    `;

    // Get subscription counts by plan
    const subscriptionsByPlan = await prisma.$queryRaw<
      Array<{ planName: string; count: bigint }>
    >`
      SELECT 
        p.name as "planName",
        COUNT(s.id)::bigint as count
      FROM "Subscription" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isDeleted" = false 
        AND s.status = 'ACTIVE'
      GROUP BY p.name
      ORDER BY count DESC
    `;

    // Calculate MRR (Monthly Recurring Revenue)
    const mrrData = await prisma.$queryRaw<
      Array<{ totalMrr: string; currency: string }>
    >`
      SELECT 
        SUM(
          CASE 
            WHEN p.interval = 'month' THEN p."priceCents"
            WHEN p.interval = 'year' THEN p."priceCents" / 12
            ELSE 0
          END
        )::numeric / 100 as "totalMrr",
        p.currency
      FROM "Subscription" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isDeleted" = false 
        AND s.status = 'ACTIVE'
        AND s."cancelAtPeriodEnd" = false
      GROUP BY p.currency
    `;

    // Calculate ARR (Annual Recurring Revenue)
    const arr =
      mrrData.length > 0 ? parseFloat(mrrData[0].totalMrr || "0") * 12 : 0;
    const mrr = mrrData.length > 0 ? parseFloat(mrrData[0].totalMrr || "0") : 0;

    // Get total revenue from payments
    const revenueData = await prisma.$queryRaw<
      Array<{ totalRevenue: string; currency: string }>
    >`
      SELECT 
        SUM("amountCents")::numeric / 100 as "totalRevenue",
        currency
      FROM "Payment"
      WHERE status = 'SUCCEEDED'
        AND "createdAt" >= ${startDate}
      GROUP BY currency
    `;

    // Get payment trends (daily revenue for the time range)
    const revenueTrend = await prisma.$queryRaw<
      Array<{ date: Date; revenue: string; count: bigint }>
    >`
      SELECT 
        DATE("createdAt") as date,
        SUM("amountCents")::numeric / 100 as revenue,
        COUNT(*)::bigint as count
      FROM "Payment"
      WHERE status = 'SUCCEEDED'
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Get failed payments in the time range
    const failedPayments = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "Payment"
      WHERE status = 'FAILED'
        AND "createdAt" >= ${startDate}
    `;

    // Get new subscriptions in time range
    const newSubscriptions = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "Subscription"
      WHERE "createdAt" >= ${startDate}
        AND "isDeleted" = false
    `;

    // Get canceled subscriptions in time range
    const canceledSubscriptions = await prisma.$queryRaw<
      Array<{ count: bigint }>
    >`
      SELECT COUNT(*)::bigint as count
      FROM "Subscription"
      WHERE "canceledAt" >= ${startDate}
        AND "isDeleted" = false
    `;

    // Get average revenue per user (ARPU)
    const arpuData = await prisma.$queryRaw<
      Array<{ arpu: string; activeUsers: bigint }>
    >`
      SELECT 
        (SUM(p."priceCents")::numeric / COUNT(DISTINCT s."userId")::numeric / 100) as arpu,
        COUNT(DISTINCT s."userId")::bigint as "activeUsers"
      FROM "Subscription" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isDeleted" = false 
        AND s.status = 'ACTIVE'
        AND s."cancelAtPeriodEnd" = false
    `;

    // Churn rate calculation (canceled / total active at start of period)
    const churnData = await prisma.$queryRaw<
      Array<{ churnRate: string; canceled: bigint; totalActive: bigint }>
    >`
      WITH canceled_in_period AS (
        SELECT COUNT(*)::bigint as canceled
        FROM "Subscription"
        WHERE "canceledAt" >= ${startDate}
          AND "isDeleted" = false
      ),
      active_at_start AS (
        SELECT COUNT(*)::bigint as "totalActive"
        FROM "Subscription"
        WHERE "createdAt" < ${startDate}
          AND "isDeleted" = false
          AND (status = 'ACTIVE' OR "canceledAt" >= ${startDate})
      )
      SELECT 
        CASE 
          WHEN a."totalActive" > 0 
          THEN (c.canceled::numeric / a."totalActive"::numeric * 100)::text
          ELSE '0'
        END as "churnRate",
        c.canceled,
        a."totalActive"
      FROM canceled_in_period c, active_at_start a
    `;

    return {
      mrr: {
        amount: mrr,
        currency: mrrData[0]?.currency || "USD",
      },
      arr: {
        amount: arr,
        currency: mrrData[0]?.currency || "USD",
      },
      totalRevenue: {
        amount:
          revenueData.length > 0 ? parseFloat(revenueData[0].totalRevenue) : 0,
        currency: revenueData[0]?.currency || "USD",
        period: timeRange,
      },
      subscriptions: {
        byStatus: subscriptionStats.map((s) => ({
          status: s.status,
          count: Number(s.count),
        })),
        byPlan: subscriptionsByPlan.map((p) => ({
          plan: p.planName,
          count: Number(p.count),
        })),
        new: Number(newSubscriptions[0]?.count || 0),
        canceled: Number(canceledSubscriptions[0]?.count || 0),
      },
      payments: {
        failed: Number(failedPayments[0]?.count || 0),
      },
      metrics: {
        arpu:
          arpuData.length > 0 && arpuData[0].arpu
            ? parseFloat(arpuData[0].arpu)
            : 0,
        activeUsers: Number(arpuData[0]?.activeUsers || 0),
        churnRate:
          churnData.length > 0 && churnData[0].churnRate
            ? parseFloat(churnData[0].churnRate)
            : 0,
      },
      revenueTrend: revenueTrend.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        revenue: parseFloat(r.revenue),
        transactionCount: Number(r.count),
      })),
      timeRange,
    };
  },

  /**
   * Get top paying customers
   */
  async getTopCustomers(limit: number = 10) {
    const topCustomers = await prisma.$queryRaw<
      Array<{
        userId: string;
        userName: string;
        userEmail: string;
        totalSpent: string;
        subscriptionStatus: string;
        planName: string;
      }>
    >`
      SELECT 
        u.id as "userId",
        u.name as "userName",
        u.email as "userEmail",
        COALESCE(SUM(pay."amountCents")::numeric / 100, 0) as "totalSpent",
        s.status::text as "subscriptionStatus",
        p.name as "planName"
      FROM "User" u
      LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false
      LEFT JOIN "Plan" p ON s."planId" = p.id
      LEFT JOIN "Payment" pay ON u.id = pay."userId" AND pay.status = 'SUCCEEDED'
      WHERE u."isDeleted" = false
      GROUP BY u.id, u.name, u.email, s.status, p.name
      ORDER BY "totalSpent" DESC
      LIMIT ${limit}
    `;

    return topCustomers.map((c) => ({
      userId: c.userId,
      name: c.userName,
      email: c.userEmail,
      totalSpent: parseFloat(c.totalSpent),
      subscriptionStatus: c.subscriptionStatus,
      currentPlan: c.planName,
    }));
  },

  /**
   * Get all subscribers with details and pagination
   * Uses separate queries for different filter combinations to avoid $queryRawUnsafe
   */
  async getSubscriberDetails(
    page: number = 1,
    limit: number = 20,
    status?: string,
    planId?: string
  ) {
    const offset = (page - 1) * limit;
    const hasStatusFilter = status && status !== "all";
    const hasPlanFilter = !!planId;

    // Determine which query variant to use based on filters
    let countResult: Array<{ count: bigint }>;
    let subscribers: Array<{
      subscriptionId: string;
      userId: string;
      userName: string;
      userEmail: string;
      planName: string;
      status: string;
      seats: number;
      currentPeriodStart: Date | null;
      currentPeriodEnd: Date | null;
      cancelAtPeriodEnd: boolean;
      createdAt: Date;
      totalSpent: string;
      lastPaymentDate: Date | null;
    }>;

    if (hasStatusFilter && hasPlanFilter) {
      // Both status and plan filter
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "Subscription" s
        WHERE s."isDeleted" = false
          AND s.status = ${status}::"SubscriptionStatus"
          AND s."planId" = ${planId}
      `;

      subscribers = await prisma.$queryRaw`
        SELECT 
          s.id as "subscriptionId",
          u.id as "userId",
          u.name as "userName",
          u.email as "userEmail",
          p.name as "planName",
          s.status::text,
          s.seats,
          s."currentPeriodStart",
          s."currentPeriodEnd",
          s."cancelAtPeriodEnd",
          s."createdAt",
          COALESCE(
            (
              SELECT SUM(pay."amountCents")::numeric / 100
              FROM "Payment" pay
              WHERE pay."userId" = u.id 
                AND pay.status = 'SUCCEEDED'
                AND pay."isDeleted" = false
            ), 
            0
          ) as "totalSpent",
          (
            SELECT MAX(pay."createdAt")
            FROM "Payment" pay
            WHERE pay."subscriptionId" = s.id 
              AND pay.status = 'SUCCEEDED'
              AND pay."isDeleted" = false
          ) as "lastPaymentDate"
        FROM "Subscription" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Plan" p ON s."planId" = p.id
        WHERE s."isDeleted" = false
          AND u."isDeleted" = false
          AND s.status = ${status}::"SubscriptionStatus"
          AND s."planId" = ${planId}
        ORDER BY s."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else if (hasStatusFilter) {
      // Only status filter
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "Subscription" s
        WHERE s."isDeleted" = false
          AND s.status = ${status}::"SubscriptionStatus"
      `;

      subscribers = await prisma.$queryRaw`
        SELECT 
          s.id as "subscriptionId",
          u.id as "userId",
          u.name as "userName",
          u.email as "userEmail",
          p.name as "planName",
          s.status::text,
          s.seats,
          s."currentPeriodStart",
          s."currentPeriodEnd",
          s."cancelAtPeriodEnd",
          s."createdAt",
          COALESCE(
            (
              SELECT SUM(pay."amountCents")::numeric / 100
              FROM "Payment" pay
              WHERE pay."userId" = u.id 
                AND pay.status = 'SUCCEEDED'
                AND pay."isDeleted" = false
            ), 
            0
          ) as "totalSpent",
          (
            SELECT MAX(pay."createdAt")
            FROM "Payment" pay
            WHERE pay."subscriptionId" = s.id 
              AND pay.status = 'SUCCEEDED'
              AND pay."isDeleted" = false
          ) as "lastPaymentDate"
        FROM "Subscription" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Plan" p ON s."planId" = p.id
        WHERE s."isDeleted" = false
          AND u."isDeleted" = false
          AND s.status = ${status}::"SubscriptionStatus"
        ORDER BY s."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else if (hasPlanFilter) {
      // Only plan filter
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "Subscription" s
        WHERE s."isDeleted" = false
          AND s."planId" = ${planId}
      `;

      subscribers = await prisma.$queryRaw`
        SELECT 
          s.id as "subscriptionId",
          u.id as "userId",
          u.name as "userName",
          u.email as "userEmail",
          p.name as "planName",
          s.status::text,
          s.seats,
          s."currentPeriodStart",
          s."currentPeriodEnd",
          s."cancelAtPeriodEnd",
          s."createdAt",
          COALESCE(
            (
              SELECT SUM(pay."amountCents")::numeric / 100
              FROM "Payment" pay
              WHERE pay."userId" = u.id 
                AND pay.status = 'SUCCEEDED'
                AND pay."isDeleted" = false
            ), 
            0
          ) as "totalSpent",
          (
            SELECT MAX(pay."createdAt")
            FROM "Payment" pay
            WHERE pay."subscriptionId" = s.id 
              AND pay.status = 'SUCCEEDED'
              AND pay."isDeleted" = false
          ) as "lastPaymentDate"
        FROM "Subscription" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Plan" p ON s."planId" = p.id
        WHERE s."isDeleted" = false
          AND u."isDeleted" = false
          AND s."planId" = ${planId}
        ORDER BY s."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      // No filters
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "Subscription" s
        WHERE s."isDeleted" = false
      `;

      subscribers = await prisma.$queryRaw`
        SELECT 
          s.id as "subscriptionId",
          u.id as "userId",
          u.name as "userName",
          u.email as "userEmail",
          p.name as "planName",
          s.status::text,
          s.seats,
          s."currentPeriodStart",
          s."currentPeriodEnd",
          s."cancelAtPeriodEnd",
          s."createdAt",
          COALESCE(
            (
              SELECT SUM(pay."amountCents")::numeric / 100
              FROM "Payment" pay
              WHERE pay."userId" = u.id 
                AND pay.status = 'SUCCEEDED'
                AND pay."isDeleted" = false
            ), 
            0
          ) as "totalSpent",
          (
            SELECT MAX(pay."createdAt")
            FROM "Payment" pay
            WHERE pay."subscriptionId" = s.id 
              AND pay.status = 'SUCCEEDED'
              AND pay."isDeleted" = false
          ) as "lastPaymentDate"
        FROM "Subscription" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Plan" p ON s."planId" = p.id
        WHERE s."isDeleted" = false
          AND u."isDeleted" = false
        ORDER BY s."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      subscribers: subscribers.map((s) => ({
        subscriptionId: s.subscriptionId,
        userId: s.userId,
        userName: s.userName,
        userEmail: s.userEmail,
        planName: s.planName,
        status: s.status,
        seats: s.seats,
        currentPeriodStart: s.currentPeriodStart,
        currentPeriodEnd: s.currentPeriodEnd,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt,
        totalSpent: parseFloat(s.totalSpent),
        lastPaymentDate: s.lastPaymentDate,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },
};
