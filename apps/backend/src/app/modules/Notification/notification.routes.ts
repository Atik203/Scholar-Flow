import express from "express";
import { authMiddleware } from "../../middleware/auth";
import NotificationController from "./notification.controller";

const router: import("express").Router = express.Router();

// SSE stream for real-time notifications
router.get("/stream", authMiddleware as any, (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Acknowledge connection
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  // Keep connection alive with periodic pings
  const pingInterval = setInterval(() => {
    res.write(`:\n\n`); // Comment to keep connection alive
  }, 30000);

  // Clean up on client disconnect
  req.on("close", () => {
    clearInterval(pingInterval);
  });
});

// REST routes
router.get("/", authMiddleware as any, NotificationController.list as any);
router.get("/unread-count", authMiddleware as any, NotificationController.getUnreadCount as any);
router.put("/read-all", authMiddleware as any, NotificationController.markAllAsRead as any);
router.put("/:id/read", authMiddleware as any, NotificationController.markAsRead as any);
router.put("/:id/star", authMiddleware as any, NotificationController.toggleStarred as any);
router.delete("/bulk", authMiddleware as any, NotificationController.deleteBulk as any);
router.delete("/:id", authMiddleware as any, NotificationController.delete as any);

export const notificationRoutes = router;
