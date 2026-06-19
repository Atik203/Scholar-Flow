"use client";

/**
 * PersonalAnalyticsPage (default /dashboard/analytics)
 *
 * Compact overview of the user's research activity. Combines stat tiles,
 * reading streak, achievements grid, and top papers. Drives the navigation
 * to deeper subpages (workspace / usage / export).
 */

import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, BookOpen, Download, Flame, MessageSquare, PenTool, Sparkles, Trophy, Star, Medal, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import { StatCard } from "@/components/analytics/StatCard";
import { TimeRangeSelector, type TimeRange } from "@/components/analytics/TimeRangeSelector";
import { useGetPersonalAnalyticsQuery } from "@/redux/api/analyticsApi";

const ACHIEVEMENT_ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  award: Award,
  flame: Flame,
  zap: Zap,
};

const RARITY_BORDER: Record<string, string> = {
  common: "border-slate-300 dark:border-slate-600",
  rare: "border-blue-400 dark:border-blue-500",
  epic: "border-purple-400 dark:border-purple-500",
  legendary: "border-amber-400 dark:border-amber-500",
};

const RARITY_GRADIENT: Record<string, string> = {
  common: "from-amber-400 to-amber-600",
  rare: "from-emerald-400 to-emerald-600",
  epic: "from-purple-400 to-pink-500",
  legendary: "from-cyan-400 to-teal-500",
};

const formatReadingMinutes = (m: number) => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r > 0 ? `${h}h ${r}m` : `${h}h`;
};

export default function PersonalAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const { data, isLoading } = useGetPersonalAnalyticsQuery({ timeRange });
  const summary = data?.data;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        icon={<BarChart3 className="h-7 w-7 text-white" />}
        title="Personal Analytics"
        description="Track your research productivity and engagement"
        actions={
          <>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Button
              asChild
              variant="default"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <a href="/dashboard/analytics/export">
                <Download className="h-4 w-4" />
                Export
              </a>
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
              label="Papers Read"
              value={summary.stats.papersRead}
              change={`+${summary.stats.papersRead}`}
              trend="up"
              icon={<BookOpen className="h-5 w-5" />}
              color="from-blue-500 to-indigo-600"
              delay={0}
            />
            <StatCard
              label="Annotations"
              value={summary.stats.annotations}
              change={`+${summary.stats.annotations}`}
              trend="up"
              icon={<PenTool className="h-5 w-5" />}
              color="from-emerald-500 to-teal-600"
              delay={0.05}
            />
            <StatCard
              label="Discussions"
              value={summary.stats.discussions}
              change={`+${summary.stats.discussions}`}
              trend="up"
              icon={<MessageSquare className="h-5 w-5" />}
              color="from-purple-500 to-violet-600"
              delay={0.1}
            />
            <StatCard
              label="Reading Time"
              value={formatReadingMinutes(summary.stats.readingMinutes)}
              change="Current"
              trend="neutral"
              icon={<Flame className="h-5 w-5" />}
              color="from-orange-500 to-red-600"
              delay={0.15}
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Reading Streak</CardTitle>
                <CardDescription>
                  {summary?.streak.days ?? 0} consecutive day
                  {summary?.streak.days === 1 ? "" : "s"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {summary?.streak.lastSevenDays ? (
              <div className="flex gap-2">
                {summary.streak.lastSevenDays.slice(-7).map((active, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center text-xs font-medium ${
                      active
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {active ? "✓" : "—"}
                  </div>
                ))}
              </div>
            ) : (
              <Skeleton className="h-12 w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  {summary?.achievements.filter((a) => a.isUnlocked).length ??
                    0}{" "}
                  unlocked
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {summary?.achievements ? (
              <div className="grid grid-cols-3 gap-3">
                {summary.achievements.slice(0, 6).map((a) => {
                  const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Trophy;
                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-xl border-2 ${RARITY_BORDER[a.rarity]} ${
                        a.isUnlocked
                          ? "bg-white dark:bg-slate-800"
                          : "bg-slate-50 dark:bg-slate-900 opacity-50"
                      } flex flex-col items-center text-center`}
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${RARITY_GRADIENT[a.rarity]} text-white mb-2`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-medium">{a.name}</p>
                      {!a.isUnlocked && a.progress && (
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded mt-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded"
                            style={{ width: `${a.progress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Top papers</CardTitle>
              <CardDescription>
                Most viewed papers in this period
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {summary?.topPapers && summary.topPapers.length > 0 ? (
            <div className="space-y-2">
              {summary.topPapers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.views} views · {p.citations} citations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No data yet — start reading papers to see them here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
