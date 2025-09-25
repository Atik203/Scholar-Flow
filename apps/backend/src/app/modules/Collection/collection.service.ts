import { Prisma } from "@prisma/client";
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
          COUNT(*)::int as "totalCollections",
          COUNT(CASE WHEN "isPublic" = true THEN 1 END)::int as "publicCollections",
          COUNT(CASE WHEN "isPublic" = false THEN 1 END)::int as "privateCollections",
          COALESCE(AVG(paper_counts.paper_count), 0)::float as "avgPapersPerCollection"
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
      let totalCount: any[];

      if (isPublic !== undefined) {
        collections = await prisma.$queryRaw<any[]>`
          SELECT 
            c.id,
            c.name,
            c.description,
            c."isPublic",
            c."createdAt",
            c."updatedAt",
            c."ownerId",
            c."workspaceId",
            u.email as "ownerEmail",
            u.name as "ownerName",
            COALESCE(COUNT(cp.id), 0)::int as "paperCount"
          FROM "Collection" c
          LEFT JOIN "User" u ON c."ownerId" = u.id
          LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId" AND cp."isDeleted" = false
          WHERE c."isDeleted" = false AND c."isPublic" = ${isPublic}
          GROUP BY c.id, u.email, u.name, c."ownerId", c."workspaceId"
          ORDER BY c."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalCount = await prisma.$queryRaw<any[]>`
          SELECT COUNT(*)::int as count
          FROM "Collection"
          WHERE "isDeleted" = false AND "isPublic" = ${isPublic}
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
            c."ownerId",
            c."workspaceId",
            u.email as "ownerEmail",
            u.name as "ownerName",
            COALESCE(COUNT(cp.id), 0)::int as "paperCount"
          FROM "Collection" c
          LEFT JOIN "User" u ON c."ownerId" = u.id
          LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId" AND cp."isDeleted" = false
          WHERE c."isDeleted" = false
          GROUP BY c.id, u.email, u.name, c."ownerId", c."workspaceId"
          ORDER BY c."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalCount = await prisma.$queryRaw<any[]>`
          SELECT COUNT(*)::int as count
          FROM "Collection"
          WHERE "isDeleted" = false
        `;
      }

      const total = totalCount[0]?.count || 0;
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      // Transform the data to match the expected frontend format
      const transformedCollections = collections.map((collection) => ({
        ...collection,
        owner: {
          id: collection.ownerId,
          name: collection.ownerName,
          email: collection.ownerEmail,
        },
        _count: {
          papers: collection.paperCount,
          members: 0, // Default value, can be enhanced later
        },
      }));

      return {
        result: transformedCollections,
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
    skip: number = 0,
    workspaceId?: string
  ) {
    try {
      // Normalize workspaceId: treat empty string or whitespace as no filter
      const ws: string | null =
        workspaceId && workspaceId.trim() !== "" ? workspaceId : null;

      const collections = await prisma.$queryRaw<any[]>`
        SELECT DISTINCT
          c.id,
          c.name,
          c.description,
          c."isPublic",
          c."createdAt",
          c."updatedAt",
          c."ownerId",
          c."workspaceId",
          COALESCE(COUNT(cp.id), 0)::int as "paperCount"
        FROM "Collection" c
        LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId" AND cp."isDeleted" = false
        LEFT JOIN "CollectionMember" cm ON c.id = cm."collectionId" AND cm."isDeleted" = false
        WHERE c."isDeleted" = false 
          AND (
            c."ownerId" = ${userId} 
            OR (cm."userId" = ${userId} AND cm."status" = 'ACCEPTED')
          )
          ${ws ? Prisma.sql`AND c."workspaceId" = ${ws}` : Prisma.empty}
        GROUP BY c.id, c."ownerId", c."workspaceId"
        ORDER BY c."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔍 getUserCollections - userId: ${userId}, found ${collections.length} collections`
        );
      }

      const totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(DISTINCT c.id)::int as count
        FROM "Collection" c
        LEFT JOIN "CollectionMember" cm ON c.id = cm."collectionId" AND cm."isDeleted" = false
        WHERE c."isDeleted" = false 
          AND (
            c."ownerId" = ${userId} 
            OR (cm."userId" = ${userId} AND cm."status" = 'ACCEPTED')
          )
          ${ws ? Prisma.sql`AND c."workspaceId" = ${ws}` : Prisma.empty}
      `;

      const total = totalResult[0]?.count || 0;
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      // Get owner information for each collection
      const ownerIds = [...new Set(collections.map((c) => c.ownerId))];
      const owners = await prisma.user.findMany({
        where: { id: { in: ownerIds } },
        select: { id: true, name: true, email: true },
      });

      const ownerMap = new Map(owners.map((owner) => [owner.id, owner]));

      // Transform the data to match the expected frontend format
      const transformedCollections = collections.map((collection) => {
        const owner = ownerMap.get(collection.ownerId);
        return {
          ...collection,
          owner: {
            id: collection.ownerId,
            name: owner?.name || "Unknown",
            email: owner?.email || "unknown@example.com",
          },
          _count: {
            papers: collection.paperCount,
            members: 0, // Default value, can be enhanced later
          },
        };
      });

      if (process.env.NODE_ENV === "development") {
        console.log(
          `📊 getUserCollections - returning ${transformedCollections.length} collections, total: ${total}`
        );
      }

      return {
        result: transformedCollections,
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
          COALESCE(COUNT(cp.id), 0)::int as "paperCount",
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

  /**
   * Check if a user has edit permission for a collection
   * Returns true if user is the owner or has EDIT permission as a member
   * Source: permission checking for collection operations
   */
  static async hasEditPermission(
    collectionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<any[]>`
        SELECT 
          CASE 
            WHEN c."ownerId" = ${userId} THEN true
            WHEN cm."permission" = 'EDIT' AND cm.status = 'ACCEPTED' THEN true
            ELSE false
          END as "hasEditPermission"
        FROM "Collection" c
        LEFT JOIN "CollectionMember" cm ON c.id = cm."collectionId" AND cm."userId" = ${userId}
        WHERE c.id = ${collectionId} AND c."isDeleted" = false
        LIMIT 1
      `;

      return result[0]?.hasEditPermission === true;
    } catch (error) {
      console.error("Error checking edit permission:", error);
      throw error;
    }
  }

  /**
   * Get user's permission level for a collection
   * Returns 'OWNER', 'EDIT', 'VIEW', or null if no access
   * Source: get specific permission level for UI rendering
   */
  static async getUserPermission(
    collectionId: string,
    userId: string
  ): Promise<"OWNER" | "EDIT" | "VIEW" | null> {
    try {
      const result = await prisma.$queryRaw<any[]>`
        SELECT 
          CASE 
            WHEN c."ownerId" = ${userId} THEN 'OWNER'
            WHEN cm."permission" = 'EDIT' AND cm.status = 'ACCEPTED' THEN 'EDIT'
            WHEN cm."permission" = 'VIEW' AND cm.status = 'ACCEPTED' THEN 'VIEW'
            ELSE NULL
          END as "permission"
        FROM "Collection" c
        LEFT JOIN "CollectionMember" cm ON c.id = cm."collectionId" AND cm."userId" = ${userId}
        WHERE c.id = ${collectionId} AND c."isDeleted" = false
        LIMIT 1
      `;

      return result[0]?.permission || null;
    } catch (error) {
      console.error("Error getting user permission:", error);
      throw error;
    }
  }
}

export const collectionService = {
  getCollectionStats: CollectionService.getCollectionStats,
  getCollectionsWithCounts: CollectionService.getCollectionsWithCounts,
  getUserCollections: CollectionService.getUserCollections,
  searchCollections: CollectionService.searchCollections,
  hasEditPermission: CollectionService.hasEditPermission,
  getUserPermission: CollectionService.getUserPermission,
};
