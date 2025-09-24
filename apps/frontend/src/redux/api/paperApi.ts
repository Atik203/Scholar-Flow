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
  // Editor-specific fields
  isDraft?: boolean;
  isPublished?: boolean;
  contentHtml?: string;
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

// Editor-specific interfaces
export interface CreateEditorPaperRequest {
  workspaceId: string;
  title: string;
  content?: string;
  isDraft?: boolean;
  authors?: string[];
}

export interface UpdateEditorContentRequest {
  id: string;
  content: string;
  title?: string;
  isDraft?: boolean;
}

export interface PublishDraftRequest {
  id: string;
  title?: string;
  abstract?: string;
}

export interface ShareViaEmailRequest {
  paperId: string;
  recipientEmail: string;
  permission: "view" | "edit";
  message?: string;
}

export interface EditorPaper {
  id: string;
  title: string;
  contentHtml?: string;
  isDraft: boolean;
  isPublished: boolean;
  workspaceId: string;
  uploaderId: string;
  createdAt: string;
  updatedAt: string;
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
      {
        success: boolean;
        data: { url: string; expiresIn: number };
        message: string;
      },
      string
    >({
      query: (id) => `/papers/${id}/file-url`,
      providesTags: (result, error, id) => [{ type: "Paper", id }],
    }),

    getPaperPreviewUrl: builder.query<
      {
        success: boolean;
        data: {
          url: string;
          mime: string;
          expiresIn: number;
          isPreview: boolean;
          originalMimeType?: string;
        };
        message: string;
      },
      string
    >({
      query: (id) => `/papers/${id}/preview-url`,
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
    processPDF: builder.mutation<{ data: { message: string } }, string>({
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
      transformResponse: (response: { data: ProcessingStatusResponse }) =>
        response,
      providesTags: (result, error, paperId) => [
        { type: "ProcessingStatus", id: paperId },
      ],
    }),

    getAllChunks: builder.query<
      {
        data: {
          chunksCount: number;
          chunks: ProcessingStatusResponse["chunks"];
        };
      },
      string
    >({
      query: (paperId) => `/papers/${paperId}/chunks`,
      transformResponse: (response: {
        data: {
          chunksCount: number;
          chunks: ProcessingStatusResponse["chunks"];
        };
      }) => response,
      providesTags: (result, error, paperId) => [
        { type: "ProcessingStatus", id: paperId },
      ],
    }),

    processPDFDirect: builder.mutation<
      {
        data: {
          message: string;
          result?: {
            pageCount: number;
            chunksCount: number;
            textLength: number;
          };
        };
      },
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

    // Editor-specific endpoints
    createEditorPaper: builder.mutation<
      { data: { paper: EditorPaper } },
      CreateEditorPaperRequest
    >({
      query: (body) => ({
        url: "/editor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Paper"],
    }),

    updateEditorContent: builder.mutation<
      { data: { paper: EditorPaper } },
      UpdateEditorContentRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/editor/${id}/content`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Paper", id }],
    }),

    getEditorPaper: builder.query<{ data: EditorPaper }, string>({
      query: (id) => ({
        url: `/editor/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Paper", id }],
    }),

    listEditorPapers: builder.query<
      { data: EditorPaper[] },
      { workspaceId?: string; isDraft?: boolean }
    >({
      query: (params) => ({
        url: "/editor",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Paper" as const, id })),
              "Paper",
            ]
          : ["Paper"],
    }),

    publishDraft: builder.mutation<
      { data: { paper: EditorPaper } },
      PublishDraftRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/editor/${id}/publish`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Paper", id }],
    }),

    exportPaperPdf: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/editor/${id}/export/pdf`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      // Don't serialize blob responses in Redux
      transformResponse: (response: Blob) => response,
    }),

    exportPaperDocx: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/editor/${id}/export/docx`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      // Don't serialize blob responses in Redux
      transformResponse: (response: Blob) => response,
    }),

    uploadImageForEditor: builder.mutation<
      { url: string; fileName: string },
      FormData
    >({
      query: (formData) => ({
        url: "/editor/upload-image",
        method: "POST",
        body: formData,
      }),
    }),

    shareViaEmail: builder.mutation<
      {
        message: string;
        recipientEmail: string;
        paperTitle: string;
        permission: string;
      },
      ShareViaEmailRequest
    >({
      query: (data) => ({
        url: "/share-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUploadPaperMutation,
  useListPapersQuery,
  useGetPaperQuery,
  useGetPaperFileUrlQuery,
  useGetPaperPreviewUrlQuery,
  useUpdatePaperMetadataMutation,
  useDeletePaperMutation,
  useGetDevWorkspaceQuery,
  useProcessPDFMutation,
  useGetProcessingStatusQuery,
  useGetAllChunksQuery,
  useProcessPDFDirectMutation,
  // Editor endpoints
  useCreateEditorPaperMutation,
  useUpdateEditorContentMutation,
  useGetEditorPaperQuery,
  useListEditorPapersQuery,
  usePublishDraftMutation,
  useExportPaperPdfMutation,
  useExportPaperDocxMutation,
  useUploadImageForEditorMutation,
  useShareViaEmailMutation,
} = paperApi;
