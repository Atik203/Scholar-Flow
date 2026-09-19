import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import { rateLimiter } from "../../middleware/rateLimiter";
import { requireTeamLead } from "../../middleware/requireRole";
import { requireTeamAccess } from "../../middleware/requireTeamAccess";
import { validateRequestBody, validateRequestParams } from "../../middleware/validateRequest";
import { teamController } from "./team.controller";
import {
  inviteTeamMemberSchema,
  teamInvitationParamsSchema,
  teamMemberParamsSchema,
  updateTeamMemberSchema,
  updateTeamSettingsSchema,
} from "./team.validation";

export const teamRoutes: express.Router = express.Router();

teamRoutes.use(performanceMonitor as any);

// Access probe must stay reachable before the access gate itself — the
// sidebar and the team layout use it to decide whether to render.
teamRoutes.get(
  "/access",
  authMiddleware as any,
  teamController.getAccess as any
);

// Read/participate endpoints: lead+ OR active workspace collaboration.
// This lets invited RESEARCHER / PRO_RESEARCHER users see their team until the
// lead removes them from the workspace.
teamRoutes.use(authMiddleware as any);
teamRoutes.use(requireTeamAccess as any);

// ----------------------------------------------------------------------------
// Members
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/members",
  rateLimiter as any,
  teamController.listMembers as any
);

teamRoutes.get(
  "/members/:userId",
  rateLimiter as any,
  validateRequestParams(teamMemberParamsSchema) as any,
  teamController.getMember as any
);

teamRoutes.patch(
  "/members/:userId",
  rateLimiter as any,
  requireTeamLead as any,
  validateRequestParams(teamMemberParamsSchema) as any,
  validateRequestBody(updateTeamMemberSchema) as any,
  teamController.updateMember as any
);

// TEAM_LEAD+ can revoke access to the workspaces they own; ADMIN account
// deletion stays in the admin panel.
teamRoutes.delete(
  "/members/:userId",
  rateLimiter as any,
  requireTeamLead as any,
  validateRequestParams(teamMemberParamsSchema) as any,
  teamController.removeMember as any
);

// ----------------------------------------------------------------------------
// Stats
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/stats",
  rateLimiter as any,
  teamController.getStats as any
);

// ----------------------------------------------------------------------------
// Activity
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/activity",
  rateLimiter as any,
  teamController.getActivity as any
);

teamRoutes.get(
  "/activity/summary",
  rateLimiter as any,
  teamController.getActivitySummary as any
);

// ----------------------------------------------------------------------------
// Invitations
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/invitations/sent",
  rateLimiter as any,
  teamController.listInvitationsSent as any
);

teamRoutes.get(
  "/invitations/received",
  rateLimiter as any,
  teamController.listInvitationsReceived as any
);

teamRoutes.post(
  "/invitations",
  rateLimiter as any,
  validateRequestBody(inviteTeamMemberSchema) as any,
  teamController.sendInvitation as any
);

teamRoutes.delete(
  "/invitations/:id",
  rateLimiter as any,
  validateRequestParams(teamInvitationParamsSchema) as any,
  teamController.cancelInvitation as any
);

teamRoutes.post(
  "/invitations/:id/resend",
  rateLimiter as any,
  validateRequestParams(teamInvitationParamsSchema) as any,
  teamController.resendInvitation as any
);

// ----------------------------------------------------------------------------
// Settings (per-account preferences — manage access only)
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/settings",
  rateLimiter as any,
  requireTeamLead as any,
  teamController.getSettings as any
);

teamRoutes.patch(
  "/settings",
  rateLimiter as any,
  requireTeamLead as any,
  validateRequestBody(updateTeamSettingsSchema) as any,
  teamController.updateSettings as any
);

export default teamRoutes;
