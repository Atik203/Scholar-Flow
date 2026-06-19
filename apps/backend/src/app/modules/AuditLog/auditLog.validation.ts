import { z } from "zod";

export const listAuditLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  workspaceId: z.string().uuid().optional(),
  entity: z.string().optional(),
  entityId: z.string().uuid().optional(),
  action: z.string().optional(),
  severity: z.enum(["INFO", "WARNING", "ERROR", "CRITICAL"]).optional(),
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  endDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  search: z.string().optional(),
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 200) : 50)),
});

export const exportAuditLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  workspaceId: z.string().uuid().optional(),
  entity: z.string().optional(),
  entityId: z.string().uuid().optional(),
  action: z.string().optional(),
  severity: z.enum(["INFO", "WARNING", "ERROR", "CRITICAL"]).optional(),
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  endDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  format: z.enum(["json", "csv"]).default("json"),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 5000) : 1000)),
});

export const createAuditEntrySchema = z.object({
  userId: z.string().uuid().optional(),
  workspaceId: z.string().uuid().optional(),
  entity: z.string().min(1).max(50),
  entityId: z.string().max(100),
  action: z.string().min(1).max(100),
  details: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  severity: z
    .enum(["INFO", "WARNING", "ERROR", "CRITICAL"])
    .default("INFO"),
});
