import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import { notificationService } from "./notification.service";
import { listQuerySchema, notificationIdSchema } from "./notification.validation";

export const NotificationController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = listQuerySchema.parse(req.query);
    const cursor = q.cursor;
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));

    const queryParams = {
      type: q.type as string | undefined,
      read: q.read as string | undefined,
      starred: q.starred as string | undefined,
    };

    const result = await notificationService.listNotifications(
      authReq.user.id,
      limit,
      cursor,
      queryParams
    );

    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Notifications retrieved successfully"
    );
  }),

  getUnreadCount: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const result = await notificationService.getUnreadCount(authReq.user.id);
    sendSuccessResponse(res, result, "Unread count retrieved");
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await notificationService.markAsRead(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification marked as read");
  }),

  toggleStarred: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await notificationService.toggleStarred(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification star toggled");
  }),

  markAllAsRead: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const result = await notificationService.markAllAsRead(authReq.user.id);
    sendSuccessResponse(res, result, "All notifications marked as read");
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await notificationService.deleteNotification(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification deleted");
  }),

  deleteBulk: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      throw new ApiError(400, "Ids must be an array");
    }

    const result = await notificationService.deleteBulk(authReq.user.id, ids);
    sendSuccessResponse(res, result, "Notifications deleted");
  }),
};

export default NotificationController;
