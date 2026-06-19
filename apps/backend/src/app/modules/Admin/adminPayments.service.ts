/**
 * Admin Payments Service
 *
 * Read-only list of payments with filters, plus a refund action that
 * marks a payment as REFUNDED. Stripe refund API call is a future enhancement;
 * v1 just updates the local row and writes an audit entry.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

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

  async refundPayment(paymentId: string, actorId: string) {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, isDeleted: false },
    });
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.status === "REFUNDED") {
      throw new ApiError(400, "Payment already refunded");
    }

    const updated = await prisma.payment.update({
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

    await prisma.activityLogEntry.create({
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

    return updated;
  },
};

