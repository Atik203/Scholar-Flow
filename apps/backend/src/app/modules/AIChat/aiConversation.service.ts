import prisma from "../../shared/prisma";
import config from "../../config";
import { aiService } from "../AI/ai.service";
import { AiError } from "../AI/ai.errors";
import type { AiSummaryRequest } from "../AI/ai.types";

const STREAMING_PROVIDER_ORDER = ["openai", "deepseek", "gemini", "claude"] as const;

async function generateAiResponse(
  messages: Array<{ role: string; content: string }>,
  model?: string
): Promise<{ content: string; model: string; tokensUsed?: number }> {
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
): Promise<{ content: string; model: string }> {
  // Try OpenAI first, fall back to non-streaming
  const openaiApiKey = config.openai.apiKey;
  if (openaiApiKey) {
    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: openaiApiKey, timeout: 30000 });
      const stream = await openai.chat.completions.create({
        model: model?.startsWith("gpt") ? model : "gpt-4o-mini",
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
      }
      return { content: fullContent, model: "openai" };
    } catch {}
  }

  // Fallback to non-streaming via generateInsight
  const result = await generateAiResponse(
    messages,
    model
  );
  // Emit full response as a single token
  onToken?.(result.content);
  return { content: result.content, model: result.model };
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

  async getConversation(conversationId: string) {
    return prisma.aIConversation.findUnique({
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
  },

  async createConversation(userId: string, title?: string, model?: string) {
    return prisma.aIConversation.create({
      data: { userId, title: title || "New Chat", model },
    });
  },

  async sendMessage(conversationId: string, userId: string, content: string) {
    // Save user message
    await prisma.aIConversationMessage.create({
      data: { conversationId, role: "user", content },
    });

    // Get conversation context
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { role: true, content: true },
          take: 15,
        },
      },
    });

    if (!conv) throw new Error("Conversation not found");

    // Generate AI response
    const aiResp = await generateAiResponse(
      [...(conv.messages || []).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })), { role: "user", content }],
      conv.model ?? undefined
    );

    // Save AI response
    const aiMessage = await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: "assistant",
        content: aiResp.content,
        model: aiResp.model,
        tokensUsed: aiResp.tokensUsed,
      },
    });

    // Update conversation title from first message if untitled
    if (!conv.title || conv.title === "New Chat") {
      const firstMsg = conv.messages?.[0];
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
    // Save user message
    await prisma.aIConversationMessage.create({
      data: { conversationId, role: "user", content },
    });

    // Get conversation context
    const conv = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { role: true, content: true },
          take: 15,
        },
      },
    });

    if (!conv) throw new Error("Conversation not found");

    // Build message history for the provider
    const msgs = (conv.messages || []).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));
    msgs.push({ role: "user", content });

    // Stream from provider with token callback
    const tokens: string[] = [];
    const result = await streamFromProvider(
      msgs,
      conv.model ?? undefined,
      (token: string) => {
        tokens.push(token);
        onEvent(token, false);
      }
    );

    const fullContent = tokens.join("");

    // Save AI response
    await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: "assistant",
        content: fullContent,
        model: result.model,
      },
    });

    // Update conversation title from first message if untitled
    if (!conv.title || conv.title === "New Chat") {
      const firstMsg = conv.messages?.[0];
      if (firstMsg) {
        await prisma.aIConversation.update({
          where: { id: conversationId },
          data: { title: firstMsg.content.slice(0, 60) },
        });
      }
    }

    // Signal completion with full content
    onEvent(fullContent, true);
  },

  async deleteConversation(conversationId: string) {
    await prisma.aIConversationMessage.deleteMany({ where: { conversationId } });
    await prisma.aIConversation.delete({ where: { id: conversationId } });
  },
};
