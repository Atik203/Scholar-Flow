import { z } from "zod";

export const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional(),
  read: z.string().optional(),
  starred: z.string().optional(),
});

export const notificationIdSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    "MENTION",
    "COMMENT",
    "SHARE",
    "INVITE",
    "PAPER",
    "COLLECTION",
    "SYSTEM",
    "ACHIEVEMENT",
  ]),
  title: z.string(),
  message: z.string(),
  actionUrl: z.string().optional(),
  actorId: z.string().uuid().optional(),
  resourceId: z.string().optional(),
});
