import { z } from "zod";
import { generateSummarySchema } from "../AI/ai.validation";

// Upload schema (multipart form fields except file which comes from multer)
export const uploadPaperSchema = z.object({
  workspaceId: z.string().uuid().optional(), // Allow optional; fallback workspace can be created in dev
  title: z.string().min(1).max(300).optional(),
  authors: z
    .preprocess(
      (v) => {
        if (typeof v === "string") {
          try {
            return JSON.parse(v);
          } catch {
            return undefined;
          }
        }
        return v;
      },
      z.array(z.string().min(1).max(120)).max(25).optional()
    )
    .optional(),
  year: z
    .preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear() + 1)
        .optional()
    )
    .optional(),
  source: z.string().optional(),
});

export const listPapersQuerySchema = z.object({
  workspaceId: z.string().uuid().optional(), // Make optional since we filter by user
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const getPaperParamsSchema = z.object({ id: z.string().uuid() });
export const deletePaperParamsSchema = getPaperParamsSchema;

export const updatePaperMetadataSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  abstract: z.string().max(5000).optional(),
  authors: z.array(z.string().min(1).max(120)).max(25).optional(),
  year: z
    .preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear() + 1)
        .optional()
    )
    .optional(),
});

export type UploadPaperInput = z.infer<typeof uploadPaperSchema>;
export type ListPapersQuery = z.infer<typeof listPapersQuerySchema>;
export type UpdatePaperMetadataInput = z.infer<
  typeof updatePaperMetadataSchema
>;

// Editor-specific validation schemas
export const createEditorPaperSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(300),
  content: z.string().optional(), // HTML content
  isDraft: z.boolean().optional().default(true),
  authors: z.array(z.string().min(1).max(120)).max(25).optional(),
});

export const updateEditorContentSchema = z.object({
  content: z.string(), // HTML content - required for updates
  title: z.string().min(1).max(300).optional(),
  isDraft: z.boolean().optional(),
});

export const publishDraftSchema = z.object({
  title: z.string().min(1).max(300).optional(), // Allow title update on publish
  abstract: z.string().max(5000).optional(),
});

export const shareViaEmailSchema = z.object({
  paperId: z.string().uuid(),
  recipientEmail: z.string().email(),
  permission: z.enum(["view", "edit"]),
  message: z.string().optional(),
});

export const generatePaperSummarySchema = generateSummarySchema;

export type CreateEditorPaperInput = z.infer<typeof createEditorPaperSchema>;
export type UpdateEditorContentInput = z.infer<
  typeof updateEditorContentSchema
>;
export type PublishDraftInput = z.infer<typeof publishDraftSchema>;
export type ShareViaEmailInput = z.infer<typeof shareViaEmailSchema>;
export type GeneratePaperSummaryInput = z.infer<
  typeof generatePaperSummarySchema
>;
