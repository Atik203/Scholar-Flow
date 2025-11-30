"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Calendar,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FolderOpen,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface RecentActivityPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type ActivityType =
  | "paper_upload"
  | "paper_view"
  | "paper_download"
  | "paper_edit"
  | "paper_delete"
  | "collection_create"
  | "collection_edit"
  | "collection_share"
  | "comment_add"
  | "comment_reply"
  | "team_invite"
  | "team_join"
  | "ai_summary"
  | "ai_recommendation"
  | "login"
  | "settings_change";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
    email: string;
  };
  metadata?: {
    paperId?: string;
    paperTitle?: string;
    collectionId?: string;
    collectionName?: string;
    teamMember?: string;
    changeType?: string;
  };
  isRead: boolean;
}

const activityTypeConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  paper_upload: {
    icon: <Upload className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    label: "Paper Upload",
  },
  paper_view: {
    icon: <Eye className="h-4 w-4" />,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    label: "Paper View",
  },
  paper_download: {
    icon: <Download className="h-4 w-4" />,
    color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    label: "Paper Download",
  },
  paper_edit: {
    icon: <Edit className="h-4 w-4" />,
    color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    label: "Paper Edit",
  },
  paper_delete: {
    icon: <Trash2 className="h-4 w-4" />,
    color: "text-red-500 bg-red-100 dark:bg-red-900/30",
    label: "Paper Delete",
  },
  collection_create: {
    icon: <FolderOpen className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    label: "Collection Create",
  },
  collection_edit: {
    icon: <Edit className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    label: "Collection Edit",
  },
  collection_share: {
    icon: <Share2 className="h-4 w-4" />,
    color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
    label: "Collection Share",
  },
  comment_add: {
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
    label: "Comment",
  },
  comment_reply: {
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
    label: "Reply",
  },
  team_invite: {
    icon: <Users className="h-4 w-4" />,
    color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
    label: "Team Invite",
  },
  team_join: {
    icon: <Users className="h-4 w-4" />,
    color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
    label: "Team Join",
  },
  ai_summary: {
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
    label: "AI Summary",
  },
  ai_recommendation: {
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
    label: "AI Recommendation",
  },
  login: {
    icon: <User className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-900/30",
    label: "Login",
  },
  settings_change: {
    icon: <Settings className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-900/30",
    label: "Settings",
  },
};

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "paper_upload",
    title: "Uploaded new paper",
    description:
      '"Deep Learning for Natural Language Processing: A Comprehensive Review"',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    user: { name: "You", email: "atik@example.com" },
    metadata: { paperId: "p1", paperTitle: "Deep Learning for NLP" },
    isRead: false,
  },
  {
    id: "2",
    type: "ai_summary",
    title: "Generated AI summary",
    description: 'AI summary created for "Transformer Architecture Analysis"',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    user: { name: "You", email: "atik@example.com" },
    metadata: { paperId: "p2" },
    isRead: false,
  },
  {
    id: "3",
    type: "collection_share",
    title: "Shared collection",
    description: '"Machine Learning Research" shared with 3 collaborators',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: { name: "You", email: "atik@example.com" },
    metadata: {
      collectionId: "c1",
      collectionName: "Machine Learning Research",
    },
    isRead: true,
  },
  {
    id: "4",
    type: "team_join",
    title: "New team member",
    description: "Sarah Johnson joined your workspace",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    user: { name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ" },
    metadata: { teamMember: "Sarah Johnson" },
    isRead: true,
  },
  {
    id: "5",
    type: "comment_add",
    title: "New comment",
    description: 'Dr. Chen commented on "Neural Network Optimization"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    user: { name: "Dr. Chen", email: "chen@example.com", avatar: "DC" },
    metadata: { paperId: "p3" },
    isRead: true,
  },
  {
    id: "6",
    type: "paper_download",
    title: "Downloaded paper",
    description: '"Attention Mechanisms in Deep Learning"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    user: { name: "You", email: "atik@example.com" },
    metadata: { paperId: "p4" },
    isRead: true,
  },
  {
    id: "7",
    type: "collection_create",
    title: "Created collection",
    description: '"Q4 Research Papers" collection created',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    user: { name: "You", email: "atik@example.com" },
    metadata: { collectionId: "c2", collectionName: "Q4 Research Papers" },
    isRead: true,
  },
  {
    id: "8",
    type: "ai_recommendation",
    title: "AI recommendations",
    description: "5 new papers recommended based on your interests",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    user: { name: "ScholarFlow AI", email: "ai@scholarflow.com" },
    isRead: true,
  },
  {
    id: "9",
    type: "paper_edit",
    title: "Updated paper metadata",
    description: 'Updated tags for "Computer Vision Survey"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user: { name: "You", email: "atik@example.com" },
    metadata: { paperId: "p5" },
    isRead: true,
  },
  {
    id: "10",
    type: "login",
    title: "Signed in",
    description: "You signed in from a new device (Chrome on Windows)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    user: { name: "You", email: "atik@example.com" },
    isRead: true,
  },
];

type FilterType = "all" | "papers" | "collections" | "team" | "ai" | "system";
type TimeRange = "today" | "week" | "month" | "all";

export function RecentActivityPage({
  onNavigate,
  role: propRole,
}: RecentActivityPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;

  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState<FilterType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const user = {
    name: "Atik Rahaman",
    email: "atik@example.com",
    role: effectiveRole,
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filterActivities = (items: ActivityItem[]) => {
    let filtered = items;

    // Apply type filter
    if (filter !== "all") {
      const typeMap: Record<FilterType, ActivityType[]> = {
        all: [],
        papers: [
          "paper_upload",
          "paper_view",
          "paper_download",
          "paper_edit",
          "paper_delete",
        ],
        collections: [
          "collection_create",
          "collection_edit",
          "collection_share",
        ],
        team: ["team_invite", "team_join", "comment_add", "comment_reply"],
        ai: ["ai_summary", "ai_recommendation"],
        system: ["login", "settings_change"],
      };
      filtered = filtered.filter((a) => typeMap[filter].includes(a.type));
    }

    // Apply time range filter
    if (timeRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (timeRange === "today") cutoff.setHours(0, 0, 0, 0);
      else if (timeRange === "week") cutoff.setDate(now.getDate() - 7);
      else if (timeRange === "month") cutoff.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((a) => a.timestamp >= cutoff);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.user.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredActivities = filterActivities(activities);
  const unreadCount = activities.filter((a) => !a.isRead).length;

  const handleMarkAllRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const groupByDate = (items: ActivityItem[]) => {
    const groups: { date: string; items: ActivityItem[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    items.forEach((item) => {
      const itemDate = new Date(item.timestamp);
      itemDate.setHours(0, 0, 0, 0);

      let dateLabel: string;
      if (itemDate.getTime() === today.getTime()) {
        dateLabel = "Today";
      } else if (itemDate.getTime() === yesterday.getTime()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = itemDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }

      const existingGroup = groups.find((g) => g.date === dateLabel);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ date: dateLabel, items: [item] });
      }
    });

    return groups;
  };

  const groupedActivities = groupByDate(filteredActivities);

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {unreadCount > 0 ? (
                  <span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {unreadCount} unread
                    </span>{" "}
                    activity updates
                  </span>
                ) : (
                  "All caught up!"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400
                         hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                       transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 text-slate-600 dark:text-slate-400 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                "all",
                "papers",
                "collections",
                "team",
                "ai",
                "system",
              ] as FilterType[]
            ).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      filter === f
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
              >
                {f === "all"
                  ? "All"
                  : f === "papers"
                    ? "Papers"
                    : f === "collections"
                      ? "Collections"
                      : f === "team"
                        ? "Team"
                        : f === "ai"
                          ? "AI"
                          : "System"}
              </button>
            ))}

            {/* Time Range Dropdown */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800
                         text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {timeRange === "all"
                    ? "All time"
                    : timeRange === "today"
                      ? "Today"
                      : timeRange === "week"
                        ? "This week"
                        : "This month"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg
                             border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                  >
                    {(["all", "today", "week", "month"] as TimeRange[]).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTimeRange(t);
                            setShowFilters(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors
                          ${
                            timeRange === t
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          {t === "all"
                            ? "All time"
                            : t === "today"
                              ? "Today"
                              : t === "week"
                                ? "This week"
                                : "This month"}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Activity List */}
        <div className="space-y-6">
          {groupedActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Activity className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "Try a different search term"
                  : "Your activity will appear here as you use ScholarFlow"}
              </p>
            </motion.div>
          ) : (
            groupedActivities.map((group, groupIndex) => (
              <motion.div
                key={group.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {group.date}
                </h3>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {group.items.map((activity, index) => {
                    const config = activityTypeConfig[activity.type];
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-start gap-4 p-4 border-b border-slate-100 dark:border-slate-700 last:border-0
                                  hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer
                                  ${!activity.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                      >
                        {/* Icon */}
                        <div
                          className={`p-2 rounded-xl ${config.color} flex-shrink-0`}
                        >
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {activity.title}
                                {!activity.isRead && (
                                  <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500" />
                                )}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                {activity.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-400">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                              <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                              </button>
                            </div>
                          </div>

                          {/* User & Meta */}
                          <div className="flex items-center gap-3 mt-2">
                            {activity.user.avatar ? (
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <span className="text-[10px] font-medium text-white">
                                  {activity.user.avatar}
                                </span>
                              </div>
                            ) : (
                              <User className="h-4 w-4 text-slate-400" />
                            )}
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {activity.user.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${config.color}`}
                            >
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Load more activities
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RecentActivityPage;
