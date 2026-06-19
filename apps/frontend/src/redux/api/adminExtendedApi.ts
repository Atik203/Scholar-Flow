/**
 * Admin Plans / Payments / API Keys / Moderation / Alerts RTK Query slices
 */

import { apiSlice } from "./apiSlice";

// ============================================================================
// Plans
// ============================================================================

export interface AdminPlan {
  id: string;
  code: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: string;
  stripePriceId: string | null;
  features: unknown;
  active: boolean;
  activeSubscribers: number;
  canceledSubscribers: number;
  totalSubscribers: number;
  monthlyRevenueCents: number;
}

export const adminPlansApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPlans: builder.query<
      { success: boolean; data: AdminPlan[] },
      void
    >({
      query: () => "/admin/plans",
      providesTags: [{ type: "Admin", id: "PLANS" }],
    }),
  }),
});

export const { useListPlansQuery } = adminPlansApi;

// ============================================================================
// Payments
// ============================================================================

export interface AdminPayment {
  id: string;
  userId: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  provider: string;
  transactionId: string;
  user: { id: string; name: string | null; email: string };
  subscription?: {
    id: string;
    plan: { name: string; code: string };
  };
}

export const adminPaymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPayments: builder.query<
      {
        success: boolean;
        data: AdminPayment[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number; status?: string; provider?: string; search?: string }
    >({
      query: (params) => ({ url: "/admin/payments", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({ type: "Admin" as const, id: `PAYMENT-${p.id}` })),
              { type: "Admin", id: "PAYMENTS" },
            ]
          : [{ type: "Admin", id: "PAYMENTS" }],
    }),

    refundPayment: builder.mutation<
      { success: boolean; data: AdminPayment },
      string
    >({
      query: (id) => ({
        url: `/admin/payments/${id}/refund`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Admin", id: "PAYMENTS" }],
    }),
  }),
});

export const { useListPaymentsQuery, useRefundPaymentMutation } = adminPaymentsApi;

// ============================================================================
// API Keys
// ============================================================================

export type ApiKeyStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface AdminApiKey {
  id: string;
  name: string;
  description: string | null;
  scopes: string[];
  status: ApiKeyStatus;
  rateLimit: number;
  createdById: string;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  totalRequests: number;
  keyPrefix: string;
  createdBy?: { id: string; name: string | null; email: string };
}

export const adminApiKeysApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      listApiKeys: builder.query<
        { success: boolean; data: AdminApiKey[] },
        void
      >({
        query: () => "/admin/api-keys",
        providesTags: [{ type: "AdminApiKey", id: "LIST" }],
      }),

      getApiKey: builder.query<
        { success: boolean; data: AdminApiKey },
        string
      >({
        query: (id) => `/admin/api-keys/${id}`,
        providesTags: (result, error, id) => [
          { type: "AdminApiKey", id },
        ],
      }),

      createApiKey: builder.mutation<
        { success: boolean; data: AdminApiKey & { _secret: string } },
        {
          name: string;
          description?: string;
          scopes?: string[];
          rateLimit?: number;
          expiresAt?: string;
        }
      >({
        query: (body) => ({
          url: "/admin/api-keys",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "AdminApiKey", id: "LIST" }],
      }),

      updateApiKey: builder.mutation<
        { success: boolean; data: AdminApiKey },
        {
          id: string;
          patch: {
            name?: string;
            description?: string;
            scopes?: string[];
            rateLimit?: number;
            status?: ApiKeyStatus;
          };
        }
      >({
        query: ({ id, patch }) => ({
          url: `/admin/api-keys/${id}`,
          method: "PATCH",
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "AdminApiKey", id: arg.id },
          { type: "AdminApiKey", id: "LIST" },
        ],
      }),

      revokeApiKey: builder.mutation<
        { success: boolean; data: AdminApiKey },
        string
      >({
        query: (id) => ({
          url: `/admin/api-keys/${id}/revoke`,
          method: "POST",
        }),
        invalidatesTags: [{ type: "AdminApiKey", id: "LIST" }],
      }),

      deleteApiKey: builder.mutation<
        { success: boolean; data: { id: string } },
        string
      >({
        query: (id) => ({
          url: `/admin/api-keys/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "AdminApiKey", id: "LIST" }],
      }),
    }),
  });

export const {
  useListApiKeysQuery,
  useGetApiKeyQuery,
  useCreateApiKeyMutation,
  useUpdateApiKeyMutation,
  useRevokeApiKeyMutation,
  useDeleteApiKeyMutation,
} = adminApiKeysApi;

// ============================================================================
// Moderation
// ============================================================================

export type ContentReportType = "PAPER" | "COMMENT" | "COLLECTION" | "PROFILE";
export type ContentReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "COPYRIGHT"
  | "INAPPROPRIATE"
  | "MISINFORMATION"
  | "OTHER";
export type ContentReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

export interface ContentReport {
  id: string;
  contentType: ContentReportType;
  contentId: string;
  contentTitle: string | null;
  contentPreview: string | null;
  reporterId: string;
  reason: ContentReportReason;
  description: string | null;
  status: ContentReportStatus;
  assignedToId: string | null;
  resolvedAt: string | null;
  resolvedById: string | null;
  action: string | null;
  createdAt: string;
  updatedAt: string;
  reporter?: { id: string; name: string | null; email: string };
  assignedTo?: { id: string; name: string | null; email: string } | null;
  resolvedBy?: { id: string; name: string | null; email: string } | null;
}

export const adminModerationApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      listReports: builder.query<
        {
          success: boolean;
          data: ContentReport[];
          meta: { page: number; limit: number; total: number; totalPage: number };
        },
        {
          status?: ContentReportStatus;
          contentType?: ContentReportType;
          assignedToId?: string;
          page?: number;
          limit?: number;
        }
      >({
        query: (params) => ({ url: "/admin/moderation/reports", params }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map((r) => ({
                  type: "AdminModeration" as const,
                  id: r.id,
                })),
                { type: "AdminModeration", id: "LIST" },
              ]
            : [{ type: "AdminModeration", id: "LIST" }],
      }),

      getReport: builder.query<
        { success: boolean; data: ContentReport },
        string
      >({
        query: (id) => `/admin/moderation/reports/${id}`,
        providesTags: (result, error, id) => [
          { type: "AdminModeration", id },
        ],
      }),

      assignReport: builder.mutation<
        { success: boolean; data: ContentReport },
        { id: string; assignedToId: string }
      >({
        query: ({ id, assignedToId }) => ({
          url: `/admin/moderation/reports/${id}/assign`,
          method: "POST",
          body: { assignedToId },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "AdminModeration", id: arg.id },
          { type: "AdminModeration", id: "LIST" },
        ],
      }),

      resolveReport: builder.mutation<
        { success: boolean; data: ContentReport },
        { id: string; action: "approved" | "removed" | "warning" | "suspended" }
      >({
        query: ({ id, action }) => ({
          url: `/admin/moderation/reports/${id}/resolve`,
          method: "POST",
          body: { action },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "AdminModeration", id: arg.id },
          { type: "AdminModeration", id: "LIST" },
        ],
      }),

      dismissReport: builder.mutation<
        { success: boolean; data: ContentReport },
        string
      >({
        query: (id) => ({
          url: `/admin/moderation/reports/${id}/dismiss`,
          method: "POST",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "AdminModeration", id },
          { type: "AdminModeration", id: "LIST" },
        ],
      }),

      fileReport: builder.mutation<
        { success: boolean; data: ContentReport },
        {
          contentType: ContentReportType;
          contentId: string;
          contentTitle?: string;
          contentPreview?: string;
          reason: ContentReportReason;
          description?: string;
        }
      >({
        query: (body) => ({
          url: "/admin/moderation/reports",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "AdminModeration", id: "LIST" }],
      }),
    }),
  });

export const {
  useListReportsQuery,
  useGetReportQuery,
  useAssignReportMutation,
  useResolveReportMutation,
  useDismissReportMutation,
  useFileReportMutation,
} = adminModerationApi;

// ============================================================================
// System Alerts
// ============================================================================

export type SystemAlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type SystemAlertCategory =
  | "USER"
  | "BILLING"
  | "SECURITY"
  | "STORAGE"
  | "PROCESSING"
  | "SYSTEM";

export interface SystemAlert {
  id: string;
  category: SystemAlertCategory;
  severity: SystemAlertSeverity;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedById: string | null;
  createdAt: string;
  resolvedBy?: { id: string; name: string | null; email: string } | null;
}

export const systemAlertsApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      listAlerts: builder.query<
        {
          success: boolean;
          data: SystemAlert[];
          meta: { page: number; limit: number; total: number; totalPage: number };
          summary: { unresolved: number; critical: number };
        },
        {
          category?: SystemAlertCategory;
          severity?: SystemAlertSeverity;
          resolved?: boolean;
          page?: number;
          limit?: number;
        }
      >({
        query: (params) => ({ url: "/admin/alerts", params }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map((a) => ({
                  type: "SystemAlert" as const,
                  id: a.id,
                })),
                { type: "SystemAlert", id: "LIST" },
              ]
            : [{ type: "SystemAlert", id: "LIST" }],
      }),

      getAlertCounts: builder.query<
        {
          success: boolean;
          data: { unresolved: number; critical: number; info: number; warning: number };
        },
        void
      >({
        query: () => "/admin/alerts/counts",
        providesTags: [{ type: "SystemAlert", id: "COUNTS" }],
      }),

      resolveAlert: builder.mutation<
        { success: boolean; data: SystemAlert },
        string
      >({
        query: (id) => ({
          url: `/admin/alerts/${id}/resolve`,
          method: "POST",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "SystemAlert", id },
          { type: "SystemAlert", id: "LIST" },
          { type: "SystemAlert", id: "COUNTS" },
        ],
      }),

      createAlert: builder.mutation<
        { success: boolean; data: SystemAlert },
        {
          category: SystemAlertCategory;
          severity: SystemAlertSeverity;
          title: string;
          message: string;
          metadata?: Record<string, unknown>;
        }
      >({
        query: (body) => ({
          url: "/admin/alerts",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "SystemAlert", id: "LIST" }],
      }),
    }),
  });

export const {
  useListAlertsQuery,
  useGetAlertCountsQuery,
  useResolveAlertMutation,
  useCreateAlertMutation,
} = systemAlertsApi;
