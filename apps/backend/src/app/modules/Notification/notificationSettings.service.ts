/**
 * Notification Settings Service
 *
 * Persists per-user notification preferences (channel-by-event toggles) in
 * UserPreference.notificationPreferences. Falls back to a sensible default
 * shape if the field is missing.
 */

import prisma from "../../shared/prisma";

export type NotificationCategory =
  | "PAPERS"
  | "DISCUSSIONS"
  | "COLLECTIONS"
  | "WORKSPACE"
  | "TEAM"
  | "BILLING"
  | "SECURITY"
  | "ACHIEVEMENT"
  | "SYSTEM";

export type NotificationChannel = "inApp" | "email" | "push";

export interface CategoryChannelSetting {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export type NotificationPreferences = {
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  categories: Record<NotificationCategory, CategoryChannelSetting>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  digestFrequency: "instant" | "daily" | "weekly";
  muteAll: boolean;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  channels: { inApp: true, email: true, push: false },
  categories: {
    PAPERS: { email: true, push: true, inApp: true },
    DISCUSSIONS: { email: true, push: true, inApp: true },
    COLLECTIONS: { email: true, push: false, inApp: true },
    WORKSPACE: { email: true, push: true, inApp: true },
    TEAM: { email: true, push: true, inApp: true },
    BILLING: { email: true, push: false, inApp: true },
    SECURITY: { email: true, push: true, inApp: true },
    ACHIEVEMENT: { email: false, push: false, inApp: true },
    SYSTEM: { email: true, push: false, inApp: true },
  },
  quietHours: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
    days: [],
  },
  digestFrequency: "instant",
  muteAll: false,
};

export const notificationSettingsService = {
  /**
   * Read notification preferences for a user. Creates a default
   * UserPreference row if one does not exist.
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const pref = await prisma.userPreference.findUnique({
      where: { userId },
      select: { notificationPreferences: true },
    });

    if (!pref) {
      // Create a fresh row with defaults; do not block the response.
      await prisma.userPreference.create({
        data: {
          userId,
          notificationPreferences: DEFAULT_PREFERENCES as unknown as object,
        },
        select: { id: true },
      });
      return DEFAULT_PREFERENCES;
    }

    if (!pref.notificationPreferences) {
      return DEFAULT_PREFERENCES;
    }

    // Merge with defaults so newly added fields are filled in.
    const stored = pref.notificationPreferences as Partial<NotificationPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...stored,
      channels: { ...DEFAULT_PREFERENCES.channels, ...(stored.channels ?? {}) },
      categories: {
        ...DEFAULT_PREFERENCES.categories,
        ...(stored.categories ?? {}),
      } as NotificationPreferences["categories"],
      quietHours: { ...DEFAULT_PREFERENCES.quietHours, ...(stored.quietHours ?? {}) },
    };
  },

  /**
   * Persist user notification preferences (partial update).
   * Accepts a loose shape (Zod has already validated the structure) and
   * deep-merges it on top of the existing preferences.
   */
  async updatePreferences(
    userId: string,
    patch: Partial<NotificationPreferences> & {
      categories?: Record<
        string,
        Partial<CategoryChannelSetting> | undefined
      >;
    }
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);

    const mergedCategories: NotificationPreferences["categories"] = {
      ...current.categories,
    };
    if (patch.categories) {
      for (const [key, value] of Object.entries(patch.categories)) {
        if (!value) continue;
        const existing =
          mergedCategories[key as keyof typeof mergedCategories];
        if (existing) {
          (mergedCategories as Record<string, CategoryChannelSetting>)[key] = {
            ...existing,
            ...value,
          };
        }
      }
    }

    const merged: NotificationPreferences = {
      ...current,
      ...patch,
      channels: { ...current.channels, ...(patch.channels ?? {}) },
      categories: mergedCategories,
      quietHours: { ...current.quietHours, ...(patch.quietHours ?? {}) },
    };

    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        notificationPreferences: merged as unknown as object,
      },
      update: {
        notificationPreferences: merged as unknown as object,
      },
      select: { id: true },
    });

    return merged;
  },
};

export default notificationSettingsService;
export { DEFAULT_PREFERENCES };
