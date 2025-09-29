export type ProviderName = "openai" | "gemini" | "deepseek" | "heuristic";

export interface AiMetadata {
  title?: string;
  abstract?: string;
  authors?: string[];
  year?: number;
  doi?: string;
  keywords?: string[];
  source?: string;
  confidence?: number;
}

export interface AiMetadataExtractionInput {
  text: string;
  originalTitle?: string | null;
  existingMetadata?: Record<string, unknown> | null;
  workspaceId?: string;
  uploaderId?: string;
  timeoutMs?: number;
}

export interface AiMetadataExtractionResult {
  provider: ProviderName;
  metadata: AiMetadata;
  rawResponse?: unknown;
}

export interface ProviderStatus {
  provider: ProviderName;
  configured: boolean;
  lastError?: string;
}

export interface AiProvider {
  readonly name: ProviderName;
  isEnabled(): boolean;
  extractMetadata(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult | null>;
}
