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
    super("gemini", apiKey, requestTimeoutMs);

    const isValidKey = apiKey && apiKey.length > 10;
    console.log(
      `[Gemini Provider] Initializing with API key: ${isValidKey ? "valid format" : "invalid/missing"}, timeout: ${requestTimeoutMs}ms`
    );

    if (!isValidKey && apiKey) {
      console.warn(`[Gemini Provider] Invalid API key format`);
    }
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

      console.log(`[Gemini Provider] Making API call with model: ${model}`);

      // Build conversation history
      const conversationParts = [
        {
          text: `You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers with optional actionable takeaways.

Paper context:
${input.context}

Conversation history:
${(input.history || []).map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`).join("\\n")}

Current question: ${input.prompt}

Please respond in JSON format with the following structure:
{
  "answer": "your detailed response here",
  "suggestions": ["suggestion1", "suggestion2"],
  "tokensUsed": estimated_token_count
}`,
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: conversationParts,
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 900,
              topP: 0.8,
              topK: 40,
            },
          }),
          signal: AbortSignal.timeout(this.requestTimeoutMs),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      console.log(`[Gemini Provider] Raw response:`, content);

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
      console.log(`[Gemini Provider] Error:`, error);

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
