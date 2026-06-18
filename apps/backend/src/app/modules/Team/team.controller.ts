import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import TeamService from "./team.service";
import {
  inviteTeamMemberSchema,
  listTeamInvitationsSchema,
  listTeamMembersSchema,
  teamActivityQuerySchema,
  teamInvitationParamsSchema,
  teamMemberParamsSchema,
  teamStatsQuerySchema,
  updateTeamMemberSchema,
  updateTeamSettingsSchema,
} from "./team.validation";

export const teamController = {
  // ==========================================================================
  // Members
  // ==========================================================================

  listMembers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = listTeamMembersSchema.parse(req.query);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const cursor = q.cursor;
    const result = await TeamService.listMembers(authReq.user.id, limit, cursor, {
      search: q.search,
      role: q.role,
      status: q.status,
    });
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Team members retrieved successfully"
    );
  }),

  getMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { userId } = teamMemberParamsSchema.parse(req.params);
    const member = await TeamService.getMember(authReq.user.id, userId);
    sendSuccessResponse(res, member, "Team member retrieved");
  }),

  updateMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { userId } = teamMemberParamsSchema.parse(req.params);
    const body = updateTeamMemberSchema.parse(req.body);
    const result = await TeamService.updateMember(authReq.user.id, userId, body);
    sendSuccessResponse(res, result, "Team member updated");
  }),

  removeMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { userId } = teamMemberParamsSchema.parse(req.params);
    const result = await TeamService.removeMember(authReq.user.id, userId);
    sendSuccessResponse(res, result, "Team member removed");
  }),

  // ==========================================================================
  // Activity
  // ==========================================================================

  getActivity: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = teamActivityQuerySchema.parse(req.query);
    const limit = Math.min(100, parseInt((q.limit as string) || "30", 10));
    const result = await TeamService.getActivity(
      authReq.user.id,
      limit,
      q.cursor,
      {
        entity: q.entity,
        memberId: q.memberId,
        startDate: q.startDate,
        endDate: q.endDate,
      }
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Team activity retrieved"
    );
  }),

  getActivitySummary: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = teamStatsQuerySchema.parse(req.query);
    const days = Math.min(90, parseInt((q.days as string) || "7", 10));
    const summary = await TeamService.getActivitySummary(authReq.user.id, days);
    sendSuccessResponse(res, summary, "Team activity summary retrieved");
  }),

  getStats: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const stats = await TeamService.getStats(authReq.user.id);
    sendSuccessResponse(res, stats, "Team stats retrieved");
  }),

  // ==========================================================================
  // Invitations
  // ==========================================================================

  sendInvitation: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const body = inviteTeamMemberSchema.parse(req.body);
    const result = await TeamService.inviteMember(authReq.user.id, body);
    sendSuccessResponse(res, result, "Invitation sent", 201);
  }),

  listInvitationsSent: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = listTeamInvitationsSchema.parse(req.query);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const page = Math.max(1, parseInt((q.page as string) || "1", 10));
    const skip = (page - 1) * limit;
    const result = await TeamService.listSentInvitations(
      authReq.user.id,
      limit,
      skip
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
      "Sent invitations retrieved"
    );
  }),

  listInvitationsReceived: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = listTeamInvitationsSchema.parse(req.query);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const page = Math.max(1, parseInt((q.page as string) || "1", 10));
    const skip = (page - 1) * limit;
    const result = await TeamService.listReceivedInvitations(
      authReq.user.id,
      limit,
      skip
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
      "Received invitations retrieved"
    );
  }),

  cancelInvitation: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = teamInvitationParamsSchema.parse(req.params);
    const result = await TeamService.cancelInvitation(authReq.user.id, id);
    sendSuccessResponse(res, result, "Invitation cancelled");
  }),

  resendInvitation: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = teamInvitationParamsSchema.parse(req.params);
    const result = await TeamService.resendInvitation(authReq.user.id, id);
    sendSuccessResponse(res, result, "Invitation resent");
  }),

  // ==========================================================================
  // Settings
  // ==========================================================================

  getSettings: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const settings = await TeamService.getSettings(authReq.user.id);
    sendSuccessResponse(res, settings, "Team settings retrieved");
  }),

  updateSettings: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const body = updateTeamSettingsSchema.parse(req.body);
    const settings = await TeamService.updateSettings(authReq.user.id, body);
    sendSuccessResponse(res, settings, "Team settings updated");
  }),
};

export default teamController;
