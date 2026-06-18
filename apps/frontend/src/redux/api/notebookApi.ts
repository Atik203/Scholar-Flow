import { apiSlice } from "./apiSlice";

export type NotebookColor = "blue" | "purple" | "green" | "orange" | "pink";
export type NoteType = "QUICK" | "LITERATURE" | "METHODOLOGY" | "FINDINGS" | "IDEA";
export type NoteVisibility = "PRIVATE" | "WORKSPACE" | "PUBLIC";

export interface NotebookSection {
  id: string;
  name: string;
  order: number;
  noteCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notebook {
  id: string;
  name: string;
  description?: string | null;
  color: NotebookColor;
  isStarred: boolean;
  noteCount?: number;
  sections?: NotebookSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchNoteFull {
  id: string;
  userId: string;
  paperId?: string | null;
  paper?: { id: string; title: string } | null;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  noteType: NoteType;
  visibility: NoteVisibility;
  isStarred: boolean;
  wordCount: number;
  excerpt?: string | null;
  notebookId?: string | null;
  sectionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotebookRequest {
  name: string;
  description?: string;
  color?: NotebookColor;
}

export interface UpdateNotebookRequest {
  name?: string;
  description?: string;
  color?: NotebookColor;
  isStarred?: boolean;
}

export interface CreateSectionRequest {
  name: string;
  order?: number;
}

export interface UpdateSectionRequest {
  name?: string;
  order?: number;
}

export interface CreateNoteInNotebookRequest {
  sectionId?: string;
  title: string;
  content: string;
  noteType?: NoteType;
  visibility?: NoteVisibility;
  tags?: string[];
  paperId?: string;
}

export interface MoveNoteRequest {
  notebookId: string | null;
  sectionId: string | null;
}

export interface ListNotesQuery {
  sectionId?: string;
  noteType?: NoteType;
  visibility?: NoteVisibility;
  search?: string;
  limit?: number;
}

export const notebookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listNotebooks: builder.query<{ data: Notebook[] }, { limit?: number }>({
      query: ({ limit = 50 } = {}) => ({
        url: "/notebooks",
        params: { limit },
      }),
      transformResponse: (response: { data: Notebook[] }) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((n) => ({ type: "Notebook" as const, id: n.id })),
              { type: "Notebook" as const, id: "LIST" },
            ]
          : [{ type: "Notebook" as const, id: "LIST" }],
    }),

    getNotebook: builder.query<{ data: Notebook }, string>({
      query: (id) => `/notebooks/${id}`,
      transformResponse: (response: { data: Notebook }) => response,
      providesTags: (result, error, id) => [{ type: "Notebook", id }],
    }),

    createNotebook: builder.mutation<{ data: Notebook }, CreateNotebookRequest>({
      query: (body) => ({ url: "/notebooks", method: "POST", body }),
      transformResponse: (response: { data: Notebook }) => response,
      invalidatesTags: [{ type: "Notebook", id: "LIST" }],
    }),

    updateNotebook: builder.mutation<
      { data: Notebook },
      { id: string; data: UpdateNotebookRequest }
    >({
      query: ({ id, data }) => ({
        url: `/notebooks/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Notebook }) => response,
      invalidatesTags: (result, error, { id }) => [
        { type: "Notebook", id },
        { type: "Notebook", id: "LIST" },
      ],
    }),

    deleteNotebook: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/notebooks/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Notebook", id },
        { type: "Notebook", id: "LIST" },
      ],
    }),

    // Sections
    listSections: builder.query<{ data: NotebookSection[] }, string>({
      query: (notebookId) => `/notebooks/${notebookId}/sections`,
      transformResponse: (response: { data: NotebookSection[] }) => response,
      providesTags: (result, error, notebookId) => [
        { type: "NotebookSection" as const, id: `NB-${notebookId}` },
      ],
    }),

    createSection: builder.mutation<
      { data: NotebookSection },
      { notebookId: string; data: CreateSectionRequest }
    >({
      query: ({ notebookId, data }) => ({
        url: `/notebooks/${notebookId}/sections`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: NotebookSection }) => response,
      invalidatesTags: (result, error, { notebookId }) => [
        { type: "NotebookSection", id: `NB-${notebookId}` },
        { type: "Notebook", id: notebookId },
      ],
    }),

    updateSection: builder.mutation<
      { data: NotebookSection },
      { notebookId: string; sectionId: string; data: UpdateSectionRequest }
    >({
      query: ({ notebookId, sectionId, data }) => ({
        url: `/notebooks/${notebookId}/sections/${sectionId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: NotebookSection }) => response,
      invalidatesTags: (result, error, { notebookId }) => [
        { type: "NotebookSection", id: `NB-${notebookId}` },
      ],
    }),

    deleteSection: builder.mutation<
      { success: boolean },
      { notebookId: string; sectionId: string }
    >({
      query: ({ notebookId, sectionId }) => ({
        url: `/notebooks/${notebookId}/sections/${sectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { notebookId }) => [
        { type: "NotebookSection", id: `NB-${notebookId}` },
      ],
    }),

    // Notes
    listNotes: builder.query<
      { data: ResearchNoteFull[] },
      { notebookId: string; query?: ListNotesQuery }
    >({
      query: ({ notebookId, query = {} }) => {
        const params: any = {};
        if (query.sectionId) params.sectionId = query.sectionId;
        if (query.noteType) params.noteType = query.noteType;
        if (query.visibility) params.visibility = query.visibility;
        if (query.search) params.search = query.search;
        if (query.limit) params.limit = query.limit;
        return { url: `/notebooks/${notebookId}/notes`, params };
      },
      transformResponse: (response: { data: ResearchNoteFull[] }) => response,
      providesTags: (result, error, { notebookId }) => [
        { type: "Note" as const, id: `NB-${notebookId}` },
      ],
    }),

    createNoteInNotebook: builder.mutation<
      { data: ResearchNoteFull },
      { notebookId: string; data: CreateNoteInNotebookRequest }
    >({
      query: ({ notebookId, data }) => ({
        url: `/notebooks/${notebookId}/notes`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: ResearchNoteFull }) => response,
      invalidatesTags: (result, error, { notebookId }) => [
        { type: "Note", id: `NB-${notebookId}` },
        "Note",
        { type: "Notebook", id: notebookId },
      ],
    }),

    moveNote: builder.mutation<
      { data: { id: string; notebookId: string | null; sectionId: string | null } },
      { noteId: string; data: MoveNoteRequest }
    >({
      query: ({ noteId, data }) => ({
        url: `/notebooks/notes/${noteId}/move`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Note", { type: "Notebook", id: "LIST" }],
    }),

    // Note metadata update (Phase 6 - notebook-aware PATCH)
    updateNoteMetadata: builder.mutation<
      { data: ResearchNoteFull },
      { id: string; data: Partial<CreateNoteInNotebookRequest> & { isStarred?: boolean; noteType?: NoteType; visibility?: NoteVisibility; title?: string; content?: string; tags?: string[] } }
    >({
      query: ({ id, data }) => ({
        url: `/notes/${id}/metadata`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: ResearchNoteFull }) => response,
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    getNoteFull: builder.query<{ data: ResearchNoteFull }, string>({
      query: (id) => `/notes/${id}/full`,
      transformResponse: (response: { data: ResearchNoteFull }) => response,
      providesTags: (result, error, id) => [{ type: "Note", id }],
    }),
  }),
});

export const {
  useListNotebooksQuery,
  useGetNotebookQuery,
  useCreateNotebookMutation,
  useUpdateNotebookMutation,
  useDeleteNotebookMutation,
  useListSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useListNotesQuery,
  useCreateNoteInNotebookMutation,
  useMoveNoteMutation,
  useUpdateNoteMetadataMutation,
  useGetNoteFullQuery,
} = notebookApi;
