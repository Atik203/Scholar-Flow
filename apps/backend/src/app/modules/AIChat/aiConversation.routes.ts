import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { AuthenticatedRequest } from "../../interfaces/common";
import { aiConversationService } from "./aiConversation.service";

const router: express.Router = express.Router();

router.get(
  "/",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const convs = await aiConversationService.listConversations(authReq.user!.id);
    sendSuccessResponse(res, { conversations: convs }, "Conversations retrieved");
  })
);

router.post(
  "/",
  authMiddleware as any,
  rateLimiter as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const { title, model, context } = req.body || {};
    const conv = await aiConversationService.createConversation(
      authReq.user!.id,
      title,
      model,
      context
    );
    sendSuccessResponse(res, conv, "Conversation created");
  })
);

router.get(
  "/:id",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const conv = await aiConversationService.getConversation(req.params.id, authReq.user!.id);
    sendSuccessResponse(res, conv, "Conversation retrieved");
  })
);

router.post(
  "/:id/messages",
  authMiddleware as any,
  rateLimiter as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const { content } = req.body || {};
    if (!content) {
      res.status(400).json({ success: false, message: "Content is required" });
      return;
    }
    const msg = await aiConversationService.sendMessage(
      req.params.id,
      authReq.user!.id,
      content
    );
    sendSuccessResponse(res, msg, "Message sent");
  })
);

router.post(
  "/:id/messages/stream",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const { content } = req.body || {};
    if (!content) {
      res.status(400).json({ success: false, message: "Content is required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendSSE = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    let aborted = false;
    req.on("close", () => { aborted = true; });

    try {
      await aiConversationService.streamMessage(
        req.params.id,
        authReq.user!.id,
        content,
        (token: string, done: boolean) => {
          if (aborted) return;
          if (done) {
            sendSSE("done", { content: token });
            res.end();
          } else {
            sendSSE("token", { token });
          }
        }
      );
    } catch (err: any) {
      if (!aborted) {
        sendSSE("error", { message: err?.message || "Stream failed" });
        res.end();
      }
    }
  })
);

router.delete(
  "/:id",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    await aiConversationService.deleteConversation(req.params.id, authReq.user!.id);
    sendSuccessResponse(res, null, "Conversation deleted");
  })
);

export const aiConversationRoutes = router;
