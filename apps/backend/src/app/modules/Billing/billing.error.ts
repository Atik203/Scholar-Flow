import ApiError from "../../errors/ApiError";

/**
 * Feature-specific error class for billing operations
 * Extends ApiError with billing-specific error codes
 */
export class BillingError extends ApiError {
  public errorCode?: string;
  public details?: Record<string, any>;

  constructor(
    statusCode: number,
    message: string,
    errorCode?: string,
    details?: Record<string, any>
  ) {
    super(statusCode, message);
    this.errorCode = errorCode;
    this.details = details;
  }

  /**
   * Static factory methods for common billing errors
   */

  static invalidPlan(planTier: string) {
    return new BillingError(
      400,
      `Invalid plan tier: ${planTier}`,
      "INVALID_PLAN",
      {
        planTier,
      }
    );
  }

  static invalidInterval(interval: string) {
    return new BillingError(
      400,
      `Invalid billing interval: ${interval}`,
      "INVALID_INTERVAL",
      { interval }
    );
  }

  static stripeCustomerNotFound(userId: string) {
    return new BillingError(
      404,
      "Stripe customer not found for user",
      "CUSTOMER_NOT_FOUND",
      { userId }
    );
  }

  static subscriptionNotFound(userId?: string) {
    return new BillingError(
      404,
      "Active subscription not found",
      "SUBSCRIPTION_NOT_FOUND",
      { userId }
    );
  }

  static checkoutSessionCreationFailed(reason?: string) {
    return new BillingError(
      500,
      `Failed to create checkout session${reason ? `: ${reason}` : ""}`,
      "CHECKOUT_CREATION_FAILED",
      { reason }
    );
  }

  static portalSessionCreationFailed(reason?: string) {
    return new BillingError(
      500,
      `Failed to create portal session${reason ? `: ${reason}` : ""}`,
      "PORTAL_CREATION_FAILED",
      { reason }
    );
  }

  static webhookSignatureVerificationFailed() {
    return new BillingError(
      400,
      "Webhook signature verification failed",
      "WEBHOOK_VERIFICATION_FAILED"
    );
  }

  static webhookProcessingFailed(eventType: string, reason?: string) {
    return new BillingError(
      500,
      `Failed to process webhook event: ${eventType}${reason ? ` - ${reason}` : ""}`,
      "WEBHOOK_PROCESSING_FAILED",
      { eventType, reason }
    );
  }

  static insufficientPermissions(action: string) {
    return new BillingError(
      403,
      `Insufficient permissions to ${action}`,
      "INSUFFICIENT_PERMISSIONS",
      { action }
    );
  }

  static planDowngradeRestricted(reason: string) {
    return new BillingError(
      400,
      `Cannot downgrade plan: ${reason}`,
      "DOWNGRADE_RESTRICTED",
      { reason }
    );
  }

  static seatLimitExceeded(currentSeats: number, maxSeats: number) {
    return new BillingError(
      400,
      `Seat limit exceeded. Current: ${currentSeats}, Max: ${maxSeats}`,
      "SEAT_LIMIT_EXCEEDED",
      { currentSeats, maxSeats }
    );
  }

  static paymentMethodRequired() {
    return new BillingError(
      402,
      "Payment method required to complete subscription",
      "PAYMENT_METHOD_REQUIRED"
    );
  }

  static trialAlreadyUsed(userId: string) {
    return new BillingError(
      400,
      "Trial period already used for this account",
      "TRIAL_ALREADY_USED",
      { userId }
    );
  }
}
