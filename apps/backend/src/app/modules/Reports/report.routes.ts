import express from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import reportController from "./report.controller";

const router: import("express").Router = express.Router();

router.use(authMiddleware as any, requireAdmin as any, rateLimiter as any);

router.get("/", reportController.list as any);
router.get("/:id", reportController.get as any);
router.post("/", reportController.create as any);
router.patch("/:id", reportController.update as any);
router.delete("/:id", reportController.remove as any);
router.post("/:id/generate", reportController.generate as any);

export const reportRoutes = router;
