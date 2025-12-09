"use client";

import {
  Activity,
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FileUp,
  Filter,
  FolderOpen,
  MessageSquare,
  PieChart,
  RefreshCcw,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface WorkspaceAnalyticsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "team_lead" as const,
};

// Mock workspace data
const mockWorkspace = {
  id: "ws-1",
  name: "AI Research Lab",
  description: "Machine learning and neural networks research",
  memberCount: 12,
  paperCount: 156,
  collectionCount: 24,
  createdAt: "2024-06-15",
};

// Mock analytics data
const mockOverviewStats = [
  {
    id: "papers",
    label: "Total Papers",
    value: 156,
    change: 12,
    trend: "up" as const,
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "members",
    label: "Active Members",
    value: 12,
    change: 2,
    trend: "up" as const,
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "collections",
    label: "Collections",
    value: 24,
    change: 3,
    trend: "up" as const,
    icon: FolderOpen,
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "activity",
    label: "Activity Score",
    value: 847,
    change: -5,
    trend: "down" as const,
    icon: Zap,
    color: "from-amber-500 to-orange-600",
  },
];

// Mock activity timeline
const mockActivityData = [
  { date: "Mon", papers: 8, comments: 24, views: 156 },
  { date: "Tue", papers: 12, comments: 31, views: 203 },
  { date: "Wed", papers: 5, comments: 18, views: 142 },
  { date: "Thu", papers: 15, comments: 42, views: 287 },
  { date: "Fri", papers: 9, comments: 27, views: 198 },
  { date: "Sat", papers: 3, comments: 12, views: 89 },
  { date: "Sun", papers: 6, comments: 15, views: 124 },
];

// Mock member contributions
const mockMemberStats = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    avatar: undefined,
    role: "Team Lead",
    papers: 32,
    comments: 156,
    reviews: 24,
    score: 95,
    trend: "up" as const,
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: undefined,
    role: "Researcher",
    papers: 28,
    comments: 134,
    reviews: 18,
    score: 88,
    trend: "up" as const,
  },
  {
    id: "3",
    name: "Dr. Emily Park",
    avatar: undefined,
    role: "Senior Researcher",
    papers: 24,
    comments: 98,
    reviews: 31,
    score: 84,
    trend: "stable" as const,
  },
  {
    id: "4",
    name: "Michael Torres",
    avatar: undefined,
    role: "Research Assistant",
    papers: 18,
    comments: 76,
    reviews: 12,
    score: 72,
    trend: "up" as const,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: undefined,
    role: "Postdoc",
    papers: 16,
    comments: 89,
    reviews: 15,
    score: 68,
    trend: "down" as const,
  },
];

// Mock top papers
const mockTopPapers = [
  {
    id: "p1",
    title: "Deep Learning for Medical Image Analysis",
    views: 1245,
    citations: 28,
    comments: 42,
    author: "Dr. Sarah Chen",
  },
  {
    id: "p2",
    title: "Transformer Architectures in NLP",
    views: 987,
    citations: 19,
    comments: 35,
    author: "James Wilson",
  },
  {
    id: "p3",
    title: "Reinforcement Learning for Robotics",
    views: 856,
    citations: 15,
    comments: 28,
    author: "Dr. Emily Park",
  },
  {
    id: "p4",
    title: "Graph Neural Networks Survey",
    views: 743,
    citations: 12,
    comments: 21,
    author: "Michael Torres",
  },
  {
    id: "p5",
    title: "Attention Mechanisms Explained",
    views: 698,
    citations: 9,
    comments: 18,
    author: "Lisa Anderson",
  },
];

// Mock category distribution
const mockCategoryDistribution = [
  { name: "Machine Learning", count: 45, percentage: 29, color: "bg-blue-500" },
  { name: "Deep Learning", count: 38, percentage: 24, color: "bg-purple-500" },
  { name: "NLP", count: 28, percentage: 18, color: "bg-emerald-500" },
  { name: "Computer Vision", count: 24, percentage: 15, color: "bg-amber-500" },
  {
    name: "Reinforcement Learning",
    count: 21,
    percentage: 14,
    color: "bg-rose-500",
  },
];

// Mock recent activity
const mockRecentActivity = [
  {
    id: "a1",
    type: "paper_added" as const,
    user: "James Wilson",
    content: "Added 'Neural Architecture Search Survey'",
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "comment" as const,
    user: "Dr. Emily Park",
    content: "Commented on 'Deep Learning for Medical Image Analysis'",
    time: "4 hours ago",
  },
  {
    id: "a3",
    type: "member_joined" as const,
    user: "Alex Thompson",
    content: "Joined the workspace",
    time: "6 hours ago",
  },
  {
    id: "a4",
    type: "collection_created" as const,
    user: "Dr. Sarah Chen",
    content: "Created collection 'Q4 Research Goals'",
    time: "1 day ago",
  },
  {
    id: "a5",
    type: "review" as const,
    user: "Michael Torres",
    content: "Completed review for 'GAN Innovations Paper'",
    time: "1 day ago",
  },
];

// Workspace Goals
interface WorkspaceGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  status: "on-track" | "at-risk" | "completed";
}

const mockWorkspaceGoals: WorkspaceGoal[] = [
  {
    id: "g1",
    name: "Papers Published",
    current: 12,
    target: 20,
    unit: "papers",
    deadline: "Dec 2025",
    status: "on-track",
  },
  {
    id: "g2",
    name: "Peer Reviews",
    current: 45,
    target: 50,
    unit: "reviews",
    deadline: "Nov 2025",
    status: "on-track",
  },
  {
    id: "g3",
    name: "Active Collaborations",
    current: 8,
    target: 15,
    unit: "projects",
    deadline: "Dec 2025",
    status: "at-risk",
  },
  {
    id: "g4",
    name: "Citation Count",
    current: 156,
    target: 150,
    unit: "citations",
    deadline: "Dec 2025",
    status: "completed",
  },
];

// AI Productivity Insights
interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "productivity" | "collaboration" | "quality" | "growth";
  action?: string;
}

const mockAIInsights: AIInsight[] = [
  {
    id: "i1",
    title: "Peak Collaboration Window",
    description:
      "Team is most active Tuesday-Thursday between 10 AM and 2 PM. Consider scheduling important discussions during this time.",
    impact: "high",
    category: "productivity",
    action: "Schedule Meeting",
  },
  {
    id: "i2",
    title: "Underutilized Collection",
    description:
      "'Computer Vision Basics' hasn't been accessed in 3 weeks. Consider archiving or promoting it.",
    impact: "medium",
    category: "quality",
    action: "View Collection",
  },
  {
    id: "i3",
    title: "Rising Star Contributor",
    description:
      "Michael Torres has increased output by 40% this month. Consider recognizing their contributions.",
    impact: "medium",
    category: "growth",
    action: "Send Recognition",
  },
  {
    id: "i4",
    title: "Cross-Team Opportunity",
    description:
      "Your NLP papers overlap 75% with 'ML Research Lab'. Consider collaboration opportunities.",
    impact: "high",
    category: "collaboration",
    action: "Explore Connections",
  },
];

// Export formats
interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  icon: React.ReactNode;
  description: string;
}

const exportFormats: ExportFormat[] = [
  {
    id: "pdf",
    name: "PDF Report",
    extension: ".pdf",
    icon: <FileText className="h-5 w-5" />,
    description: "Comprehensive visual report",
  },
  {
    id: "xlsx",
    name: "Excel Spreadsheet",
    extension: ".xlsx",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    description: "Detailed data tables",
  },
  {
    id: "csv",
    name: "CSV Data",
    extension: ".csv",
    icon: <FileText className="h-5 w-5" />,
    description: "Raw data export",
  },
  {
    id: "json",
    name: "JSON",
    extension: ".json",
    icon: <FileText className="h-5 w-5" />,
    description: "API-compatible format",
  },
];

type DateRange = "7d" | "30d" | "90d" | "1y";
type ViewMode = "overview" | "members" | "papers" | "activity";

export function WorkspaceAnalyticsPage({
  onNavigate,
  role: propRole,
}: WorkspaceAnalyticsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<
    string | null
  >(null);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setSelectedExportFormat(format);
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      // Show success message
    }, 1500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "paper_added":
        return <FileUp className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case "member_joined":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case "collection_created":
        return <FolderOpen className="h-4 w-4 text-amber-500" />;
      case "review":
        return <BookOpen className="h-4 w-4 text-rose-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate max value for bar chart scaling
  const maxActivityValue = useMemo(() => {
    return Math.max(
      ...mockActivityData.map((d) =>
        Math.max(d.papers * 10, d.comments, d.views / 5)
      )
    );
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pb-12">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate("/workspaces")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Workspace Analytics
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mockWorkspace.name} • {mockWorkspace.memberCount} members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Date Range Selector */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {(["7d", "30d", "90d", "1y"] as DateRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        dateRange === range
                          ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCcw
                    className={`h-5 w-5 text-gray-600 dark:text-gray-300 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Download
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    onClick={() => setShowExportModal(true)}
                  />
                </button>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 mt-4">
              {(
                ["overview", "members", "papers", "activity"] as ViewMode[]
              ).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    viewMode === mode
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {viewMode === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Overview Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockOverviewStats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color}`}
                        >
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${
                            stat.trend === "up"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {Math.abs(stat.change)}%
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Activity Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Weekly Activity
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Papers, comments, and views
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Papers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Comments
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Views
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 flex items-end gap-4">
                    {mockActivityData.map((day, index) => (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div className="w-full flex items-end gap-1 h-48">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${((day.papers * 10) / maxActivityValue) * 100}%`,
                            }}
                            transition={{
                              delay: 0.5 + index * 0.05,
                              duration: 0.5,
                            }}
                            className="flex-1 bg-blue-500 rounded-t-sm min-h-[4px]"
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(day.comments / maxActivityValue) * 100}%`,
                            }}
                            transition={{
                              delay: 0.6 + index * 0.05,
                              duration: 0.5,
                            }}
                            className="flex-1 bg-emerald-500 rounded-t-sm min-h-[4px]"
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(day.views / 5 / maxActivityValue) * 100}%`,
                            }}
                            transition={{
                              delay: 0.7 + index * 0.05,
                              duration: 0.5,
                            }}
                            className="flex-1 bg-purple-500 rounded-t-sm min-h-[4px]"
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {day.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <PieChart className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Research Categories
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {mockCategoryDistribution.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {category.count} papers ({category.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${category.percentage}%` }}
                              transition={{
                                delay: 0.8 + index * 0.1,
                                duration: 0.5,
                              }}
                              className={`h-full ${category.color} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Activity
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {mockRecentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">
                                {activity.user}
                              </span>{" "}
                              <span className="text-gray-600 dark:text-gray-400">
                                {activity.content.split(activity.user)[1] ||
                                  activity.content}
                              </span>
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {viewMode === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Member Contributions
                        </h3>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filter
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Member
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Papers
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Comments
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Reviews
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {mockMemberStats.map((member, index) => (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {member.papers}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {member.comments}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-purple-500" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {member.reviews}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                                    style={{ width: `${member.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {member.score}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {member.trend === "up" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 rounded-full">
                                  <TrendingUp className="h-3 w-3" /> Rising
                                </span>
                              )}
                              {member.trend === "down" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30 rounded-full">
                                  <TrendingDown className="h-3 w-3" /> Declining
                                </span>
                              )}
                              {member.trend === "stable" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 rounded-full">
                                  Stable
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === "papers" && (
              <motion.div
                key="papers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Top Performing Papers
                      </h3>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockTopPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => onNavigate(`/papers/${paper.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                              {paper.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              By {paper.author}
                            </p>
                            <div className="flex items-center gap-6 mt-3">
                              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <Eye className="h-4 w-4" />
                                {paper.views.toLocaleString()} views
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <Target className="h-4 w-4" />
                                {paper.citations} citations
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <MessageSquare className="h-4 w-4" />
                                {paper.comments} comments
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Full Activity Log
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-6">
                        {[...mockRecentActivity, ...mockRecentActivity].map(
                          (activity, index) => (
                            <motion.div
                              key={`${activity.id}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative pl-10"
                            >
                              <div className="absolute left-0 top-1 p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <p className="text-sm text-gray-900 dark:text-white">
                                  <span className="font-medium">
                                    {activity.user}
                                  </span>{" "}
                                  {activity.content
                                    .toLowerCase()
                                    .replace(activity.user.toLowerCase(), "")
                                    .trim()}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </div>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goal Tracking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Workspace Goals
                  </h3>
                  <p className="text-sm text-gray-500">
                    Track progress toward team objectives
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                + Add Goal
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockWorkspaceGoals.map((goal, index) => {
                const progress = Math.min(
                  (goal.current / goal.target) * 100,
                  100
                );
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      goal.status === "completed"
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                        : goal.status === "at-risk"
                          ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {goal.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          goal.status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                            : goal.status === "at-risk"
                              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                              : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {goal.status === "completed"
                          ? "✓ Done"
                          : goal.status === "at-risk"
                            ? "⚠ At Risk"
                            : "On Track"}
                      </span>
                    </div>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {goal.current}
                      </span>
                      <span className="text-sm text-gray-500 mb-1">
                        / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          goal.status === "completed"
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : goal.status === "at-risk"
                              ? "bg-gradient-to-r from-amber-400 to-amber-600"
                              : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Deadline: {goal.deadline}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Productivity Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      AI Productivity Insights
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </h3>
                    <p className="text-sm text-gray-500">
                      Personalized recommendations for your workspace
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showAIInsights
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {showAIInsights ? "Hide" : "Show"}
                </button>
              </div>

              <AnimatePresence>
                {showAIInsights && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="divide-y divide-gray-100 dark:divide-gray-700"
                  >
                    {mockAIInsights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              insight.impact === "high"
                                ? "bg-purple-500"
                                : insight.impact === "medium"
                                  ? "bg-blue-500"
                                  : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {insight.title}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  insight.category === "productivity"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700"
                                    : insight.category === "collaboration"
                                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700"
                                      : insight.category === "quality"
                                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700"
                                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-700"
                                }`}
                              >
                                {insight.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {insight.description}
                            </p>
                          </div>
                          {insight.action && (
                            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm flex-shrink-0">
                              {insight.action}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Export Modal */}
        <AnimatePresence>
          {showExportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Export Report
                      </h2>
                      <p className="text-sm text-gray-500">
                        Choose your preferred format
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      disabled={isExporting}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        selectedExportFormat === format.id && isExporting
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {format.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {format.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format.description}
                        </p>
                      </div>
                      {selectedExportFormat === format.id && isExporting ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-sm text-gray-400">
                          {format.extension}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                  <p className="text-xs text-gray-500 text-center">
                    Export will include data from the last {dateRange} period
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
