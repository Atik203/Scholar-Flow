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
  listQuerySchema,
  memberParamsSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
  workspaceParamsSchema,
} from "./workspace.validation";

export const workspaceController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const q = listQuerySchema.parse(req.query);
    const page = parseInt((q.page as string) || "1", 10);
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const skip = (page - 1) * limit;
    const scope = (q.scope as any) || "all";
    const result = await WorkspaceService.listUserWorkspaces(
      authReq.user.id,
      limit,
      skip,
      scope
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
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
    const page = parseInt((q.page as string) || "1", 10);
    const limit = Math.min(50, parseInt((q.limit as string) || "10", 10));
    const skip = (page - 1) * limit;
    const result = await WorkspaceService.listMembers(
      authReq.user.id,
      params.id,
      limit,
      skip
    );
    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit },
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
    const q = listQuerySchema.parse(req.query);
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
    const q = listQuerySchema.parse(req.query);
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
};

export default workspaceController;
