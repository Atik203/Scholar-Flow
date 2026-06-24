import crypto from "crypto";
import config from "../../config";
import prisma from "../../shared/prisma";
import { aiSummaryCache } from "./ai.cache";
import { BaseAiProvider } from "./ai.provider";
import type {
  AiInsightMessagePayload,
  AiInsightRequest,
  AiInsightResult,
  AiMetadata,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
  ProviderModel,
  ProviderName,
  ProviderStatus,
} from "./ai.types";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenAiProvider } from "./providers/openai.provider";
import { ClaudeProvider } from "./providers/claude.provider";
import { DeepSeekProvider } from "./providers/deepseek.provider";

const providers: Record<ProviderName, BaseAiProvider | null> = {
  openai: new OpenAiProvider(config.openai.apiKey, config.ai.requestTimeoutMs),
  gemini: new GeminiProvider(config.gemini.apiKey, config.ai.requestTimeoutMs),
  claude: new ClaudeProvider(config.claude.apiKey, config.ai.requestTimeoutMs),
  deepseek: new DeepSeekProvider(
    config.deepseek.apiKey,
    config.ai.requestTimeoutMs
  ),
  heuristic: null,
};

const isKnownProvider = (value: string): value is ProviderName =>
  ["openai", "gemini", "claude", "deepseek", "heuristic"].includes(
    value as ProviderName
  );

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

const sanitizeInsightHistory = (
  history: AiInsightMessagePayload[] | undefined
): AiInsightMessagePayload[] => {
  if (!history || !history.length) {
    return [];
  }

  return history
    .slice(-6)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1600),
    }))
    .filter((message) => message.content.trim().length > 0);
};

const runInsightHeuristics = (input: AiInsightRequest): AiInsightResult => {
  const question = input.prompt.trim();
  const snippet = limitTextToWords(input.context, 160);

  const hasContext = snippet.length > 0;
  const reasonLine = hasContext
    ? "I'm falling back to a heuristic summary because the AI providers couldn't return a full answer just now."
    : "Your paper text hasn't finished processing yet, so I'm sharing heuristic guidance while we wait for the full content.";

  const analysisLines = [
    reasonLine,
    hasContext ? `Key excerpt considered: ${snippet}` : undefined,
    question ? `What you're asking: ${question}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");

  const suggestions = [
    "Highlight the specific evidence or data points supporting the claimed findings.",
    "Compare these insights with related work to validate novelty or limitations.",
    "Outline next experiments or questions that would strengthen the argument.",
  ];

  return {
    provider: "heuristic",
    message: {
      role: "assistant",
      content:
        analysisLines.length > 0
          ? `${analysisLines}\n\nConsider diving deeper into methodology, assumptions, and potential applications for more targeted insights. You can re-run this insight once the document has finished processing or try again in a moment.`
          : "I can help more once additional context is available from the document processing pipeline.",
    },
    suggestions,
  };
};

const PROVIDER_MODEL_MAP: Record<string, ProviderModel[]> = {
  openai: [
    {
      value: "gpt-4o-mini",
      label: "GPT-4o Mini (OpenAI - Fast & Affordable)",
      description: "Quick responses, good for basic questions",
      provider: "OpenAI",
    },
    {
      value: "gpt-3.5-turbo",
      label: "GPT-3.5 Turbo (OpenAI - Balanced)",
      description: "Good balance of speed and quality",
      provider: "OpenAI",
    },
    {
      value: "gpt-4o",
      label: "GPT-4o (OpenAI - Premium)",
      description: "Best quality responses for complex analysis",
      provider: "OpenAI",
    },
  ],
  gemini: [
    {
      value: "gemini-2.5-flash-lite",
      label: "Gemini 2.5 Flash Lite (Google - Fast & Free)",
      description: "Latest lightweight Google AI model, very fast",
      provider: "Google",
    },
    {
      value: "gemini-2.5-flash",
      label: "Gemini 2.5 Flash (Google - Enhanced Free)",
      description: "Enhanced Google AI model with improved capabilities",
      provider: "Google",
    },
  ],
  claude: [
    {
      value: "claude-3-5-sonnet-latest",
      label: "Claude 3.5 Sonnet (Anthropic - Best Balance)",
      description: "Excellent reasoning, coding, and analysis",
      provider: "Anthropic",
    },
    {
      value: "claude-3-5-haiku-latest",
      label: "Claude 3.5 Haiku (Anthropic - Fastest)",
      description: "Quick responses for simpler tasks",
      provider: "Anthropic",
    },
    {
      value: "claude-3-opus-latest",
      label: "Claude 3 Opus (Anthropic - Most Powerful)",
      description: "Best for complex multi-step reasoning",
      provider: "Anthropic",
    },
  ],
  deepseek: [
    {
      value: "deepseek-chat",
      label: "DeepSeek-V3 (DeepSeek - Primary)",
      description: "Strong all-around performance at low cost",
      provider: "DeepSeek",
    },
    {
      value: "deepseek-reasoner",
      label: "DeepSeek-R1 (DeepSeek - Reasoning)",
      description: "Advanced reasoning for complex analysis",
      provider: "DeepSeek",
    },
  ],
};

const EMPTY_MODELS: ProviderModel[] = [];

const ALL_PROVIDERS: ProviderName[] = [
  "openai",
  "gemini",
  "claude",
  "deepseek",
];

export const aiService = {
  /**
   * Get the list of providers + their configured models.
   *
   * Reads from the AIProvider admin catalog (Phase C.1) when rows exist.
   * Falls back to the static PROVIDER_MODEL_MAP if the table is empty
   * (e.g., on a fresh deployment before the admin seeds the catalog).
   * A model's `configured` flag is true when both:
   *   1. The provider instance has its env-var API key set, AND
   *   2. The row in AIProvider is enabled.
   */
  async getProviderStatuses(): Promise<ProviderStatus[]> {
    let dbRows: any[];
    try {
      dbRows = await prisma.aIProvider.findMany({
        where: { isDeleted: false },
        orderBy: [{ provider: "asc" }, { displayOrder: "asc" }],
      });
    } catch (err: any) {
      // P2021 = table doesn't exist (migration not yet applied). Fall back
      // to the static model map so the frontend always has provider data.
      if (err?.code === "P2021") {
        dbRows = [];
      } else {
        throw err;
      }
    }

    // If admin hasn't seeded the catalog, return the static fallback
    // (and skip key-status check since the static map doesn't carry
    // an apiKeyEnvName per row).
    if (dbRows.length === 0) {
      return ALL_PROVIDERS.map((provider) => {
        const instance = providers[provider];
        const configured = Boolean(instance?.isEnabled());
        return {
          provider,
          configured,
          models: configured
            ? PROVIDER_MODEL_MAP[provider] ?? EMPTY_MODELS
            : EMPTY_MODELS,
        };
      });
    }

    // Group rows by provider key. The provider instance is "configured"
    // when its API key env is set; individual rows are configured only
    // when both the row is enabled AND the underlying provider is wired.
    const byProvider = new Map<string, typeof dbRows>();
    for (const row of dbRows) {
      const arr = byProvider.get(row.provider) ?? [];
      arr.push(row);
      byProvider.set(row.provider, arr);
    }

    const statuses: ProviderStatus[] = [];
    for (const [providerKey, rows] of byProvider.entries()) {
      // The static map only knows openai/gemini/claude/deepseek; for
      // custom keys (e.g., "anthropic", "minimax") we treat the provider
      // as configured if any env-named key is set.
      const knownInstance = (providers as Record<string, BaseAiProvider | null>)[providerKey];
      const providerConfigured = knownInstance
        ? Boolean(knownInstance.isEnabled())
        : rows.some((r) => r.apiKeyEnvName && Boolean(process.env[r.apiKeyEnvName]));

      const models: ProviderModel[] = rows.map((row) => ({
        value: row.model,
        label: row.displayName,
        description: row.description ?? "",
        provider: row.provider,
      }));

      statuses.push({
        provider: providerKey as ProviderName,
        configured: providerConfigured,
        models: providerConfigured
          ? models
          : [],
      });
    }

    // Preserve the original static provider order so the UI's fallback
    // ordering matches what users saw before the catalog existed.
    statuses.sort((a, b) => {
      const ai = ALL_PROVIDERS.indexOf(a.provider as ProviderName);
      const bi = ALL_PROVIDERS.indexOf(b.provider as ProviderName);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return statuses;
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

  async generateInsight(request: AiInsightRequest): Promise<AiInsightResult> {
    const sanitizedHistory = sanitizeInsightHistory(request.history);
    const normalizedRequest: AiInsightRequest = {
      ...request,
      prompt: request.prompt.trim(),
      context: request.context || "",
      history: sanitizedHistory,
    };

    const hasContext = normalizedRequest.context.trim().length > 0;
    const hasHistory = sanitizedHistory.length > 0;

    if (!hasContext && !hasHistory) {
      return runInsightHeuristics(normalizedRequest);
    }

    if (!config.ai.featuresEnabled) {
      return runInsightHeuristics(normalizedRequest);
    }

    const providerInstances = getProviderInstances();
    const errors: string[] = [];

    for (const provider of providerInstances) {
      if (
        !provider.isEnabled() ||
        typeof provider.generateInsights !== "function"
      ) {
        continue;
      }

      try {
        const result = await provider.generateInsights(normalizedRequest);
        if (result) {
          return result;
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : String(error ?? "Unknown");
        errors.push(errorMsg);
      }
    }

    const fallback = runInsightHeuristics(normalizedRequest);
    return {
      ...fallback,
      rawResponse: { errors },
    };
  },

  async invalidateSummaryCache(paperId: string) {
    await aiSummaryCache.invalidate(paperId);
  },

  // Phase 10 — AI Key Points extraction
  async generateKeyPoints(request: AiInsightRequest): Promise<string[]> {
    const sanitizedHistory = sanitizeInsightHistory(request.history);
    const normalizedRequest: AiInsightRequest = {
      ...request,
      prompt: `Extract 5-10 key claims, findings, or contributions from this paper. Return ONLY a JSON array of strings, each being a concise key point, without numbering or bullet points. Example: ["First key finding", "Second key finding"]`,
      context: request.context || "",
      history: sanitizedHistory,
    };

    const hasContext = normalizedRequest.context.trim().length > 0;
    if (!hasContext) {
      return ["No paper content available for key points extraction. Please ensure the paper has been processed."];
    }

    if (!config.ai.featuresEnabled) {
      return ["AI features are currently disabled. Enable them in settings to extract key points."];
    }

    const providerInstances = getProviderInstances();
    const errors: string[] = [];

    for (const provider of providerInstances) {
      if (
        !provider.isEnabled() ||
        typeof provider.generateInsights !== "function"
      ) {
        continue;
      }

      try {
        const result = await provider.generateInsights(normalizedRequest);
        if (result) {
          const content = result.message?.content || "";
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed.slice(0, 10).map(String);
          } catch {
            return content
              .split(/\n|•|-|\d+\./)
              .map((s) => s.replace(/^[\s"[\]]+|[\s"\]]+$/g, "").trim())
              .filter((s) => s.length > 10)
              .slice(0, 10);
          }
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : String(error ?? "Unknown");
        errors.push(errorMsg);
      }
    }

    return [`AI key points extraction failed: ${errors.join("; ") || "No AI provider available"}`];
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
