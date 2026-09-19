/**
 * Admin Reports RTK Query slice
 */

import { apiSlice } from "./apiSlice";

export type AdminReportType = "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM";
export type AdminReportStatus = "READY" | "GENERATING" | "SCHEDULED" | "FAILED";
export type AdminReportFormat = "CSV" | "JSON";

export interface AdminReport {
  id: string;
  name: string;
  description: string | null;
  type: AdminReportType;
  status: AdminReportStatus;
  format: AdminReportFormat;
  fileSize: string | null;
  generatedAt: string | null;
  schedule: string | null;
  nextRunAt: string | null;
  recipients: string[];
  enabled: boolean;
  config: Record<string, unknown> | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; name: string | null; email: string };
}

export interface AdminReportListResponse {
  success: boolean;
  message: string;
  data: AdminReport[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export interface AdminReportCreate {
  name: string;
  description?: string;
  type: AdminReportType;
  format?: AdminReportFormat;
  schedule?: string;
  recipients?: string[];
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface AdminReportStats {
  total: number;
  ready: number;
  generating: number;
  scheduled: number;
  failed: number;
}

export const adminReportsApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      listReports: builder.query<
        AdminReportListResponse,
        {
          type?: AdminReportType;
          status?: AdminReportStatus;
          enabled?: boolean;
          search?: string;
          page?: number;
          limit?: number;
        }
      >({
        query: (params) => ({ url: "/admin/reports", params }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map((r) => ({
                  type: "AdminReport" as const,
                  id: r.id,
                })),
                { type: "AdminReport", id: "LIST" },
              ]
            : [{ type: "AdminReport", id: "LIST" }],
      }),

      getReportStats: builder.query<
        { success: boolean; data: AdminReportStats },
        { type?: AdminReportType; search?: string }
      >({
        query: (params) => ({ url: "/admin/reports/stats", params }),
        providesTags: [{ type: "AdminReport", id: "STATS" }],
      }),

      getReport: builder.query<
        { success: boolean; data: AdminReport },
        string
      >({
        query: (id) => `/admin/reports/${id}`,
        providesTags: (result, error, id) => [
          { type: "AdminReport", id },
        ],
      }),

      createReport: builder.mutation<
        { success: boolean; data: AdminReport },
        AdminReportCreate
      >({
        query: (body) => ({
          url: "/admin/reports",
          method: "POST",
          body,
        }),
        invalidatesTags: [
          { type: "AdminReport", id: "LIST" },
          { type: "AdminReport", id: "STATS" },
        ],
      }),

      updateReport: builder.mutation<
        { success: boolean; data: AdminReport },
        { id: string; patch: Partial<AdminReportCreate> }
      >({
        query: ({ id, patch }) => ({
          url: `/admin/reports/${id}`,
          method: "PATCH",
          body: patch,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "AdminReport", id: arg.id },
          { type: "AdminReport", id: "LIST" },
          { type: "AdminReport", id: "STATS" },
        ],
      }),

      deleteReport: builder.mutation<
        { success: boolean; data: { id: string } },
        string
      >({
        query: (id) => ({
          url: `/admin/reports/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [
          { type: "AdminReport", id: "LIST" },
          { type: "AdminReport", id: "STATS" },
        ],
      }),

      generateReport: builder.mutation<
        Blob,
        string
      >({
        query: (id) => ({
          url: `/admin/reports/${id}/generate`,
          method: "POST",
          responseHandler: (response) => response.blob(),
          cache: "no-cache",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "AdminReport", id },
          { type: "AdminReport", id: "LIST" },
          { type: "AdminReport", id: "STATS" },
        ],
      }),
    }),
  });

export const {
  useListReportsQuery,
  useGetReportQuery,
  useGetReportStatsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useGenerateReportMutation,
} = adminReportsApi;
