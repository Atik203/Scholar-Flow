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
      // Invalidate user data after checkout to ensure fresh subscription info
      invalidatesTags: ["User"],
      // Don't retry checkout session creation on failure
      extraOptions: { maxRetries: 0 },
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
      // Don't invalidate immediately - user will return from portal later
      // Invalidation handled by ManageSubscriptionButton on return
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
      // Keep subscription data fresh
      keepUnusedDataFor: 60, // 1 minute cache
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
      // Optimistically update subscription status
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update based on action
        const patchResult = dispatch(
          billingApi.util.updateQueryData(
            "getSubscription",
            { workspaceId: arg.workspaceId },
            (draft) => {
              if (!draft) return;

              if (arg.action === "cancel") {
                draft.cancelAtPeriodEnd = true;
              } else if (arg.action === "reactivate") {
                draft.cancelAtPeriodEnd = false;
              }
              // seats update will be handled by server response
            }
          )
        );

        try {
          await queryFulfilled;

          // After success, invalidate to get fresh data from server
          dispatch(apiSlice.util.invalidateTags(["User"]));
        } catch {
          // Rollback optimistic update on error
          patchResult.undo();
        }
      },
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
