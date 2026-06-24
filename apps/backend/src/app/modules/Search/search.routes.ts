import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { SearchController } from "./search.controller";

const router: import("express").Router = express.Router();

// Search History
router.get("/history", authMiddleware as any, SearchController.getSearchHistory as any);
router.post("/history", authMiddleware as any, SearchController.saveSearchQuery as any);

// Discovery
router.get("/trending", SearchController.getTrending as any);
router.get("/recommendations", authMiddleware as any, SearchController.getRecommendations as any);

// Phase D.2 — AI search (Perplexity-style summary) and source citations.
// Must be registered BEFORE the catch-all "/" route so it isn't shadowed.
router.post("/ai-search", authMiddleware as any, SearchController.aiSearch as any);
router.get("/sources", authMiddleware as any, SearchController.getSources as any);

// Global Search
router.get("/", authMiddleware as any, SearchController.globalSearch as any);

// Semantic Search (pgvector)
router.get("/semantic", authMiddleware as any, SearchController.semanticSearch as any);

export const searchRoutes = router;
