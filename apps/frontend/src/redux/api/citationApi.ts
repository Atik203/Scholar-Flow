import { apiSlice } from "./apiSlice";

export type CitationFormatName =
  | "BIBTEX"
  | "ENDNOTE"
  | "APA"
  | "MLA"
  | "IEEE"
  | "CHICAGO"
  | "HARVARD"
  | "VANCOUVER"
  | "ACS";

export interface CitationFormatInfo {
  name: CitationFormatName;
  ext: string;
  description: string;
  popular: boolean;
  premium: boolean;
}

export interface CitationPaper {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  journal: string | null;
  doi: string | null;
  citationCount: number;
}

export interface ExportCitationsRequest {
  paperIds?: string[];
  collectionId?: string;
  format: CitationFormatName;
  includeAbstract?: boolean;
  includeKeywords?: boolean;
}

export interface ExportCitationsResponse {
  content: string;
  format: string;
  count: number;
}

export interface CitationExportHistoryItem {
  id: string;
  format: string;
  exportedAt: string;
  downloadedAt?: string | null;
  fileSize?: string | null;
  paperCount?: number;
  paper?: { id: string; title: string } | null;
  collection?: { id: string; name: string; paperCount?: number } | null;
}

export const citationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listFormats: builder.query<{ data: CitationFormatInfo[] }, void>({
      query: () => "/citations/formats",
      transformResponse: (response: { data: CitationFormatInfo[] }) => response,
      providesTags: ["Citation"],
    }),

    getManagerView: builder.query<
      { data: { papers: CitationPaper[]; total: number } },
      { search?: string; limit?: number; offset?: number }
    >({
      query: (q = {}) => {
        const params: any = {};
        if (q.search) params.search = q.search;
        if (q.limit) params.limit = q.limit;
        if (q.offset) params.offset = q.offset;
        return { url: "/citations/manager", params };
      },
      transformResponse: (response: {
        data: { papers: CitationPaper[]; total: number };
      }) => response,
      providesTags: ["Citation"],
    }),

    exportCitations: builder.mutation<
      ExportCitationsResponse,
      ExportCitationsRequest
    >({
      query: (body) => ({ url: "/citations/export", method: "POST", body }),
      transformResponse: (response: { data: ExportCitationsResponse }) =>
        response.data,
      invalidatesTags: ["CitationExport"],
    }),

    getHistory: builder.query<
      { exports: CitationExportHistoryItem[]; total: number },
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: "/citations/history",
        params: { limit, offset },
      }),
      transformResponse: (response: {
        data: { exports: CitationExportHistoryItem[]; total: number };
      }) => response.data,
      providesTags: ["CitationExport"],
    }),

    deleteExport: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/citations/${id}`, method: "DELETE" }),
      invalidatesTags: ["CitationExport"],
    }),
  }),
});

export const {
  useListFormatsQuery,
  useGetManagerViewQuery,
  useExportCitationsMutation,
  useGetHistoryQuery,
  useDeleteExportMutation,
} = citationApi;
