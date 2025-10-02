import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import catchAsync from "../../shared/catchAsync";
import { billingService } from "./billing.service";
import type {
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
  ManagePlanInput,
} from "./billing.validation";

/**
 * POST /billing/checkout-session
 * Create a Stripe Checkout session for plan upgrade
 */
const createCheckoutSession = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const email = req.user!.email;
    const name = req.user!.name;
    const input = req.body as CreateCheckoutSessionInput;

    const session = await billingService.createCheckoutSession(
      userId,
      email,
      name,
      input
    );

    res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: session,
    });
  }
);

/**
 * POST /billing/customer-portal
 * Create a Stripe Customer Portal session
 */
const createPortalSession = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const input = req.body as CreatePortalSessionInput;

    const session = await billingService.createPortalSession(userId, input);

    res.status(200).json({
      success: true,
      message: "Portal session created successfully",
      data: session,
    });
  }
);

/**
 * GET /billing/subscription
 * Get user's current subscription
 */
const getSubscription = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const workspaceId = req.query.workspaceId as string | undefined;

  const subscription = await billingService.getUserSubscription(
    userId,
    workspaceId
  );

  res.status(200).json({
    success: true,
    message: subscription
      ? "Subscription retrieved successfully"
      : "No active subscription found",
    data: subscription,
  });
});

/**
 * POST /billing/manage-plan
 * Manage subscription (cancel, reactivate, update seats)
 * Requires team lead or admin role
 */
const managePlan = catchAsync(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const input = req.body as ManagePlanInput;
    const { action, workspaceId } = input;

    let result;

    switch (action) {
      case "cancel":
        await billingService.cancelSubscription(userId, workspaceId);
        result = { message: "Subscription will be canceled at period end" };
        break;

      case "reactivate":
        await billingService.reactivateSubscription(userId, workspaceId);
        result = { message: "Subscription reactivated successfully" };
        break;

      case "update_seats":
        // TODO: Implement seat update logic
        result = { message: "Seat update not yet implemented" };
        break;

      default:
        res.status(400).json({
          success: false,
          message: "Invalid action",
        });
        return;
    }

    res.status(200).json({
      success: true,
      ...result,
    });
  }
);

export const billingController = {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  managePlan,
};
