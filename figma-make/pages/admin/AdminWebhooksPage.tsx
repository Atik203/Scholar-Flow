"use client";

/**
 * AdminWebhooksPage - Webhook Configuration and Logs
 *
 * Features:
 * - Create and manage webhook endpoints
 * - Event type selection
 * - Webhook logs and delivery status
 * - Test webhook functionality
 * - Secret key management
 * - Retry failed deliveries
 *
 * @author Md. Atikur Rahaman
 * @version 1.0.0 - Phase 7
 */

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Brain,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  FileText,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  Webhook,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminWebhooksPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Types
interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  secret: string;
  events: string[];
  status: "active" | "inactive" | "error";
  createdAt: Date;
  lastTriggered: Date | null;
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  webhookName: string;
  event: string;
  status: "success" | "failed" | "pending";
  statusCode: number | null;
  requestBody: string;
  responseBody: string | null;
  duration: number;
  attempts: number;
  createdAt: Date;
  completedAt: Date | null;
}

interface EventType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

// Mock data
const mockWebhooks: WebhookEndpoint[] = [
  {
    id: "wh-1",
    name: "Production API",
    url: "https://api.example.com/webhooks/scholarflow",
    description: "Main production webhook for user events",
    secret: "whsec_prod_1234567890abcdef",
    events: ["user.created", "user.updated", "paper.uploaded"],
    status: "active",
    createdAt: new Date("2025-10-01"),
    lastTriggered: new Date("2025-11-29T10:30:00"),
    successRate: 98.5,
    totalDeliveries: 1250,
    failedDeliveries: 19,
  },
  {
    id: "wh-2",
    name: "Analytics Service",
    url: "https://analytics.company.com/events",
    description: "Sends events to analytics platform",
    secret: "whsec_analytics_abcdef123456",
    events: ["paper.viewed", "paper.downloaded", "search.performed"],
    status: "active",
    createdAt: new Date("2025-09-15"),
    lastTriggered: new Date("2025-11-29T11:45:00"),
    successRate: 99.8,
    totalDeliveries: 5420,
    failedDeliveries: 11,
  },
  {
    id: "wh-3",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX",
    description: "Team notifications for important events",
    secret: "whsec_slack_xyz789",
    events: [
      "subscription.created",
      "subscription.cancelled",
      "payment.failed",
    ],
    status: "active",
    createdAt: new Date("2025-08-20"),
    lastTriggered: new Date("2025-11-28T16:20:00"),
    successRate: 100,
    totalDeliveries: 89,
    failedDeliveries: 0,
  },
  {
    id: "wh-4",
    name: "Legacy System",
    url: "https://old-api.internal.com/webhook",
    description: "Deprecated webhook - scheduled for removal",
    secret: "whsec_legacy_old123",
    events: ["user.created"],
    status: "inactive",
    createdAt: new Date("2025-05-10"),
    lastTriggered: new Date("2025-09-01T08:00:00"),
    successRate: 85.2,
    totalDeliveries: 320,
    failedDeliveries: 47,
  },
  {
    id: "wh-5",
    name: "CRM Integration",
    url: "https://crm.salesforce.com/services/apexrest/webhook",
    description: "Syncs user data with CRM",
    secret: "whsec_crm_sf2024",
    events: ["user.created", "user.updated", "subscription.created"],
    status: "error",
    createdAt: new Date("2025-07-01"),
    lastTriggered: new Date("2025-11-29T09:15:00"),
    successRate: 72.3,
    totalDeliveries: 856,
    failedDeliveries: 237,
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "del-1",
    webhookId: "wh-1",
    webhookName: "Production API",
    event: "user.created",
    status: "success",
    statusCode: 200,
    requestBody:
      '{"event":"user.created","data":{"userId":"user-123","email":"john@example.com"}}',
    responseBody: '{"received":true}',
    duration: 145,
    attempts: 1,
    createdAt: new Date("2025-11-29T10:30:00"),
    completedAt: new Date("2025-11-29T10:30:00"),
  },
  {
    id: "del-2",
    webhookId: "wh-5",
    webhookName: "CRM Integration",
    event: "user.updated",
    status: "failed",
    statusCode: 503,
    requestBody:
      '{"event":"user.updated","data":{"userId":"user-456","changes":["name"]}}',
    responseBody: '{"error":"Service temporarily unavailable"}',
    duration: 30000,
    attempts: 3,
    createdAt: new Date("2025-11-29T09:15:00"),
    completedAt: new Date("2025-11-29T09:20:00"),
  },
  {
    id: "del-3",
    webhookId: "wh-2",
    webhookName: "Analytics Service",
    event: "paper.downloaded",
    status: "success",
    statusCode: 200,
    requestBody:
      '{"event":"paper.downloaded","data":{"paperId":"paper-789","userId":"user-123"}}',
    responseBody: '{"tracked":true}',
    duration: 89,
    attempts: 1,
    createdAt: new Date("2025-11-29T11:45:00"),
    completedAt: new Date("2025-11-29T11:45:00"),
  },
  {
    id: "del-4",
    webhookId: "wh-1",
    webhookName: "Production API",
    event: "paper.uploaded",
    status: "pending",
    statusCode: null,
    requestBody: '{"event":"paper.uploaded","data":{"paperId":"paper-new"}}',
    responseBody: null,
    duration: 0,
    attempts: 0,
    createdAt: new Date("2025-11-29T12:00:00"),
    completedAt: null,
  },
  {
    id: "del-5",
    webhookId: "wh-3",
    webhookName: "Slack Notifications",
    event: "subscription.created",
    status: "success",
    statusCode: 200,
    requestBody:
      '{"event":"subscription.created","data":{"userId":"user-999","plan":"pro"}}',
    responseBody: '{"ok":true}',
    duration: 234,
    attempts: 1,
    createdAt: new Date("2025-11-28T16:20:00"),
    completedAt: new Date("2025-11-28T16:20:00"),
  },
];

const eventTypes: EventType[] = [
  {
    id: "user.created",
    name: "User Created",
    description: "When a new user signs up",
    category: "User",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "user.updated",
    name: "User Updated",
    description: "When user profile is updated",
    category: "User",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "user.deleted",
    name: "User Deleted",
    description: "When a user is deleted",
    category: "User",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "paper.uploaded",
    name: "Paper Uploaded",
    description: "When a new paper is uploaded",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "paper.viewed",
    name: "Paper Viewed",
    description: "When a paper is viewed",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "paper.downloaded",
    name: "Paper Downloaded",
    description: "When a paper is downloaded",
    category: "Papers",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "subscription.created",
    name: "Subscription Created",
    description: "When a new subscription starts",
    category: "Billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "subscription.cancelled",
    name: "Subscription Cancelled",
    description: "When a subscription is cancelled",
    category: "Billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "payment.success",
    name: "Payment Success",
    description: "When a payment succeeds",
    category: "Billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "payment.failed",
    name: "Payment Failed",
    description: "When a payment fails",
    category: "Billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "search.performed",
    name: "Search Performed",
    description: "When a search is performed",
    category: "Activity",
    icon: <Search className="h-4 w-4" />,
  },
];

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  image: null,
  role: "admin" as const,
};

export function AdminWebhooksPage({
  onNavigate,
  role: propRole,
}: AdminWebhooksPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [webhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [deliveries] = useState<WebhookDelivery[]>(mockDeliveries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"endpoints" | "logs">("endpoints");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [selectedWebhook, setSelectedWebhook] =
    useState<WebhookEndpoint | null>(null);
  const [showDeliveryDetails, setShowDeliveryDetails] =
    useState<WebhookDelivery | null>(null);

  // Enhanced features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [savedViews, setSavedViews] = useState([
    { id: "1", name: "Active Only", filter: "active" },
    { id: "2", name: "Failed Deliveries", filter: "failed" },
    { id: "3", name: "High Volume", filter: "high-volume" },
  ]);
  const [selectedWebhooks, setSelectedWebhooks] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [aiInsights] = useState([
    {
      type: "alert",
      message:
        "3 webhooks have >5% failure rate - consider reviewing endpoints",
      icon: TrendingUp,
    },
    {
      type: "recommendation",
      message: "paper.uploaded event has highest usage - optimize for latency",
      icon: Sparkles,
    },
    {
      type: "info",
      message: "Average delivery time improved 23% this week",
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
  const toggleWebhookSelection = (webhookId: string) => {
    setSelectedWebhooks((prev) =>
      prev.includes(webhookId)
        ? prev.filter((id) => id !== webhookId)
        : [...prev, webhookId]
    );
  };

  const toggleAllWebhooks = () => {
    setSelectedWebhooks((prev) =>
      prev.length === filteredWebhooks.length
        ? []
        : filteredWebhooks.map((w) => w.id)
    );
  };

  // Export handlers
  const handleExport = (format: string) => {
    console.log(`Exporting webhooks as ${format}`);
    setShowExportMenu(false);
  };

  // Filter webhooks
  const filteredWebhooks = useMemo(() => {
    return webhooks.filter((webhook) => {
      const matchesSearch =
        webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webhook.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || webhook.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [webhooks, searchQuery, statusFilter]);

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.webhookName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        delivery.event.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchQuery, statusFilter]);

  // Stats
  const stats = {
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter((w) => w.status === "active").length,
    totalDeliveries: deliveries.length,
    successfulDeliveries: deliveries.filter((d) => d.status === "success")
      .length,
    failedDeliveries: deliveries.filter((d) => d.status === "failed").length,
    averageSuccessRate:
      webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length,
  };

  const toggleSecretVisibility = (webhookId: string) => {
    setShowSecrets((prev) => ({ ...prev, [webhookId]: !prev[webhookId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <CheckCircle className="h-3 w-3" />
            {status === "active" ? "Active" : "Success"}
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <Clock className="h-3 w-3" />
            Inactive
          </span>
        );
      case "error":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <XCircle className="h-3 w-3" />
            {status === "error" ? "Error" : "Failed"}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            <Clock className="h-3 w-3" />
            Pending
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
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Webhook Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure webhook endpoints and monitor delivery logs
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
            >
              <Plus className="h-5 w-5" />
              Create Webhook
            </motion.button>
          </motion.div>

          {/* Enhanced Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            {/* Live Refresh Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <motion.div
                animate={isAutoRefresh ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
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
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {view.name}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedWebhooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800"
              >
                <span className="text-xs text-indigo-600 dark:text-indigo-400">
                  {selectedWebhooks.length} selected
                </span>
                <button className="text-xs text-green-600 hover:text-green-700">
                  Activate
                </button>
                <button className="text-xs text-yellow-600 hover:text-yellow-700">
                  Pause
                </button>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Test All
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
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
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
                    className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                  >
                    <button
                      onClick={() => handleExport("csv")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                    </button>
                    <button
                      onClick={() => handleExport("json")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FileJson className="h-3.5 w-3.5" /> JSON
                    </button>
                    <button
                      onClick={() => handleExport("pdf")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FileText className="h-3.5 w-3.5" /> PDF Report
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Last Refresh */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <RefreshCw className="h-3 w-3" />
              {lastRefresh.toLocaleTimeString()}
            </div>
          </motion.div>

          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
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
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
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
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {insight.message}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                label: "Total Webhooks",
                value: stats.totalWebhooks,
                icon: Webhook,
                color: "indigo",
              },
              {
                label: "Active",
                value: stats.activeWebhooks,
                icon: Zap,
                color: "green",
              },
              {
                label: "Total Deliveries",
                value: stats.totalDeliveries,
                icon: Send,
                color: "blue",
              },
              {
                label: "Success Rate",
                value: `${stats.averageSuccessRate.toFixed(1)}%`,
                icon: CheckCircle,
                color: "emerald",
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

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm overflow-hidden"
          >
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              {[
                { id: "endpoints", label: "Endpoints", icon: Webhook },
                { id: "logs", label: "Delivery Logs", icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "endpoints" | "logs")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "endpoints"
                      ? "Search webhooks..."
                      : "Search deliveries..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                {activeTab === "endpoints" ? (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="error">Error</option>
                  </>
                ) : (
                  <>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </>
                )}
              </select>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === "endpoints" ? (
                <motion.div
                  key="endpoints"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4"
                >
                  {filteredWebhooks.length === 0 ? (
                    <div className="text-center py-12">
                      <Webhook className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No webhooks found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredWebhooks.map((webhook, index) => (
                        <motion.div
                          key={webhook.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {webhook.name}
                                </h3>
                                {getStatusBadge(webhook.status)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {webhook.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 truncate max-w-md">
                                  {webhook.url}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(webhook.url)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                                  title="Copy URL"
                                >
                                  <Copy className="h-3.5 w-3.5 text-gray-500" />
                                </button>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  Last triggered:{" "}
                                  {formatDate(webhook.lastTriggered)}
                                </span>
                                <span className="hidden md:inline">•</span>
                                <span className="hidden md:inline">
                                  {webhook.totalDeliveries} deliveries
                                </span>
                                <span className="hidden md:inline">•</span>
                                <span className="hidden md:inline">
                                  {webhook.successRate}% success rate
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedWebhook(webhook)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Settings className="h-4 w-4 text-gray-500" />
                              </button>
                              <button
                                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Test Webhook"
                              >
                                <Play className="h-4 w-4 text-gray-500" />
                              </button>
                              <button
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </div>

                          {/* Events */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Subscribed Events:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {webhook.events.map((event) => (
                                <span
                                  key={event}
                                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                                >
                                  {event}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Secret */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Signing Secret:
                              </p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 font-mono">
                                  {showSecrets[webhook.id]
                                    ? webhook.secret
                                    : "••••••••••••••••••••••••"}
                                </code>
                                <button
                                  onClick={() =>
                                    toggleSecretVisibility(webhook.id)
                                  }
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                                  title={
                                    showSecrets[webhook.id]
                                      ? "Hide Secret"
                                      : "Show Secret"
                                  }
                                >
                                  {showSecrets[webhook.id] ? (
                                    <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                                  ) : (
                                    <Eye className="h-3.5 w-3.5 text-gray-500" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    copyToClipboard(webhook.secret)
                                  }
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                                  title="Copy Secret"
                                >
                                  <Copy className="h-3.5 w-3.5 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4"
                >
                  {filteredDeliveries.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No delivery logs found
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-4 py-3">Webhook</th>
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 hidden md:table-cell">
                              Response
                            </th>
                            <th className="px-4 py-3 hidden lg:table-cell">
                              Duration
                            </th>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {filteredDeliveries.map((delivery, index) => (
                            <motion.tr
                              key={delivery.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {delivery.webhookName}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                  {delivery.event}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {getStatusBadge(delivery.status)}
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {delivery.statusCode || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {delivery.duration}ms
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(delivery.createdAt)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      setShowDeliveryDetails(delivery)
                                    }
                                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  </button>
                                  {delivery.status === "failed" && (
                                    <button
                                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Retry"
                                    >
                                      <RotateCcw className="h-4 w-4 text-gray-500" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Create Webhook Modal */}
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
                    Create Webhook
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
                      Webhook Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Production API"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Endpoint URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://api.example.com/webhooks"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of this webhook's purpose"
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Events to Subscribe
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {eventTypes.map((event) => (
                        <label
                          key={event.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {event.name}
                          </span>
                        </label>
                      ))}
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
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg"
                  >
                    Create Webhook
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Details Modal */}
        <AnimatePresence>
          {showDeliveryDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeliveryDetails(null)}
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
                      Delivery Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {showDeliveryDetails.webhookName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeliveryDetails(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Status
                      </p>
                      {getStatusBadge(showDeliveryDetails.status)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Response Code
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {showDeliveryDetails.statusCode || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Duration
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {showDeliveryDetails.duration}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Attempts
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {showDeliveryDetails.attempts}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Request Body
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(showDeliveryDetails.requestBody)
                        }
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(
                        JSON.parse(showDeliveryDetails.requestBody),
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  {showDeliveryDetails.responseBody && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Response Body
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(showDeliveryDetails.responseBody!)
                          }
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(
                          JSON.parse(showDeliveryDetails.responseBody),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                  {showDeliveryDetails.status === "failed" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry Delivery
                    </motion.button>
                  )}
                  <button
                    onClick={() => setShowDeliveryDetails(null)}
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
