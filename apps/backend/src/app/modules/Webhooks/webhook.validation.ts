import { z } from "zod";

export const createEndpointSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url().max(2000),
  description: z.string().max(1000).optional(),
  events: z.array(z.string()).min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateEndpointSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  url: z.string().url().max(2000).optional(),
  description: z.string().max(1000).optional(),
  events: z.array(z.string()).min(1).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ERROR"]).optional(),
});

export const endpointIdSchema = z.object({
  id: z.string().uuid("Invalid endpoint ID"),
});

export const listDeliveriesQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20)),
  status: z.enum(["SUCCESS", "FAILED", "PENDING"]).optional(),
});
