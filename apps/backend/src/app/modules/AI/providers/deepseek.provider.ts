import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
} from "../ai.types";

export class DeepseekProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("deepseek", apiKey, requestTimeoutMs);
  }

  protected async performExtraction(
    _input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    throw new AiError(
      503,
      "DeepSeek provider is not yet fully implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }

  protected async performSummary(
    _input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    throw new AiError(
      503,
      "DeepSeek provider is not yet fully implemented",
      "AI_PROVIDER_UNAVAILABLE"
    );
  }
}
