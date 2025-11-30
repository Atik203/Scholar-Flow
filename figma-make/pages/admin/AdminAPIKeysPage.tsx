"use client";

/**
 * AdminAPIKeysPage - API Key Management for Integrations
 *
 * Features:
 * - Create and revoke API keys
 * - Scope and permission management
 * - Usage analytics per key
 * - Rate limit configuration
 * - Key rotation reminders
 * - Audit trail
 *
 * @author Md. Atikur Rahaman
 * @version 1.0.0 - Phase 7
 */

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bookmark,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  FileText,
  Globe,
  Info,
  Key,
  Lightbulb,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Unlock,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminAPIKeysPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Types
interface APIKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  description: string;
  status: "active" | "revoked" | "expired";
  scopes: string[];
  rateLimit: number;
  createdAt: Date;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  totalRequests: number;
  requestsThisMonth: number;
  createdBy: string;
}

interface APIKeyUsage {
  date: Date;
  requests: number;
  errors: number;
  avgLatency: number;
}

interface Scope {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

// Mock data
const mockAPIKeys: APIKey[] = [
  {
    id: "key-1",
    name: "Production Integration",
    key: "sf_live_prod_1234567890abcdefghijklmnop",
    maskedKey: "sf_live_prod_**********************mnop",
    description: "Main production API key for external integrations",
    status: "active",
    scopes: ["papers:read", "papers:write", "collections:read", "users:read"],
    rateLimit: 10000,
    createdAt: new Date("2025-08-15"),
    expiresAt: new Date("2026-08-15"),
    lastUsedAt: new Date("2025-11-29T10:45:00"),
    totalRequests: 125420,
    requestsThisMonth: 8540,
    createdBy: "admin@scholarflow.com",
  },
  {
    id: "key-2",
    name: "Analytics Dashboard",
    key: "sf_live_analytics_xyz789abcdef",
    maskedKey: "sf_live_analytics_****cdef",
    description: "Read-only key for analytics platform",
    status: "active",
    scopes: ["analytics:read", "papers:read"],
    rateLimit: 5000,
    createdAt: new Date("2025-09-01"),
    expiresAt: null,
    lastUsedAt: new Date("2025-11-29T11:30:00"),
    totalRequests: 45230,
    requestsThisMonth: 3200,
    createdBy: "developer@scholarflow.com",
  },
  {
    id: "key-3",
    name: "CI/CD Pipeline",
    key: "sf_test_cicd_testkey12345",
    maskedKey: "sf_test_cicd_****5",
    description: "Test environment key for automated deployments",
    status: "active",
    scopes: ["papers:read", "papers:write", "test:all"],
    rateLimit: 1000,
    createdAt: new Date("2025-10-10"),
    expiresAt: new Date("2025-12-31"),
    lastUsedAt: new Date("2025-11-28T16:00:00"),
    totalRequests: 2340,
    requestsThisMonth: 890,
    createdBy: "devops@scholarflow.com",
  },
  {
    id: "key-4",
    name: "Legacy Integration",
    key: "sf_live_legacy_oldkey",
    maskedKey: "sf_live_legacy_****y",
    description: "Deprecated - migrate to new key by Dec 2025",
    status: "expired",
    scopes: ["papers:read"],
    rateLimit: 100,
    createdAt: new Date("2025-01-15"),
    expiresAt: new Date("2025-10-15"),
    lastUsedAt: new Date("2025-10-14T23:59:00"),
    totalRequests: 15000,
    requestsThisMonth: 0,
    createdBy: "admin@scholarflow.com",
  },
  {
    id: "key-5",
    name: "Compromised Key",
    key: "sf_live_comp_revoked123",
    maskedKey: "sf_live_comp_****23",
    description: "Revoked due to security incident",
    status: "revoked",
    scopes: ["papers:read", "papers:write"],
    rateLimit: 5000,
    createdAt: new Date("2025-07-01"),
    expiresAt: null,
    lastUsedAt: new Date("2025-09-15T08:00:00"),
    totalRequests: 8900,
    requestsThisMonth: 0,
    createdBy: "admin@scholarflow.com",
  },
];

const mockUsageData: APIKeyUsage[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
  requests: Math.floor(Math.random() * 500) + 100,
  errors: Math.floor(Math.random() * 10),
  avgLatency: Math.floor(Math.random() * 100) + 50,
}));

const scopes: Scope[] = [
  {
    id: "papers:read",
    name: "Read Papers",
    description: "View papers and metadata",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "papers:write",
    name: "Write Papers",
    description: "Create and modify papers",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "papers:delete",
    name: "Delete Papers",
    description: "Remove papers permanently",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "collections:read",
    name: "Read Collections",
    description: "View collections",
    category: "Collections",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "collections:write",
    name: "Write Collections",
    description: "Create and modify collections",
    category: "Collections",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "users:read",
    name: "Read Users",
    description: "View user profiles",
    category: "Users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "users:write",
    name: "Write Users",
    description: "Modify user data",
    category: "Users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "analytics:read",
    name: "Read Analytics",
    description: "Access analytics data",
    category: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "webhooks:manage",
    name: "Manage Webhooks",
    description: "Create and configure webhooks",
    category: "Admin",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "admin:all",
    name: "Full Admin Access",
    description: "Complete administrative control",
    category: "Admin",
    icon: <Shield className="h-4 w-4" />,
  },
];

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  image: null,
  role: "admin" as const,
};

export function AdminAPIKeysPage({
  onNavigate,
  role: propRole,
}: AdminAPIKeysPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [apiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyDetails, setShowKeyDetails] = useState<APIKey | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [newKeyExpiry, setNewKeyExpiry] = useState<string>("");

  // Enhanced features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [savedViews] = useState([
    { id: "1", name: "Active Production Keys", filters: { status: "active" } },
    { id: "2", name: "Expiring Soon", filters: { status: "active" } },
    { id: "3", name: "High Usage Keys", filters: { status: "all" } },
  ]);
  const [aiInsights] = useState([
    {
      id: "1",
      type: "warning",
      title: "Key Rotation Recommended",
      description: "2 API keys haven't been rotated in over 90 days",
      action: "Review Keys",
    },
    {
      id: "2",
      type: "optimization",
      title: "Unused Scopes Detected",
      description:
        "Production Integration has 2 scopes that haven't been used in 30 days",
      action: "Optimize",
    },
    {
      id: "3",
      type: "security",
      title: "Rate Limit Alert",
      description: "CI/CD Pipeline key is approaching 80% of rate limit",
      action: "Increase Limit",
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
    if (selectedKeys.length === filteredKeys.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(filteredKeys.map((k) => k.id));
    }
  };

  const handleBulkRevoke = () => {
    // Handle bulk revoke
    setSelectedKeys([]);
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    // Handle export
    setShowExportMenu(false);
  };

  // Filter API keys
  const filteredKeys = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch =
        key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || key.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apiKeys, searchQuery, statusFilter]);

  // Stats
  const stats = {
    totalKeys: apiKeys.length,
    activeKeys: apiKeys.filter((k) => k.status === "active").length,
    totalRequests: apiKeys.reduce((sum, k) => sum + k.requestsThisMonth, 0),
    avgLatency:
      mockUsageData.reduce((sum, d) => sum + d.avgLatency, 0) /
      mockUsageData.length,
  };

  const toggleKeyVisibility = (keyId: string) => {
    setRevealedKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <CheckCircle className="h-3 w-3" />
            Active
          </span>
        );
      case "revoked":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <XCircle className="h-3 w-3" />
            Revoked
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            <Clock className="h-3 w-3" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDaysUntilExpiry = (expiresAt: Date | null) => {
    if (!expiresAt) return null;
    const days = Math.ceil(
      (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  API Key Management
                </h1>
                {/* Real-time refresh indicator */}
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: isAutoRefresh ? [1, 0.5, 1] : 1 }}
                    transition={{
                      duration: 2,
                      repeat: isAutoRefresh ? Infinity : 0,
                    }}
                    className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isAutoRefresh ? "Live" : "Paused"} • Updated{" "}
                    {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create, manage, and monitor API keys for integrations
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`p-2 rounded-lg transition-colors ${isAutoRefresh ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                title={
                  isAutoRefresh ? "Pause auto-refresh" : "Enable auto-refresh"
                }
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
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
                          Saved Views
                        </p>
                      </div>
                      {savedViews.map((view) => (
                        <button
                          key={view.id}
                          onClick={() => {
                            setStatusFilter(view.filters.status);
                            setShowSavedViews(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Bookmark className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{view.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Export as CSV</span>
                      </button>
                      <button
                        onClick={() => handleExport("json")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FileJson className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Export as JSON</span>
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Export as PDF</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Insights Toggle */}
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showAIInsights ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">AI Insights</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
              >
                <Plus className="h-5 w-5" />
                Create API Key
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
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                      AI-Powered Insights
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiInsights.map((insight) => (
                      <motion.div
                        key={insight.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg bg-white dark:bg-gray-800 border ${
                          insight.type === "warning"
                            ? "border-amber-200 dark:border-amber-800"
                            : insight.type === "security"
                              ? "border-red-200 dark:border-red-800"
                              : "border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb
                            className={`h-4 w-4 mt-0.5 ${
                              insight.type === "warning"
                                ? "text-amber-500"
                                : insight.type === "security"
                                  ? "text-red-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {insight.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {insight.description}
                            </p>
                            <button className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-2 hover:underline">
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
            {selectedKeys.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    {selectedKeys.length} key
                    {selectedKeys.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkRevoke}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Revoke Selected
                  </button>
                  <button
                    onClick={() => setSelectedKeys([])}
                    className="p-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-orange-600" />
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
                label: "Total Keys",
                value: stats.totalKeys,
                icon: Key,
                color: "orange",
              },
              {
                label: "Active",
                value: stats.activeKeys,
                icon: Zap,
                color: "green",
              },
              {
                label: "Requests/Month",
                value: formatNumber(stats.totalRequests),
                icon: Activity,
                color: "blue",
              },
              {
                label: "Avg. Latency",
                value: `${stats.avgLatency.toFixed(0)}ms`,
                icon: Clock,
                color: "purple",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700/50 shadow-sm"
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
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* API Keys List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm overflow-hidden"
          >
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search API keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Keys List */}
            <div className="p-4">
              {filteredKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No API keys found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredKeys.map((apiKey, index) => {
                    const daysUntilExpiry = getDaysUntilExpiry(
                      apiKey.expiresAt
                    );
                    const isExpiringSoon =
                      daysUntilExpiry !== null &&
                      daysUntilExpiry <= 30 &&
                      daysUntilExpiry > 0;

                    return (
                      <motion.div
                        key={apiKey.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border ${
                          isExpiringSoon
                            ? "border-yellow-300 dark:border-yellow-600"
                            : "border-gray-200 dark:border-slate-700"
                        } hover:border-orange-300 dark:hover:border-orange-600 transition-all`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {apiKey.name}
                                  </h3>
                                  {getStatusBadge(apiKey.status)}
                                  {isExpiringSoon && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                      <AlertTriangle className="h-3 w-3" />
                                      Expires in {daysUntilExpiry} days
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {apiKey.description}
                                </p>
                              </div>
                            </div>

                            {/* Key Display */}
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 font-mono">
                                {revealedKeys[apiKey.id]
                                  ? apiKey.key
                                  : apiKey.maskedKey}
                              </code>
                              <button
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title={
                                  revealedKeys[apiKey.id]
                                    ? "Hide Key"
                                    : "Show Key"
                                }
                              >
                                {revealedKeys[apiKey.id] ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Copy Key"
                              >
                                <Copy className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Created: {formatDate(apiKey.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5" />
                                Last used: {formatDate(apiKey.lastUsedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <BarChart3 className="h-3.5 w-3.5" />
                                {formatNumber(apiKey.requestsThisMonth)}{" "}
                                requests this month
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="h-3.5 w-3.5" />
                                Rate limit: {formatNumber(apiKey.rateLimit)}
                                /hour
                              </span>
                            </div>

                            {/* Scopes */}
                            <div className="flex flex-wrap gap-2">
                              {apiKey.scopes.map((scope) => (
                                <span
                                  key={scope}
                                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"
                                >
                                  {scope}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowKeyDetails(apiKey)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Settings className="h-4 w-4 text-gray-500" />
                            </button>
                            {apiKey.status === "active" && (
                              <>
                                <button
                                  className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Regenerate Key"
                                >
                                  <RefreshCw className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Revoke Key"
                                >
                                  <Lock className="h-4 w-4 text-red-500" />
                                </button>
                              </>
                            )}
                            {apiKey.status === "revoked" && (
                              <button
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                title="Reactivate Key"
                              >
                                <Unlock className="h-4 w-4 text-green-500" />
                              </button>
                            )}
                            <button
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete Key"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Security Best Practices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  API Key Security Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Never share API keys in public repositories or client-side
                    code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Use environment variables to store keys securely
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Rotate keys regularly and set expiration dates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Use the principle of least privilege when assigning scopes
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Create API Key Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create API Key
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Production Integration"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of this key's purpose"
                      rows={2}
                      value={newKeyDescription}
                      onChange={(e) => setNewKeyDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rate Limit (requests/hour)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={100000}
                        value={newKeyRateLimit}
                        onChange={(e) =>
                          setNewKeyRateLimit(Number(e.target.value))
                        }
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={newKeyExpiry}
                        onChange={(e) => setNewKeyExpiry(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for no expiration
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Permissions (Scopes) *
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {Object.entries(
                        scopes.reduce(
                          (acc, scope) => {
                            if (!acc[scope.category]) acc[scope.category] = [];
                            acc[scope.category].push(scope);
                            return acc;
                          },
                          {} as Record<string, Scope[]>
                        )
                      ).map(([category, categoryScopes]) => (
                        <div key={category} className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {category}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {categoryScopes.map((scope) => (
                              <label
                                key={scope.id}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                  selectedScopes.includes(scope.id)
                                    ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600"
                                    : "bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700"
                                } border hover:border-orange-300 dark:hover:border-orange-600`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedScopes.includes(scope.id)}
                                  onChange={() => toggleScope(scope.id)}
                                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {scope.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-medium">Important</p>
                      <p className="mt-1">
                        The API key will only be shown once after creation. Make
                        sure to copy and store it securely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!newKeyName || selectedScopes.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create API Key
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Details Modal */}
        <AnimatePresence>
          {showKeyDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowKeyDetails(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {showKeyDetails.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {showKeyDetails.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowKeyDetails(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Usage Chart Placeholder */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Usage Over Time
                    </h3>
                    <div className="h-48 bg-gray-100 dark:bg-slate-900/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Usage chart visualization</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Requests
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(showKeyDetails.totalRequests)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This Month
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(showKeyDetails.requestsThisMonth)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Rate Limit
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(showKeyDetails.rateLimit)}/hr
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created By
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {showKeyDetails.createdBy}
                      </p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Permissions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {showKeyDetails.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Created on {formatDate(showKeyDetails.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last used: {formatDate(showKeyDetails.lastUsedAt)}
                        </span>
                      </div>
                      {showKeyDetails.expiresAt && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Expires on {formatDate(showKeyDetails.expiresAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Lock className="h-4 w-4" />
                    Revoke Key
                  </button>
                  <button
                    onClick={() => setShowKeyDetails(null)}
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
