"use client";

/**
 * UsageReportsPage
 *
 * Pro+ only. Shows API/storage/AI credit usage with feature breakdown
 * and per-day activity chart. Matches the figma UsageReportsPage layout.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Activity, BarChart3, Bot, Database, Download, FileText, HardDrive, Lock, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import { StatCard } from "@/components/analytics/StatCard";
import { TimeRangeSelector, type TimeRange } from "@/components/analytics/TimeRangeSelector";
import { useGetUsageReportQuery, useGetAiUsageQuery } from "@/redux/api/analyticsApi";
import { USER_ROLES, hasRoleAccess } from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";

const COLORS = ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

export default function UsageReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const { data: usageData, isLoading } = useGetUsageReportQuery({ timeRange });
  const { data: aiUsageData } = useGetAiUsageQuery({ timeRange });
  const overview = usageData?.data.overview;
  const featureUsage = usageData?.data.featureUsage ?? [];
  const dailyUsage = usageData?.data.dailyUsage ?? [];
  const aiUsage = aiUsageData?.data;

  const { session } = useAuth();
  const userRole = session?.user?.role ?? USER_ROLES.RESEARCHER;
  const hasAccess = hasRoleAccess(userRole, USER_ROLES.PRO_RESEARCHER);

  if (!hasAccess) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader
          icon={<BarChart3 className="h-7 w-7 text-white" />}
          title="Usage Reports"
          description="Detailed feature usage and limits"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Pro feature</h3>
            <p className="text-muted-foreground mb-4">
              Usage reports are available on the Pro plan and above.
            </p>
            <Button asChild>
              <a href="/pricing">Upgrade</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        icon={<BarChart3 className="h-7 w-7 text-white" />}
        title="Usage Reports"
        description="Detailed feature usage and limits"
        actions={
          <>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Button
              asChild
              variant="default"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <a href="/api/analytics/usage/export?format=csv" target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                Export
              </a>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading || !overview ? (
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
              label="API Calls"
              value={overview.totalApiCalls.toLocaleString()}
              change={`${overview.apiCallsChange >= 0 ? "+" : ""}${overview.apiCallsChange}%`}
              trend={overview.apiCallsChange >= 0 ? "up" : "down"}
              icon={<Activity className="h-5 w-5" />}
              color="from-blue-500 to-indigo-600"
            />
            <StatCard
              label="Storage"
              value={`${overview.storageUsed.toFixed(1)} GB`}
              change={`of ${overview.storageLimit} GB`}
              trend="neutral"
              icon={<HardDrive className="h-5 w-5" />}
              color="from-emerald-500 to-teal-600"
            />
            <StatCard
              label="Papers Processed"
              value={overview.papersProcessed.toLocaleString()}
              change={`${overview.papersChange >= 0 ? "+" : ""}${overview.papersChange}%`}
              trend={overview.papersChange >= 0 ? "up" : "down"}
              icon={<FileText className="h-5 w-5" />}
              color="from-purple-500 to-violet-600"
            />
            <StatCard
              label="AI Credits"
              value={`${overview.aiCreditsUsed} / ${overview.aiCreditsLimit}`}
              change={`${overview.aiCreditsChange >= 0 ? "+" : ""}${overview.aiCreditsChange}%`}
              trend={overview.aiCreditsChange >= 0 ? "up" : "down"}
              icon={<Zap className="h-5 w-5" />}
              color="from-orange-500 to-red-600"
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature usage</CardTitle>
            <CardDescription>Top features by event count</CardDescription>
          </CardHeader>
          <CardContent>
            {featureUsage.length > 0 ? (
              <div className="space-y-4">
                {featureUsage.slice(0, 8).map((f, i) => (
                  <div key={f.feature}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{f.feature}</span>
                      <span className="text-muted-foreground">
                        {f.count} ({f.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.percentage}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No usage events in this period.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily activity</CardTitle>
            <CardDescription>API calls per day</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyUsage.length > 0 ? (
              <div className="flex items-end gap-1 h-40">
                {dailyUsage.slice(-14).map((d) => {
                  const max = Math.max(...dailyUsage.map((x) => x.apiCalls), 1);
                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1"
                      title={`${d.date}: ${d.apiCalls} calls`}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t"
                        style={{ height: `${(d.apiCalls / max) * 100}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <Database className="w-8 h-8 mr-2" />
                No data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Usage Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          AI Usage Details
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total AI Messages"
            value={(aiUsage?.totalMessages ?? 0).toLocaleString()}
            icon={<MessageCircle className="h-5 w-5" />}
            color="from-orange-500 to-amber-600"
          />
          <StatCard
            label="Total Tokens"
            value={(aiUsage?.totalTokens ?? 0).toLocaleString()}
            icon={<Activity className="h-5 w-5" />}
            color="from-cyan-500 to-teal-600"
          />
          <StatCard
            label="Total Cost"
            value={`$${((aiUsage?.totalCostCents ?? 0) / 100).toFixed(4)}`}
            icon={<Zap className="h-5 w-5" />}
            color="from-red-500 to-rose-600"
          />
          <StatCard
            label="Models Used"
            value={(aiUsage?.byModel?.length ?? 0).toString()}
            icon={<Bot className="h-5 w-5" />}
            color="from-violet-500 to-purple-600"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Model</CardTitle>
              <CardDescription>Token and cost breakdown per model</CardDescription>
            </CardHeader>
            <CardContent>
              {aiUsage && aiUsage.byModel.length > 0 ? (
                <div className="space-y-4">
                  {aiUsage.byModel.slice(0, 8).map((m, i) => (
                    <div key={m.model}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium truncate">{m.model}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          {m.tokens.toLocaleString()} tokens · ${(m.costCents / 100).toFixed(4)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(m.costCents / Math.max(aiUsage.totalCostCents, 1)) * 100}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No AI usage data in this period.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Token Usage</CardTitle>
              <CardDescription>AI tokens consumed per day</CardDescription>
            </CardHeader>
            <CardContent>
              {aiUsage && aiUsage.dailyUsage.length > 0 ? (
                <div className="flex items-end gap-1 h-40">
                  {aiUsage.dailyUsage.slice(-14).map((d) => {
                    const max = Math.max(...aiUsage.dailyUsage.map((x) => x.tokens), 1);
                    return (
                      <div
                        key={d.date}
                        className="flex-1 flex flex-col items-center gap-1"
                        title={`${d.date}: ${d.tokens.toLocaleString()} tokens ($${(d.costCents / 100).toFixed(4)})`}
                      >
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-amber-500 rounded-t"
                          style={{ height: `${(d.tokens / max) * 100}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <Database className="w-8 h-8 mr-2" />
                  No data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
