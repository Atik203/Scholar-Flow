"use client";

/**
 * WorkspaceAnalyticsPage
 *
 * Team Lead+ only. Shows aggregated metrics for the selected workspace.
 * Uses the user's first workspace (no workspace selector in v1; this will
 * be a follow-on enhancement when multi-workspace UI lands in the team
 * module).
 */

import { useState } from "react";
import Link from "next/link";
import { Users, FileText, BookOpen, Activity, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import { StatCard } from "@/components/analytics/StatCard";
import { TimeRangeSelector, type TimeRange } from "@/components/analytics/TimeRangeSelector";
import { useGetWorkspaceAnalyticsQuery } from "@/redux/api/analyticsApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";

export default function WorkspaceAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const { data: profile } = useGetProfileQuery();
  const { data: workspacesData } = useListWorkspacesQuery({ limit: 1 });
  const firstWorkspaceId = workspacesData?.data?.[0]?.id;
  const { data, isLoading } = useGetWorkspaceAnalyticsQuery(
    { workspaceId: firstWorkspaceId ?? "", timeRange },
    { skip: !firstWorkspaceId }
  );
  const summary = data?.data;

  if (!firstWorkspaceId) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          title="Workspace Analytics"
          description="Aggregated team metrics for your workspace"
          actions={
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard/analytics/personal">
                <ArrowLeft className="h-4 w-4" />
                Back to personal
              </Link>
            </Button>
          }
        />
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No workspace yet</h3>
            <p className="text-muted-foreground mb-4">
              Create or join a workspace to see aggregated analytics.
            </p>
            <Button asChild>
              <Link href="/dashboard/workspaces">Go to workspaces</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        icon={<TrendingUp className="h-7 w-7 text-white" />}
        title="Workspace Analytics"
        description={summary?.workspace.name ?? "Loading..."}
        actions={
          <>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard/analytics/personal">
                <ArrowLeft className="h-4 w-4" />
                Personal
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-12 w-12 rounded-xl mb-3" />
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              label="Members"
              value={summary.stats.totalMembers}
              change={`${summary.stats.activeMembers} active`}
              trend="up"
              icon={<Users className="h-5 w-5" />}
              color="from-emerald-500 to-teal-600"
            />
            <StatCard
              label="Papers"
              value={summary.stats.totalPapers}
              trend="up"
              icon={<FileText className="h-5 w-5" />}
              color="from-blue-500 to-indigo-600"
            />
            <StatCard
              label="Collections"
              value={summary.stats.totalCollections}
              trend="neutral"
              icon={<BookOpen className="h-5 w-5" />}
              color="from-purple-500 to-violet-600"
            />
            <StatCard
              label="Total Views"
              value={summary.stats.totalViews}
              change={`${summary.stats.totalAnnotations} ann.`}
              trend="up"
              icon={<Activity className="h-5 w-5" />}
              color="from-orange-500 to-red-600"
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top members</CardTitle>
          <CardDescription>Most active members in this period</CardDescription>
        </CardHeader>
        <CardContent>
          {summary?.topMembers && summary.topMembers.length > 0 ? (
            <div className="space-y-2">
              {summary.topMembers.map((m, i) => (
                <div
                  key={m.userId}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium flex items-center justify-center">
                    {(m.name ?? m.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {m.name ?? m.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.role} · {m.activityScore} actions
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No member activity in this period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
