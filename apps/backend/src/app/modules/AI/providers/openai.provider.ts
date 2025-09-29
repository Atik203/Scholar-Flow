import OpenAI, { APIError } from "openai";
import { z } from "zod";
import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiInsightRequest,
  AiInsightResult,
  AiMetadata,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
} from "../ai.types";

const DEFAULT_MODEL = "gpt-4o-mini";

// Free and affordable OpenAI models
const FREE_MODELS = [
  "gpt-4o-mini", // Most affordable GPT-4 variant
  "gpt-3.5-turbo", // Affordable and fast
  "gpt-3.5-turbo-16k", // Longer context
];

const isValidModel = (model: string): boolean => {
  const validModels = [...FREE_MODELS, "gpt-4o", "gpt-4-turbo", "gpt-4"];
  return validModels.includes(model);
};

const normalizeStringList = (
  value: unknown,
  maxItems = 8
): string[] | undefined => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) => entry?.toString().trim())
      .filter((entry): entry is string => Boolean(entry));
    return normalized.length ? normalized.slice(0, maxItems) : undefined;
  }

  if (typeof value === "string") {
    const split = value
      .split(/\n|\.|;|\r|,/) // break on punctuation and newlines
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0 && entry.length <= 240);
    return split.length ? split.slice(0, maxItems) : undefined;
  }

  return undefined;
};

const metadataSchema = z.object({
  title: z.string().min(1).max(512).optional(),
  abstract: z.string().min(1).max(5000).optional(),
  authors: z.union([z.array(z.string()), z.string()]).optional(),
  year: z.union([z.number(), z.string()]).optional(),
  doi: z.string().optional(),
  keywords: z.union([z.array(z.string()), z.string()]).optional(),
  source: z.string().optional(),
  confidence: z.union([z.number(), z.string()]).optional(),
});

type RawMetadata = z.infer<typeof metadataSchema>;

const summarySchema = z.object({
  summary: z.string().min(40).max(2000),
  highlights: z.union([z.array(z.string()), z.string()]).optional(),
  followUpQuestions: z.union([z.array(z.string()), z.string()]).optional(),
  tokensUsed: z.union([z.number(), z.string()]).optional(),
});

type RawSummary = z.infer<typeof summarySchema>;

const insightSchema = z.object({
  answer: z.string().min(20).max(5000),
  suggestions: z.union([z.array(z.string()), z.string()]).optional(),
  tokensUsed: z.union([z.number(), z.string()]).optional(),
});

type RawInsight = z.infer<typeof insightSchema>;

export class OpenAiProvider extends BaseAiProvider {
  private readonly client: OpenAI | null;

  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("openai", apiKey, requestTimeoutMs);

    // Validate API key format
    const isValidKey = apiKey && apiKey.startsWith("sk-") && apiKey.length > 20;
    console.log(
      `[OpenAI Provider] Initializing with API key: ${isValidKey ? "valid format" : "invalid/missing"}, timeout: ${requestTimeoutMs}ms`
    );

    this.client = isValidKey
      ? new OpenAI({ apiKey, timeout: requestTimeoutMs })
      : null;

    if (!isValidKey && apiKey) {
      console.warn(
        `[OpenAI Provider] Invalid API key format. Expected format: sk-...`
      );
    }
  }

  protected async performExtraction(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    if (!this.client) {
      throw new AiError(
        503,
        "OpenAI provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: DEFAULT_MODEL,
        temperature: 0.2,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an expert research metadata assistant. Extract structured metadata strictly as JSON.",
          },
          {
            role: "user",
            content: this.buildPrompt(input),
          },
        ],
      });

      const messageContent = completion.choices[0]?.message?.content || "";
      const parsed = this.safeParseJson(messageContent);
      const validated = metadataSchema.parse(parsed);
      const metadata = this.normalizeMetadata(validated);

      return {
        provider: this.name,
        metadata,
        rawResponse: completion,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw new AiError(
          error.status ?? 500,
          error.message,
          error.code ?? undefined
        );
      }

      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "OpenAI metadata extraction failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  protected async performSummary(
    input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    if (!this.client) {
      throw new AiError(
        503,
        "OpenAI provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: DEFAULT_MODEL,
        temperature: 0.3,
        max_tokens: Math.min(900, Math.max((input.wordLimit ?? 220) * 3, 600)),
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a senior research assistant. Produce structured JSON with a scholarly yet approachable tone.",
          },
          {
            role: "user",
            content: this.buildSummaryPrompt(input),
          },
        ],
      });

      const messageContent = completion.choices[0]?.message?.content || "";
      const parsed = this.safeParseJson(messageContent);
      const validated = summarySchema.parse(parsed) as RawSummary;
      const highlights = normalizeStringList(validated.highlights);
      const followUps = normalizeStringList(validated.followUpQuestions, 5);
      const rawTokens =
        typeof validated.tokensUsed === "string"
          ? Number(validated.tokensUsed)
          : validated.tokensUsed;
      const tokensUsed = Number.isFinite(rawTokens ?? NaN)
        ? (rawTokens as number)
        : completion.usage?.total_tokens;

      return {
        provider: this.name,
        summary: validated.summary.trim(),
        highlights,
        followUpQuestions: followUps,
        rawResponse: completion,
        tokensUsed: tokensUsed ?? undefined,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw new AiError(
          error.status ?? 500,
          error.message,
          error.code ?? undefined
        );
      }

      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "OpenAI summary generation failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  protected async performInsight(
    input: AiInsightRequest
  ): Promise<AiInsightResult> {
    console.log(
      `[OpenAI Provider] performInsight called with prompt length: ${input.prompt.length}, context length: ${input.context.length}`
    );

    if (!this.client) {
      console.log(`[OpenAI Provider] Client not configured`);
      throw new AiError(
        503,
        "OpenAI provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const messages = [
        {
          role: "system" as const,
          content:
            'You are a senior research mentor helping a scholar interpret and apply insights from a paper. Provide clear, structured answers with optional actionable takeaways. ALWAYS respond in valid JSON format with the following structure: {"answer": "your detailed response here", "suggestions": ["suggestion1", "suggestion2"], "tokensUsed": number}',
        },
        {
          role: "system" as const,
          content: `Paper context:\n${input.context}`,
        },
        ...((input.history ?? []).map((message) => ({
          role: message.role,
          content: message.content,
        })) as Array<{
          role: "user" | "assistant" | "system";
          content: string;
        }>),
        {
          role: "user" as const,
          content: input.prompt,
        },
      ];

      // Validate and use model
      const requestedModel = input.model || DEFAULT_MODEL;
      const modelToUse = isValidModel(requestedModel)
        ? requestedModel
        : DEFAULT_MODEL;

      if (requestedModel !== modelToUse) {
        console.warn(
          `[OpenAI Provider] Invalid model '${requestedModel}', using '${modelToUse}' instead`
        );
      }

      console.log(
        `[OpenAI Provider] Making API call with model: ${modelToUse}`
      );

      const completion = await this.client.chat.completions.create({
        model: modelToUse,
        temperature: 0.4,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages,
      });

      console.log(`[OpenAI Provider] API call successful, response received`);
      const messageContent = completion.choices[0]?.message?.content || "";
      console.log(`[OpenAI Provider] Raw response content:`, messageContent);

      const parsed = this.safeParseJson(messageContent);
      console.log(`[OpenAI Provider] Parsed JSON:`, parsed);

      const validated = insightSchema.parse(parsed) as RawInsight;
      const suggestions = normalizeStringList(validated.suggestions, 4);
      const rawTokens =
        typeof validated.tokensUsed === "string"
          ? Number(validated.tokensUsed)
          : validated.tokensUsed;
      const tokensUsed = Number.isFinite(rawTokens ?? NaN)
        ? (rawTokens as number)
        : completion.usage?.total_tokens;

      return {
        provider: this.name,
        message: {
          role: "assistant",
          content: validated.answer.trim(),
        },
        suggestions: suggestions,
        rawResponse: completion,
        tokensUsed: tokensUsed ?? undefined,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw new AiError(
          error.status ?? 500,
          error.message,
          error.code ?? undefined
        );
      }

      if (error instanceof Error) {
        throw new AiError(502, error.message, "AI_PROVIDER_ERROR", error.stack);
      }

      throw new AiError(
        502,
        "OpenAI insight generation failed",
        "AI_PROVIDER_ERROR"
      );
    }
  }

  private buildPrompt(input: AiMetadataExtractionInput) {
    return [
      "Extract structured metadata for an academic paper.",
      "Respond with JSON containing: title (string), abstract (string),",
      "authors (array of strings), year (number), doi (string | null),",
      "keywords (array of strings), source (string), confidence (0-1).",
      input.originalTitle
        ? `Original title suggestion: ${input.originalTitle}`
        : undefined,
      input.existingMetadata
        ? `Existing metadata (JSON): ${JSON.stringify(input.existingMetadata)}`
        : undefined,
      "---",
      input.text,
    ]
      .filter(Boolean)
      .join("\n");
  }

  private buildSummaryPrompt(input: AiSummaryRequest) {
    const wordLimit = input.wordLimit ?? 220;
    const audience = input.audience ?? "researcher";
    const tone = input.tone ?? "academic";

    const focusText =
      input.focusAreas && input.focusAreas.length > 0
        ? `Focus on: ${input.focusAreas.join(", ")}`
        : undefined;

    const instructions = [
      `Summarise the following academic paper for a ${audience} audience.`,
      `Adopt a ${tone} tone.`,
      `Limit the overview to approximately ${wordLimit} words.`,
      "Return JSON with keys: summary (string), highlights (array of strings with 3-5 bullet points), followUpQuestions (array of 2-4 thoughtful next questions).",
      input.language
        ? `Respond in ${input.language}.`
        : "Respond in the same language as the source material if clear, otherwise use English.",
      focusText,
      input.instructions
        ? `Additional instructions: ${input.instructions}`
        : undefined,
      "---",
      input.text,
    ];

    return instructions.filter(Boolean).join("\n");
  }

  private safeParseJson(content: string): unknown {
    try {
      return JSON.parse(content);
    } catch (error) {
      // Some models may wrap JSON in markdown code fences
      const fallback = content.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(fallback);
      } catch (err) {
        throw new AiError(
          500,
          "Unable to parse metadata JSON",
          "AI_RESPONSE_PARSE_ERROR"
        );
      }
    }
  }

  private normalizeMetadata(payload: RawMetadata): AiMetadata {
    const rawAuthors = payload.authors as unknown;
    const authors = Array.isArray(rawAuthors)
      ? rawAuthors
          .map((author) =>
            typeof author === "string" ? author.trim() : String(author ?? "")
          )
          .filter((author) => author.length > 0)
      : typeof rawAuthors === "string"
        ? rawAuthors
            .split(/,|;|\band\b/gi)
            .map((author: string) => author.trim())
            .filter((author) => author.length > 0)
        : [];

    const yearValue = Number(payload.year);
    const year = Number.isFinite(yearValue) ? yearValue : undefined;

    const confidenceValue = Number(payload.confidence);
    const confidence = Number.isFinite(confidenceValue)
      ? Math.min(Math.max(confidenceValue, 0), 1)
      : undefined;

    const rawKeywords = payload.keywords as unknown;
    const keywords = Array.isArray(rawKeywords)
      ? rawKeywords
          .map((keyword) =>
            typeof keyword === "string" ? keyword.trim() : String(keyword ?? "")
          )
          .filter((keyword) => keyword.length > 0)
      : typeof rawKeywords === "string"
        ? rawKeywords
            .split(/,|;|\band\b/gi)
            .map((keyword: string) => keyword.trim())
            .filter((keyword) => keyword.length > 0)
        : [];

    return {
      title: payload.title?.toString().trim(),
      abstract: payload.abstract?.toString().trim(),
      authors,
      year,
      doi: payload.doi?.toString().trim() || undefined,
      keywords,
      source: payload.source?.toString().trim(),
      confidence,
    };
  }
}
