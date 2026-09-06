import { z } from "zod";

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
   * POST /billing/customer-portal
   * Create a Stripe Customer Portal session
   */
  createPortalSession: z.object({
    returnUrl: z.string().url().optional(),
  }),

  /**
   * POST /billing/manage-plan (team lead/admin only)
   * Programmatic plan management
   */
  managePlan: z.object({
    action: z.enum(["cancel", "reactivate"]),
    workspaceId: z.string().uuid().optional(),
  }),
};

export type CreateCheckoutSessionInput = z.infer<
  typeof billingValidation.createCheckoutSession
>;
export type CreatePortalSessionInput = z.infer<
  typeof billingValidation.createPortalSession
>;
export type ManagePlanInput = z.infer<typeof billingValidation.managePlan>;
