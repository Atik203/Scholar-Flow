/**
 * Admin Plans Service
 *
 * Plan catalog view + stats for the admin Plans page, plus CRUD.
 * Price/currency/interval edits create a NEW Stripe price (Stripe prices are
 * immutable) and repoint Plan.stripePriceId at it; existing subscribers keep
 * their current price until renewal. Name edits sync to the Stripe product.
 */

import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import stripe, { isStripeError, logStripeError } from "../../shared/stripe";

export type PlanUpsertInput = {
  code: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: string;
  active?: boolean;
  features?: Record<string, unknown>;
  stripePriceId?: string;
};

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

  async createPlan(input: PlanUpsertInput) {
    const existing = await prisma.plan.findUnique({
      where: { code: input.code },
    });
    if (existing) {
      throw new ApiError(400, `Plan code "${input.code}" already exists`);
    }

    return prisma.plan.create({
      data: {
        code: input.code,
        name: input.name,
        priceCents: input.priceCents,
        currency: input.currency,
        interval: input.interval,
        active: input.active ?? true,
        features: (input.features ?? {}) as object,
      },
    });
  },

  async updatePlan(id: string, patch: Partial<PlanUpsertInput>) {
    const plan = await prisma.plan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!plan) throw new ApiError(404, "Plan not found");

    if (patch.code && patch.code !== plan.code) {
      const clash = await prisma.plan.findUnique({ where: { code: patch.code } });
      if (clash && clash.id !== id) {
        throw new ApiError(400, `Plan code "${patch.code}" already exists`);
      }
    }

    const nameChanged = patch.name && patch.name !== plan.name;
    const priceChanged =
      (patch.priceCents != null && patch.priceCents !== plan.priceCents) ||
      (patch.currency && patch.currency !== plan.currency) ||
      (patch.interval && patch.interval !== plan.interval);

    // --- Sync to Stripe BEFORE touching the DB row (fail-fast) ---
    if (priceChanged && plan.stripePriceId) {
      let productId: string | null = null;
      try {
        const oldPrice = await stripe.prices.retrieve(plan.stripePriceId);
        productId =
          typeof oldPrice.product === "string"
            ? oldPrice.product
            : (oldPrice.product?.id ?? null);
      } catch (error) {
        if (isStripeError(error)) logStripeError(error, "plan edit: retrieve price");
        throw new ApiError(
          400,
          `Stripe price lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }

      if (!productId) {
        throw new ApiError(400, "Existing Stripe price has no product reference");
      }

      const interval =
        (patch.interval ?? plan.interval) === "year" ? "year" : "month";

      try {
        const newPrice = await stripe.prices.create({
          product: productId,
          unit_amount: patch.priceCents ?? plan.priceCents,
          currency: patch.currency ?? plan.currency,
          recurring: { interval },
          nickname: `${patch.name ?? plan.name} (${interval})`,
        });
        patch.stripePriceId = newPrice.id;
      } catch (error) {
        if (isStripeError(error)) logStripeError(error, "plan edit: create price");
        throw new ApiError(
          400,
          `Stripe price creation failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    } else if (nameChanged && plan.stripePriceId) {
      // Rename the Stripe product (shared by monthly + annual variants)
      try {
        const oldPrice = await stripe.prices.retrieve(plan.stripePriceId);
        const productId =
          typeof oldPrice.product === "string"
            ? oldPrice.product
            : (oldPrice.product?.id ?? null);
        if (productId) {
          await stripe.products.update(productId, { name: patch.name! });
        }
      } catch (error) {
        if (isStripeError(error)) logStripeError(error, "plan edit: update product");
        throw new ApiError(
          400,
          `Stripe product rename failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return prisma.plan.update({
      where: { id },
      data: {
        ...(patch.code ? { code: patch.code } : {}),
        ...(patch.name ? { name: patch.name } : {}),
        ...(patch.priceCents != null ? { priceCents: patch.priceCents } : {}),
        ...(patch.currency ? { currency: patch.currency } : {}),
        ...(patch.interval ? { interval: patch.interval } : {}),
        ...(patch.active != null ? { active: patch.active } : {}),
        ...(patch.features ? { features: patch.features as object } : {}),
        ...(patch.stripePriceId ? { stripePriceId: patch.stripePriceId } : {}),
      },
    });
  },

  async deletePlan(id: string) {
    const plan = await prisma.plan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!plan) throw new ApiError(404, "Plan not found");

    const subscribers = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "Subscription"
      WHERE "planId" = ${id}
        AND status = 'ACTIVE'
        AND "isDeleted" = false
    `;

    if (Number(subscribers[0]?.count || 0) > 0) {
      throw new ApiError(
        400,
        "Plan has active subscribers — mark it inactive instead of deleting"
      );
    }

    return prisma.plan.update({
      where: { id },
      data: { isDeleted: true },
    });
  },

  async toggleActive(id: string) {
    const plan = await prisma.plan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!plan) throw new ApiError(404, "Plan not found");

    return prisma.plan.update({
      where: { id },
      data: { active: !plan.active },
    });
  },
};

