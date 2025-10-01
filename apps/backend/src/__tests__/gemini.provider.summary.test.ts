import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { AiSummaryRequest } from "../app/modules/AI/ai.types";
import { GeminiProvider } from "../app/modules/AI/providers/gemini.provider";

class TestableGeminiProvider extends GeminiProvider {
  public async generate(input: AiSummaryRequest) {
    return super.performSummary(input);
  }
}

describe("GeminiProvider.performSummary", () => {
  const apiKey = "test-api-key";
  const timeoutMs = 5000;
  let provider: TestableGeminiProvider;
  let fetchMock: jest.MockedFunction<typeof fetch>;
  const originalFetch = global.fetch;

  beforeEach(() => {
    provider = new TestableGeminiProvider(apiKey, timeoutMs);
    fetchMock = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    (global as any).fetch = fetchMock;
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
    jest.clearAllMocks();
  });

  const buildRequest = (
    overrides: Partial<AiSummaryRequest> = {}
  ): AiSummaryRequest => ({
    paperId: "paper-123",
    text: "Section 1 discusses methodology. Section 2 outlines findings.",
    wordLimit: 200,
    ...overrides,
  });

  it("returns structured summary data when JSON payload is provided", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '{"summary":"Clear summary","highlights":["Point A"],"followUpQuestions":["Next step?"],"tokensUsed":321}',
                  },
                ],
              },
            },
          ],
          usageMetadata: { totalTokenCount: 321 },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const result = await provider.generate(buildRequest());

    expect(result.provider).toBe("gemini");
    expect(result.summary).toBe("Clear summary");
    expect(result.highlights).toEqual(["Point A"]);
    expect(result.followUpQuestions).toEqual(["Next step?"]);
    expect(result.tokensUsed).toBe(321);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, fetchOptions] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse((fetchOptions?.body as string) ?? "{}");
    expect(payload.contents[0].parts[0].text).toContain(
      "Section 1 discusses methodology"
    );
  });

  it("strips code fences and parses JSON content", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '```json\n{"summary":"Fenced summary","highlights":["Key insight"],"followUpQuestions":["What else?"]}\n```',
                  },
                ],
              },
            },
          ],
          usageMetadata: { totalTokenCount: 88 },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const result = await provider.generate(buildRequest());

    expect(result.summary).toBe("Fenced summary");
    expect(result.highlights).toEqual(["Key insight"]);
    expect(result.followUpQuestions).toEqual(["What else?"]);
    expect(result.tokensUsed).toBe(88);
  });

  it("falls back to plain text when JSON parsing fails", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: "Plain text summary without JSON structure.",
                  },
                ],
              },
            },
          ],
          usageMetadata: { totalTokenCount: null },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const result = await provider.generate(buildRequest());

    expect(result.summary).toBe("Plain text summary without JSON structure.");
    expect(result.highlights).toBeUndefined();
    expect(result.followUpQuestions).toBeUndefined();
    expect(result.tokensUsed).toBeUndefined();
  });
});
