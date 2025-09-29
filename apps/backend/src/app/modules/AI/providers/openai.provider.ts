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

const DEFAULT_MODEL = "gpt-4o-mini"; // Most cost-effective GPT-4 class model
const COST_EFFECTIVE_MODELS = [
  "gpt-4o-mini", // Primary cost-effective model
  "gpt-3.5-turbo", // Fallback cost-effective option
  "gpt-4o", // Higher capability when needed
];

type OpenAIClientInstance = InstanceType<typeof OpenAI>;

type JsonSchemaResponseFormat = {
  type: "json_schema";
  json_schema: {
    name: string;
    schema: Record<string, unknown>;
    strict?: boolean;
  };
};

type FallbackResponsesCreateParams = {
  input: Array<{
    role: "system" | "user" | "assistant";
    content: Array<{ type: "text"; text: string }>;
  }>;
  response_format?: JsonSchemaResponseFormat;
};

type ResponsesCreateParams = OpenAIClientInstance extends {
  responses: {
    create: (...args: infer A) => unknown;
  };
}
  ? A[0]
  : FallbackResponsesCreateParams;

type ResponsesInput = ResponsesCreateParams extends { input: infer I }
  ? I
  : FallbackResponsesCreateParams["input"];

type ResponsesResponseFormat = ResponsesCreateParams extends {
  response_format?: infer R;
}
  ? R
  : JsonSchemaResponseFormat | undefined;

// Prioritize cost-effective models (ordered by cost efficiency)
const SUPPORTED_MODELS = [
  "gpt-4o-mini", // Most cost-effective GPT-4 class model
  "gpt-3.5-turbo", // Very cost-effective for simpler tasks
  "gpt-4o", // Higher capability when needed
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo-16k",
];

const RESPONSES_MODELS = new Set(["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"]);

const isValidModel = (model: string): boolean =>
  SUPPORTED_MODELS.includes(model);

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

const METADATA_RESPONSE_SCHEMA = {
  name: "AiMetadataResponse",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      abstract: { type: "string" },
      authors: {
        anyOf: [
          { type: "array", items: { type: "string" } },
          { type: "string" },
        ],
      },
      year: {
        anyOf: [{ type: "number" }, { type: "string" }],
      },
      doi: { type: "string" },
      keywords: {
        anyOf: [
          { type: "array", items: { type: "string" } },
          { type: "string" },
        ],
      },
      source: { type: "string" },
      confidence: {
        anyOf: [{ type: "number" }, { type: "string" }],
      },
    },
  },
  strict: false,
} as const;

const SUMMARY_RESPONSE_SCHEMA = {
  name: "AiSummaryResponse",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary"],
    properties: {
      summary: { type: "string" },
      highlights: {
        anyOf: [
          { type: "array", items: { type: "string" } },
          { type: "string" },
        ],
      },
      followUpQuestions: {
        anyOf: [
          { type: "array", items: { type: "string" } },
          { type: "string" },
        ],
      },
      tokensUsed: {
        anyOf: [{ type: "number" }, { type: "string" }],
      },
    },
  },
  strict: false,
} as const;

const INSIGHT_RESPONSE_SCHEMA = {
  name: "AiInsightResponse",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["answer"],
    properties: {
      answer: { type: "string" },
      suggestions: {
        anyOf: [
          { type: "array", items: { type: "string" } },
          { type: "string" },
        ],
      },
      tokensUsed: {
        anyOf: [{ type: "number" }, { type: "string" }],
      },
    },
  },
  strict: false,
} as const;

export class OpenAiProvider extends BaseAiProvider {
  private readonly client: OpenAI | null;

  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    const normalizedKey = apiKey?.trim();
    super("openai", normalizedKey, requestTimeoutMs);

    const isValidKey = Boolean(
      normalizedKey &&
        normalizedKey.startsWith("sk-") &&
        normalizedKey.length >= 20
    );

    this.client = isValidKey
      ? new OpenAI({ apiKey: normalizedKey, timeout: requestTimeoutMs })
      : null;
  }

  override isEnabled(): boolean {
    return Boolean(this.client);
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
      const { payload, raw } = await this.callStructuredJson(
        {
          model: DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert research metadata assistant. Respond strictly with a JSON object representing the extracted metadata.",
            },
            {
              role: "user",
              content: this.buildPrompt(input),
            },
          ],
          temperature: 0.2,
          maxTokens: 700,
          responseSchema: METADATA_RESPONSE_SCHEMA,
        },
        metadataSchema
      );

      const metadata = this.normalizeMetadata(payload);

      return {
        provider: this.name,
        metadata,
        rawResponse: raw,
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
      const { payload, raw, tokens } = await this.callStructuredJson(
        {
          model: DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a senior research assistant. Return a JSON object describing the requested summary, highlights, and follow-up questions.",
            },
            {
              role: "user",
              content: this.buildSummaryPrompt(input),
            },
          ],
          temperature: 0.3,
          maxTokens: Math.min(900, Math.max((input.wordLimit ?? 220) * 3, 600)),
          responseSchema: SUMMARY_RESPONSE_SCHEMA,
        },
        summarySchema
      );

      const validated = payload as RawSummary;
      const highlights = normalizeStringList(validated.highlights);
      const followUps = normalizeStringList(validated.followUpQuestions, 5);
      const rawTokens =
        typeof validated.tokensUsed === "string"
          ? Number(validated.tokensUsed)
          : validated.tokensUsed;
      const tokensUsed = Number.isFinite(rawTokens ?? NaN)
        ? (rawTokens as number)
        : tokens;

      return {
        provider: this.name,
        summary: validated.summary.trim(),
        highlights,
        followUpQuestions: followUps,
        rawResponse: raw,
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
    if (!this.client) {
      throw new AiError(
        503,
        "OpenAI provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    try {
      const requestedModel = input.model || DEFAULT_MODEL;
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        {
          role: "system",
          content:
            "You are a senior research mentor helping a scholar interpret and apply insights from a paper. Always return a JSON object with keys: answer (string), suggestions (array of strings), tokensUsed (number).",
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
        messages.push(
          ...input.history.map((message) => ({
            role: message.role,
            content: String(message.content ?? ""),
          }))
        );
      }

      messages.push({ role: "user", content: input.prompt });

      const modelToUse = this.resolveModel(requestedModel);

      const { payload, raw, tokens } = await this.callStructuredJson(
        {
          model: modelToUse,
          messages,
          temperature: 0.4,
          maxTokens: 900,
          responseSchema: INSIGHT_RESPONSE_SCHEMA,
        },
        insightSchema
      );

      const validated = payload as RawInsight;
      const suggestions = normalizeStringList(validated.suggestions, 4);
      const rawTokens =
        typeof validated.tokensUsed === "string"
          ? Number(validated.tokensUsed)
          : validated.tokensUsed;
      const tokensUsed = Number.isFinite(rawTokens ?? NaN)
        ? (rawTokens as number)
        : tokens;

      return {
        provider: this.name,
        message: {
          role: "assistant",
          content: validated.answer.trim(),
        },
        suggestions: suggestions,
        rawResponse: raw,
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

  private resolveModel(model?: string): string {
    if (model && isValidModel(model)) {
      return model;
    }
    return DEFAULT_MODEL;
  }

  private useResponsesApi(model: string): boolean {
    // Disable Responses API to use standard chat completions API
    return false;
  }

  private async callStructuredJson<T>(
    params: {
      model?: string;
      messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      temperature: number;
      maxTokens: number;
      responseSchema?: {
        name: string;
        schema: Record<string, unknown>;
        strict?: boolean;
      };
    },
    validator: z.ZodType<T>
  ): Promise<{ payload: T; raw: unknown; tokens?: number }> {
    if (!this.client) {
      throw new AiError(
        503,
        "OpenAI provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const modelToUse = this.resolveModel(params.model);
    const responseFormat: ResponsesResponseFormat | undefined =
      params.responseSchema
        ? {
            type: "json_schema",
            json_schema: params.responseSchema,
          }
        : undefined;

    if (this.useResponsesApi(modelToUse) && this.client.responses) {
      const input = params.messages.map((message) => ({
        role: message.role,
        content: [{ type: "text", text: message.content }],
      })) as unknown as ResponsesInput;

      const responsesClient = this.client.responses as unknown as {
        create: (body: Record<string, unknown>) => Promise<unknown>;
      };

      const requestBody: Record<string, unknown> = {
        model: modelToUse,
        temperature: params.temperature,
        max_output_tokens: params.maxTokens,
        input,
      };

      if (responseFormat) {
        // Use the new text.format parameter structure for Responses API
        requestBody.text = {
          format: responseFormat as unknown,
        };
      }

      const response = await responsesClient.create(requestBody);

      const text = this.extractResponseText(response);
      const parsed = this.safeParseJson(text);
      const payload = validator.parse(parsed) as T;
      const tokens = this.extractTokenUsage((response as any).usage);

      return { payload, raw: response, tokens };
    }

    const completion = await this.client.chat.completions.create({
      model: modelToUse,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      messages: params.messages,
    });

    const messageContent = completion.choices[0]?.message?.content ?? "";
    const parsed = this.safeParseJson(messageContent);
    const payload = validator.parse(parsed) as T;
    const tokens = this.extractTokenUsage(completion.usage);

    return { payload, raw: completion, tokens };
  }

  private extractResponseText(response: unknown): string {
    if (!response || typeof response !== "object") {
      return "";
    }

    const outputText = (response as { output_text?: string }).output_text;
    if (typeof outputText === "string" && outputText.trim()) {
      return outputText;
    }

    const output = (response as { output?: unknown }).output;
    if (Array.isArray(output)) {
      for (const item of output) {
        if (
          item &&
          typeof item === "object" &&
          Array.isArray((item as { content?: unknown[] }).content)
        ) {
          for (const part of (item as { content: Array<{ text?: string }> })
            .content) {
            if (part && typeof part.text === "string" && part.text.trim()) {
              return part.text;
            }
          }
        }
      }
    }

    const choices = (response as { choices?: unknown[] }).choices;
    if (Array.isArray(choices) && choices.length > 0) {
      const firstChoice = choices[0] as
        | { message?: { content?: string | Array<{ text?: string }> } }
        | undefined;
      const content = firstChoice?.message?.content;
      if (typeof content === "string" && content.trim()) {
        return content;
      }
      if (Array.isArray(content)) {
        return content
          .map((entry) =>
            entry && typeof entry.text === "string" ? entry.text : ""
          )
          .join("")
          .trim();
      }
    }

    return "";
  }

  private extractTokenUsage(usage: unknown): number | undefined {
    if (!usage || typeof usage !== "object") {
      return undefined;
    }

    const total = (usage as { total_tokens?: number }).total_tokens;
    if (typeof total === "number") {
      return total;
    }

    const promptTokens =
      (
        usage as {
          prompt_tokens?: number;
          input_tokens?: number;
        }
      ).prompt_tokens ?? (usage as { input_tokens?: number }).input_tokens;

    const completionTokens =
      (
        usage as {
          completion_tokens?: number;
          output_tokens?: number;
          response_tokens?: number;
        }
      ).completion_tokens ??
      (usage as { output_tokens?: number }).output_tokens ??
      (usage as { response_tokens?: number }).response_tokens;

    const prompt = typeof promptTokens === "number" ? promptTokens : 0;
    const completion =
      typeof completionTokens === "number" ? completionTokens : 0;

    if (prompt === 0 && completion === 0) {
      return undefined;
    }

    return prompt + completion;
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
          "Unable to parse AI JSON response",
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
