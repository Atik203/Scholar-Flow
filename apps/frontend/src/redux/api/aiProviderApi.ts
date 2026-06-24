/**
 * aiProviderApi — admin-only RTK Query slice for the AIProvider catalog.
 *
 * Wraps the /api/admin/ai-providers endpoints added in Phase C.2.
 * Tags: AIProviderConfig (list-level) and AIProviderConfig/{id} (per-row).
 * Invalidation cascades from any mutation so the catalog list refreshes
 * everywhere (admin AI page + the floating assistant's model dropdown).
 */
import { apiSlice } from "./apiSlice";

export interface AIProviderRow {
  id: string;
  provider: string;
  model: string;
  displayName: string;
  description: string | null;
  apiKeyEnvName: string | null;
  enabled: boolean;
  isDefault: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIProviderKeyStatus {
  envName: string;
  configured: boolean;
}

export interface AIProviderListResponse {
  providers: AIProviderRow[];
  keyStatuses: AIProviderKeyStatus[];
}

export interface CreateAIProviderRequest {
  provider: string;
  model: string;
  displayName: string;
  description?: string | null;
  apiKeyEnvName?: string | null;
  enabled?: boolean;
  isDefault?: boolean;
  displayOrder?: number;
}

export interface UpdateAIProviderRequest {
  id: string;
  displayName?: string;
  description?: string | null;
  apiKeyEnvName?: string | null;
  enabled?: boolean;
  displayOrder?: number;
}

export interface ReorderAIProvidersRequest {
  items: Array<{ id: string; displayOrder: number }>;
}

export const aiProviderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listAIProviders: builder.query<AIProviderListResponse, void>({
      query: () => "/admin/ai-providers",
      transformResponse: (response: { data: AIProviderListResponse }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.providers.map((p) => ({
                type: "AIProviderConfig" as const,
                id: p.id,
              })),
              { type: "AIProviderConfig" as const, id: "LIST" },
            ]
          : [{ type: "AIProviderConfig" as const, id: "LIST" }],
    }),

    getKeyStatuses: builder.query<{ keyStatuses: AIProviderKeyStatus[] }, void>({
      query: () => "/admin/ai-providers/keys/status",
      transformResponse: (response: { data: { keyStatuses: AIProviderKeyStatus[] } }) =>
        response.data,
      providesTags: [{ type: "AIProviderConfig", id: "KEYS" }],
    }),

    createAIProvider: builder.mutation<AIProviderRow, CreateAIProviderRequest>({
      query: (body) => ({
        url: "/admin/ai-providers",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: AIProviderRow }) => response.data,
      invalidatesTags: [
        { type: "AIProviderConfig", id: "LIST" },
        "AIProvider",
      ],
    }),

    updateAIProvider: builder.mutation<AIProviderRow, UpdateAIProviderRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/ai-providers/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: AIProviderRow }) => response.data,
      invalidatesTags: (result, _err, { id }) => [
        { type: "AIProviderConfig", id: "LIST" },
        { type: "AIProviderConfig", id },
        "AIProvider",
      ],
    }),

    setDefaultAIProvider: builder.mutation<AIProviderRow, string>({
      query: (id) => ({
        url: `/admin/ai-providers/${id}/default`,
        method: "POST",
      }),
      transformResponse: (response: { data: AIProviderRow }) => response.data,
      invalidatesTags: [
        { type: "AIProviderConfig", id: "LIST" },
        "AIProvider",
      ],
    }),

    reorderAIProviders: builder.mutation<AIProviderRow[], ReorderAIProvidersRequest>({
      query: (body) => ({
        url: "/admin/ai-providers/reorder",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: AIProviderRow[] }) => response.data,
      invalidatesTags: [{ type: "AIProviderConfig", id: "LIST" }, "AIProvider"],
    }),

    deleteAIProvider: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/ai-providers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AIProviderConfig", id: "LIST" },
        { type: "AIProviderConfig", id },
        "AIProvider",
      ],
    }),
  }),
});

export const {
  useListAIProvidersQuery,
  useGetKeyStatusesQuery,
  useCreateAIProviderMutation,
  useUpdateAIProviderMutation,
  useSetDefaultAIProviderMutation,
  useReorderAIProvidersMutation,
  useDeleteAIProviderMutation,
} = aiProviderApi;
