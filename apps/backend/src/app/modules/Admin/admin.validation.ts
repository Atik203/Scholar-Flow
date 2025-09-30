/**
 * Admin Module Validation Schemas
 * Zod schemas for validating admin request data
 */

import { z } from "zod";

export const adminFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  role: z
    .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"])
    .optional(),
  status: z.enum(["active", "inactive", "all"]).default("all").optional(),
});

export const dateRangeSchema = z
  .object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be before or equal to end date",
  });

export type AdminFiltersInput = z.infer<typeof adminFiltersSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
