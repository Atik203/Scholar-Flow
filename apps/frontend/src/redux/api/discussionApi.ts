import { apiSlice } from "./apiSlice";

export type DiscussionScope = "all" | "general" | "workspace" | "paper" | "collection";

export interface DiscussionAuthor {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

export interface DiscussionMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user: DiscussionAuthor;
  parent?: DiscussionMessage | null;
  replies?: DiscussionMessage[];
}

export interface LastReply {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name?: string | null; firstName?: string | null; lastName?: string | null };
}

export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  isResolved: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: DiscussionAuthor;
  user: DiscussionAuthor;
  paper?: { id: string; title: string };
  collection?: { id: string; name: string };
  workspace?: { id: string; name: string };
  lastReply?: LastReply;
  _count: { messages: number };
  messages?: DiscussionMessage[];
  participants?: DiscussionAuthor[];
}

export interface CreateGeneralDiscussionRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateScopedDiscussionRequest {
  paperId?: string;
  collectionId?: string;
  workspaceId?: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateDiscussionRequest {
  title?: string;
  content?: string;
  isResolved?: boolean;
  isPinned?: boolean;
  tags?: string[];
}

export interface CreateMessageRequest {
  threadId: string;
  content: string;
  parentId?: string;
}

export interface ListMineQuery {
  scope?: DiscussionScope;
  isResolved?: boolean;
  isPinned?: boolean;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export type ActivitySeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface ActivityLogEntry {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  details?: Record<string, unknown>;
  severity: ActivitySeverity;
  createdAt: string;
  user?: DiscussionAuthor | null;
  workspace?: { id: string; name: string } | null;
}

export interface ActivityLogFilters {
  userId?: string;
  workspaceId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
  severity?: ActivitySeverity;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const discussionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Personal feed (Phase 6)
    listMyDiscussions: builder.query<
      { data: { threads: DiscussionThread[]; total: number } },
      ListMineQuery
    >({
      query: (q = {}) => {
        const params: any = {};
        if (q.scope) params.scope = q.scope;
        if (q.isResolved !== undefined) params.isResolved = String(q.isResolved);
        if (q.isPinned !== undefined) params.isPinned = String(q.isPinned);
        if (q.search) params.search = q.search;
        if (q.tags && q.tags.length) params.tags = q.tags.join(",");
        if (q.limit) params.limit = q.limit;
        if (q.offset) params.offset = q.offset;
        return { url: "/discussions/mine", params };
      },
      transformResponse: (response: {
        data: { threads: DiscussionThread[]; total: number };
      }) => response,
      providesTags: (result) =>
        result?.data?.threads
          ? [
              ...result.data.threads.map((t) => ({
                type: "Discussion" as const,
                id: t.id,
              })),
              { type: "Discussion" as const, id: "LIST" },
            ]
          : [{ type: "Discussion" as const, id: "LIST" }],
    }),

    listAllDiscussions: builder.query<
      { threads: DiscussionThread[]; total: number },
      {
        paperId?: string;
        collectionId?: string;
        workspaceId?: string;
        isResolved?: boolean;
        isPinned?: boolean;
        tags?: string[];
        limit?: number;
        offset?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/discussions",
        params,
      }),
      transformResponse: (response: {
        data: { threads: DiscussionThread[]; total: number };
      }) => response.data,
      providesTags: (result) =>
        result?.threads
          ? [
              ...result.threads.map((t) => ({
                type: "Discussion" as const,
                id: t.id,
              })),
              { type: "Discussion" as const, id: "LIST" },
            ]
          : [{ type: "Discussion" as const, id: "LIST" }],
    }),

    getDiscussion: builder.query<DiscussionThread, string>({
      query: (id) => `/discussions/${id}`,
      transformResponse: (response: { data: DiscussionThread }) => response.data,
      providesTags: (result, error, id) => [
        { type: "Discussion", id },
      ],
    }),

    createGeneralDiscussion: builder.mutation<
      { data: DiscussionThread },
      CreateGeneralDiscussionRequest
    >({
      query: (body) => ({ url: "/discussions/general", method: "POST", body }),
      transformResponse: (response: { data: DiscussionThread }) => response,
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),

    createDiscussion: builder.mutation<
      { data: DiscussionThread },
      CreateScopedDiscussionRequest
    >({
      query: (body) => ({ url: "/discussions", method: "POST", body }),
      transformResponse: (response: { data: DiscussionThread }) => response,
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),

    updateDiscussion: builder.mutation<
      { data: DiscussionThread },
      { id: string; data: UpdateDiscussionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/discussions/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: DiscussionThread }) => response,
      invalidatesTags: (result, error, { id }) => [
        { type: "Discussion", id },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    deleteDiscussion: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/discussions/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Discussion", id },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    togglePin: builder.mutation<
      { data: { id: string; isPinned: boolean } },
      string
    >({
      query: (id) => ({
        url: `/discussions/${id}/pin`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Discussion", id },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    toggleResolve: builder.mutation<
      { data: { id: string; isResolved: boolean } },
      string
    >({
      query: (id) => ({
        url: `/discussions/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Discussion", id },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    // Messages
    createMessage: builder.mutation<
      { data: DiscussionMessage },
      CreateMessageRequest
    >({
      query: (body) => ({
        url: "/discussions/messages",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: DiscussionMessage }) => response,
      invalidatesTags: (result, error, { threadId }) => [
        { type: "Discussion", id: threadId },
        { type: "Discussion", id: "LIST" },
        { type: "DiscussionMessage" as const, id: `THREAD-${threadId}` },
      ],
    }),

    updateMessage: builder.mutation<
      { data: DiscussionMessage },
      { messageId: string; content: string }
    >({
      query: ({ messageId, content }) => ({
        url: `/discussions/messages/${messageId}`,
        method: "PUT",
        body: { content },
      }),
      transformResponse: (response: { data: DiscussionMessage }) => response,
      invalidatesTags: ["DiscussionMessage"],
    }),

    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (messageId) => ({
        url: `/discussions/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DiscussionMessage"],
    }),

    // Activity Log
    getActivityLog: builder.query<
      { entries: ActivityLogEntry[]; total: number },
      ActivityLogFilters
    >({
      query: (filters) => ({ url: "/activity-log", params: filters }),
      providesTags: ["ActivityLog"],
    }),

    getActivitySummary: builder.query<
      {
        totalActivities: number;
        activitiesByType: { [key: string]: number };
        activitiesBySeverity: { [key: string]: number };
        recentActivities: ActivityLogEntry[];
        trends: { [key: string]: number };
      },
      { workspaceId?: string; days?: number }
    >({
      query: ({ workspaceId, days = 7 } = {}) => ({
        url: "/activity-log/summary",
        params: { workspaceId, days },
      }),
      providesTags: ["ActivityLog"],
    }),

    getEntityActivity: builder.query<
      ActivityLogEntry[],
      { entity: string; entityId: string }
    >({
      query: ({ entity, entityId }) => ({
        url: `/activity-log/entity/${entity}/${entityId}`,
      }),
      providesTags: (result, error, { entity, entityId }) => [
        { type: "ActivityLog", id: `${entity}-${entityId}` },
      ],
    }),

    exportActivityLog: builder.query<
      { content: string; filename: string },
      ActivityLogFilters & { format?: "json" | "csv" }
    >({
      query: (filters) => ({ url: "/activity-log/export", params: filters }),
    }),
  }),
});

export const {
  useListMyDiscussionsQuery,
  useListAllDiscussionsQuery,
  useGetDiscussionQuery,
  useCreateGeneralDiscussionMutation,
  useCreateDiscussionMutation,
  useUpdateDiscussionMutation,
  useDeleteDiscussionMutation,
  useTogglePinMutation,
  useToggleResolveMutation,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useGetActivityLogQuery,
  useGetActivitySummaryQuery,
  useGetEntityActivityQuery,
  useLazyExportActivityLogQuery,
} = discussionApi;
