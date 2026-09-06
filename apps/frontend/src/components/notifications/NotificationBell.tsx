"use client";

/**
 * NotificationBell
 *
 * Top-bar notification bell with real-time unread count and a popover
 * showing the most recent notifications. Backed by the notificationApi
 * and refreshed automatically via the SSE stream.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  type AppNotification,
} from "@/redux/api/notificationApi";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";

const TYPE_ICON: Record<string, string> = {
  MENTION: "💬",
  COMMENT: "💭",
  SHARE: "🔗",
  INVITE: "✉️",
  PAPER: "📄",
  COLLECTION: "📁",
  ACHIEVEMENT: "⭐",
  SYSTEM: "⚙️",
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: countData } = useGetUnreadCountQuery();
  const { data: listData, refetch } = useGetNotificationsQuery({ limit: 8 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unread = countData?.data?.count ?? 0;
  const recent = (listData?.data ?? []).slice(0, 8);

  // Real-time SSE
  useNotificationStream();

  // Close popover on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen]);

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      showSuccessToast("Done", "All notifications marked as read");
      refetch();
    } catch {
      showErrorToast("Failed", "Could not mark all as read");
    }
  };

  const handleItemClick = async (n: AppNotification) => {
    if (!n.read) {
      try {
        await markAsRead(n.id).unwrap();
      } catch {
        // ignore
      }
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-xl border shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAll}
                    className="text-xs h-7"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/dashboard/notifications/settings">
                    <SettingsIcon className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  You're all caught up
                </div>
              ) : (
                <div className="divide-y">
                  {recent.map((n) => (
                    <Link
                      key={n.id}
                      href={n.actionUrl ?? "/dashboard/notifications/center"}
                      onClick={() => handleItemClick(n)}
                      className={`block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        !n.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl flex-shrink-0">
                          {TYPE_ICON[n.type] ?? "🔔"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium truncate ${
                                !n.read ? "" : "text-muted-foreground"
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t bg-slate-50 dark:bg-slate-900/50">
              <Link
                href="/dashboard/notifications/center"
                onClick={() => setIsOpen(false)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
              >
                View all notifications
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
