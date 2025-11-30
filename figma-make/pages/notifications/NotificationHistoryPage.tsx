"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Archive,
  ArrowUpDown,
  Bell,
  BellOff,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Info,
  MessageSquare,
  MoreVertical,
  RefreshCw,
  Search,
  Share2,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface NotificationHistoryPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type NotificationType =
  | "paper"
  | "team"
  | "comment"
  | "share"
  | "system"
  | "mention";
type NotificationStatus = "read" | "unread" | "archived";

// Mock notification history data
const mockNotifications = [
  {
    id: "1",
    type: "paper" as NotificationType,
    title: "Paper Processed Successfully",
    message:
      "Your paper 'Machine Learning in Healthcare' has been processed and is ready for review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "unread" as NotificationStatus,
    starred: true,
    actionUrl: "/papers/1",
    actor: { name: "System", avatar: null },
  },
  {
    id: "2",
    type: "team" as NotificationType,
    title: "Team Invitation",
    message:
      "Dr. Sarah Chen invited you to join the 'AI Research Group' workspace.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "unread" as NotificationStatus,
    starred: false,
    actionUrl: "/team/invitations",
    actor: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    },
  },
  {
    id: "3",
    type: "comment" as NotificationType,
    title: "New Comment on Paper",
    message:
      "John Smith commented on 'Deep Learning Survey': 'Great analysis on transformer architectures!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: "read" as NotificationStatus,
    starred: false,
    actionUrl: "/papers/2/comments",
    actor: {
      name: "John Smith",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
    },
  },
  {
    id: "4",
    type: "share" as NotificationType,
    title: "Collection Shared",
    message:
      "Emily Johnson shared the collection 'Neural Network Papers' with you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "read" as NotificationStatus,
    starred: true,
    actionUrl: "/collections/3",
    actor: {
      name: "Emily Johnson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    },
  },
  {
    id: "5",
    type: "system" as NotificationType,
    title: "Storage Limit Warning",
    message:
      "You have used 85% of your storage quota. Consider upgrading your plan.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: "read" as NotificationStatus,
    starred: false,
    actionUrl: "/billing",
    actor: { name: "System", avatar: null },
  },
  {
    id: "6",
    type: "mention" as NotificationType,
    title: "Mentioned in Discussion",
    message:
      "Alex Rivera mentioned you in 'Weekly Research Sync': '@you what do you think about this approach?'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: "archived" as NotificationStatus,
    starred: false,
    actionUrl: "/discussions/4",
    actor: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    },
  },
  {
    id: "7",
    type: "paper" as NotificationType,
    title: "Citation Alert",
    message: "Your paper 'NLP Advances 2024' was cited in a new publication.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    status: "read" as NotificationStatus,
    starred: true,
    actionUrl: "/papers/5/citations",
    actor: { name: "Citation System", avatar: null },
  },
  {
    id: "8",
    type: "team" as NotificationType,
    title: "Member Left Workspace",
    message: "Michael Brown has left the 'ML Projects' workspace.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120),
    status: "archived" as NotificationStatus,
    starred: false,
    actionUrl: "/workspaces/2",
    actor: {
      name: "Michael Brown",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop",
    },
  },
];

// Mock summary stats
const mockStats = {
  total: 156,
  unread: 12,
  starred: 8,
  archived: 45,
  thisWeek: 23,
  thisMonth: 67,
};

export const NotificationHistoryPage: React.FC<
  NotificationHistoryPageProps
> = ({ onNavigate, role: propRole }) => {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    NotificationStatus | "all"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const notificationTypes: {
    type: NotificationType;
    label: string;
    icon: typeof Bell;
  }[] = [
    { type: "paper", label: "Papers", icon: FileText },
    { type: "team", label: "Team", icon: Users },
    { type: "comment", label: "Comments", icon: MessageSquare },
    { type: "share", label: "Shares", icon: Share2 },
    { type: "system", label: "System", icon: AlertCircle },
    { type: "mention", label: "Mentions", icon: Info },
  ];

  const getTypeIcon = (type: NotificationType) => {
    const iconMap = {
      paper: FileText,
      team: Users,
      comment: MessageSquare,
      share: Share2,
      system: AlertCircle,
      mention: Info,
    };
    return iconMap[type];
  };

  const getTypeColor = (type: NotificationType) => {
    const colorMap = {
      paper: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      team: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      comment:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      share:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      system: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      mention:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    };
    return colorMap[type];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const toggleTypeFilter = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) =>
        ids.includes(n.id) ? { ...n, status: "read" as NotificationStatus } : n
      )
    );
    setSelectedNotifications([]);
  };

  const toggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  };

  const archiveNotifications = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) =>
        ids.includes(n.id)
          ? { ...n, status: "archived" as NotificationStatus }
          : n
      )
    );
    setSelectedNotifications([]);
  };

  const deleteNotifications = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelectedNotifications([]);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const filteredNotifications = notifications
    .filter((n) => {
      if (
        searchQuery &&
        !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.message.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(n.type)) {
        return false;
      }
      if (selectedStatus !== "all" && n.status !== selectedStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notification History
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  View and manage all your notifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {[
              {
                label: "Total",
                value: mockStats.total,
                icon: Bell,
                color: "indigo",
              },
              {
                label: "Unread",
                value: mockStats.unread,
                icon: Eye,
                color: "blue",
              },
              {
                label: "Starred",
                value: mockStats.starred,
                icon: Star,
                color: "amber",
              },
              {
                label: "Archived",
                value: mockStats.archived,
                icon: Archive,
                color: "gray",
              },
              {
                label: "This Week",
                value: mockStats.thisWeek,
                icon: Calendar,
                color: "green",
              },
              {
                label: "This Month",
                value: mockStats.thisMonth,
                icon: Clock,
                color: "purple",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                  showFilters || selectedTypes.length > 0
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {selectedTypes.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-indigo-600 text-white rounded-full">
                    {selectedTypes.length}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as NotificationStatus | "all"
                  )
                }
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>

              {/* Sort */}
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === "newest" ? "Newest" : "Oldest"}
              </button>
            </div>

            {/* Type Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {notificationTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedTypes.includes(type.type);
                      return (
                        <button
                          key={type.type}
                          onClick={() => toggleTypeFilter(type.type)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                            isSelected
                              ? getTypeColor(type.type)
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="text-sm text-indigo-700 dark:text-indigo-300">
                  {selectedNotifications.length} notification(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAsRead(selectedNotifications)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark Read
                  </button>
                  <button
                    onClick={() => archiveNotifications(selectedNotifications)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    onClick={() => deleteNotifications(selectedNotifications)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedNotifications([])}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <BellOff className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <BellOff className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredNotifications.map((notification, idx) => {
                  const Icon = getTypeIcon(notification.type);
                  const isSelected = selectedNotifications.includes(
                    notification.id
                  );
                  const isExpanded = expandedId === notification.id;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        notification.status === "unread"
                          ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                          : ""
                      } ${isSelected ? "bg-indigo-100 dark:bg-indigo-900/30" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() =>
                            toggleNotificationSelection(notification.id)
                          }
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600"
                              : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>

                        {/* Type Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-medium ${
                                    notification.status === "unread"
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {notification.status === "unread" && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                )}
                                {notification.starred && (
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                )}
                              </div>
                              <p
                                className={`text-sm ${
                                  notification.status === "unread"
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-500 dark:text-gray-500"
                                } ${isExpanded ? "" : "line-clamp-1"}`}
                              >
                                {notification.message}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleStar(notification.id)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      notification.starred
                                        ? "text-amber-500 fill-amber-500"
                                        : "text-gray-400 hover:text-amber-500"
                                    }`}
                                  />
                                </button>
                                <button
                                  onClick={() =>
                                    setExpandedId(
                                      isExpanded ? null : notification.id
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Actor and Action */}
                          <div className="flex items-center gap-3 mt-2">
                            {notification.actor.avatar ? (
                              <img
                                src={notification.actor.avatar}
                                alt={notification.actor.name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <Bell className="w-3 h-3 text-gray-500" />
                              </div>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.actor.name}
                            </span>
                            <button
                              onClick={() => onNavigate(notification.actionUrl)}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              View Details
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {filteredNotifications.length > 0 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Load More Notifications
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationHistoryPage;
