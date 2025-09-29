import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { aiService } from "../app/modules/AI/ai.service";
import { paperService } from "../app/modules/papers/paper.service";

// Mock the AI service to capture the context being passed
jest.mock("../app/modules/AI/ai.service");
const mockAiService = aiService as jest.Mocked<typeof aiService>;

describe("Paper Insight Context Integration", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should always include paper context when generating insights", async () => {
    // Mock paper service methods
    const mockPaperRecord = {
      id: "paper-123",
      workspaceId: "workspace-1",
      uploaderId: "user-1",
      workspaceOwnerId: "user-1",
      title: "Test Paper",
      abstract: "This is a test paper about AI",
      metadata: null,
      contentHtml: "<p>Full paper content here</p>",
      updatedAt: new Date(),
    };

    const mockThread = {
      id: "thread-123",
      paperId: "paper-123",
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockMessages = [
      {
        id: "msg-1",
        paperId: "paper-123",
        threadId: "thread-123",
        role: "user" as const,
        content: "Previous question",
        createdAt: new Date(),
        createdById: "user-1",
        metadata: null,
        updatedAt: new Date(),
      },
      {
        id: "msg-2",
        paperId: "paper-123",
        threadId: "thread-123",
        role: "assistant" as const,
        content: "Previous answer",
        createdAt: new Date(),
        createdById: "user-1",
        metadata: null,
        updatedAt: new Date(),
      },
    ];

    const paperServiceSpy = jest.spyOn(paperService, "getSummarySourceText");
    paperServiceSpy.mockResolvedValue({
      source: "chunks",
      text: "This is the extracted paper content that should be included as context.",
      chunkCount: 3,
    });

    const listMessagesSpy = jest.spyOn(paperService, "listInsightMessages");
    listMessagesSpy.mockResolvedValue(mockMessages);

    const generateInsightSpy = mockAiService.generateInsight;
    generateInsightSpy.mockResolvedValue({
      provider: "gemini",
      message: {
        role: "assistant",
        content: "AI response with paper context",
      },
      suggestions: ["Follow-up suggestion"],
      rawResponse: {},
      tokensUsed: 150,
    });

    // Simulate the controller logic with existing conversation history
    const paperId = "paper-123";
    const prompt = "What is the main finding?";

    // Get recent messages (non-empty to simulate existing conversation)
    const recentMessages = await paperService.listInsightMessages(
      mockThread.id,
      1,
      10
    );

    // Always get paper content for context (our fix)
    const source = await paperService.getSummarySourceText(paperId, mockPaperRecord);
    const paperContext = source.text || "";

    // Generate insight with context
    const insightInput = {
      paperId,
      threadId: mockThread.id,
      prompt,
      context: paperContext,
      history: recentMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      workspaceId: mockPaperRecord.workspaceId,
      uploaderId: mockPaperRecord.uploaderId,
    };

    await aiService.generateInsight(insightInput);

    // Verify that getSummarySourceText was called (always gets paper context)
    expect(paperServiceSpy).toHaveBeenCalledWith(paperId, mockPaperRecord);

    // Verify that generateInsight was called with the paper context
    expect(generateInsightSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: "This is the extracted paper content that should be included as context.",
        prompt: "What is the main finding?",
        history: [
          { role: "user", content: "Previous question" },
          { role: "assistant", content: "Previous answer" },
        ],
      })
    );
  });

  it("should include paper context even for first message in conversation", async () => {
    const mockPaperRecord = {
      id: "paper-456",
      workspaceId: "workspace-1",
      uploaderId: "user-1",
      workspaceOwnerId: "user-1",
      title: "New Paper",
      abstract: "Another test paper",
      metadata: null,
      contentHtml: "<p>New paper content</p>",
      updatedAt: new Date(),
    };

    const mockThread = {
      id: "thread-456",
      paperId: "paper-456",
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const paperServiceSpy = jest.spyOn(paperService, "getSummarySourceText");
    paperServiceSpy.mockResolvedValue({
      source: "content",
      text: "New paper extracted content for first message.",
      chunkCount: 0,
    });

    const listMessagesSpy = jest.spyOn(paperService, "listInsightMessages");
    listMessagesSpy.mockResolvedValue([]); // Empty history (first message)

    const generateInsightSpy = mockAiService.generateInsight;
    generateInsightSpy.mockResolvedValue({
      provider: "gemini",
      message: {
        role: "assistant",
        content: "First AI response with paper context",
      },
      suggestions: [],
      rawResponse: {},
      tokensUsed: 120,
    });

    // Simulate first message in conversation
    const paperId = "paper-456";
    const prompt = "Summarize this paper";

    // Get recent messages (empty for first message)
    const recentMessages = await paperService.listInsightMessages(
      mockThread.id,
      1,
      10
    );

    // Always get paper content for context (our fix)
    const source = await paperService.getSummarySourceText(paperId, mockPaperRecord);
    const paperContext = source.text || "";

    const insightInput = {
      paperId,
      threadId: mockThread.id,
      prompt,
      context: paperContext,
      history: recentMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      workspaceId: mockPaperRecord.workspaceId,
      uploaderId: mockPaperRecord.uploaderId,
    };

    await aiService.generateInsight(insightInput);

    // Verify context is included even for first message
    expect(generateInsightSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: "New paper extracted content for first message.",
        prompt: "Summarize this paper",
        history: [], // Empty history for first message
      })
    );
  });
});