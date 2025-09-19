import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import { rateLimiter } from "../../middleware/rateLimiter";
import {
  validateRequestBody,
  validateRequestParams,
} from "../../middleware/validateRequest";
import workspaceController from "./workspace.controller";
import {
  createWorkspaceSchema,
  memberParamsSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
  workspaceParamsSchema,
} from "./workspace.validation";

export const workspaceRoutes: express.Router = express.Router();

// Apply perf monitor to all routes
workspaceRoutes.use(performanceMonitor as any);

// List my workspaces
workspaceRoutes.get(
  "/",
  rateLimiter,
  authMiddleware as any,
  workspaceController.list as any
);

// Create workspace
workspaceRoutes.post(
  "/",
  rateLimiter,
  authMiddleware as any,
  validateRequestBody(createWorkspaceSchema) as any,
  workspaceController.create as any
);

// Get one
workspaceRoutes.get(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(workspaceParamsSchema) as any,
  workspaceController.getOne as any
);

// Update
workspaceRoutes.patch(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(workspaceParamsSchema) as any,
  validateRequestBody(updateWorkspaceSchema) as any,
  workspaceController.update as any
);

// Delete
workspaceRoutes.delete(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(workspaceParamsSchema) as any,
  workspaceController.remove as any
);

// Members: list
workspaceRoutes.get(
  "/:id/members",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(workspaceParamsSchema) as any,
  workspaceController.listMembers as any
);

// Members: add
workspaceRoutes.post(
  "/:id/members",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(workspaceParamsSchema) as any,
  workspaceController.addMember as any
);

// Members: update role
workspaceRoutes.patch(
  "/:id/members/:memberId",
  authMiddleware as any,
  validateRequestParams(memberParamsSchema) as any,
  validateRequestBody(updateMemberRoleSchema) as any,
  workspaceController.updateMemberRole as any
);

// Members: remove
workspaceRoutes.delete(
  "/:id/members/:memberId",
  authMiddleware as any,
  validateRequestParams(memberParamsSchema) as any,
  workspaceController.removeMember as any
);

export default workspaceRoutes;
