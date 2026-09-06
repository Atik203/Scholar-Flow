import express from "express";
import { authMiddleware } from "../middleware/auth";
import { workspaceController } from "../modules/Workspace/workspace.controller";

const router: import("express").Router = express.Router();

// Public: get invitation details by token (no auth — used by email link landing page)
router.get("/:token", workspaceController.getInvitationByToken as any);

// Auth required: accept/decline after user logs in
router.post("/:token/accept", authMiddleware as any, workspaceController.acceptInvitationByToken as any);
router.post("/:token/decline", authMiddleware as any, workspaceController.declineInvitationByToken as any);

export { router as invitationRoutes };
