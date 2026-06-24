/**
 * AIProvider admin routes
 * All endpoints are admin-only (requireAdmin). Rate-limited to keep
 * catalog mutation costs predictable.
 */
import express from "express";
import { requireAdmin } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import {
  validateRequestBody,
  validateRequestParams,
} from "../../middleware/validateRequest";
import { aiProviderController } from "./aiProvider.controller";
import {
  aiProviderParamsSchema,
  createAIProviderSchema,
  reorderAIProvidersSchema,
  updateAIProviderSchema,
} from "./aiProvider.validation";

const router: express.Router = express.Router();

// List + key status (read)
router.get(
  "/",
  requireAdmin as any,
  rateLimiter as any,
  aiProviderController.list as any
);
router.get(
  "/keys/status",
  requireAdmin as any,
  rateLimiter as any,
  aiProviderController.keyStatuses as any
);

// Reorder (custom route, registered before /:id so it isn't shadowed)
router.post(
  "/reorder",
  requireAdmin as any,
  rateLimiter as any,
  validateRequestBody(reorderAIProvidersSchema) as any,
  aiProviderController.reorder as any
);

// Create
router.post(
  "/",
  requireAdmin as any,
  rateLimiter as any,
  validateRequestBody(createAIProviderSchema) as any,
  aiProviderController.create as any
);

// Set default
router.post(
  "/:id/default",
  requireAdmin as any,
  rateLimiter as any,
  validateRequestParams(aiProviderParamsSchema) as any,
  aiProviderController.setDefault as any
);

// Update
router.patch(
  "/:id",
  requireAdmin as any,
  rateLimiter as any,
  validateRequestParams(aiProviderParamsSchema) as any,
  validateRequestBody(updateAIProviderSchema) as any,
  aiProviderController.update as any
);

// Soft delete
router.delete(
  "/:id",
  requireAdmin as any,
  rateLimiter as any,
  validateRequestParams(aiProviderParamsSchema) as any,
  aiProviderController.remove as any
);

export const aiProviderRoutes: express.Router = router;
export default router;
