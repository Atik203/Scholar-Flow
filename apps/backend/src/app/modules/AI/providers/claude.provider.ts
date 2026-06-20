import { AiError } from "../ai.errors";
import { BaseAiProvider } from "../ai.provider";
import {
  AiInsightRequest,
  AiInsightResult,
  AiMetadataExtractionInput,
  AiMetadataExtractionResult,
  AiSummaryRequest,
  AiSummaryResult,
} from "../ai.types";

const DEFAULT_MODEL = "claude-3-5-sonnet-latest";

const normalizeList = (value: unknown, maxItems = 5): string[] | undefined => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) =>
        typeof entry === "string" ? entry.trim() : String(entry || "").trim()
      )
      .filter((entry) => Boolean(entry));
    return normalized.length
      ? normalized.slice(0, maxItems).map((entry) => entry.slice(0, 280))
      : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    const parts = value
      .split(/\n|\r|,|;|\u2022/g)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return parts.length
      ? parts.slice(0, maxItems).map((entry) => entry.slice(0, 280))
      : undefined;
  }
  return undefined;
};

const stripJsonFences = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed
      .replace(/^```[a-zA-Z]*\s*/, "")
      .replace(/```$/, "")
      .trim();
  }
  return trimmed;
};

const callClaudeApi = async (
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  timeoutMs: number,
  maxTokens = 1024
): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(
        `Claude API error: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export class ClaudeProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("claude", apiKey, requestTimeoutMs);
  }

  protected async performExtraction(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Claude provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const systemPrompt = `You are an academic metadata extraction expert. Extract the following fields from the provided paper text and respond ONLY with a valid JSON object matching this shape:
{
  "title": "paper title",
  "abstract": "abstract text",
  "authors": ["Author Name"],
  "year": 2024,
  "doi": "10.xxx/xxx",
  "keywords": ["keyword1", "keyword2"],
  "confidence": 0.8
}
If a field cannot be determined, omit it. Use the original title if no better title is found.`;

    const text = input.text.slice(0, 16000);

    const data = (await callClaudeApi(
      this.apiKey,
      DEFAULT_MODEL,
      systemPrompt,
      `Paper text:\n\n${text}`,
      this.requestTimeoutMs,
      1024
    )) as { content?: Array<{ text?: string }> };

    const rawText =
      data.content
        ?.map((block) => block.text ?? "")
        .join("\n")
        .trim() ?? "";

    if (!rawText) {
      throw new Error("Claude returned empty extraction response");
    }

    const cleaned = stripJsonFences(rawText);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Claude extraction response was not valid JSON: ${cleaned.slice(0, 200)}`);
    }

    const metadata = {
      title:
        typeof parsed.title === "string" && parsed.title.trim()
          ? parsed.title.trim()
          : undefined,
      abstract:
        typeof parsed.abstract === "string" && parsed.abstract.trim()
          ? parsed.abstract.trim()
          : undefined,
      authors: normalizeList(parsed.authors, 10),
      year:
        typeof parsed.year === "number" && parsed.year > 1000
          ? parsed.year
          : undefined,
      doi:
        typeof parsed.doi === "string" && parsed.doi.trim()
          ? parsed.doi.trim()
          : undefined,
      keywords: normalizeList(parsed.keywords, 8),
      source: "claude",
      confidence:
        typeof parsed.confidence === "number"
          ? parsed.confidence
          : 0.7,
    };

    return {
      provider: this.name,
      metadata,
      rawResponse: data,
    };
  }

  protected async performSummary(
    input: AiSummaryRequest
  ): Promise<AiSummaryResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Claude provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const wordLimit = input.wordLimit ?? 220;
    const systemPrompt = `You are an expert research paper summarization assistant. Summarize the provided paper excerpt into a clear, concise summary of ${wordLimit} words or fewer. Focus on the methodology, key findings, and implications. Respond ONLY with a valid JSON object:
{
  "summary": "the summary text",
  "highlights": ["key finding 1", "key finding 2"],
  "followUpQuestions": ["question 1", "question 2"]
}`;

    let userMessage = `Paper excerpt:\n\n${input.text.slice(0, 24000)}`;
    if (input.instructions) {
      userMessage += `\n\nAdditional instructions: ${input.instructions}`;
    }
    if (input.focusAreas?.length) {
      userMessage += `\n\nFocus areas: ${input.focusAreas.join(", ")}`;
    }

    const data = (await callClaudeApi(
      this.apiKey,
      DEFAULT_MODEL,
      systemPrompt,
      userMessage,
      this.requestTimeoutMs,
      1200
    )) as { content?: Array<{ text?: string }> };

    const rawText =
      data.content
        ?.map((block) => block.text ?? "")
        .join("\n")
        .trim() ?? "";

    if (!rawText) {
      throw new Error("Claude returned empty summary response");
    }

    const cleaned = stripJsonFences(rawText);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { summary: cleaned };
    }

    const summaryText =
      typeof parsed.summary === "string"
        ? parsed.summary.trim()
        : cleaned;

    if (!summaryText) {
      throw new Error("Claude summary payload did not include a summary field");
    }

    return {
      provider: this.name,
      summary: summaryText,
      highlights: normalizeList(parsed.highlights, 6),
      followUpQuestions: normalizeList(parsed.followUpQuestions, 5),
      rawResponse: data,
    };
  }

  protected async performInsight(
    input: AiInsightRequest
  ): Promise<AiInsightResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "Claude provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const systemPrompt =
      "You are an expert research assistant. Answer the user's question about the paper based on the provided context. Be precise, cite relevant sections, and suggest follow-up avenues. Respond in plain text (not JSON).";

    let userMessage = `Paper context:\n${input.context.slice(0, 20000)}\n\nQuestion: ${input.prompt}`;

    const history = input.history ?? [];
    if (history.length > 0) {
      const historyText = history
        .slice(-8)
        .map((msg) => `${msg.role}: ${msg.content.slice(0, 800)}`)
        .join("\n\n");
      userMessage = `Previous conversation:\n${historyText}\n\n${userMessage}`;
    }

    const data = (await callClaudeApi(
      this.apiKey,
      DEFAULT_MODEL,
      systemPrompt,
      userMessage,
      this.requestTimeoutMs,
      1500
    )) as { content?: Array<{ text?: string }> };

    const responseText =
      data.content
        ?.map((block) => block.text ?? "")
        .join("\n")
        .trim() ?? "";

    const suggestions = [
      "Ask about the methodology behind the key findings",
      "Inquire about potential limitations or counter-arguments",
      "Explore practical applications of this research",
    ];

    return {
      provider: this.name,
      message: {
        role: "assistant",
        content: responseText || "Claude was unable to generate a response.",
      },
      suggestions,
      rawResponse: data,
    };
  }
}
