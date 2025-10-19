import { randomUUID } from "crypto";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import {
  CreateAnnotationInput,
  CreateAnnotationReplyInput,
  GetAnnotationsQuery,
  UpdateAnnotationInput,
} from "./annotation.types";

export class AnnotationService {
  /**
   * Create a new annotation using $executeRaw
   * Source: Optimized annotation creation with raw SQL
   */
  static async createAnnotation(userId: string, data: CreateAnnotationInput) {
    const annotationId = randomUUID();
    const now = new Date();

    try {
      // Insert annotation using $executeRaw
      await prisma.$executeRaw`
        INSERT INTO "Annotation" (
          id, "paperId", "userId", type, anchor, text, "parentId", version, 
          "createdAt", "updatedAt", "isDeleted"
        )
        VALUES (
          ${annotationId}, ${data.paperId}, ${userId}, ${data.type}::"AnnotationType",
          ${JSON.stringify(data.anchor)}::jsonb, ${data.text}, ${data.parentId || null},
          1, ${now}, ${now}, false
        )
      `;

      // Fetch the created annotation with all related data using $queryRaw
      const annotations = await prisma.$queryRaw<any[]>`
        SELECT 
          a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
          a."parentId", a."createdAt", a."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          json_build_object(
            'id', p.id,
            'title', p.title
          ) as paper,
          CASE WHEN a."parentId" IS NOT NULL THEN
            json_build_object(
              'id', parent_a.id,
              'text', parent_a.text,
              'user', json_build_object(
                'id', parent_u.id,
                'name', parent_u.name,
                'email', parent_u.email,
                'image', parent_u.image
              )
            )
          ELSE NULL END as parent,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', child_a.id,
                  'text', child_a.text,
                  'createdAt', child_a."createdAt",
                  'user', json_build_object(
                    'id', child_u.id,
                    'name', child_u.name,
                    'email', child_u.email,
                    'image', child_u.image
                  )
                ) ORDER BY child_a."createdAt" ASC
              )
              FROM "Annotation" child_a
              LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
              WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
            ),
            '[]'::json
          ) as children
        FROM "Annotation" a
        LEFT JOIN "User" u ON a."userId" = u.id
        LEFT JOIN "Paper" p ON a."paperId" = p.id
        LEFT JOIN "Annotation" parent_a ON a."parentId" = parent_a.id
        LEFT JOIN "User" parent_u ON parent_a."userId" = parent_u.id
        WHERE a.id = ${annotationId}
        LIMIT 1
      `;

      if (annotations.length === 0) {
        throw new ApiError(500, "Failed to create annotation");
      }

      return annotations[0];
    } catch (error) {
      console.error("Error creating annotation:", error);
      throw new ApiError(500, "Failed to create annotation");
    }
  }

  /**
   * Get annotations for a paper using $queryRaw
   * Source: Optimized annotation retrieval with filtering
   */
  static async getPaperAnnotations(query: GetAnnotationsQuery) {
    try {
      // Build base query based on filters
      if (query.page !== undefined && query.type) {
        // Filter by both page and type
        const annotations = await prisma.$queryRaw<any[]>`
          SELECT 
            a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
            a."parentId", a."createdAt", a."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', child_a.id,
                    'text', child_a.text,
                    'createdAt', child_a."createdAt",
                    'updatedAt', child_a."updatedAt",
                    'user', json_build_object(
                      'id', child_u.id,
                      'name', child_u.name,
                      'email', child_u.email,
                      'image', child_u.image
                    )
                  ) ORDER BY child_a."createdAt" ASC
                )
                FROM "Annotation" child_a
                LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
                WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
              ),
              '[]'::json
            ) as children,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', av.id,
                    'version', av.version,
                    'text', av.text,
                    'timestamp', av.timestamp,
                    'changedBy', json_build_object(
                      'id', av_u.id,
                      'name', av_u.name,
                      'email', av_u.email
                    )
                  ) ORDER BY av.timestamp DESC
                )
                FROM (
                  SELECT * FROM "AnnotationVersion" 
                  WHERE "annotationId" = a.id 
                  ORDER BY timestamp DESC 
                  LIMIT 5
                ) av
                LEFT JOIN "User" av_u ON av."changedById" = av_u.id
              ),
              '[]'::json
            ) as versions
          FROM "Annotation" a
          LEFT JOIN "User" u ON a."userId" = u.id
          WHERE a."paperId" = ${query.paperId} 
            AND a."isDeleted" = false
            AND (a.anchor->>'page')::int = ${query.page}
            AND a.type = ${query.type}::"AnnotationType"
          ORDER BY a."createdAt" ASC
        `;
        return annotations;
      } else if (query.page !== undefined) {
        // Filter by page only
        const annotations = await prisma.$queryRaw<any[]>`
          SELECT 
            a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
            a."parentId", a."createdAt", a."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', child_a.id,
                    'text', child_a.text,
                    'createdAt', child_a."createdAt",
                    'updatedAt', child_a."updatedAt",
                    'user', json_build_object(
                      'id', child_u.id,
                      'name', child_u.name,
                      'email', child_u.email,
                      'image', child_u.image
                    )
                  ) ORDER BY child_a."createdAt" ASC
                )
                FROM "Annotation" child_a
                LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
                WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
              ),
              '[]'::json
            ) as children,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', av.id,
                    'version', av.version,
                    'text', av.text,
                    'timestamp', av.timestamp,
                    'changedBy', json_build_object(
                      'id', av_u.id,
                      'name', av_u.name,
                      'email', av_u.email
                    )
                  ) ORDER BY av.timestamp DESC
                )
                FROM (
                  SELECT * FROM "AnnotationVersion" 
                  WHERE "annotationId" = a.id 
                  ORDER BY timestamp DESC 
                  LIMIT 5
                ) av
                LEFT JOIN "User" av_u ON av."changedById" = av_u.id
              ),
              '[]'::json
            ) as versions
          FROM "Annotation" a
          LEFT JOIN "User" u ON a."userId" = u.id
          WHERE a."paperId" = ${query.paperId} 
            AND a."isDeleted" = false
            AND (a.anchor->>'page')::int = ${query.page}
          ORDER BY a."createdAt" ASC
        `;
        return annotations;
      } else if (query.type) {
        // Filter by type only
        const annotations = await prisma.$queryRaw<any[]>`
          SELECT 
            a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
            a."parentId", a."createdAt", a."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', child_a.id,
                    'text', child_a.text,
                    'createdAt', child_a."createdAt",
                    'updatedAt', child_a."updatedAt",
                    'user', json_build_object(
                      'id', child_u.id,
                      'name', child_u.name,
                      'email', child_u.email,
                      'image', child_u.image
                    )
                  ) ORDER BY child_a."createdAt" ASC
                )
                FROM "Annotation" child_a
                LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
                WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
              ),
              '[]'::json
            ) as children,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', av.id,
                    'version', av.version,
                    'text', av.text,
                    'timestamp', av.timestamp,
                    'changedBy', json_build_object(
                      'id', av_u.id,
                      'name', av_u.name,
                      'email', av_u.email
                    )
                  ) ORDER BY av.timestamp DESC
                )
                FROM (
                  SELECT * FROM "AnnotationVersion" 
                  WHERE "annotationId" = a.id 
                  ORDER BY timestamp DESC 
                  LIMIT 5
                ) av
                LEFT JOIN "User" av_u ON av."changedById" = av_u.id
              ),
              '[]'::json
            ) as versions
          FROM "Annotation" a
          LEFT JOIN "User" u ON a."userId" = u.id
          WHERE a."paperId" = ${query.paperId} 
            AND a."isDeleted" = false
            AND a.type = ${query.type}::"AnnotationType"
          ORDER BY a."createdAt" ASC
        `;
        return annotations;
      } else {
        // No filters - return all annotations for the paper
        const annotations = await prisma.$queryRaw<any[]>`
          SELECT 
            a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
            a."parentId", a."createdAt", a."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', child_a.id,
                    'text', child_a.text,
                    'createdAt', child_a."createdAt",
                    'updatedAt', child_a."updatedAt",
                    'user', json_build_object(
                      'id', child_u.id,
                      'name', child_u.name,
                      'email', child_u.email,
                      'image', child_u.image
                    )
                  ) ORDER BY child_a."createdAt" ASC
                )
                FROM "Annotation" child_a
                LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
                WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
              ),
              '[]'::json
            ) as children,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', av.id,
                    'version', av.version,
                    'text', av.text,
                    'timestamp', av.timestamp,
                    'changedBy', json_build_object(
                      'id', av_u.id,
                      'name', av_u.name,
                      'email', av_u.email
                    )
                  ) ORDER BY av.timestamp DESC
                )
                FROM (
                  SELECT * FROM "AnnotationVersion" 
                  WHERE "annotationId" = a.id 
                  ORDER BY timestamp DESC 
                  LIMIT 5
                ) av
                LEFT JOIN "User" av_u ON av."changedById" = av_u.id
              ),
              '[]'::json
            ) as versions
          FROM "Annotation" a
          LEFT JOIN "User" u ON a."userId" = u.id
          WHERE a."paperId" = ${query.paperId} 
            AND a."isDeleted" = false
          ORDER BY a."createdAt" ASC
        `;
        return annotations;
      }
    } catch (error) {
      console.error("Error fetching paper annotations:", error);
      throw new ApiError(500, "Failed to fetch annotations");
    }
  }

  /**
   * Update an annotation using raw SQL
   * Source: Optimized annotation update with version history
   */
  static async updateAnnotation(
    annotationId: string,
    userId: string,
    data: UpdateAnnotationInput
  ) {
    try {
      // Get current annotation using $queryRaw
      const currentAnnotations = await prisma.$queryRaw<any[]>`
        SELECT id, "userId", text, version, anchor
        FROM "Annotation"
        WHERE id = ${annotationId} AND "isDeleted" = false
        LIMIT 1
      `;

      if (currentAnnotations.length === 0) {
        throw new ApiError(404, "Annotation not found");
      }

      const currentAnnotation = currentAnnotations[0];

      if (currentAnnotation.userId !== userId) {
        throw new ApiError(403, "Unauthorized to update this annotation");
      }

      // Create version record if text is being updated
      if (data.text) {
        const versionId = randomUUID();
        const now = new Date();

        await prisma.$executeRaw`
          INSERT INTO "AnnotationVersion" (
            id, "annotationId", version, text, "changedById", timestamp,
            "createdAt", "updatedAt", "isDeleted"
          )
          VALUES (
            ${versionId}, ${annotationId}, ${currentAnnotation.version},
            ${currentAnnotation.text}, ${userId}, ${now}, ${now}, ${now}, false
          )
        `;
      }

      // Update annotation using $executeRaw
      const now = new Date();
      const newVersion = data.text
        ? currentAnnotation.version + 1
        : currentAnnotation.version;
      const newText = data.text || currentAnnotation.text;
      const newAnchor = data.anchor
        ? JSON.stringify(data.anchor)
        : JSON.stringify(currentAnnotation.anchor);

      await prisma.$executeRaw`
        UPDATE "Annotation"
        SET text = ${newText},
            version = ${newVersion},
            anchor = ${newAnchor}::jsonb,
            "updatedAt" = ${now}
        WHERE id = ${annotationId}
      `;

      // Fetch updated annotation with relations
      const updatedAnnotations = await prisma.$queryRaw<any[]>`
        SELECT 
          a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
          a."parentId", a."createdAt", a."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', child_a.id,
                  'text', child_a.text,
                  'createdAt', child_a."createdAt",
                  'updatedAt', child_a."updatedAt",
                  'user', json_build_object(
                    'id', child_u.id,
                    'name', child_u.name,
                    'email', child_u.email,
                    'image', child_u.image
                  )
                ) ORDER BY child_a."createdAt" ASC
              )
              FROM "Annotation" child_a
              LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
              WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
            ),
            '[]'::json
          ) as children
        FROM "Annotation" a
        LEFT JOIN "User" u ON a."userId" = u.id
        WHERE a.id = ${annotationId}
        LIMIT 1
      `;

      return updatedAnnotations[0];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error updating annotation:", error);
      throw new ApiError(500, "Failed to update annotation");
    }
  }

  /**
   * Delete an annotation using raw SQL (soft delete)
   * Source: Optimized soft delete for annotations
   */
  static async deleteAnnotation(annotationId: string, userId: string) {
    try {
      // Check annotation exists and belongs to user
      const annotations = await prisma.$queryRaw<any[]>`
        SELECT id, "userId"
        FROM "Annotation"
        WHERE id = ${annotationId} AND "isDeleted" = false
        LIMIT 1
      `;

      if (annotations.length === 0) {
        throw new ApiError(404, "Annotation not found");
      }

      if (annotations[0].userId !== userId) {
        throw new ApiError(403, "Unauthorized to delete this annotation");
      }

      // Soft delete
      const now = new Date();
      await prisma.$executeRaw`
        UPDATE "Annotation"
        SET "isDeleted" = true, "updatedAt" = ${now}
        WHERE id = ${annotationId}
      `;

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error deleting annotation:", error);
      throw new ApiError(500, "Failed to delete annotation");
    }
  }

  /**
   * Create a reply to an annotation using raw SQL
   * Source: Optimized annotation reply creation
   */
  static async createAnnotationReply(
    annotationId: string,
    userId: string,
    data: CreateAnnotationReplyInput
  ) {
    try {
      // Verify parent annotation exists
      const parentAnnotations = await prisma.$queryRaw<any[]>`
        SELECT id, "paperId", anchor
        FROM "Annotation"
        WHERE id = ${annotationId} AND "isDeleted" = false
        LIMIT 1
      `;

      if (parentAnnotations.length === 0) {
        throw new ApiError(404, "Parent annotation not found");
      }

      const parentAnnotation = parentAnnotations[0];
      const replyId = randomUUID();
      const now = new Date();

      // Create reply annotation
      await prisma.$executeRaw`
        INSERT INTO "Annotation" (
          id, "paperId", "userId", type, anchor, text, "parentId", version,
          "createdAt", "updatedAt", "isDeleted"
        )
        VALUES (
          ${replyId}, ${parentAnnotation.paperId}, ${userId}, 
          'COMMENT'::"AnnotationType", ${JSON.stringify(parentAnnotation.anchor)}::jsonb,
          ${data.text}, ${annotationId}, 1, ${now}, ${now}, false
        )
      `;

      // Fetch created reply with relations
      const replies = await prisma.$queryRaw<any[]>`
        SELECT 
          a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
          a."parentId", a."createdAt", a."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          json_build_object(
            'id', parent_a.id,
            'text', parent_a.text,
            'user', json_build_object(
              'id', parent_u.id,
              'name', parent_u.name,
              'email', parent_u.email,
              'image', parent_u.image
            )
          ) as parent
        FROM "Annotation" a
        LEFT JOIN "User" u ON a."userId" = u.id
        LEFT JOIN "Annotation" parent_a ON a."parentId" = parent_a.id
        LEFT JOIN "User" parent_u ON parent_a."userId" = parent_u.id
        WHERE a.id = ${replyId}
        LIMIT 1
      `;

      return replies[0];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error creating annotation reply:", error);
      throw new ApiError(500, "Failed to create annotation reply");
    }
  }

  /**
   * Get annotation versions/history using raw SQL
   * Source: Optimized version history retrieval
   */
  static async getAnnotationVersions(annotationId: string) {
    try {
      const versions = await prisma.$queryRaw<any[]>`
        SELECT 
          av.id, av."annotationId", av.version, av.text, av.timestamp,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ) as "changedBy"
        FROM "AnnotationVersion" av
        LEFT JOIN "User" u ON av."changedById" = u.id
        WHERE av."annotationId" = ${annotationId} AND av."isDeleted" = false
        ORDER BY av.timestamp DESC
      `;

      return versions;
    } catch (error) {
      console.error("Error fetching annotation versions:", error);
      throw new ApiError(500, "Failed to fetch annotation versions");
    }
  }

  /**
   * Get user's annotations across all papers using raw SQL
   * Source: Optimized user annotations retrieval with pagination
   */
  static async getUserAnnotations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    try {
      const annotations = await prisma.$queryRaw<any[]>`
        SELECT 
          a.id, a."paperId", a."userId", a.type, a.anchor, a.text, a.version,
          a."parentId", a."createdAt", a."updatedAt",
          json_build_object(
            'id', p.id,
            'title', p.title
          ) as paper,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', child_a.id,
                  'text', child_a.text,
                  'createdAt', child_a."createdAt",
                  'user', json_build_object(
                    'id', child_u.id,
                    'name', child_u.name,
                    'email', child_u.email,
                    'image', child_u.image
                  )
                ) ORDER BY child_a."createdAt" ASC
              )
              FROM "Annotation" child_a
              LEFT JOIN "User" child_u ON child_a."userId" = child_u.id
              WHERE child_a."parentId" = a.id AND child_a."isDeleted" = false
            ),
            '[]'::json
          ) as children
        FROM "Annotation" a
        LEFT JOIN "Paper" p ON a."paperId" = p.id
        WHERE a."userId" = ${userId} AND a."isDeleted" = false
        ORDER BY a."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Annotation"
        WHERE "userId" = ${userId} AND "isDeleted" = false
      `;

      const total = Number(totalResult[0]?.count || 0);

      return {
        annotations,
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching user annotations:", error);
      throw new ApiError(500, "Failed to fetch user annotations");
    }
  }
}
