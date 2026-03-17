import { Prisma, NotificationType } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

const NotificationService = {
  /**
   * List notifications for a user with pagination and filtering
   */
  async listNotifications(
    userId: string,
    limit: number,
    skip: number,
    query: {
      type?: string;
      read?: string;
      starred?: string;
    }
  ) {
    const where: Prisma.NotificationWhereInput = { userId };

    if (query.type && query.type !== "all") {
      where.type = query.type as NotificationType;
    }

    if (query.read === "unread") {
      where.read = false;
    } else if (query.read === "read") {
      where.read = true;
    }

    if (query.starred === "true") {
      where.starred = true;
    } else if (query.starred === "false") {
      where.starred = false;
    }

    const [total, data] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: { name: true, image: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    // Format the response slightly to match frontend expectations
    const formattedData = data.map((n) => ({
      ...n,
      actor: n.actor
        ? {
            name:
              n.actor.name ||
              `${n.actor.firstName || ""} ${n.actor.lastName || ""}`.trim() ||
              "Unknown",
            image: n.actor.image,
          }
        : undefined,
    }));

    return {
      meta: { total, skip, limit },
      result: formattedData,
    };
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new ApiError(404, "Notification not found");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },

  /**
   * Toggle starred status
   */
  async toggleStarred(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new ApiError(404, "Notification not found");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { starred: !notification.starred },
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  /**
   * Delete a single notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new ApiError(404, "Notification not found");
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  },

  /**
   * Delete multiple notifications
   */
  async deleteBulk(userId: string, notificationIds: string[]) {
    await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
    });

    return { success: true };
  },

  /**
   * Internal helper to create a notification (called by other services)
   */
  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    actorId?: string;
    resourceId?: string;
  }) {
    const notification = await prisma.notification.create({
      data,
      include: {
        actor: {
          select: { name: true, image: true, firstName: true, lastName: true },
        },
      },
    });

    // TODO: Emit SSE event to the specific userId

    return notification;
  },
};

export default NotificationService;
