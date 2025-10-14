import { z } from "zod";

// Note creation schema
export const createNoteSchema = z.object({
  paperId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  isPrivate: z.boolean().optional(),
});

// Note update schema
export const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  isPrivate: z.boolean().optional(),
});

// Query parameters for getting notes
export const getNotesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  paperId: z.string().uuid().optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

// Search notes schema
export const searchNotesSchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNotesQuery = z.infer<typeof getNotesQuerySchema>;
export type SearchNotesQuery = z.infer<typeof searchNotesSchema>;
