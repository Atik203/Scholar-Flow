import { apiSlice } from "./apiSlice";

export type NotificationType =
  | "MENTION"
  | "COMMENT"
  | "SHARE"
  | "INVITE"
  | "PAPER"
  | "COLLECTION"
  | "SYSTEM"
  | "ACHIEVEMENT";

export interface NotificationActor {
  name: string;
  image?: string;
  firstName?: string;
  lastName?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  starred: boolean;
  actionUrl?: string;
  actorId?: string;
  resourceId?: string;
  createdAt: string;
  actor?: NotificationActor;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: AppNotification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    skip: number;
  };
}

export interface GetUnreadCountResponse {
  success: boolean;
  message: string;
  data: { count: number };
}

export interface BaseNotificationResponse {
  success: boolean;
  message: string;
  data: AppNotification;
}

export const notificationApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Notification"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNotifications: builder.query<
        GetNotificationsResponse,
        { page?: number; limit?: number; type?: string; read?: string; starred?: string }
      >({
        query: (params) => ({
          url: "/notifications",
          params,
        }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map(({ id }) => ({ type: "Notification" as const, id })),
                { type: "Notification", id: "LIST" },
              ]
            : [{ type: "Notification", id: "LIST" }],
      }),

      getUnreadCount: builder.query<GetUnreadCountResponse, void>({
        query: () => "/notifications/unread-count",
        providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
      }),

      markAsRead: builder.mutation<BaseNotificationResponse, string>({
        query: (id) => ({
          url: `/notifications/${id}/read`,
          method: "PUT",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Notification", id },
          { type: "Notification", id: "UNREAD_COUNT" },
        ],
      }),

      markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
        query: () => ({
          url: "/notifications/read-all",
          method: "PUT",
        }),
        invalidatesTags: ["Notification"],
      }),

      toggleStarred: builder.mutation<BaseNotificationResponse, string>({
        query: (id) => ({
          url: `/notifications/${id}/star`,
          method: "PUT",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Notification", id },
        ],
      }),

      deleteNotification: builder.mutation<{ success: boolean; message: string }, string>({
        query: (id) => ({
          url: `/notifications/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Notification", id },
          { type: "Notification", id: "LIST" },
          { type: "Notification", id: "UNREAD_COUNT" },
        ],
      }),

      deleteBulkNotifications: builder.mutation<{ success: boolean; message: string }, string[]>({
        query: (ids) => ({
          url: "/notifications/bulk",
          method: "DELETE",
          body: { ids },
        }),
        invalidatesTags: ["Notification"],
      }),
    }),
  });

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useToggleStarredMutation,
  useDeleteNotificationMutation,
  useDeleteBulkNotificationsMutation,
} = notificationApi;
