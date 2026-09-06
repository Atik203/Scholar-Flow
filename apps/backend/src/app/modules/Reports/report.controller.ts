import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import { reportService } from "./report.service";
import {
  createReportSchema,
  listReportsQuerySchema,
  reportIdSchema,
  updateReportSchema,
} from "./report.validation";

export const reportController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = listReportsQuerySchema.parse(req.query);
    const result = await reportService.listReports({
      type: q.type,
      status: q.status,
      enabled: q.enabled,
      search: q.search,
      page: q.page ?? 1,
      limit: q.limit ?? 20,
    });

    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Reports retrieved successfully"
    );
  }),

  get: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = reportIdSchema.parse(req.params);
    const report = await reportService.getReport(id);
    sendSuccessResponse(res, report, "Report retrieved successfully");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const data = createReportSchema.parse(req.body);
    const report = await reportService.createReport(authReq.user.id, data);
    sendSuccessResponse(res, report, "Report created successfully", 201);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = reportIdSchema.parse(req.params);
    const patch = updateReportSchema.parse(req.body);
    const updated = await reportService.updateReport(id, patch);
    sendSuccessResponse(res, updated, "Report updated successfully");
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = reportIdSchema.parse(req.params);
    const result = await reportService.softDeleteReport(id);
    sendSuccessResponse(res, result, "Report deleted successfully");
  }),

  generate: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = reportIdSchema.parse(req.params);
    const generated = await reportService.generateReport(id);

    res.setHeader("Content-Type", generated.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${generated.filename}"`
    );
    res.setHeader("Content-Length", String(generated.size));
    res.status(200).send(generated.content);
  }),
};

export default reportController;
