import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
} from "../ai.types";

export class GeminiProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("gemini", apiKey, requestTimeoutMs);
  }

  protected async performExtraction(
    _input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    throw new AiError(
      503,
      "Gemini provider is not yet fully implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }

  protected async performSummary(
    _input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    throw new AiError(
      503,
      "Gemini provider is not yet fully implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }
}
