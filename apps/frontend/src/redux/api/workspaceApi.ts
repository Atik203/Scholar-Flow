import { apiSlice } from "./apiSlice";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  memberCount?: number;
  collectionCount?: number;
  paperCount?: number;
  isOwner?: boolean;
  userRole?: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  invitedAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  workspaceName?: string;
  inviteeEmail?: string;
  inviteeName?: string;
  inviterEmail?: string;
  inviterName?: string;
}

export interface InviteWorkspaceMemberRequest {
  id: string;
  email: string;
  role?: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
}

export const workspaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listWorkspaces: builder.query<
      {
        data: Workspace[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number; scope?: "all" | "owned" | "shared" }
    >({
      query: ({ page = 1, limit = 10, scope = "all" } = {}) => ({
        url: `/workspaces`,
        params: { page, limit, scope },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((w) => ({
                type: "Workspace" as const,
                id: w.id,
              })),
              { type: "Workspace" as const, id: "LIST" },
            ]
          : [{ type: "Workspace" as const, id: "LIST" }],
    }),

    createWorkspace: builder.mutation<Workspace, { name: string }>({
      query: (body) => ({ url: `/workspaces`, method: "POST", body }),
      transformResponse: (response: { data: Workspace }) => response.data,
      invalidatesTags: [{ type: "Workspace", id: "LIST" }],
    }),

    getWorkspace: builder.query<Workspace, string>({
      query: (id) => `/workspaces/${id}`,
      transformResponse: (response: { data: Workspace }) => response.data,
      providesTags: (result, _err, id) => [{ type: "Workspace", id }],
    }),

    updateWorkspace: builder.mutation<
      Workspace,
      { id: string; name?: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/workspaces/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: Workspace }) => response.data,
      invalidatesTags: (result, _err, { id }) => [
        { type: "Workspace", id },
        { type: "Workspace", id: "LIST" },
      ],
    }),

    deleteWorkspace: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/workspaces/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Workspace", id: "LIST" }],
    }),

    listMembers: builder.query<
      {
        data: any[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/workspaces/${id}/members`,
        params: { page, limit },
      }),
      providesTags: (_result, _err, { id }) => [
        { type: "Workspace", id: `${id}-members` },
      ],
    }),

    addMember: builder.mutation<
      { success: boolean },
      { id: string; userId?: string; email?: string; role?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/workspaces/${id}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Workspace", id: `${id}-members` },
        { type: "Workspace", id: "LIST" },
      ],
    }),

    updateMemberRole: builder.mutation<
      { success: boolean },
      { id: string; memberId: string; role: string }
    >({
      query: ({ id, memberId, role }) => ({
        url: `/workspaces/${id}/members/${memberId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Workspace", id: `${id}-members` },
        { type: "Workspace", id: "LIST" },
      ],
    }),

    removeMember: builder.mutation<
      { success: boolean },
      { id: string; memberId: string }
    >({
      query: ({ id, memberId }) => ({
        url: `/workspaces/${id}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Workspace", id: `${id}-members` },
        { type: "Workspace", id: "LIST" },
      ],
    }),

    // Workspace Invitations
    inviteWorkspaceMember: builder.mutation<
      { invitationId: string },
      InviteWorkspaceMemberRequest
    >({
      query: ({ id, email, role = "RESEARCHER" }) => ({
        url: `/workspaces/${id}/invite`,
        method: "POST",
        body: { email, role },
      }),
      transformResponse: (response: { data: { invitationId: string } }) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Workspace", id: `${id}-members` },
        { type: "Workspace", id: "SHARED" },
        { type: "Workspace", id: "INVITES" },
      ],
    }),

    acceptWorkspaceInvitation: builder.mutation<{ success: boolean }, string>({
      query: (workspaceId) => ({
        url: `/workspaces/${workspaceId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, workspaceId) => [
        { type: "Workspace", id: workspaceId },
        { type: "Workspace", id: "LIST" },
        { type: "Workspace", id: "SHARED" },
        { type: "Workspace", id: "INVITES" },
      ],
    }),

    declineWorkspaceInvitation: builder.mutation<{ success: boolean }, string>({
      query: (workspaceId) => ({
        url: `/workspaces/${workspaceId}/decline`,
        method: "POST",
      }),
      invalidatesTags: (result, error, workspaceId) => [
        { type: "Workspace", id: workspaceId },
        { type: "Workspace", id: "SHARED" },
        { type: "Workspace", id: "INVITES" },
      ],
    }),

    getWorkspaceInvitationsSent: builder.query<
      {
        result: WorkspaceInvitation[];
        meta: { total: number; totalPage: number };
      },
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/workspaces/invites/sent",
        params: { page, limit },
        headers: {
          "Cache-Control": "no-cache",
        },
      }),
      transformResponse: (response: {
        data: WorkspaceInvitation[];
        meta: { total: number; totalPage: number };
      }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: [{ type: "Workspace", id: "INVITES" }],
      keepUnusedDataFor: 0,
    }),

    getWorkspaceInvitationsReceived: builder.query<
      {
        result: WorkspaceInvitation[];
        meta: { total: number; totalPage: number };
      },
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/workspaces/invites/received",
        params: { page, limit },
        headers: {
          "Cache-Control": "no-cache",
        },
      }),
      transformResponse: (response: {
        data: WorkspaceInvitation[];
        meta: { total: number; totalPage: number };
      }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: [{ type: "Workspace", id: "INVITES" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useListWorkspacesQuery,
  useCreateWorkspaceMutation,
  useGetWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useListMembersQuery,
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useInviteWorkspaceMemberMutation,
  useAcceptWorkspaceInvitationMutation,
  useDeclineWorkspaceInvitationMutation,
  useGetWorkspaceInvitationsSentQuery,
  useGetWorkspaceInvitationsReceivedQuery,
} = workspaceApi;
