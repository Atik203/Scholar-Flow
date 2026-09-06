import { z } from "zod";
import { toBoundedInt, toPositiveInt } from "../../shared/parseIntSafe";

export const listReportsQuerySchema = z.object({
  type: z
    .enum(["USAGE", "FINANCIAL", "USER", "CONTENT", "SYSTEM"])
    .optional(),
  status: z
    .enum(["READY", "GENERATING", "SCHEDULED", "FAILED"])
    .optional(),
  enabled: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  search: z.string().optional(),
  page: z.string().optional().transform((v) => toPositiveInt(v, 1)),
  limit: z.string().optional().transform((v) => toBoundedInt(v, 20, 100)),
});

export const createReportSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["USAGE", "FINANCIAL", "USER", "CONTENT", "SYSTEM"]),
  format: z.enum(["CSV", "JSON"]).default("CSV"),
  schedule: z.string().max(100).optional(),
  recipients: z.array(z.string().email()).default([]),
  enabled: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const updateReportSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  format: z.enum(["CSV", "JSON"]).optional(),
  schedule: z.string().max(100).optional(),
  nextRunAt: z
    .string()
    .datetime()
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }),
  recipients: z.array(z.string().email()).optional(),
  enabled: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const reportIdSchema = z.object({
  id: z.string().uuid("Invalid report ID"),
});
