"use client";

import {
  Archive,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  FileText,
  Filter,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface NotificationsPageProps {
  onNavigate?: (path: string) => void;
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
}

type NotificationType =
  | "paper_shared"
  | "collection_invite"
  | "workspace_invite"
  | "comment"
  | "mention"
  | "system"
  | "team_update";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actor?: {
    name: string;
    image?: string;
  };
  metadata?: {
    paperId?: string;
    collectionId?: string;
    workspaceId?: string;
  };
}

// ============================================================================
// Default User
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

// ============================================================================
// Sample Data
// ============================================================================
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "paper_shared",
    title: "Paper Shared",
    message: "Dr. Sarah Chen shared 'Deep Learning in NLP' with you",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    archived: false,
    actionUrl: "/papers/123",
    actor: { name: "Dr. Sarah Chen" },
    metadata: { paperId: "123" },
  },
  {
    id: "2",
    type: "collection_invite",
    title: "Collection Invitation",
    message: "You've been invited to join 'ML Research Papers' collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    archived: false,
    actionUrl: "/collections/456",
    actor: { name: "Prof. Michael Lee" },
    metadata: { collectionId: "456" },
  },
  {
    id: "3",
    type: "workspace_invite",
    title: "Workspace Invitation",
    message: "Join 'AI Research Lab' workspace as a Pro Researcher",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    archived: false,
    actionUrl: "/workspaces/789",
    actor: { name: "Dr. Emily Watson" },
    metadata: { workspaceId: "789" },
  },
  {
    id: "4",
    type: "comment",
    title: "New Comment",
    message:
      "James Wilson commented on your annotation in 'Transformer Architecture'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    archived: false,
    actionUrl: "/papers/234/annotations",
    actor: { name: "James Wilson" },
  },
  {
    id: "5",
    type: "mention",
    title: "You were mentioned",
    message: "Dr. Amanda Lee mentioned you in a discussion thread",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: true,
    archived: false,
    actionUrl: "/discussions/567",
    actor: { name: "Dr. Amanda Lee" },
  },
  {
    id: "6",
    type: "system",
    title: "Paper Processing Complete",
    message:
      "Your paper 'Advanced NLP Techniques' has been processed successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
    archived: false,
    actionUrl: "/papers/890",
  },
  {
    id: "7",
    type: "team_update",
    title: "Team Update",
    message: "New team member Robert Brown joined your workspace",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    archived: false,
    actionUrl: "/workspaces/789/members",
    actor: { name: "Robert Brown" },
  },
  {
    id: "8",
    type: "system",
    title: "Weekly Digest Available",
    message: "Your weekly research activity digest is ready to view",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    archived: false,
    actionUrl: "/analytics/weekly",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "paper_shared":
      return FileText;
    case "collection_invite":
      return Share2;
    case "workspace_invite":
      return UserPlus;
    case "comment":
      return MessageSquare;
    case "mention":
      return Users;
    case "team_update":
      return Users;
    case "system":
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "paper_shared":
      return "bg-blue-500/10 text-blue-500";
    case "collection_invite":
      return "bg-purple-500/10 text-purple-500";
    case "workspace_invite":
      return "bg-green-500/10 text-green-500";
    case "comment":
      return "bg-orange-500/10 text-orange-500";
    case "mention":
      return "bg-pink-500/10 text-pink-500";
    case "team_update":
      return "bg-cyan-500/10 text-cyan-500";
    case "system":
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

// ============================================================================
// Notifications Page Component
// ============================================================================
export function NotificationsPage({
  onNavigate,
  role,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create user with the correct role
  const user = {
    ...defaultUser,
    role: role || defaultUser.role,
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.read) return false;
    if (filter === "archived" && !notification.archived) return false;
    if (filter === "all" && notification.archived) return false;

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.actor?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/notifications"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Stay updated with your research activities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("/notifications/center")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Center
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("/notifications/history")}
            >
              <Archive className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("/notifications/settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border bg-background p-1">
              {(["all", "unread", "archived"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-background text-sm hover:bg-muted transition-colors">
              <Filter className="h-4 w-4" />
              <span>
                {typeFilter === "all"
                  ? "All Types"
                  : typeFilter.replace("_", " ")}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border bg-card p-12 text-center"
            >
              <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications to display"}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) handleMarkAsRead(notification.id);
                    if (notification.actionUrl)
                      onNavigate?.(notification.actionUrl);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4
                            className={`font-medium ${
                              !notification.read
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          <div className="relative group">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {/* Dropdown menu would go here */}
                          </div>
                        </div>
                      </div>

                      {/* Actor */}
                      {notification.actor && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {notification.actor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {notification.actor.name}
                          </span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(notification.id);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Archive className="h-3 w-3" />
                          Archive
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Notification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {notifications.filter((n) => !n.read && !n.archived).length}
            </p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {notifications.filter((n) => n.read && !n.archived).length}
            </p>
            <p className="text-sm text-muted-foreground">Read</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">
              {notifications.filter((n) => n.archived).length}
            </p>
            <p className="text-sm text-muted-foreground">Archived</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {notifications.length}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </motion.div>

        {/* Notification Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize how and when you receive notifications in your{" "}
                <button
                  onClick={() => onNavigate?.("/notifications/settings")}
                  className="text-primary hover:underline"
                >
                  notification settings
                </button>
                . You can choose to receive email digests, push notifications,
                or in-app alerts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
