/**
 * Personal Analytics Service
 *
 * Phase 7 personal analytics endpoint backing the figma PersonalAnalyticsPage.
 * Returns papers-read counts, annotations, discussions, reading streak,
 * achievements, productivity hours, and top papers.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";

type TimeRange = "week" | "month" | "quarter" | "year";

const rangeToDays: Record<TimeRange, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

const dayKey = (d: Date): string => d.toISOString().split("T")[0];

export const personalAnalyticsService = {
  async getSummary(userId: string, timeRange: TimeRange = "month") {
    const days = rangeToDays[timeRange];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Papers read = papers where usage event "paper_view" exists in window
    const paperViews = await prisma.usageEvent.findMany({
      where: {
        userId,
        kind: "paper_view",
        createdAt: { gte: since },
        isDeleted: false,
      },
      select: { paperId: true, createdAt: true },
    });

    const uniquePapersRead = new Set(paperViews.map((e) => e.paperId)).size;

    // Annotations in window
    const annotationsCount = await prisma.annotation.count({
      where: { userId, isDeleted: false, createdAt: { gte: since } },
    });

    // Discussion messages in window (count messages, not threads)
    const discussionsCount = await prisma.discussionMessage.count({
      where: { userId, isDeleted: false, createdAt: { gte: since } },
    });

    // Reading time = sum of units for kind=reading_session in window
    const readingEvents = await prisma.usageEvent.findMany({
      where: {
        userId,
        kind: "reading_session",
        createdAt: { gte: since },
        isDeleted: false,
      },
      select: { units: true, createdAt: true },
    });
    const readingMinutes = readingEvents.reduce(
      (sum, e) => sum + (e.units ?? 0),
      0
    );

    // Productivity hours (histogram of paper views by hour of day, full history)
    const allViews = await prisma.usageEvent.findMany({
      where: { userId, kind: "paper_view", isDeleted: false },
      select: { createdAt: true },
      take: 5000,
    });
    const productivityHours = buildHourHistogram(allViews.map((v) => v.createdAt));

    // Weekly activity histogram (last 7 days)
    const weeklyActivity = await buildWeeklyActivity(userId, since);

    // Reading streak (consecutive days with at least one event)
    const streak = await computeStreak(userId);

    // Top papers (most viewed in window)
    const topPapers = await buildTopPapers(paperViews);

    return {
      timeRange,
      stats: {
        papersRead: uniquePapersRead,
        annotations: annotationsCount,
        discussions: discussionsCount,
        readingMinutes,
      },
      streak,
      productivityHours,
      weeklyActivity,
      topPapers,
      achievements: ACHIEVEMENTS,
    };
  },

  async startReadingSession(userId: string, paperId?: string) {
    // Create a "reading_session" event with units=0; client will PATCH on stop.
    return prisma.usageEvent.create({
      data: {
        userId,
        kind: "reading_session",
        units: 0,
        paperId,
      },
    });
  },

  async stopReadingSession(eventId: string, units: number) {
    return prisma.usageEvent.update({
      where: { id: eventId },
      data: { units: Math.max(0, Math.floor(units)) },
    });
  },
};

const buildHourHistogram = (
  dates: Date[]
): Array<{ hour: string; value: number }> => {
  const buckets = new Array<string>(24).fill("0");
  for (const d of dates) {
    const h = d.getUTCHours();
    const cur = parseInt(buckets[h], 10);
    buckets[h] = String(cur + 1);
  }
  const result: Array<{ hour: string; value: number }> = [];
  for (let h = 0; h < 24; h += 1) {
    if (h % 2 === 0) {
      // sample every 2 hours to match figma mock
      result.push({ hour: formatHour(h), value: parseInt(buckets[h], 10) });
    }
  }
  return result;
};

const formatHour = (h: number) => {
  if (h === 0) return "12AM";
  if (h < 12) return `${h}AM`;
  if (h === 12) return "12PM";
  return `${h - 12}PM`;
};

const buildWeeklyActivity = async (
  userId: string,
  since: Date
): Promise<
  Array<{ day: string; papers: number; annotations: number; discussions: number }>
> => {
  // Aggregate per day for the last 7 days
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [views, annotations, messages] = await Promise.all([
    prisma.usageEvent.findMany({
      where: {
        userId,
        kind: "paper_view",
        createdAt: { gte: since7 },
        isDeleted: false,
      },
      select: { paperId: true, createdAt: true },
    }),
    prisma.annotation.findMany({
      where: { userId, isDeleted: false, createdAt: { gte: since7 } },
      select: { createdAt: true },
    }),
    prisma.discussionMessage.findMany({
      where: { userId, isDeleted: false, createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const days: Array<{
    day: string;
    papers: number;
    annotations: number;
    discussions: number;
  }> = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({
      day,
      papers: new Set(views.filter((v) => dayKey(v.createdAt) === key).map((v) => v.paperId)).size,
      annotations: annotations.filter((a) => dayKey(a.createdAt) === key).length,
      discussions: messages.filter((m) => dayKey(m.createdAt) === key).length,
    });
  }
  return days;
};

const computeStreak = async (userId: string) => {
  // Consecutive days (ending today) with at least one event
  const events = await prisma.usageEvent.findMany({
    where: { userId, isDeleted: false },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });
  if (events.length === 0) return { days: 0, lastSevenDays: [] as boolean[] };

  const activeDays = new Set(events.map((e) => dayKey(e.createdAt)));
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (activeDays.has(dayKey(d))) {
      streak += 1;
    } else if (i > 0) {
      // Allow today to be empty (no break yet), but stop at first past gap
      break;
    }
  }

  const lastSevenDays: boolean[] = [];
  for (let i = 27; i >= 0; i -= 1) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    lastSevenDays.push(activeDays.has(dayKey(d)));
  }
  return { days: streak, lastSevenDays };
};

const buildTopPapers = async (
  views: Array<{ paperId: string | null; createdAt: Date }>
) => {
  if (views.length === 0) return [];
  const counts = new Map<string, number>();
  for (const v of views) {
    if (!v.paperId) continue;
    counts.set(v.paperId, (counts.get(v.paperId) ?? 0) + 1);
  }
  const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  if (top.length === 0) return [];
  const papers = await prisma.paper.findMany({
    where: { id: { in: top.map((t) => t[0]) }, isDeleted: false },
    select: {
      id: true,
      title: true,
      citationCount: true,
    },
  });
  return papers.map((p) => {
    const c = top.find((t) => t[0] === p.id)?.[1] ?? 0;
    return {
      id: p.id,
      title: p.title,
      views: c,
      citations: p.citationCount,
    };
  });
};

// Static achievement catalog (matches the figma list). Persisted in Phase 8.
const ACHIEVEMENTS = [
  {
    id: "a1",
    name: "Paper Pioneer",
    description: "Read your first 10 papers",
    icon: "trophy",
    rarity: "common",
    isUnlocked: true,
  },
  {
    id: "a2",
    name: "Annotation Master",
    description: "Create 100 annotations",
    icon: "medal",
    rarity: "rare",
    isUnlocked: true,
  },
  {
    id: "a3",
    name: "Streak Champion",
    description: "Maintain a 14-day reading streak",
    icon: "flame",
    rarity: "rare",
    isUnlocked: true,
  },
  {
    id: "a4",
    name: "Knowledge Sharer",
    description: "Participate in 50 discussions",
    icon: "star",
    rarity: "epic",
    isUnlocked: false,
    progress: 46,
  },
  {
    id: "a5",
    name: "Deep Diver",
    description: "Read papers for 100 hours total",
    icon: "zap",
    rarity: "legendary",
    isUnlocked: false,
    progress: 78,
  },
  {
    id: "a6",
    name: "Speed Reader",
    description: "Read 5 papers in a single day",
    icon: "award",
    rarity: "epic",
    isUnlocked: false,
    progress: 80,
  },
];

export default personalAnalyticsService;
