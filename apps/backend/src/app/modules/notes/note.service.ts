import { PrismaClient } from "@prisma/client";
import { CreateNoteInput, UpdateNoteInput, GetNotesQuery, SearchNotesQuery } from "./note.types";

const prisma = new PrismaClient();

export class NoteService {
  /**
   * Create a new research note
   */
  static async createNote(
    userId: string,
    data: CreateNoteInput
  ) {
    const note = await prisma.researchNote.create({
      data: {
        userId,
        paperId: data.paperId,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        isPrivate: data.isPrivate ?? true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return note;
  }

  /**
   * Get notes for a user
   */
  static async getNotes(
    userId: string,
    query: GetNotesQuery
  ) {
    const { page = 1, limit = 20, paperId, search, tags } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      isDeleted: false,
    };

    if (paperId) {
      where.paperId = paperId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    const notes = await prisma.researchNote.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.researchNote.count({ where });

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get note by ID
   */
  static async getNoteById(noteId: string, userId: string) {
    const note = await prisma.researchNote.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return note;
  }

  /**
   * Update a note
   */
  static async updateNote(
    noteId: string,
    userId: string,
    data: UpdateNoteInput
  ) {
    // Check if note exists and belongs to user
    const existingNote = await prisma.researchNote.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false,
      },
    });

    if (!existingNote) {
      throw new Error('Note not found or unauthorized');
    }

    const note = await prisma.researchNote.update({
      where: { id: noteId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return note;
  }

  /**
   * Delete a note
   */
  static async deleteNote(noteId: string, userId: string) {
    // Check if note exists and belongs to user
    const existingNote = await prisma.researchNote.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false,
      },
    });

    if (!existingNote) {
      throw new Error('Note not found or unauthorized');
    }

    // Soft delete
    await prisma.researchNote.update({
      where: { id: noteId },
      data: { isDeleted: true },
    });

    return { success: true };
  }

  /**
   * Search notes
   */
  static async searchNotes(
    userId: string,
    query: SearchNotesQuery
  ) {
    const { query: searchQuery, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isDeleted: false,
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' as any } },
        { content: { contains: searchQuery, mode: 'insensitive' as any } },
        { tags: { hasSome: [searchQuery] } },
      ],
    };

    const notes = await prisma.researchNote.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        paper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.researchNote.count({ where });

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
