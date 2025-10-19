import { apiSlice } from "./apiSlice";

export type AnnotationType =
  | "HIGHLIGHT"
  | "UNDERLINE"
  | "STRIKETHROUGH"
  | "AREA"
  | "COMMENT"
  | "NOTE"
  | "INK";

export interface AnnotationAnchor {
  page: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  textRange?: {
    start: number;
    end: number;
  };
  selectedText?: string;
  // For INK/freehand annotations
  points?: Array<{ x: number; y: number }>;
  // For viewport transform tracking
  viewport?: {
    scale: number;
    rotation: number;
  };
}

export interface Annotation {
  id: string;
  paperId: string;
  userId: string;
  type: AnnotationType;
  anchor: AnnotationAnchor;
  text: string;
  version: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  paper: {
    id: string;
    title: string;
  };
  parent?: Annotation;
  children?: Annotation[];
  versions?: AnnotationVersion[];
}

export interface AnnotationVersion {
  id: string;
  annotationId: string;
  version: number;
  text: string;
  changedById: string;
  timestamp: string;
  changedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAnnotationRequest {
  paperId: string;
  type: AnnotationType;
  anchor: AnnotationAnchor;
  text: string;
  parentId?: string;
}

export interface UpdateAnnotationRequest {
  text?: string;
  anchor?: AnnotationAnchor;
}

export interface CreateAnnotationReplyRequest {
  text: string;
}

export interface GetAnnotationsQuery {
  paperId: string;
  page?: number;
  type?: AnnotationType;
  includeReplies?: boolean;
}

export const annotationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create annotation
    createAnnotation: builder.mutation<
      { data: Annotation },
      CreateAnnotationRequest
    >({
      query: (data) => ({
        url: "/annotations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { paperId }) => [
        { type: "Annotation", id: paperId },
        { type: "Annotation", id: "LIST" },
      ],
    }),

    // Get paper annotations
    getPaperAnnotations: builder.query<
      { data: Annotation[] },
      GetAnnotationsQuery
    >({
      query: ({ paperId, page, type, includeReplies }) => {
        const params: any = { paperId };
        if (page) params.page = page;
        if (type) params.type = type;
        if (includeReplies) params.includeReplies = includeReplies;

        return {
          url: "/annotations/paper/" + paperId,
          params,
        };
      },
      transformResponse: (response: { data: Annotation[] }) => response,
      providesTags: (result, error, { paperId }) => [
        { type: "Annotation", id: paperId },
        { type: "Annotation", id: "LIST" },
      ],
    }),

    // Get user annotations
    getUserAnnotations: builder.query<
      { data: Annotation[]; meta: any },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/annotations/user",
        params: { page, limit },
      }),
      transformResponse: (response: { data: Annotation[]; meta: any }) =>
        response,
      providesTags: [{ type: "Annotation", id: "USER" }],
    }),

    // Update annotation
    updateAnnotation: builder.mutation<
      { data: Annotation },
      { id: string; data: UpdateAnnotationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/annotations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Annotation", id },
        { type: "Annotation", id: "LIST" },
      ],
    }),

    // Delete annotation
    deleteAnnotation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/annotations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Annotation", id },
        { type: "Annotation", id: "LIST" },
      ],
    }),

    // Create annotation reply
    createAnnotationReply: builder.mutation<
      { data: Annotation },
      { id: string; data: CreateAnnotationReplyRequest }
    >({
      query: ({ id, data }) => ({
        url: `/annotations/${id}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Annotation", id },
        { type: "Annotation", id: "LIST" },
      ],
    }),

    // Get annotation versions
    getAnnotationVersions: builder.query<{ data: AnnotationVersion[] }, string>(
      {
        query: (id) => `/annotations/${id}/versions`,
        transformResponse: (response: { data: AnnotationVersion[] }) =>
          response,
        providesTags: (result, error, id) => [{ type: "Annotation", id }],
      }
    ),
  }),
});

export const {
  useCreateAnnotationMutation,
  useGetPaperAnnotationsQuery,
  useGetUserAnnotationsQuery,
  useUpdateAnnotationMutation,
  useDeleteAnnotationMutation,
  useCreateAnnotationReplyMutation,
  useGetAnnotationVersionsQuery,
} = annotationApi;
