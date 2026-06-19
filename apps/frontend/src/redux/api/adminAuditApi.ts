/**
 * Admin Audit Log RTK Query slice
 */

import { apiSlice } from "./apiSlice";

export type AuditSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface AuditEntry {
  id: string;
  userId: string | null;
  workspaceId: string | null;
  entity: string;
  entityId: string;
  action: string;
  details: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  severity: AuditSeverity;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  } | null;
  workspace?: { id: string; name: string } | null;
}

export interface AuditSummary {
  total: number;
  bySeverity: Array<{ severity: string; count: number }>;
  byEntity: Array<{ entity: string; count: number }>;
  topActors: Array<{
    userId: string;
    name: string | null;
    email: string;
    count: number;
  }>;
}

export const adminAuditApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      listAuditEntries: builder.query<
        {
          success: boolean;
          data: AuditEntry[];
          meta: { page: number; limit: number; total: number; totalPage: number };
        },
        {
          userId?: string;
          workspaceId?: string;
          entity?: string;
          entityId?: string;
          action?: string;
          severity?: AuditSeverity;
          startDate?: string;
          endDate?: string;
          search?: string;
          page?: number;
          limit?: number;
        }
      >({
        query: (params) => ({ url: "/admin/audit-log", params }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map((e) => ({
                  type: "AdminAudit" as const,
                  id: e.id,
                })),
                { type: "AdminAudit", id: "LIST" },
              ]
            : [{ type: "AdminAudit", id: "LIST" }],
      }),

      getAuditSummary: builder.query<
        { success: boolean; data: AuditSummary },
        { startDate?: string; endDate?: string }
      >({
        query: (params) => ({ url: "/admin/audit-log/summary", params }),
        providesTags: [{ type: "AdminAudit", id: "SUMMARY" }],
      }),

      exportAuditLog: builder.query<
        { content: string; filename: string },
        {
          startDate?: string;
          endDate?: string;
          format?: "csv" | "json";
        }
      >({
        query: (params) => ({ url: "/admin/audit-log/export", params }),
      }),
    }),
  });

export const {
  useListAuditEntriesQuery,
  useGetAuditSummaryQuery,
  useLazyExportAuditLogQuery,
} = adminAuditApi;
