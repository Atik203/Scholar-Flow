import express from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import webhookController from "./webhook.controller";

const router: import("express").Router = express.Router();

router.use(authMiddleware as any, requireAdmin as any, rateLimiter as any);

router.get("/event-types", webhookController.listEventTypes as any);
router.get("/endpoints", webhookController.listEndpoints as any);
router.post("/endpoints", webhookController.createEndpoint as any);
router.get("/endpoints/:id", webhookController.getEndpoint as any);
router.patch("/endpoints/:id", webhookController.updateEndpoint as any);
router.post("/endpoints/:id/rotate-secret", webhookController.rotateSecret as any);
router.delete("/endpoints/:id", webhookController.deleteEndpoint as any);
router.post("/endpoints/:id/test", webhookController.testEndpoint as any);
router.get("/endpoints/:id/deliveries", webhookController.listDeliveries as any);
router.post(
  "/deliveries/:deliveryId/retry",
  webhookController.retryDelivery as any
);

export const webhookRoutes = router;
