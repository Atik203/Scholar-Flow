import Stripe from "stripe";
import config from "../config";

/**
 * Singleton Stripe client with retry logic and telemetry
 * Following project standards: never log secrets, structured error handling
 */

if (!config.stripe.secret_key) {
  throw new Error(
    "STRIPE_SECRET_KEY is not configured. Check your environment variables."
  );
}

const stripe = new Stripe(config.stripe.secret_key, {
  apiVersion: "2025-09-30.clover", // Use latest stable API version
  typescript: true,
  maxNetworkRetries: 3, // Automatic retry for network failures
  timeout: 20000, // 20 second timeout
  telemetry: process.env.NODE_ENV === "production", // Enable telemetry in production
  appInfo: {
    name: "ScholarFlow",
    version: "1.0.0",
    url: "https://scholarflow.com",
  },
});

/**
 * Export singleton Stripe instance
 * Use this throughout the billing module instead of creating new instances
 */
export default stripe;

/**
 * Helper to safely log Stripe API errors without exposing sensitive data
 */
export const logStripeError = (
  error: Stripe.StripeRawError,
  context?: string
) => {
  const safeError = {
    type: error.type,
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    context,
    requestId: error.requestId,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("Stripe API Error:", safeError);
  } else {
    // In production, log to monitoring service (e.g., Sentry, DataDog)
    console.error("Stripe API Error:", JSON.stringify(safeError));
  }
};

/**
 * Type guard for Stripe errors
 */
export const isStripeError = (
  error: unknown
): error is Stripe.StripeRawError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof (error as any).type === "string"
  );
};

/**
 * Stripe Price IDs from configuration
 * These map to specific subscription plans and billing intervals
 */
export const STRIPE_PRICE_IDS = {
  pro_monthly: config.stripe.prices.pro.monthly || "",
  pro_annual: config.stripe.prices.pro.annual || "",
  team_monthly: config.stripe.prices.team.monthly || "",
  team_annual: config.stripe.prices.team.annual || "",
} as const;

export type StripePriceId = keyof typeof STRIPE_PRICE_IDS;

/**
 * Helper function to determine user role based on Stripe price ID
 * Maps subscription tiers to application roles
 */
export function getRoleFromPriceId(
  priceId: string
): "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" {
  if (
    priceId === STRIPE_PRICE_IDS.pro_monthly ||
    priceId === STRIPE_PRICE_IDS.pro_annual
  ) {
    return "PRO_RESEARCHER";
  } else if (
    priceId === STRIPE_PRICE_IDS.team_monthly ||
    priceId === STRIPE_PRICE_IDS.team_annual
  ) {
    return "TEAM_LEAD";
  }
  return "RESEARCHER";
}

/**
 * Helper function to get human-readable plan name from price ID
 */
export function getPlanNameFromPriceId(priceId: string): string {
  if (
    priceId === STRIPE_PRICE_IDS.pro_monthly ||
    priceId === STRIPE_PRICE_IDS.pro_annual
  ) {
    return "Pro";
  } else if (
    priceId === STRIPE_PRICE_IDS.team_monthly ||
    priceId === STRIPE_PRICE_IDS.team_annual
  ) {
    return "Team";
  }
  return "Free";
}

/**
 * Validates if a given price ID is configured in the system
 */
export function isValidPriceId(priceId: string): boolean {
  return Object.values(STRIPE_PRICE_IDS).includes(priceId);
}
