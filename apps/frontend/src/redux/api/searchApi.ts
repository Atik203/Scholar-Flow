import { apiSlice } from './apiSlice';

export interface GlobalSearchQuery {
  q: string;
  type?: "all" | "papers" | "collections" | "workspaces";
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
  metadata?: any;
  source?: string;
  createdAt?: string;
  isPublic?: boolean;
}

export interface SearchResults {
  papers?: { total: number; items: SearchResultItem[] };
  collections?: { total: number; items: SearchResultItem[] };
  workspaces?: { total: number; items: SearchResultItem[] };
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
  filters: any;
  createdAt: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  meta: any;
  data: SearchHistory[];
}

export interface DiscoveryResponse {
  success: boolean;
  data: SearchResultItem[];
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
      // Cache results based on query parameters, keep unused for a bit
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
    
    saveSearchQuery: builder.mutation<any, { query: string; filters?: any; results?: any }>({
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
  }),
});

export const {
  useGlobalSearchQuery,
  useLazyGlobalSearchQuery,
  useGetSearchHistoryQuery,
  useSaveSearchQueryMutation,
  useGetTrendingQuery,
  useGetRecommendationsQuery,
} = searchApi;
