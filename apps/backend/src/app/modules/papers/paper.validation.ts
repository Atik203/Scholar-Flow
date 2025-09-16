import { z } from "zod";

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
