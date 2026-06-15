import { apiSlice } from "./apiSlice";

export interface ImportResult {
  paper: { id: string; title: string; source: string; doi?: string };
  source: string;
  externalId?: string;
}

export interface ImportHistoryItem {
  id: string;
  title: string;
  source: string;
  doi: string | null;
  createdAt: string;
}

export interface FileImportResult {
  total: number;
  imported: number;
  papers: Array<{ id?: string; title: string; source: string; status: string; error?: string }>;
}

export const importApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    importByDOI: builder.mutation<ImportResult, { doi: string; workspaceId: string }>({
      query: (body) => ({ url: "/import/doi", method: "POST", body }),
      invalidatesTags: ["Paper", "Import"],
    }),

    importByArxiv: builder.mutation<ImportResult, { arxivId: string; workspaceId: string }>({
      query: (body) => ({ url: "/import/arxiv", method: "POST", body }),
      invalidatesTags: ["Paper", "Import"],
    }),

    importByURL: builder.mutation<{ id: string; title: string }, { url: string; workspaceId: string }>({
      query: (body) => ({ url: "/import/url", method: "POST", body }),
      invalidatesTags: ["Paper", "Import"],
    }),

    importByFile: builder.mutation<FileImportResult, { content: string; format: "bibtex" | "ris"; workspaceId: string }>({
      query: (body) => ({ url: "/import/file", method: "POST", body }),
      invalidatesTags: ["Paper", "Import"],
    }),

    getImportHistory: builder.query<ImportHistoryItem[], void>({
      query: () => "/import/history",
      transformResponse: (res: { data: ImportHistoryItem[] }) => res.data,
      providesTags: ["Import"],
    }),
  }),
});

export const {
  useImportByDOIMutation,
  useImportByArxivMutation,
  useImportByURLMutation,
  useImportByFileMutation,
  useGetImportHistoryQuery,
} = importApi;
