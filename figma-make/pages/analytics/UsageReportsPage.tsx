"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
  Database,
  Download,
  FileText,
  HardDrive,
  Info,
  PieChart,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface UsageReportsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock data for usage metrics
const mockOverviewMetrics = {
  totalApiCalls: 45892,
  apiCallsChange: 12.5,
  storageUsed: 4.2,
  storageLimit: 10,
  storageChange: 8.3,
  papersProcessed: 1247,
  papersChange: 23.1,
  aiCreditsUsed: 850,
  aiCreditsLimit: 1000,
  aiCreditsChange: -5.2,
};

const mockDailyUsage = [
  { date: "Nov 23", apiCalls: 1450, papers: 32, aiCredits: 28 },
  { date: "Nov 24", apiCalls: 1680, papers: 45, aiCredits: 35 },
  { date: "Nov 25", apiCalls: 1320, papers: 28, aiCredits: 22 },
  { date: "Nov 26", apiCalls: 1890, papers: 52, aiCredits: 42 },
  { date: "Nov 27", apiCalls: 2100, papers: 61, aiCredits: 48 },
  { date: "Nov 28", apiCalls: 1750, papers: 39, aiCredits: 32 },
  { date: "Nov 29", apiCalls: 1920, papers: 47, aiCredits: 38 },
];

const mockFeatureUsage = [
  { feature: "Paper Upload", count: 1247, percentage: 28, trend: 12.5 },
  { feature: "AI Summaries", count: 892, percentage: 20, trend: 23.1 },
  { feature: "Citation Graph", count: 654, percentage: 15, trend: -5.2 },
  { feature: "Search", count: 543, percentage: 12, trend: 8.7 },
  { feature: "Collections", count: 421, percentage: 10, trend: 15.3 },
  { feature: "Annotations", count: 312, percentage: 7, trend: 4.2 },
  { feature: "Export", count: 198, percentage: 5, trend: -2.1 },
  { feature: "Sharing", count: 134, percentage: 3, trend: 18.9 },
];

const mockUserActivity = [
  {
    user: "Dr. Sarah Chen",
    email: "sarah@research.edu",
    actions: 245,
    lastActive: "2 min ago",
    avatar: "SC",
  },
  {
    user: "Prof. James Wilson",
    email: "j.wilson@uni.edu",
    actions: 189,
    lastActive: "15 min ago",
    avatar: "JW",
  },
  {
    user: "Dr. Emily Rodriguez",
    email: "emily.r@lab.org",
    actions: 156,
    lastActive: "1 hour ago",
    avatar: "ER",
  },
  {
    user: "Michael Chang",
    email: "m.chang@research.com",
    actions: 134,
    lastActive: "3 hours ago",
    avatar: "MC",
  },
  {
    user: "Dr. Anna Schmidt",
    email: "a.schmidt@uni.de",
    actions: 98,
    lastActive: "1 day ago",
    avatar: "AS",
  },
];

const mockQuotaUsage = [
  { name: "API Calls", used: 45892, limit: 100000, color: "indigo" },
  { name: "Storage", used: 4.2, limit: 10, unit: "GB", color: "blue" },
  { name: "AI Credits", used: 850, limit: 1000, color: "purple" },
  { name: "Team Members", used: 8, limit: 15, color: "green" },
  { name: "Collections", used: 24, limit: 50, color: "orange" },
];

const mockExportHistory = [
  {
    id: "1",
    type: "Monthly Report",
    format: "PDF",
    date: "Nov 28, 2024",
    size: "2.4 MB",
    status: "completed",
  },
  {
    id: "2",
    type: "Usage Analytics",
    format: "CSV",
    date: "Nov 25, 2024",
    size: "856 KB",
    status: "completed",
  },
  {
    id: "3",
    type: "API Logs",
    format: "JSON",
    date: "Nov 20, 2024",
    size: "4.1 MB",
    status: "completed",
  },
];

export const UsageReportsPage: React.FC<UsageReportsPageProps> = ({
  onNavigate,
  role = "pro_researcher",
}) => {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">(
    "7d"
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "features" | "users" | "quotas"
  >("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const mockUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExport = (format: string) => {
    console.log("Exporting report in format:", format);
    setShowExportModal(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "features", label: "Features", icon: Zap },
    { id: "users", label: "User Activity", icon: Users },
    { id: "quotas", label: "Quotas & Limits", icon: Target },
  ];

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}
        >
          <Icon
            className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const UsageBar: React.FC<{ data: typeof mockDailyUsage }> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.apiCalls));
    return (
      <div className="flex items-end gap-2 h-48">
        {data.map((day, idx) => (
          <motion.div
            key={day.date}
            initial={{ height: 0 }}
            animate={{ height: `${(day.apiCalls / maxValue) * 100}%` }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group cursor-pointer"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {day.apiCalls.toLocaleString()} calls
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total API Calls"
          value={mockOverviewMetrics.totalApiCalls.toLocaleString()}
          change={mockOverviewMetrics.apiCallsChange}
          icon={Activity}
          color="indigo"
          subtitle="This billing period"
        />
        <MetricCard
          title="Storage Used"
          value={`${mockOverviewMetrics.storageUsed} GB`}
          change={mockOverviewMetrics.storageChange}
          icon={HardDrive}
          color="blue"
          subtitle={`of ${mockOverviewMetrics.storageLimit} GB`}
        />
        <MetricCard
          title="Papers Processed"
          value={mockOverviewMetrics.papersProcessed.toLocaleString()}
          change={mockOverviewMetrics.papersChange}
          icon={FileText}
          color="green"
          subtitle="Including AI analysis"
        />
        <MetricCard
          title="AI Credits"
          value={`${mockOverviewMetrics.aiCreditsUsed}/${mockOverviewMetrics.aiCreditsLimit}`}
          change={mockOverviewMetrics.aiCreditsChange}
          icon={Sparkles}
          color="purple"
          subtitle="Credits remaining: 150"
        />
      </div>

      {/* Usage Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Usage
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                API Calls
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Papers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                AI Credits
              </span>
            </div>
          </div>
        </div>
        <UsageBar data={mockDailyUsage} />
        <div className="flex justify-between mt-4">
          {mockDailyUsage.map((day) => (
            <span
              key={day.date}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {day.date}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Export History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export History
          </h3>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            New Export
          </button>
        </div>
        <div className="space-y-3">
          {mockExportHistory.map((export_) => (
            <div
              key={export_.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {export_.type}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {export_.format} • {export_.size} • {export_.date}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FeaturesTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Feature Usage Breakdown
        </h3>
        <div className="space-y-4">
          {mockFeatureUsage.map((feature, idx) => (
            <motion.div
              key={feature.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <button
                onClick={() =>
                  setExpandedFeature(
                    expandedFeature === feature.feature ? null : feature.feature
                  )
                }
                className="w-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {feature.feature}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feature.count.toLocaleString()} uses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm flex items-center gap-1 ${
                        feature.trend >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {feature.trend >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(feature.trend)}%
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedFeature === feature.feature ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.percentage}%` }}
                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  />
                </div>
              </button>
              <AnimatePresence>
                {expandedFeature === feature.feature && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Daily Average
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {Math.round(feature.count / 7)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Peak Usage
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          2:00 PM
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          % of Total
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.percentage}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Distribution Pie */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" />
          Feature Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockFeatureUsage.slice(0, 4).map((feature, idx) => (
            <motion.div
              key={feature.feature}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-600"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className="text-indigo-600"
                    strokeWidth="3"
                    strokeDasharray={`${feature.percentage} 100`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${feature.percentage} 100` }}
                    transition={{ delay: idx * 0.2, duration: 1 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white">
                  {feature.percentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {feature.feature}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {feature.count.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Active Users
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last 7 days
          </div>
        </div>
        <div className="space-y-4">
          {mockUserActivity.map((user, idx) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.user}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.actions} actions
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.lastActive}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Heatmap Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Activity Heatmap
        </h3>
        <div className="grid grid-cols-24 gap-1">
          {Array.from({ length: 168 }).map((_, idx) => {
            const intensity = Math.random();
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.002 }}
                className={`w-3 h-3 rounded-sm ${
                  intensity > 0.8
                    ? "bg-indigo-600"
                    : intensity > 0.6
                      ? "bg-indigo-400"
                      : intensity > 0.4
                        ? "bg-indigo-300"
                        : intensity > 0.2
                          ? "bg-indigo-200"
                          : "bg-gray-100 dark:bg-gray-700"
                }`}
                title={`${Math.round(intensity * 100)} actions`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
            <div className="w-3 h-3 rounded-sm bg-indigo-200" />
            <div className="w-3 h-3 rounded-sm bg-indigo-300" />
            <div className="w-3 h-3 rounded-sm bg-indigo-400" />
            <div className="w-3 h-3 rounded-sm bg-indigo-600" />
          </div>
          <span>More active</span>
        </div>
      </div>
    </div>
  );

  const QuotasTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          Quota Usage
        </h3>
        <div className="space-y-6">
          {mockQuotaUsage.map((quota, idx) => {
            const percentage = (quota.used / quota.limit) * 100;
            const isWarning = percentage > 80;
            const isCritical = percentage > 90;
            return (
              <motion.div
                key={quota.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {quota.name}
                  </span>
                  <span
                    className={`text-sm ${
                      isCritical
                        ? "text-red-600 dark:text-red-400"
                        : isWarning
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {quota.used}
                    {quota.unit ? ` ${quota.unit}` : ""} / {quota.limit}
                    {quota.unit ? ` ${quota.unit}` : ""}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      isCritical
                        ? "bg-red-500"
                        : isWarning
                          ? "bg-orange-500"
                          : `bg-${quota.color}-500`
                    }`}
                  />
                </div>
                {(isWarning || isCritical) && (
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      isCritical
                        ? "text-red-600 dark:text-red-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    <Info className="w-3 h-3" />
                    {isCritical
                      ? "Critical: Consider upgrading your plan"
                      : "Warning: Approaching limit"}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Upgrade to Pro
            </h3>
            <p className="text-indigo-100 mb-4 max-w-md">
              Get unlimited API calls, 50GB storage, and 5000 AI credits per
              month. Perfect for power users and teams.
            </p>
            <button
              onClick={() => onNavigate("/billing")}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              View Plans
            </button>
          </div>
          <Sparkles className="w-16 h-16 text-indigo-200 opacity-50" />
        </div>
      </div>

      {/* Billing Cycle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Billing Cycle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Period
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              Nov 1 - Nov 30, 2024
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Days Remaining
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              2 days
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reset Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              Dec 1, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "features":
        return <FeaturesTab />;
      case "users":
        return <UsersTab />;
      case "quotas":
        return <QuotasTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <DashboardLayout user={mockUser} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Usage Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your usage, quotas, and activity metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    dateRange === range
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Export Report
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a format for your usage report export.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  {
                    format: "PDF",
                    desc: "Best for presentations and sharing",
                    icon: FileText,
                  },
                  {
                    format: "CSV",
                    desc: "Import into spreadsheets",
                    icon: Database,
                  },
                  {
                    format: "JSON",
                    desc: "For developers and integrations",
                    icon: Activity,
                  },
                ].map((option) => (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors text-left"
                  >
                    <option.icon className="w-8 h-8 text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.format}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {option.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default UsageReportsPage;
