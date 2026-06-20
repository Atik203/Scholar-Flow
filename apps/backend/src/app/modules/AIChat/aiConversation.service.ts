import prisma from "../../shared/prisma";
import config from "../../config";
import { aiService } from "../AI/ai.service";
import type { AiSummaryRequest } from "../AI/ai.types";

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
      [...(conv.messages || []).map((m) => ({ role: m.role, content: m.content })), { role: "user", content }],
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

  async deleteConversation(conversationId: string) {
    await prisma.aIConversationMessage.deleteMany({ where: { conversationId } });
    await prisma.aIConversation.delete({ where: { id: conversationId } });
  },
};
