import express from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import auditLogController from "./auditLog.controller";

const router: import("express").Router = express.Router();

router.use(authMiddleware as any, requireAdmin as any, rateLimiter as any);

router.get("/", auditLogController.list as any);
router.get("/summary", auditLogController.summary as any);
router.get("/export", auditLogController.export as any);
router.post("/", auditLogController.create as any);

export const auditLogRoutes = router;
