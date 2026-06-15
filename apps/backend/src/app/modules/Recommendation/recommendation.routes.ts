import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { recommendationController } from "./recommendation.controller";

export const recommendationRoutes: express.Router = express.Router();

// GET /recommendations/collections/suggested — AI-suggested collections
recommendationRoutes.get(
  "/collections/suggested",
  authMiddleware as any,
  recommendationController.getSuggestedCollections as any
);

// GET /recommendations/collections/:id/suggestions — AI-suggested papers for a collection
recommendationRoutes.get(
  "/collections/:id/suggestions",
  authMiddleware as any,
  recommendationController.getCollectionSuggestions as any
);

// GET /recommendations/papers/recommended — recommended papers during creation
recommendationRoutes.get(
  "/papers/recommended",
  authMiddleware as any,
  recommendationController.getRecommendedPapers as any
);
