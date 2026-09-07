import { z } from "zod";
import { toBoundedInt, toPositiveInt } from "../../shared/parseIntSafe";

const safeDate = (v: string | undefined): Date | undefined => {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export const listAuditLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  workspaceId: z.string().uuid().optional(),
  entity: z.string().optional(),
  entityId: z.string().uuid().optional(),
  action: z.string().optional(),
  severity: z.enum(["INFO", "WARNING", "ERROR", "CRITICAL"]).optional(),
  startDate: z.string().datetime().optional().transform(safeDate),
  endDate: z.string().datetime().optional().transform(safeDate),
  search: z.string().optional(),
  page: z.string().optional().transform((v) => toPositiveInt(v, 1)),
  limit: z.string().optional().transform((v) => toBoundedInt(v, 50, 200)),
});

export const exportAuditLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  workspaceId: z.string().uuid().optional(),
  entity: z.string().optional(),
  entityId: z.string().uuid().optional(),
  action: z.string().optional(),
  severity: z.enum(["INFO", "WARNING", "ERROR", "CRITICAL"]).optional(),
  startDate: z.string().datetime().optional().transform(safeDate),
  endDate: z.string().datetime().optional().transform(safeDate),
  format: z.enum(["json", "csv"]).default("json"),
  limit: z.string().optional().transform((v) => toBoundedInt(v, 1000, 5000)),
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
