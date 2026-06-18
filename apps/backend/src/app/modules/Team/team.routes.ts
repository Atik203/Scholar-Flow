import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import { rateLimiter } from "../../middleware/rateLimiter";
import { requireRole, requireTeamLead } from "../../middleware/requireRole";
import { validateRequestBody, validateRequestParams } from "../../middleware/validateRequest";
import { USER_ROLES } from "../Auth/auth.constant";
import teamController from "./team.controller";
import {
  inviteTeamMemberSchema,
  teamInvitationParamsSchema,
  teamMemberParamsSchema,
  updateTeamMemberSchema,
  updateTeamSettingsSchema,
} from "./team.validation";

export const teamRoutes: express.Router = express.Router();

teamRoutes.use(performanceMonitor as any);

// All team routes require TEAM_LEAD+ (or ADMIN)
teamRoutes.use(authMiddleware as any);
teamRoutes.use(requireTeamLead as any);

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
  validateRequestParams(teamMemberParamsSchema) as any,
  validateRequestBody(updateTeamMemberSchema) as any,
  teamController.updateMember as any
);

// Only ADMIN can remove a user from the team
teamRoutes.delete(
  "/members/:userId",
  rateLimiter as any,
  validateRequestParams(teamMemberParamsSchema) as any,
  requireRole(USER_ROLES.ADMIN) as any,
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
// Settings
// ----------------------------------------------------------------------------

teamRoutes.get(
  "/settings",
  rateLimiter as any,
  teamController.getSettings as any
);

teamRoutes.patch(
  "/settings",
  rateLimiter as any,
  validateRequestBody(updateTeamSettingsSchema) as any,
  teamController.updateSettings as any
);

export default teamRoutes;
