/**
 * Admin Payments Service
 *
 * Payment list with filters + real Stripe refunds. Refunds go through the
 * Stripe Refunds API (payment_intent level) first, then the local row is
 * marked REFUNDED with an audit entry — atomically.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import stripe, { isStripeError, logStripeError } from "../../shared/stripe";

export const adminPaymentsService = {
  async listPayments(params: {
    page: number;
    limit: number;
    status?: string;
    provider?: string;
    search?: string;
  }) {
    const where: Prisma.PaymentWhereInput = { isDeleted: false };
    if (params.status) where.status = params.status as Prisma.EnumPaymentStatusFilter;
    if (params.provider) where.provider = params.provider as Prisma.EnumPaymentProviderFilter;
    if (params.search) {
      where.OR = [
        { transactionId: { contains: params.search, mode: "insensitive" } },
        { user: { email: { contains: params.search, mode: "insensitive" } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          subscription: {
            include: { plan: { select: { name: true, code: true } } },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / params.limit)),
      },
    };
  },

  /**
   * Refund a payment through Stripe, then mark the local row REFUNDED.
   * Only SUCCEEDED payments are refundable. The Stripe charge is resolved
   * from the stored invoice's payment_intent (or via invoice lookup by
   * transactionId), so dashboard-initiated money is actually returned.
   */
  async refundPayment(paymentId: string, actorId: string) {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, isDeleted: false },
    });
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.status === "REFUNDED") {
      throw new ApiError(400, "Payment already refunded");
    }
    if (payment.status !== "SUCCEEDED") {
      throw new ApiError(
        400,
        `Only successful payments can be refunded (current status: ${payment.status})`
      );
    }

    // Resolve the Stripe charge source for the refund
    const raw = (payment.raw ?? {}) as { payment_intent?: string | null };
    let paymentIntentId = raw.payment_intent ?? null;

    if (!paymentIntentId) {
      // transactionId is the Stripe invoice id for subscription invoices.
      // payment_intent was removed from the SDK types on recent API versions
      // — probe the raw payload defensively.
      const invoice = await stripe.invoices.retrieve(payment.transactionId);
      const rawIntent = (
        invoice as unknown as { payment_intent?: string | { id?: string } | null }
      ).payment_intent;
      paymentIntentId =
        typeof rawIntent === "string" ? rawIntent : (rawIntent?.id ?? null);
    }

    if (!paymentIntentId) {
      throw new ApiError(
        400,
        "No charge reference found for this payment — it cannot be refunded through Stripe"
      );
    }

    try {
      // Refund first — if Stripe rejects it, nothing local changes
      await stripe.refunds.create({ payment_intent: paymentIntentId });
    } catch (error) {
      if (isStripeError(error)) {
        logStripeError(error, "admin refund");
      }
      throw new ApiError(
        400,
        `Stripe refund failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Local update + audit atomically; the Stripe refund is already issued,
    // so a failure here must not be silently retried as a double refund.
    const updated = await prisma.$transaction(async (tx) => {
      const updatedRow = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "REFUNDED",
          raw: {
            ...((payment.raw as object) ?? {}),
            refundedAt: new Date().toISOString(),
            refundedBy: actorId,
          } as Prisma.InputJsonValue,
        },
      });

      await tx.activityLogEntry.create({
        data: {
          userId: actorId,
          entity: "payment",
          entityId: paymentId,
          action: "refunded",
          severity: "WARNING",
          details: {
            amountCents: payment.amountCents,
            currency: payment.currency,
            userId: payment.userId,
          },
        },
      });

      return updatedRow;
    });

    return updated;
  },
};

