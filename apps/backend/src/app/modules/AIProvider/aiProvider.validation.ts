/**
 * Zod schemas for AIProvider admin endpoints.
 * All mutations require admin role (enforced at the route layer).
 */
import { z } from "zod";

export const providerKeySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9_-]+$/i, "provider must be alphanumeric / underscore / dash");

export const createAIProviderSchema = z.object({
  provider: providerKeySchema,
  model: z.string().min(1).max(128),
  displayName: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  apiKeyEnvName: optionalApiKeyEnvName(),
  enabled: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

function optionalApiKeyEnvName() {
  return z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().max(128).regex(/^[A-Z0-9_]+$/, "apiKeyEnvName must be UPPER_SNAKE_CASE").optional()
  );
}

export const updateAIProviderSchema = z.object({
  displayName: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  apiKeyEnvName: optionalApiKeyEnvName(),
  enabled: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const reorderAIProvidersSchema = z.object({
  // Array of { id, displayOrder } in the new order.
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        displayOrder: z.number().int(),
      })
    )
    .min(1)
    .max(200),
});

export const aiProviderParamsSchema = z.object({
  id: z.string().uuid(),
});
