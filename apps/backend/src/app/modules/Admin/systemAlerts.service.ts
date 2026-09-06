/**
 * System Alerts Service
 *
 * Phase 7 admin view of the SystemAlert model. Read + resolve.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

export const systemAlertsService = {
  async listAlerts(params: {
    category?: "USER" | "BILLING" | "SECURITY" | "STORAGE" | "PROCESSING" | "SYSTEM";
    severity?: "INFO" | "WARNING" | "CRITICAL";
    resolved?: boolean;
    page: number;
    limit: number;
  }) {
    const where: Prisma.SystemAlertWhereInput = {};
    if (params.category) where.category = params.category;
    if (params.severity) where.severity = params.severity;
    if (params.resolved !== undefined) where.resolved = params.resolved;

    const [total, items, unresolvedCount, criticalCount] = await Promise.all([
      prisma.systemAlert.count({ where }),
      prisma.systemAlert.findMany({
        where,
        orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          resolvedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.systemAlert.count({ where: { ...where, resolved: false } }),
      prisma.systemAlert.count({
        where: { ...where, severity: "CRITICAL", resolved: false },
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
      summary: { unresolved: unresolvedCount, critical: criticalCount },
    };
  },

  async getCounts() {
    const [unresolved, critical, info, warning] = await Promise.all([
      prisma.systemAlert.count({ where: { resolved: false } }),
      prisma.systemAlert.count({
        where: { resolved: false, severity: "CRITICAL" },
      }),
      prisma.systemAlert.count({
        where: { resolved: false, severity: "INFO" },
      }),
      prisma.systemAlert.count({
        where: { resolved: false, severity: "WARNING" },
      }),
    ]);
    return { unresolved, critical, info, warning };
  },

  async resolveAlert(id: string, actorId: string) {
    const alert = await prisma.systemAlert.findUnique({ where: { id } });
    if (!alert) throw new ApiError(404, "System alert not found");
    return prisma.systemAlert.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedById: actorId,
      },
    });
  },

  async createAlert(data: {
    category: "USER" | "BILLING" | "SECURITY" | "STORAGE" | "PROCESSING" | "SYSTEM";
    severity: "INFO" | "WARNING" | "CRITICAL";
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) {
    return prisma.systemAlert.create({
      data: {
        category: data.category,
        severity: data.severity,
        title: data.title,
        message: data.message,
        metadata: data.metadata
          ? (data.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  },
};

