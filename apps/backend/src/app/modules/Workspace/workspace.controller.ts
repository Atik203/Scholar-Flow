import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import WorkspaceService from "./workspace.service";
import {
  addMemberSchema,
  createWorkspaceSchema,
  inviteMemberSchema,
  invitationListQuerySchema,
  listQuerySchema,
  memberParamsSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
  updateWorkspaceSettingsSchema,
  workspaceParamsSchema,
} from "./workspace.validation";

export const workspaceController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = listQuerySchema.parse(req.query);
    const cursor = q.cursor;
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const scope = (q.scope as any) || "all";
    const result = await WorkspaceService.listUserWorkspaces(
      authReq.user.id,
      limit,
      cursor,
      scope
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Workspaces retrieved successfully"
    );
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const body = createWorkspaceSchema.parse(req.body);
    const workspace = await WorkspaceService.createWorkspace(
      authReq.user.id,
      body.name
    );
    sendSuccessResponse(res, workspace, "Workspace created", 201);
  }),

  getOne: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const ws = await WorkspaceService.getWorkspace(authReq.user.id, params.id);
    sendSuccessResponse(res, ws, "Workspace retrieved");
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const body = updateWorkspaceSchema.parse(req.body);
    const ws = await WorkspaceService.updateWorkspace(
      authReq.user.id,
      params.id,
      body
    );
    sendSuccessResponse(res, ws, "Workspace updated");
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const out = await WorkspaceService.deleteWorkspace(
      authReq.user.id,
      params.id
    );
    sendSuccessResponse(res, out, "Workspace deleted");
  }),

  listMembers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const q = listQuerySchema.parse(req.query);
    const cursor = q.cursor;
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const result = await WorkspaceService.listMembers(
      authReq.user.id,
      params.id,
      limit,
      cursor
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Members retrieved"
    );
  }),

  addMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const body = addMemberSchema.parse(req.body);
    const result = await WorkspaceService.addMember(
      authReq.user.id,
      params.id,
      body
    );
    sendSuccessResponse(res, result, "Member added");
  }),

  updateMemberRole: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = memberParamsSchema.parse({ ...req.params });
    const body = updateMemberRoleSchema.parse(req.body);
    const result = await WorkspaceService.updateMemberRole(
      authReq.user.id,
      params.id,
      params.memberId,
      body.role
    );
    sendSuccessResponse(res, result, "Member role updated");
  }),

  removeMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = memberParamsSchema.parse({ ...req.params });
    const result = await WorkspaceService.removeMember(
      authReq.user.id,
      params.id,
      params.memberId
    );
    sendSuccessResponse(res, result, "Member removed");
  }),

  // Invite a member by email
  inviteMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const body = inviteMemberSchema.parse(req.body);
    const result = await WorkspaceService.inviteMember(
      authReq.user.id,
      params.id,
      body
    );
    sendSuccessResponse(res, result, "Invitation sent successfully", 201);
  }),

  // Accept invitation
  acceptInvitation: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const result = await WorkspaceService.acceptInvitation(
      authReq.user.id,
      params.id
    );
    sendSuccessResponse(res, result, "Invitation accepted");
  }),

  // Decline invitation
  declineInvitation: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const result = await WorkspaceService.declineInvitation(
      authReq.user.id,
      params.id
    );
    sendSuccessResponse(res, result, "Invitation declined");
  }),

  // Get invitations sent by the user
  getInvitationsSent: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = invitationListQuerySchema.parse(req.query);
    const page = parseInt((q.page as string) || "1", 10);
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const skip = (page - 1) * limit;
    const result = await WorkspaceService.getInvitationsSent(
      authReq.user.id,
      limit,
      skip
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
      "Invitations sent retrieved successfully"
    );
  }),

  // Get invitations received by the user
  getInvitationsReceived: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = invitationListQuerySchema.parse(req.query);
    const page = parseInt((q.page as string) || "1", 10);
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const skip = (page - 1) * limit;
    const result = await WorkspaceService.getInvitationsReceived(
      authReq.user.id,
      limit,
      skip
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
      "Invitations received retrieved successfully"
    );
  }),

  // ==========================================================================
  // Phase 5 — Settings, Activity, Stats, Papers, Collections
  // ==========================================================================

  getSettings: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const settings = await WorkspaceService.getWorkspaceSettings(
      authReq.user.id,
      params.id
    );
    sendSuccessResponse(res, settings, "Workspace settings retrieved");
  }),

  updateSettings: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const body = updateWorkspaceSettingsSchema.parse(req.body);
    const settings = await WorkspaceService.updateWorkspaceSettings(
      authReq.user.id,
      params.id,
      body
    );
    sendSuccessResponse(res, settings, "Workspace settings updated");
  }),

  getStats: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const stats = await WorkspaceService.getWorkspaceStats(
      authReq.user.id,
      params.id
    );
    sendSuccessResponse(res, stats, "Workspace stats retrieved");
  }),

  getActivity: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const q = listQuerySchema.parse(req.query);
    const limit = Math.min(100, parseInt((q.limit as string) || "30", 10));
    const result = await WorkspaceService.getWorkspaceActivity(
      authReq.user.id,
      params.id,
      limit,
      q.cursor
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Workspace activity retrieved"
    );
  }),

  getPapers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const q = listQuerySchema.parse(req.query);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const result = await WorkspaceService.getWorkspacePapers(
      authReq.user.id,
      params.id,
      limit,
      q.cursor
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Workspace papers retrieved"
    );
  }),

  getCollections: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const params = workspaceParamsSchema.parse(req.params);
    const q = listQuerySchema.parse(req.query);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const result = await WorkspaceService.getWorkspaceCollections(
      authReq.user.id,
      params.id,
      limit,
      q.cursor
    );
    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Workspace collections retrieved"
    );
  }),
};

export default workspaceController;
