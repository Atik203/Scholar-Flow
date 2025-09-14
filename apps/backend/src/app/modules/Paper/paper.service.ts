import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";

// TypedSQL functions - temporarily using fallback approach
// until proper TypedSQL generation is confirmed
// import {
//   getPapersWithPagination,
//   countPapers,
//   searchPapers
// } from "@prisma/client/sql";

/**
 * Paper Service with optimized $queryRaw operations for all database interactions
 */
export class PaperService {
  /**
   * Get all papers using $queryRaw for optimized dynamic filtering
   * Source: optimized paper listing with search and uploader information
   */
  static async getAllWithDynamicFiltering(
    params: any,
    options: IPaginationOptions
  ) {
    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;

    let papers: any[];
    let totalResult: any[];

    // Handle search functionality across multiple fields
    if (params.search) {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail",
          (
            SELECT COUNT(*) 
            FROM "PaperChunk" pc 
            WHERE pc."paperId" = p.id
          ) as "chunkCount"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
          AND (
            p.title ILIKE ${`%${params.search}%`} 
            OR p.abstract ILIKE ${`%${params.search}%`} 
            OR p.source ILIKE ${`%${params.search}%`}
          )
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND (
            p.title ILIKE ${`%${params.search}%`} 
            OR p.abstract ILIKE ${`%${params.search}%`} 
            OR p.source ILIKE ${`%${params.search}%`}
          )
      `;
    } else {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail",
          (
            SELECT COUNT(*) 
            FROM "PaperChunk" pc 
            WHERE pc."paperId" = p.id
          ) as "chunkCount"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
      `;
    }

    const total = Number(totalResult[0]?.count || 0);
    const totalPage = Math.ceil(total / limit);

    // Structure the response to match Prisma's include format
    const papersWithIncludes = papers.map((paper) => ({
      ...paper,
      uploader: {
        id: paper.uploaderId,
        email: paper.uploaderEmail,
      },
      chunks: Array.from({ length: Number(paper.chunkCount) }, (_, i) => ({
        id: `chunk_${i}`,
      })),
    }));

    return {
      result: papersWithIncludes,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  }

  /**
   * Get papers using TypedSQL (for optimized, complex queries)
   * Source: apps/backend/prisma/sql/paper/getPapersWithPagination.sql
   */
  static async getAllWithTypedSQL(limit: number = 10, skip: number = 0) {
    try {
      // Use $queryRaw for optimized paper retrieval
      // Source: apps/backend/prisma/sql/paper/getPapersWithPagination.sql equivalent
      const [papers, totalResult] = await Promise.all([
        prisma.$queryRaw<any[]>`
          SELECT p.id, p.title, p.authors, p."fileName", p."uploadedAt", p."createdAt",
                 u.email as "uploaderEmail"
          FROM "Paper" p
          LEFT JOIN "User" u ON p."uploaderId" = u.id
          WHERE p."isDeleted" = false
          ORDER BY p."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `,
        prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "Paper"
          WHERE "isDeleted" = false
        `,
      ]);

      const total = Number(totalResult[0]?.count || 0);
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      return {
        result: papers,
        meta: {
          page,
          limit,
          total: Number(total),
          totalPage,
        },
      };
    } catch (error) {
      console.error("Error in getAllWithTypedSQL:", error);
      // Fallback to $queryRaw if primary method fails
      const [papers, totalResult] = await Promise.all([
        prisma.$queryRaw<any[]>`
          SELECT p.*, u.email as "uploaderEmail", u.id as "uploaderId"
          FROM "Paper" p
          LEFT JOIN "User" u ON p."uploaderId" = u.id
          WHERE p."isDeleted" = false
          ORDER BY p."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `,
        prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "Paper"
          WHERE "isDeleted" = false
        `,
      ]);

      const total = Number(totalResult[0]?.count || 0);

      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      return {
        result: papers,
        meta: {
          page,
          limit,
          total,
          totalPage,
        },
      };
    }
  }

  /**
   * Search papers using TypedSQL with relevance scoring
   * Source: apps/backend/prisma/sql/paper/searchPapers.sql
   */
  static async searchWithTypedSQL(searchTerm: string) {
    try {
      // Use $queryRaw for complex search with relevance scoring
      // Source: apps/backend/prisma/sql/paper/searchPapers.sql equivalent
      const papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.id,
          p.title,
          p.authors,
          p."fileName",
          p."uploadedAt",
          u.email as "uploaderEmail",
          (
            CASE 
              WHEN p.title ILIKE ${`%${searchTerm}%`} THEN 10 
              ELSE 0 
            END +
            CASE 
              WHEN p.authors ILIKE ${`%${searchTerm}%`} THEN 8 
              ELSE 0 
            END +
            CASE 
              WHEN p."extractedText" ILIKE ${`%${searchTerm}%`} THEN 5 
              ELSE 0 
            END
          ) as relevance_score
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE 
          p."isDeleted" = false
          AND (
            p.title ILIKE ${`%${searchTerm}%`} 
            OR p.authors ILIKE ${`%${searchTerm}%`} 
            OR p."extractedText" ILIKE ${`%${searchTerm}%`}
          )
        ORDER BY relevance_score DESC, p."createdAt" DESC
      `;

      return {
        result: papers,
        meta: {
          searchTerm,
          count: papers.length,
        },
      };
    } catch (error) {
      console.error("Error in searchWithTypedSQL:", error);
      // Fallback to basic $queryRaw if primary method fails
      const papers = await prisma.$queryRaw<any[]>`
          SELECT p.*, u.email as "uploaderEmail", u.id as "uploaderId"
          FROM "Paper" p
          LEFT JOIN "User" u ON p."uploaderId" = u.id
          WHERE p."isDeleted" = false
            AND (
              p.title ILIKE ${`%${searchTerm}%`} 
              OR p.abstract ILIKE ${`%${searchTerm}%`} 
              OR p.source ILIKE ${`%${searchTerm}%`}
            )
          ORDER BY p."createdAt" DESC
        `;

      return {
        result: papers,
        meta: {
          searchTerm,
          count: papers.length,
        },
      };
    }
  }

  /**
   * Get papers by status using simple $queryRaw for optimized filtering
   * Source: optimized single-table query with status filter
   */
  static async getByStatus(
    status: "active" | "deleted" = "active",
    limit: number = 10,
    skip: number = 0
  ) {
    try {
      const isDeleted = status === "deleted";

      const papers = await prisma.$queryRaw<any[]>`
        SELECT p.id, p.title, p.authors, p."fileName", p."uploadedAt", p."createdAt",
               u.email as "uploaderEmail", u.id as "uploaderId"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = ${isDeleted}
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Paper"
        WHERE "isDeleted" = ${isDeleted}
      `;

      const total = Number(totalResult[0]?.count || 0);
      const page = Math.floor(skip / limit) + 1;
      const totalPage = Math.ceil(total / limit);

      return {
        result: papers,
        meta: {
          page,
          limit,
          total,
          totalPage,
          status,
        },
      };
    } catch (error) {
      console.error("Error in getByStatus:", error);
      throw error;
    }
  }

  /**
   * Get paper by ID using $queryRaw with complex joins for complete paper data
   * Source: optimized paper retrieval with uploader, chunks, and collections
   */
  static async getById(id: string) {
    // Get paper with uploader data
    const papers = await prisma.$queryRaw<any[]>`
      SELECT 
        p.*,
        u.id as "uploaderId", u.email as "uploaderEmail", u.name as "uploaderName"
      FROM "Paper" p
      LEFT JOIN "User" u ON p."uploaderId" = u.id
      WHERE p.id = ${id} AND p."isDeleted" = false
      LIMIT 1
    `;

    if (papers.length === 0) {
      return null;
    }

    const paper = papers[0];

    // Get chunks for this paper
    const chunks = await prisma.$queryRaw<any[]>`
      SELECT id, idx, page, content, "createdAt"
      FROM "PaperChunk"
      WHERE "paperId" = ${id}
      ORDER BY idx ASC
    `;

    // Get collections containing this paper
    const collections = await prisma.$queryRaw<any[]>`
      SELECT 
        cp.id as "collectionPaperId",
        c.id as "collectionId", c.name as "collectionName"
      FROM "CollectionPaper" cp
      LEFT JOIN "Collection" c ON cp."collectionId" = c.id
      WHERE cp."paperId" = ${id} AND c."isDeleted" = false
    `;

    // Structure the response to match Prisma's include format
    return {
      ...paper,
      uploader: {
        id: paper.uploaderId,
        email: paper.uploaderEmail,
        name: paper.uploaderName,
      },
      chunks: chunks,
      collections: collections.map((col) => ({
        id: col.collectionPaperId,
        collection: {
          id: col.collectionId,
          name: col.collectionName,
        },
      })),
    };
  }

  /**
   * Create paper using $queryRaw for optimized paper creation
   * Source: optimized paper insertion with uploader data retrieval
   */
  static async create(data: any, uploaderId: string) {
    const paperId = data.id || require("uuid").v4();

    // Insert paper using $queryRaw
    await prisma.$queryRaw`
      INSERT INTO "Paper" (
        id, title, authors, abstract, "fileName", "uploadedAt", "extractedText",
        source, "uploaderId", "isDeleted", "createdAt", "updatedAt"
      ) VALUES (
        ${paperId}, ${data.title || null}, ${data.authors || null}, 
        ${data.abstract || null}, ${data.fileName || null}, 
        ${data.uploadedAt || new Date()}, ${data.extractedText || null},
        ${data.source || null}, ${uploaderId}, false, NOW(), NOW()
      )
    `;

    // Return paper with uploader data
    const papers = await prisma.$queryRaw<any[]>`
      SELECT p.*, u.email as "uploaderEmail", u.id as "uploaderId"
      FROM "Paper" p
      LEFT JOIN "User" u ON p."uploaderId" = u.id
      WHERE p.id = ${paperId}
      LIMIT 1
    `;

    return papers[0];
  }

  /**
   * Update paper using $queryRaw for optimized paper update
   * Source: optimized paper update with dynamic field handling
   */
  static async update(id: string, data: any) {
    // Update fields individually for better maintainability

    if (data.title !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET title = ${data.title}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }
    if (data.authors !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET authors = ${data.authors}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }
    if (data.abstract !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET abstract = ${data.abstract}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }
    if (data.fileName !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET "fileName" = ${data.fileName}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }
    if (data.extractedText !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET "extractedText" = ${data.extractedText}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }
    if (data.source !== undefined) {
      await prisma.$queryRaw`
        UPDATE "Paper" 
        SET source = ${data.source}, "updatedAt" = NOW()
        WHERE id = ${id} AND "isDeleted" = false
      `;
    }

    // Return updated paper with uploader data
    const papers = await prisma.$queryRaw<any[]>`
      SELECT p.*, u.email as "uploaderEmail", u.id as "uploaderId"
      FROM "Paper" p
      LEFT JOIN "User" u ON p."uploaderId" = u.id
      WHERE p.id = ${id} AND p."isDeleted" = false
      LIMIT 1
    `;

    return papers[0];
  }

  /**
   * Soft delete paper using $queryRaw for optimized deletion
   * Source: optimized soft delete operation
   */
  static async delete(id: string) {
    // Soft delete the paper
    await prisma.$queryRaw`
      UPDATE "Paper" 
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    // Return the updated paper
    const papers = await prisma.$queryRaw<any[]>`
      SELECT * FROM "Paper"
      WHERE id = ${id}
      LIMIT 1
    `;

    return papers[0];
  }

  /**
   * Get papers by user using $queryRaw for optimized user-specific paper retrieval
   * Source: optimized user paper query with search and pagination
   */
  static async getByUser(
    userId: string,
    params: any,
    options: IPaginationOptions
  ) {
    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;

    let papers: any[];
    let totalResult: any[];

    // Handle search functionality
    if (params.search) {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          (
            SELECT COUNT(*) 
            FROM "PaperChunk" pc 
            WHERE pc."paperId" = p.id
          ) as "chunkCount"
        FROM "Paper" p
        WHERE p."uploaderId" = ${userId} 
          AND p."isDeleted" = false
          AND (
            p.title ILIKE ${`%${params.search}%`} 
            OR p.abstract ILIKE ${`%${params.search}%`} 
            OR p.source ILIKE ${`%${params.search}%`}
          )
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."uploaderId" = ${userId} 
          AND p."isDeleted" = false
          AND (
            p.title ILIKE ${`%${params.search}%`} 
            OR p.abstract ILIKE ${`%${params.search}%`} 
            OR p.source ILIKE ${`%${params.search}%`}
          )
      `;
    } else {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          (
            SELECT COUNT(*) 
            FROM "PaperChunk" pc 
            WHERE pc."paperId" = p.id
          ) as "chunkCount"
        FROM "Paper" p
        WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
      `;
    }

    const total = Number(totalResult[0]?.count || 0);
    const totalPage = Math.ceil(total / limit);

    // Add chunks data to each paper
    const papersWithChunks = papers.map((paper) => ({
      ...paper,
      chunks: Array.from({ length: Number(paper.chunkCount) }, (_, i) => ({
        id: `chunk_${i}`,
      })),
    }));

    return {
      result: papersWithChunks,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  }

  /**
   * Get papers with date range filtering using $queryRaw for optimized date queries
   * Source: optimized date range filtering with uploader information
   */
  static async getByDateRange(
    startDate?: string,
    endDate?: string,
    options: IPaginationOptions = {}
  ) {
    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;

    let papers: any[];
    let totalResult: any[];

    // Build date conditions
    if (startDate && endDate) {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
          AND p."createdAt" >= ${new Date(startDate)}
          AND p."createdAt" <= ${new Date(endDate)}
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND p."createdAt" >= ${new Date(startDate)}
          AND p."createdAt" <= ${new Date(endDate)}
      `;
    } else if (startDate) {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
          AND p."createdAt" >= ${new Date(startDate)}
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND p."createdAt" >= ${new Date(startDate)}
      `;
    } else if (endDate) {
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
          AND p."createdAt" <= ${new Date(endDate)}
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND p."createdAt" <= ${new Date(endDate)}
      `;
    } else {
      // No date filtering
      papers = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          u.id as "uploaderId", u.email as "uploaderEmail"
        FROM "Paper" p
        LEFT JOIN "User" u ON p."uploaderId" = u.id
        WHERE p."isDeleted" = false
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM "Paper" p
        WHERE p."isDeleted" = false
      `;
    }

    const total = Number(totalResult[0]?.count || 0);
    const totalPage = Math.ceil(total / limit);

    // Structure the response to match Prisma's include format
    const papersWithUploader = papers.map((paper) => ({
      ...paper,
      uploader: {
        id: paper.uploaderId,
        email: paper.uploaderEmail,
      },
    }));

    return {
      result: papersWithUploader,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  }
}

export const paperService = {
  getAllWithDynamicFiltering: PaperService.getAllWithDynamicFiltering,
  getAllWithTypedSQL: PaperService.getAllWithTypedSQL,
  searchWithTypedSQL: PaperService.searchWithTypedSQL,
  getByStatus: PaperService.getByStatus,
  getById: PaperService.getById,
  create: PaperService.create,
  update: PaperService.update,
  delete: PaperService.delete,
  getByUser: PaperService.getByUser,
  getByDateRange: PaperService.getByDateRange,
};
