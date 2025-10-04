import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

type CollectionAggregateRow = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  workspaceId: string | null;
  ownerEmail: string | null;
  ownerName: string | null;
  paperCount: number;
  memberCount: number;
};

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
      const stats = await prisma.$queryRaw<
        Array<{
          totalCollections: number;
          publicCollections: number;
          privateCollections: number;
          avgPapersPerCollection: number;
        }>
      >`
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
      const visibilityFilter =
        isPublic !== undefined
          ? Prisma.sql`AND c."isPublic" = ${isPublic}`
          : Prisma.empty;

      const collections = await prisma.$queryRaw<CollectionAggregateRow[]>`
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
          COALESCE(paper_counts.paper_count, 0)::int as "paperCount",
          COALESCE(member_counts.member_count, 0)::int as "memberCount"
        FROM "Collection" c
        LEFT JOIN "User" u ON c."ownerId" = u.id
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS paper_count
          FROM "CollectionPaper"
          WHERE "isDeleted" = false
          GROUP BY "collectionId"
        ) paper_counts ON paper_counts."collectionId" = c.id
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS member_count
          FROM "CollectionMember"
          WHERE "isDeleted" = false AND status = 'ACCEPTED'
          GROUP BY "collectionId"
        ) member_counts ON member_counts."collectionId" = c.id
        WHERE c."isDeleted" = false
        ${visibilityFilter}
        ORDER BY c."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalCount = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int as count
        FROM "Collection" c
        WHERE c."isDeleted" = false
        ${visibilityFilter}
      `;

      const total = totalCount[0]?.count || 0;
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      const transformedCollections = collections.map((collection) => ({
        ...collection,
        owner: {
          id: collection.ownerId,
          name: collection.ownerName || "Unknown",
          email: collection.ownerEmail || "unknown@example.com",
        },
        _count: {
          papers: collection.paperCount,
          members: collection.memberCount ?? 0,
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

      const workspaceFilter = ws
        ? Prisma.sql`AND c."workspaceId" = ${ws}`
        : Prisma.empty;

      const collections = await prisma.$queryRaw<CollectionAggregateRow[]>`
        WITH accessible AS (
          SELECT 
            c.id,
            c.name,
            c.description,
            c."isPublic",
            c."createdAt",
            c."updatedAt",
            c."ownerId",
            c."workspaceId"
          FROM "Collection" c
          LEFT JOIN "CollectionMember" cm
            ON c.id = cm."collectionId" AND cm."isDeleted" = false
          WHERE c."isDeleted" = false
            AND (
              c."ownerId" = ${userId} 
              OR (cm."userId" = ${userId} AND cm."status" = 'ACCEPTED')
            )
            ${workspaceFilter}
          GROUP BY c.id
        )
        SELECT 
          a.id,
          a.name,
          a.description,
          a."isPublic",
          a."createdAt",
          a."updatedAt",
          a."ownerId",
          a."workspaceId",
          u.email AS "ownerEmail",
          u.name AS "ownerName",
          COALESCE(paper_counts.paper_count, 0)::int AS "paperCount",
          COALESCE(member_counts.member_count, 0)::int AS "memberCount"
        FROM accessible a
        LEFT JOIN "User" u ON u.id = a."ownerId"
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS paper_count
          FROM "CollectionPaper"
          WHERE "isDeleted" = false
          GROUP BY "collectionId"
        ) paper_counts ON paper_counts."collectionId" = a.id
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS member_count
          FROM "CollectionMember"
          WHERE "isDeleted" = false AND status = 'ACCEPTED'
          GROUP BY "collectionId"
        ) member_counts ON member_counts."collectionId" = a.id
        ORDER BY a."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔍 getUserCollections - userId: ${userId}, found ${collections.length} collections`
        );
      }

      const totalResult = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int as count
        FROM (
          SELECT c.id
          FROM "Collection" c
          LEFT JOIN "CollectionMember" cm
            ON c.id = cm."collectionId" AND cm."isDeleted" = false
          WHERE c."isDeleted" = false 
            AND (
              c."ownerId" = ${userId} 
              OR (cm."userId" = ${userId} AND cm."status" = 'ACCEPTED')
            )
            ${workspaceFilter}
          GROUP BY c.id
        ) accessible_ids
      `;

      const total = totalResult[0]?.count || 0;
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      const transformedCollections = collections.map((collection) => ({
        ...collection,
        owner: {
          id: collection.ownerId,
          name: collection.ownerName || "Unknown",
          email: collection.ownerEmail || "unknown@example.com",
        },
        _count: {
          papers: collection.paperCount,
          members: collection.memberCount ?? 0,
        },
      }));

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

  static async searchCollections(
    searchTerm: string,
    limit: number = 10,
    skip: number = 0
  ) {
    try {
      const collections = await prisma.$queryRaw<CollectionAggregateRow[]>`
        SELECT 
          c.id,
          c.name,
          c.description,
          c."isPublic",
          c."createdAt",
          c."updatedAt",
          u.email as "ownerEmail",
          u.name as "ownerName",
          COALESCE(paper_counts.paper_count, 0)::int as "paperCount",
          COALESCE(member_counts.member_count, 0)::int as "memberCount",
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
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS paper_count
          FROM "CollectionPaper"
          WHERE "isDeleted" = false
          GROUP BY "collectionId"
        ) paper_counts ON paper_counts."collectionId" = c.id
        LEFT JOIN (
          SELECT "collectionId", COUNT(*)::int AS member_count
          FROM "CollectionMember"
          WHERE "isDeleted" = false AND status = 'ACCEPTED'
          GROUP BY "collectionId"
        ) member_counts ON member_counts."collectionId" = c.id
        WHERE c."isDeleted" = false
          AND (
            c.name ILIKE ${`%${searchTerm}%`} 
            OR c.description ILIKE ${`%${searchTerm}%`}
          )
        ORDER BY relevance_score DESC, c."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const transformedCollections = collections.map((collection) => ({
        ...collection,
        owner: {
          id: collection.ownerId,
          name: collection.ownerName || "Unknown",
          email: collection.ownerEmail || "unknown@example.com",
        },
        _count: {
          papers: collection.paperCount,
          members: collection.memberCount ?? 0,
        },
      }));

      return {
        result: transformedCollections,
        meta: {
          searchTerm,
          count: transformedCollections.length,
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
      const result = await prisma.$queryRaw<
        Array<{ hasEditPermission: boolean }>
      >`
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
      const result = await prisma.$queryRaw<
        Array<{ permission: "OWNER" | "EDIT" | "VIEW" | null }>
      >`
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
