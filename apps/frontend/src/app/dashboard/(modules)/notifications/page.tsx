"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AppNotification,
  NotificationType,
  useDeleteBulkNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useToggleStarredMutation,
} from "@/redux/api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Archive,
  AtSign,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  MessageCircle,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  UserPlus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "MENTION": return AtSign;
    case "COMMENT": return MessageCircle;
    case "SHARE": return Share2;
    case "INVITE": return UserPlus;
    case "PAPER": return FileText;
    case "COLLECTION": return Archive;
    case "ACHIEVEMENT": return Star;
    case "SYSTEM": return AlertCircle;
    default: return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "MENTION": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "COMMENT": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "SHARE": return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    case "INVITE": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    case "PAPER": return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400";
    case "COLLECTION": return "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400";
    case "ACHIEVEMENT": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "SYSTEM": return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
};

const groupNotificationsByDate = (notifications: AppNotification[]) => {
  const groups: { [key: string]: AppNotification[] } = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    let groupKey: string;
    if (diffDays === 0) groupKey = "Today";
    else if (diffDays === 1) groupKey = "Yesterday";
    else if (diffDays < 7) groupKey = "This Week";
    else if (diffDays < 30) groupKey = "This Month";
    else groupKey = "Older";

    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(notification);
  });

  return groups;
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<NotificationType | "ALL">("ALL");
  const [filterRead, setFilterRead] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const { data: noData, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    limit: 50,
    type: filterType === "ALL" ? undefined : filterType,
    read: filterRead === "ALL" ? undefined : filterRead.toLowerCase(),
  });
  const notifications = noData?.data || [];
  
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.data?.count || 0;

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [toggleStarred] = useToggleStarredMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteBulk] = useDeleteBulkNotificationsMutation();

  const filteredNotifications = notifications.filter((notification) => {
    if (!searchQuery) return true;
    return (
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    // Redux API doesn't have a bulk mark as read endpoint natively, 
    // so we'd loop or just call markAllAsRead if everything is selected.
    await Promise.all(selectedIds.map((id) => markAsRead(id)));
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await deleteBulk(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-12 min-h-screen">
      {/* Header */}
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
            <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
            <p className="text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
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
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={isMuted ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" : ""}
            title={isMuted ? "Unmute" : "Mute notifications"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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

      {/* Filters & Search */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-[140px] justify-between">
                <span className="truncate">
                  {filterType === "ALL" ? "All Types" : filterType}
                </span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setFilterType("ALL")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("MENTION")}>Mentions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("COMMENT")}>Comments</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("SHARE")}>Shares</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("INVITE")}>Invitations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("PAPER")}>Papers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("COLLECTION")}>Collections</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("SYSTEM")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex p-1 bg-muted rounded-md space-x-1">
            {["ALL", "UNREAD", "READ"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterRead(status as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  filterRead === status
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
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
                checked={selectedIds.length === filteredNotifications.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={handleBulkMarkAsRead} className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50">
                <Check className="w-4 h-4 mr-2" />
                Mark as read
              </Button>
              <Button size="sm" variant="ghost" onClick={handleBulkDelete} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100/50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 h-24 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : Object.keys(groupedNotifications).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1 hover:text-foreground transition-colors">
                {group}
              </h3>
              <div className="bg-card rounded-xl border shadow-sm divide-y">
                {items.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 flex items-start gap-4 transition-colors hover:bg-muted/50 ${
                        !notification.read ? "bg-blue-50/20 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(notification.id)}
                        onChange={() => handleSelect(notification.id)}
                        className="mt-1.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            if (!notification.read) markAsRead(notification.id);
                            // Real app would route to notification.actionUrl if exists
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-base font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block ml-2 w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                            {notification.message}
                          </p>
                          
                          {notification.actor && (
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary" className="font-normal text-xs bg-muted/50 hover:bg-muted">
                                {notification.actor.name}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStarred(notification.id)}
                          className={`h-8 w-8 hover:bg-yellow-50 hover:text-yellow-600 ${notification.starred ? "text-yellow-500" : "text-muted-foreground"}`}
                          title={notification.starred ? "Unstar" : "Star"}
                        >
                          <Star className={`w-4 h-4 ${notification.starred ? "fill-yellow-500" : ""}`} />
                        </Button>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-muted-foreground"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-muted-foreground"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BellOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery || filterType !== "ALL" || filterRead !== "ALL"
              ? "We couldn't find any notifications matching your filters."
              : "You're all caught up! When you receive notifications, they will appear here."}
          </p>
          {(searchQuery || filterType !== "ALL" || filterRead !== "ALL") && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setFilterType("ALL");
                setFilterRead("ALL");
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
