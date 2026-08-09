import { z } from "zod";

export const globalSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  // Phase D.1: extended to include notes / people
  type: z
    .enum([
      "all",
      "papers",
      "collections",
      "workspaces",
      "notes",
      "people",
    ])
    .optional()
    .default("all"),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  workspaceId: z.string().optional(),
});

export const searchHistoryQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
});

export const saveSearchHistorySchema = z.object({
  query: z.string().min(1),
  filters: z.record(z.any()).optional(),
  results: z.record(z.any()).optional(),
});

// Whitelist of models the AI search may use — free-form model strings would
// let users pick arbitrary (expensive) models on our key.
const AI_SEARCH_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-3.5-turbo",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

export const aiSearchBodySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  mode: z.enum(["summarize"]).optional().default("summarize"),
  workspaceId: z.string().optional(),
  model: z.enum(AI_SEARCH_MODELS).optional(),
});

export const sourcesQuerySchema = z.object({
  q: z.string().min(1),
  workspaceId: z.string().optional(),
  limit: z.string().optional().default("5"),
});
