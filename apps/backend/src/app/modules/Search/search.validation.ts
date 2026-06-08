import { z } from "zod";

export const globalSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  type: z.enum(["all", "papers", "collections", "workspaces"]).optional().default("all"),
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
