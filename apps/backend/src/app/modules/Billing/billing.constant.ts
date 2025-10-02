/**
 * Billing module constants
 * Centralized plan catalog and pricing configuration
 */

export const PLAN_TIERS = {
  FREE: "free",
  PRO: "pro",
  TEAM: "team",
  ENTERPRISE: "enterprise",
} as const;

export type PlanTier = (typeof PLAN_TIERS)[keyof typeof PLAN_TIERS];

export const BILLING_INTERVALS = {
  MONTHLY: "monthly",
  ANNUAL: "annual",
} as const;

export type BillingInterval =
  (typeof BILLING_INTERVALS)[keyof typeof BILLING_INTERVALS];

/**
 * Plan metadata - features and limits per tier
 * Source of truth for what each plan provides
 */
export const PLAN_FEATURES = {
  [PLAN_TIERS.FREE]: {
    name: "Free",
    maxPapersPerMonth: 10,
    maxCollections: 3,
    maxWorkspaceMembers: 1,
    aiSummaries: true,
    basicSearch: true,
    semanticSearch: false,
    prioritySupport: false,
    apiAccess: false,
    customIntegrations: false,
    sso: false,
    dedicatedSupport: false,
  },
  [PLAN_TIERS.PRO]: {
    name: "Pro",
    maxPapersPerMonth: -1, // unlimited
    maxCollections: -1, // unlimited
    maxWorkspaceMembers: 5,
    aiSummaries: true,
    basicSearch: true,
    semanticSearch: true,
    prioritySupport: true,
    apiAccess: true,
    customIntegrations: false,
    sso: false,
    dedicatedSupport: false,
  },
  [PLAN_TIERS.TEAM]: {
    name: "Team",
    maxPapersPerMonth: -1, // unlimited
    maxCollections: -1, // unlimited
    maxWorkspaceMembers: -1, // unlimited
    aiSummaries: true,
    basicSearch: true,
    semanticSearch: true,
    prioritySupport: true,
    apiAccess: true,
    customIntegrations: true,
    sso: true,
    dedicatedSupport: false,
  },
  [PLAN_TIERS.ENTERPRISE]: {
    name: "Enterprise",
    maxPapersPerMonth: -1, // unlimited
    maxCollections: -1, // unlimited
    maxWorkspaceMembers: -1, // unlimited
    aiSummaries: true,
    basicSearch: true,
    semanticSearch: true,
    prioritySupport: true,
    apiAccess: true,
    customIntegrations: true,
    sso: true,
    dedicatedSupport: true,
  },
} as const;

/**
 * Trial configuration
 */
export const TRIAL_PERIOD_DAYS = 14;

/**
 * Subscription status constants aligned with Prisma enum
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELED: "CANCELED",
  PAST_DUE: "PAST_DUE",
} as const;

/**
 * Payment status constants aligned with Prisma enum
 */
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

/**
 * Webhook event types we handle
 */
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
  CHECKOUT_SESSION_ASYNC_PAYMENT_SUCCEEDED:
    "checkout.session.async_payment_succeeded",
  CHECKOUT_SESSION_ASYNC_PAYMENT_FAILED:
    "checkout.session.async_payment_failed",
  CUSTOMER_SUBSCRIPTION_CREATED: "customer.subscription.created",
  CUSTOMER_SUBSCRIPTION_UPDATED: "customer.subscription.updated",
  CUSTOMER_SUBSCRIPTION_DELETED: "customer.subscription.deleted",
  INVOICE_PAID: "invoice.paid",
  INVOICE_PAYMENT_FAILED: "invoice.payment_failed",
  INVOICE_PAYMENT_ACTION_REQUIRED: "invoice.payment_action_required",
} as const;

/**
 * Rate limiter configuration for billing endpoints
 */
export const BILLING_RATE_LIMITS = {
  CHECKOUT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 checkout attempts per hour
  },
  PORTAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 portal requests per 15 minutes
  },
  SUBSCRIPTION_READ: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 reads per 15 minutes
  },
} as const;
