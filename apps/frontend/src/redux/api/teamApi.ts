import { apiSlice } from "./apiSlice";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  joinedAt: string;
  createdAt: string;
  lastActive?: string;
  status: "active" | "pending" | "inactive" | "invited";
  institution?: string | null;
  fieldOfStudy?: string | null;
  workspaces?: { id: string; name: string; role: string }[];
  workspaceCount?: number;
  _count?: { papers: number; collections: number; memberships?: number };
}

export interface TeamInvitation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceColor?: string;
  inviterName?: string;
  inviterEmail?: string;
  inviterImage?: string | null;
  inviteeName?: string;
  inviteeEmail?: string;
  inviteeImage?: string | null;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  invitedAt: string;
  expiresAt?: string;
  message?: string;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  pendingInvitations: number;
  totalPapers: number;
  totalCollections: number;
  activityScore: number;
  recentActivityCount: number;
}

export interface TeamActivityItem {
  id: string;
  userId?: string | null;
  workspaceId?: string | null;
  entity: string;
  entityId: string;
  action: string;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  createdAt: string;
  user?: {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  workspace?: { id: string; name: string } | null;
}

export interface TeamActivitySummary {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesBySeverity: Record<string, number>;
  recentActivities: TeamActivityItem[];
  trends: Record<string, number>;
}

export interface TeamSettings {
  general?: {
    name?: string;
    description?: string;
    visibility?: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
    defaultRole?: string;
    timezone?: string;
    language?: string;
  };
  permissions?: Record<string, boolean>;
  notifications?: Record<string, boolean>;
  security?: {
    enforce2FA?: boolean;
    sessionTimeout?: number;
    allowedDomains?: string[];
    passwordPolicy?: "basic" | "strong" | "enterprise";
  };
  integrations?: {
    slackWebhook?: string;
    discordWebhook?: string;
    customWebhook?: string;
  };
}

export const teamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // -------------------------------------------------------------------------
    // Members
    // -------------------------------------------------------------------------
    getTeamMembers: builder.query<
      { data: TeamMember[]; meta: any },
      { cursor?: string; limit?: number; search?: string; role?: string; status?: string }
    >({
      query: ({ cursor, limit = 20, search, role, status } = {}) => ({
        url: "/team/members",
        params: {
          ...(cursor && { cursor }),
          limit,
          ...(search && { search }),
          ...(role && { role }),
          ...(status && { status }),
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((m) => ({ type: "Team" as const, id: m.id })),
              { type: "Team" as const, id: "LIST" },
            ]
          : [{ type: "Team" as const, id: "LIST" }],
    }),

    getTeamMember: builder.query<TeamMember, string>({
      query: (id) => `/team/members/${id}`,
      transformResponse: (r: { data: TeamMember }) => r.data,
      providesTags: (_r, _e, id) => [{ type: "Team", id }],
    }),

    updateTeamMember: builder.mutation<
      { success: boolean },
      { userId: string; role?: string }
    >({
      query: ({ userId, ...body }) => ({
        url: `/team/members/${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { userId }) => [
        { type: "Team", id: userId },
        { type: "Team", id: "LIST" },
      ],
    }),

    removeTeamMember: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/team/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, userId) => [
        { type: "Team", id: userId },
        { type: "Team", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------------------
    // Stats
    // -------------------------------------------------------------------------
    getTeamStats: builder.query<TeamStats, void>({
      query: () => "/team/stats",
      transformResponse: (r: { data: TeamStats }) => r.data,
      providesTags: [{ type: "Team", id: "STATS" }],
    }),

    // -------------------------------------------------------------------------
    // Activity
    // -------------------------------------------------------------------------
    getTeamActivity: builder.query<
      { result: TeamActivityItem[]; meta: any },
      {
        cursor?: string;
        limit?: number;
        entity?: string;
        memberId?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ cursor, limit = 30, entity, memberId, startDate, endDate } = {}) => ({
        url: "/team/activity",
        params: {
          ...(cursor && { cursor }),
          limit,
          ...(entity && { entity }),
          ...(memberId && { memberId }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: [{ type: "Team", id: "ACTIVITY" }],
    }),

    getTeamActivitySummary: builder.query<
      TeamActivitySummary,
      { days?: number }
    >({
      query: ({ days = 7 } = {}) => ({
        url: "/team/activity/summary",
        params: { days },
      }),
      transformResponse: (r: { data: TeamActivitySummary }) => r.data,
      providesTags: [{ type: "Team", id: "ACTIVITY_SUMMARY" }],
    }),

    // -------------------------------------------------------------------------
    // Invitations
    // -------------------------------------------------------------------------
    getTeamInvitationsSent: builder.query<
      { result: TeamInvitation[]; meta: any },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/team/invitations/sent",
        params: { page, limit, ...(status && { status }) },
        headers: { "Cache-Control": "no-cache" },
      }),
      providesTags: [{ type: "Team", id: "INVITATIONS_SENT" }],
    }),

    getTeamInvitationsReceived: builder.query<
      { result: TeamInvitation[]; meta: any },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/team/invitations/received",
        params: { page, limit, ...(status && { status }) },
        headers: { "Cache-Control": "no-cache" },
      }),
      providesTags: [{ type: "Team", id: "INVITATIONS_RECEIVED" }],
    }),

    sendTeamInvitation: builder.mutation<
      { invitationId: string },
      { email: string; role?: string; message?: string }
    >({
      query: (body) => ({
        url: "/team/invitations",
        method: "POST",
        body,
      }),
      transformResponse: (r: { data: { invitationId: string } }) => r.data,
      invalidatesTags: [
        { type: "Team", id: "INVITATIONS_SENT" },
        { type: "Team", id: "STATS" },
      ],
    }),

    cancelTeamInvitation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/team/invitations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Team", id: "INVITATIONS_SENT" },
        { type: "Team", id: "STATS" },
      ],
    }),

    resendTeamInvitation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/team/invitations/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Team", id: "INVITATIONS_SENT" }],
    }),

    // -------------------------------------------------------------------------
    // Settings
    // -------------------------------------------------------------------------
    getTeamSettings: builder.query<TeamSettings, void>({
      query: () => "/team/settings",
      transformResponse: (r: { data: TeamSettings }) => r.data,
      providesTags: [{ type: "Team", id: "SETTINGS" }],
    }),

    updateTeamSettings: builder.mutation<TeamSettings, Partial<TeamSettings>>({
      query: (body) => ({
        url: "/team/settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (r: { data: TeamSettings }) => r.data,
      invalidatesTags: [{ type: "Team", id: "SETTINGS" }],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetTeamMemberQuery,
  useUpdateTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetTeamStatsQuery,
  useGetTeamActivityQuery,
  useGetTeamActivitySummaryQuery,
  useGetTeamInvitationsSentQuery,
  useGetTeamInvitationsReceivedQuery,
  useSendTeamInvitationMutation,
  useCancelTeamInvitationMutation,
  useResendTeamInvitationMutation,
  useGetTeamSettingsQuery,
  useUpdateTeamSettingsMutation,
} = teamApi;
