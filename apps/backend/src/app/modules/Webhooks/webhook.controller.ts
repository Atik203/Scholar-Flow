import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import { groupEventsByCategory, WEBHOOK_EVENT_TYPES } from "./eventTypes";
import { webhookService } from "./webhook.service";
import {
  createEndpointSchema,
  endpointIdSchema,
  listDeliveriesQuerySchema,
  updateEndpointSchema,
} from "./webhook.validation";

export const webhookController = {
  listEventTypes: catchAsync(async (_req: Request, res: Response) => {
    sendSuccessResponse(
      res,
      { events: WEBHOOK_EVENT_TYPES, grouped: groupEventsByCategory() },
      "Webhook event types retrieved"
    );
  }),

  listEndpoints: catchAsync(async (_req: Request, res: Response) => {
    const items = await webhookService.listEndpoints();
    sendSuccessResponse(res, items, "Webhook endpoints retrieved");
  }),

  getEndpoint: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const ep = await webhookService.getEndpoint(id);
    sendSuccessResponse(res, ep, "Webhook endpoint retrieved");
  }),

  createEndpoint: catchAsync(async (req: Request, res: Response) => {
    const data = createEndpointSchema.parse(req.body);
    const ep = await webhookService.createEndpoint(data);
    sendSuccessResponse(res, ep, "Webhook endpoint created", 201);
  }),

  updateEndpoint: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const patch = updateEndpointSchema.parse(req.body);
    const updated = await webhookService.updateEndpoint(id, patch);
    sendSuccessResponse(res, updated, "Webhook endpoint updated");
  }),

  rotateSecret: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const result = await webhookService.rotateSecret(id);
    sendSuccessResponse(res, result, "Secret rotated");
  }),

  deleteEndpoint: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const result = await webhookService.deleteEndpoint(id);
    sendSuccessResponse(res, result, "Webhook endpoint deleted");
  }),

  testEndpoint: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const result = await webhookService.testEndpoint(id);
    sendSuccessResponse(res, result, "Test event fired");
  }),

  listDeliveries: catchAsync(async (req: Request, res: Response) => {
    const { id } = endpointIdSchema.parse(req.params);
    const q = listDeliveriesQuerySchema.parse(req.query);
    const result = await webhookService.listDeliveries(id, {
      page: q.page ?? 1,
      limit: q.limit ?? 20,
      status: q.status,
    });
    sendPaginatedResponse(
      res,
      result.items,
      result.meta,
      "Deliveries retrieved"
    );
  }),

  retryDelivery: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");
    const { deliveryId } = req.params as { deliveryId: string };
    if (!deliveryId) throw new ApiError(400, "deliveryId is required");
    const updated = await webhookService.retryDelivery(deliveryId);
    sendSuccessResponse(res, updated, "Delivery retry queued");
  }),
};

