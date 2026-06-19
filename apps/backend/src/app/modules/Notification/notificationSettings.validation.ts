import { z } from "zod";

const categorySchema = z.enum([
  "PAPERS",
  "DISCUSSIONS",
  "COLLECTIONS",
  "WORKSPACE",
  "TEAM",
  "BILLING",
  "SECURITY",
  "ACHIEVEMENT",
  "SYSTEM",
]);

const channelSettingSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  inApp: z.boolean(),
});

export const notificationSettingsUpdateSchema = z
  .object({
    channels: z
      .object({
        inApp: z.boolean(),
        email: z.boolean(),
        push: z.boolean(),
      })
      .optional(),
    categories: z
      .record(categorySchema, channelSettingSchema.partial())
      .optional(),
    quietHours: z
      .object({
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
        days: z.array(z.string()),
      })
      .optional(),
    digestFrequency: z.enum(["instant", "daily", "weekly"]).optional(),
    muteAll: z.boolean().optional(),
  })
  .strict();
