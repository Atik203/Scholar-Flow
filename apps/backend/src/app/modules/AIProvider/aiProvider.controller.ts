/**
 * AIProvider admin controller
 *
 * Endpoints (all admin-only):
 *   GET    /api/admin/ai-providers              list (with isDefault + key status)
 *   GET    /api/admin/ai-providers/keys/status  show which env-backed API keys are set
 *   POST   /api/admin/ai-providers              create
 *   PATCH  /api/admin/ai-providers/:id          update
 *   POST   /api/admin/ai-providers/:id/default  set as default
 *   POST   /api/admin/ai-providers/reorder      batch reorder
 *   DELETE /api/admin/ai-providers/:id          soft delete
 */
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse, { sendSuccessResponse } from "../../shared/sendResponse";
import { aiProviderService } from "./aiProvider.service";

export const aiProviderController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const providers = await aiProviderService.list();
    const keyStatuses = await aiProviderService.getKeyStatuses();
    sendSuccessResponse(
      res,
      { providers, keyStatuses },
      "AI providers retrieved"
    );
  }),

  keyStatuses: catchAsync(async (_req: Request, res: Response) => {
    const keyStatuses = await aiProviderService.getKeyStatuses();
    sendSuccessResponse(res, { keyStatuses }, "API key statuses retrieved");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const created = await aiProviderService.create(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "AI provider created",
      data: created,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const updated = await aiProviderService.update(req.params.id, req.body);
    sendSuccessResponse(res, updated, "AI provider updated");
  }),

  setDefault: catchAsync(async (req: Request, res: Response) => {
    const updated = await aiProviderService.setDefault(req.params.id);
    sendSuccessResponse(res, updated, "Default AI provider updated");
  }),

  reorder: catchAsync(async (req: Request, res: Response) => {
    const items = req.body?.items ?? [];
    const providers = await aiProviderService.reorder(items);
    sendSuccessResponse(res, providers, "AI providers reordered");
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await aiProviderService.softDelete(req.params.id);
    sendSuccessResponse(res, null, "AI provider removed");
  }),
};
