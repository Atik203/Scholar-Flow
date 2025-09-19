import { apiSlice } from "./apiSlice";

export interface Paper {
  id: string;
  workspaceId: string;
  uploaderId: string;
  title: string;
  abstract?: string;
  metadata: {
    authors?: string[];
    year?: number;
    source?: string;
  };
  source?: string;
  doi?: string;
  processingStatus: "UPLOADED" | "PROCESSING" | "PROCESSED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  file?: {
    id: string;
    storageProvider: string;
    objectKey: string;
    contentType?: string;
    sizeBytes?: number;
    originalFilename?: string;
    extractedAt?: string;
  };
}

export interface PaginatedPapersResponse {
  items: Paper[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface UploadPaperRequest {
  workspaceId?: string;
  title?: string;
  authors?: string[];
  year?: number;
  source?: string;
  file: File;
}

export interface UpdatePaperMetadataRequest {
  id: string;
  title?: string;
  abstract?: string;
  authors?: string[];
  year?: number;
}

export interface ProcessingStatusResponse {
  processingStatus: "UPLOADED" | "PROCESSING" | "PROCESSED" | "FAILED";
  processingError?: string;
  processedAt?: string;
  chunksCount: number;
  chunks: Array<{
    id: string;
    idx: number;
    page?: number;
    content: string;
    tokenCount?: number;
    createdAt: string;
  }>;
}

export const paperApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPaper: builder.mutation<
      { data: { paper: Paper } },
      UploadPaperRequest
    >({
      query: ({ file, ...metadata }) => {
        const formData = new FormData();
        formData.append("file", file);
        Object.entries(metadata).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "authors") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        return {
          url: "/papers",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Paper"],
    }),

    listPapers: builder.query<
      PaginatedPapersResponse,
      { page?: number; limit?: number; workspaceId?: string }
    >({
      query: ({ page = 1, limit = 10, workspaceId }) => {
        const params: any = { page, limit };
        // Only include workspaceId for dev/fallback mode
        if (workspaceId) {
          params.workspaceId = workspaceId;
        }
        return {
          url: "/papers",
          params,
        };
      },
      transformResponse: (response: {
        data: Paper[];
        meta: any;
      }): PaginatedPapersResponse => ({
        items: response.data,
        meta: response.meta,
      }),
      providesTags: ["Paper"],
    }),

    getPaper: builder.query<Paper, string>({
      query: (id) => `/papers/${id}`,
      transformResponse: (response: { data: Paper }): Paper => response.data,
      providesTags: (result, error, id) => [{ type: "Paper", id }],
    }),

    getPaperFileUrl: builder.query<
      { data: { url: string; expiresIn: number } },
      string
    >({
      query: (id) => `/papers/${id}/file-url`,
      providesTags: (result, error, id) => [{ type: "Paper", id }],
    }),

    updatePaperMetadata: builder.mutation<Paper, UpdatePaperMetadataRequest>({
      query: ({ id, ...data }) => ({
        url: `/papers/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Paper }): Paper => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Paper", id }],
    }),

    deletePaper: builder.mutation<void, string>({
      query: (id) => ({
        url: `/papers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Paper", id }, "Paper"],
    }),

    getDevWorkspace: builder.query<
      { data: { workspace: { id: string; name: string } } },
      void
    >({
      query: () => "/papers/dev/workspace",
    }),

    // PDF Processing endpoints
    processPDF: builder.mutation<
      { data: { message: string } },
      string
    >({
      query: (paperId) => ({
        url: `/papers/${paperId}/process`,
        method: "POST",
      }),
      invalidatesTags: (result, error, paperId) => [
        { type: "Paper", id: paperId },
        { type: "ProcessingStatus", id: paperId },
      ],
    }),

    getProcessingStatus: builder.query<
      { data: ProcessingStatusResponse },
      string
    >({
      query: (paperId) => `/papers/${paperId}/processing-status`,
      transformResponse: (response: { data: ProcessingStatusResponse }) => response,
      providesTags: (result, error, paperId) => [
        { type: "ProcessingStatus", id: paperId },
      ],
    }),

    getAllChunks: builder.query<
      { data: { chunksCount: number; chunks: ProcessingStatusResponse['chunks'] } },
      string
    >({
      query: (paperId) => `/papers/${paperId}/chunks`,
      transformResponse: (response: { data: { chunksCount: number; chunks: ProcessingStatusResponse['chunks'] } }) => response,
      providesTags: (result, error, paperId) => [
        { type: "ProcessingStatus", id: paperId },
      ],
    }),

    processPDFDirect: builder.mutation<
      { data: { message: string; result?: { pageCount: number; chunksCount: number; textLength: number } } },
      string
    >({
      query: (paperId) => ({
        url: `/papers/${paperId}/process-direct`,
        method: "POST",
      }),
      invalidatesTags: (result, error, paperId) => [
        { type: "Paper", id: paperId },
        { type: "ProcessingStatus", id: paperId },
      ],
    }),
  }),
});

export const {
  useUploadPaperMutation,
  useListPapersQuery,
  useGetPaperQuery,
  useGetPaperFileUrlQuery,
  useUpdatePaperMetadataMutation,
  useDeletePaperMutation,
  useGetDevWorkspaceQuery,
  useProcessPDFMutation,
  useGetProcessingStatusQuery,
  useGetAllChunksQuery,
  useProcessPDFDirectMutation,
} = paperApi;
