/**
 * Notification SSE Controller
 *
 * Real-time notification stream over Server-Sent Events.
 * Authenticated via `sseAuthMiddleware` (header OR `?token=`).
 * Pipes `notification.created` events from the broadcaster to the client.
 */

import type { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { notificationBroadcaster } from "./broadcast";

export const notificationSseController = {
  stream: (req: Request, res: Response): void => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id || authReq.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Set SSE response headers
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // Acknowledge connection
    res.write(`retry: 5000\n\n`);
    res.write(
      `event: connected\ndata: ${JSON.stringify({
        userId,
        connectedAt: new Date().toISOString(),
      })}\n\n`
    );

    // Subscribe via the public API so the broadcaster tracks this connection
    // and so the per-user channel pairing stays consistent with publish().
    const unsubscribe = notificationBroadcaster.subscribe(userId, res);

    // Keep-alive ping every 30s
    const pingInterval = setInterval(() => {
      try {
        res.write(`: ping ${Date.now()}\n\n`);
      } catch {
        clearInterval(pingInterval);
      }
    }, 30000);

    const cleanup = () => {
      clearInterval(pingInterval);
      unsubscribe();
    };

    req.on("close", cleanup);
    req.on("error", cleanup);
  },
};

