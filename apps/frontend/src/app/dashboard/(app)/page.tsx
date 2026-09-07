"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { USER_ROLES } from "@/lib/auth/roles";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { useGetPersonalAnalyticsQuery } from "@/redux/api/analyticsApi";
import { useAuth } from "@/redux/auth/useAuth";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  Layers,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ============================================================================
// Types
// ============================================================================
interface WeeklyDay {
  day: string;
  papers: number;
  annotations: number;
  discussions: number;
}

interface ActivityFeedItem {
  id: string;
  type: "upload" | "annotation" | "ai" | "share" | "collection" | "workspace";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

interface DashboardGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  status: "on-track" | "behind" | "completed";
}

// ============================================================================
// Formatting helpers
// ============================================================================
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function timeAgo(dateString: string): string {
  return formatRelativeTime(dateString);
}

// ============================================================================
// Skeleton Components
// ============================================================================
function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-9 w-20 mb-1" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-60 mb-6" />
      <div className="flex items-end gap-4 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton className="w-full rounded-t" style={{ height: `${20 + (i % 5) * 15}%` }} />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================
function ActivityFeedRow({ item }: { item: ActivityFeedItem }) {
  const Icon = item.icon;
  const colorMap: Record<string, string> = {
    upload: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    annotation: "text-green-600 bg-green-50 dark:bg-green-950/40",
    ai: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
    share: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
    collection: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40",
    workspace: "text-teal-600 bg-teal-50 dark:bg-teal-950/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
          colorMap[item.type] || "bg-muted"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {item.description}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {timeAgo(item.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main Dashboard Page
// ============================================================================
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DashboardHomePage() {
  const { user } = useAuth();
  const userRole = user?.role || USER_ROLES.RESEARCHER;
  const firstName = user?.name?.split(" ")[0] || user?.firstName || "Researcher";

  const [showCustomize, setShowCustomize] = useState(false);
  const [dateRange, setDateRange] = useState<string>("week");

  const [visibleWidgets, setVisibleWidgets] = useState({
    stats: true,
    chart: true,
    goals: true,
    papers: true,
    activity: true,
    ai: true,
    quickActions: true,
  });

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    limit: 5,
  });
  const { data: collectionsData, isLoading: collectionsLoading } =
    useGetMyCollectionsQuery({ limit: 5, page: 1 });
  const { data: workspacesData, isLoading: workspacesLoading } =
    useListWorkspacesQuery({ limit: 1 });
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetPersonalAnalyticsQuery({ timeRange: dateRange as "week" | "month" });

  const totalPapers = papersData?.items?.length ?? 0;
  const totalCollections = collectionsData?.meta?.total ?? 0;
  const totalWorkspaces = workspacesData?.data?.length ?? 0;
  const annotationsCount = analyticsData?.data?.stats?.annotations ?? 0;
  const aiQueriesCount = analyticsData?.data?.stats?.discussions ?? 0;
  const papersRead = analyticsData?.data?.stats?.papersRead ?? 0;

  const weeklyActivity: WeeklyDay[] = useMemo(() => {
    const fromApi = analyticsData?.data?.weeklyActivity;
    if (fromApi && fromApi.length > 0) return fromApi;
    return DAYS_SHORT.map((day) => ({
      day,
      papers: 0,
      annotations: 0,
      discussions: 0,
    }));
  }, [analyticsData]);

  const totalPapersThisWeek = weeklyActivity.reduce((a, d) => a + d.papers, 0);
  const totalAnnotationsThisWeek = weeklyActivity.reduce(
    (a, d) => a + d.annotations,
    0
  );
  const totalSearchesThisWeek = weeklyActivity.reduce(
    (a, d) => a + d.discussions,
    0
  );

  const recentPapers = useMemo(
    () => papersData?.items ?? [],
    [papersData]
  );
  const recentCollections = useMemo(
    () =>
      (collectionsData?.result ?? []) as Array<{
        id: string;
        name: string;
        description?: string;
        _count?: { papers: number; members: number };
        createdAt: string;
        updatedAt: string;
      }>,
    [collectionsData]
  );

  const activityFeed: ActivityFeedItem[] = useMemo(() => {
    const items: ActivityFeedItem[] = [
      ...recentPapers.slice(0, 3).map((p) => ({
        id: `paper-${p.id}`,
        type: "upload" as const,
        title: "Paper uploaded",
        description: `Added "${p.title}" to library`,
        timestamp: p.createdAt,
        icon: Upload,
      })),
      ...recentCollections.slice(0, 2).map((c) => ({
        id: `collection-${c.id}`,
        type: "collection" as const,
        title: "Collection created",
        description: `Created "${c.name}"`,
        timestamp: c.createdAt,
        icon: FolderOpen,
      })),
    ];
    return items
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 5);
  }, [recentPapers, recentCollections]);

  const goals: DashboardGoal[] = useMemo(() => {
    const paperTarget = 20;
    const annotationTarget = 100;
    const aiTarget = 10;
    return [
      {
        id: "g1",
        title: "Read research papers",
        target: paperTarget,
        current: Math.min(papersRead, paperTarget),
        unit: "papers",
        status:
          papersRead >= paperTarget
            ? "completed"
            : papersRead >= paperTarget * 0.6
              ? "on-track"
              : "behind",
      },
      {
        id: "g2",
        title: "Literature annotations",
        target: annotationTarget,
        current: Math.min(annotationsCount, annotationTarget),
        unit: "annotations",
        status:
          annotationsCount >= annotationTarget
            ? "completed"
            : annotationsCount >= annotationTarget * 0.6
              ? "on-track"
              : "behind",
      },
      {
        id: "g3",
        title: "AI-assisted summaries",
        target: aiTarget,
        current: Math.min(aiQueriesCount, aiTarget),
        unit: "summaries",
        status:
          aiQueriesCount >= aiTarget
            ? "completed"
            : aiQueriesCount >= aiTarget * 0.5
              ? "on-track"
              : "behind",
      },
    ];
  }, [papersRead, annotationsCount, aiQueriesCount]);

  const statsCards = useMemo(() => {
    return [
      {
        label: "Papers Read",
        value: papersRead,
        icon: BookOpen,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
        trend: papersRead > 0 ? "up" : "neutral",
        change: papersRead > 0 ? `${papersRead}` : "—",
      },
      {
        label: "Annotations",
        value: annotationsCount,
        icon: MessageSquare,
        color:
          "text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400",
        trend: annotationsCount > 0 ? "up" : "neutral",
        change: annotationsCount > 0 ? `${annotationsCount}` : "—",
      },
      {
        label: "Collections",
        value: totalCollections,
        icon: FolderOpen,
        color:
          "text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400",
        trend: totalCollections > 0 ? "up" : "neutral",
        change: totalCollections > 0 ? `${totalCollections}` : "—",
      },
      {
        label: "Workspaces",
        value: totalWorkspaces,
        icon: Layers,
        color:
          "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
        trend: totalWorkspaces > 0 ? "up" : "neutral",
        change: totalWorkspaces > 0 ? `${totalWorkspaces}` : "—",
      },
    ];
  }, [papersRead, annotationsCount, totalCollections, totalWorkspaces]);

  const maxPapers = Math.max(...weeklyActivity.map((d) => d.papers), 1);
  const maxAnnotations = Math.max(
    ...weeklyActivity.map((d) => d.annotations),
    1
  );
  const maxSearches = Math.max(
    ...weeklyActivity.map((d) => d.discussions),
    1
  );

  const isLoading =
    papersLoading || collectionsLoading || workspacesLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <Skeleton className="h-6 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {firstName}
            </h1>
            <RoleBadge role={userRole} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your research progress.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 px-3 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => setShowCustomize(true)}
          >
            <Settings className="h-4 w-4 mr-1.5" />
            Customize
          </Button>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────────────── */}
      {visibleWidgets.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="group rounded-xl border bg-card p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                    stat.trend === "up"
                      ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40"
                      : "text-muted-foreground bg-muted"
                  )}
                >
                  {stat.trend === "up" && (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Chart + Goals ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        {visibleWidgets.chart && (
          <div className="lg:col-span-2 rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="font-semibold text-base">Weekly Activity</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {totalPapersThisWeek} papers &middot;{" "}
                  {totalAnnotationsThisWeek} annotations &middot;{" "}
                  {totalSearchesThisWeek} searches
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                  <span className="text-muted-foreground">Papers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-green-500" />
                  <span className="text-muted-foreground">Annotations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                  <span className="text-muted-foreground">Searches</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 sm:gap-3 h-44 sm:h-52">
              {weeklyActivity.map((day, index) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex gap-0.5 sm:gap-1 items-end h-36 sm:h-44">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height:
                          maxPapers > 0
                            ? `${(day.papers / maxPapers) * 100}%`
                            : "0%",
                      }}
                      transition={{ delay: 0.2 + index * 0.04, duration: 0.5 }}
                      className="flex-1 bg-primary/80 rounded-t-sm min-h-[3px]"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height:
                          maxAnnotations > 0
                            ? `${(day.annotations / maxAnnotations) * 100}%`
                            : "0%",
                      }}
                      transition={{
                        delay: 0.25 + index * 0.04,
                        duration: 0.5,
                      }}
                      className="flex-1 bg-green-500/80 rounded-t-sm min-h-[3px]"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height:
                          maxSearches > 0
                            ? `${(day.discussions / maxSearches) * 100}%`
                            : "0%",
                      }}
                      transition={{ delay: 0.3 + index * 0.04, duration: 0.5 }}
                      className="flex-1 bg-purple-500/80 rounded-t-sm min-h-[3px]"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {day.day.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Goals */}
        {visibleWidgets.goals && (
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base">Research Goals</h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-5">
              {goals.map((goal) => {
                const pct = Math.min(
                  Math.round((goal.current / goal.target) * 100),
                  100
                );
                return (
                  <div key={goal.id} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal.title}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          goal.status === "completed" &&
                            "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
                          goal.status === "on-track" &&
                            "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
                          goal.status === "behind" &&
                            "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                        )}
                      >
                        {goal.status === "completed"
                          ? "Done"
                          : goal.status === "on-track"
                            ? "On Track"
                            : "Behind"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <Progress
                        value={pct}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Papers + Activity Feed ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Papers */}
        {visibleWidgets.papers && (
          <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-base">Recent Papers</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/papers" className="text-xs">
                  View All
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </Button>
            </div>
            <div className="divide-y max-h-[440px] overflow-auto">
              {recentPapers.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No papers yet.{" "}
                    <Link
                      href="/dashboard/papers/upload"
                      className="text-primary hover:underline font-medium"
                    >
                      Upload one
                    </Link>{" "}
                    to get started.
                  </p>
                </div>
              ) : (
                recentPapers.slice(0, 4).map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <Link
                      href={`/dashboard/papers/${paper.id}`}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-muted/40 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {paper.title}
                          </h4>
                          {paper.processingStatus === "PROCESSED" && (
                            <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paper.metadata?.authors?.slice(0, 2).join(", ") ||
                            "Unknown authors"}
                          {paper.metadata?.year &&
                            ` · ${paper.metadata.year}`}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
                          <span className="flex items-center gap-1">
                            <Search className="h-3 w-3" />
                            {paper.language || "en"}
                          </span>
                          <span>{formatRelativeTime(paper.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        {visibleWidgets.activity && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-base">Recent Activity</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/activity-log/recent" className="text-xs">
                  <Clock className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="p-4 space-y-1 max-h-[440px] overflow-auto divide-y divide-border/50">
              {activityFeed.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No recent activity yet. Upload your first paper to get
                    started.
                  </p>
                </div>
              ) : (
                activityFeed.map((item) => (
                  <ActivityFeedRow key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── AI Research Insights ─────────────────────────────────────── */}
      {visibleWidgets.ai && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 shadow-lg shadow-primary/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-base">AI Research Insights</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-2xl">
                You have {totalPapers} papers in your library across{" "}
                {totalCollections} collections.
                {papersRead > 0
                  ? ` You've read ${papersRead} papers so far. Try our AI tools to extract key findings, compare papers, or generate summaries.`
                  : " Upload papers to unlock AI-powered summaries, key point extraction, and research insights."}
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <Button size="sm" asChild>
                  <Link href="/dashboard/ai-insights">
                    <Brain className="h-4 w-4 mr-1.5" />
                    AI Insights
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/dashboard/analytics">
                    View Analytics
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      {visibleWidgets.quickActions && (
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Upload,
                label: "Upload Paper",
                href: "/dashboard/papers/upload",
                color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
                hoverColor: "group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60",
              },
              {
                icon: Brain,
                label: "Ask AI",
                href: "/dashboard/ai-insights",
                color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
                hoverColor: "group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60",
              },
              {
                icon: FolderOpen,
                label: "New Collection",
                href: "/dashboard/collections/create",
                color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400",
                hoverColor: "group-hover:bg-orange-100 dark:group-hover:bg-orange-950/60",
              },
              {
                icon: Users,
                label: "Invite Team",
                href: "/dashboard/workspaces/create",
                color: "text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400",
                hoverColor: "group-hover:bg-green-100 dark:group-hover:bg-green-950/60",
              },
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
              >
                <Link
                  href={action.href}
                  className="group p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col items-center gap-3 text-center"
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-colors duration-200",
                      action.color,
                      action.hoverColor
                    )}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Customize Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCustomize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCustomize(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-xl border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-lg font-semibold">Customize Dashboard</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowCustomize(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-5 space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Choose which widgets to display on your dashboard.
                </p>
                {[
                  { id: "stats", label: "Stats Cards" },
                  { id: "chart", label: "Weekly Activity Chart" },
                  { id: "goals", label: "Research Goals" },
                  { id: "papers", label: "Recent Papers" },
                  { id: "activity", label: "Activity Feed" },
                  { id: "ai", label: "AI Insights Summary" },
                  { id: "quickActions", label: "Quick Actions" },
                ].map((widget) => (
                  <label
                    key={widget.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-medium">{widget.label}</span>
                    <input
                      type="checkbox"
                      checked={
                        visibleWidgets[
                          widget.id as keyof typeof visibleWidgets
                        ]
                      }
                      onChange={(e) =>
                        setVisibleWidgets((prev) => ({
                          ...prev,
                          [widget.id]: e.target.checked,
                        }))
                      }
                      className="rounded border-input"
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 p-5 border-t">
                <Button
                  variant="ghost"
                  onClick={() => setShowCustomize(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowCustomize(false)}>
                  <Check className="h-4 w-4 mr-1.5" /> Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
