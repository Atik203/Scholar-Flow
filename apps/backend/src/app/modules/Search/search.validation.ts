import { z } from "zod";

export const globalSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  // Phase D.1: extended to include notes / people / internet
  type: z
    .enum([
      "all",
      "papers",
      "collections",
      "workspaces",
      "notes",
      "people",
      "internet",
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

export const aiSearchBodySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  mode: z.enum(["summarize"]).optional().default("summarize"),
  workspaceId: z.string().optional(),
  model: z.string().optional(),
});

export const sourcesQuerySchema = z.object({
  q: z.string().min(1),
  workspaceId: z.string().optional(),
  limit: z.string().optional().default("5"),
});
