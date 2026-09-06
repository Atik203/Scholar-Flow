import { z } from "zod";
import { toBoundedInt, toPositiveInt } from "../../shared/parseIntSafe";

export const createEndpointSchema = z.object({
  name: z.string().min(1).max(200),
  // Restrict protocol to http(s) to prevent SSRF via file://, ftp://, etc.
  // once real outbound delivery lands. (Private-range blocking lives in the
  // delivery worker, not in the schema.)
  url: z
    .string()
    .url()
    .max(2000)
    .refine((v) => v.startsWith("https://") || v.startsWith("http://"), {
      message: "Webhook URL must use http:// or https://",
    }),
  description: z.string().max(1000).optional(),
  events: z.array(z.string()).min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateEndpointSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  url: z
    .string()
    .url()
    .max(2000)
    .refine((v) => v.startsWith("https://") || v.startsWith("http://"), {
      message: "Webhook URL must use http:// or https://",
    })
    .optional(),
  description: z.string().max(1000).optional(),
  events: z.array(z.string()).min(1).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ERROR"]).optional(),
});

export const endpointIdSchema = z.object({
  id: z.string().uuid("Invalid endpoint ID"),
});

export const listDeliveriesQuerySchema = z.object({
  page: z.string().optional().transform((v) => toPositiveInt(v, 1)),
  limit: z.string().optional().transform((v) => toBoundedInt(v, 20, 100)),
  status: z.enum(["SUCCESS", "FAILED", "PENDING"]).optional(),
});
