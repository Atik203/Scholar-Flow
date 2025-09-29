import crypto from "crypto";
import config from "../../config";
import prisma from "../../shared/prisma";
import { aiSummaryCache } from "./ai.cache";
import { BaseAiProvider } from "./ai.provider";
import type {
  AiMetadata,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
  ProviderName,
  ProviderStatus,
} from "./ai.types";
import { DeepseekProvider } from "./providers/deepseek.provider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenAiProvider } from "./providers/openai.provider";

const providers: Record<ProviderName, BaseAiProvider | null> = {
  openai: new OpenAiProvider(config.openai.apiKey, config.ai.requestTimeoutMs),
  gemini: new GeminiProvider(config.gemini.apiKey, config.ai.requestTimeoutMs),
  deepseek: new DeepseekProvider(
    config.deepseek.apiKey,
    config.ai.requestTimeoutMs
  ),
  heuristic: null,
};

const isKnownProvider = (value: string): value is ProviderName =>
  ["openai", "gemini", "deepseek", "heuristic"].includes(value as ProviderName);

type MetadataPersistOptions = {
  paperId: string;
  text: string;
  originalTitle?: string | null;
  existingMetadata?: Record<string, unknown> | null;
  currentTitle?: string | null;
  currentAbstract?: string | null;
  workspaceId?: string;
  uploaderId?: string;
};

const DEFAULT_SUMMARY_WORD_LIMIT = 220;
const MAX_SUMMARY_WORD_LIMIT = 600;
const MIN_SUMMARY_WORD_LIMIT = 80;
const MAX_SUMMARY_TEXT_LENGTH = 48000;

const getProviderInstances = () => {
  const seen = new Set<ProviderName>();
  return config.ai.providerFallbackOrder
    .map((name) => {
      if (!isKnownProvider(name)) {
        return null;
      }
      const providerName = name as ProviderName;
      if (seen.has(providerName)) {
        return null;
      }
      seen.add(providerName);
      return providers[providerName] ?? null;
    })
    .filter((provider): provider is BaseAiProvider => provider !== null);
};

const runHeuristics = (input: AiMetadataExtractionInput): AiMetadata => {
  const lines = input.text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const titleCandidate = input.originalTitle?.trim() || lines[0] || undefined;

  const abstractIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith("abstract")
  );
  const abstract =
    abstractIndex >= 0
      ? lines.slice(abstractIndex + 1, abstractIndex + 6).join(" ")
      : lines.slice(1, 6).join(" ");

  const authorsLine = lines.find(
    (line) => /author(s)?/i.test(line) && line.length < 200
  );
  const authors = authorsLine
    ? authorsLine
        .replace(/authors?:?/i, "")
        .split(/,|;|\band\b/gi)
        .map((author) => author.trim())
        .filter((author) => author.length > 0)
    : [];

  const yearMatch = input.text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : undefined;

  return {
    title: titleCandidate,
    abstract: abstract ? abstract.slice(0, 1200) : undefined,
    authors,
    year,
    keywords: [],
    source: (input.existingMetadata?.source as string) || undefined,
    confidence: 0.2,
  };
};

const clampWordLimit = (wordLimit?: number) => {
  const parsed = Number(wordLimit);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_SUMMARY_WORD_LIMIT;
  }
  return Math.max(
    MIN_SUMMARY_WORD_LIMIT,
    Math.min(parsed, MAX_SUMMARY_WORD_LIMIT)
  );
};

const limitTextToWords = (text: string, maxWords: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return words.join(" ");
  }
  return `${words.slice(0, maxWords).join(" ")}`.trim() + "…";
};

const truncateSentence = (text: string, maxChars: number) => {
  if (text.length <= maxChars) {
    return text;
  }
  return `${text.slice(0, maxChars - 1).trim()}…`;
};

const normalizeSummaryInput = (input: AiSummaryRequest): AiSummaryRequest => {
  const text = (input.text || "").replace(/\s+/g, " ").trim();
  const truncatedText =
    text.length > MAX_SUMMARY_TEXT_LENGTH
      ? text.slice(0, MAX_SUMMARY_TEXT_LENGTH)
      : text;
  const focusAreas = input.focusAreas
    ?.map((area) => area.trim())
    .filter((area) => area.length > 0);

  return {
    ...input,
    text: truncatedText,
    instructions: input.instructions?.trim() || undefined,
    focusAreas,
    language: input.language?.trim() || undefined,
    wordLimit: clampWordLimit(input.wordLimit),
  };
};

const hashText = (text: string) =>
  crypto.createHash("sha1").update(text).digest("hex");

const buildSummaryCacheParams = (input: AiSummaryRequest) => ({
  tone: input.tone,
  audience: input.audience,
  language: input.language,
  wordLimit: input.wordLimit,
  focus: input.focusAreas,
  textHash: hashText(input.text),
});

const runSummaryHeuristics = (input: AiSummaryRequest): AiSummaryResult => {
  const sentences = input.text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const paragraphBlocks = input.text
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter((block) => block.length > 0);

  const baseSummary = sentences.length
    ? sentences.slice(0, 5).join(" ")
    : paragraphBlocks.slice(0, 2).join(" ");

  const summary = baseSummary
    ? limitTextToWords(
        baseSummary,
        input.wordLimit ?? DEFAULT_SUMMARY_WORD_LIMIT
      )
    : "We couldn't generate a summary because the paper content is empty. Please try re-processing the document.";

  const keywordRegex =
    /(result|conclusion|method|approach|finding|model|dataset|future work|limitation)/i;
  const highlightCandidates = sentences.filter((sentence) =>
    keywordRegex.test(sentence)
  );
  const highlightsSource = highlightCandidates.length
    ? highlightCandidates
    : sentences.slice(0, 4);

  const highlights = highlightsSource
    .map((sentence) => truncateSentence(sentence, 220))
    .filter(
      (sentence, index, arr) => sentence && arr.indexOf(sentence) === index
    )
    .slice(0, 4);

  const followUpQuestions = [
    "Which methodology underpins the core findings, and are there assumptions to validate?",
    "How could these results translate into actionable steps for your current research goals?",
    "What gaps or future work do the authors recommend exploring next?",
  ];

  return {
    provider: "heuristic",
    summary,
    highlights: highlights.length ? highlights : undefined,
    followUpQuestions,
    rawResponse: { heuristic: true },
  };
};

export const aiService = {
  getProviderStatuses(): ProviderStatus[] {
    return ["openai", "gemini", "deepseek"].map((provider) => {
      const instance = providers[provider as ProviderName];
      return {
        provider: provider as ProviderName,
        configured: Boolean(instance?.isEnabled()),
      };
    });
  },

  async extractMetadata(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    if (!config.ai.featuresEnabled) {
      return {
        provider: "heuristic",
        metadata: runHeuristics(input),
      };
    }

    const providerInstances = getProviderInstances();
    const errors: string[] = [];

    for (const provider of providerInstances) {
      if (!provider.isEnabled()) {
        continue;
      }

      try {
        const result = await provider.extractMetadata(input);
        if (result && result.metadata) {
          return result;
        }
      } catch (error) {
        errors.push(
          error instanceof Error ? error.message : String(error ?? "Unknown")
        );
      }
    }

    return {
      provider: "heuristic",
      metadata: runHeuristics(input),
      rawResponse: { errors },
    };
  },

  async extractAndPersistMetadata(options: MetadataPersistOptions) {
    const {
      paperId,
      text,
      originalTitle,
      existingMetadata,
      currentTitle,
      currentAbstract,
    } = options;

    if (!config.ai.featuresEnabled) {
      return { applied: false, provider: "heuristic" };
    }

    const extractionResult = await this.extractMetadata({
      text,
      originalTitle,
      existingMetadata,
      workspaceId: options.workspaceId,
      uploaderId: options.uploaderId,
      timeoutMs: config.ai.requestTimeoutMs,
    });

    const metadata = extractionResult.metadata;
    if (!metadata) {
      return { applied: false, provider: extractionResult.provider };
    }

    const combinedMetadata = {
      ...(existingMetadata || {}),
      ...metadata,
      aiProvider: extractionResult.provider,
      aiUpdatedAt: new Date().toISOString(),
    };

    const shouldUpdateTitle =
      Boolean(metadata.title) && shouldReplaceValue(currentTitle);
    const shouldUpdateAbstract =
      Boolean(metadata.abstract) && shouldReplaceValue(currentAbstract);

    const nextTitle = shouldUpdateTitle ? metadata.title : currentTitle;
    const nextAbstract = shouldUpdateAbstract
      ? metadata.abstract
      : currentAbstract;

    const combinedMetadataJson = JSON.stringify(combinedMetadata);
    const existingMetadataJson = JSON.stringify(existingMetadata || {});

    if (
      nextTitle === currentTitle &&
      nextAbstract === currentAbstract &&
      combinedMetadataJson === existingMetadataJson
    ) {
      return {
        applied: false,
        provider: extractionResult.provider,
        metadata,
      };
    }

    await prisma.$executeRaw`
      UPDATE "Paper"
      SET title = ${nextTitle},
          abstract = ${nextAbstract},
          metadata = ${combinedMetadataJson}::jsonb,
          "updatedAt" = NOW()
      WHERE id = ${paperId}
    `;

    return {
      applied: true,
      provider: extractionResult.provider,
      metadata,
    };
  },

  async generateSummary(request: AiSummaryRequest): Promise<AiSummaryResult> {
    const normalizedInput = normalizeSummaryInput(request);

    if (!normalizedInput.text) {
      return {
        provider: "heuristic",
        summary:
          "We don't have extracted text for this paper yet. Please process the document or upload the full content to generate a summary.",
        highlights: undefined,
        followUpQuestions: [
          "Can you run the document processing step to extract text?",
          "Is there a specific section of the paper you'd like summarised once text is available?",
        ],
        rawResponse: { heuristic: true, reason: "NO_TEXT_AVAILABLE" },
      };
    }

    const heuristicResult = runSummaryHeuristics(normalizedInput);

    if (!config.ai.featuresEnabled) {
      return heuristicResult;
    }

    const cacheKey = normalizedInput.instructions || "default";
    const cacheParams = buildSummaryCacheParams(normalizedInput);
    const cached = await aiSummaryCache.get(
      normalizedInput.paperId,
      cacheKey,
      cacheParams
    );

    if (cached) {
      return {
        ...cached,
        cached: true,
      };
    }

    const providerInstances = getProviderInstances();
    const errors: string[] = [];

    for (const provider of providerInstances) {
      if (!provider.isEnabled()) {
        continue;
      }

      const startTime = Date.now();
      try {
        const result = await provider.generateSummary(normalizedInput);

        if (result && result.summary) {
          const normalizedSummary = limitTextToWords(
            result.summary,
            normalizedInput.wordLimit ?? DEFAULT_SUMMARY_WORD_LIMIT
          );

          const normalizedHighlights = result.highlights
            ?.map((highlight) => truncateSentence(highlight, 220))
            .filter((highlight) => Boolean(highlight));

          const normalizedFollowUps = result.followUpQuestions
            ?.map((question) => truncateSentence(question, 180))
            .filter((question) => Boolean(question));

          const payload: AiSummaryResult = {
            provider: result.provider,
            summary: normalizedSummary,
            highlights:
              normalizedHighlights && normalizedHighlights.length
                ? normalizedHighlights
                : undefined,
            followUpQuestions:
              normalizedFollowUps && normalizedFollowUps.length
                ? normalizedFollowUps
                : undefined,
            rawResponse: result.rawResponse,
            tokensUsed: result.tokensUsed,
          };

          await aiSummaryCache.set(
            normalizedInput.paperId,
            cacheKey,
            {
              provider: payload.provider,
              summary: payload.summary,
              highlights: payload.highlights,
              followUpQuestions: payload.followUpQuestions,
              tokensUsed: payload.tokensUsed,
            },
            cacheParams
          );

          const durationMs = Date.now() - startTime;

          return {
            ...payload,
            cached: false,
            rawResponse: {
              provider: result.provider,
              durationMs,
              data: payload.rawResponse,
              tokensUsed: payload.tokensUsed,
            },
          };
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error ?? "Unknown error");
        errors.push(`${provider.name}: ${message}`);
      }
    }

    return {
      ...heuristicResult,
      rawResponse: {
        data: heuristicResult.rawResponse,
        errors,
      },
    };
  },

  async invalidateSummaryCache(paperId: string) {
    await aiSummaryCache.invalidate(paperId);
  },
};

const shouldReplaceValue = (currentValue?: string | null) => {
  if (!currentValue) {
    return true;
  }

  // Treat placeholder titles like "Untitled" as replaceable
  const normalized = currentValue.trim().toLowerCase();
  return ["untitled", "unknown", ""].includes(normalized);
};
