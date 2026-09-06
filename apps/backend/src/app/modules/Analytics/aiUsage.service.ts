import prisma from "../../shared/prisma";

type TimeRange = "week" | "month" | "quarter" | "year";

const rangeToDays: Record<TimeRange, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

interface AiUsageSummary {
  totalTokens: number;
  totalCostCents: number;
  totalMessages: number;
  byModel: Array<{
    model: string;
    tokens: number;
    costCents: number;
    messages: number;
  }>;
  dailyUsage: Array<{
    date: string;
    tokens: number;
    costCents: number;
    messages: number;
  }>;
  timeRange: TimeRange;
}

export const aiUsageService = {
  async getAiUsage(userId: string, timeRange: TimeRange = "month"): Promise<AiUsageSummary> {
    const days = rangeToDays[timeRange];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const messages = await prisma.aIConversationMessage.findMany({
      where: {
        role: "assistant",
        tokensUsed: { not: null },
        conversation: { userId },
        createdAt: { gte: since },
      },
      select: {
        tokensUsed: true,
        costCents: true,
        model: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const totalTokens = messages.reduce((s, m) => s + (m.tokensUsed ?? 0), 0);
    const totalCostCents = messages.reduce((s, m) => s + (m.costCents ?? 0), 0);

    const byModelMap = new Map<string, { tokens: number; costCents: number; messages: number }>();
    const dayMap = new Map<string, { tokens: number; costCents: number; messages: number }>();

    for (const m of messages) {
      const model = m.model ?? "unknown";
      const entry = byModelMap.get(model) ?? { tokens: 0, costCents: 0, messages: 0 };
      entry.tokens += m.tokensUsed ?? 0;
      entry.costCents += m.costCents ?? 0;
      entry.messages += 1;
      byModelMap.set(model, entry);

      const day = m.createdAt.toISOString().split("T")[0];
      const dayEntry = dayMap.get(day) ?? { tokens: 0, costCents: 0, messages: 0 };
      dayEntry.tokens += m.tokensUsed ?? 0;
      dayEntry.costCents += m.costCents ?? 0;
      dayEntry.messages += 1;
      dayMap.set(day, dayEntry);
    }

    const byModel = Array.from(byModelMap.entries())
      .map(([model, v]) => ({ model, ...v }))
      .sort((a, b) => b.costCents - a.costCents);

    const dailyUsage = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));

    return {
      totalTokens,
      totalCostCents,
      totalMessages: messages.length,
      byModel,
      dailyUsage,
      timeRange,
    };
  },

  async getAdminAiUsage(timeRange: TimeRange = "month") {
    const days = rangeToDays[timeRange];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const messages = await prisma.aIConversationMessage.findMany({
      where: {
        role: "assistant",
        tokensUsed: { not: null },
        createdAt: { gte: since },
      },
      select: {
        tokensUsed: true,
        costCents: true,
        model: true,
        conversation: { select: { userId: true } },
      },
    });

    const totalTokens = messages.reduce((s, m) => s + (m.tokensUsed ?? 0), 0);
    const totalCostCents = messages.reduce((s, m) => s + (m.costCents ?? 0), 0);

    const byUserMap = new Map<string, { tokens: number; costCents: number; messages: number }>();
    for (const m of messages) {
      const uid = m.conversation.userId;
      const entry = byUserMap.get(uid) ?? { tokens: 0, costCents: 0, messages: 0 };
      entry.tokens += m.tokensUsed ?? 0;
      entry.costCents += m.costCents ?? 0;
      entry.messages += 1;
      byUserMap.set(uid, entry);
    }

    const byUser = Array.from(byUserMap.entries())
      .map(([userId, v]) => ({ userId, ...v }))
      .sort((a, b) => b.costCents - a.costCents)
      .slice(0, 20);

    return {
      totalTokens,
      totalCostCents,
      totalMessages: messages.length,
      byUser,
    };
  },
};
