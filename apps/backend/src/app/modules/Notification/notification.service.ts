import { Prisma, NotificationType } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import notificationBroadcaster from "./broadcast";

const NotificationService = {
  /**
   * List notifications for a user with pagination and filtering
   */
  async listNotifications(
    userId: string,
    limit: number,
    cursor: string | undefined,
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
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          actor: {
            select: { name: true, image: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    const hasMore = data.length > limit;
    const sliced = hasMore ? data.slice(0, -1) : data;

    // Format the response slightly to match frontend expectations
    const formattedData = sliced.map((n) => ({
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
      meta: {
        total,
        limit,
        nextCursor: hasMore ? formattedData[formattedData.length - 1].id : null,
        hasMore,
      },
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
   * Internal helper to create a notification (called by other services).
   * After persisting, broadcasts the new notification to the user's open SSE
   * connections via the in-process broadcaster.
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

    try {
      notificationBroadcaster.publish(data.userId, {
        type: "notification.created",
        id: notification.id,
        data: {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          read: notification.read,
          starred: notification.starred,
          actionUrl: notification.actionUrl,
          actorId: notification.actorId,
          resourceId: notification.resourceId,
          createdAt: notification.createdAt,
          actor: notification.actor
            ? {
                name:
                  notification.actor.name ||
                  `${notification.actor.firstName || ""} ${
                    notification.actor.lastName || ""
                  }`.trim() ||
                  "Unknown",
                image: notification.actor.image,
              }
            : undefined,
        },
      });
    } catch (err) {
      // Broadcast failures must never break notification creation.
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Notification] SSE broadcast failed:", err);
      }
    }

    return notification;
  },
};

export default NotificationService;
