import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiInsightRequest,
  AiInsightResult,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
} from "../ai.types";

// Google Gemini free models
const DEFAULT_MODEL = "gemini-1.5-flash";
const FREE_MODELS = [
  "gemini-1.5-flash", // Fast and free
  "gemini-1.5-pro", // More capable, also free with limits
  "gemini-pro", // Legacy model
];

const isValidGeminiModel = (model: string): boolean => {
  return FREE_MODELS.includes(model);
};

export class GeminiProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    const normalizedKey = apiKey?.trim();
    super("gemini", normalizedKey, requestTimeoutMs);
  }

  protected async performInsight(
    input: AiInsightRequest
  ): Promise<AiInsightResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Gemini provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const model = isValidGeminiModel(input.model || DEFAULT_MODEL)
        ? input.model || DEFAULT_MODEL
        : DEFAULT_MODEL;
      const instructions =
        "You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers with optional actionable takeaways. Return a JSON object with keys: answer (string), suggestions (array of strings), tokensUsed (number).";

      const historyText = Array.isArray(input.history)
        ? input.history
            .map(
              (msg) =>
                `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`
            )
            .join("\n")
        : "";

      const contextBlock = input.context.trim()
        ? `Paper context:\n${input.context.trim()}`
        : "";

      const combinedPrompt = [
        instructions,
        contextBlock,
        historyText ? `Conversation history:\n${historyText}` : undefined,
        `Current question: ${input.prompt}`,
        "Respond strictly in JSON.",
      ]
        .filter(Boolean)
        .join("\n\n");

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        this.requestTimeoutMs
      );

      let response: Awaited<ReturnType<typeof fetch>>;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: combinedPrompt }],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 900,
                topP: 0.8,
                topK: 40,
              },
            }),
            signal: controller.signal,
          }
        );
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Try to parse JSON response
      let parsed: any;
      try {
        parsed = JSON.parse(content);
      } catch {
        // If not JSON, create a structured response
        parsed = {
          answer: content,
          suggestions: [],
          tokensUsed: data.usageMetadata?.totalTokenCount || undefined,
        };
      }

      return {
        provider: this.name,
        message: {
          role: "assistant",
          content: parsed.answer || content,
        },
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : [],
        rawResponse: data,
        tokensUsed: parsed.tokensUsed || data.usageMetadata?.totalTokenCount,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "Gemini insight generation failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  protected async performExtraction(
    _input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    throw new AiError(
      503,
      "Gemini metadata extraction not yet implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }

  protected async performSummary(
    _input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    throw new AiError(
      503,
      "Gemini summary generation not yet implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }
}
