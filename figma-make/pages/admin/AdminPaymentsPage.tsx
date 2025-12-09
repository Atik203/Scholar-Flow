"use client";

/**
 * AdminPaymentsPage - Payment History and Refunds Management
 *
 * Comprehensive payment management for administrators with
 * transaction history, refund processing, and revenue analytics.
 *
 * Features:
 * - Complete payment transaction history
 * - Refund request processing
 * - Revenue charts and analytics
 * - Payment method breakdown
 * - Subscription revenue tracking
 * - Export payment reports
 * - Fraud detection alerts
 */

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  Lightbulb,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminPaymentsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type PaymentStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refunded"
  | "disputed";
type TransactionType = "subscription" | "one_time" | "refund" | "chargeback";

interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: TransactionType;
  plan: string;
  method: string;
  methodLast4?: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refundReason?: string;
  metadata?: {
    ip?: string;
    country?: string;
    riskScore?: number;
  };
}

interface RefundRequest {
  id: string;
  paymentId: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string;
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "1",
    transactionId: "txn_1234567890",
    userId: "user-1",
    userName: "Dr. Sarah Chen",
    userEmail: "sarah.chen@university.edu",
    amount: 29.0,
    currency: "USD",
    status: "completed",
    type: "subscription",
    plan: "Team Lead",
    method: "Visa",
    methodLast4: "4242",
    createdAt: "2024-01-15T10:30:00Z",
    processedAt: "2024-01-15T10:30:02Z",
    metadata: { ip: "192.168.1.1", country: "US", riskScore: 10 },
  },
  {
    id: "2",
    transactionId: "txn_1234567891",
    userId: "user-2",
    userName: "Prof. James Wilson",
    userEmail: "j.wilson@research.org",
    amount: 12.0,
    currency: "USD",
    status: "completed",
    type: "subscription",
    plan: "Pro Researcher",
    method: "Mastercard",
    methodLast4: "5555",
    createdAt: "2024-01-15T09:15:00Z",
    processedAt: "2024-01-15T09:15:03Z",
    metadata: { ip: "10.0.0.1", country: "UK", riskScore: 5 },
  },
  {
    id: "3",
    transactionId: "txn_1234567892",
    userId: "user-3",
    userName: "Emily Rodriguez",
    userEmail: "emily.r@lab.edu",
    amount: 12.0,
    currency: "USD",
    status: "refunded",
    type: "refund",
    plan: "Pro Researcher",
    method: "Visa",
    methodLast4: "1234",
    createdAt: "2024-01-14T14:20:00Z",
    processedAt: "2024-01-14T14:25:00Z",
    refundReason: "Customer requested - unused subscription",
    metadata: { ip: "172.16.0.1", country: "US", riskScore: 8 },
  },
  {
    id: "4",
    transactionId: "txn_1234567893",
    userId: "user-4",
    userName: "Michael Park",
    userEmail: "m.park@tech.io",
    amount: 29.0,
    currency: "USD",
    status: "failed",
    type: "subscription",
    plan: "Team Lead",
    method: "Amex",
    methodLast4: "3782",
    createdAt: "2024-01-14T11:45:00Z",
    failureReason: "Insufficient funds",
    metadata: { ip: "192.168.2.1", country: "CA", riskScore: 25 },
  },
  {
    id: "5",
    transactionId: "txn_1234567894",
    userId: "user-5",
    userName: "Lisa Thompson",
    userEmail: "lisa.t@academic.org",
    amount: 12.0,
    currency: "USD",
    status: "pending",
    type: "subscription",
    plan: "Pro Researcher",
    method: "PayPal",
    createdAt: "2024-01-15T12:00:00Z",
    metadata: { ip: "10.10.0.1", country: "AU", riskScore: 15 },
  },
  {
    id: "6",
    transactionId: "txn_1234567895",
    userId: "user-6",
    userName: "David Kim",
    userEmail: "d.kim@research.edu",
    amount: 29.0,
    currency: "USD",
    status: "disputed",
    type: "chargeback",
    plan: "Team Lead",
    method: "Visa",
    methodLast4: "9876",
    createdAt: "2024-01-13T16:30:00Z",
    metadata: { ip: "192.168.10.1", country: "US", riskScore: 75 },
  },
];

const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref-1",
    paymentId: "1",
    userId: "user-7",
    userName: "Anna Martinez",
    amount: 12.0,
    reason: "Not using the service anymore",
    status: "pending",
    requestedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "ref-2",
    paymentId: "2",
    userId: "user-8",
    userName: "Tom Anderson",
    amount: 29.0,
    reason: "Duplicate charge",
    status: "pending",
    requestedAt: "2024-01-14T22:30:00Z",
  },
];

// Stats data
const revenueStats = {
  totalRevenue: 45892.5,
  monthlyRecurring: 12450.0,
  refundsIssued: 840.0,
  pendingPayments: 1250.0,
  growthPercent: 15.3,
  avgTransactionValue: 18.5,
  successRate: 98.5,
  chargebackRate: 0.3,
};

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "pending":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "failed":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    case "refunded":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "disputed":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
    default:
      return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
  }
};

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "completed":
      return Check;
    case "pending":
      return Clock;
    case "failed":
      return X;
    case "refunded":
      return RotateCcw;
    case "disputed":
      return AlertTriangle;
    default:
      return CreditCard;
  }
};

const defaultUser = {
  name: "System Admin",
  email: "admin@scholarflow.com",
  role: "admin" as const,
};

export function AdminPaymentsPage({
  onNavigate,
  role: propRole,
}: AdminPaymentsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [dateRange, setDateRange] = useState("30d");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [activeTab, setActiveTab] = useState<
    "transactions" | "refunds" | "analytics"
  >("transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhanced features
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [savedViews] = useState([
    { id: "1", name: "Failed Payments", filters: { status: "failed" } },
    { id: "2", name: "Pending Refunds", filters: { status: "pending" } },
    { id: "3", name: "High Value (>$50)", filters: { status: "all" } },
  ]);
  const [aiInsights] = useState([
    {
      id: "1",
      type: "alert",
      title: "Chargeback Risk",
      description: "3 transactions flagged for potential disputes",
      action: "Review",
    },
    {
      id: "2",
      type: "trend",
      title: "Revenue Trend",
      description: "15.3% increase in recurring revenue this month",
      action: "View Report",
    },
    {
      id: "3",
      type: "optimization",
      title: "Recovery Opportunity",
      description: "$840 in failed payments could be recovered with retry",
      action: "Retry Payments",
    },
  ]);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => setLastRefresh(new Date()), 30000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleExport = (format: "csv" | "json" | "pdf") =>
    setShowExportMenu(false);
  const handleBulkRefund = () => setSelectedPayments([]);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleProcessRefund = () => {
    // Handle refund processing
    setShowRefundModal(false);
    setRefundAmount("");
    setRefundReason("");
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Payment Management
                      </h1>
                      <motion.div
                        animate={{ opacity: isAutoRefresh ? [1, 0.5, 1] : 1 }}
                        transition={{
                          duration: 2,
                          repeat: isAutoRefresh ? Infinity : 0,
                        }}
                        className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      <span className="text-xs text-slate-400">
                        {isAutoRefresh ? "Live" : "Paused"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Track transactions, process refunds, and view revenue
                      analytics
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Auto-refresh */}
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`p-2 rounded-lg ${isAutoRefresh ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
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
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50"
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
                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
                      >
                        <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-medium text-slate-500 px-2">
                            Saved Views
                          </p>
                        </div>
                        {savedViews.map((view) => (
                          <button
                            key={view.id}
                            onClick={() => setShowSavedViews(false)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <Bookmark className="h-4 w-4 text-emerald-500" />
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
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50"
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
                        className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
                      >
                        <button
                          onClick={() => handleExport("csv")}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-green-500" />
                          <span className="text-sm">CSV</span>
                        </button>
                        <button
                          onClick={() => handleExport("json")}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <FileJson className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">JSON</span>
                        </button>
                        <button
                          onClick={() => handleExport("pdf")}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${showAIInsights ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"}`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">AI Insights</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <Receipt className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* AI Insights Panel */}
          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-900/20 dark:to-emerald-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                      AI Payment Insights
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiInsights.map((insight) => (
                      <motion.div
                        key={insight.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800"
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

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedPayments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 mb-6"
              >
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {selectedPayments.length} payment
                  {selectedPayments.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkRefund}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg text-sm font-medium"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Bulk Refund
                  </button>
                  <button
                    onClick={() => setSelectedPayments([])}
                    className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg"
                  >
                    <X className="h-4 w-4 text-emerald-600" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Revenue",
                value: `$${revenueStats.totalRevenue.toLocaleString()}`,
                change: `+${revenueStats.growthPercent}%`,
                trend: "up",
                icon: DollarSign,
                color: "emerald",
              },
              {
                label: "Monthly Recurring",
                value: `$${revenueStats.monthlyRecurring.toLocaleString()}`,
                change: "+12.5%",
                trend: "up",
                icon: TrendingUp,
                color: "blue",
              },
              {
                label: "Refunds Issued",
                value: `$${revenueStats.refundsIssued.toLocaleString()}`,
                change: "-8.2%",
                trend: "down",
                icon: RotateCcw,
                color: "amber",
              },
              {
                label: "Success Rate",
                value: `${revenueStats.successRate}%`,
                change: "+0.5%",
                trend: "up",
                icon: Check,
                color: "purple",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}
                  >
                    <stat.icon
                      className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stat.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              {[
                { id: "transactions", label: "Transactions", icon: CreditCard },
                {
                  id: "refunds",
                  label: "Refund Requests",
                  icon: RotateCcw,
                  badge: mockRefundRequests.filter(
                    (r) => r.status === "pending"
                  ).length,
                },
                { id: "analytics", label: "Analytics", icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "transactions" && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Filters */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by name, email, or transaction ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={statusFilter}
                          onChange={(e) =>
                            setStatusFilter(
                              e.target.value as typeof statusFilter
                            )
                          }
                          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="all">All Status</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                          <option value="disputed">Disputed</option>
                        </select>
                        <select
                          value={typeFilter}
                          onChange={(e) =>
                            setTypeFilter(e.target.value as typeof typeFilter)
                          }
                          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="all">All Types</option>
                          <option value="subscription">Subscription</option>
                          <option value="one_time">One-time</option>
                          <option value="refund">Refund</option>
                          <option value="chargeback">Chargeback</option>
                        </select>
                        <select
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="7d">Last 7 days</option>
                          <option value="30d">Last 30 days</option>
                          <option value="90d">Last 90 days</option>
                          <option value="1y">Last year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Transaction
                          </th>
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Customer
                          </th>
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Amount
                          </th>
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Status
                          </th>
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Method
                          </th>
                          <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                            Date
                          </th>
                          <th className="text-right p-4 font-medium text-slate-600 dark:text-slate-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment) => {
                          const StatusIcon = getStatusIcon(payment.status);
                          return (
                            <motion.tr
                              key={payment.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900 dark:text-white text-sm">
                                      {payment.transactionId}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      {payment.plan} • {payment.type}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                                    {payment.userName}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {payment.userEmail}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div
                                  className={`font-semibold ${
                                    payment.type === "refund" ||
                                    payment.type === "chargeback"
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {payment.type === "refund" ||
                                  payment.type === "chargeback"
                                    ? "-"
                                    : ""}
                                  ${payment.amount.toFixed(2)}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {payment.currency}
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Wallet className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-900 dark:text-white">
                                    {payment.method}
                                    {payment.methodLast4 &&
                                      ` •••• ${payment.methodLast4}`}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-slate-900 dark:text-white">
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => setSelectedPayment(payment)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4 text-slate-400" />
                                  </button>
                                  {payment.status === "completed" && (
                                    <button
                                      onClick={() => {
                                        setSelectedPayment(payment);
                                        setShowRefundModal(true);
                                      }}
                                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Refund"
                                    >
                                      <RotateCcw className="w-4 h-4 text-slate-400" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Showing {filteredPayments.length} of {mockPayments.length}{" "}
                      transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                        1
                      </span>
                      <button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">
                        2
                      </button>
                      <button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">
                        3
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "refunds" && (
                <motion.div
                  key="refunds"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Pending Refund Requests
                  </h3>
                  <div className="space-y-4">
                    {mockRefundRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {request.userName}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Requested ${request.amount.toFixed(2)} refund
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                <strong>Reason:</strong> {request.reason}
                              </div>
                              <div className="text-xs text-slate-400 mt-2">
                                {new Date(request.requestedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {mockRefundRequests.length === 0 && (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No pending refund requests
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Revenue Chart Placeholder */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Revenue Over Time
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="text-center text-slate-500 dark:text-slate-400">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Revenue chart visualization</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Payment Methods
                      </h3>
                      <div className="space-y-4">
                        {[
                          { method: "Visa", percentage: 45, amount: 20651 },
                          {
                            method: "Mastercard",
                            percentage: 30,
                            amount: 13767,
                          },
                          { method: "PayPal", percentage: 15, amount: 6883 },
                          { method: "Amex", percentage: 10, amount: 4589 },
                        ].map((method) => (
                          <div key={method.method}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {method.method}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                ${method.amount.toLocaleString()} (
                                {method.percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${method.percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {selectedPayment && !showRefundModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPayment(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full"
              >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Transaction Details
                    </h3>
                    <button
                      onClick={() => setSelectedPayment(null)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Transaction ID
                      </div>
                      <div className="font-mono text-sm text-slate-900 dark:text-white">
                        {selectedPayment.transactionId}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Amount
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        ${selectedPayment.amount.toFixed(2)}{" "}
                        {selectedPayment.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Customer
                      </div>
                      <div className="text-sm text-slate-900 dark:text-white">
                        {selectedPayment.userName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {selectedPayment.userEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Status
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}
                      >
                        {selectedPayment.status}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Payment Method
                      </div>
                      <div className="text-sm text-slate-900 dark:text-white">
                        {selectedPayment.method}{" "}
                        {selectedPayment.methodLast4 &&
                          `•••• ${selectedPayment.methodLast4}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Date
                      </div>
                      <div className="text-sm text-slate-900 dark:text-white">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {selectedPayment.metadata && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Risk Assessment
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            (selectedPayment.metadata.riskScore || 0) > 50
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : (selectedPayment.metadata.riskScore || 0) > 25
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          Risk Score: {selectedPayment.metadata.riskScore}
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Country: {selectedPayment.metadata.country}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {selectedPayment.status === "completed" && (
                    <button
                      onClick={() => setShowRefundModal(true)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Process Refund
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refund Modal */}
        <AnimatePresence>
          {showRefundModal && selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowRefundModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Process Refund
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Issue a refund for transaction{" "}
                    {selectedPayment.transactionId}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Refund Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder={selectedPayment.amount.toFixed(2)}
                        max={selectedPayment.amount}
                        className="w-full pl-8 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Max refundable: ${selectedPayment.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Refund Reason
                    </label>
                    <textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Enter the reason for this refund..."
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessRefund}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Process Refund
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
