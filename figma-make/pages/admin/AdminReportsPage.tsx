"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  GripVertical,
  LineChart,
  Mail,
  Pause,
  PieChart,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminReportsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: "usage" | "financial" | "user" | "content" | "system";
  lastGenerated: string;
  frequency: "daily" | "weekly" | "monthly" | "on-demand";
  status: "ready" | "generating" | "scheduled" | "failed";
  format: "pdf" | "csv" | "xlsx" | "json";
  size?: string;
}

interface ScheduledReport {
  id: string;
  reportId: string;
  reportName: string;
  schedule: string;
  nextRun: string;
  recipients: string[];
  enabled: boolean;
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly User Activity Report",
    description:
      "Comprehensive overview of user engagement, logins, and feature usage",
    type: "usage",
    lastGenerated: "2 hours ago",
    frequency: "monthly",
    status: "ready",
    format: "pdf",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Revenue & Subscription Analysis",
    description:
      "Financial metrics including MRR, churn, and subscription trends",
    type: "financial",
    lastGenerated: "1 day ago",
    frequency: "weekly",
    status: "ready",
    format: "xlsx",
    size: "1.8 MB",
  },
  {
    id: "3",
    name: "New User Registrations",
    description: "Daily breakdown of new signups with source attribution",
    type: "user",
    lastGenerated: "Just now",
    frequency: "daily",
    status: "generating",
    format: "csv",
  },
  {
    id: "4",
    name: "Content Upload Statistics",
    description: "Paper uploads, storage usage, and processing metrics",
    type: "content",
    lastGenerated: "3 hours ago",
    frequency: "weekly",
    status: "ready",
    format: "pdf",
    size: "3.1 MB",
  },
  {
    id: "5",
    name: "System Performance Report",
    description: "Server health, API response times, and error rates",
    type: "system",
    lastGenerated: "Failed",
    frequency: "daily",
    status: "failed",
    format: "json",
  },
  {
    id: "6",
    name: "AI Feature Usage Report",
    description: "AI summaries, recommendations, and insights usage",
    type: "usage",
    lastGenerated: "5 hours ago",
    frequency: "monthly",
    status: "ready",
    format: "pdf",
    size: "1.2 MB",
  },
];

const mockScheduledReports: ScheduledReport[] = [
  {
    id: "s1",
    reportId: "1",
    reportName: "Monthly User Activity Report",
    schedule: "1st of every month at 6:00 AM",
    nextRun: "Dec 1, 2025",
    recipients: ["admin@scholarflow.com", "team@scholarflow.com"],
    enabled: true,
  },
  {
    id: "s2",
    reportId: "2",
    reportName: "Revenue & Subscription Analysis",
    schedule: "Every Monday at 9:00 AM",
    nextRun: "Dec 2, 2025",
    recipients: ["finance@scholarflow.com"],
    enabled: true,
  },
  {
    id: "s3",
    reportId: "3",
    reportName: "New User Registrations",
    schedule: "Daily at 7:00 AM",
    nextRun: "Tomorrow",
    recipients: ["growth@scholarflow.com"],
    enabled: false,
  },
];

const reportTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  usage: {
    icon: <BarChart3 className="h-4 w-4" />,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    label: "Usage",
  },
  financial: {
    icon: <LineChart className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    label: "Financial",
  },
  user: {
    icon: <Users className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    label: "User",
  },
  content: {
    icon: <FileText className="h-4 w-4" />,
    color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    label: "Content",
  },
  system: {
    icon: <Settings className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-900/30",
    label: "System",
  },
};

const statusConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  ready: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-emerald-500",
    label: "Ready",
  },
  generating: {
    icon: <RefreshCw className="h-4 w-4 animate-spin" />,
    color: "text-blue-500",
    label: "Generating",
  },
  scheduled: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-500",
    label: "Scheduled",
  },
  failed: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-red-500",
    label: "Failed",
  },
};

type TabType = "all" | "scheduled" | "custom" | "builder";

// Utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Visual Report Builder Types
// ============================================================================
interface ReportWidget {
  id: string;
  type: "chart" | "table" | "metric" | "text";
  title: string;
  icon: React.ReactNode;
  width: "full" | "half" | "third";
  dataSource: string;
}

const availableWidgets: ReportWidget[] = [
  {
    id: "w1",
    type: "chart",
    title: "Line Chart",
    icon: <LineChart className="h-5 w-5" />,
    width: "half",
    dataSource: "user_activity",
  },
  {
    id: "w2",
    type: "chart",
    title: "Bar Chart",
    icon: <BarChart3 className="h-5 w-5" />,
    width: "half",
    dataSource: "papers_uploaded",
  },
  {
    id: "w3",
    type: "chart",
    title: "Pie Chart",
    icon: <PieChart className="h-5 w-5" />,
    width: "third",
    dataSource: "user_roles",
  },
  {
    id: "w4",
    type: "metric",
    title: "Total Users",
    icon: <Users className="h-5 w-5" />,
    width: "third",
    dataSource: "total_users",
  },
  {
    id: "w5",
    type: "metric",
    title: "Revenue",
    icon: <TrendingUp className="h-5 w-5" />,
    width: "third",
    dataSource: "revenue",
  },
  {
    id: "w6",
    type: "table",
    title: "Top Papers",
    icon: <FileText className="h-5 w-5" />,
    width: "full",
    dataSource: "top_papers",
  },
  {
    id: "w7",
    type: "table",
    title: "Active Users",
    icon: <Users className="h-5 w-5" />,
    width: "half",
    dataSource: "active_users",
  },
  {
    id: "w8",
    type: "metric",
    title: "Growth Rate",
    icon: <TrendingUp className="h-5 w-5" />,
    width: "third",
    dataSource: "growth",
  },
];

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  role: "admin" as const,
};

export function AdminReportsPage({
  onNavigate,
  role: propRole,
}: AdminReportsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Visual Report Builder state
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [builderWidgets, setBuilderWidgets] = useState<ReportWidget[]>([]);
  const [reportTitle, setReportTitle] = useState("Untitled Report");

  // Enhanced features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [savedViews, setSavedViews] = useState([
    { id: "1", name: "Active Reports", filter: "active" },
    { id: "2", name: "Financial Reports", filter: "financial" },
    { id: "3", name: "This Month", filter: "monthly" },
  ]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [aiInsights] = useState([
    {
      type: "recommendation",
      message: "Schedule your most accessed reports for automatic delivery",
      icon: TrendingUp,
    },
    {
      type: "alert",
      message: "2 reports failed generation - check data sources",
      icon: Sparkles,
    },
    {
      type: "info",
      message: "Report generation time improved 18% with caching",
      icon: Brain,
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

  // Bulk selection handlers
  const toggleReportSelection = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const toggleAllReports = () => {
    setSelectedReports((prev) =>
      prev.length === filteredReports.length
        ? []
        : filteredReports.map((r) => r.id)
    );
  };

  // Export handlers
  const handleExport = (format: string) => {
    console.log(`Exporting reports as ${format}`);
    setShowExportMenu(false);
  };

  // Add widget to builder
  const addWidgetToBuilder = (widget: ReportWidget) => {
    setBuilderWidgets((prev) => [
      ...prev,
      { ...widget, id: `${widget.id}-${Date.now()}` },
    ]);
  };

  // Remove widget from builder
  const removeWidgetFromBuilder = (widgetId: string) => {
    setBuilderWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  };

  // Move widget in builder
  const moveWidget = (fromIndex: number, toIndex: number) => {
    const updated = [...builderWidgets];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setBuilderWidgets(updated);
  };

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = [
    {
      label: "Total Reports",
      value: mockReports.length,
      change: "+2",
      trend: "up",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Generated This Month",
      value: 24,
      change: "+8",
      trend: "up",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Scheduled Reports",
      value: mockScheduledReports.filter((r) => r.enabled).length,
      change: "0",
      trend: "neutral",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Failed Reports",
      value: mockReports.filter((r) => r.status === "failed").length,
      change: "-1",
      trend: "down",
      icon: <AlertCircle className="h-5 w-5" />,
    },
  ];

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <FileSpreadsheet className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Reports
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Generate, schedule, and export system reports
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white
                     hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
          >
            <Plus className="h-4 w-4" />
            Create Report
          </button>
        </motion.div>

        {/* Enhanced Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {/* Live Refresh Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <motion.div
              animate={isAutoRefresh ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {isAutoRefresh ? "Live" : "Paused"}
            </span>
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              {isAutoRefresh ? "Pause" : "Resume"}
            </button>
          </div>

          {/* Saved Views */}
          <div className="flex items-center gap-1">
            {savedViews.map((view) => (
              <button
                key={view.id}
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {view.name}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedReports.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800"
            >
              <span className="text-xs text-indigo-600 dark:text-indigo-400">
                {selectedReports.length} selected
              </span>
              <button className="text-xs text-green-600 hover:text-green-700">
                Generate
              </button>
              <button className="text-xs text-blue-600 hover:text-blue-700">
                Schedule
              </button>
              <button className="text-xs text-red-600 hover:text-red-700">
                Delete
              </button>
            </motion.div>
          )}

          {/* Export Menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={() => handleExport("csv")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <FileJson className="h-3.5 w-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last Refresh */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className="h-3 w-3" />
            {lastRefresh.toLocaleTimeString()}
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              AI Insights
            </span>
            <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full">
              3 new
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.05 }}
                className="flex items-start gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg"
              >
                <insight.icon
                  className={`h-4 w-4 mt-0.5 ${
                    insight.type === "alert"
                      ? "text-amber-500"
                      : insight.type === "recommendation"
                        ? "text-green-500"
                        : "text-blue-500"
                  }`}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {insight.message}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700">
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium
                  ${stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-red-500" : "text-slate-500"}`}
                >
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {stat.trend === "down" && (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          {(["all", "scheduled", "custom", "builder"] as TabType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
                  activeTab === tab
                    ? tab === "builder"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {tab === "builder" && <Sparkles className="h-4 w-4" />}
                {tab === "all"
                  ? "All Reports"
                  : tab === "scheduled"
                    ? "Scheduled"
                    : tab === "builder"
                      ? "Visual Builder"
                      : "Custom Reports"}
              </button>
            )
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="usage">Usage</option>
              <option value="financial">Financial</option>
              <option value="user">User</option>
              <option value="content">Content</option>
              <option value="system">System</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Reports List, Scheduled, or Builder */}
        {activeTab === "builder" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Builder Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white"
                      placeholder="Report Title"
                    />
                    <p className="text-sm text-slate-500">
                      Drag and drop widgets to build your custom report
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Widget Palette */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  Available Widgets
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableWidgets.map((widget) => (
                    <motion.button
                      key={widget.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addWidgetToBuilder(widget)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {widget.icon}
                      <span>{widget.title}</span>
                      <Plus className="h-3 w-3 text-slate-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Builder Canvas */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 min-h-[400px]">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                Report Layout
              </h3>

              {builderWidgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                    <Plus className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-center">
                    Click widgets above to add them to your report
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Drag to reorder, click × to remove
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-4">
                  {builderWidgets.map((widget, index) => (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "relative p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl group",
                        widget.width === "full"
                          ? "col-span-6"
                          : widget.width === "half"
                            ? "col-span-3"
                            : "col-span-2"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-700">
                          {widget.icon}
                        </div>
                        <span className="font-medium text-sm">
                          {widget.title}
                        </span>
                        <button
                          onClick={() => removeWidgetFromBuilder(widget.id)}
                          className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Widget Preview */}
                      <div className="h-24 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <span className="text-xs text-slate-400">
                          {widget.type === "chart"
                            ? "Chart Preview"
                            : widget.type === "table"
                              ? "Table Preview"
                              : widget.type === "metric"
                                ? "Metric Value"
                                : "Text Content"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-400">
                        Data: {widget.dataSource}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === "scheduled" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {mockScheduledReports.map((scheduled, index) => (
              <motion.div
                key={scheduled.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl ${scheduled.enabled ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-100 dark:bg-slate-700"}`}
                    >
                      <Calendar
                        className={`h-5 w-5 ${scheduled.enabled ? "text-emerald-500" : "text-slate-400"}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {scheduled.reportName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {scheduled.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Next run: {scheduled.nextRun}
                      </p>
                      <p className="text-xs text-slate-500">
                        {scheduled.recipients.length} recipient(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          scheduled.enabled
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {scheduled.enabled ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Report
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Frequency
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Last Generated
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => {
                    const typeConf = reportTypeConfig[report.type];
                    const statusConf = statusConfig[report.status];
                    return (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="border-b border-slate-100 dark:border-slate-700/50 last:border-0
                                 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {report.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md truncate">
                              {report.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeConf.color}`}
                          >
                            {typeConf.icon}
                            {typeConf.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                            {report.frequency}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-sm ${statusConf.color}`}
                          >
                            {statusConf.icon}
                            {statusConf.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {report.lastGenerated}
                            </p>
                            {report.size && (
                              <p className="text-xs text-slate-400">
                                {report.size}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {report.status === "ready" && (
                              <button className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Quick Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                   border border-indigo-200 dark:border-indigo-800"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Export
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "User Data", icon: <Users className="h-5 w-5" /> },
              {
                label: "Financial Summary",
                icon: <LineChart className="h-5 w-5" />,
              },
              {
                label: "Content Stats",
                icon: <PieChart className="h-5 w-5" />,
              },
              { label: "Full Backup", icon: <Download className="h-5 w-5" /> },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 
                         border border-slate-200 dark:border-slate-700
                         hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                  {item.icon}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default AdminReportsPage;
