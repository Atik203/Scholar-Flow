import { apiSlice } from './apiSlice';

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

export const collectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's collections
    getMyCollections: builder.query<{ result: Collection[]; meta: any }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/collections/my',
        params: { page, limit },
      }),
      providesTags: ['Collection'],
    }),

    // Get public collections
    getPublicCollections: builder.query<{ result: Collection[]; meta: any }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/collections/public',
        params: { page, limit },
      }),
      providesTags: ['Collection'],
    }),

    // Get specific collection
    getCollection: builder.query<Collection, string>({
      query: (id) => `/collections/${id}`,
      transformResponse: (response: { data: Collection }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),

    // Create collection
    createCollection: builder.mutation<Collection, CreateCollectionRequest>({
      query: (data) => ({
        url: '/collections',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: Collection }) => response.data,
      invalidatesTags: ['Collection'],
    }),

    // Update collection
    updateCollection: builder.mutation<Collection, { id: string; data: UpdateCollectionRequest }>({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: Collection }) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'Collection', id }],
    }),

    // Delete collection
    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collection'],
    }),

    // Search collections
    searchCollections: builder.query<{ result: Collection[]; meta: any }, { q: string; page?: number; limit?: number }>({
      query: ({ q, page = 1, limit = 10 }) => ({
        url: '/collections/search',
        params: { q, page, limit },
      }),
      providesTags: ['Collection'],
    }),

    // Get collection statistics
    getCollectionStats: builder.query<any, void>({
      query: () => '/collections/stats',
      transformResponse: (response: { data: any }) => response.data,
    }),

    // Get papers in collection
    getCollectionPapers: builder.query<{ result: CollectionPaper[]; meta: any }, { collectionId: string; page?: number; limit?: number }>({
      query: ({ collectionId, page = 1, limit = 10 }) => ({
        url: `/collections/${collectionId}/papers`,
        params: { page, limit },
      }),
      providesTags: (result, error, { collectionId }) => [
        { type: 'CollectionPaper', id: collectionId },
        'CollectionPaper',
      ],
    }),

    // Add paper to collection
    addPaperToCollection: builder.mutation<CollectionPaper, { collectionId: string; data: AddPaperToCollectionRequest }>({
      query: ({ collectionId, data }) => ({
        url: `/collections/${collectionId}/papers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { collectionId }) => [
        { type: 'CollectionPaper', id: collectionId },
        'CollectionPaper',
      ],
    }),

    // Remove paper from collection
    removePaperFromCollection: builder.mutation<void, { collectionId: string; paperId: string }>({
      query: ({ collectionId, paperId }) => ({
        url: `/collections/${collectionId}/papers/${paperId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { collectionId }) => [
        { type: 'CollectionPaper', id: collectionId },
        'CollectionPaper',
      ],
    }),
  }),
});

export const {
  useGetMyCollectionsQuery,
  useGetPublicCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useSearchCollectionsQuery,
  useGetCollectionStatsQuery,
  useGetCollectionPapersQuery,
  useAddPaperToCollectionMutation,
  useRemovePaperFromCollectionMutation,
} = collectionApi;
