"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityLog } from "@/components/activity/ActivityLog";
import { useGetActivitySummaryQuery } from "@/redux/api/discussionApi";
import { ArrowLeft, Activity, Download, Info, AlertTriangle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ResearchActivityLogPage() {
  const { data: summary, isLoading: isSummaryLoading } =
    useGetActivitySummaryQuery({});

  const severityCount = (key: string) =>
    summary?.activitiesBySeverity?.[key] || 0;
  const errorCount =
    severityCount("ERROR") + severityCount("CRITICAL");
  const typeTotal = summary?.activitiesByType
    ? Object.values(summary.activitiesByType).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-muted">
            <Link href="/dashboard/research">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Research
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Research Activity Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor and track all research-related activities
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/research/activity-log/export">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Link>
          </Button>
        </div>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold">
                  {isSummaryLoading
                    ? "—"
                    : summary?.totalActivities ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold">
                  {isSummaryLoading ? "—" : severityCount("INFO")}
                </div>
                <div className="text-sm text-muted-foreground">Info</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">
                  {isSummaryLoading ? "—" : severityCount("WARNING")}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <div className="text-2xl font-bold">
                  {isSummaryLoading ? "—" : errorCount}
                </div>
                <div className="text-sm text-muted-foreground">Errors & Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Component (real filters + export) */}
      <ActivityLog limit={100} />

      {/* Real Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity by Entity Type</CardTitle>
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading insights...
              </div>
            ) : !summary?.activitiesByType ||
              Object.keys(summary.activitiesByType).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activity data yet
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(summary.activitiesByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => {
                    const percentage =
                      typeTotal > 0 ? Math.round((count / typeTotal) * 100) : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading insights...
              </div>
            ) : !summary?.activitiesBySeverity ||
              Object.keys(summary.activitiesBySeverity).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activity data yet
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(summary.activitiesBySeverity)
                  .sort((a, b) => b[1] - a[1])
                  .map(([severity, count]) => {
                    const percentage =
                      typeTotal > 0 ? Math.round((count / typeTotal) * 100) : 0;
                    const color =
                      severity === "ERROR" || severity === "CRITICAL"
                        ? "bg-red-500"
                        : severity === "WARNING"
                          ? "bg-yellow-500"
                          : "bg-blue-500";
                    return (
                      <div key={severity} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{severity}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
