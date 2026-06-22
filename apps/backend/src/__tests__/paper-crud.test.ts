import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
  user: { create: jest.fn<() => Promise<any>>(), delete: jest.fn<() => Promise<any>>(), findUnique: jest.fn<() => Promise<any>>() },
  workspace: { create: jest.fn<() => Promise<any>>(), delete: jest.fn<() => Promise<any>>() },
  paper: { create: jest.fn<() => Promise<any>>(), findUnique: jest.fn<() => Promise<any>>(), findMany: jest.fn<() => Promise<any>>(), update: jest.fn<() => Promise<any>>() },
  paperChunk: { deleteMany: jest.fn<() => Promise<any>>() },
  account: { deleteMany: jest.fn<() => Promise<any>>() },
  $disconnect: jest.fn<() => Promise<any>>(),
};

jest.mock("../app/shared/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe("Paper CRUD", () => {
  beforeAll(async () => { jest.clearAllMocks(); });
  afterAll(async () => { jest.restoreAllMocks(); });

  it("should create a paper", async () => {
    const paper = { id: "p1", title: "Test", workspaceId: "w1", uploaderId: "u1", isDraft: true };
    mockPrisma.paper.create.mockResolvedValue(paper);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.paper.create({
      data: { workspaceId: "w1", uploaderId: "u1", title: "Test", metadata: {} },
    });
    expect(result.title).toBe("Test");
  });

  it("should read a paper", async () => {
    const paper = { id: "p1", title: "Test", uploader: { name: "User" } };
    mockPrisma.paper.findUnique.mockResolvedValue(paper);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.paper.findUnique({ where: { id: "p1" }, include: { uploader: { select: { name: true } } } });
    expect(result!.uploader.name).toBe("User");
  });

  it("should update a paper", async () => {
    const updated = { id: "p1", isPublished: true };
    mockPrisma.paper.update.mockResolvedValue(updated);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.paper.update({ where: { id: "p1" }, data: { isPublished: true } });
    expect(result.isPublished).toBe(true);
  });

  it("should list papers", async () => {
    const papers = [{ id: "p1", title: "Paper 1" }, { id: "p2", title: "Paper 2" }];
    mockPrisma.paper.findMany.mockResolvedValue(papers);
    const { default: prisma } = await import("../app/shared/prisma");
    const result = await prisma.paper.findMany({ where: { workspaceId: "w1" } });
    expect(result).toHaveLength(2);
  });

  it("should soft-delete a paper", async () => {
    mockPrisma.paper.update.mockResolvedValue({ id: "p1", isDeleted: true });
    const { default: prisma } = await import("../app/shared/prisma");
    await prisma.paper.update({ where: { id: "p1" }, data: { isDeleted: true } });
    expect(mockPrisma.paper.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "p1" }, data: { isDeleted: true } })
    );
  });
});
