import { apiSlice } from "./apiSlice";

/**
 * Billing API endpoints
 * Handles Stripe checkout, subscriptions, and portal access
 */

export interface CheckoutSessionRequest {
  priceId: string;
  workspaceId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Response from backend: {success, message, data: {sessionId, url}}
 * Note: RTK Query's .unwrap() returns the full response object from server,
 * including the wrapper. Access checkout URL via: response.data.url
 *
 * Backend response example:
 * {
 *   "success": true,
 *   "message": "Checkout session created successfully",
 *   "data": {
 *     "sessionId": "cs_test_...",
 *     "url": "https://checkout.stripe.com/c/pay/cs_test_..."
 *   }
 * }
 */
export interface CheckoutSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
  };
}

export interface PortalSessionRequest {
  returnUrl?: string;
}

/**
 * Response from backend: {success, message, data: {url}}
 * Note: RTK Query's .unwrap() returns the full response object from server,
 * including the wrapper. Access portal URL via: response.data.url
 *
 * Backend response example:
 * {
 *   "success": true,
 *   "message": "Portal session created successfully",
 *   "data": { "url": "https://billing.stripe.com/..." }
 * }
 */
export interface PortalSessionResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export interface Subscription {
  id: string;
  status: string;
  planId: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  seats: number;
  providerSubscriptionId: string | null;
  plan: {
    code: string;
    name: string;
    features: Record<string, any>;
  } | null;
  features: Record<string, any>;
}

export interface ManagePlanRequest {
  action: "cancel" | "reactivate" | "update_seats";
  workspaceId?: string;
  seats?: number;
}

export const billingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create Stripe Checkout session
     */
    createCheckoutSession: builder.mutation<
      CheckoutSessionResponse,
      CheckoutSessionRequest
    >({
      query: (body) => ({
        url: "/billing/checkout-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"], // Invalidate user data after checkout
    }),

    /**
     * Create Stripe Customer Portal session
     */
    createPortalSession: builder.mutation<
      PortalSessionResponse,
      PortalSessionRequest
    >({
      query: (body) => ({
        url: "/billing/customer-portal",
        method: "POST",
        body,
      }),
    }),

    /**
     * Get current subscription
     */
    getSubscription: builder.query<
      Subscription | null,
      { workspaceId?: string }
    >({
      query: ({ workspaceId }) => ({
        url: "/billing/subscription",
        params: workspaceId ? { workspaceId } : undefined,
      }),
      transformResponse: (response: {
        success: boolean;
        data: Subscription | null;
      }) => response.data,
      providesTags: ["User"], // Cache invalidated when user data changes
    }),

    /**
     * Manage subscription plan
     */
    managePlan: builder.mutation<{ message: string }, ManagePlanRequest>({
      query: (body) => ({
        url: "/billing/manage-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"], // Invalidate subscription data
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useGetSubscriptionQuery,
  useLazyGetSubscriptionQuery,
  useManagePlanMutation,
} = billingApi;
