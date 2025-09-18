import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import { validateRequestBody, validateRequestParams } from "../../middleware/validateRequest";
import { collectionController } from "./collection.controller";
import {
  createCollectionSchema,
  updateCollectionSchema,
  collectionParamsSchema,
  addPaperToCollectionSchema,
  paperCollectionParamsSchema,
} from "./collection.validation";

export const collectionRoutes: express.Router = express.Router();

// Create a new collection
collectionRoutes.post(
  "/",
  rateLimiter,
  authMiddleware as any,
  validateRequestBody(createCollectionSchema) as any,
  collectionController.create as any
);

// Get user's collections
collectionRoutes.get(
  "/my",
  rateLimiter,
  authMiddleware as any,
  collectionController.getMyCollections as any
);

// Get public collections
collectionRoutes.get(
  "/public",
  rateLimiter,
  collectionController.getPublicCollections as any
);

// Search collections
collectionRoutes.get(
  "/search",
  rateLimiter,
  collectionController.search as any
);

// Get collection statistics
collectionRoutes.get(
  "/stats",
  rateLimiter,
  collectionController.getStats as any
);

// Get a specific collection
collectionRoutes.get(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.getOne as any
);

// Update a collection
collectionRoutes.patch(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  validateRequestBody(updateCollectionSchema) as any,
  collectionController.update as any
);

// Delete a collection
collectionRoutes.delete(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.delete as any
);

// Add paper to collection
collectionRoutes.post(
  "/:collectionId/papers",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(paperCollectionParamsSchema) as any,
  validateRequestBody(addPaperToCollectionSchema) as any,
  collectionController.addPaper as any
);

// Remove paper from collection
collectionRoutes.delete(
  "/:collectionId/papers/:paperId",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(paperCollectionParamsSchema) as any,
  collectionController.removePaper as any
);

// Get papers in a collection
collectionRoutes.get(
  "/:collectionId/papers",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.getCollectionPapers as any
);
