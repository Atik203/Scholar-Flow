import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CitationExportRequest {
  paperIds?: string[];
  collectionId?: string;
  format: 'BIBTEX' | 'ENDNOTE' | 'APA' | 'MLA' | 'IEEE' | 'CHICAGO' | 'HARVARD';
  includeAbstract?: boolean;
  includeKeywords?: boolean;
}

export interface CitationExportResponse {
  content: string;
  format: string;
  count: number;
}

export interface CitationExportHistory {
  id: string;
  format: string;
  exportedAt: string;
  downloadedAt?: string;
  fileSize?: string;
  paperCount?: number;
  paper?: {
    id: string;
    title: string;
  };
  collection?: {
    id: string;
    name: string;
    paperCount?: number;
  };
}

export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  isResolved: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  user: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  paper?: {
    id: string;
    title: string;
  };
  collection?: {
    id: string;
    name: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      firstName?: string;
      lastName?: string;
      image?: string;
    };
  }>;
  participants: Array<{
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  }>;
  _count: {
    messages: number;
  };
}

export interface CreateDiscussionRequest {
  paperId?: string;
  collectionId?: string;
  workspaceId?: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface DiscussionMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  parent?: DiscussionMessage;
  replies?: DiscussionMessage[];
}

export interface CreateMessageRequest {
  threadId: string;
  content: string;
  parentId?: string;
}

export interface ActivityLogEntry {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  details?: any;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
}

export interface ActivityLogFilters {
  userId?: string;
  workspaceId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const phase2Api = createApi({
  reducerPath: 'phase2Api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any).auth?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['CitationExport', 'DiscussionThread', 'DiscussionMessage', 'ActivityLog'],
  endpoints: (builder) => ({
    // Citation Export endpoints
    exportCitations: builder.mutation<CitationExportResponse, CitationExportRequest>({
      query: (data) => ({
        url: '/citations/export',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CitationExport'],
    }),
    
    getCitationExportHistory: builder.query<{ exports: CitationExportHistory[]; total: number }, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: '/citations/history',
        params: { limit, offset },
      }),
      providesTags: ['CitationExport'],
    }),

    // Discussion endpoints
    createDiscussionThread: builder.mutation<DiscussionThread, CreateDiscussionRequest>({
      query: (data) => ({
        url: '/discussions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DiscussionThread'],
    }),

    getDiscussionThreads: builder.query<{ threads: DiscussionThread[]; total: number }, {
      paperId?: string;
      collectionId?: string;
      workspaceId?: string;
      isResolved?: boolean;
      isPinned?: boolean;
      tags?: string[];
      limit?: number;
      offset?: number;
    }>({
      query: (params) => ({
        url: '/discussions',
        params,
      }),
      providesTags: ['DiscussionThread'],
    }),

    getDiscussionThread: builder.query<DiscussionThread, string>({
      query: (threadId) => ({
        url: `/discussions/${threadId}`,
      }),
      providesTags: (result, error, threadId) => [
        { type: 'DiscussionThread', id: threadId },
        'DiscussionMessage',
      ],
    }),

    updateDiscussionThread: builder.mutation<DiscussionThread, { threadId: string; data: Partial<CreateDiscussionRequest> & { isResolved?: boolean; isPinned?: boolean } }>({
      query: ({ threadId, data }) => ({
        url: `/discussions/${threadId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { threadId }) => [
        { type: 'DiscussionThread', id: threadId },
        'DiscussionThread',
      ],
    }),

    deleteDiscussionThread: builder.mutation<void, string>({
      query: (threadId) => ({
        url: `/discussions/${threadId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DiscussionThread'],
    }),

    addDiscussionMessage: builder.mutation<DiscussionMessage, CreateMessageRequest>({
      query: (data) => ({
        url: '/discussions/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { threadId }) => [
        { type: 'DiscussionThread', id: threadId },
        'DiscussionMessage',
      ],
    }),

    updateDiscussionMessage: builder.mutation<DiscussionMessage, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({
        url: `/discussions/messages/${messageId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['DiscussionMessage'],
    }),

    deleteDiscussionMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/discussions/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DiscussionMessage'],
    }),

    // Activity Log endpoints
    getActivityLog: builder.query<{ entries: ActivityLogEntry[]; total: number }, ActivityLogFilters>({
      query: (filters) => ({
        url: '/activity-log',
        params: filters,
      }),
      providesTags: ['ActivityLog'],
    }),

    getActivitySummary: builder.query<{
      totalActivities: number;
      activitiesByType: { [key: string]: number };
      activitiesBySeverity: { [key: string]: number };
      recentActivities: ActivityLogEntry[];
      trends: { [key: string]: number };
    }, { workspaceId?: string; days?: number }>({
      query: ({ workspaceId, days = 7 } = {}) => ({
        url: '/activity-log/summary',
        params: { workspaceId, days },
      }),
      providesTags: ['ActivityLog'],
    }),

    getEntityActivity: builder.query<ActivityLogEntry[], { entity: string; entityId: string }>({
      query: ({ entity, entityId }) => ({
        url: `/activity-log/entity/${entity}/${entityId}`,
      }),
      providesTags: (result, error, { entity, entityId }) => [
        { type: 'ActivityLog', id: `${entity}-${entityId}` },
      ],
    }),

    exportActivityLog: builder.query<{ content: string; filename: string }, ActivityLogFilters & { format?: 'json' | 'csv' }>({
      query: (filters) => ({
        url: '/activity-log/export',
        params: filters,
      }),
    }),
  }),
});

export const {
  // Citation Export hooks
  useExportCitationsMutation,
  useGetCitationExportHistoryQuery,
  
  // Discussion hooks
  useCreateDiscussionThreadMutation,
  useGetDiscussionThreadsQuery,
  useGetDiscussionThreadQuery,
  useUpdateDiscussionThreadMutation,
  useDeleteDiscussionThreadMutation,
  useAddDiscussionMessageMutation,
  useUpdateDiscussionMessageMutation,
  useDeleteDiscussionMessageMutation,
  
  // Activity Log hooks
  useGetActivityLogQuery,
  useGetActivitySummaryQuery,
  useGetEntityActivityQuery,
  useLazyExportActivityLogQuery,
} = phase2Api;
