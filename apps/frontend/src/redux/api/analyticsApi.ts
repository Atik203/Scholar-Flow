/**
 * Analytics RTK Query slice
 * Phase 7 - personal, workspace, usage analytics endpoints
 */

import { apiSlice } from "./apiSlice";

export type AnalyticsTimeRange = "week" | "month" | "quarter" | "year";

export interface PersonalAnalyticsStats {
  papersRead: number;
  annotations: number;
  discussions: number;
  readingMinutes: number;
}

export interface PersonalAnalyticsSummary {
  timeRange: AnalyticsTimeRange;
  stats: PersonalAnalyticsStats;
  streak: { days: number; lastSevenDays: boolean[] };
  productivityHours: Array<{ hour: string; value: number }>;
  weeklyActivity: Array<{
    day: string;
    papers: number;
    annotations: number;
    discussions: number;
  }>;
  topPapers: Array<{ id: string; title: string; views: number; citations: number }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    isUnlocked: boolean;
    progress?: number;
  }>;
}

export interface WorkspaceAnalyticsSummary {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    paperCount: number;
    collectionCount: number;
    createdAt: string;
  };
  timeRange: AnalyticsTimeRange;
  stats: {
    totalPapers: number;
    totalCollections: number;
    totalMembers: number;
    totalViews: number;
    totalAnnotations: number;
    activeMembers: number;
  };
  topMembers: Array<{
    userId: string;
    name: string | null;
    email: string;
    image?: string | null;
    role: string;
    joinedAt: string;
    activityScore: number;
  }>;
  topPapers: Array<{
    id: string;
    title: string;
    uploaderId: string;
    createdAt: string;
  }>;
}

export interface UsageOverviewMetrics {
  totalApiCalls: number;
  apiCallsChange: number;
  storageUsed: number;
  storageLimit: number;
  storageChange: number;
  papersProcessed: number;
  papersChange: number;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  aiCreditsChange: number;
}

export interface UsageReport {
  timeRange: AnalyticsTimeRange;
  overview: UsageOverviewMetrics;
  dailyUsage: Array<{ date: string; apiCalls: number; papers: number; aiCredits: number }>;
  featureUsage: Array<{
    feature: string;
    count: number;
    percentage: number;
    trend: number;
  }>;
}

export const analyticsApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      getPersonalAnalytics: builder.query<
        { success: boolean; message: string; data: PersonalAnalyticsSummary },
        { timeRange?: AnalyticsTimeRange }
      >({
        query: ({ timeRange = "month" } = {}) => ({
          url: `/analytics/personal?timeRange=${timeRange}`,
        }),
        providesTags: ["Analytics"],
      }),

      startReadingSession: builder.mutation<
        { success: boolean; data: { id: string; kind: string } },
        { paperId?: string }
      >({
        query: (body) => ({
          url: "/analytics/personal/reading-session",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Analytics"],
      }),

      stopReadingSession: builder.mutation<
        { success: boolean; data: { id: string; units: number } },
        { eventId: string; units: number }
      >({
        query: ({ eventId, units }) => ({
          url: `/analytics/personal/reading-session/${eventId}`,
          method: "PATCH",
          body: { units },
        }),
        invalidatesTags: ["Analytics"],
      }),

      getWorkspaceAnalytics: builder.query<
        { success: boolean; message: string; data: WorkspaceAnalyticsSummary },
        { workspaceId: string; timeRange?: AnalyticsTimeRange }
      >({
        query: ({ workspaceId, timeRange = "month" }) => ({
          url: `/analytics/workspace/${workspaceId}?timeRange=${timeRange}`,
        }),
        providesTags: (result, error, arg) => [
          { type: "Analytics", id: `WORKSPACE-${arg.workspaceId}` },
        ],
      }),

      getUsageReport: builder.query<
        { success: boolean; message: string; data: UsageReport },
        { timeRange?: AnalyticsTimeRange }
      >({
        query: ({ timeRange = "month" } = {}) => ({
          url: `/analytics/usage?timeRange=${timeRange}`,
        }),
        providesTags: ["Analytics"],
      }),
    }),
  });

export const {
  useGetPersonalAnalyticsQuery,
  useStartReadingSessionMutation,
  useStopReadingSessionMutation,
  useGetWorkspaceAnalyticsQuery,
  useGetUsageReportQuery,
} = analyticsApi;
