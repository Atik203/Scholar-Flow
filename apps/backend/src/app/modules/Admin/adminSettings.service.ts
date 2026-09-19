/**
 * Admin System Settings Service
 *
 * Platform-level key/value settings persisted in SystemSetting. Reads merge
 * stored rows over a code-defined default set so new keys ship with sane
 * values. Writes are validated by Zod and audited to ActivityLogEntry.
 */

import prisma from "../../shared/prisma";
import { ActivityLogService } from "../../services/activityLog.service";
import { z } from "zod";

export const systemSettingsSchema = z.object({
  platformName: z.string().trim().min(1).max(100),
  supportEmail: z.string().trim().email().max(200),
  sessionTimeoutMinutes: z.number().int().min(15).max(10080),
  emailNotificationsEnabled: z.boolean(),
  registrationAlertsEnabled: z.boolean(),
  storageQuotaGb: z.number().int().min(1).max(100000),
  twoFactorRequired: z.boolean(),
});

export type SystemSettings = z.infer<typeof systemSettingsSchema>;

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  platformName: "ScholarFlow",
  supportEmail: "support@scholarflow.com",
  sessionTimeoutMinutes: 1440,
  emailNotificationsEnabled: true,
  registrationAlertsEnabled: true,
  storageQuotaGb: 100,
  twoFactorRequired: false,
};

const SETTING_KEY = "platform";

export const adminSettingsService = {
  async getSettings(): Promise<{
    settings: SystemSettings;
    updatedAt: Date | null;
    updatedBy: { id: string; name: string | null; email: string } | null;
  }> {
    const row = await prisma.systemSetting.findUnique({
      where: { key: SETTING_KEY },
      include: {
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    const stored =
      row && typeof row.value === "object" && row.value !== null
        ? (row.value as Partial<SystemSettings>)
        : {};

    const merged = systemSettingsSchema.safeParse({
      ...DEFAULT_SYSTEM_SETTINGS,
      ...stored,
    });

    return {
      settings: merged.success ? merged.data : DEFAULT_SYSTEM_SETTINGS,
      updatedAt: row?.updatedAt ?? null,
      updatedBy: row?.updatedBy ?? null,
    };
  },

  async updateSettings(
    patch: Partial<SystemSettings>,
    actorId: string
  ): Promise<{
    settings: SystemSettings;
    updatedAt: Date;
    updatedBy: { id: string; name: string | null; email: string } | null;
  }> {
    const current = await this.getSettings();
    const next = systemSettingsSchema.parse({
      ...current.settings,
      ...patch,
    });

    const changedKeys = Object.keys(patch).filter(
      (key) =>
        current.settings[key as keyof SystemSettings] !==
        next[key as keyof SystemSettings]
    );

    const row = await prisma.systemSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        value: next,
        updatedById: actorId,
      },
      update: {
        value: next,
        updatedById: actorId,
      },
      include: {
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (changedKeys.length > 0) {
      await ActivityLogService.logActivity(
        actorId,
        null,
        "system-setting",
        SETTING_KEY,
        "updated",
        { changedKeys },
        { settings: next },
        "INFO"
      );
    }

    return {
      settings: next,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy,
    };
  },
};
