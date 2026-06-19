import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import notificationSettingsService from "./notificationSettings.service";
import { notificationSettingsUpdateSchema } from "./notificationSettings.validation";

export const notificationSettingsController = {
  get: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const prefs = await notificationSettingsService.getPreferences(
      authReq.user.id
    );
    sendSuccessResponse(res, prefs, "Notification preferences retrieved");
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const parsed = notificationSettingsUpdateSchema.parse(req.body ?? {});
    const updated = await notificationSettingsService.updatePreferences(
      authReq.user.id,
      parsed as Parameters<
        typeof notificationSettingsService.updatePreferences
      >[1]
    );
    sendSuccessResponse(res, updated, "Notification preferences updated");
  }),
};

export default notificationSettingsController;
