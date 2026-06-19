import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
  notification: {
    count: jest.fn<() => Promise<number>>(),
    findMany: jest.fn<() => Promise<any[]>>(),
    findUnique: jest.fn<() => Promise<any>>(),
    create: jest.fn<() => Promise<any>>(),
    update: jest.fn<() => Promise<any>>(),
    delete: jest.fn<() => Promise<any>>(),
    deleteMany: jest.fn<() => Promise<any>>(),
    updateMany: jest.fn<() => Promise<any>>(),
  },
};

jest.mock("../app/shared/prisma", () => ({ __esModule: true, default: mockPrisma }));

jest.mock("../app/modules/Notification/broadcast", () => ({
  notificationBroadcaster: { publish: jest.fn() },
}));

import { notificationService } from "../app/modules/Notification/notification.service";

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listNotifications", () => {
    it("returns paginated notifications with meta", async () => {
      mockPrisma.notification.count.mockResolvedValueOnce(3);
      mockPrisma.notification.findMany.mockResolvedValueOnce([{ id: "n1", actor: null }]);
      const result = await notificationService.listNotifications("u1", 10, undefined, {});
      expect(result.meta.total).toBe(3);
      expect(result.result).toHaveLength(1);
    });
  });

  describe("createNotification", () => {
    it("creates notification with correct data", async () => {
      const created = { id: "n2", userId: "u1", type: "SHARE", title: "Shared", message: "Paper shared", read: false, starred: false, actionUrl: null, actorId: null, resourceId: null, createdAt: new Date(), actor: null };
      mockPrisma.notification.create.mockResolvedValueOnce(created);
      const result = await notificationService.createNotification({ userId: "u1", type: "SHARE", title: "Shared", message: "Paper shared" });
      expect(result.id).toBe("n2");
      expect(mockPrisma.notification.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("markAsRead", () => {
    it("marks notification as read", async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({ id: "n1", userId: "u1", read: false });
      mockPrisma.notification.update.mockResolvedValueOnce({ id: "n1", read: true });
      const result = await notificationService.markAsRead("u1", "n1");
      expect(result).toBeDefined();
      expect(mockPrisma.notification.update).toHaveBeenCalledWith(expect.objectContaining({ data: { read: true } }));
    });

    it("throws 404 when notification not found", async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce(null);
      await expect(notificationService.markAsRead("u1", "missing")).rejects.toThrow("Notification not found");
    });
  });

  describe("toggleStarred", () => {
    it("toggles starred to true", async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({ id: "n1", userId: "u1", starred: false });
      mockPrisma.notification.update.mockResolvedValueOnce({ id: "n1", starred: true });
      const result = await notificationService.toggleStarred("u1", "n1");
      expect(result).toBeDefined();
    });
  });

  describe("deleteNotification", () => {
    it("deletes and returns success", async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({ id: "n1", userId: "u1" });
      mockPrisma.notification.delete.mockResolvedValueOnce({});
      const result = await notificationService.deleteNotification("u1", "n1");
      expect(result).toEqual({ success: true });
    });
  });
});
