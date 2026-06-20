import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { AuthenticatedRequest } from "../../interfaces/common";
import { aiConversationService } from "./aiConversation.service";

const router = express.Router();

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
    const { title, model } = req.body || {};
    const conv = await aiConversationService.createConversation(
      authReq.user!.id,
      title,
      model
    );
    sendSuccessResponse(res, conv, "Conversation created");
  })
);

router.get(
  "/:id",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const conv = await aiConversationService.getConversation(req.params.id);
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

router.delete(
  "/:id",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    await aiConversationService.deleteConversation(req.params.id);
    sendSuccessResponse(res, null, "Conversation deleted");
  })
);

export const aiConversationRoutes = router;
