/**
 * Admin Moderation Service
 *
 * Phase 7 content moderation queue. Backed by the ContentReport model.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

export const adminModerationService = {
  async listReports(params: {
    status?: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
    contentType?: "PAPER" | "COMMENT" | "COLLECTION" | "PROFILE";
    assignedToId?: string;
    page: number;
    limit: number;
  }) {
    const where: Prisma.ContentReportWhereInput = { isDeleted: false };
    if (params.status) where.status = params.status;
    if (params.contentType) where.contentType = params.contentType;
    if (params.assignedToId) where.assignedToId = params.assignedToId;

    const [total, items] = await Promise.all([
      prisma.contentReport.count({ where }),
      prisma.contentReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          resolvedBy: { select: { id: true, name: true, email: true } },
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

  async getReport(id: string) {
    const report = await prisma.contentReport.findFirst({
      where: { id, isDeleted: false },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        resolvedBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!report) throw new ApiError(404, "Content report not found");
    return report;
  },

  async assignReport(id: string, assignedToId: string) {
    const report = await prisma.contentReport.findFirst({
      where: { id, isDeleted: false },
    });
    if (!report) throw new ApiError(404, "Content report not found");
    return prisma.contentReport.update({
      where: { id },
      data: { assignedToId, status: "UNDER_REVIEW" },
    });
  },

  async resolveReport(
    id: string,
    actorId: string,
    action: "approved" | "removed" | "warning" | "suspended"
  ) {
    const report = await prisma.contentReport.findFirst({
      where: { id, isDeleted: false },
    });
    if (!report) throw new ApiError(404, "Content report not found");

    return prisma.contentReport.update({
      where: { id },
      data: {
        status: "RESOLVED",
        action,
        resolvedAt: new Date(),
        resolvedById: actorId,
      },
    });
  },

  async dismissReport(id: string, actorId: string) {
    const report = await prisma.contentReport.findFirst({
      where: { id, isDeleted: false },
    });
    if (!report) throw new ApiError(404, "Content report not found");

    return prisma.contentReport.update({
      where: { id },
      data: {
        status: "DISMISSED",
        resolvedAt: new Date(),
        resolvedById: actorId,
      },
    });
  },

  async createReport(
    reporterId: string,
    data: {
      contentType: "PAPER" | "COMMENT" | "COLLECTION" | "PROFILE";
      contentId: string;
      contentTitle?: string;
      contentPreview?: string;
      reason: "SPAM" | "HARASSMENT" | "COPYRIGHT" | "INAPPROPRIATE" | "MISINFORMATION" | "OTHER";
      description?: string;
    }
  ) {
    return prisma.contentReport.create({
      data: {
        reporterId,
        contentType: data.contentType,
        contentId: data.contentId,
        contentTitle: data.contentTitle,
        contentPreview: data.contentPreview,
        reason: data.reason,
        description: data.description,
      },
    });
  },
};

