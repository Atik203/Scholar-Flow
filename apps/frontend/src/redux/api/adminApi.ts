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

export interface RevenueAnalytics {
  mrr: {
    amount: number;
    currency: string;
  };
  arr: {
    amount: number;
    currency: string;
  };
  totalRevenue: {
    amount: number;
    currency: string;
    period: string;
  };
  subscriptions: {
    byStatus: Array<{ status: string; count: number }>;
    byPlan: Array<{ plan: string; count: number }>;
    new: number;
    canceled: number;
  };
  payments: {
    failed: number;
  };
  metrics: {
    arpu: number;
    activeUsers: number;
    churnRate: number;
  };
  revenueTrend: Array<{
    date: string;
    revenue: number;
    transactionCount: number;
  }>;
  timeRange: string;
}

export interface TopCustomer {
  userId: string;
  name: string;
  email: string;
  totalSpent: number;
  subscriptionStatus: string;
  currentPlan: string;
}

export interface SubscriberDetail {
  subscriptionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: string;
  seats: number;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  totalSpent: number;
  lastPaymentDate: Date | null;
}

export interface SubscriberDetailsParams {
  page?: number;
  limit?: number;
  status?: string;
  planId?: string;
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

export interface SystemMetrics {
  health: {
    database: "healthy" | "degraded" | "unhealthy";
    server: "healthy" | "degraded" | "unhealthy";
    storage: "healthy" | "warning" | "critical";
    cpu: "healthy" | "warning" | "critical";
  };
  performance: {
    cpu: {
      usage: number;
      cores: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      used: number;
      free: number;
      usagePercentage: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      usagePercentage: number;
      ioPercentage: number;
    };
    network: {
      bytesReceived: number;
      bytesSent: number;
      activeConnections: number;
      bandwidth: number;
    };
  };
  systemInfo: {
    platform: string;
    nodeVersion: string;
    databaseVersion: string;
    totalMemory: string;
    storageCapacity: string;
    uptime: number;
    lastChecked: Date;
  };
  database: {
    status: "healthy" | "degraded" | "unhealthy";
    responseTime: number;
    activeConnections: number;
    maxConnections: number;
    connectionPoolUsage: number;
  };
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

    // Get system metrics
    getSystemMetrics: builder.query<SystemMetrics, void>({
      query: () => "/admin/system/metrics",
      providesTags: ["Admin"],
      keepUnusedDataFor: 10, // 10 seconds cache for real-time monitoring
      transformResponse: (response: { data: SystemMetrics }) => response.data,
    }),

    // Get revenue analytics
    getRevenueAnalytics: builder.query<
      RevenueAnalytics,
      { timeRange?: "7d" | "30d" | "90d" | "1y" }
    >({
      query: ({ timeRange = "30d" }) =>
        `/admin/analytics/revenue?timeRange=${timeRange}`,
      providesTags: ["Admin"],
      keepUnusedDataFor: 300, // 5 minutes cache
      transformResponse: (response: { data: RevenueAnalytics }) =>
        response.data,
    }),

    // Get top customers
    getTopCustomers: builder.query<TopCustomer[], { limit?: number }>({
      query: ({ limit = 10 }) =>
        `/admin/analytics/top-customers?limit=${limit}`,
      providesTags: ["Admin"],
      keepUnusedDataFor: 60,
      transformResponse: (response: { data: TopCustomer[] }) => response.data,
    }),

    // Get subscriber details with pagination
    getSubscriberDetails: builder.query<
      {
        data: SubscriberDetail[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
        };
      },
      SubscriberDetailsParams
    >({
      query: (params) => ({
        url: "/admin/analytics/subscribers",
        params,
      }),
      providesTags: ["Admin"],
      keepUnusedDataFor: 60,
      transformResponse: (response: {
        data: SubscriberDetail[];
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
  }),
});

export const {
  useGetSystemStatsQuery,
  useGetRecentUsersQuery,
  useGetUserGrowthDataQuery,
  useGetRoleDistributionQuery,
  useGetPaperStatsQuery,
  useGetSystemHealthQuery,
  useGetSystemMetricsQuery,
  useGetRevenueAnalyticsQuery,
  useGetTopCustomersQuery,
  useGetSubscriberDetailsQuery,
} = adminApi;
