import express from "express";
import { authMiddleware, requireTeamLead } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import {
  billingCheckoutLimiter,
  billingPortalLimiter,
  billingSubscriptionLimiter,
} from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { captureStripeRawBody } from "../../utils/stripeWebhook";
import { billingController } from "./billing.controller";
import { billingValidation } from "./billing.validation";
import { webhookController } from "./webhook.controller";

const router: express.Router = express.Router();

/**
 * Webhook endpoint - NO auth middleware, signature verification instead
 * Must use raw body parser before JSON parsing
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  captureStripeRawBody,
  webhookController.handleStripeWebhook
);

/**
 * Protected routes - require authentication
 */

// Create Stripe Checkout session
router.post(
  "/checkout-session",
  authMiddleware,
  billingCheckoutLimiter,
  performanceMonitor,
  validateRequestBody(billingValidation.createCheckoutSession),
  billingController.createCheckoutSession
);

// Create Stripe Customer Portal session
router.post(
  "/customer-portal",
  authMiddleware,
  billingPortalLimiter,
  performanceMonitor,
  validateRequestBody(billingValidation.createPortalSession),
  billingController.createPortalSession
);

// Get current subscription
router.get(
  "/subscription",
  authMiddleware,
  billingSubscriptionLimiter,
  performanceMonitor,
  billingController.getSubscription
);

// Manage plan (admin/team lead only)
router.post(
  "/manage-plan",
  authMiddleware,
  requireTeamLead,
  billingPortalLimiter,
  performanceMonitor,
  validateRequestBody(billingValidation.managePlan),
  billingController.managePlan
);

export const billingRoutes = router;
