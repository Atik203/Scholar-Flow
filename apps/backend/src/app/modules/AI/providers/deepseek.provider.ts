import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
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
}
