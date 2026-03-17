import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import NotificationService from "./notification.service";
import { listQuerySchema, notificationIdSchema } from "./notification.validation";

export const NotificationController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = listQuerySchema.parse(req.query);
    const page = parseInt((q.page as string) || "1", 10);
    const limit = Math.min(50, parseInt((q.limit as string) || "20", 10));
    const skip = (page - 1) * limit;

    const queryParams = {
      type: q.type as string | undefined,
      read: q.read as string | undefined,
      starred: q.starred as string | undefined,
    };

    const result = await NotificationService.listNotifications(
      authReq.user.id,
      limit,
      skip,
      queryParams
    );

    sendPaginatedResponse(
      res,
      result.result,
      { 
        ...result.meta, 
        page, 
        limit,
        totalPage: Math.ceil(result.meta.total / limit)
      },
      "Notifications retrieved successfully"
    );
  }),

  getUnreadCount: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const result = await NotificationService.getUnreadCount(authReq.user.id);
    sendSuccessResponse(res, result, "Unread count retrieved");
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await NotificationService.markAsRead(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification marked as read");
  }),

  toggleStarred: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await NotificationService.toggleStarred(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification star toggled");
  }),

  markAllAsRead: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const result = await NotificationService.markAllAsRead(authReq.user.id);
    sendSuccessResponse(res, result, "All notifications marked as read");
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { id } = notificationIdSchema.parse(req.params);
    const result = await NotificationService.deleteNotification(authReq.user.id, id);
    sendSuccessResponse(res, result, "Notification deleted");
  }),

  deleteBulk: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      throw new ApiError(400, "Ids must be an array");
    }

    const result = await NotificationService.deleteBulk(authReq.user.id, ids);
    sendSuccessResponse(res, result, "Notifications deleted");
  }),
};

export default NotificationController;
