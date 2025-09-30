/**
 * Admin API Slice
 * RTK Query endpoints for admin dashboard operations
 */

import { apiSlice } from "./apiSlice";

// Types for admin API responses
export interface SystemStats {
  totalUsers: number;
  totalPapers: number;
  activeSessions: number;
  storageUsed: string;
  userGrowth: {
    count: number;
    percentageChange: number;
  };
  paperGrowth: {
    count: number;
    percentageChange: number;
  };
  sessionGrowth: {
    count: number;
    percentageChange: number;
  };
  storageGrowth: {
    amount: string;
    percentageChange: number;
  };
}

export interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  lastLogin: Date | null;
  paperCount: number;
  workspaceCount: number;
}

export interface UserGrowthData {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
}

export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

export interface PaperStats {
  totalPapers: number;
  processingPapers: number;
  completedPapers: number;
  failedPapers: number;
  averageProcessingTime: number;
}

export interface SystemHealth {
  database: {
    status: "healthy" | "degraded" | "unhealthy";
    responseTime: number;
    activeConnections: number;
  };
  storage: {
    total: string;
    used: string;
    available: string;
    percentageUsed: number;
  };
  cache: {
    status: "healthy" | "degraded" | "unhealthy";
    hitRate: number;
  };
  uptime: number;
  lastChecked: Date;
}

export interface RecentUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: "active" | "inactive" | "all";
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get system statistics
    getSystemStats: builder.query<SystemStats, void>({
      query: () => "/admin/stats",
      providesTags: ["Admin"],
      // Enable polling every 30 seconds for real-time updates
      keepUnusedDataFor: 30,
      transformResponse: (response: { data: SystemStats }) => response.data,
    }),

    // Get recent users
    getRecentUsers: builder.query<
      {
        data: RecentUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
        };
      },
      RecentUsersParams
    >({
      query: (params) => ({
        url: "/admin/users/recent",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Admin" as const, id })),
              { type: "Admin", id: "LIST" },
            ]
          : [{ type: "Admin", id: "LIST" }],
      keepUnusedDataFor: 60,
      transformResponse: (response: {
        data: RecentUser[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
        };
      }) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    // Get user growth data
    getUserGrowthData: builder.query<UserGrowthData[], void>({
      query: () => "/admin/growth",
      providesTags: ["Admin"],
      keepUnusedDataFor: 300, // 5 minutes cache
      transformResponse: (response: { data: UserGrowthData[] }) =>
        response.data,
    }),

    // Get role distribution
    getRoleDistribution: builder.query<RoleDistribution[], void>({
      query: () => "/admin/roles/distribution",
      providesTags: ["Admin"],
      keepUnusedDataFor: 60,
      transformResponse: (response: { data: RoleDistribution[] }) =>
        response.data,
    }),

    // Get paper stats
    getPaperStats: builder.query<PaperStats, void>({
      query: () => "/admin/papers/stats",
      providesTags: ["Admin"],
      keepUnusedDataFor: 30,
      transformResponse: (response: { data: PaperStats }) => response.data,
    }),

    // Get system health
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => "/admin/health",
      providesTags: ["Admin"],
      keepUnusedDataFor: 60,
      transformResponse: (response: { data: SystemHealth }) => response.data,
    }),
  }),
});

export const {
  useGetSystemStatsQuery,
  useGetRecentUsersQuery,
  useGetUserGrowthDataQuery,
  useGetRoleDistributionQuery,
  useGetPaperStatsQuery,
  useGetSystemHealthQuery,
} = adminApi;
