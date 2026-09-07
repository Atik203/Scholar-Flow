"use client";

/**
 * NotificationHistoryPage
 *
 * Cursor-paginated history of all notifications. The backend list is
 * cursor-based (nextCursor/hasMore); we keep a stack of cursors to
 * support Previous/Next navigation.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useToggleStarredMutation,
} from "@/redux/api/notificationApi";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationHistoryPage() {
  // Stack of cursors: [page1Cursor, page2Cursor, ...]; cursor of the
  // current page is the last item. Empty string = first page.
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const limit = 25;
  const currentCursor = cursorStack[cursorStack.length - 1] ?? "";

  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    cursor: currentCursor || undefined,
    limit,
  });
  const notifications = data?.data ?? [];
  const meta = data?.meta;
  const hasMore = Boolean(meta?.hasMore);
  const nextCursor = meta?.nextCursor;

  const [toggleStarred] = useToggleStarredMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const goNext = () => {
    if (nextCursor) {
      setCursorStack((prev) => [...prev, nextCursor]);
    }
  };

  const goPrev = () => {
    setCursorStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className="space-y-6 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">History</h1>
            <p className="text-muted-foreground">
              {meta?.total ?? 0} total notifications
            </p>
          </div>
        </div>
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
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onToggleStarred={(id) => toggleStarred(id)}
        onDelete={(id) => deleteNotification(id)}
        showFilters={false}
        emptyStateTitle="No history yet"
        emptyStateMessage="Notifications you receive will be archived here."
      />

      {(cursorStack.length > 0 || hasMore) && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={cursorStack.length === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {cursorStack.length + 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={!hasMore}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
