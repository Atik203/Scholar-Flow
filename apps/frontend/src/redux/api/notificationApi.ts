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
    total: number;
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
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
  .injectEndpoints({
    endpoints: (builder) => ({
      getNotifications: builder.query<
        GetNotificationsResponse,
        { cursor?: string; limit?: number; type?: string; read?: string; starred?: string }
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
        async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
          // Optimistic: the bell/count update instantly, then the server
          // refetch from invalidatesTags reconciles.
          const patches: Array<{ undo: () => void }> = [];
          let wasUnread = false;
          for (const arg of notificationApi.util.selectCachedArgsForQuery(
            getState(),
            "getNotifications"
          )) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getNotifications",
                  arg,
                  (draft) => {
                    if (!draft?.data) return;
                    if (arg?.read === "unread") {
                      draft.data = draft.data.filter((n) => n.id !== id);
                      return;
                    }
                    const item = draft.data.find((n) => n.id === id);
                    if (item && !item.read) {
                      wasUnread = true;
                      item.read = true;
                    }
                  }
                )
              )
            );
          }
          if (wasUnread) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getUnreadCount",
                  undefined,
                  (draft) => {
                    if (draft?.data && draft.data.count > 0) {
                      draft.data.count -= 1;
                    }
                  }
                )
              )
            );
          }
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
        invalidatesTags: (result, error, id) => [
          { type: "Notification", id },
          { type: "Notification", id: "LIST" },
          { type: "Notification", id: "UNREAD_COUNT" },
        ],
      }),

      markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
        query: () => ({
          url: "/notifications/read-all",
          method: "PUT",
        }),
        async onQueryStarted(_arg, { dispatch, getState, queryFulfilled }) {
          const patches: Array<{ undo: () => void }> = [];
          patches.push(
            dispatch(
              notificationApi.util.updateQueryData(
                "getUnreadCount",
                undefined,
                (draft) => {
                  if (draft?.data) draft.data.count = 0;
                }
              )
            )
          );
          for (const arg of notificationApi.util.selectCachedArgsForQuery(
            getState(),
            "getNotifications"
          )) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getNotifications",
                  arg,
                  (draft) => {
                    if (!draft?.data) return;
                    if (arg?.read === "unread") {
                      draft.data = [];
                      return;
                    }
                    draft.data.forEach((n) => {
                      n.read = true;
                    });
                  }
                )
              )
            );
          }
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
        invalidatesTags: ["Notification"],
      }),

      toggleStarred: builder.mutation<BaseNotificationResponse, string>({
        query: (id) => ({
          url: `/notifications/${id}/star`,
          method: "PUT",
        }),
        async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
          const patches: Array<{ undo: () => void }> = [];
          for (const arg of notificationApi.util.selectCachedArgsForQuery(
            getState(),
            "getNotifications"
          )) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getNotifications",
                  arg,
                  (draft) => {
                    if (!draft?.data) return;
                    const item = draft.data.find((n) => n.id === id);
                    if (!item) return;
                    if (arg?.starred === "true" && item.starred) {
                      draft.data = draft.data.filter((n) => n.id !== id);
                      return;
                    }
                    item.starred = !item.starred;
                  }
                )
              )
            );
          }
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
        invalidatesTags: (result, error, id) => [
          { type: "Notification", id },
          { type: "Notification", id: "LIST" },
        ],
      }),

      deleteNotification: builder.mutation<{ success: boolean; message: string }, string>({
        query: (id) => ({
          url: `/notifications/${id}`,
          method: "DELETE",
        }),
        async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
          const patches: Array<{ undo: () => void }> = [];
          let removedUnread = false;
          for (const arg of notificationApi.util.selectCachedArgsForQuery(
            getState(),
            "getNotifications"
          )) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getNotifications",
                  arg,
                  (draft) => {
                    if (!draft?.data) return;
                    const item = draft.data.find((n) => n.id === id);
                    if (item && !item.read) removedUnread = true;
                    draft.data = draft.data.filter((n) => n.id !== id);
                  }
                )
              )
            );
          }
          if (removedUnread) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getUnreadCount",
                  undefined,
                  (draft) => {
                    if (draft?.data && draft.data.count > 0) {
                      draft.data.count -= 1;
                    }
                  }
                )
              )
            );
          }
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
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
        async onQueryStarted(ids, { dispatch, getState, queryFulfilled }) {
          const idSet = new Set(ids);
          const patches: Array<{ undo: () => void }> = [];
          let removedUnread = 0;
          for (const arg of notificationApi.util.selectCachedArgsForQuery(
            getState(),
            "getNotifications"
          )) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getNotifications",
                  arg,
                  (draft) => {
                    if (!draft?.data) return;
                    removedUnread += draft.data.filter(
                      (n) => idSet.has(n.id) && !n.read
                    ).length;
                    draft.data = draft.data.filter((n) => !idSet.has(n.id));
                  }
                )
              )
            );
          }
          if (removedUnread > 0) {
            patches.push(
              dispatch(
                notificationApi.util.updateQueryData(
                  "getUnreadCount",
                  undefined,
                  (draft) => {
                    if (draft?.data) {
                      draft.data.count = Math.max(
                        0,
                        draft.data.count - removedUnread
                      );
                    }
                  }
                )
              )
            );
          }
          try {
            await queryFulfilled;
          } catch {
            patches.forEach((patch) => patch.undo());
          }
        },
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
