import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { aiGenerationLimiter } from "../../middleware/rateLimiter";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { AuthenticatedRequest } from "../../interfaces/common";

const router: express.Router = express.Router();

// Rewrite text with AI
router.post(
  "/rewrite",
  authMiddleware as any,
  aiGenerationLimiter as any,
  catchAsync(async (req, res) => {
    const { text, tone, instructions } = req.body || {};
    if (!text) {
      res.status(400).json({ success: false, message: "Text is required" });
      return;
    }

    // Dynamic import to avoid circular deps
    const { aiService } = await import("../AI/ai.service");

    const prompt = instructions
      ? `Rewrite the following text: ${instructions}\n\n${text}`
      : `Rewrite the following text in a${tone ? ` ${tone}` : " clearer, more academic"} tone while preserving the original meaning:\n\n${text}`;

    const result = await aiService.generateInsight({
      paperId: "ai-rewriter",
      prompt,
      context: text,
    });

    sendSuccessResponse(res, {
      original: text,
      rewritten: result.message.content,
      provider: result.provider,
    }, "Text rewritten");
  })
);

// Compare two papers
router.post(
  "/compare",
  authMiddleware as any,
  aiGenerationLimiter as any,
  catchAsync(async (req, res) => {
    const { paper1Id, paper2Id } = req.body || {};
    if (!paper1Id || !paper2Id) {
      res.status(400).json({ success: false, message: "Both paper IDs are required" });
      return;
    }

    const { aiService } = await import("../AI/ai.service");
    const { default: prisma } = await import("../../shared/prisma");

    const [p1, p2] = await Promise.all([
      prisma.paper.findUnique({ where: { id: paper1Id }, select: { title: true, abstract: true } }),
      prisma.paper.findUnique({ where: { id: paper2Id }, select: { title: true, abstract: true } }),
    ]);

    if (!p1 || !p2) {
      res.status(404).json({ success: false, message: "One or both papers not found" });
      return;
    }

    const prompt = `Compare these two research papers and identify agreements, disagreements, complementary findings, and any conflicting conclusions. Format as a structured comparison.

Paper 1: "${p1.title}"
Abstract: ${p1.abstract || "N/A"}

Paper 2: "${p2.title}"
Abstract: ${p2.abstract || "N/A"}`;

    const result = await aiService.generateInsight({
      paperId: paper1Id,
      prompt,
      context: `${p1.abstract || ""}\n\n${p2.abstract || ""}`,
    });

    sendSuccessResponse(res, {
      paper1: { id: paper1Id, title: p1.title },
      paper2: { id: paper2Id, title: p2.title },
      comparison: result.message.content,
      provider: result.provider,
    }, "Comparison generated");
  })
);

// Translate text to another language
router.post(
  "/translate",
  authMiddleware as any,
  aiGenerationLimiter as any,
  catchAsync(async (req, res) => {
    const { text, targetLanguage } = req.body || {};
    if (!text || !targetLanguage) {
      res.status(400).json({ success: false, message: "Text and targetLanguage are required" });
      return;
    }

    const { aiService } = await import("../AI/ai.service");

    const prompt = `Translate the following text to ${targetLanguage}. Preserve academic tone and terminology. Return ONLY the translated text without additional commentary:\n\n${text}`;

    const result = await aiService.generateInsight({
      paperId: "ai-translator",
      prompt,
      context: text,
    });

    sendSuccessResponse(res, {
      originalLanguage: "auto",
      targetLanguage,
      original: text,
      translated: result.message.content,
      provider: result.provider,
    }, "Text translated");
  })
);

export const aiToolsRoutes = router;
