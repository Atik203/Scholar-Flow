"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Database,
  FileText,
  FolderOpen,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo - With role variations
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "pro_researcher" as const, // Can be: "researcher" | "pro_researcher" | "team_lead" | "admin"
};

interface AnalyticsPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyAnalytics = {
  plan: "PRO_RESEARCHER",
  usage: {
    papers: { total: 45, limit: 100, percentage: 45 },
    collections: { total: 8, limit: 25, percentage: 32 },
    storage: { used: 256, limit: 1024, unit: "MB", percentage: 25 },
    tokens: { used: 15000, limit: 50000, percentage: 30 },
  },
  charts: {
    papersOverTime: [
      { date: "Jan 1", count: 5 },
      { date: "Jan 8", count: 8 },
      { date: "Jan 15", count: 12 },
      { date: "Jan 22", count: 10 },
      { date: "Jan 29", count: 15 },
      { date: "Feb 5", count: 18 },
      { date: "Feb 12", count: 22 },
    ],
    papersByStatus: [
      { status: "PROCESSED", count: 38 },
      { status: "PROCESSING", count: 4 },
      { status: "UPLOADED", count: 2 },
      { status: "FAILED", count: 1 },
    ],
  },
};

const insights = [
  {
    title: "Recent Upload Velocity",
    value: "12 papers / 7 days",
    helperText: "Last activity on Feb 12",
    trendLabel: "+25%",
    trendDirection: "up" as const,
  },
  {
    title: "Average Daily Uploads",
    value: "1.7",
    helperText: "Rolling 7-day average",
    trendDirection: undefined,
  },
  {
    title: "Dominant Processing Status",
    value: "PROCESSED",
    helperText: "38 papers currently processed",
    trendDirection: undefined,
  },
  {
    title: "Storage Remaining",
    value: "768 MB",
    helperText: "25% consumed",
    trendLabel: "75% headroom",
    trendDirection: "up" as const,
  },
];

const usageCards = [
  {
    key: "papers",
    title: "Papers",
    icon: FileText,
    used: 45,
    limit: 100,
    percentage: 45,
  },
  {
    key: "collections",
    title: "Collections",
    icon: FolderOpen,
    used: 8,
    limit: 25,
    percentage: 32,
  },
  {
    key: "storage",
    title: "Storage",
    icon: Database,
    used: "256 MB",
    limit: "1 GB",
    percentage: 25,
  },
  {
    key: "tokens",
    title: "AI Tokens",
    icon: Sparkles,
    used: "15K",
    limit: "50K",
    percentage: 30,
  },
];

const STATUS_COLORS: Record<string, string> = {
  PROCESSED: "#22c55e",
  PROCESSING: "#3b82f6",
  UPLOADED: "#f59e0b",
  FAILED: "#ef4444",
};

// ============================================================================
// Analytics Page Component
// ============================================================================
export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  // For demo purposes, we can simulate different access levels
  const hasStandardAccess = true;
  const hasPremiumAccess =
    defaultUser.role === "pro_researcher" ||
    defaultUser.role === "team_lead" ||
    defaultUser.role === "admin";

  if (!hasStandardAccess) {
    return (
      <DashboardLayout
        user={defaultUser}
        onNavigate={onNavigate}
        currentPath="/analytics"
      >
        <div className="max-w-4xl mx-auto py-16">
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-card p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Analytics Access Restricted
            </h2>
            <p className="text-muted-foreground">
              Please contact an administrator to request analytics access.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/analytics"
    >
      <div className="space-y-8 pb-8">
        {/* Header Card */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:from-primary/5 p-6">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">
                  {hasPremiumAccess
                    ? "Premium Analytics Hub"
                    : "Analytics Overview"}
                </h1>
              </div>
              <p className="text-muted-foreground max-w-xl">
                {hasPremiumAccess
                  ? "Monitor quota health, track document velocity, and surface actionable insights for your research team."
                  : "Monitor research activity, storage usage, and uncover insights. Upgrade to PRO for advanced forecasting and collaboration analytics."}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="rounded-xl border bg-card p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Current Plan</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {dummyAnalytics.plan.replace("_", " ")}
              </span>
            </div>
            {!hasPremiumAccess && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/billing")}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
              >
                Upgrade for More
              </motion.button>
            )}
          </div>
        </div>

        {/* Usage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border bg-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{card.title}</h3>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{card.used}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    / {card.limit}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className={cn(
                      "h-full rounded-full",
                      card.percentage > 80
                        ? "bg-destructive"
                        : card.percentage > 60
                          ? "bg-yellow-500"
                          : "bg-primary"
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {card.percentage}% used
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="rounded-xl border bg-card p-4"
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                {insight.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{insight.value}</span>
                {insight.trendDirection && (
                  <span
                    className={cn(
                      "flex items-center text-xs font-medium",
                      insight.trendDirection === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {insight.trendDirection === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {insight.trendLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {insight.helperText}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Papers Over Time Chart */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Upload Activity</h3>
            </div>
            <div className="h-48 flex items-end gap-2">
              {dummyAnalytics.charts.papersOverTime.map((item, index) => (
                <motion.div
                  key={item.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.count / 25) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-primary/80 rounded-t-md min-h-[4px]"
                  title={`${item.date}: ${item.count} papers`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {dummyAnalytics.charts.papersOverTime.map((item) => (
                <span key={item.date} className="text-xs text-muted-foreground">
                  {item.date.split(" ")[1]}
                </span>
              ))}
            </div>
          </div>

          {/* Papers by Status Chart */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Papers by Status</h3>
            </div>
            <div className="space-y-4">
              {dummyAnalytics.charts.papersByStatus.map((item, index) => {
                const total = dummyAnalytics.charts.papersByStatus.reduce(
                  (a, b) => a + b.count,
                  0
                );
                const percentage = (item.count / total) * 100;
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLORS[item.status],
                          }}
                        />
                        <span className="text-sm font-medium">
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} papers
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[item.status] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium Features Teaser (for non-premium users) */}
        {!hasPremiumAccess && (
          <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Unlock Premium Analytics
                </h3>
                <p className="text-muted-foreground">
                  Get advanced forecasting, team collaboration analytics, export
                  capabilities, and more.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/billing")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap"
              >
                Upgrade Now
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AnalyticsPage;
