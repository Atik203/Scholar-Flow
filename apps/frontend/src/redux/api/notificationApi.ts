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

export type NotificationCategory =
  | "PAPERS"
  | "DISCUSSIONS"
  | "COLLECTIONS"
  | "WORKSPACE"
  | "TEAM"
  | "BILLING"
  | "SECURITY"
  | "ACHIEVEMENT"
  | "SYSTEM";

export interface CategoryChannelSetting {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationPreferences {
  channels: { inApp: boolean; email: boolean; push: boolean };
  categories: Record<NotificationCategory, CategoryChannelSetting>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  digestFrequency: "instant" | "daily" | "weekly";
  muteAll: boolean;
}

export const notificationApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Notification", "NotificationSettings"] })
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

      getNotificationSettings: builder.query<
        { success: boolean; message: string; data: NotificationPreferences },
        void
      >({
        query: () => "/notifications/settings",
        providesTags: [{ type: "NotificationSettings", id: "ME" }],
      }),

      updateNotificationSettings: builder.mutation<
        { success: boolean; message: string; data: NotificationPreferences },
        Partial<NotificationPreferences>
      >({
        query: (body) => ({
          url: "/notifications/settings",
          method: "PUT",
          body,
        }),
        invalidatesTags: [{ type: "NotificationSettings", id: "ME" }],
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
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationApi;
