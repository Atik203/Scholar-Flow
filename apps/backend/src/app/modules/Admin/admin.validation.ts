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

export const updateUserRoleSchema = z.object({
  role: z.enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"]),
});

export const createPlanSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  priceCents: z.number().int().min(0),
  currency: z.string().length(3).default("USD"),
  interval: z.enum(["month", "year"]),
  active: z.boolean().optional(),
  features: z.record(z.unknown()).optional(),
});

export const updatePlanSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  priceCents: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  interval: z.enum(["month", "year"]).optional(),
  active: z.boolean().optional(),
  features: z.record(z.unknown()).optional(),
});

export const changePlanSchema = z.object({
  priceId: z.string().min(1, "priceId is required"),
});

export type AdminFiltersInput = z.infer<typeof adminFiltersSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
