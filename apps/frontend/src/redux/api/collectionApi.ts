import { apiSlice } from "./apiSlice";

export type CollectionPermission = "VIEW" | "EDIT";
export type UserPermission = "OWNER" | "EDIT" | "VIEW";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  workspaceId: string;
  ownerId: string;
  _count?: {
    papers: number;
    members: number;
  };
  userPermission?: UserPermission; // User's permission level for this collection
}

export interface CollectionMember {
  id: string;
  collectionId: string;
  userId: string;
  role: string;
  permission: CollectionPermission;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  invitedAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  invitedById?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  invitedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  workspaceId: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface CollectionPaper {
  id: string;
  collectionId: string;
  paperId: string;
  addedById: string;
  addedAt: string;
  paper: {
    id: string;
    title: string;
    abstract?: string;
    metadata: any;
    processingStatus: string;
    file?: {
      id: string;
      originalFilename: string;
      sizeBytes: number;
    };
    uploader: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface AddPaperToCollectionRequest {
  paperId: string;
}

export interface InviteMemberRequest {
  id: string;
  email: string;
  role?: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  permission?: CollectionPermission;
}

export const collectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's collections
    getMyCollections: builder.query<
      { result: Collection[]; meta: any },
      { page?: number; limit?: number; workspaceId?: string }
    >({
      query: ({ page = 1, limit = 10, workspaceId } = {}) => {
        const params: any = { page, limit };
        if (workspaceId) {
          params.workspaceId = workspaceId;
        }
        return {
          url: "/collections/my",
          params,
        };
      },
      transformResponse: (response: { data: Collection[]; meta: any }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({
                type: "Collection" as const,
                id,
              })),
              { type: "Collection", id: "LIST" },
            ]
          : [{ type: "Collection", id: "LIST" }],
    }),

    // Get public collections
    getPublicCollections: builder.query<
      { result: Collection[]; meta: any },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/collections/public",
        params: { page, limit },
      }),
      providesTags: ["Collection"],
    }),

    // Get collections shared with the user
    getSharedCollections: builder.query<
      { result: Collection[]; meta: any },
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/collections/shared",
        params: { page, limit },
      }),
      transformResponse: (response: { data: Collection[]; meta: any }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({
                type: "Collection" as const,
                id,
              })),
              { type: "Collection", id: "SHARED" },
            ]
          : [{ type: "Collection", id: "SHARED" }],
    }),

    // Get specific collection
    getCollection: builder.query<Collection, string>({
      query: (id) => `/collections/${id}`,
      transformResponse: (response: { data: Collection }) => response.data,
      providesTags: (result, error, id) => [{ type: "Collection", id }],
    }),

    // Create collection
    createCollection: builder.mutation<Collection, CreateCollectionRequest>({
      query: (data) => ({
        url: "/collections",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: Collection }) => response.data,
      invalidatesTags: [
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
        "Collection",
      ],
    }),

    // Update collection
    updateCollection: builder.mutation<
      Collection,
      { id: string; data: UpdateCollectionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Collection }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
      ],
    }),

    // Delete collection
    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
        "Collection",
      ],
    }),

    // Search collections
    searchCollections: builder.query<
      { result: Collection[]; meta: any },
      { q: string; page?: number; limit?: number }
    >({
      query: ({ q, page = 1, limit = 10 }) => ({
        url: "/collections/search",
        params: { q, page, limit },
      }),
      providesTags: ["Collection"],
    }),

    // Get collection statistics
    getCollectionStats: builder.query<any, void>({
      query: () => "/collections/stats",
      transformResponse: (response: { data: any }) => response.data,
    }),

    // Invites sent by the authenticated user
    getInvitesSent: builder.query<
      { result: any[]; meta: any },
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/collections/invites/sent",
        params: { page, limit },
        headers: {
          "Cache-Control": "no-cache",
        },
      }),
      transformResponse: (response: { data: any[]; meta: any }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: ["Collection"],
      keepUnusedDataFor: 0,
      forceRefetch({ currentArg, previousArg }) {
        return true; // Always refetch
      },
    }),

    // Invites received by the authenticated user
    getInvitesReceived: builder.query<
      { result: any[]; meta: any },
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/collections/invites/received",
        params: { page, limit },
        headers: {
          "Cache-Control": "no-cache",
        },
      }),
      transformResponse: (response: { data: any[]; meta: any }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: ["Collection"],
      keepUnusedDataFor: 0,
      forceRefetch({ currentArg, previousArg }) {
        return true; // Always refetch
      },
    }),

    // Get papers in collection
    getCollectionPapers: builder.query<
      { result: CollectionPaper[]; meta: any },
      { collectionId: string; page?: number; limit?: number }
    >({
      query: ({ collectionId, page = 1, limit = 10 }) => ({
        url: `/collections/${collectionId}/papers`,
        params: { page, limit },
        headers: {
          "Cache-Control": "no-cache",
        },
      }),
      transformResponse: (response: {
        data: CollectionPaper[];
        meta: any;
      }) => ({
        result: response.data,
        meta: response.meta,
      }),
      providesTags: (result, error, { collectionId }) => [
        { type: "CollectionPaper", id: collectionId },
        "CollectionPaper",
      ],
      keepUnusedDataFor: 0,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.collectionId !== previousArg?.collectionId;
      },
    }),

    // Add paper to collection
    addPaperToCollection: builder.mutation<
      CollectionPaper,
      { collectionId: string; data: AddPaperToCollectionRequest }
    >({
      query: ({ collectionId, data }) => ({
        url: `/collections/${collectionId}/papers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { collectionId }) => [
        { type: "CollectionPaper", id: collectionId },
        { type: "Collection", id: collectionId },
        "CollectionPaper",
      ],
    }),

    // Remove paper from collection
    removePaperFromCollection: builder.mutation<
      void,
      { collectionId: string; paperId: string }
    >({
      query: ({ collectionId, paperId }) => ({
        url: `/collections/${collectionId}/papers/${paperId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { collectionId }) => [
        { type: "CollectionPaper", id: collectionId },
        { type: "Collection", id: collectionId },
        "CollectionPaper",
      ],
    }),

    // List members of a collection
    getCollectionMembers: builder.query<CollectionMember[], string>({
      query: (id) => `/collections/${id}/members`,
      transformResponse: (response: { data: CollectionMember[] }) =>
        response.data,
      providesTags: (result, error, id) => [
        { type: "CollectionMember", id },
        { type: "Collection", id },
      ],
    }),

    // Invite a member by email
    inviteMember: builder.mutation<{ memberId: string }, InviteMemberRequest>({
      query: ({ id, email, role = "RESEARCHER", permission = "EDIT" }) => ({
        url: `/collections/${id}/invite`,
        method: "POST",
        body: { email, role, permission },
      }),
      transformResponse: (response: { data: { memberId: string } }) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "CollectionMember", id },
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
      ],
    }),

    // Accept an invite
    acceptInvite: builder.mutation<any, string>({
      query: (id) => ({
        url: `/collections/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CollectionMember", id },
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
      ],
    }),

    // Decline an invite
    declineInvite: builder.mutation<any, string>({
      query: (id) => ({
        url: `/collections/${id}/decline`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CollectionMember", id },
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
        { type: "Collection", id: "SHARED" },
      ],
    }),
  }),
});

export const {
  useGetMyCollectionsQuery,
  useGetPublicCollectionsQuery,
  useGetSharedCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useSearchCollectionsQuery,
  useGetCollectionStatsQuery,
  useGetCollectionPapersQuery,
  useAddPaperToCollectionMutation,
  useRemovePaperFromCollectionMutation,
  useGetCollectionMembersQuery,
  useInviteMemberMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useGetInvitesSentQuery,
  useGetInvitesReceivedQuery,
} = collectionApi;
