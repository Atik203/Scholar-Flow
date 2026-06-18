import { z } from "zod";

// Color matches figma ResearchNotesPage folder swatches
export const NOTEBOOK_COLORS = [
  "blue",
  "purple",
  "green",
  "orange",
  "pink",
] as const;

export const createNotebookSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.enum(NOTEBOOK_COLORS).optional().default("blue"),
});

export const updateNotebookSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.enum(NOTEBOOK_COLORS).optional(),
  isStarred: z.boolean().optional(),
});

export const notebookParamsSchema = z.object({
  id: z.string().uuid("Invalid notebook ID"),
});

export const sectionParamsSchema = z.object({
  id: z.string().uuid("Invalid notebook ID"),
  sectionId: z.string().uuid("Invalid section ID"),
});

export const createSectionSchema = z.object({
  name: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
});

export const updateSectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
});

export const createNoteInNotebookSchema = z.object({
  sectionId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20000),
  noteType: z
    .enum(["QUICK", "LITERATURE", "METHODOLOGY", "FINDINGS", "IDEA"])
    .optional()
    .default("QUICK"),
  visibility: z
    .enum(["PRIVATE", "WORKSPACE", "PUBLIC"])
    .optional()
    .default("PRIVATE"),
  tags: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
  paperId: z.string().uuid().optional(),
});

export const moveNoteSchema = z.object({
  notebookId: z.string().uuid().nullable(),
  sectionId: z.string().uuid().nullable(),
});

export const listNotebooksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const listSectionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const listNotesQuerySchema = z.object({
  sectionId: z.string().uuid().optional(),
  noteType: z
    .enum(["QUICK", "LITERATURE", "METHODOLOGY", "FINDINGS", "IDEA"])
    .optional(),
  visibility: z.enum(["PRIVATE", "WORKSPACE", "PUBLIC"]).optional(),
  search: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export type CreateNotebookInput = z.infer<typeof createNotebookSchema>;
export type UpdateNotebookInput = z.infer<typeof updateNotebookSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type CreateNoteInNotebookInput = z.infer<
  typeof createNoteInNotebookSchema
>;
export type MoveNoteInput = z.infer<typeof moveNoteSchema>;
export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
