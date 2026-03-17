import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

export class SearchService {
  /**
   * Global multi-entity search
   */
  static async globalSearch(
    userId: string,
    query: string,
    type: "all" | "papers" | "collections" | "workspaces" = "all",
    limit: number,
    skip: number,
    workspaceId?: string
  ) {
    const results: Record<string, any> = {};

    const q = query.toLowerCase();

    // 1. Search Papers
    if (type === "all" || type === "papers") {
      const andConditions: Prisma.PaperWhereInput[] = [
        { isDeleted: false },
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { abstract: { contains: q, mode: "insensitive" } },
            { source: { contains: q, mode: "insensitive" } },
            { doi: { contains: q, mode: "insensitive" } }
          ]
        }
      ];

      if (workspaceId) {
        andConditions.push({ workspaceId });
      }

      const safePaperWhere: Prisma.PaperWhereInput = { AND: andConditions };

      const [totalCount, items] = await Promise.all([
        prisma.paper.count({ where: safePaperWhere }),
        prisma.paper.findMany({
          where: safePaperWhere,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            metadata: true,
            source: true,
            workspaceId: true,
            createdAt: true,
          }
        }),
      ]);
      results.papers = { total: totalCount, items };
    }

    // 2. Search Collections
    if (type === "all" || type === "collections") {
      // Must be a collection they have access to
      const collAndConditions: Prisma.CollectionWhereInput[] = [
        { isDeleted: false },
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ]
        },
        {
          OR: [
            { ownerId: userId },
            { members: { some: { userId, isDeleted: false } } },
            { isPublic: true }
          ]
        }
      ];

      if (workspaceId) {
        collAndConditions.push({ workspaceId });
      }

      const finalCollectionWhere: Prisma.CollectionWhereInput = {
         AND: collAndConditions
      };


      const [totalCount, items] = await Promise.all([
        prisma.collection.count({ where: finalCollectionWhere }),
        prisma.collection.findMany({
          where: finalCollectionWhere,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            workspaceId: true,
          }
        }),
      ]);
      results.collections = { total: totalCount, items };
    }

    // 3. Search Workspaces
    if (type === "all" || type === "workspaces") {
      const workspaceWhere: Prisma.WorkspaceWhereInput = {
        AND: [
          { isDeleted: false },
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ]
          },
          {
            OR: [
              { ownerId: userId },
              { members: { some: { userId, isDeleted: false } } }
            ]
          }
        ]
      };
      
      const [totalCount, items] = await Promise.all([
        prisma.workspace.count({ where: workspaceWhere }),
        prisma.workspace.findMany({
          where: workspaceWhere,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
          }
        }),
      ]);
      results.workspaces = { total: totalCount, items };
    }

    // Determine the total results sum
    let aggregateTotal = 0;
    if (results.papers) aggregateTotal += results.papers.total;
    if (results.collections) aggregateTotal += results.collections.total;
    if (results.workspaces) aggregateTotal += results.workspaces.total;

    return {
      results,
      meta: { limit, skip, total: aggregateTotal }
    };
  }

  /**
   * Save a search query to history
   */
  static async saveSearchQuery(
    userId: string,
    query: string,
    filters?: any,
    searchResultsSummary?: any
  ) {
    if (!query || query.trim().length === 0) return null;
    
    return prisma.searchHistory.create({
      data: {
        userId,
        query: query.trim(),
        filters: filters || null,
        results: searchResultsSummary || null,
      }
    });
  }

  /**
   * Get search history for a user
   */
  static async getSearchHistory(
    userId: string,
    limit: number,
    skip: number
  ) {
    const where: Prisma.SearchHistoryWhereInput = {
      userId,
      isDeleted: false
    };

    const [total, data] = await Promise.all([
      prisma.searchHistory.count({ where }),
      prisma.searchHistory.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      meta: { total, skip, limit },
      result: data,
    };
  }
  
  /**
   * Get trending papers (placeholder for real trending algorithm)
   */
  static async getTrendingPapers(limit: number) {
    // Basic implementation: papers with most recent activity or annotations
    // We'll just return recently added ones across public/all platforms for now
    // Actually, maybe order by views or some usage metric? 
    // We'll return 10 random/recent papers.
    return prisma.paper.findMany({
      where: { isDeleted: false },
      take: limit,
      orderBy: { createdAt: "desc" }, // fallback
    });
  }

  /**
   * Get personalized recommendations (placeholder)
   */
  static async getRecommendations(userId: string, limit: number) {
    // Very simple recommendation: papers in the workspaces the user is part of
    return prisma.paper.findMany({
      where: {
        isDeleted: false,
        workspace: {
          members: {
            some: {
              userId,
              isDeleted: false
            }
          }
        }
      },
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  }
}

export default SearchService;
