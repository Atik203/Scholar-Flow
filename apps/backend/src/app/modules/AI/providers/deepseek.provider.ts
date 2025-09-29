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
    const normalizedKey = apiKey?.trim();
    super("deepseek", normalizedKey, requestTimeoutMs);
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

      // Build messages in OpenAI-compatible format (Deepseek uses OpenAI-compatible API)
      const messages = [
        {
          role: "system",
          content:
            'You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers with optional actionable takeaways. ALWAYS respond in valid JSON format with the following structure: {"answer": "your detailed response here", "suggestions": ["suggestion1", "suggestion2"], "tokensUsed": number}',
        },
      ];

      const trimmedContext = (input.context || "").trim();

      if (trimmedContext) {
        messages.push({
          role: "system",
          content: `Paper context:\n${trimmedContext}`,
        });
      }

      if (Array.isArray(input.history)) {
        for (const message of input.history) {
          messages.push({ role: message.role, content: message.content });
        }
      }

      messages.push({
        role: "user",
        content: input.prompt,
      });

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        this.requestTimeoutMs
      );

      let response: Awaited<ReturnType<typeof fetch>>;
      try {
        response = await fetch("https://api.deepseek.com/v1/chat/completions", {
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
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Deepseek API error: ${response.status} - ${errorText}`
        );
      }

      const data = (await response.json()) as any;
      const messageContent = data.choices?.[0]?.message?.content?.trim() || "";

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
