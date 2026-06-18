import { apiSlice } from "./apiSlice";

export type DiscussionScope = "all" | "general" | "workspace" | "paper" | "collection";

export interface DiscussionAuthor {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
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
  user: DiscussionAuthor;
  paper?: { id: string; title: string } | null;
  collection?: { id: string; name: string } | null;
  workspace?: { id: string; name: string } | null;
  lastReply?: LastReply | null;
  _count?: { messages: number };
  messages?: DiscussionMessage[];
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

    getDiscussion: builder.query<{ data: DiscussionThread }, string>({
      query: (id) => `/discussions/${id}`,
      transformResponse: (response: { data: DiscussionThread }) => response,
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
  }),
});

export const {
  useListMyDiscussionsQuery,
  useGetDiscussionQuery,
  useCreateGeneralDiscussionMutation,
  useCreateDiscussionMutation,
  useUpdateDiscussionMutation,
  useDeleteDiscussionMutation,
  useTogglePinMutation,
  useToggleResolveMutation,
  useCreateMessageMutation,
} = discussionApi;
