import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import personalAnalyticsService from "./personal.service";
import usageReportsService from "./usage.service";
import workspaceAnalyticsService from "./workspace.service";

export const analyticsController = {
  personal: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const timeRange = (String(req.query.timeRange ?? "month") as
      | "week"
      | "month"
      | "quarter"
      | "year");
    const summary = await personalAnalyticsService.getSummary(
      authReq.user.id,
      timeRange
    );
    sendSuccessResponse(res, summary, "Personal analytics retrieved");
  }),

  startReadingSession: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const paperId = req.body?.paperId
      ? String(req.body.paperId)
      : undefined;
    const session = await personalAnalyticsService.startReadingSession(
      authReq.user.id,
      paperId
    );
    sendSuccessResponse(res, session, "Reading session started", 201);
  }),

  stopReadingSession: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const eventId = String(req.params.eventId);
    const units = Number(req.body?.units ?? 0);
    const session = await personalAnalyticsService.stopReadingSession(
      eventId,
      units
    );
    sendSuccessResponse(res, session, "Reading session stopped");
  }),

  workspace: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const workspaceId = String(req.params.workspaceId);
    const timeRange = (String(req.query.timeRange ?? "month") as
      | "week"
      | "month"
      | "quarter"
      | "year");
    const summary = await workspaceAnalyticsService.getSummary(
      workspaceId,
      timeRange
    );
    sendSuccessResponse(res, summary, "Workspace analytics retrieved");
  }),

  usage: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const timeRange = (String(req.query.timeRange ?? "month") as
      | "week"
      | "month"
      | "quarter"
      | "year");
    const report = await usageReportsService.getReport(
      authReq.user.id,
      timeRange
    );
    sendSuccessResponse(res, report, "Usage report retrieved");
  }),

  exportUsage: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const format = (String(req.query.format ?? "csv") as "csv" | "json");
    const result = await usageReportsService.exportReport(
      authReq.user.id,
      format
    );
    res.setHeader("Content-Type", result.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    );
    res.setHeader("Content-Length", String(result.content.length));
    res.status(200).send(result.content);
  }),
};

export default analyticsController;
