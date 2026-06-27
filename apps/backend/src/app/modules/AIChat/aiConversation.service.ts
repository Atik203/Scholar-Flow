import prisma from "../../shared/prisma";
import config from "../../config";
import { aiService } from "../AI/ai.service";
import { aiContextService } from "../AIContext/aiContext.service";
import { aiProviderService } from "../AIProvider/aiProvider.service";
import { AiError } from "../AI/ai.errors";
import type { AiSummaryRequest } from "../AI/ai.types";

const STREAMING_PROVIDER_ORDER = ["openai", "deepseek", "gemini", "claude"] as const;

interface ProviderRow {
  provider: string;
  model: string;
  inputCostPer1k?: number | null;
  outputCostPer1k?: number | null;
}

async function resolveProviderForModel(model: string): Promise<ProviderRow> {
  if (!model) {
    return { provider: "openai", model: "gpt-4o-mini", inputCostPer1k: 0.15, outputCostPer1k: 0.6 };
  }
  const row = await prisma.aIProvider.findFirst({
    where: { model, isDeleted: false, enabled: true },
    select: { provider: true, model: true, inputCostPer1k: true, outputCostPer1k: true },
  });
  if (row) {
    return row;
  }
  if (model.startsWith("claude")) {
    return { provider: "claude", model };
  }
  if (model.startsWith("gemini")) {
    return { provider: "gemini", model };
  }
  if (model.startsWith("deepseek")) {
    return { provider: "deepseek", model };
  }
  return { provider: "openai", model };
}

function estimateCost(
  inputTokens: number,
  outputTokens: number,
  resolved: ProviderRow,
): number {
  const inputRate = resolved.inputCostPer1k ?? 0;
  const outputRate = resolved.outputCostPer1k ?? 0;
  return (inputTokens / 1000) * inputRate + (outputTokens / 1000) * outputRate;
}

async function buildContextMessages(
  context: { type?: string; id?: string } | null | undefined,
  userId: string
): Promise<Array<{ role: "system"; content: string }>> {
  if (!context?.type || !context?.id) return [];

  try {
    const resolved = await aiContextService.resolve({
      type: context.type as "paper" | "workspace" | "dashboard",
      id: context.id,
      userId,
    });
    const { systemPrompt } = aiContextService.injectContextIntoSystemPrompt(
      resolved,
      "You are a knowledgeable research assistant. Use the context below to answer naturally."
    );
    return [{ role: "system", content: systemPrompt }];
  } catch {
    return [];
  }
}

async function generateAiResponse(
  messages: Array<{ role: string; content: string }>,
  model?: string
): Promise<{ content: string; model: string; tokensUsed?: number; costCents?: number }> {
  const userMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10);

  const lastUserMsg = userMessages.filter((m) => m.role === "user").pop();
  const context = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")
    .slice(0, 8000);

  try {
    const result = await aiService.generateInsight({
      paperId: "global-assistant",
      prompt: lastUserMsg?.content || "Help me with my research",
      context,
      history: userMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      model,
    });

    return {
      content: result.message.content,
      model: result.provider,
      tokensUsed: result.tokensUsed,
    };
  } catch {
    return {
      content: "I'm having trouble processing that right now. Please try again.",
      model: "fallback",
    };
  }
}

async function streamFromProvider(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  model?: string,
  onToken?: (token: string) => void
): Promise<{ content: string; model: string; inputTokens: number; outputTokens: number }> {
  const resolved = await resolveProviderForModel(model ?? "");
  let inputTokens = 0;
  let outputTokens = 0;

  if (resolved.provider === "openai") {
    const openaiApiKey = config.openai.apiKey;
    if (openaiApiKey) {
      try {
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: openaiApiKey, timeout: 30000 });
        const stream = await openai.chat.completions.create({
          model: resolved.model,
          messages: messages as any,
          stream: true,
          max_tokens: 2000,
          temperature: 0.7,
        });

        let fullContent = "";
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            onToken?.(delta);
          }
          if (chunk.usage) {
            inputTokens = chunk.usage.prompt_tokens;
            outputTokens = chunk.usage.completion_tokens;
          }
        }
        if (!inputTokens && !outputTokens) {
          inputTokens = Math.ceil(messages.reduce((s, m) => s + m.content.length / 4, 0));
          outputTokens = Math.ceil(fullContent.length / 4);
        }
        return { content: fullContent, model: resolved.model, inputTokens, outputTokens };
      } catch {
        // fall through
      }
    }
  }

  const result = await generateAiResponse(messages, resolved.model);
  inputTokens = Math.ceil(messages.reduce((s, m) => s + m.content.length / 4, 0));
  outputTokens = Math.ceil((result.content?.length ?? 0) / 4);
  onToken?.(result.content);
  return { content: result.content, model: result.model, inputTokens, outputTokens };
}

export const aiConversationService = {
  async listConversations(userId: string) {
    return prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        model: true,
        context: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
      take: 20,
    });
  },

  async getConversation(conversationId: string, userId: string) {
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            createdAt: true,
          },
          take: 50,
        },
      },
    });
    if (!conv) throw new AiError(404, "Conversation not found");
    if (conv.userId !== userId) throw new AiError(403, "Forbidden");
    return conv;
  },

  async createConversation(
    userId: string,
    title?: string,
    model?: string,
    context?: Record<string, unknown>
  ) {
    return prisma.aIConversation.create({
      data: {
        userId,
        title: title || "New Chat",
        model,
        context: context as any,
      },
    });
  },

  async sendMessage(conversationId: string, userId: string, content: string) {
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true, model: true, context: true },
    });
    if (!conv) throw new AiError(404, "Conversation not found");
    if (conv.userId !== userId) throw new AiError(403, "Forbidden");

    await prisma.aIConversationMessage.create({
      data: { conversationId, role: "user", content },
    });

    const updatedConv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { role: true, content: true },
          take: 15,
        },
      },
    });
    if (!updatedConv) throw new Error("Conversation not found");

    // Inject page context as system message if available
    const contextMessages = await buildContextMessages(conv.context as any, userId);

    const allMessages = [
      ...contextMessages,
      ...((updatedConv.messages || []).map((m) => ({ role: m.role, content: m.content }))),
    ];

    const aiResp = await generateAiResponse(
      allMessages.map((m) => ({ role: m.role, content: m.content })),
      updatedConv.model ?? undefined
    );

    const resolved = await resolveProviderForModel(updatedConv.model ?? "");
    const inputTokens = Math.ceil(content.length / 4);
    const outputTokens = Math.ceil((aiResp.content?.length ?? 0) / 4);
    const costCents = estimateCost(inputTokens, outputTokens, resolved);

    const aiMessage = await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: "assistant",
        content: aiResp.content,
        model: aiResp.model,
        tokensUsed: aiResp.tokensUsed,
        costCents,
      },
    });

    if (!updatedConv.title || updatedConv.title === "New Chat") {
      const firstMsg = updatedConv.messages?.[0];
      if (firstMsg) {
        await prisma.aIConversation.update({
          where: { id: conversationId },
          data: { title: firstMsg.content.slice(0, 60) },
        });
      }
    }

    return aiMessage;
  },

  async streamMessage(
    conversationId: string,
    userId: string,
    content: string,
    onEvent: (token: string, done: boolean) => void
  ) {
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true, model: true, context: true },
    });
    if (!conv) throw new AiError(404, "Conversation not found");
    if (conv.userId !== userId) throw new AiError(403, "Forbidden");

    await prisma.aIConversationMessage.create({
      data: { conversationId, role: "user", content },
    });

    const updatedConv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { role: true, content: true },
          take: 15,
        },
      },
    });
    if (!updatedConv) throw new Error("Conversation not found");

    // Inject page context as system message if available
    const contextMessages = await buildContextMessages(conv.context as any, userId);
    const allMessages = [
      ...contextMessages,
      ...((updatedConv.messages || []).map((m) => ({ role: m.role, content: m.content }))),
    ];

    const msgs = allMessages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    const tokens: string[] = [];
    const result = await streamFromProvider(
      msgs,
      updatedConv.model ?? undefined,
      (token: string) => {
        tokens.push(token);
        onEvent(token, false);
      }
    );

    const fullContent = tokens.join("");
    const resolved = await resolveProviderForModel(updatedConv.model ?? "");
    const costCents = estimateCost(result.inputTokens, result.outputTokens, resolved);

    await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: "assistant",
        content: fullContent,
        model: result.model,
        tokensUsed: result.outputTokens,
        costCents,
      },
    });

    if (!updatedConv.title || updatedConv.title === "New Chat") {
      const firstMsg = updatedConv.messages?.[0];
      if (firstMsg) {
        await prisma.aIConversation.update({
          where: { id: conversationId },
          data: { title: firstMsg.content.slice(0, 60) },
        });
      }
    }

    onEvent(fullContent, true);
  },

  async deleteConversation(conversationId: string, userId: string) {
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });
    if (!conv) throw new AiError(404, "Conversation not found");
    if (conv.userId !== userId) throw new AiError(403, "Forbidden");
    await prisma.aIConversationMessage.deleteMany({ where: { conversationId } });
    await prisma.aIConversation.delete({ where: { id: conversationId } });
  },
};
