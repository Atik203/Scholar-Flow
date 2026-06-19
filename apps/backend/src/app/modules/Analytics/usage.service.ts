/**
 * Usage Reports Service
 *
 * Pro+ feature. Aggregates per-user usage metrics for the
 * UsageReportsPage and ExportAnalyticsPage.
 */

import prisma from "../../shared/prisma";

type TimeRange = "week" | "month" | "quarter" | "year";

const rangeToDays: Record<TimeRange, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

export const usageReportsService = {
  async getReport(userId: string, timeRange: TimeRange = "month") {
    const days = rangeToDays[timeRange];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.usageEvent.findMany({
      where: { userId, createdAt: { gte: since }, isDeleted: false },
      select: { kind: true, units: true, createdAt: true },
    });

    // Group by kind
    const byKind = new Map<string, { count: number; units: number }>();
    for (const e of events) {
      const entry = byKind.get(e.kind) ?? { count: 0, units: 0 };
      entry.count += 1;
      entry.units += e.units;
      byKind.set(e.kind, entry);
    }

    const totalApiCalls = events.length;
    const aiCreditsUsed = byKind.get("ai_summarize")?.units ?? 0;

    // Per-day totals
    const dayKey = (d: Date) => d.toISOString().split("T")[0];
    const perDay = new Map<string, { apiCalls: number; papers: number; aiCredits: number }>();
    for (const e of events) {
      const k = dayKey(e.createdAt);
      const cur = perDay.get(k) ?? { apiCalls: 0, papers: 0, aiCredits: 0 };
      cur.apiCalls += 1;
      if (e.kind === "paper_view" || e.kind === "paper_upload") cur.papers += 1;
      if (e.kind === "ai_summarize") cur.aiCredits += e.units;
      perDay.set(k, cur);
    }
    const dailyUsage = Array.from(perDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));

    // Feature breakdown (by kind sorted desc)
    const featureUsage = Array.from(byKind.entries())
      .map(([feature, v]) => ({
        feature,
        count: v.count,
        percentage: 0, // computed below
        trend: 0,
      }))
      .sort((a, b) => b.count - a.count);

    const totalCount = featureUsage.reduce((s, f) => s + f.count, 0) || 1;
    for (const f of featureUsage) {
      f.percentage = Math.round((f.count / totalCount) * 100);
    }

    return {
      timeRange,
      overview: {
        totalApiCalls,
        apiCallsChange: 0,
        storageUsed: 0,
        storageLimit: 10,
        storageChange: 0,
        papersProcessed: byKind.get("paper_upload")?.count ?? 0,
        papersChange: 0,
        aiCreditsUsed,
        aiCreditsLimit: 1000,
        aiCreditsChange: 0,
      },
      dailyUsage,
      featureUsage,
    };
  },

  async exportReport(userId: string, format: "csv" | "json" = "csv") {
    const report = await this.getReport(userId, "month");
    if (format === "json") {
      return {
        mimeType: "application/json",
        filename: `usage-report-${new Date().toISOString().split("T")[0]}.json`,
        content: JSON.stringify(report, null, 2),
      };
    }

    const headers = [
      "date",
      "apiCalls",
      "papers",
      "aiCredits",
    ];
    const lines: string[] = [headers.join(",")];
    for (const d of report.dailyUsage) {
      lines.push(`${d.date},${d.apiCalls},${d.papers},${d.aiCredits}`);
    }
    return {
      mimeType: "text/csv",
      filename: `usage-report-${new Date().toISOString().split("T")[0]}.csv`,
      content: lines.join("\n"),
    };
  },
};

export default usageReportsService;
