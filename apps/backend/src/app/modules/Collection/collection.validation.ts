import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().optional().default(false),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100, "Name too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().optional(),
});

export const addPaperToCollectionSchema = z.object({
  paperId: z.string().uuid("Invalid paper ID"),
});

export const removePaperFromCollectionSchema = z.object({
  paperId: z.string().uuid("Invalid paper ID"),
});

export const collectionParamsSchema = z.object({
  id: z.string().uuid("Invalid collection ID"),
});

export const paperCollectionParamsSchema = z.object({
  collectionId: z.string().uuid("Invalid collection ID"),
  paperId: z.string().uuid("Invalid paper ID"),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type AddPaperToCollectionInput = z.infer<typeof addPaperToCollectionSchema>;
export type RemovePaperFromCollectionInput = z.infer<typeof removePaperFromCollectionSchema>;
export type CollectionParams = z.infer<typeof collectionParamsSchema>;
export type PaperCollectionParams = z.infer<typeof paperCollectionParamsSchema>;
