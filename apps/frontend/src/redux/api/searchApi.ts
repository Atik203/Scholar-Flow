import { apiSlice } from './apiSlice';

export type SearchTabType =
  | "all"
  | "papers"
  | "people"
  | "workspaces"
  | "internet";

export interface GlobalSearchQuery {
  q: string;
  type?: SearchTabType;
  page?: number;
  limit?: number;
  workspaceId?: string;
}

export interface SearchResultItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  abstract?: string;
  excerpt?: string;
  metadata?: Record<string, unknown>;
  source?: string;
  createdAt?: string;
  isPublic?: boolean;
  // Phase D.1: people + notes
  email?: string;
  image?: string | null;
  role?: string;
  institution?: string | null;
  noteType?: string;
  visibility?: string;
  updatedAt?: string;
}

export interface SearchResults {
  papers?: { total: number; items: SearchResultItem[] };
  collections?: { total: number; items: SearchResultItem[] };
  workspaces?: { total: number; items: SearchResultItem[] };
  notes?: { total: number; items: SearchResultItem[] };
  people?: { total: number; items: SearchResultItem[] };
  internet?: { total: number; items: SearchResultItem[]; fallback?: string };
}

export interface GlobalSearchResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: SearchResults;
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: Record<string, unknown>;
  createdAt: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: SearchHistory[];
}

export interface SaveSearchQueryRequest {
  query: string;
  filters?: Record<string, unknown>;
  results?: Record<string, unknown>;
}

export interface SaveSearchQueryResponse {
  success: boolean;
  data: SearchHistory;
}

export interface DiscoveryResponse {
  success: boolean;
  data: SearchResultItem[];
}

// Phase D.2 — Perplexity-style AI summary + citations.
export interface AISearchSource {
  id: string;
  type: "paper" | "collection" | "workspace";
  title: string;
  href: string;
}

export interface AISearchResponse {
  summary: string;
  sources: AISearchSource[];
  fallback: string | null;
}

export interface AISearchRequest {
  q: string;
  mode?: "summarize";
  workspaceId?: string;
  model?: string;
}

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<GlobalSearchResponse, GlobalSearchQuery>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.q) queryParams.append('q', params.q);
        if (params.type) queryParams.append('type', params.type);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.workspaceId) queryParams.append('workspaceId', params.workspaceId);

        return `/search?${queryParams.toString()}`;
      },
      keepUnusedDataFor: 60,
    }),

    getSearchHistory: builder.query<SearchHistoryResponse, { page?: number; limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        return `/search/history?${queryParams.toString()}`;
      },
      providesTags: ['SearchHistory']
    }),

    saveSearchQuery: builder.mutation<
      SaveSearchQueryResponse,
      SaveSearchQueryRequest
    >({
      query: (body) => ({
        url: '/search/history',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SearchHistory']
    }),

    getTrending: builder.query<DiscoveryResponse, void>({
      query: () => '/search/trending',
      keepUnusedDataFor: 300,
    }),

    getRecommendations: builder.query<DiscoveryResponse, void>({
      query: () => '/search/recommendations',
      keepUnusedDataFor: 300,
    }),

    semanticSearch: builder.query<
      { results: Array<{ id: string; paperId: string; content: string; title: string | null; distance: number }>; fallback: string | null },
      { q: string; limit?: number; workspaceId?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams({ q: params.q });
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.workspaceId) queryParams.append('workspaceId', params.workspaceId);
        return `/search/semantic?${queryParams.toString()}`;
      },
    }),

    // Phase D.2 — Perplexity-style AI summary
    aiSearch: builder.mutation<AISearchResponse, AISearchRequest>({
      query: (body) => ({
        url: '/search/ai-search',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AISearchResponse }) => response.data,
    }),

    // Phase D.2 — citation list for the AI summary
    getSearchSources: builder.query<
      { sources: AISearchSource[] },
      { q: string; workspaceId?: string; limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams({ q: params.q });
        if (params.workspaceId) queryParams.append('workspaceId', params.workspaceId);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        return `/search/sources?${queryParams.toString()}`;
      },
    }),
  }),
});

export const {
  useGlobalSearchQuery,
  useLazyGlobalSearchQuery,
  useGetSearchHistoryQuery,
  useSaveSearchQueryMutation,
  useGetTrendingQuery,
  useGetRecommendationsQuery,
  useSemanticSearchQuery,
  useAiSearchMutation,
  useGetSearchSourcesQuery,
} = searchApi;
