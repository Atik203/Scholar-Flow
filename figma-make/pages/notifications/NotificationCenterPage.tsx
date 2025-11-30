"use client";

/**
 * NotificationCenterPage - Real-time Notification Center
 *
 * Comprehensive notification center with real-time updates,
 * filtering, categorization, and bulk actions.
 *
 * Features:
 * - Real-time notification feed
 * - Category filtering (mentions, comments, shares, etc.)
 * - Read/unread status with badges
 * - Bulk mark as read/delete
 * - Notification grouping by date
 * - Quick action buttons
 * - Mobile-responsive design
 */

import {
  AlertCircle,
  Archive,
  AtSign,
  Bell,
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
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface NotificationCenterPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type NotificationType =
  | "mention"
  | "comment"
  | "share"
  | "invite"
  | "paper"
  | "collection"
  | "system"
  | "achievement";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: {
    name: string;
    avatar?: string;
  };
  resource?: {
    type: string;
    name: string;
    id: string;
  };
  read: boolean;
  starred: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "You were mentioned",
    message: "@you Check out this paper on machine learning techniques",
    actor: { name: "Dr. Sarah Chen" },
    resource: { type: "paper", name: "Deep Learning Survey", id: "paper-1" },
    read: false,
    starred: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    actionUrl: "/papers/paper-1",
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your paper",
    message: "Great analysis! Have you considered using transformers?",
    actor: { name: "Prof. James Wilson" },
    resource: { type: "paper", name: "NLP Research", id: "paper-2" },
    read: false,
    starred: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    actionUrl: "/papers/paper-2#comments",
  },
  {
    id: "3",
    type: "share",
    title: "Collection shared with you",
    message: "Emily shared 'Machine Learning Papers' collection with you",
    actor: { name: "Emily Rodriguez" },
    resource: {
      type: "collection",
      name: "Machine Learning Papers",
      id: "col-1",
    },
    read: false,
    starred: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: "/collections/col-1",
  },
  {
    id: "4",
    type: "invite",
    title: "Workspace invitation",
    message: "You've been invited to join 'AI Research Lab' workspace",
    actor: { name: "Michael Park" },
    resource: { type: "workspace", name: "AI Research Lab", id: "ws-1" },
    read: true,
    starred: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    actionUrl: "/workspaces/ws-1",
  },
  {
    id: "5",
    type: "paper",
    title: "Paper upload complete",
    message: "Your paper 'Quantum Computing Basics' has been processed",
    resource: {
      type: "paper",
      name: "Quantum Computing Basics",
      id: "paper-3",
    },
    read: true,
    starred: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    actionUrl: "/papers/paper-3",
  },
  {
    id: "6",
    type: "achievement",
    title: "Achievement unlocked!",
    message: "You've uploaded 50 papers. Keep up the great work!",
    read: true,
    starred: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "7",
    type: "system",
    title: "System update",
    message:
      "ScholarFlow has been updated with new features. Check out what's new!",
    read: true,
    starred: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    actionUrl: "/changelog",
  },
  {
    id: "8",
    type: "collection",
    title: "Collection update",
    message: "3 new papers were added to 'Neural Networks' collection",
    resource: { type: "collection", name: "Neural Networks", id: "col-2" },
    read: true,
    starred: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    actionUrl: "/collections/col-2",
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "mention":
      return AtSign;
    case "comment":
      return MessageCircle;
    case "share":
      return Share2;
    case "invite":
      return UserPlus;
    case "paper":
      return FileText;
    case "collection":
      return Archive;
    case "achievement":
      return Star;
    case "system":
      return AlertCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "mention":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "comment":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "share":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    case "invite":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    case "paper":
      return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400";
    case "collection":
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400";
    case "achievement":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
    case "system":
      return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    let groupKey: string;
    if (diffDays === 0) {
      groupKey = "Today";
    } else if (diffDays === 1) {
      groupKey = "Yesterday";
    } else if (diffDays < 7) {
      groupKey = "This Week";
    } else if (diffDays < 30) {
      groupKey = "This Month";
    } else {
      groupKey = "Older";
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });

  return groups;
};

export function NotificationCenterPage({
  onNavigate,
  role: propRole,
}: NotificationCenterPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">(
    "all"
  );
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && !notification.read) ||
      (filterRead === "read" && notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleBulkMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const defaultUser = {
    name: "Alex Johnson",
    email: "alex@university.edu",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Notification Center
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg transition-colors ${
                    isMuted
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                  title={
                    isMuted ? "Unmute notifications" : "Mute notifications"
                  }
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => onNavigate("/notifications/settings")}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Notification Settings"
                >
                  <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showFilterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50 p-4"
                      >
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Type
                          </label>
                          <select
                            value={filterType}
                            onChange={(e) =>
                              setFilterType(e.target.value as typeof filterType)
                            }
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="all">All types</option>
                            <option value="mention">Mentions</option>
                            <option value="comment">Comments</option>
                            <option value="share">Shares</option>
                            <option value="invite">Invitations</option>
                            <option value="paper">Papers</option>
                            <option value="collection">Collections</option>
                            <option value="achievement">Achievements</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Status
                          </label>
                          <div className="flex gap-2">
                            {["all", "unread", "read"].map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  setFilterRead(status as typeof filterRead)
                                }
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  filterRead === status
                                    ? "bg-blue-500 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedNotifications.length ===
                      filteredNotifications.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedNotifications.length} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark as read
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          {Object.keys(groupedNotifications).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([group, items]) => (
                <div key={group}>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-4">
                    {group}
                  </h3>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                    {items.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(
                        notification.type
                      );

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !notification.read
                              ? "bg-blue-50/50 dark:bg-blue-900/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(
                                notification.id
                              )}
                              onChange={() =>
                                handleSelectNotification(notification.id)
                              }
                              className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                            />
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => {
                                handleMarkAsRead(notification.id);
                                if (notification.actionUrl) {
                                  onNavigate(notification.actionUrl);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-medium ${
                                    notification.read
                                      ? "text-slate-700 dark:text-slate-300"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                {notification.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                {notification.actor && (
                                  <span className="text-xs text-slate-500 dark:text-slate-500">
                                    {notification.actor.name}
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleToggleStar(notification.id)
                                }
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title={notification.starred ? "Unstar" : "Star"}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    notification.starred
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-slate-400"
                                  }`}
                                />
                              </button>
                              {!notification.read && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Mark as read"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery || filterType !== "all" || filterRead !== "all"
                  ? "No notifications match your filters"
                  : "You're all caught up!"}
              </p>
            </motion.div>
          )}

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                Load more notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
