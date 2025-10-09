import { apiSlice } from "./apiSlice";

export interface ResearchNote {
  id: string;
  userId: string;
  paperId?: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  paper?: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface CreateNoteRequest {
  paperId?: string;
  title: string;
  content: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface GetNotesQuery {
  page?: number;
  limit?: number;
  paperId?: string;
  search?: string;
  tags?: string[];
}

export const noteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create note
    createNote: builder.mutation<
      { data: ResearchNote },
      CreateNoteRequest
    >({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),

    // Get notes
    getNotes: builder.query<
      { data: ResearchNote[]; meta: any },
      GetNotesQuery
    >({
      query: ({ page = 1, limit = 20, paperId, search, tags } = {}) => {
        const params: any = { page, limit };
        if (paperId) params.paperId = paperId;
        if (search) params.search = search;
        if (tags) params.tags = tags.join(",");
        
        return {
          url: "/notes",
          params,
        };
      },
      transformResponse: (response: { data: ResearchNote[]; meta: any }) => response,
      providesTags: ["Note"],
    }),

    // Get note by ID
    getNote: builder.query<
      { data: ResearchNote },
      string
    >({
      query: (id) => `/notes/${id}`,
      transformResponse: (response: { data: ResearchNote }) => response,
      providesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    // Update note
    updateNote: builder.mutation<
      { data: ResearchNote },
      { id: string; data: UpdateNoteRequest }
    >({
      query: ({ id, data }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    // Delete note
    deleteNote: builder.mutation<
      { success: boolean },
      string
    >({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    // Search notes
    searchNotes: builder.query<
      { data: ResearchNote[]; meta: any },
      { query: string; page?: number; limit?: number }
    >({
      query: ({ query, page = 1, limit = 20 }) => ({
        url: "/notes/search",
        params: { query, page, limit },
      }),
      transformResponse: (response: { data: ResearchNote[]; meta: any }) => response,
      providesTags: ["Note"],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetNotesQuery,
  useGetNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useSearchNotesQuery,
} = noteApi;
