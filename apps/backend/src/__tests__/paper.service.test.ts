import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
  $queryRaw: jest.fn<() => Promise<any>>(),
  $executeRaw: jest.fn<() => Promise<any>>(),
};

jest.mock("../app/shared/prisma", () => {
  const actual = jest.requireActual<typeof import("@prisma/client")>("@prisma/client");
  return { __esModule: true, default: mockPrisma, Prisma: actual.Prisma };
});

import { paperService } from "../app/modules/papers/paper.service";

describe("paperService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("returns paper when found", async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ id: "p1", title: "Test", uploaderId: "u1", workspaceId: "w1", abstract: null, metadata: null, source: "upload", doi: null, processingStatus: "PROCESSED", tags: [], language: null, citationCount: 0, createdAt: new Date(), updatedAt: new Date(), previewFileKey: null, previewMimeType: null, originalMimeType: null, file_id: null, storageProvider: null, objectKey: null, contentType: null, sizeBytes: null, originalFilename: null, extractedAt: null }]);
      const result = await paperService.getById("p1");
      expect(result).toBeDefined();
      expect(result!.id).toBe("p1");
      expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it("returns null when not found", async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([]);
      const result = await paperService.getById("missing");
      expect(result).toBeNull();
    });
  });

  describe("softDelete", () => {
    it("calls $executeRaw with correct id", async () => {
      mockPrisma.$executeRaw.mockResolvedValueOnce(undefined);
      await paperService.softDelete("p1");
      expect(mockPrisma.$executeRaw).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateMetadata", () => {
    it("returns null when paper not found", async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([]);
      const result = await paperService.updateMetadata("missing", { title: "New" });
      expect(result).toBeNull();
    });
  });

  describe("countByUser", () => {
    it("returns count for user", async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ count: 5n }]);
      const result = await paperService.countByUser("u1");
      expect(result).toBe(5);
    });
  });

  describe("listByUser", () => {
    it("returns paginated results", async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([]);
      const result = await paperService.listByUser("u1", 10);
      expect(result).toEqual({ items: [], nextCursor: null, hasMore: false });
    });
  });
});
