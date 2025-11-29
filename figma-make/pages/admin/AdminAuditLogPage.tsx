"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Eye,
  FileText,
  Globe,
  Key,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
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
} from "lucide-react";
import React, { useState } from "react";

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
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                           text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </motion.div>

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
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredLogs.map((log, index) => {
              const catConfig = categoryConfig[log.category];
              const sevConfig = severityConfig[log.severity];
              const actionIcon = actionIconMap[log.action] || (
                <Activity className="h-4 w-4" />
              );

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  onClick={() => setSelectedEntry(log)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Indicator */}
                    <div className="flex flex-col items-center gap-1 w-16 flex-shrink-0">
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
                      className={`p-2.5 rounded-xl ${catConfig.color} flex-shrink-0`}
                    >
                      {actionIcon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
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
                onClick={(e) => e.stopPropagation()}
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
      </div>
    </DashboardLayout>
  );
}

export default AdminAuditLogPage;
