import prisma from "../../shared/prisma";

/**
 * Collection Service with optimized $queryRaw operations
 */
export class CollectionService {
  /**
   * Get collection statistics using $queryRaw for optimized aggregation
   * Source: optimized collection stats with paper counts and user activity
   */
  static async getCollectionStats() {
    try {
      const stats = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(*) as "totalCollections",
          COUNT(CASE WHEN "isPublic" = true THEN 1 END) as "publicCollections",
          COUNT(CASE WHEN "isPublic" = false THEN 1 END) as "privateCollections",
          AVG(paper_counts.paper_count) as "avgPapersPerCollection"
        FROM "Collection" c
        LEFT JOIN (
          SELECT "collectionId", COUNT(*) as paper_count
          FROM "CollectionPaper"
          GROUP BY "collectionId"
        ) paper_counts ON c.id = paper_counts."collectionId"
        WHERE c."isDeleted" = false
      `;

      return (
        stats[0] || {
          totalCollections: 0,
          publicCollections: 0,
          privateCollections: 0,
          avgPapersPerCollection: 0,
        }
      );
    } catch (error) {
      console.error("Error getting collection stats:", error);
      throw error;
    }
  }

  /**
   * Get collections with paper counts using $queryRaw
   * Source: optimized collections list with aggregated paper counts
   */
  static async getCollectionsWithCounts(
    limit: number = 10,
    skip: number = 0,
    isPublic?: boolean
  ) {
    try {
      let collections: any[];

      if (isPublic !== undefined) {
        collections = await prisma.$queryRaw<any[]>`
          SELECT 
            c.id,
            c.name,
            c.description,
            c."isPublic",
            c."createdAt",
            c."updatedAt",
            u.email as "ownerEmail",
            u.name as "ownerName",
            COALESCE(COUNT(cp.id), 0) as "paperCount"
          FROM "Collection" c
          LEFT JOIN "User" u ON c."ownerId" = u.id
          LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
          WHERE c."isDeleted" = false AND c."isPublic" = ${isPublic}
          GROUP BY c.id, u.email, u.name
          ORDER BY c."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;
      } else {
        collections = await prisma.$queryRaw<any[]>`
          SELECT 
            c.id,
            c.name,
            c.description,
            c."isPublic",
            c."createdAt",
            c."updatedAt",
            u.email as "ownerEmail",
            u.name as "ownerName",
            COALESCE(COUNT(cp.id), 0) as "paperCount"
          FROM "Collection" c
          LEFT JOIN "User" u ON c."ownerId" = u.id
          LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
          WHERE c."isDeleted" = false
          GROUP BY c.id, u.email, u.name
          ORDER BY c."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;
      }

      // Get total count
      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Collection"
        WHERE "isDeleted" = false
        ${isPublic !== undefined ? prisma.$queryRaw`AND "isPublic" = ${isPublic}` : prisma.$queryRaw``}
      `;

      const total = Number(totalResult[0]?.count || 0);
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      return {
        result: collections,
        meta: {
          page,
          limit,
          total,
          totalPage,
        },
      };
    } catch (error) {
      console.error("Error getting collections with counts:", error);
      throw error;
    }
  }

  /**
   * Get user's collections using $queryRaw for optimized filtering
   * Source: optimized user collection retrieval with paper counts
   */
  static async getUserCollections(
    userId: string,
    limit: number = 10,
    skip: number = 0
  ) {
    try {
      const collections = await prisma.$queryRaw<any[]>`
        SELECT 
          c.id,
          c.name,
          c.description,
          c."isPublic",
          c."createdAt",
          c."updatedAt",
          COALESCE(COUNT(cp.id), 0) as "paperCount"
        FROM "Collection" c
        LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
        WHERE c."ownerId" = ${userId} AND c."isDeleted" = false
        GROUP BY c.id
        ORDER BY c."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Collection"
        WHERE "ownerId" = ${userId} AND "isDeleted" = false
      `;

      const total = Number(totalResult[0]?.count || 0);
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      return {
        result: collections,
        meta: {
          page,
          limit,
          total,
          totalPage,
        },
      };
    } catch (error) {
      console.error("Error getting user collections:", error);
      throw error;
    }
  }

  /**
   * Search collections using $queryRaw with text matching
   * Source: optimized collection search with relevance scoring
   */
  static async searchCollections(
    searchTerm: string,
    limit: number = 10,
    skip: number = 0
  ) {
    try {
      const collections = await prisma.$queryRaw<any[]>`
        SELECT 
          c.id,
          c.name,
          c.description,
          c."isPublic",
          c."createdAt",
          c."updatedAt",
          u.email as "ownerEmail",
          u.name as "ownerName",
          COALESCE(COUNT(cp.id), 0) as "paperCount",
          (
            CASE 
              WHEN c.name ILIKE ${`%${searchTerm}%`} THEN 10 
              ELSE 0 
            END +
            CASE 
              WHEN c.description ILIKE ${`%${searchTerm}%`} THEN 5 
              ELSE 0 
            END
          ) as relevance_score
        FROM "Collection" c
        LEFT JOIN "User" u ON c."ownerId" = u.id
        LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
        WHERE c."isDeleted" = false
          AND (
            c.name ILIKE ${`%${searchTerm}%`} 
            OR c.description ILIKE ${`%${searchTerm}%`}
          )
        GROUP BY c.id, u.email, u.name
        ORDER BY relevance_score DESC, c."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      return {
        result: collections,
        meta: {
          searchTerm,
          count: collections.length,
        },
      };
    } catch (error) {
      console.error("Error searching collections:", error);
      throw error;
    }
  }
}

export const collectionService = {
  getCollectionStats: CollectionService.getCollectionStats,
  getCollectionsWithCounts: CollectionService.getCollectionsWithCounts,
  getUserCollections: CollectionService.getUserCollections,
  searchCollections: CollectionService.searchCollections,
};
