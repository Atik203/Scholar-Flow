import config from "../../config";
import prisma from "../../shared/prisma";
import { BaseAiProvider } from "./ai.provider";
import type {
  AiMetadata,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
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

export const aiMetadataService = {
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
};

const shouldReplaceValue = (currentValue?: string | null) => {
  if (!currentValue) {
    return true;
  }

  // Treat placeholder titles like "Untitled" as replaceable
  const normalized = currentValue.trim().toLowerCase();
  return ["untitled", "unknown", ""].includes(normalized);
};
