/**
 * Notification SSE Controller
 *
 * Real-time notification stream over Server-Sent Events.
 * Replaces the previous stub. Authenticated via the standard JWT middleware
 * and pipes `notification.created` events from the broadcaster to the client.
 */

import type { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import notificationBroadcaster from "./broadcast";

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

    // Subscribe to broadcaster events for this user only
    // (The per-user channel is wired inside subscribe() via the global listener.)
    // We do this by using a per-user emitter below.
    const userChannel = `scholarflow:notifications:${userId}`;
    const listener = (payload: unknown) => {
      try {
        const event = payload as { type: string; data: unknown; id?: string };
        const lines: string[] = [];
        if (event.id) lines.push(`id: ${event.id}`);
        lines.push(`event: ${event.type}`);
        lines.push(`data: ${JSON.stringify(event.data)}`);
        lines.push("");
        lines.push("");
        res.write(lines.join("\n"));
      } catch {
        // ignore write errors
      }
    };

    // Hook a per-user listener onto the global emitter by re-using the
    // broadcaster's internal emit pattern. We expose a thin wrapper for this.
    notificationBroadcaster["emitter"].on(userChannel, listener);

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
      notificationBroadcaster["emitter"].off(userChannel, listener);
    };

    req.on("close", cleanup);
    req.on("error", cleanup);
  },
};

export default notificationSseController;
