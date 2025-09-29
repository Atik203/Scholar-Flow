import OpenAI, { APIError } from "openai";
import { z } from "zod";
import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiMetadata,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
} from "../ai.types";

const DEFAULT_MODEL = "gpt-4o-mini";

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

export class OpenAiProvider extends BaseAiProvider {
  private readonly client: OpenAI | null;

  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("openai", apiKey, requestTimeoutMs);
    this.client = apiKey
      ? new OpenAI({ apiKey, timeout: requestTimeoutMs })
      : null;
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
