import express from "express";
import {
  authMiddleware,
  requireProResearcher,
  requireTeamLead,
  requireAdmin,
} from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import { analyticsController } from "./analytics.controller";

const router: import("express").Router = express.Router();

// Personal analytics: any authenticated user
router.get("/personal", authMiddleware, rateLimiter, analyticsController.personal);
router.post(
  "/personal/reading-session",
  authMiddleware,
  rateLimiter,
  analyticsController.startReadingSession
);
router.patch(
  "/personal/reading-session/:eventId",
  authMiddleware,
  rateLimiter,
  analyticsController.stopReadingSession
);

// Workspace analytics: Team Lead+
router.get(
  "/workspace/:workspaceId",
  authMiddleware,
  requireTeamLead,
  rateLimiter,
  analyticsController.workspace
);

// Usage reports: Pro Researcher+
router.get(
  "/usage",
  authMiddleware,
  requireProResearcher,
  rateLimiter,
  analyticsController.usage
);
router.get(
  "/usage/export",
  authMiddleware,
  requireProResearcher,
  rateLimiter,
  analyticsController.exportUsage
);

// AI Usage: Any authenticated user can see their own AI usage
router.get(
  "/ai-usage",
  authMiddleware,
  rateLimiter,
  analyticsController.aiUsage
);

// Admin AI Usage: Admin-only
router.get(
  "/admin/ai-usage",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  analyticsController.adminAiUsage
);

export const analyticsRoutes = router;
