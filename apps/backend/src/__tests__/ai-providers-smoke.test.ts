import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import config from "../app/config";
import type {
  AiInsightRequest,
  AiSummaryRequest,
} from "../app/modules/AI/ai.types";
import { GeminiProvider } from "../app/modules/AI/providers/gemini.provider";
import { OpenAiProvider } from "../app/modules/AI/providers/openai.provider";

const SIMPLE_TEST_TEXT = `
Artificial Intelligence and Machine Learning in Healthcare

Abstract: This paper examines the current applications of artificial intelligence and machine learning technologies in healthcare settings. We analyze the effectiveness of AI-driven diagnostic tools and their impact on patient outcomes.

Introduction: The healthcare industry has witnessed rapid adoption of AI technologies in recent years. Machine learning algorithms are being deployed for medical image analysis, drug discovery, and personalized treatment recommendations.

Methodology: We conducted a systematic review of 150 peer-reviewed articles published between 2020-2023. Our analysis focused on three main areas: diagnostic accuracy, implementation challenges, and patient safety considerations.

Results: AI-based diagnostic tools demonstrated 95% accuracy in identifying pathological conditions. Implementation challenges included data privacy concerns and the need for specialized training.

Conclusion: AI technologies show significant promise in healthcare applications, though careful consideration of ethical and practical challenges is essential for successful deployment.
`.trim();

const SIMPLE_INSIGHT_PROMPT =
  "What are the key benefits of AI in healthcare mentioned in this paper?";

describe("AI Providers Smoke Tests", () => {
  let openaiProvider: OpenAiProvider;
  let geminiProvider: GeminiProvider;

  beforeAll(() => {
    // Initialize providers with actual config
    openaiProvider = new OpenAiProvider(
      config.openai.apiKey,
      config.ai.requestTimeoutMs
    );
    geminiProvider = new GeminiProvider(
      config.gemini.apiKey,
      config.ai.requestTimeoutMs
    );
  });

  afterAll(() => {
    // Cleanup if needed
  });

  describe("OpenAI Provider", () => {
    it("should be properly configured", () => {
      expect(openaiProvider.isEnabled()).toBe(true);
      expect(config.openai.apiKey).toBeDefined();
      expect(config.openai.apiKey?.startsWith("sk-")).toBe(true);
    });

    it("should generate summary successfully", async () => {
      if (!openaiProvider.isEnabled()) {
        console.log("OpenAI provider not enabled, skipping test");
        return;
      }

      const request: AiSummaryRequest = {
        paperId: "test-paper-id",
        text: SIMPLE_TEST_TEXT,
        wordLimit: 100,
        tone: "academic",
        audience: "researcher",
      };

      const result = await openaiProvider.generateSummary(request);

      expect(result).toBeDefined();
      expect(result?.provider).toBe("openai");
      expect(result?.summary).toBeDefined();
      expect(typeof result?.summary).toBe("string");
      expect(result?.summary.length).toBeGreaterThan(20);

      console.log("OpenAI Summary Test Result:", {
        provider: result?.provider,
        summaryLength: result?.summary.length,
        hasHighlights: Boolean(result?.highlights?.length),
        hasFollowUps: Boolean(result?.followUpQuestions?.length),
        tokensUsed: result?.tokensUsed,
      });
    }, 30000);

    it("should generate insights successfully", async () => {
      if (!openaiProvider.isEnabled()) {
        console.log("OpenAI provider not enabled, skipping test");
        return;
      }

      const request: AiInsightRequest = {
        paperId: "test-paper-id",
        prompt: SIMPLE_INSIGHT_PROMPT,
        context: SIMPLE_TEST_TEXT,
        history: [],
      };

      const result = await openaiProvider.generateInsights?.(request);

      expect(result).toBeDefined();
      expect(result?.provider).toBe("openai");
      expect(result?.message).toBeDefined();
      expect(result?.message.role).toBe("assistant");
      expect(result?.message.content).toBeDefined();
      expect(typeof result?.message.content).toBe("string");
      expect(result?.message.content.length).toBeGreaterThan(20);

      console.log("OpenAI Insight Test Result:", {
        provider: result?.provider,
        responseLength: result?.message.content.length,
        hasSuggestions: Boolean(result?.suggestions?.length),
        tokensUsed: result?.tokensUsed,
      });
    }, 30000);
  });

  describe("Gemini Provider", () => {
    it("should be properly configured", () => {
      expect(geminiProvider.isEnabled()).toBe(true);
      expect(config.gemini.apiKey).toBeDefined();
      expect(config.gemini.apiKey?.startsWith("AIza")).toBe(true);
    });

    it("should generate summary successfully", async () => {
      if (!geminiProvider.isEnabled()) {
        console.log("Gemini provider not enabled, skipping test");
        return;
      }

      const request: AiSummaryRequest = {
        paperId: "test-paper-id",
        text: SIMPLE_TEST_TEXT,
        wordLimit: 100,
        tone: "academic",
        audience: "researcher",
      };

      const result = await geminiProvider.generateSummary(request);

      expect(result).toBeDefined();
      expect(result?.provider).toBe("gemini");
      expect(result?.summary).toBeDefined();
      expect(typeof result?.summary).toBe("string");
      expect(result?.summary.length).toBeGreaterThan(20);

      console.log("Gemini Summary Test Result:", {
        provider: result?.provider,
        summaryLength: result?.summary.length,
        hasHighlights: Boolean(result?.highlights?.length),
        hasFollowUps: Boolean(result?.followUpQuestions?.length),
        tokensUsed: result?.tokensUsed,
      });
    }, 30000);

    it("should generate insights successfully", async () => {
      if (!geminiProvider.isEnabled()) {
        console.log("Gemini provider not enabled, skipping test");
        return;
      }

      const request: AiInsightRequest = {
        paperId: "test-paper-id",
        prompt: SIMPLE_INSIGHT_PROMPT,
        context: SIMPLE_TEST_TEXT,
        history: [],
      };

      const result = await geminiProvider.generateInsights?.(request);

      expect(result).toBeDefined();
      expect(result?.provider).toBe("gemini");
      expect(result?.message).toBeDefined();
      expect(result?.message.role).toBe("assistant");
      expect(result?.message.content).toBeDefined();
      expect(typeof result?.message.content).toBe("string");
      expect(result?.message.content.length).toBeGreaterThan(20);

      console.log("Gemini Insight Test Result:", {
        provider: result?.provider,
        responseLength: result?.message.content.length,
        hasSuggestions: Boolean(result?.suggestions?.length),
        tokensUsed: result?.tokensUsed,
      });
    }, 30000);
  });

  describe("Provider Fallback Order", () => {
    it("should have correct fallback configuration", () => {
      expect(config.ai.providerFallbackOrder).toEqual(["gemini", "openai"]);
      expect(config.ai.featuresEnabled).toBe(true);
    });

    it("should list all providers as configured", () => {
      const providers = [openaiProvider, geminiProvider];
      const enabledProviders = providers.filter((p) => p.isEnabled());

      expect(enabledProviders.length).toBe(2);

      console.log("Provider Status:", {
        openai: openaiProvider.isEnabled(),
        gemini: geminiProvider.isEnabled(),
        fallbackOrder: config.ai.providerFallbackOrder,
        featuresEnabled: config.ai.featuresEnabled,
      });
    });
  });
});
