import { randomUUID } from "crypto";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import {
  CreateNoteInNotebookInput,
  CreateNotebookInput,
  CreateSectionInput,
  ListNotesQuery,
  MoveNoteInput,
  UpdateNotebookInput,
  UpdateSectionInput,
} from "./notebook.validation";

/**
 * Derive word count and excerpt from raw content.
 * excerpt is the first non-empty line, capped at 200 chars.
 */
function deriveMeta(content: string): { wordCount: number; excerpt: string } {
  const trimmed = content.trim();
  const wordCount = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const firstLine =
    trimmed.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "";
  const excerpt = firstLine.slice(0, 200);
  return { wordCount, excerpt };
}

export const NotebookService = {
  /**
   * Lazily ensure each user has at least one default notebook + section.
   * Called on first list/get to migrate legacy notes into a notebook
   * without forcing a backfill migration.
   */
  async ensureDefaultNotebook(userId: string): Promise<string> {
    const existing = await prisma.notebook.findFirst({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (existing) return existing.id;

    const id = randomUUID();
    const sectionId = randomUUID();
    const now = new Date();
    await prisma.$transaction([
      prisma.notebook.create({
        data: {
          id,
          userId,
          name: "My Notes",
          description: "Default notebook",
          color: "blue",
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.notebookSection.create({
        data: {
          id: sectionId,
          notebookId: id,
          userId,
          name: "General",
          order: 0,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ]);
    return id;
  },

  async listNotebooks(userId: string, limit: number) {
    await this.ensureDefaultNotebook(userId);
    const notebooks = await prisma.notebook.findMany({
      where: { userId, isDeleted: false },
      orderBy: [{ isStarred: "desc" }, { updatedAt: "desc" }],
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        isStarred: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { notes: { where: { isDeleted: false } } } },
        sections: {
          where: { isDeleted: false },
          orderBy: { order: "asc" },
          select: { id: true, name: true, order: true, _count: { select: { notes: { where: { isDeleted: false } } } } },
        },
      },
    });
    return notebooks.map((nb) => ({
      ...nb,
      noteCount: nb._count.notes,
      sections: nb.sections.map((s) => ({ ...s, noteCount: s._count.notes })),
    }));
  },

  async getNotebook(userId: string, id: string) {
    const notebook = await prisma.notebook.findFirst({
      where: { id, userId, isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        isStarred: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { notes: { where: { isDeleted: false } } } },
        sections: {
          where: { isDeleted: false },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            order: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { notes: { where: { isDeleted: false } } } },
          },
        },
      },
    });
    if (!notebook) throw new ApiError(404, "Notebook not found");
    return {
      ...notebook,
      noteCount: notebook._count.notes,
      sections: notebook.sections.map((s) => ({ ...s, noteCount: s._count.notes })),
    };
  },

  async createNotebook(userId: string, data: CreateNotebookInput) {
    const id = randomUUID();
    const sectionId = randomUUID();
    const now = new Date();
    const [notebook] = await prisma.$transaction([
      prisma.notebook.create({
        data: {
          id,
          userId,
          name: data.name,
          description: data.description,
          color: data.color,
          createdAt: now,
          updatedAt: now,
        },
      }),
      prisma.notebookSection.create({
        data: {
          id: sectionId,
          notebookId: id,
          userId,
          name: "General",
          order: 0,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ]);
    return notebook;
  },

  async updateNotebook(userId: string, id: string, data: UpdateNotebookInput) {
    const existing = await prisma.notebook.findFirst({
      where: { id, userId, isDeleted: false },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Notebook not found");
    const updated = await prisma.notebook.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        isStarred: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updated;
  },

  async deleteNotebook(userId: string, id: string) {
    const existing = await prisma.notebook.findFirst({
      where: { id, userId, isDeleted: false },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Notebook not found");
    // Soft delete; SetNull on ResearchNote preserves notes
    await prisma.notebook.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
    });
    return { success: true };
  },

  // --- Sections ---------------------------------------------------------

  async listSections(userId: string, notebookId: string) {
    const notebook = await prisma.notebook.findFirst({
      where: { id: notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!notebook) throw new ApiError(404, "Notebook not found");
    const sections = await prisma.notebookSection.findMany({
      where: { notebookId, isDeleted: false },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { notes: { where: { isDeleted: false } } } },
      },
    });
    return sections.map((s) => ({ ...s, noteCount: s._count.notes }));
  },

  async createSection(
    userId: string,
    notebookId: string,
    data: CreateSectionInput
  ) {
    const notebook = await prisma.notebook.findFirst({
      where: { id: notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!notebook) throw new ApiError(404, "Notebook not found");
    const id = randomUUID();
    const now = new Date();
    const section = await prisma.notebookSection.create({
      data: {
        id,
        notebookId,
        userId,
        name: data.name,
        order: data.order ?? 0,
        createdAt: now,
        updatedAt: now,
      },
      select: {
        id: true,
        name: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return section;
  },

  async updateSection(
    userId: string,
    notebookId: string,
    sectionId: string,
    data: UpdateSectionInput
  ) {
    const section = await prisma.notebookSection.findFirst({
      where: { id: sectionId, notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!section) throw new ApiError(404, "Section not found");
    return prisma.notebookSection.update({
      where: { id: sectionId },
      data: { ...data, updatedAt: new Date() },
      select: {
        id: true,
        name: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async deleteSection(
    userId: string,
    notebookId: string,
    sectionId: string
  ) {
    const section = await prisma.notebookSection.findFirst({
      where: { id: sectionId, notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!section) throw new ApiError(404, "Section not found");
    await prisma.notebookSection.update({
      where: { id: sectionId },
      data: { isDeleted: true, updatedAt: new Date() },
    });
    return { success: true };
  },

  // --- Notes inside a notebook ----------------------------------------

  async listNotesInNotebook(
    userId: string,
    notebookId: string,
    query: ListNotesQuery
  ) {
    const notebook = await prisma.notebook.findFirst({
      where: { id: notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!notebook) throw new ApiError(404, "Notebook not found");
    const where: any = {
      userId,
      isDeleted: false,
      notebookId,
    };
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.noteType) where.noteType = query.noteType;
    if (query.visibility) where.visibility = query.visibility;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }
    const notes = await prisma.researchNote.findMany({
      where,
      orderBy: [{ isStarred: "desc" }, { updatedAt: "desc" }],
      take: query.limit,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        noteType: true,
        visibility: true,
        isStarred: true,
        isPrivate: true,
        wordCount: true,
        excerpt: true,
        paperId: true,
        notebookId: true,
        sectionId: true,
        createdAt: true,
        updatedAt: true,
        paper: { select: { id: true, title: true } },
      },
    });
    return notes;
  },

  async createNoteInNotebook(
    userId: string,
    notebookId: string,
    data: CreateNoteInNotebookInput
  ) {
    const notebook = await prisma.notebook.findFirst({
      where: { id: notebookId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!notebook) throw new ApiError(404, "Notebook not found");
    if (data.sectionId) {
      const section = await prisma.notebookSection.findFirst({
        where: { id: data.sectionId, notebookId, isDeleted: false },
        select: { id: true },
      });
      if (!section) throw new ApiError(404, "Section not found in notebook");
    }
    const meta = deriveMeta(data.content);
    const id = randomUUID();
    const now = new Date();
    const note = await prisma.researchNote.create({
      data: {
        id,
        userId,
        notebookId,
        sectionId: data.sectionId ?? null,
        paperId: data.paperId ?? null,
        title: data.title,
        content: data.content,
        tags: data.tags,
        noteType: data.noteType,
        visibility: data.visibility,
        isPrivate: data.visibility === "PRIVATE",
        wordCount: meta.wordCount,
        excerpt: meta.excerpt,
        createdAt: now,
        updatedAt: now,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        noteType: true,
        visibility: true,
        isStarred: true,
        wordCount: true,
        excerpt: true,
        paperId: true,
        notebookId: true,
        sectionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return note;
  },

  async moveNote(userId: string, noteId: string, data: MoveNoteInput) {
    const note = await prisma.researchNote.findFirst({
      where: { id: noteId, userId, isDeleted: false },
      select: { id: true },
    });
    if (!note) throw new ApiError(404, "Note not found");
    if (data.notebookId) {
      const nb = await prisma.notebook.findFirst({
        where: { id: data.notebookId, userId, isDeleted: false },
        select: { id: true },
      });
      if (!nb) throw new ApiError(404, "Target notebook not found");
    }
    if (data.sectionId) {
      const sec = await prisma.notebookSection.findFirst({
        where: { id: data.sectionId, userId, isDeleted: false },
        select: { id: true, notebookId: true },
      });
      if (!sec) throw new ApiError(404, "Target section not found");
      if (data.notebookId && sec.notebookId !== data.notebookId) {
        throw new ApiError(
          400,
          "Section does not belong to the target notebook"
        );
      }
    }
    const updated = await prisma.researchNote.update({
      where: { id: noteId },
      data: {
        notebookId: data.notebookId,
        sectionId: data.sectionId,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        notebookId: true,
        sectionId: true,
        updatedAt: true,
      },
    });
    return updated;
  },
};
