/**
 * Audit Log Service
 *
 * Phase 7 admin view of the existing ActivityLogEntry table.
 * Adds summary aggregations and CSV/JSON export.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";

const escapeCsv = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

export const auditLogService = {
  async listEntries(params: {
    userId?: string;
    workspaceId?: string;
    entity?: string;
    entityId?: string;
    action?: string;
    severity?: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
    startDate?: Date;
    endDate?: Date;
    search?: string;
    page: number;
    limit: number;
  }) {
    const where: Prisma.ActivityLogEntryWhereInput = { isDeleted: false };
    if (params.userId) where.userId = params.userId;
    if (params.workspaceId) where.workspaceId = params.workspaceId;
    if (params.entity) where.entity = params.entity;
    if (params.entityId) where.entityId = params.entityId;
    if (params.action) where.action = params.action;
    if (params.severity) where.severity = params.severity;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }
    if (params.search) {
      where.OR = [
        { action: { contains: params.search, mode: "insensitive" } },
        { entity: { contains: params.search, mode: "insensitive" } },
        { entityId: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.activityLogEntry.count({ where }),
      prisma.activityLogEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          workspace: { select: { id: true, name: true } },
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

  async getSummary(params: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    total: number;
    bySeverity: Array<{ severity: string; count: number }>;
    byEntity: Array<{ entity: string; count: number }>;
    topActors: Array<{
      userId: string;
      name: string | null;
      email: string;
      count: number;
    }>;
  }> {
    const dateFilter: Prisma.ActivityLogEntryWhereInput = { isDeleted: false };
    if (params.startDate || params.endDate) {
      dateFilter.createdAt = {};
      if (params.startDate) dateFilter.createdAt.gte = params.startDate;
      if (params.endDate) dateFilter.createdAt.lte = params.endDate;
    }

    const [total, bySeverity, byEntity, topActors] = await Promise.all([
      prisma.activityLogEntry.count({ where: dateFilter }),
      prisma.activityLogEntry.groupBy({
        by: ["severity"],
        where: dateFilter,
        _count: { _all: true },
      }),
      prisma.activityLogEntry.groupBy({
        by: ["entity"],
        where: dateFilter,
        _count: { _all: true },
        orderBy: { _count: { entity: "desc" } },
        take: 10,
      }),
      prisma.activityLogEntry.groupBy({
        by: ["userId"],
        where: { ...dateFilter, userId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { userId: "desc" } },
        take: 10,
      }),
    ]);

    // Hydrate top actor user info
    const actorIds = topActors
      .map((a) => a.userId)
      .filter((id): id is string => Boolean(id));
    const actorUsers = actorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: actorIds }, isDeleted: false },
          select: { id: true, name: true, email: true },
        })
      : [];
    const userMap = new Map(actorUsers.map((u) => [u.id, u]));

    return {
      total,
      bySeverity: bySeverity.map((s) => ({
        severity: s.severity,
        count: s._count._all,
      })),
      byEntity: byEntity.map((e) => ({
        entity: e.entity,
        count: e._count._all,
      })),
      topActors: topActors.map((a) => {
        const user = a.userId ? userMap.get(a.userId) : null;
        return {
          userId: a.userId ?? "",
          name: user?.name ?? null,
          email: user?.email ?? "",
          count: a._count._all,
        };
      }),
    };
  },

  async exportEntries(
    params: {
      userId?: string;
      workspaceId?: string;
      entity?: string;
      entityId?: string;
      action?: string;
      severity?: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
      startDate?: Date;
      endDate?: Date;
      format: "json" | "csv";
      limit: number;
    }
  ): Promise<{ mimeType: string; filename: string; content: string }> {
    const where: Prisma.ActivityLogEntryWhereInput = { isDeleted: false };
    if (params.userId) where.userId = params.userId;
    if (params.workspaceId) where.workspaceId = params.workspaceId;
    if (params.entity) where.entity = params.entity;
    if (params.entityId) where.entityId = params.entityId;
    if (params.action) where.action = params.action;
    if (params.severity) where.severity = params.severity;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }

    const entries = await prisma.activityLogEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params.limit,
      include: {
        user: { select: { id: true, email: true, name: true } },
        workspace: { select: { id: true, name: true } },
      },
    });

    const dateStr = new Date().toISOString().split("T")[0];
    if (params.format === "json") {
      return {
        mimeType: "application/json",
        filename: `audit-log-${dateStr}.json`,
        content: JSON.stringify(entries, null, 2),
      };
    }

    const headers = [
      "id",
      "createdAt",
      "severity",
      "entity",
      "entityId",
      "action",
      "userId",
      "userEmail",
      "workspaceId",
      "workspaceName",
      "details",
      "metadata",
    ];
    const lines: string[] = [headers.join(",")];
    for (const e of entries) {
      lines.push(
        [
          e.id,
          e.createdAt.toISOString(),
          e.severity,
          e.entity,
          e.entityId,
          e.action,
          e.userId ?? "",
          e.user?.email ?? "",
          e.workspaceId ?? "",
          e.workspace?.name ?? "",
          e.details,
          e.metadata,
        ]
          .map(escapeCsv)
          .join(",")
      );
    }
    return {
      mimeType: "text/csv",
      filename: `audit-log-${dateStr}.csv`,
      content: lines.join("\n"),
    };
  },

  async createEntry(
    actorId: string,
    data: {
      userId?: string;
      workspaceId?: string;
      entity: string;
      entityId: string;
      action: string;
      details?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
    }
  ) {
    return prisma.activityLogEntry.create({
      data: {
        userId: data.userId,
        workspaceId: data.workspaceId,
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        details: data.details
          ? (data.details as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        metadata: data.metadata
          ? (data.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        severity: data.severity,
      },
    });
  },
};

export default auditLogService;
