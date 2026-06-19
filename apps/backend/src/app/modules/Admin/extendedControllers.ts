import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import { adminApiKeysService } from "./adminApiKeys.service";
import { adminModerationService } from "./adminModeration.service";
import { adminPaymentsService } from "./adminPayments.service";
import { adminPlansService } from "./adminPlans.service";
import { systemAlertsService } from "./systemAlerts.service";

// Plans
export const adminPlansController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const items = await adminPlansService.listPlansWithStats();
    sendSuccessResponse(res, items, "Plans retrieved");
  }),
};

// Payments
export const adminPaymentsController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit
      ? Math.min(parseInt(String(req.query.limit), 10), 100)
      : 20;
    const status = req.query.status ? String(req.query.status) : undefined;
    const provider = req.query.provider
      ? String(req.query.provider)
      : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const result = await adminPaymentsService.listPayments({
      page,
      limit,
      status,
      provider,
      search,
    });
    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Payments retrieved"
    );
  }),

  refund: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "Payment id is required");
    const payment = await adminPaymentsService.refundPayment(
      id,
      authReq.user.id
    );
    sendSuccessResponse(res, payment, "Payment refunded");
  }),
};

// API Keys
export const adminApiKeysController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const items = await adminApiKeysService.listKeys();
    sendSuccessResponse(res, items, "API keys retrieved");
  }),

  get: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await adminApiKeysService.getKey(id);
    sendSuccessResponse(res, item, "API key retrieved");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const item = await adminApiKeysService.createKey(authReq.user.id, req.body);
    sendSuccessResponse(res, item, "API key created", 201);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await adminApiKeysService.updateKey(id, req.body);
    sendSuccessResponse(res, item, "API key updated");
  }),

  revoke: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await adminApiKeysService.revokeKey(id);
    sendSuccessResponse(res, item, "API key revoked");
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const result = await adminApiKeysService.deleteKey(id);
    sendSuccessResponse(res, result, "API key deleted");
  }),
};

// Moderation
export const adminModerationController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit
      ? Math.min(parseInt(String(req.query.limit), 10), 100)
      : 20;
    const status = req.query.status
      ? (String(req.query.status) as
          | "PENDING"
          | "UNDER_REVIEW"
          | "RESOLVED"
          | "DISMISSED")
      : undefined;
    const contentType = req.query.contentType
      ? (String(req.query.contentType) as
          | "PAPER"
          | "COMMENT"
          | "COLLECTION"
          | "PROFILE")
      : undefined;
    const assignedToId = req.query.assignedToId
      ? String(req.query.assignedToId)
      : undefined;

    const result = await adminModerationService.listReports({
      status,
      contentType,
      assignedToId,
      page,
      limit,
    });
    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Reports retrieved"
    );
  }),

  get: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await adminModerationService.getReport(id);
    sendSuccessResponse(res, item, "Report retrieved");
  }),

  assign: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const assignedToId = String(req.body?.assignedToId ?? "");
    if (!assignedToId) throw new ApiError(400, "assignedToId is required");
    const item = await adminModerationService.assignReport(id, assignedToId);
    sendSuccessResponse(res, item, "Report assigned");
  }),

  resolve: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const action = String(req.body?.action ?? "approved") as
      | "approved"
      | "removed"
      | "warning"
      | "suspended";
    const item = await adminModerationService.resolveReport(
      id,
      authReq.user.id,
      action
    );
    sendSuccessResponse(res, item, "Report resolved");
  }),

  dismiss: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await adminModerationService.dismissReport(
      id,
      authReq.user.id
    );
    sendSuccessResponse(res, item, "Report dismissed");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const item = await adminModerationService.createReport(
      authReq.user.id,
      req.body
    );
    sendSuccessResponse(res, item, "Report filed", 201);
  }),
};

// System Alerts
export const systemAlertsController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit
      ? Math.min(parseInt(String(req.query.limit), 10), 100)
      : 20;
    const category = req.query.category
      ? (String(req.query.category) as
          | "USER"
          | "BILLING"
          | "SECURITY"
          | "STORAGE"
          | "PROCESSING"
          | "SYSTEM")
      : undefined;
    const severity = req.query.severity
      ? (String(req.query.severity) as "INFO" | "WARNING" | "CRITICAL")
      : undefined;
    const resolvedParam = req.query.resolved;
    const resolved =
      resolvedParam === undefined
        ? undefined
        : String(resolvedParam) === "true";

    const result = await systemAlertsService.listAlerts({
      category,
      severity,
      resolved,
      page,
      limit,
    });
    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Alerts retrieved"
    );
  }),

  counts: catchAsync(async (_req: Request, res: Response) => {
    const counts = await systemAlertsService.getCounts();
    sendSuccessResponse(res, counts, "Alert counts retrieved");
  }),

  resolve: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { id } = req.params as { id: string };
    if (!id) throw new ApiError(400, "id is required");
    const item = await systemAlertsService.resolveAlert(id, authReq.user.id);
    sendSuccessResponse(res, item, "Alert resolved");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const item = await systemAlertsService.createAlert(req.body);
    sendSuccessResponse(res, item, "Alert created", 201);
  }),
};

export default {
  adminPlansController,
  adminPaymentsController,
  adminApiKeysController,
  adminModerationController,
  systemAlertsController,
};
