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

// Google Gemini cost-effective models (2.5 series only)
const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const FREE_MODELS = [
  "gemini-2.5-flash-lite", // Lightweight and cost-effective
  "gemini-2.5-flash", // More capable but still cost-effective
];

const isValidGeminiModel = (model: string): boolean => {
  return FREE_MODELS.includes(model);
};

const normalizeList = (value: unknown, maxItems = 5): string[] | undefined => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) =>
        typeof entry === "string" ? entry.trim() : String(entry || "").trim()
      )
      .filter((entry) => Boolean(entry));

    return normalized.length
      ? normalized.slice(0, maxItems).map((entry) => entry.slice(0, 280))
      : undefined;
  }

  if (typeof value === "string" && value.trim()) {
    const parts = value
      .split(/\n|\r|,|;|\u2022/g)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    return parts.length
      ? parts.slice(0, maxItems).map((entry) => entry.slice(0, 280))
      : undefined;
  }

  return undefined;
};

const stripJsonFences = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed
      .replace(/^```[a-zA-Z]*\s*/, "")
      .replace(/```$/, "")
      .trim();
  }
  return trimmed;
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
        "You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers in natural conversational style. Be helpful, insightful, and provide actionable takeaways when relevant. Respond directly and naturally - do not use JSON format.";

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
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Gemini provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const model = DEFAULT_MODEL;
    const systemPrompt = `You are an academic metadata extraction expert. Extract the following fields from the provided paper text. Respond ONLY with a valid JSON object matching this TypeScript type: { "title"?: string; "abstract"?: string; "authors"?: string[]; "year"?: number; "doi"?: string; "keywords"?: string[]; "confidence"?: number }. If a field cannot be determined, omit it. Use the original title if supplied and no better title is found.`;

    let promptText = `Extract metadata from this paper text:\n\n${input.text.slice(0, 16000)}`;
    if (input.originalTitle?.trim()) {
      promptText += `\n\n(Original filename/title: ${input.originalTitle})`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      let response: Awaited<ReturnType<typeof fetch>>;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: [systemPrompt, promptText]
                        .filter(Boolean)
                        .join("\n\n"),
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800,
                topP: 0.9,
                topK: 40,
                responseMimeType: "application/json",
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
        throw new Error(
          `Gemini API error: ${response.status} - ${errorText}`
        );
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const parts = Array.isArray(data.candidates?.[0]?.content?.parts)
        ? data.candidates[0].content.parts
            .map((part) => part?.text || "")
            .filter((text) => Boolean(text))
        : [];

      const combined = stripJsonFences(parts.join("\n")).trim();

      if (!combined) {
        throw new Error("Gemini returned empty extraction response");
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(combined);
      } catch {
        throw new Error(
          `Gemini extraction response was not valid JSON: ${combined.slice(0, 200)}`
        );
      }

      const title =
        typeof parsed.title === "string" && parsed.title.trim()
          ? parsed.title.trim()
          : undefined;
      const abstract =
        typeof parsed.abstract === "string" && parsed.abstract.trim()
          ? parsed.abstract.trim()
          : undefined;
      const year =
        typeof parsed.year === "number" && parsed.year > 1000
          ? parsed.year
          : undefined;
      const doi =
        typeof parsed.doi === "string" && parsed.doi.trim()
          ? parsed.doi.trim()
          : undefined;

      const metadata = {
        title,
        abstract,
        authors: normalizeList(parsed.authors, 10),
        year,
        doi,
        keywords: normalizeList(parsed.keywords, 8),
        source: "gemini",
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : 0.6,
      };

      return {
        provider: this.name,
        metadata,
        rawResponse: data,
      };
    } catch (error) {
      if (error instanceof AiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new AiError(
          504,
          "Gemini extraction request timed out",
          "AI_PROVIDER_TIMEOUT"
        );
      }

      if (error instanceof Error) {
        throw new AiError(
          502,
          error.message,
          "AI_PROVIDER_ERROR",
          error.stack
        );
      }

      throw new AiError(
        502,
        "Gemini metadata extraction failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  protected async performSummary(
    input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Gemini provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const model = DEFAULT_MODEL;

    const systemPrompt = `You are an expert research summarization assistant. Strictly respond with JSON matching this TypeScript type: { "summary": string; "highlights"?: string[]; "followUpQuestions"?: string[]; "tokensUsed"?: number }. The summary must stay within ${input.wordLimit ?? 220} sentences or less and focus on methodology, findings, and implications.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
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
                  parts: [
                    {
                      text: [
                        systemPrompt,
                        "Paper excerpt:",
                        input.text,
                        input.instructions
                          ? `Additional instructions: ${input.instructions}`
                          : undefined,
                        input.focusAreas?.length
                          ? `Focus areas: ${input.focusAreas.join(", ")}`
                          : undefined,
                      ]
                        .filter(Boolean)
                        .join("\n\n"),
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 900,
                topP: 0.9,
                topK: 64,
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
      const parts: string[] = Array.isArray(
        data.candidates?.[0]?.content?.parts
      )
        ? data.candidates[0].content.parts
            .map((part: any) => part?.text || "")
            .filter((text: string) => Boolean(text))
        : [];

      const combined = stripJsonFences(parts.join("\n")).trim();
      if (!combined) {
        throw new Error("Gemini returned an empty summary response");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(combined);
      } catch {
        parsed = {
          summary: combined,
          highlights: undefined,
          followUpQuestions: undefined,
        };
      }

      const summaryText =
        typeof parsed.summary === "string" ? parsed.summary.trim() : combined;
      if (!summaryText) {
        throw new Error(
          "Gemini summary payload did not include a summary field"
        );
      }

      const highlights = normalizeList(parsed.highlights, 6);
      const followUps = normalizeList(parsed.followUpQuestions, 5);

      const rawTokens = Number(parsed.tokensUsed);
      const tokenCount = Number.isFinite(rawTokens)
        ? rawTokens
        : Number(data.usageMetadata?.totalTokenCount) || undefined;

      return {
        provider: this.name,
        summary: summaryText,
        highlights: highlights && highlights.length ? highlights : undefined,
        followUpQuestions:
          followUps && followUps.length ? followUps : undefined,
        tokensUsed: tokenCount,
        rawResponse: data,
      };
    } catch (error) {
      if (error instanceof AiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new AiError(
          504,
          "Gemini summary request timed out",
          "AI_PROVIDER_TIMEOUT"
        );
      }

      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "Gemini summary generation failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }
}
