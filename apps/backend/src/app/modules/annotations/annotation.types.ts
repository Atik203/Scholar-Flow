import { AnnotationType } from "@prisma/client";
import { z } from "zod";

// Annotation anchor structure for PDF coordinates
export interface AnnotationAnchor {
  page: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  textRange?: {
    start: number;
    end: number;
  };
  selectedText?: string;
}

// Annotation creation schema
export const createAnnotationSchema = z.object({
  paperId: z.string().uuid(),
  type: z.nativeEnum(AnnotationType),
  anchor: z.object({
    page: z.number().min(1),
    coordinates: z.object({
      x: z.number().min(0),
      y: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    }),
    textRange: z.object({
      start: z.number().min(0),
      end: z.number().min(0),
    }).optional(),
    selectedText: z.string().optional(),
  }),
  text: z.string().min(1).max(5000),
  parentId: z.string().uuid().optional(),
});

// Annotation update schema
export const updateAnnotationSchema = z.object({
  text: z.string().min(1).max(5000),
});

// Annotation reply schema
export const createAnnotationReplySchema = z.object({
  text: z.string().min(1).max(5000),
});

// Query parameters for getting annotations
export const getAnnotationsQuerySchema = z.object({
  paperId: z.string().uuid(),
  page: z.coerce.number().min(1).optional(),
  type: z.nativeEnum(AnnotationType).optional(),
  includeReplies: z.coerce.boolean().optional(),
});

export type CreateAnnotationInput = z.infer<typeof createAnnotationSchema>;
export type UpdateAnnotationInput = z.infer<typeof updateAnnotationSchema>;
export type CreateAnnotationReplyInput = z.infer<typeof createAnnotationReplySchema>;
export type GetAnnotationsQuery = z.infer<typeof getAnnotationsQuerySchema>;
