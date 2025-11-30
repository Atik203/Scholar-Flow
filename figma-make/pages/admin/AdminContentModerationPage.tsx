"use client";

/**
 * AdminContentModerationPage - Content Moderation Queue
 *
 * Features:
 * - Flagged content review
 * - User report management
 * - Moderation actions (approve/reject/warn)
 * - Moderation history
 * - Automated moderation rules
 * - Appeal management
 *
 * @author Md. Atikur Rahaman
 * @version 1.0.0 - Phase 7
 */

import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Bookmark,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  Flag,
  Gavel,
  Lightbulb,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  ThumbsUp,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminContentModerationPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Types
type ContentType = "paper" | "comment" | "collection" | "profile";
type ReportStatus = "pending" | "under_review" | "resolved" | "dismissed";
type ReportReason =
  | "spam"
  | "harassment"
  | "copyright"
  | "inappropriate"
  | "misinformation"
  | "other";
type ModeratorAction = "approved" | "removed" | "warning" | "suspended";

interface FlaggedContent {
  id: string;
  contentType: ContentType;
  contentId: string;
  contentPreview: string;
  contentTitle: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  reportCount: number;
  reports: ContentReport[];
  status: ReportStatus;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  assignedTo: string | null;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  action: ModeratorAction | null;
}

interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  createdAt: Date;
}

interface ModerationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  matchCount: number;
}

// Mock data
const mockFlaggedContent: FlaggedContent[] = [
  {
    id: "flag-1",
    contentType: "paper",
    contentId: "paper-123",
    contentPreview:
      "This paper contains plagiarized content from multiple sources without proper attribution...",
    contentTitle: "Advanced Machine Learning Techniques",
    authorId: "user-456",
    authorName: "John Smith",
    authorEmail: "john.smith@example.com",
    reportCount: 5,
    reports: [
      {
        id: "rep-1",
        reporterId: "user-789",
        reporterName: "Alice Johnson",
        reason: "copyright",
        description:
          "This paper contains content copied from my published work without citation.",
        createdAt: new Date("2025-11-28T10:00:00"),
      },
      {
        id: "rep-2",
        reporterId: "user-101",
        reporterName: "Bob Williams",
        reason: "copyright",
        description:
          "Multiple paragraphs are identical to papers from IEEE database.",
        createdAt: new Date("2025-11-28T14:30:00"),
      },
    ],
    status: "pending",
    priority: "high",
    createdAt: new Date("2025-11-28T09:00:00"),
    assignedTo: null,
    resolvedAt: null,
    resolvedBy: null,
    action: null,
  },
  {
    id: "flag-2",
    contentType: "comment",
    contentId: "comment-456",
    contentPreview:
      "This is completely wrong and the author clearly doesn't understand basic concepts. What an idiot...",
    contentTitle: "Comment on: Neural Network Architectures",
    authorId: "user-222",
    authorName: "Mike Johnson",
    authorEmail: "mike.j@example.com",
    reportCount: 3,
    reports: [
      {
        id: "rep-3",
        reporterId: "user-333",
        reporterName: "Sarah Lee",
        reason: "harassment",
        description:
          "This comment is disrespectful and uses offensive language.",
        createdAt: new Date("2025-11-29T08:00:00"),
      },
    ],
    status: "under_review",
    priority: "medium",
    createdAt: new Date("2025-11-29T07:30:00"),
    assignedTo: "moderator@scholarflow.com",
    resolvedAt: null,
    resolvedBy: null,
    action: null,
  },
  {
    id: "flag-3",
    contentType: "paper",
    contentId: "paper-789",
    contentPreview:
      "Buy cheap medications online! Best prices guaranteed. Visit www.spam-site.com...",
    contentTitle: "Research Paper Title",
    authorId: "user-spam",
    authorName: "SpamBot3000",
    authorEmail: "spam@suspicious.com",
    reportCount: 12,
    reports: [
      {
        id: "rep-4",
        reporterId: "user-444",
        reporterName: "Emily Chen",
        reason: "spam",
        description:
          "This is clearly spam/advertising content, not a research paper.",
        createdAt: new Date("2025-11-29T06:00:00"),
      },
    ],
    status: "pending",
    priority: "critical",
    createdAt: new Date("2025-11-29T05:00:00"),
    assignedTo: null,
    resolvedAt: null,
    resolvedBy: null,
    action: null,
  },
  {
    id: "flag-4",
    contentType: "collection",
    contentId: "collection-123",
    contentPreview:
      "Collection of controversial papers with misleading summaries...",
    contentTitle: "Debunked Theories Collection",
    authorId: "user-555",
    authorName: "David Brown",
    authorEmail: "david.b@example.com",
    reportCount: 2,
    reports: [
      {
        id: "rep-5",
        reporterId: "user-666",
        reporterName: "Lisa Wang",
        reason: "misinformation",
        description:
          "This collection promotes debunked scientific theories as fact.",
        createdAt: new Date("2025-11-27T12:00:00"),
      },
    ],
    status: "resolved",
    priority: "medium",
    createdAt: new Date("2025-11-27T10:00:00"),
    assignedTo: "admin@scholarflow.com",
    resolvedAt: new Date("2025-11-28T15:00:00"),
    resolvedBy: "admin@scholarflow.com",
    action: "warning",
  },
  {
    id: "flag-5",
    contentType: "profile",
    contentId: "user-777",
    contentPreview: "Bio contains promotional links and fake credentials...",
    contentTitle: "User Profile: FakeDoctor PhD",
    authorId: "user-777",
    authorName: "FakeDoctor PhD",
    authorEmail: "fake@gmail.com",
    reportCount: 4,
    reports: [
      {
        id: "rep-6",
        reporterId: "user-888",
        reporterName: "Rachel Green",
        reason: "inappropriate",
        description:
          "This user is impersonating a medical professional with fake credentials.",
        createdAt: new Date("2025-11-26T09:00:00"),
      },
    ],
    status: "resolved",
    priority: "high",
    createdAt: new Date("2025-11-26T08:00:00"),
    assignedTo: "admin@scholarflow.com",
    resolvedAt: new Date("2025-11-27T10:00:00"),
    resolvedBy: "admin@scholarflow.com",
    action: "suspended",
  },
];

const mockRules: ModerationRule[] = [
  {
    id: "rule-1",
    name: "Spam Detection",
    description:
      "Auto-flag content with suspicious links or promotional language",
    trigger: "URL patterns, promotional keywords",
    action: "Auto-flag for review",
    enabled: true,
    matchCount: 156,
  },
  {
    id: "rule-2",
    name: "Profanity Filter",
    description: "Detect and hide comments containing profanity",
    trigger: "Profanity word list",
    action: "Hide comment, notify user",
    enabled: true,
    matchCount: 89,
  },
  {
    id: "rule-3",
    name: "Duplicate Content",
    description: "Flag papers with high similarity to existing content",
    trigger: ">80% similarity score",
    action: "Flag for review",
    enabled: true,
    matchCount: 34,
  },
  {
    id: "rule-4",
    name: "Mass Reporting",
    description: "Detect coordinated reporting campaigns",
    trigger: ">5 reports in 1 hour from related accounts",
    action: "Hold reports for manual review",
    enabled: false,
    matchCount: 12,
  },
];

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  image: null,
  role: "admin" as const,
};

export function AdminContentModerationPage({
  onNavigate,
  role: propRole,
}: AdminContentModerationPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [flaggedContent] = useState<FlaggedContent[]>(mockFlaggedContent);
  const [rules] = useState<ModerationRule[]>(mockRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"queue" | "resolved" | "rules">(
    "queue"
  );
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [selectedAction, setSelectedAction] = useState<ModeratorAction | null>(
    null
  );

  // Enhanced features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [savedViews] = useState([
    { id: "1", name: "Critical Priority", filters: { priority: "critical" } },
    { id: "2", name: "Pending Review", filters: { status: "pending" } },
    { id: "3", name: "Copyright Issues", filters: { type: "paper" } },
  ]);
  const [aiInsights] = useState([
    {
      id: "1",
      type: "alert",
      title: "Spike in Reports",
      description: "45% increase in flagged content in the last 24 hours",
      action: "View Trend",
    },
    {
      id: "2",
      type: "pattern",
      title: "Pattern Detected",
      description:
        "3 reports from same IP range may indicate coordinated abuse",
      action: "Investigate",
    },
    {
      id: "3",
      type: "suggestion",
      title: "Auto-Moderation Candidate",
      description: "5 similar spam comments could be auto-removed",
      action: "Configure Rule",
    },
  ]);

  // Auto-refresh effect
  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((c) => c.id));
    }
  };

  const handleBulkDismiss = () => {
    setSelectedItems([]);
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    setShowExportMenu(false);
  };

  // Filter content
  const filteredContent = useMemo(() => {
    return flaggedContent.filter((content) => {
      const matchesSearch =
        content.contentTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        content.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || content.status === statusFilter;
      const matchesType =
        typeFilter === "all" || content.contentType === typeFilter;
      const matchesPriority =
        priorityFilter === "all" || content.priority === priorityFilter;
      const matchesTab =
        activeTab === "queue"
          ? content.status === "pending" || content.status === "under_review"
          : activeTab === "resolved"
            ? content.status === "resolved" || content.status === "dismissed"
            : true;
      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesPriority &&
        matchesTab
      );
    });
  }, [
    flaggedContent,
    searchQuery,
    statusFilter,
    typeFilter,
    priorityFilter,
    activeTab,
  ]);

  // Stats
  const stats = {
    pending: flaggedContent.filter((c) => c.status === "pending").length,
    underReview: flaggedContent.filter((c) => c.status === "under_review")
      .length,
    resolved: flaggedContent.filter((c) => c.status === "resolved").length,
    critical: flaggedContent.filter(
      (c) => c.priority === "critical" && c.status === "pending"
    ).length,
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "paper":
        return <FileText className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "collection":
        return <FileText className="h-4 w-4" />;
      case "profile":
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      medium:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      high: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Eye className="h-3 w-3" />
            Under Review
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <XCircle className="h-3 w-3" />
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  const getReasonLabel = (reason: ReportReason) => {
    const labels: Record<ReportReason, string> = {
      spam: "Spam/Advertising",
      harassment: "Harassment/Abuse",
      copyright: "Copyright Violation",
      inappropriate: "Inappropriate Content",
      misinformation: "Misinformation",
      other: "Other",
    };
    return labels[reason];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleTakeAction = (content: FlaggedContent) => {
    setSelectedContent(content);
    setShowActionModal(true);
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Content Moderation
                </h1>
                {/* Real-time indicator */}
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: isAutoRefresh ? [1, 0.5, 1] : 1 }}
                    transition={{
                      duration: 2,
                      repeat: isAutoRefresh ? Infinity : 0,
                    }}
                    className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <span className="text-xs text-gray-500">
                    {isAutoRefresh ? "Live" : "Paused"} •{" "}
                    {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review and manage flagged content and user reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`p-2 rounded-lg transition-colors ${isAutoRefresh ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`}
                  style={{ animationDuration: "3s" }}
                />
              </button>

              {/* Saved Views */}
              <div className="relative">
                <button
                  onClick={() => setShowSavedViews(!showSavedViews)}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="text-sm">Views</span>
                </button>
                <AnimatePresence>
                  {showSavedViews && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 px-2">
                          Saved Views
                        </p>
                      </div>
                      {savedViews.map((view) => (
                        <button
                          key={view.id}
                          onClick={() => setShowSavedViews(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Bookmark className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{view.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Export</span>
                </button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        <span className="text-sm">CSV</span>
                      </button>
                      <button
                        onClick={() => handleExport("json")}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileJson className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">JSON</span>
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="text-sm">PDF</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Insights */}
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${showAIInsights ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">AI Insights</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/25"
              >
                <Settings className="h-4 w-4" />
                Configure Rules
              </motion.button>
            </div>
          </motion.div>

          {/* AI Insights Panel */}
          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                      AI Moderation Insights
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiInsights.map((insight) => (
                      <motion.div
                        key={insight.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-800"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 mt-0.5 text-purple-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {insight.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {insight.description}
                            </p>
                            <button className="text-xs text-purple-600 font-medium mt-2 hover:underline">
                              {insight.action} →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3"
              >
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {selectedItems.length} item
                  {selectedItems.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg text-sm font-medium">
                    <ThumbsUp className="h-4 w-4" />
                    Approve All
                  </button>
                  <button
                    onClick={handleBulkDismiss}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-lg text-sm font-medium"
                  >
                    <XCircle className="h-4 w-4" />
                    Dismiss All
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                label: "Pending",
                value: stats.pending,
                icon: Clock,
                color: "yellow",
              },
              {
                label: "Under Review",
                value: stats.underReview,
                icon: Eye,
                color: "blue",
              },
              {
                label: "Resolved Today",
                value: stats.resolved,
                icon: CheckCircle,
                color: "green",
              },
              {
                label: "Critical",
                value: stats.critical,
                icon: AlertTriangle,
                color: "red",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-white dark:bg-slate-800/50 rounded-xl p-4 border ${
                  stat.color === "red" && stat.value > 0
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-slate-700/50"
                } shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                  >
                    <stat.icon
                      className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              {[
                {
                  id: "queue",
                  label: "Review Queue",
                  icon: Flag,
                  count: stats.pending + stats.underReview,
                },
                { id: "resolved", label: "Resolved", icon: CheckCircle },
                { id: "rules", label: "Auto-Moderation", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "queue" | "resolved" | "rules")
                  }
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="moderationTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Filters */}
            {activeTab !== "rules" && (
              <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="paper">Papers</option>
                  <option value="comment">Comments</option>
                  <option value="collection">Collections</option>
                  <option value="profile">Profiles</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === "rules" ? (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4"
                >
                  <div className="space-y-4">
                    {rules.map((rule, index) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {rule.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  rule.enabled
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {rule.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {rule.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>
                                <strong>Trigger:</strong> {rule.trigger}
                              </span>
                              <span>
                                <strong>Action:</strong> {rule.action}
                              </span>
                              <span>
                                <strong>Matches:</strong> {rule.matchCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                              <Settings className="h-4 w-4 text-gray-500" />
                            </button>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={rule.enabled}
                                className="sr-only peer"
                                readOnly
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-red-500 dark:peer-focus:ring-red-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500" />
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4"
                >
                  {filteredContent.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {activeTab === "queue"
                          ? "No content pending review"
                          : "No resolved items"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredContent.map((content, index) => (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border ${
                            content.priority === "critical"
                              ? "border-red-300 dark:border-red-600"
                              : "border-gray-200 dark:border-slate-700"
                          } hover:border-red-300 dark:hover:border-red-600 transition-all`}
                        >
                          <div className="flex flex-col lg:flex-row gap-4">
                            {/* Content Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700">
                                  {getContentTypeIcon(content.contentType)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                      {content.contentTitle}
                                    </h3>
                                    {getStatusBadge(content.status)}
                                    {getPriorityBadge(content.priority)}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {content.contentPreview}
                                  </p>
                                </div>
                              </div>

                              {/* Author & Reports */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  Author: {content.authorName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Flag className="h-3.5 w-3.5" />
                                  {content.reportCount} reports
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatDate(content.createdAt)}
                                </span>
                                {content.assignedTo && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    Assigned: {content.assignedTo}
                                  </span>
                                )}
                              </div>

                              {/* Report Reasons */}
                              <div className="flex flex-wrap gap-2">
                                {Array.from(
                                  new Set(content.reports.map((r) => r.reason))
                                ).map((reason) => (
                                  <span
                                    key={reason}
                                    className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium"
                                  >
                                    {getReasonLabel(reason)}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col items-center gap-2">
                              <button
                                onClick={() => setSelectedContent(content)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4 text-gray-500" />
                              </button>
                              {content.status !== "resolved" &&
                                content.status !== "dismissed" && (
                                  <>
                                    <button
                                      onClick={() => handleTakeAction(content)}
                                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                      title="Approve"
                                    >
                                      <ThumbsUp className="h-4 w-4 text-green-500" />
                                    </button>
                                    <button
                                      onClick={() => handleTakeAction(content)}
                                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                      title="Remove"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                    <button
                                      onClick={() => handleTakeAction(content)}
                                      className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                                      title="Suspend User"
                                    >
                                      <Ban className="h-4 w-4 text-orange-500" />
                                    </button>
                                  </>
                                )}
                            </div>
                          </div>

                          {/* Resolution Info */}
                          {content.action && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                              <div className="flex items-center gap-2 text-sm">
                                <Gavel className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  Action taken:{" "}
                                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                                    {content.action}
                                  </span>
                                </span>
                                <span className="text-gray-400 dark:text-gray-500">
                                  •
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  by {content.resolvedBy}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500">
                                  •
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {formatDate(content.resolvedAt)}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Action Modal */}
        <AnimatePresence>
          {showActionModal && selectedContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowActionModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full"
              >
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Take Moderation Action
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedContent.contentTitle}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: "approved",
                        label: "Approve",
                        icon: ThumbsUp,
                        color: "green",
                        desc: "Content is acceptable",
                      },
                      {
                        id: "removed",
                        label: "Remove",
                        icon: Trash2,
                        color: "red",
                        desc: "Delete the content",
                      },
                      {
                        id: "warning",
                        label: "Warn User",
                        icon: AlertCircle,
                        color: "yellow",
                        desc: "Send warning to author",
                      },
                      {
                        id: "suspended",
                        label: "Suspend",
                        icon: Ban,
                        color: "orange",
                        desc: "Suspend user account",
                      },
                    ].map((action) => (
                      <button
                        key={action.id}
                        onClick={() =>
                          setSelectedAction(action.id as ModeratorAction)
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAction === action.id
                            ? `border-${action.color}-500 bg-${action.color}-50 dark:bg-${action.color}-900/20`
                            : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <action.icon
                          className={`h-5 w-5 text-${action.color}-500 mb-2`}
                        />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Internal Note (optional)
                    </label>
                    <textarea
                      placeholder="Add notes about this decision..."
                      rows={3}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  {selectedAction === "warning" ||
                  selectedAction === "suspended" ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        An email notification will be sent to{" "}
                        {selectedContent.authorEmail}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedAction}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Action
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Details Modal */}
        <AnimatePresence>
          {selectedContent && !showActionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedContent(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Content Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedContent.contentTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Content Preview */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Content Preview
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedContent.contentPreview}
                      </p>
                    </div>
                    <button className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Full Content
                    </button>
                  </div>

                  {/* Author Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Author Information
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold">
                        {selectedContent.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedContent.authorName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedContent.authorEmail}
                        </p>
                      </div>
                      <button className="ml-auto text-sm text-red-600 dark:text-red-400 hover:underline">
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* Reports */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Reports ({selectedContent.reports.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedContent.reports.map((report) => (
                        <div
                          key={report.id}
                          className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.reporterName}
                              </span>
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                                {getReasonLabel(report.reason)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {report.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-between">
                  <button
                    onClick={() => {
                      setShowActionModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium shadow-lg"
                  >
                    <Gavel className="h-4 w-4" />
                    Take Action
                  </button>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
