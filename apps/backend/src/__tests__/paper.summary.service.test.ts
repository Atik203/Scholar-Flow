import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { paperService } from "../app/modules/papers/paper.service";
import prisma from "../app/shared/prisma";

describe("paperService summary helpers", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns chunk-based summary text when chunks are available", async () => {
    const chunkSpy = jest
      .spyOn(prisma, "$queryRaw")
      .mockResolvedValueOnce([
        { content: "First chunk." },
        { content: "Second chunk." },
      ]);

    const record = {
      id: "paper-1",
      workspaceId: "workspace-1",
      uploaderId: "user-1",
      workspaceOwnerId: "user-2",
      title: "Sample Paper",
      abstract: "",
      metadata: null,
      contentHtml: "<p>HTML fallback</p>",
      updatedAt: new Date(),
    } as any;

    const result = await paperService.getSummarySourceText("paper-1", record);

    expect(result.source).toBe("chunks");
    expect(result.text).toContain("First chunk.");
    expect(result.chunkCount).toBe(2);
    expect(chunkSpy).toHaveBeenCalledTimes(1);
  });

  it("falls back to HTML content when no chunks exist", async () => {
    const chunkSpy = jest.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([]);

    const record = {
      id: "paper-2",
      workspaceId: "workspace-1",
      uploaderId: "user-1",
      workspaceOwnerId: "user-2",
      title: "Sample Paper",
      abstract: "",
      metadata: null,
      contentHtml:
        "<article>Primary <strong>content</strong> section</article>",
      updatedAt: new Date(),
    } as any;

    const result = await paperService.getSummarySourceText("paper-2", record);

    expect(result.source).toBe("content");
    expect(result.text).toContain("Primary content section");
    expect(result.chunkCount).toBe(0);
    expect(chunkSpy).toHaveBeenCalledTimes(1);
  });

  it("uses metadata abstract when no chunk or HTML content exists", async () => {
    const chunkSpy = jest.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([]);

    const record = {
      id: "paper-3",
      workspaceId: "workspace-1",
      uploaderId: "user-1",
      workspaceOwnerId: "user-2",
      title: "Sample Paper",
      abstract: "",
      metadata: { abstract: "Metadata abstract fallback" },
      contentHtml: "",
      updatedAt: new Date(),
    } as any;

    const result = await paperService.getSummarySourceText("paper-3", record);

    expect(result.source).toBe("metadata");
    expect(result.text).toContain("Metadata abstract fallback");
    expect(result.chunkCount).toBe(0);
    expect(chunkSpy).toHaveBeenCalledTimes(1);
  });

  it("parses stored summaries stored as JSON", async () => {
    const storedPayload = {
      summary: "Stored summary text",
      highlights: ["Key point"],
      followUpQuestions: ["What next?"],
      tokensUsed: 123,
      provider: "openai",
    };

    const summarySpy = jest.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([
      {
        summary: JSON.stringify(storedPayload),
        model: "gpt-4o-mini",
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ]);

    const result = await paperService.findStoredSummary("paper-4", "hash");

    expect(result).not.toBeNull();
    expect(result?.summary).toBe("Stored summary text");
    expect(result?.highlights).toEqual(["Key point"]);
    expect(result?.model).toBe("gpt-4o-mini");
    expect(summarySpy).toHaveBeenCalledTimes(1);
  });

  it("treats plain text stored summaries correctly", async () => {
    const summarySpy = jest.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([
      {
        summary: "Legacy summary",
        model: "heuristic",
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ]);

    const result = await paperService.findStoredSummary("paper-5", "hash");

    expect(result).not.toBeNull();
    expect(result?.summary).toBe("Legacy summary");
    expect(result?.model).toBe("heuristic");
    expect(result?.highlights).toBeUndefined();
    expect(summarySpy).toHaveBeenCalledTimes(1);
  });
});
