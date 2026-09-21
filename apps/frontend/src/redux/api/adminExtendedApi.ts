/**
 * Admin Plans / Payments / API Keys / Moderation / Alerts RTK Query slices
 */

import { apiSlice } from "./apiSlice";
import type { RootState } from "@/redux/store";

// ============================================================================
// Plans
// ============================================================================

export interface AdminPlanFeatures {
  list?: string[];
  limits?: Record<string, number>;
}

export interface AdminPlan {
  id: string;
  code: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: string;
  stripePriceId: string | null;
  features: AdminPlanFeatures | null;
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

    createPlan: builder.mutation<
      { success: boolean; data: AdminPlan },
      {
        code: string;
        name: string;
        priceCents: number;
        currency: string;
        interval: "month" | "year";
        active?: boolean;
        features?: AdminPlanFeatures;
      }
    >({
      query: (body) => ({ url: "/admin/plans", method: "POST", body }),
      invalidatesTags: [{ type: "Admin", id: "PLANS" }],
    }),

    updatePlan: builder.mutation<
      { success: boolean; data: AdminPlan },
      {
        id: string;
        patch: Partial<{
          code: string;
          name: string;
          priceCents: number;
          currency: string;
          interval: string;
          active: boolean;
          features: AdminPlanFeatures;
        }>;
      }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/plans/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: [{ type: "Admin", id: "PLANS" }],
    }),

    deletePlan: builder.mutation<
      { success: boolean; data: AdminPlan },
      string
    >({
      query: (id) => ({ url: `/admin/plans/${id}`, method: "DELETE" }),
      // Remove the card instantly; roll back if the server rejects
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          adminPlansApi.util.updateQueryData("listPlans", undefined, (draft) => {
            draft.data = draft.data.filter((plan) => plan.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "Admin", id: "PLANS" }],
    }),

    togglePlan: builder.mutation<
      { success: boolean; data: AdminPlan },
      string
    >({
      query: (id) => ({ url: `/admin/plans/${id}/toggle`, method: "POST" }),
      invalidatesTags: [{ type: "Admin", id: "PLANS" }],
    }),

    syncStripePlan: builder.mutation<
      {
        success: boolean;
        data: { plan: AdminPlan; stripePriceId: string; created: boolean };
      },
      string
    >({
      query: (id) => ({
        url: `/admin/plans/${id}/sync-stripe`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Admin", id: "PLANS" }],
    }),
  }),
});

export const {
  useListPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanMutation,
  useSyncStripePlanMutation,
} = adminPlansApi;

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

export interface AdminPaymentSummary {
  succeededCount: number;
  totalRevenueCents: number;
  currency: string;
}

export const adminPaymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPayments: builder.query<
      {
        success: boolean;
        data: AdminPayment[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
          summary?: AdminPaymentSummary;
        };
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
      // Payment list + revenue analytics both refresh (refunds change both)
      invalidatesTags: [
        { type: "Admin", id: "PAYMENTS" },
        { type: "Admin" },
      ],
    }),
  }),
});

export const { useListPaymentsQuery, useRefundPaymentMutation } = adminPaymentsApi;

// ============================================================================
// Subscribers (admin subscription management)
// ============================================================================

export interface AdminSubscriber {
  subscriptionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: string;
  seats: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  totalSpent: number;
  lastPaymentDate: string | null;
}

export const adminSubscribersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listSubscribers: builder.query<
      {
        success: boolean;
        data: AdminSubscriber[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number; status?: string; planId?: string }
    >({
      query: (params) => ({ url: "/admin/subscribers", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((s) => ({
                type: "Admin" as const,
                id: `SUBSCRIBER-${s.subscriptionId}`,
              })),
              { type: "Admin", id: "SUBSCRIBERS" },
            ]
          : [{ type: "Admin", id: "SUBSCRIBERS" }],
    }),

    cancelSubscriberAtPeriodEnd: builder.mutation<
      { success: boolean },
      string
    >({
      query: (id) => ({
        url: `/admin/subscribers/${id}/cancel-at-period-end`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Admin", id: `SUBSCRIBER-${id}` },
        { type: "Admin", id: "SUBSCRIBERS" },
        { type: "Admin" },
      ],
    }),

    reactivateSubscriber: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/subscribers/${id}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Admin", id: `SUBSCRIBER-${id}` },
        { type: "Admin", id: "SUBSCRIBERS" },
        { type: "Admin" },
      ],
    }),

    cancelSubscriberNow: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/subscribers/${id}/cancel-now`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Admin", id: `SUBSCRIBER-${id}` },
        { type: "Admin", id: "SUBSCRIBERS" },
        { type: "Admin" },
      ],
    }),

    changeSubscriberPlan: builder.mutation<
      { success: boolean },
      { id: string; priceId: string }
    >({
      query: ({ id, priceId }) => ({
        url: `/admin/subscribers/${id}/change-plan`,
        method: "POST",
        body: { priceId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Admin", id: `SUBSCRIBER-${arg.id}` },
        { type: "Admin", id: "SUBSCRIBERS" },
        { type: "Admin" },
      ],
    }),
  }),
});

export const {
  useListSubscribersQuery,
  useCancelSubscriberAtPeriodEndMutation,
  useReactivateSubscriberMutation,
  useCancelSubscriberNowMutation,
  useChangeSubscriberPlanMutation,
} = adminSubscribersApi;

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
        // Remove the row from the cached list instantly; roll back on error
        async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
          const entries = adminApiKeysApi.util.selectInvalidatedBy(
            getState() as RootState,
            [{ type: "AdminApiKey", id: "LIST" }]
          );
          const patches = entries.map(({ originalArgs }) =>
            dispatch(
              adminApiKeysApi.util.updateQueryData(
                "listApiKeys",
                originalArgs,
                (draft) => {
                  draft.data = draft.data.filter((key) => key.id !== id);
                }
              )
            )
          );
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
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
      listContentReports: builder.query<
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

      getContentReport: builder.query<
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
  useListContentReportsQuery,
  useGetContentReportQuery,
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

// ============================================================================
// System actions (diagnostics / cache / logs)
// ============================================================================

export interface DiagnosticCheck {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  detail: string;
}

export interface SystemDiagnostics {
  status: "healthy" | "degraded" | "unhealthy";
  checks: DiagnosticCheck[];
  memory: {
    rssMB: number;
    heapUsedMB: number;
    heapTotalMB: number;
    systemUsagePercentage: number;
  };
  database: {
    responseTime: number;
    activeConnections: number;
    maxConnections: number;
    connectionPoolUsage: number;
  };
  cache: {
    configured: boolean;
    redisEnabled: boolean;
    hitRate: number | null;
    memoryCacheSize: number;
  };
  system: {
    platform: string;
    nodeVersion: string;
    uptimeSeconds: number;
    loadAverage: number[];
  };
  generatedAt: string;
}

export interface CacheClearResult {
  redisFlushed: boolean;
  memoryEntriesCleared: number;
  clearedAt: string;
}

export interface SystemLogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

export const adminSystemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    runSystemDiagnostics: builder.mutation<
      { success: boolean; data: SystemDiagnostics },
      void
    >({
      query: () => ({
        url: "/admin/system/diagnostics",
        method: "POST",
      }),
    }),

    clearSystemCache: builder.mutation<
      { success: boolean; data: CacheClearResult },
      void
    >({
      query: () => ({
        url: "/admin/system/clear-cache",
        method: "POST",
      }),
    }),

    listSystemLogs: builder.query<
      {
        success: boolean;
        data: { entries: SystemLogEntry[]; total: number; returned: number };
      },
      { level?: string; limit?: number } | void
    >({
      query: (params) => ({ url: "/admin/system/logs", params: params ?? {} }),
      providesTags: [{ type: "Admin", id: "SYSTEM-LOGS" }],
    }),

    exportSystemLogs: builder.mutation<Blob, { level?: string } | void>({
      query: (params) => ({
        url: "/admin/system/logs/export",
        params: params ?? {},
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    exportUsers: builder.mutation<
      Blob,
      { search?: string; role?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/users/export",
        params: params ?? {},
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
  useRunSystemDiagnosticsMutation,
  useClearSystemCacheMutation,
  useListSystemLogsQuery,
  useExportSystemLogsMutation,
  useExportUsersMutation,
} = adminSystemApi;

// ============================================================================
// System settings
// ============================================================================

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  sessionTimeoutMinutes: number;
  emailNotificationsEnabled: boolean;
  registrationAlertsEnabled: boolean;
  storageQuotaGb: number;
  twoFactorRequired: boolean;
}

export interface SystemSettingsResponse {
  settings: SystemSettings;
  updatedAt: string | null;
  updatedBy: { id: string; name: string | null; email: string } | null;
}

export const adminSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSettings: builder.query<
      { success: boolean; data: SystemSettingsResponse },
      void
    >({
      query: () => "/admin/settings",
      providesTags: [{ type: "Admin", id: "SETTINGS" }],
    }),

    updateSystemSettings: builder.mutation<
      { success: boolean; data: SystemSettingsResponse },
      Partial<SystemSettings>
    >({
      query: (body) => ({
        url: "/admin/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Admin", id: "SETTINGS" }],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = adminSettingsApi;
