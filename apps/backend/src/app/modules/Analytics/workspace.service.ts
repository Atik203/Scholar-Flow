/**
 * Workspace Analytics Service
 *
 * Team Lead+ only. Aggregates analytics for a single workspace.
 */

import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

type TimeRange = "week" | "month" | "quarter" | "year";

const rangeToDays: Record<TimeRange, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

export const workspaceAnalyticsService = {
  async getSummary(workspaceId: string, timeRange: TimeRange = "month") {
    const days = rangeToDays[timeRange];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, isDeleted: false },
      include: { _count: { select: { members: true, papers: true, collections: true } } },
    });
    if (!workspace) throw new ApiError(404, "Workspace not found");

    const [papers, collections, memberActivity, paperViews, annotations] =
      await Promise.all([
        prisma.paper.findMany({
          where: { workspaceId, isDeleted: false },
          select: { id: true, title: true, uploaderId: true, createdAt: true },
        }),
        prisma.collection.findMany({
          where: { workspaceId, isDeleted: false },
          select: { id: true, name: true, ownerId: true },
        }),
        prisma.workspaceMember.findMany({
          where: { workspaceId, isDeleted: false },
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        }),
        prisma.usageEvent.findMany({
          where: {
            workspaceId,
            kind: "paper_view",
            createdAt: { gte: since },
            isDeleted: false,
          },
          select: { userId: true, paperId: true },
        }),
        prisma.annotation.count({
          where: {
            paper: { workspaceId },
            isDeleted: false,
            createdAt: { gte: since },
          },
        }),
      ]);

    // Per-member activity score
    const score = new Map<string, number>();
    for (const v of paperViews) {
      if (!v.userId) continue;
      score.set(v.userId, (score.get(v.userId) ?? 0) + 1);
    }
    const memberStats = memberActivity
      .map((m) => ({
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
        role: m.role,
        joinedAt: m.joinedAt,
        activityScore: score.get(m.userId) ?? 0,
      }))
      .sort((a, b) => b.activityScore - a.activityScore);

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        memberCount: workspace._count.members,
        paperCount: workspace._count.papers,
        collectionCount: workspace._count.collections,
        createdAt: workspace.createdAt,
      },
      timeRange,
      stats: {
        totalPapers: papers.length,
        totalCollections: collections.length,
        totalMembers: memberActivity.length,
        totalViews: paperViews.length,
        totalAnnotations: annotations,
        activeMembers: memberStats.filter((m) => m.activityScore > 0).length,
      },
      topMembers: memberStats.slice(0, 5),
      topPapers: papers.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        uploaderId: p.uploaderId,
        createdAt: p.createdAt,
      })),
    };
  },
};

