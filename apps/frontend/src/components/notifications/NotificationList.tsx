"use client";

/**
 * NotificationList
 *
 * Shared list rendering used by NotificationCenterPage and NotificationHistoryPage.
 * Receives data + handlers from the parent so it can be embedded in different
 * page layouts without coupling to RTK Query directly.
 */

import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Archive,
  AtSign,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Eye,
  FileText,
  MessageCircle,
  Search,
  Share2,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { AppNotification, NotificationType } from "@/redux/api/notificationApi";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  MENTION: AtSign,
  COMMENT: MessageCircle,
  SHARE: Share2,
  INVITE: UserPlus,
  PAPER: FileText,
  COLLECTION: Archive,
  ACHIEVEMENT: Star,
  SYSTEM: AlertCircle,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  MENTION:
    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  COMMENT:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  SHARE:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  INVITE:
    "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  PAPER:
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  COLLECTION:
    "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  ACHIEVEMENT:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  SYSTEM:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export type ReadFilter = "ALL" | "UNREAD" | "READ";

export function groupByDate(notifications: AppNotification[]) {
  const groups: Record<string, AppNotification[]> = {};
  for (const n of notifications) {
    const date = new Date(n.createdAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    let groupKey: string;
    if (diffDays === 0) groupKey = "Today";
    else if (diffDays === 1) groupKey = "Yesterday";
    else if (diffDays < 7) groupKey = "This Week";
    else if (diffDays < 30) groupKey = "This Month";
    else groupKey = "Older";

    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(n);
  }
  return groups;
}

export interface NotificationListProps {
  notifications: AppNotification[];
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onToggleStarred?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBulkMarkAsRead?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
  showFilters?: boolean;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export function NotificationList({
  notifications,
  isLoading,
  onMarkAsRead,
  onToggleStarred,
  onDelete,
  onBulkMarkAsRead,
  onBulkDelete,
  showFilters = true,
  emptyStateTitle = "No notifications",
  emptyStateMessage = "You're all caught up! When you receive notifications, they will appear here.",
}: NotificationListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "ALL">(
    "ALL"
  );
  const [readFilter, setReadFilter] = useState<ReadFilter>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = notifications.filter((n) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !n.title.toLowerCase().includes(q) &&
        !n.message.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (typeFilter !== "ALL" && n.type !== typeFilter) return false;
    if (readFilter === "UNREAD" && n.read) return false;
    if (readFilter === "READ" && !n.read) return false;
    return true;
  });

  const grouped = groupByDate(filtered);

  const handleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((n) => n.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 h-24 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 w-[140px] justify-between"
              >
                <span className="truncate">
                  {typeFilter === "ALL" ? "All Types" : typeFilter}
                </span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {(
                [
                  "ALL",
                  "MENTION",
                  "COMMENT",
                  "SHARE",
                  "INVITE",
                  "PAPER",
                  "COLLECTION",
                  "SYSTEM",
                ] as const
              ).map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => setTypeFilter(t as NotificationType | "ALL")}
                >
                  {t === "ALL" ? "All Types" : t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex p-1 bg-muted rounded-md space-x-1">
            {(["ALL", "UNREAD", "READ"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setReadFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  readFilter === s
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </Card>
      )}

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.length === filtered.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onBulkMarkAsRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onBulkMarkAsRead(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as read
                </Button>
              )}
              {onBulkDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onBulkDelete(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {Object.keys(grouped).length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
          <p className="text-muted-foreground max-w-sm">
            {emptyStateMessage}
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
                {group}
              </h3>
              <div className="bg-card rounded-xl border shadow-sm divide-y">
                {items.map((n) => {
                  const Icon = TYPE_ICON[n.type] ?? Bell;
                  const colorClass = TYPE_COLOR[n.type] ?? TYPE_COLOR.SYSTEM;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 flex items-start gap-4 transition-colors hover:bg-muted/50 ${
                        !n.read
                          ? "bg-blue-50/20 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(n.id)}
                        onChange={() => handleSelect(n.id)}
                        className="mt-1.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            !n.read && onMarkAsRead?.(n.id)
                          }
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`text-base font-semibold ${
                                !n.read
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {n.title}
                              {!n.read && (
                                <span className="inline-block ml-2 w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDistanceToNow(new Date(n.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                            {n.message}
                          </p>
                          {n.actor && (
                            <div className="flex items-center gap-2 mt-3">
                              <Badge
                                variant="secondary"
                                className="font-normal text-xs bg-muted/50 hover:bg-muted"
                              >
                                {n.actor.name}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {onToggleStarred && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleStarred(n.id)}
                            className={`h-8 w-8 hover:bg-yellow-50 hover:text-yellow-600 ${
                              n.starred
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                            title={n.starred ? "Unstar" : "Star"}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                n.starred ? "fill-yellow-500" : ""
                              }`}
                            />
                          </Button>
                        )}
                        {!n.read && onMarkAsRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onMarkAsRead(n.id)}
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-muted-foreground"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(n.id)}
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-muted-foreground"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationList;
