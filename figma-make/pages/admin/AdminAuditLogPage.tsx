"use client";

/**
 * AdminAuditLogPage - System Audit Logs Management
 *
 * Enhanced with:
 * - Real-time data refresh indicators
 * - Advanced filtering with saved views
 * - Bulk actions with confirmation
 * - Export functionality
 * - AI-powered insights panel
 */

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  BookmarkPlus,
  Brain,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  Key,
  Lightbulb,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  Save,
  Search,
  Server,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminAuditLogPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  category:
    | "auth"
    | "user"
    | "content"
    | "admin"
    | "system"
    | "api"
    | "security";
  severity: "info" | "warning" | "error" | "critical";
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  details: string;
  ipAddress: string;
  userAgent: string;
  resource?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2025-11-27T14:32:15Z",
    action: "user.login",
    category: "auth",
    severity: "info",
    user: { id: "u1", name: "John Doe", email: "john@example.com" },
    details: "Successful login via OAuth (Google)",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome 120.0 / Windows 11",
  },
  {
    id: "2",
    timestamp: "2025-11-27T14:28:00Z",
    action: "user.role_change",
    category: "admin",
    severity: "warning",
    user: { id: "u2", name: "Admin User", email: "admin@scholarflow.com" },
    details: "Changed user role from 'researcher' to 'team_lead'",
    ipAddress: "10.0.0.50",
    userAgent: "Firefox 121.0 / macOS",
    resource: "user:sarah@example.com",
    changes: [{ field: "role", oldValue: "researcher", newValue: "team_lead" }],
  },
  {
    id: "3",
    timestamp: "2025-11-27T14:15:30Z",
    action: "paper.upload",
    category: "content",
    severity: "info",
    user: { id: "u3", name: "Sarah Chen", email: "sarah@example.com" },
    details: "Uploaded research paper 'Machine Learning in Healthcare'",
    ipAddress: "172.16.0.23",
    userAgent: "Safari 17.1 / iOS",
    resource: "paper:ml-healthcare-2025.pdf",
  },
  {
    id: "4",
    timestamp: "2025-11-27T14:10:00Z",
    action: "auth.failed_login",
    category: "security",
    severity: "error",
    user: null,
    details: "Failed login attempt for email: unknown@attack.com (5th attempt)",
    ipAddress: "203.0.113.42",
    userAgent: "curl/7.84.0",
  },
  {
    id: "5",
    timestamp: "2025-11-27T14:05:45Z",
    action: "api.rate_limit",
    category: "api",
    severity: "warning",
    user: { id: "u4", name: "API Bot", email: "bot@integration.com" },
    details: "Rate limit exceeded on /api/papers endpoint (100 req/min)",
    ipAddress: "52.45.123.89",
    userAgent: "axios/1.6.0",
  },
  {
    id: "6",
    timestamp: "2025-11-27T13:55:00Z",
    action: "user.delete",
    category: "admin",
    severity: "critical",
    user: { id: "u2", name: "Admin User", email: "admin@scholarflow.com" },
    details: "Permanently deleted user account and associated data",
    ipAddress: "10.0.0.50",
    userAgent: "Chrome 120.0 / Windows 11",
    resource: "user:deleted-user@example.com",
  },
  {
    id: "7",
    timestamp: "2025-11-27T13:45:20Z",
    action: "system.backup",
    category: "system",
    severity: "info",
    user: null,
    details: "Automated daily backup completed successfully (2.4 GB)",
    ipAddress: "127.0.0.1",
    userAgent: "System Scheduler",
  },
  {
    id: "8",
    timestamp: "2025-11-27T13:30:00Z",
    action: "workspace.settings_change",
    category: "admin",
    severity: "info",
    user: { id: "u5", name: "Team Lead", email: "lead@example.com" },
    details: "Updated workspace visibility and sharing settings",
    ipAddress: "192.168.2.100",
    userAgent: "Edge 120.0 / Windows 11",
    resource: "workspace:research-lab",
    changes: [
      { field: "visibility", oldValue: "private", newValue: "team" },
      { field: "allow_external_sharing", oldValue: "false", newValue: "true" },
    ],
  },
  {
    id: "9",
    timestamp: "2025-11-27T13:15:10Z",
    action: "user.password_reset",
    category: "auth",
    severity: "info",
    user: { id: "u6", name: "Mike Johnson", email: "mike@example.com" },
    details: "Password reset completed via email verification",
    ipAddress: "98.45.67.123",
    userAgent: "Chrome 120.0 / Android",
  },
  {
    id: "10",
    timestamp: "2025-11-27T13:00:00Z",
    action: "security.2fa_enabled",
    category: "security",
    severity: "info",
    user: { id: "u1", name: "John Doe", email: "john@example.com" },
    details: "Two-factor authentication enabled via authenticator app",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome 120.0 / Windows 11",
  },
];

const categoryConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  auth: {
    icon: <Key className="h-4 w-4" />,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    label: "Authentication",
  },
  user: {
    icon: <User className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    label: "User",
  },
  content: {
    icon: <FileText className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    label: "Content",
  },
  admin: {
    icon: <Shield className="h-4 w-4" />,
    color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    label: "Admin",
  },
  system: {
    icon: <Server className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-900/30",
    label: "System",
  },
  api: {
    icon: <Globe className="h-4 w-4" />,
    color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    label: "API",
  },
  security: {
    icon: <Lock className="h-4 w-4" />,
    color: "text-red-500 bg-red-100 dark:bg-red-900/30",
    label: "Security",
  },
};

const severityConfig: Record<string, { color: string; bgColor: string }> = {
  info: { color: "text-blue-500", bgColor: "bg-blue-500" },
  warning: { color: "text-amber-500", bgColor: "bg-amber-500" },
  error: { color: "text-red-500", bgColor: "bg-red-500" },
  critical: { color: "text-red-600", bgColor: "bg-red-600" },
};

const actionIconMap: Record<string, React.ReactNode> = {
  "user.login": <LogIn className="h-4 w-4" />,
  "user.logout": <LogOut className="h-4 w-4" />,
  "user.role_change": <UserCheck className="h-4 w-4" />,
  "user.delete": <UserMinus className="h-4 w-4" />,
  "user.password_reset": <Key className="h-4 w-4" />,
  "user.create": <UserPlus className="h-4 w-4" />,
  "paper.upload": <Upload className="h-4 w-4" />,
  "paper.delete": <Trash2 className="h-4 w-4" />,
  "auth.failed_login": <AlertTriangle className="h-4 w-4" />,
  "api.rate_limit": <Activity className="h-4 w-4" />,
  "system.backup": <Database className="h-4 w-4" />,
  "workspace.settings_change": <Settings className="h-4 w-4" />,
  "security.2fa_enabled": <Shield className="h-4 w-4" />,
};

// Saved filter views
const savedViews = [
  {
    id: "security-events",
    name: "Security Events",
    filters: { category: "security", severity: "all" },
    icon: Shield,
  },
  {
    id: "failed-logins",
    name: "Failed Logins",
    filters: { category: "auth", severity: "error" },
    icon: AlertTriangle,
  },
  {
    id: "admin-actions",
    name: "Admin Actions",
    filters: { category: "admin", severity: "all" },
    icon: UserCheck,
  },
  {
    id: "critical-only",
    name: "Critical Only",
    filters: { category: "all", severity: "critical" },
    icon: Zap,
  },
];

// AI Insights data
const aiInsights = [
  {
    id: "1",
    type: "warning",
    title: "Unusual Login Pattern Detected",
    description:
      "5 failed login attempts from IP 192.168.1.45 in the last hour",
    action: "Review security logs",
    priority: "high",
  },
  {
    id: "2",
    type: "info",
    title: "Peak Activity Period",
    description: "User activity is 40% higher than usual between 2-4 PM",
    action: "Consider scaling resources",
    priority: "low",
  },
  {
    id: "3",
    type: "success",
    title: "Security Compliance",
    description: "All admin actions properly logged with 2FA verification",
    action: null,
    priority: "low",
  },
];

// Export formats
const exportFormats = [
  {
    id: "csv",
    label: "CSV",
    icon: FileSpreadsheet,
    description: "Spreadsheet format",
  },
  { id: "json", label: "JSON", icon: FileText, description: "Raw data format" },
  {
    id: "pdf",
    label: "PDF Report",
    icon: Download,
    description: "Formatted report",
  },
];

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  role: "admin" as const,
};

export function AdminAuditLogPage({
  onNavigate,
  role: propRole,
}: AdminAuditLogPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("today");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  // New state for enhanced features
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionConfirm, setBulkActionConfirm] = useState<string | null>(
    null
  );
  const [saveViewModal, setSaveViewModal] = useState(false);
  const [newViewName, setNewViewName] = useState("");

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  // Handle export
  const handleExport = (format: string) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      setShowExportMenu(false);
    }, 2000);
  };

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    setBulkActionConfirm(action);
  };

  const executeBulkAction = () => {
    // Simulate bulk action
    setTimeout(() => {
      setSelectedLogs([]);
      setBulkActionConfirm(null);
      setShowBulkActions(false);
    }, 500);
  };

  // Apply saved view
  const applyView = (view: (typeof savedViews)[0]) => {
    setCategoryFilter(view.filters.category);
    setSeverityFilter(view.filters.severity);
    setActiveView(view.id);
    setShowSavedViews(false);
  };

  // Toggle log selection
  const toggleLogSelection = (id: string) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all logs
  const toggleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map((log) => log.id));
    }
  };
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (log.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesCategory =
      categoryFilter === "all" || log.category === categoryFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Audit Log
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track all system activities and changes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time refresh indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div
                className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {autoRefresh ? "Live" : "Paused"}
              </span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-xs text-primary hover:underline"
              >
                {autoRefresh ? "Pause" : "Resume"}
              </button>
            </div>

            {/* Last refresh time */}
            <span className="text-xs text-slate-500 hidden sm:block">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>

            {/* Saved Views Button */}
            <div className="relative">
              <button
                onClick={() => setShowSavedViews(!showSavedViews)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <BookmarkPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Views</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showSavedViews && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl 
                             border border-slate-200 dark:border-slate-700 shadow-xl z-20 p-2"
                  >
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-2">
                      Saved Views
                    </div>
                    {savedViews.map((view) => {
                      const Icon = view.icon;
                      return (
                        <button
                          key={view.id}
                          onClick={() => applyView(view)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            activeView === view.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{view.name}</span>
                          {activeView === view.id && (
                            <CheckCircle className="h-4 w-4 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowSavedViews(false);
                          setSaveViewModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10"
                      >
                        <Save className="h-4 w-4" />
                        Save Current View
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl 
                             border border-slate-200 dark:border-slate-700 shadow-xl z-20 p-2"
                  >
                    {exportFormats.map((format) => {
                      const Icon = format.icon;
                      return (
                        <button
                          key={format.id}
                          onClick={() => handleExport(format.id)}
                          disabled={exporting !== null}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                   hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-slate-500" />
                          <div className="flex-1 text-left">
                            <div className="text-sm text-slate-700 dark:text-slate-300">
                              {format.label}
                            </div>
                            <div className="text-xs text-slate-500">
                              {format.description}
                            </div>
                          </div>
                          {exporting === format.id && (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors
                           disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <AnimatePresence>
          {showAIInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div
                className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5 
                            rounded-2xl border border-violet-200 dark:border-violet-800 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/50">
                      <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        AI-Powered Insights
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Smart analysis of your audit logs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAIInsights(false)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {aiInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        insight.type === "warning"
                          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                          : insight.type === "success"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            insight.type === "warning"
                              ? "bg-amber-100 dark:bg-amber-900/50"
                              : insight.type === "success"
                                ? "bg-emerald-100 dark:bg-emerald-900/50"
                                : "bg-blue-100 dark:bg-blue-900/50"
                          }`}
                        >
                          {insight.type === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          ) : insight.type === "success" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                            {insight.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <button className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1">
                              {insight.action}
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
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
          {selectedLogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedLogs.length} log{selectedLogs.length > 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction("export")}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 
                           dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => handleBulkAction("archive")}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 
                           dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => setSelectedLogs([])}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {[
            { label: "Total Events", value: "1,248", color: "text-slate-600" },
            { label: "Info", value: "892", color: "text-blue-500" },
            { label: "Warnings", value: "234", color: "text-amber-500" },
            { label: "Errors", value: "98", color: "text-red-500" },
            { label: "Critical", value: "24", color: "text-red-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by action, user, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                         bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                           bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm
                           focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="auth">Authentication</option>
                  <option value="user">User</option>
                  <option value="content">Content</option>
                  <option value="admin">Admin</option>
                  <option value="system">System</option>
                  <option value="api">API</option>
                  <option value="security">Security</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                           bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm
                           focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Severity</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                           bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm
                           focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="custom">Custom range</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Audit Log Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Table Header with Select All */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedLogs.length === filteredLogs.length &&
                filteredLogs.length > 0
                  ? "bg-primary border-primary text-white"
                  : "border-slate-300 dark:border-slate-600 hover:border-primary"
              }`}
            >
              {selectedLogs.length === filteredLogs.length &&
                filteredLogs.length > 0 && <Check className="h-3 w-3" />}
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {selectedLogs.length > 0
                ? `${selectedLogs.length} selected`
                : "Select all"}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredLogs.map((log, index) => {
              const catConfig = categoryConfig[log.category];
              const sevConfig = severityConfig[log.severity];
              const actionIcon = actionIconMap[log.action] || (
                <Activity className="h-4 w-4" />
              );
              const isSelected = selectedLogs.includes(log.id);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLogSelection(log.id);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-1 ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-slate-300 dark:border-slate-600 hover:border-primary"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>

                    {/* Severity Indicator */}
                    <div
                      onClick={() => setSelectedEntry(log)}
                      className="flex flex-col items-center gap-1 w-16 flex-shrink-0"
                    >
                      <span className="text-xs font-medium text-slate-500">
                        {formatTime(log.timestamp)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(log.timestamp)}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full mt-1 ${sevConfig.bgColor}`}
                      />
                    </div>

                    {/* Icon */}
                    <div
                      onClick={() => setSelectedEntry(log)}
                      className={`p-2.5 rounded-xl ${catConfig.color} flex-shrink-0`}
                    >
                      {actionIcon}
                    </div>

                    {/* Content */}
                    <div
                      onClick={() => setSelectedEntry(log)}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {log.action.replace(".", " → ").replace(/_/g, " ")}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${catConfig.color}`}
                        >
                          {catConfig.label}
                        </span>
                        {log.severity === "critical" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600">
                            Critical
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {log.user && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>{log.user.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3 w-3" />
                          <span>{log.ipAddress}</span>
                        </div>
                        {log.resource && (
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">
                              {log.resource}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing 1-10 of {filteredLogs.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      currentPage === page
                        ? "bg-amber-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-slate-900 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Event Details
                  </h2>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Action */}
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Action
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedEntry.action}
                    </p>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Details
                    </label>
                    <p className="text-slate-700 dark:text-slate-300">
                      {selectedEntry.details}
                    </p>
                  </div>

                  {/* User & IP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        User
                      </label>
                      {selectedEntry.user ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {selectedEntry.user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {selectedEntry.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500">System / Anonymous</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        IP Address
                      </label>
                      <p className="text-slate-900 dark:text-white font-mono">
                        {selectedEntry.ipAddress}
                      </p>
                    </div>
                  </div>

                  {/* User Agent */}
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      User Agent
                    </label>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      {selectedEntry.userAgent}
                    </p>
                  </div>

                  {/* Changes */}
                  {selectedEntry.changes &&
                    selectedEntry.changes.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                          Changes
                        </label>
                        <div className="space-y-2">
                          {selectedEntry.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900"
                            >
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-24">
                                {change.field}
                              </span>
                              <span className="text-sm text-red-500 line-through">
                                {change.oldValue}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span className="text-sm text-emerald-500">
                                {change.newValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Timestamp */}
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Timestamp
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {new Date(selectedEntry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Action Confirmation Modal */}
        <AnimatePresence>
          {bulkActionConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBulkActionConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Confirm{" "}
                      {bulkActionConfirm === "export" ? "Export" : "Archive"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      This action will affect {selectedLogs.length} log entries
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {bulkActionConfirm === "export"
                    ? "The selected logs will be exported to your downloads folder."
                    : "The selected logs will be archived and removed from the main view."}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setBulkActionConfirm(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                             text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkAction}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                  >
                    {bulkActionConfirm === "export" ? "Export" : "Archive"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save View Modal */}
        <AnimatePresence>
          {saveViewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSaveViewModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BookmarkPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Save Current View
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Save your current filters as a quick-access view
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    View Name
                  </label>
                  <input
                    type="text"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="e.g., Security Alerts"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 
                             bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 mb-6">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Filters:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      Category: {categoryFilter}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      Severity: {severityFilter}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      Date: {dateRange}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSaveViewModal(false);
                      setNewViewName("");
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                             text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, save the view
                      setSaveViewModal(false);
                      setNewViewName("");
                    }}
                    disabled={!newViewName.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    Save View
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

export default AdminAuditLogPage;
