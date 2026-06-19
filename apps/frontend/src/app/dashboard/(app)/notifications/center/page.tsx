"use client";

/**
 * NotificationCenterPage
 *
 * Real-time notification feed. Uses the NotificationList component
 * and subscribes to the SSE stream via useNotificationStream.
 */

import {
  Bell,
  BellOff,
  CheckCheck,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useDeleteBulkNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useToggleStarredMutation,
} from "@/redux/api/notificationApi";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useNotificationStream } from "@/hooks/useNotificationStream";

export default function NotificationCenterPage() {
  const [isMuted, setIsMuted] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    limit: 50,
  });
  const notifications = data?.data ?? [];

  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.data?.count ?? 0;

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [toggleStarred] = useToggleStarredMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteBulk] = useDeleteBulkNotificationsMutation();

  // Real-time SSE: invalidates cache and shows toast on new event
  useNotificationStream();

  return (
    <div className="space-y-6 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Bell className="w-6 h-6 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Notification Center
            </h1>
            <p className="text-muted-foreground">
              {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={
              isMuted
                ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                : ""
            }
            title={isMuted ? "Unmute" : "Mute notifications"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/notifications/settings">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
          {unreadCount > 0 && (
            <Button onClick={() => markAllAsRead()} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkAsRead={(id) => markAsRead(id)}
        onToggleStarred={(id) => toggleStarred(id)}
        onDelete={(id) => deleteNotification(id)}
        onBulkMarkAsRead={async (ids) => {
          await Promise.all(ids.map((id) => markAsRead(id)));
        }}
        onBulkDelete={(ids) => deleteBulk(ids)}
        emptyStateTitle={isMuted ? "Muted" : "All caught up"}
        emptyStateMessage={
          isMuted
            ? "You have muted notifications. Unmute to receive alerts."
            : "You're all caught up! When you receive notifications, they will appear here."
        }
      />
    </div>
  );
}
