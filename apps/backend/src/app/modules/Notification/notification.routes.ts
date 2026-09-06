import express from "express";
import { authMiddleware, sseAuthMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import { NotificationController } from "./notification.controller";
import { notificationSettingsController } from "./notificationSettings.controller";
import { notificationSseController } from "./sse.controller";

const router: import("express").Router = express.Router();

// SSE stream for real-time notifications (must come before the catch-all "/" route).
// Uses sseAuthMiddleware because EventSource cannot set the Authorization header —
// the client passes the JWT via `?token=...` instead.
router.get(
  "/stream",
  sseAuthMiddleware as any,
  rateLimiter as any,
  notificationSseController.stream as any
);

// Notification settings (channels, categories, quiet hours)
router.get(
  "/settings",
  authMiddleware as any,
  rateLimiter as any,
  notificationSettingsController.get as any
);

router.put(
  "/settings",
  authMiddleware as any,
  rateLimiter as any,
  notificationSettingsController.update as any
);

// REST routes
router.get("/", authMiddleware as any, NotificationController.list as any);
router.get(
  "/unread-count",
  authMiddleware as any,
  NotificationController.getUnreadCount as any
);
router.put(
  "/read-all",
  authMiddleware as any,
  NotificationController.markAllAsRead as any
);
router.put(
  "/:id/read",
  authMiddleware as any,
  NotificationController.markAsRead as any
);
router.put(
  "/:id/star",
  authMiddleware as any,
  NotificationController.toggleStarred as any
);
router.delete(
  "/bulk",
  authMiddleware as any,
  NotificationController.deleteBulk as any
);
router.delete(
  "/:id",
  authMiddleware as any,
  NotificationController.delete as any
);

export const notificationRoutes = router;
