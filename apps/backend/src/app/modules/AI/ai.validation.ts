import { z } from "zod";

export const aiSummaryToneSchema = z.enum([
  "academic",
  "technical",
  "executive",
  "casual",
  "conversational",
]);

export const aiSummaryAudienceSchema = z.enum([
  "researcher",
  "student",
  "executive",
  "general",
]);

const focusAreaSchema = z
  .string()
  .trim()
  .min(2, "Focus areas should contain at least two characters")
  .max(120, "Focus areas should be shorter than 120 characters");

export const generateSummarySchema = z.object({
  instructions: z
    .string()
    .trim()
    .min(4, "Instructions should contain at least four characters")
    .max(400, "Instructions should be shorter than 400 characters")
    .optional(),
  focusAreas: z
    .array(focusAreaSchema)
    .max(5, "Please limit focus areas to five items")
    .optional(),
  tone: aiSummaryToneSchema.optional(),
  audience: aiSummaryAudienceSchema.optional(),
  language: z
    .string()
    .trim()
    .min(2, "Language should contain at least two characters")
    .max(40, "Language should be shorter than 40 characters")
    .optional(),
  wordLimit: z
    .number()
    .int("Word limit must be an integer")
    .min(80, "Word limit must be at least 80 words")
    .max(600, "Word limit must be at most 600 words")
    .optional(),
  refresh: z.boolean().optional(),
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

const insightModelSchema = z.enum([
  "gpt-4o-mini",
  "gpt-3.5-turbo",
  "gpt-4o",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
]);

export const generateInsightSchema = z.object({
  message: z
    .string()
    .trim()
    .min(6, "Please provide a question or prompt with at least six characters")
    .max(1200, "Insight prompts should be shorter than 1200 characters"),
  threadId: z.string().uuid().optional(),
  refreshContext: z.boolean().optional(),
  model: insightModelSchema.optional(),
});

export type GenerateInsightInput = z.infer<typeof generateInsightSchema>;
