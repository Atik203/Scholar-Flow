import { apiSlice } from "./apiSlice";

export interface SuggestedCollection {
  name: string;
  description: string;
  paperCount: number;
  topics: string[];
  relevanceScore: number;
}

export interface SuggestedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  reason: string;
  similarity: number;
  tags: string[];
}

export interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  topic: string;
  citationCount: number;
}

export const recommendationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuggestedCollections: builder.query<SuggestedCollection[], { limit?: number } | void>({
      query: ({ limit = 5 } = {}) => `/recommendations/collections/suggested?limit=${limit}`,
      transformResponse: (res: { data: SuggestedCollection[] }) => res.data,
      providesTags: ["Recommendation"],
    }),

    getCollectionSuggestions: builder.query<SuggestedPaper[], { collectionId: string; limit?: number }>({
      query: ({ collectionId, limit = 5 }) =>
        `/recommendations/collections/${collectionId}/suggestions?limit=${limit}`,
      transformResponse: (res: { data: SuggestedPaper[] }) => res.data,
      providesTags: (result, error, { collectionId }) => [
        { type: "Recommendation", id: collectionId },
      ],
    }),

    getRecommendedPapers: builder.query<RecommendedPaper[], { topics?: string[]; limit?: number } | void>({
      query: ({ topics, limit = 10 } = {}) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (topics?.length) params.set("topics", topics.join(","));
        return `/recommendations/papers/recommended?${params.toString()}`;
      },
      transformResponse: (res: { data: RecommendedPaper[] }) => res.data,
      providesTags: ["Recommendation"],
    }),
  }),
});

export const {
  useGetSuggestedCollectionsQuery,
  useGetCollectionSuggestionsQuery,
  useGetRecommendedPapersQuery,
} = recommendationApi;
