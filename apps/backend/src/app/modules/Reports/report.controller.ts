import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import { reportService } from "./report.service";
import {
  createReportSchema,
  exportReportQuerySchema,
  listReportsQuerySchema,
  previewReportsQuerySchema,
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

    // Admin CRUD list — never HTTP-cache or deletes/edits look stale
    res.set({ "Cache-Control": "private, no-store" });

    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Reports retrieved successfully"
    );
  }),

  getStats: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = listReportsQuerySchema.parse(req.query);
    const stats = await reportService.getReportStats({
      type: q.type,
      search: q.search,
    });
    res.set({ "Cache-Control": "private, no-store" });
    sendSuccessResponse(res, stats, "Report statistics retrieved successfully");
  }),

  preview: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = previewReportsQuerySchema.parse(req.query);
    const result = await reportService.previewReport({
      type: q.type,
      page: q.page ?? 1,
      limit: q.limit ?? 25,
      search: q.search,
    });
    res.set({ "Cache-Control": "private, no-store" });
    sendSuccessResponse(res, result, "Report preview retrieved successfully");
  }),

  export: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = exportReportQuerySchema.parse(req.query);
    const result = await reportService.exportReport({
      type: q.type,
      format: q.format,
    });

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    );
    res.setHeader("Content-Length", String(result.size));
    res.status(200).send(result.content);
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
    const rawFormat =
      typeof req.query.format === "string"
        ? req.query.format.toUpperCase()
        : undefined;
    const formatOverride =
      rawFormat === "CSV" || rawFormat === "JSON" ? rawFormat : undefined;

    const generated = await reportService.generateReport(id, formatOverride);

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
