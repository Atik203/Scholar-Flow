import { randomUUID } from "crypto";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import {
  CreateNoteInput,
  GetNotesQuery,
  SearchNotesQuery,
  UpdateNoteInput,
} from "./note.types";

export class NoteService {
  /**
   * Create a new research note using $executeRaw
   * Source: Optimized note creation with raw SQL
   */
  static async createNote(userId: string, data: CreateNoteInput) {
    const noteId = randomUUID();
    const now = new Date();

    try {
      // Insert note using $executeRaw
      await prisma.$executeRaw`
        INSERT INTO "ResearchNote" (
          id, "userId", "paperId", title, content, tags, "isPrivate",
          "createdAt", "updatedAt", "isDeleted"
        )
        VALUES (
          ${noteId}, ${userId}, ${data.paperId || null}, ${data.title},
          ${data.content}, ${data.tags || []}::text[], ${data.isPrivate ?? true},
          ${now}, ${now}, false
        )
      `;

      // Fetch created note with relations using $queryRaw
      const notes = await prisma.$queryRaw<any[]>`
        SELECT 
          rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
          rn."isPrivate", rn."createdAt", rn."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          CASE WHEN rn."paperId" IS NOT NULL THEN
            json_build_object(
              'id', p.id,
              'title', p.title
            )
          ELSE NULL END as paper
        FROM "ResearchNote" rn
        LEFT JOIN "User" u ON rn."userId" = u.id
        LEFT JOIN "Paper" p ON rn."paperId" = p.id
        WHERE rn.id = ${noteId}
        LIMIT 1
      `;

      if (notes.length === 0) {
        throw new ApiError(500, "Failed to create note");
      }

      return notes[0];
    } catch (error) {
      console.error("Error creating note:", error);
      throw new ApiError(500, "Failed to create note");
    }
  }

  /**
   * Get notes for a user using $queryRaw
   * Source: Optimized note retrieval with filtering and pagination
   */
  static async getNotes(userId: string, query: GetNotesQuery) {
    const { page = 1, limit = 20, paperId, search, tags } = query;
    const skip = (page - 1) * limit;

    try {
      let notes: any[];
      let totalResult: [{ count: bigint }];

      // Build query based on filters
      if (search && tags && paperId) {
        // All filters
        const tagArray = tags.split(",").map((tag) => tag.trim());
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            json_build_object(
              'id', p.id,
              'title', p.title
            ) as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND rn."paperId" = ${paperId}
            AND (rn.title ILIKE ${`%${search}%`} OR rn.content ILIKE ${`%${search}%`})
            AND rn.tags && ${tagArray}::text[]
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND "paperId" = ${paperId}
            AND (title ILIKE ${`%${search}%`} OR content ILIKE ${`%${search}%`})
            AND tags && ${tagArray}::text[]
        `;
      } else if (search && paperId) {
        // Search + paperId
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            json_build_object(
              'id', p.id,
              'title', p.title
            ) as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND rn."paperId" = ${paperId}
            AND (rn.title ILIKE ${`%${search}%`} OR rn.content ILIKE ${`%${search}%`})
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND "paperId" = ${paperId}
            AND (title ILIKE ${`%${search}%`} OR content ILIKE ${`%${search}%`})
        `;
      } else if (tags && paperId) {
        // Tags + paperId
        const tagArray = tags.split(",").map((tag) => tag.trim());
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            json_build_object(
              'id', p.id,
              'title', p.title
            ) as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND rn."paperId" = ${paperId}
            AND rn.tags && ${tagArray}::text[]
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND "paperId" = ${paperId}
            AND tags && ${tagArray}::text[]
        `;
      } else if (search && tags) {
        // Search + tags
        const tagArray = tags.split(",").map((tag) => tag.trim());
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            CASE WHEN rn."paperId" IS NOT NULL THEN
              json_build_object(
                'id', p.id,
                'title', p.title
              )
            ELSE NULL END as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND (rn.title ILIKE ${`%${search}%`} OR rn.content ILIKE ${`%${search}%`})
            AND rn.tags && ${tagArray}::text[]
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND (title ILIKE ${`%${search}%`} OR content ILIKE ${`%${search}%`})
            AND tags && ${tagArray}::text[]
        `;
      } else if (paperId) {
        // Paper filter only
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            json_build_object(
              'id', p.id,
              'title', p.title
            ) as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND rn."paperId" = ${paperId}
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND "paperId" = ${paperId}
        `;
      } else if (search) {
        // Search only
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            CASE WHEN rn."paperId" IS NOT NULL THEN
              json_build_object(
                'id', p.id,
                'title', p.title
              )
            ELSE NULL END as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND (rn.title ILIKE ${`%${search}%`} OR rn.content ILIKE ${`%${search}%`})
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND (title ILIKE ${`%${search}%`} OR content ILIKE ${`%${search}%`})
        `;
      } else if (tags) {
        // Tags only
        const tagArray = tags.split(",").map((tag) => tag.trim());
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            CASE WHEN rn."paperId" IS NOT NULL THEN
              json_build_object(
                'id', p.id,
                'title', p.title
              )
            ELSE NULL END as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
            AND rn.tags && ${tagArray}::text[]
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
            AND tags && ${tagArray}::text[]
        `;
      } else {
        // No filters
        notes = await prisma.$queryRaw<any[]>`
          SELECT 
            rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
            rn."isPrivate", rn."createdAt", rn."updatedAt",
            json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image
            ) as user,
            CASE WHEN rn."paperId" IS NOT NULL THEN
              json_build_object(
                'id', p.id,
                'title', p.title
              )
            ELSE NULL END as paper
          FROM "ResearchNote" rn
          LEFT JOIN "User" u ON rn."userId" = u.id
          LEFT JOIN "Paper" p ON rn."paperId" = p.id
          WHERE rn."userId" = ${userId}
            AND rn."isDeleted" = false
          ORDER BY rn."updatedAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM "ResearchNote"
          WHERE "userId" = ${userId}
            AND "isDeleted" = false
        `;
      }

      const total = Number(totalResult[0]?.count || 0);

      return {
        notes,
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new ApiError(500, "Failed to fetch notes");
    }
  }

  /**
   * Get note by ID using $queryRaw
   * Source: Optimized single note retrieval
   */
  static async getNoteById(noteId: string, userId: string) {
    try {
      const notes = await prisma.$queryRaw<any[]>`
        SELECT 
          rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
          rn."isPrivate", rn."createdAt", rn."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          CASE WHEN rn."paperId" IS NOT NULL THEN
            json_build_object(
              'id', p.id,
              'title', p.title
            )
          ELSE NULL END as paper
        FROM "ResearchNote" rn
        LEFT JOIN "User" u ON rn."userId" = u.id
        LEFT JOIN "Paper" p ON rn."paperId" = p.id
        WHERE rn.id = ${noteId}
          AND rn."userId" = ${userId}
          AND rn."isDeleted" = false
        LIMIT 1
      `;

      return notes.length > 0 ? notes[0] : null;
    } catch (error) {
      console.error("Error fetching note by ID:", error);
      throw new ApiError(500, "Failed to fetch note");
    }
  }

  /**
   * Update a note using $executeRaw
   * Source: Optimized note update with raw SQL
   */
  static async updateNote(
    noteId: string,
    userId: string,
    data: UpdateNoteInput
  ) {
    try {
      // Check if note exists and belongs to user
      const existingNotes = await prisma.$queryRaw<any[]>`
        SELECT id, "userId", title, content, tags, "isPrivate"
        FROM "ResearchNote"
        WHERE id = ${noteId}
          AND "userId" = ${userId}
          AND "isDeleted" = false
        LIMIT 1
      `;

      if (existingNotes.length === 0) {
        throw new ApiError(404, "Note not found or unauthorized");
      }

      const existing = existingNotes[0];
      const now = new Date();

      // Use existing values if data fields are not provided
      const newTitle = data.title !== undefined ? data.title : existing.title;
      const newContent =
        data.content !== undefined ? data.content : existing.content;
      const newTags = data.tags !== undefined ? data.tags : existing.tags;
      const newIsPrivate =
        data.isPrivate !== undefined ? data.isPrivate : existing.isPrivate;

      // Execute update
      await prisma.$executeRaw`
        UPDATE "ResearchNote"
        SET title = ${newTitle},
            content = ${newContent},
            tags = ${newTags}::text[],
            "isPrivate" = ${newIsPrivate},
            "updatedAt" = ${now}
        WHERE id = ${noteId}
      `;

      // Fetch updated note
      const notes = await prisma.$queryRaw<any[]>`
        SELECT 
          rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
          rn."isPrivate", rn."createdAt", rn."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          CASE WHEN rn."paperId" IS NOT NULL THEN
            json_build_object(
              'id', p.id,
              'title', p.title
            )
          ELSE NULL END as paper
        FROM "ResearchNote" rn
        LEFT JOIN "User" u ON rn."userId" = u.id
        LEFT JOIN "Paper" p ON rn."paperId" = p.id
        WHERE rn.id = ${noteId}
        LIMIT 1
      `;

      return notes[0];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error updating note:", error);
      throw new ApiError(500, "Failed to update note");
    }
  }

  /**
   * Delete a note using $executeRaw (soft delete)
   * Source: Optimized soft delete for notes
   */
  static async deleteNote(noteId: string, userId: string) {
    try {
      // Check if note exists and belongs to user
      const existingNotes = await prisma.$queryRaw<any[]>`
        SELECT id, "userId"
        FROM "ResearchNote"
        WHERE id = ${noteId}
          AND "userId" = ${userId}
          AND "isDeleted" = false
        LIMIT 1
      `;

      if (existingNotes.length === 0) {
        throw new ApiError(404, "Note not found or unauthorized");
      }

      // Soft delete
      const now = new Date();
      await prisma.$executeRaw`
        UPDATE "ResearchNote"
        SET "isDeleted" = true, "updatedAt" = ${now}
        WHERE id = ${noteId}
      `;

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error deleting note:", error);
      throw new ApiError(500, "Failed to delete note");
    }
  }

  /**
   * Search notes using $queryRaw
   * Source: Optimized note search with pagination
   */
  static async searchNotes(userId: string, query: SearchNotesQuery) {
    const { query: searchQuery, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    try {
      const notes = await prisma.$queryRaw<any[]>`
        SELECT 
          rn.id, rn."userId", rn."paperId", rn.title, rn.content, rn.tags,
          rn."isPrivate", rn."createdAt", rn."updatedAt",
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'image', u.image
          ) as user,
          CASE WHEN rn."paperId" IS NOT NULL THEN
            json_build_object(
              'id', p.id,
              'title', p.title
            )
          ELSE NULL END as paper
        FROM "ResearchNote" rn
        LEFT JOIN "User" u ON rn."userId" = u.id
        LEFT JOIN "Paper" p ON rn."paperId" = p.id
        WHERE rn."userId" = ${userId}
          AND rn."isDeleted" = false
          AND (
            rn.title ILIKE ${`%${searchQuery}%`}
            OR rn.content ILIKE ${`%${searchQuery}%`}
            OR ${searchQuery} = ANY(rn.tags)
          )
        ORDER BY rn."updatedAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "ResearchNote"
        WHERE "userId" = ${userId}
          AND "isDeleted" = false
          AND (
            title ILIKE ${`%${searchQuery}%`}
            OR content ILIKE ${`%${searchQuery}%`}
            OR ${searchQuery} = ANY(tags)
          )
      `;

      const total = Number(totalResult[0]?.count || 0);

      return {
        notes,
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error searching notes:", error);
      throw new ApiError(500, "Failed to search notes");
    }
  }
}
