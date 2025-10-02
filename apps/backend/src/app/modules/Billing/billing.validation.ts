import { z } from "zod";
import { BILLING_INTERVALS, PLAN_TIERS } from "./billing.constant";

/**
 * Validation schemas for billing endpoints
 * Using Zod for type-safe request validation
 */

export const billingValidation = {
  /**
   * POST /billing/checkout-session
   * Create a Stripe Checkout session for plan upgrade
   * Simplified to match example project: accepts priceId directly
   */
  createCheckoutSession: z.object({
    priceId: z.string().min(1, "Price ID is required"),
    workspaceId: z.string().uuid().optional(),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
  }),

  /**
   * Legacy support: Accept planTier + interval for backward compatibility
   * @deprecated Use priceId instead
   */
  createCheckoutSessionLegacy: z.object({
    planTier: z.enum([PLAN_TIERS.PRO, PLAN_TIERS.TEAM, PLAN_TIERS.ENTERPRISE]),
    interval: z.enum([BILLING_INTERVALS.MONTHLY, BILLING_INTERVALS.ANNUAL]),
    workspaceId: z.string().uuid().optional(),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
  }),

  /**
   * POST /billing/customer-portal
   * Create a Stripe Customer Portal session
   */
  createPortalSession: z.object({
    returnUrl: z.string().url().optional(),
  }),

  /**
   * GET /billing/subscription
   * Query parameters for fetching subscription
   */
  getSubscription: z.object({
    query: z.object({
      workspaceId: z.string().uuid().optional(),
    }),
  }),

  /**
   * POST /billing/manage-plan (admin/team lead only)
   * Programmatic plan management
   */
  managePlan: z.object({
    action: z.enum(["cancel", "reactivate", "update_seats"]),
    workspaceId: z.string().uuid().optional(),
    seats: z.number().int().positive().optional(),
  }),

  /**
   * POST /billing/webhook
   * Stripe webhook payload (raw body, validated by signature)
   */
  webhookEvent: z.object({
    body: z.any(), // Raw Stripe event object, validated by signature
  }),
};

export type CreateCheckoutSessionInput = z.infer<
  typeof billingValidation.createCheckoutSession
>;
export type CreatePortalSessionInput = z.infer<
  typeof billingValidation.createPortalSession
>;
export type GetSubscriptionInput = z.infer<
  typeof billingValidation.getSubscription
>["query"];
export type ManagePlanInput = z.infer<typeof billingValidation.managePlan>;
