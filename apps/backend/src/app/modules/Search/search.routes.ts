import express from "express";
import { authMiddleware } from "../../middleware/auth";
import SearchController from "./search.controller";

const router: import("express").Router = express.Router();

// Search History
router.get("/history", authMiddleware as any, SearchController.getSearchHistory as any);
router.post("/history", authMiddleware as any, SearchController.saveSearchQuery as any);

// Discovery
router.get("/trending", SearchController.getTrending as any);
router.get("/recommendations", authMiddleware as any, SearchController.getRecommendations as any);

// Global Search
router.get("/", authMiddleware as any, SearchController.globalSearch as any);

export const searchRoutes = router;
