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

// Deepseek models (very affordable)
const DEFAULT_MODEL = "deepseek-chat";
const FREE_MODELS = [
  "deepseek-chat", // Main chat model, very affordable
  "deepseek-coder", // Specialized for code, also very affordable
];

const isValidDeepseekModel = (model: string): boolean => {
  return FREE_MODELS.includes(model);
};

export class DeepseekProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("deepseek", apiKey, requestTimeoutMs);

    const isValidKey = apiKey && apiKey.startsWith("sk-") && apiKey.length > 20;
    console.log(
      `[Deepseek Provider] Initializing with API key: ${isValidKey ? "valid format" : "invalid/missing"}, timeout: ${requestTimeoutMs}ms`
    );

    if (!isValidKey && apiKey) {
      console.warn(
        `[Deepseek Provider] Invalid API key format. Expected format: sk-...`
      );
    }
  }

  protected async performInsight(
    input: AiInsightRequest
  ): Promise<AiInsightResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Deepseek provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const model = isValidDeepseekModel(input.model || DEFAULT_MODEL)
        ? input.model || DEFAULT_MODEL
        : DEFAULT_MODEL;

      console.log(`[Deepseek Provider] Making API call with model: ${model}`);

      // Build messages in OpenAI-compatible format (Deepseek uses OpenAI-compatible API)
      const messages = [
        {
          role: "system",
          content:
            'You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers with optional actionable takeaways. ALWAYS respond in valid JSON format with the following structure: {"answer": "your detailed response here", "suggestions": ["suggestion1", "suggestion2"], "tokensUsed": number}',
        },
        {
          role: "system",
          content: `Paper context:\\n${input.context}`,
        },
        ...(input.history || []).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        {
          role: "user",
          content: input.prompt,
        },
      ];

      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.4,
            max_tokens: 900,
            stream: false,
          }),
          signal: AbortSignal.timeout(this.requestTimeoutMs),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Deepseek API error: ${response.status} - ${errorText}`
        );
      }

      const data = (await response.json()) as any;
      const messageContent = data.choices?.[0]?.message?.content || "";

      console.log(`[Deepseek Provider] Raw response:`, messageContent);

      // Try to parse JSON response
      let parsed: any;
      try {
        parsed = JSON.parse(messageContent);
      } catch {
        // If not JSON, create a structured response
        parsed = {
          answer: messageContent,
          suggestions: [],
          tokensUsed: data.usage?.total_tokens || undefined,
        };
      }

      return {
        provider: this.name,
        message: {
          role: "assistant",
          content: parsed.answer || messageContent,
        },
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : [],
        rawResponse: data,
        tokensUsed: parsed.tokensUsed || data.usage?.total_tokens,
      };
    } catch (error) {
      console.log(`[Deepseek Provider] Error:`, error);

      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "Deepseek insight generation failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  protected async performExtraction(
    _input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    throw new AiError(
      503,
      "Deepseek metadata extraction not yet implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }

  protected async performSummary(
    _input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    throw new AiError(
      503,
      "Deepseek summary generation not yet implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }
}
