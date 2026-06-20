import { Prisma } from "../../shared/prisma";
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

    // 1. Search Papers (trigram similarity for fast ILIKE-style search)
    if (type === "all" || type === "papers") {
      const workspaceFilter = workspaceId
        ? Prisma.sql`AND p."workspaceId" = ${workspaceId}`
        : Prisma.empty;

      const items = await prisma.$queryRaw<any[]>`
        SELECT
          p.id,
          p.title,
          p.abstract,
          p.metadata,
          p.source,
          p."workspaceId",
          p."createdAt",
          GREATEST(
            COALESCE(similarity(p.title, ${q}), 0),
            COALESCE(similarity(p.abstract, ${q}), 0)
          ) AS "matchScore"
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND (
            p.title % ${q}
            OR p.abstract % ${q}
          )
          ${workspaceFilter}
        ORDER BY "matchScore" DESC, p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalCount = await prisma.paper.count({
        where: {
          isDeleted: false,
          workspaceId,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { abstract: { contains: q, mode: "insensitive" } },
          ],
        },
      });

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

  /**
   * Semantic vector search across paper chunks (pgvector).
   * Generates query embedding via OpenAI, then L2 distance search.
   */
  static async semanticSearch(
    userId: string,
    query: string,
    limit = 10,
    workspaceId?: string
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { results: [], fallback: "OPENAI_KEY_MISSING" };
    }

    // 1. Generate query embedding
    let queryVector: number[];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: query.trim().slice(0, 8000),
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        return { results: [], fallback: "EMBEDDING_FAILED" };
      }

      const data = (await response.json()) as {
        data: Array<{ embedding: number[] }>;
      };
      queryVector = data.data[0]?.embedding;
      if (!queryVector || queryVector.length !== 1536) {
        return { results: [], fallback: "EMBEDDING_FAILED" };
      }
    } catch {
      return { results: [], fallback: "EMBEDDING_FAILED" };
    }

    // 2. Vector similarity search
    const vectorStr = `[${queryVector.join(",")}]`;

    const workspaceFilter = workspaceId
      ? Prisma.sql`AND p."workspaceId" = ${workspaceId}`
      : Prisma.empty;

    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        paperId: string;
        idx: number;
        page: number | null;
        content: string;
        distance: number;
        title: string | null;
      }>
    >`
      SELECT
        c.id,
        c."paperId",
        c.idx,
        c.page,
        c.content,
        c.embedding <-> ${vectorStr}::vector AS distance,
        p.title
      FROM "PaperChunk" c
      JOIN "Paper" p ON p.id = c."paperId"
        AND p."isDeleted" = false
        AND p."uploaderId" = ${userId}
        ${workspaceFilter}
      WHERE c.embedding IS NOT NULL
        AND c."isDeleted" = false
      ORDER BY c.embedding <-> ${vectorStr}::vector
      LIMIT ${limit}
    `;

    return { results, fallback: null };
  }
}

