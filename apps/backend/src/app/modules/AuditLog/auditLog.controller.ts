import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import auditLogService from "./auditLog.service";
import {
  createAuditEntrySchema,
  exportAuditLogQuerySchema,
  listAuditLogQuerySchema,
} from "./auditLog.validation";

export const auditLogController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = listAuditLogQuerySchema.parse(req.query);
    const result = await auditLogService.listEntries({
      userId: q.userId,
      workspaceId: q.workspaceId,
      entity: q.entity,
      entityId: q.entityId,
      action: q.action,
      severity: q.severity,
      startDate: q.startDate,
      endDate: q.endDate,
      search: q.search,
      page: q.page ?? 1,
      limit: q.limit ?? 50,
    });

    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Audit log entries retrieved"
    );
  }),

  summary: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const startDate = req.query.startDate
      ? new Date(String(req.query.startDate))
      : undefined;
    const endDate = req.query.endDate
      ? new Date(String(req.query.endDate))
      : undefined;

    const summary = await auditLogService.getSummary({ startDate, endDate });
    sendSuccessResponse(res, summary, "Audit log summary retrieved");
  }),

  export: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = exportAuditLogQuerySchema.parse(req.query);
    const result = await auditLogService.exportEntries({
      userId: q.userId,
      workspaceId: q.workspaceId,
      entity: q.entity,
      entityId: q.entityId,
      action: q.action,
      severity: q.severity,
      startDate: q.startDate,
      endDate: q.endDate,
      format: q.format,
      limit: q.limit ?? 1000,
    });

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    );
    res.setHeader("Content-Length", String(result.content.length));
    res.status(200).send(result.content);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const data = createAuditEntrySchema.parse(req.body);
    const entry = await auditLogService.createEntry(authReq.user.id, data);
    sendSuccessResponse(res, entry, "Audit entry created", 201);
  }),
};

export default auditLogController;
