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

export type AiSummaryTone =
  | "academic"
  | "casual"
  | "executive"
  | "technical"
  | "conversational";

export type AiSummaryAudience =
  | "researcher"
  | "student"
  | "executive"
  | "general";

export interface AiSummaryRequest {
  paperId: string;
  text: string;
  instructions?: string;
  focusAreas?: string[];
  tone?: AiSummaryTone;
  audience?: AiSummaryAudience;
  language?: string;
  wordLimit?: number;
  workspaceId?: string;
  uploaderId?: string;
  timeoutMs?: number;
}

export interface AiSummaryResult {
  provider: ProviderName;
  summary: string;
  highlights?: string[];
  followUpQuestions?: string[];
  rawResponse?: unknown;
  tokensUsed?: number;
  cached?: boolean;
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
  generateSummary(input: AiSummaryRequest): Promise<AiSummaryResult | null>;
}
