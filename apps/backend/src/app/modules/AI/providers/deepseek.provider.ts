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

const DEFAULT_MODEL = "deepseek-chat";

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

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const callDeepSeekApi = async (
  apiKey: string,
  model: string,
  messages: DeepSeekMessage[],
  timeoutMs: number,
  maxTokens = 1024,
  temperature = 0.4
): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          top_p: 0.9,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(
        `DeepSeek API error: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const extractContent = (data: unknown): string => {
  const obj = data as Record<string, unknown>;
  const choices = Array.isArray(obj?.choices) ? obj.choices : [];
  if (choices.length > 0) {
    const message = (choices[0] as Record<string, unknown>)?.message;
    const content = (message as Record<string, unknown>)?.content;
    return typeof content === "string" ? content.trim() : "";
  }
  return "";
};

export class DeepSeekProvider extends BaseAiProvider {
  constructor(apiKey: string | undefined, requestTimeoutMs: number) {
    super("deepseek", apiKey, requestTimeoutMs);
  }

  protected async performExtraction(
    input: AiMetadataExtractionInput
  ): Promise<AiMetadataExtractionResult> {
    if (!this.apiKey) {
      throw new AiError(
        503,
        "DeepSeek provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const systemPrompt = `You are an academic metadata extraction expert. Extract the following fields from the provided paper text and respond ONLY with a valid JSON object:
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

    const messages: DeepSeekMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: input.text.slice(0, 16000) },
    ];

    const data = await callDeepSeekApi(
      this.apiKey,
      DEFAULT_MODEL,
      messages,
      this.requestTimeoutMs,
      1024
    );

    const rawText = extractContent(data);

    if (!rawText) {
      throw new Error("DeepSeek returned empty extraction response");
    }

    const cleaned = stripJsonFences(rawText);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(
        `DeepSeek extraction response was not valid JSON: ${cleaned.slice(0, 200)}`
      );
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
      source: "deepseek",
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
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
        "DeepSeek provider not configured",
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

    let userPrompt = `Paper excerpt:\n\n${input.text.slice(0, 24000)}`;
    if (input.instructions) {
      userPrompt += `\n\nAdditional instructions: ${input.instructions}`;
    }
    if (input.focusAreas?.length) {
      userPrompt += `\n\nFocus areas: ${input.focusAreas.join(", ")}`;
    }

    const messages: DeepSeekMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const data = await callDeepSeekApi(
      this.apiKey,
      DEFAULT_MODEL,
      messages,
      this.requestTimeoutMs,
      1200
    );

    const rawText = extractContent(data);

    if (!rawText) {
      throw new Error("DeepSeek returned empty summary response");
    }

    const cleaned = stripJsonFences(rawText);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { summary: cleaned };
    }

    const summaryText =
      typeof parsed.summary === "string" ? parsed.summary.trim() : cleaned;

    if (!summaryText) {
      throw new Error(
        "DeepSeek summary payload did not include a summary field"
      );
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
        "DeepSeek provider not configured",
        "AI_PROVIDER_DISABLED"
      );
    }

    const systemPrompt =
      "You are an expert research assistant. Answer the user's question about the paper based on the provided context. Be precise and cite relevant sections.";

    const messages: DeepSeekMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    const history = input.history ?? [];
    for (const msg of history.slice(-8)) {
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content.slice(0, 800),
      });
    }

    messages.push({
      role: "user",
      content: `Paper context:\n${input.context.slice(0, 20000)}\n\nQuestion: ${input.prompt}`,
    });

    const data = await callDeepSeekApi(
      this.apiKey,
      DEFAULT_MODEL,
      messages,
      this.requestTimeoutMs,
      1500
    );

    const responseText = extractContent(data);

    const suggestions = [
      "Ask about the methodology behind the key findings",
      "Inquire about potential limitations or counter-arguments",
      "Explore practical applications of this research",
    ];

    return {
      provider: this.name,
      message: {
        role: "assistant",
        content:
          responseText || "DeepSeek was unable to generate a response.",
      },
      suggestions,
      rawResponse: data,
    };
  }
}
