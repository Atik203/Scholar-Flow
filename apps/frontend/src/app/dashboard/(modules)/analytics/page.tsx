"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { USER_ROLES, hasRoleAccess } from "@/lib/auth/roles";
import { useGetUserAnalyticsQuery } from "@/redux/api/userApi";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Database,
  FileText,
  FolderOpen,
  Loader2,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  PROCESSED: "#22c55e",
  PROCESSING: "#3b82f6",
  UPLOADED: "#f59e0b",
  FAILED: "#ef4444",
};

const CHART_COLORS = {
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

type Insight = {
  title: string;
  value: string;
  helperText: string;
  trendLabel?: string;
  trendDirection?: "up" | "down";
};

type TrendSummary = {
  totalRecentUploads: number;
  uploadDelta: number;
  uploadDeltaPercentage: number;
  averageDailyUploads: number;
  mostActiveDay?: { date: string; count: number };
  mostRecentActivityLabel?: string;
};

const formatPercentage = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const safeDivide = (numerator: number, denominator: number) => {
  if (!denominator) return 0;
  return numerator / denominator;
};

const formatNumber = (value: number) => {
  return Number.isFinite(value) ? value.toLocaleString() : "0";
};

const resolveLimitLabel = (limit: number, fallbackUnit?: string) => {
  if (limit === -1) {
    return "Unlimited";
  }
  const formatted = formatNumber(limit);
  return fallbackUnit ? `${formatted} ${fallbackUnit}` : formatted;
};

type UsageStat = {
  key: string;
  title: string;
  icon: LucideIcon;
  usedLabel: string;
  helperText: string;
  percentage: number;
};

type ChartCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
};

// Custom tooltip for charts with dark theme support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="font-medium text-sm mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsModulePage() {
  const { isLoading: isAuthLoading, user } = useProtectedRoute();
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetUserAnalyticsQuery();

  const analytics = analyticsData?.data;

  const hasStandardAccess = hasRoleAccess(user?.role, USER_ROLES.RESEARCHER);
  const hasPremiumAccess = hasRoleAccess(user?.role, USER_ROLES.PRO_RESEARCHER);

  const trendSummary = useMemo<TrendSummary>(() => {
    const papers = analytics?.charts?.papersOverTime ?? [];
    if (!papers.length) {
      return {
        totalRecentUploads: 0,
        uploadDelta: 0,
        uploadDeltaPercentage: 0,
        averageDailyUploads: 0,
      };
    }

    const sorted = [...papers].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const lastSeven = sorted.slice(-7);
    const prevSeven = sorted.slice(-14, -7);

    const totalRecentUploads = lastSeven.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const previousUploads = prevSeven.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const uploadDelta = totalRecentUploads - previousUploads;
    const uploadDeltaPercentage =
      safeDivide(uploadDelta, previousUploads || 1) * 100;

    const averageDailyUploads =
      lastSeven.length > 0
        ? safeDivide(totalRecentUploads, lastSeven.length)
        : safeDivide(totalRecentUploads, sorted.length);

    const mostActiveDay = sorted.reduce(
      (max, entry) => {
        if (!max || entry.count > max.count) {
          return entry;
        }
        return max;
      },
      undefined as { date: string; count: number } | undefined
    );

    const mostRecent = sorted[sorted.length - 1];
    const mostRecentActivityLabel = mostRecent
      ? new Date(mostRecent.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : undefined;

    return {
      totalRecentUploads,
      uploadDelta,
      uploadDeltaPercentage,
      averageDailyUploads,
      mostActiveDay,
      mostRecentActivityLabel,
    };
  }, [analytics]);

  const insights = useMemo<Insight[]>(() => {
    if (!analytics) {
      return [];
    }

    const entries: Insight[] = [
      {
        title: "Recent Upload Velocity",
        value: `${trendSummary.totalRecentUploads} papers / 7 days`,
        helperText: trendSummary.mostRecentActivityLabel
          ? `Last activity on ${trendSummary.mostRecentActivityLabel}`
          : "No recent uploads",
        trendLabel: formatPercentage(trendSummary.uploadDeltaPercentage),
        trendDirection: trendSummary.uploadDelta >= 0 ? "up" : "down",
      },
    ];

    if (trendSummary.averageDailyUploads > 0) {
      entries.push({
        title: "Average Daily Uploads",
        value: trendSummary.averageDailyUploads.toFixed(1),
        helperText: "Rolling 7-day average",
      });
    }

    if (analytics.charts.papersByStatus?.length) {
      const [topStatus] = [...analytics.charts.papersByStatus].sort(
        (a, b) => b.count - a.count
      );
      if (topStatus) {
        entries.push({
          title: "Dominant Processing Status",
          value: topStatus.status,
          helperText: `${formatNumber(topStatus.count)} papers currently ${topStatus.status.toLowerCase()}`,
        });
      }
    }

    entries.push({
      title: "Storage Remaining",
      value:
        analytics.limits.maxStorage === -1
          ? "Unlimited"
          : `${Math.max(analytics.limits.maxStorage - analytics.usage.storage.used, 0).toFixed(1)} ${analytics.usage.storage.unit}`,
      helperText:
        analytics.limits.maxStorage === -1
          ? "Unlimited retention for your plan"
          : `${analytics.usage.storage.percentage.toFixed(1)}% consumed`,
      trendDirection:
        analytics.limits.maxStorage === -1 ||
        analytics.usage.storage.percentage < 80
          ? "up"
          : "down",
      trendLabel:
        analytics.limits.maxStorage === -1
          ? undefined
          : `${(100 - analytics.usage.storage.percentage).toFixed(1)}% headroom`,
    });

    return entries;
  }, [analytics, trendSummary]);

  const usageCards = useMemo<UsageStat[]>(() => {
    if (!analytics) {
      return [];
    }

    const {
      usage: { papers, collections, storage, tokens },
    } = analytics;

    return [
      {
        key: "papers",
        title: "Papers",
        icon: FileText,
        usedLabel: formatNumber(papers.total),
        helperText:
          `${formatNumber(papers.limit)} limit` +
          (analytics.limits.maxPapers === -1 ? " (Unlimited)" : ""),
        percentage: papers.percentage,
      },
      {
        key: "collections",
        title: "Collections",
        icon: FolderOpen,
        usedLabel: formatNumber(collections.total),
        helperText:
          `${formatNumber(collections.limit)} limit` +
          (analytics.limits.maxCollections === -1 ? " (Unlimited)" : ""),
        percentage: collections.percentage,
      },
      {
        key: "storage",
        title: "Storage",
        icon: Database,
        usedLabel: `${storage.used.toFixed(1)} ${storage.unit}`,
        helperText: `${resolveLimitLabel(storage.limit, storage.unit)} available`,
        percentage: storage.percentage,
      },
      {
        key: "tokens",
        title: "AI Tokens",
        icon: Sparkles,
        usedLabel: formatNumber(tokens.used),
        helperText: `${resolveLimitLabel(tokens.limit)} available`,
        percentage: tokens.percentage,
      },
    ];
  }, [analytics]);

  if (isAuthLoading || isAnalyticsLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading analytics...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasStandardAccess) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl">
                Analytics Access Restricted
              </CardTitle>
              <CardDescription className="text-base">
                Please contact an administrator to request analytics access.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const {
    plan,
    charts: {
      papersOverTime = [],
      collectionsOverTime = [],
      storageOverTime = [],
      papersByStatus = [],
    },
  } = analytics;

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-8">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:from-primary/5">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" />
            <CardHeader className="space-y-1 pb-6 relative">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                {hasPremiumAccess
                  ? "Premium Analytics Hub"
                  : "Analytics Overview"}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {hasPremiumAccess
                  ? "Monitor quota health, track document velocity, and surface actionable insights for your research team."
                  : "Monitor research activity, storage usage, and uncover insights. Upgrade to PRO for advanced forecasting and collaboration analytics."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4 relative">
              <Badge
                variant={plan === "PRO" ? "default" : "secondary"}
                className="px-3 py-1 text-sm"
              >
                {plan} Plan
              </Badge>
              <RoleBadge role={user?.role || USER_ROLES.RESEARCHER} size="md" />
              {trendSummary.mostActiveDay && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Peak activity on{" "}
                  {new Date(trendSummary.mostActiveDay.date).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" }
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-muted-foreground/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Operational Insights</CardTitle>
              <CardDescription>
                Snapshot of your recent analytics momentum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{insight.title}</span>
                    {insight.trendLabel && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          insight.trendDirection === "down"
                            ? "text-red-500 dark:text-red-400"
                            : "text-green-500 dark:text-green-400"
                        }`}
                      >
                        {insight.trendDirection === "down" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {insight.trendLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {insight.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insight.helperText}
                  </p>
                  <Separator className="my-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {!hasPremiumAccess && (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-900/10">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-amber-200/80 p-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Unlock PRO Analytics
                  </CardTitle>
                  <CardDescription>
                    Upgrade to access historical AI token analysis, workspace
                    benchmarking, and anomaly detection.
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className="self-start border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-200"
              >
                Limited view
              </Badge>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {usageCards.map(({ key, ...stat }) => (
            <UsageStatCard key={key} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Paper Upload Velocity"
            description="Daily uploads across the past few weeks"
            icon={TrendingUp}
            isEmpty={!papersOverTime.length}
            emptyMessage="No paper uploads tracked yet"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={papersOverTime}>
                <defs>
                  <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/20"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Papers"
                  stroke={CHART_COLORS.primary}
                  fill="url(#colorPapers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Collection Growth"
            description="Collections created over time"
            icon={FolderOpen}
            isEmpty={!collectionsOverTime.length}
            emptyMessage="No collection activity yet"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={collectionsOverTime}>
                <defs>
                  <linearGradient
                    id="colorCollections"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.secondary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.secondary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/20"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Collections"
                  stroke={CHART_COLORS.secondary}
                  fill="url(#colorCollections)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Processing Status"
            description="Distribution of your paper processing states"
            icon={BarChart3}
            isEmpty={!papersByStatus.length}
            emptyMessage="No processing activity recorded"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={papersByStatus}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/20"
                />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Bar dataKey="count" name="Papers" radius={[6, 6, 0, 0]}>
                  {papersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? CHART_COLORS.primary}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Storage Growth"
            description="Storage consumption month over month"
            icon={Database}
            isEmpty={!storageOverTime.length}
            emptyMessage="No storage activity tracked"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={storageOverTime}>
                <defs>
                  <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.success}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.success}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/20"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="size"
                  name="Storage (MB)"
                  stroke={CHART_COLORS.success}
                  fill="url(#colorStorage)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

function UsageStatCard({
  title,
  icon: Icon,
  usedLabel,
  helperText,
  percentage,
}: UsageStat) {
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "[&>div]:bg-red-500 dark:[&>div]:bg-red-400";
    if (percent >= 75) return "[&>div]:bg-amber-500 dark:[&>div]:bg-amber-400";
    if (percent >= 50) return "[&>div]:bg-blue-500 dark:[&>div]:bg-blue-400";
    return "[&>div]:bg-green-500 dark:[&>div]:bg-green-400";
  };

  return (
    <Card className="border-muted-foreground/10 hover:border-primary/30 transition-all duration-200 hover:shadow-md dark:hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{usedLabel}</div>
        <p className="text-xs text-muted-foreground mb-3">{helperText}</p>
        <div className="space-y-2">
          <Progress
            value={Math.min(percentage, 100)}
            className={`h-2 ${getProgressColor(percentage)}`}
          />
          <p className="text-xs text-muted-foreground">
            {percentage.toFixed(1)}% of limit used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  description,
  icon: Icon,
  children,
  isEmpty,
  emptyMessage,
}: ChartCardProps) {
  return (
    <Card className="border-muted-foreground/10 hover:border-primary/30 transition-all duration-200 hover:shadow-md dark:hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[280px]">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
            <div className="mb-2 rounded-full bg-muted p-3">
              <Icon className="h-6 w-6" />
            </div>
            {emptyMessage || "No data available"}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
