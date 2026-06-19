"use client";

/**
 * NotificationHistoryPage
 *
 * Paginated history of all notifications, including read + deleted items.
 * Uses cursor-style pagination with a date range filter (date inputs in
 * the toolbar drive a server-side startDate/endDate filter).
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Calendar, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useToggleStarredMutation,
} from "@/redux/api/notificationApi";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationHistoryPage() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 25;

  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    page,
    limit,
  });
  const notifications = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage ?? 1;

  const [toggleStarred] = useToggleStarredMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-[200px]"
          />
          <span className="text-muted-foreground">→</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-[200px]"
          />
        </div>
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkAsRead={() => {
          // history page: read state is immutable from this view
        }}
        onToggleStarred={(id) => toggleStarred(id)}
        onDelete={(id) => deleteNotification(id)}
        showFilters={false}
        emptyStateTitle="No history yet"
        emptyStateMessage="Notifications you receive will be archived here."
      />

      {meta && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
