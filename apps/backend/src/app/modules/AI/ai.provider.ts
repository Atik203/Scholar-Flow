import { AiError } from "./ai.errors";
import {
  AiInsightRequest,
  AiInsightResult,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiProvider,
  AiSummaryRequest,
  AiSummaryResult,
  ProviderName,
} from "./ai.types";

const DEFAULT_MAX_CHARS = 12000;

export abstract class BaseAiProvider implements AiProvider {
  readonly name: ProviderName;
  protected readonly apiKey?: string;
  protected readonly requestTimeoutMs: number;

  constructor(
    name: ProviderName,
    apiKey: string | undefined,
    requestTimeoutMs: number
  ) {
    this.name = name;
    this.apiKey = apiKey;
    this.requestTimeoutMs = requestTimeoutMs;
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey);
  }

  async extractMetadata(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult | null> {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const sanitizedText = this.sanitizeText(input.text);
      const effectiveInput: AiMetadataExtractionInput = {
        ...input,
        text: sanitizedText,
        timeoutMs: input.timeoutMs || this.requestTimeoutMs,
      };

      return await this.performExtraction(effectiveInput);
    } catch (error) {
      if (error instanceof AiError) {
        throw error;
      }

      throw new AiError(
        502,
        `${this.name} metadata extraction failed`,
        "AI_PROVIDER_ERROR",
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  async generateSummary(
    input: AiSummaryRequest
  ): Promise<AiSummaryResult | null> {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const sanitizedText = this.sanitizeText(input.text);
      const effectiveInput: AiSummaryRequest = {
        ...input,
        text: sanitizedText,
        timeoutMs: input.timeoutMs || this.requestTimeoutMs,
        wordLimit: input.wordLimit ?? 220,
      };

      return await this.performSummary(effectiveInput);
    } catch (error) {
      if (error instanceof AiError) {
        throw error;
      }

      throw new AiError(
        502,
        `${this.name} summary generation failed`,
        "AI_PROVIDER_ERROR",
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  async generateInsights(
    input: AiInsightRequest
  ): Promise<AiInsightResult | null> {
    if (!this.isEnabled() || !this.performInsight) {
      return null;
    }

    try {
      const sanitizedContext = this.sanitizeText(input.context);
      const effectiveInput: AiInsightRequest = {
        ...input,
        context: sanitizedContext,
        history: input.history ?? [],
        timeoutMs: input.timeoutMs || this.requestTimeoutMs,
      };

      return await this.performInsight(effectiveInput);
    } catch (error) {
      if (error instanceof AiError) {
        throw error;
      }

      throw new AiError(
        502,
        `${this.name} insight generation failed`,
        "AI_PROVIDER_ERROR",
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  protected sanitizeText(text: string): string {
    if (!text) {
      return "";
    }
    const trimmed = text.trim();
    return trimmed.length > DEFAULT_MAX_CHARS
      ? `${trimmed.slice(0, DEFAULT_MAX_CHARS)}\n...`
      : trimmed;
  }

  protected abstract performExtraction(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult>;

  protected abstract performSummary(
    input: AiSummaryRequest
  ): Promise<AiSummaryResult>;

  protected performInsight?(input: AiInsightRequest): Promise<AiInsightResult>;
}
