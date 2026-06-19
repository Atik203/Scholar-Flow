"use client";

/**
 * NotificationSettingsPage
 *
 * Persisted notification preferences. Backed by the
 * useGetNotificationSettingsQuery / useUpdateNotificationSettingsMutation
 * pair. Renders a 9-category × 3-channel grid plus quiet hours + digest.
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Check,
  Mail,
  Moon,
  Save,
  Smartphone,
  Volume2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  type NotificationPreferences,
  type NotificationCategory,
  type CategoryChannelSetting,
} from "@/redux/api/notificationApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const CATEGORIES: Array<{
  id: NotificationCategory;
  label: string;
  description: string;
}> = [
  { id: "PAPERS", label: "Papers & Research", description: "Paper uploads, citations, processing" },
  { id: "DISCUSSIONS", label: "Discussions", description: "Replies, mentions, threads" },
  { id: "COLLECTIONS", label: "Collections", description: "Collection shares and updates" },
  { id: "WORKSPACE", label: "Workspace", description: "Workspace-level activity" },
  { id: "TEAM", label: "Team", description: "Team invitations and changes" },
  { id: "BILLING", label: "Billing", description: "Subscription, invoices, payment failures" },
  { id: "SECURITY", label: "Security", description: "Logins, password changes, 2FA" },
  { id: "ACHIEVEMENT", label: "Achievements", description: "Streaks, milestones, badges" },
  { id: "SYSTEM", label: "System", description: "Maintenance, updates, changelog" },
];

const CHANNELS: Array<{
  key: keyof CategoryChannelSetting;
  label: string;
  icon: typeof Bell;
}> = [
  { key: "inApp", label: "In-app", icon: Bell },
  { key: "email", label: "Email", icon: Mail },
  { key: "push", label: "Push", icon: Smartphone },
];

export default function NotificationSettingsPage() {
  const { data, isLoading } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateNotificationSettingsMutation();
  const [local, setLocal] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    if (data?.data) setLocal(data.data);
  }, [data]);

  if (isLoading || !local) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const updateCategory = (
    category: NotificationCategory,
    channel: keyof CategoryChannelSetting,
    value: boolean
  ) => {
    setLocal((prev) =>
      prev
        ? {
            ...prev,
            categories: {
              ...prev.categories,
              [category]: {
                ...prev.categories[category],
                [channel]: value,
              },
            },
          }
        : prev
    );
  };

  const handleSave = async () => {
    try {
      await updateSettings(local).unwrap();
      showSuccessToast("Settings saved", "Your notification preferences have been updated.");
    } catch {
      showErrorToast("Save failed", "Could not save notification settings.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Choose how and when you receive alerts.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Global toggles</CardTitle>
              <CardDescription>
                Quickly enable or disable all channels
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Mute all notifications</Label>
              <p className="text-sm text-muted-foreground">
                Pause every alert temporarily
              </p>
            </div>
            <Switch
              checked={local.muteAll}
              onCheckedChange={(c) =>
                setLocal((p) => (p ? { ...p, muteAll: c } : p))
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(["inApp", "email", "push"] as const).map((ch) => (
              <div
                key={ch}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <Label className="text-sm">
                    {ch === "inApp" ? "In-app" : ch === "email" ? "Email" : "Push"}
                  </Label>
                </div>
                <Switch
                  checked={local.channels[ch]}
                  onCheckedChange={(c) =>
                    setLocal((p) =>
                      p
                        ? { ...p, channels: { ...p.channels, [ch]: c } }
                        : p
                    )
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Category preferences</CardTitle>
              <CardDescription>
                Pick which channels fire for each event type
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium py-3 pr-4">Category</th>
                  {CHANNELS.map((ch) => (
                    <th
                      key={ch.key}
                      className="text-center font-medium py-3 px-2"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <ch.icon className="w-4 h-4" />
                        {ch.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {cat.description}
                      </div>
                    </td>
                    {CHANNELS.map((ch) => (
                      <td key={ch.key} className="text-center py-3 px-2">
                        <Switch
                          checked={local.categories[cat.id]?.[ch.key] ?? false}
                          onCheckedChange={(c) =>
                            updateCategory(cat.id, ch.key, c)
                          }
                          disabled={local.muteAll}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Quiet hours</CardTitle>
              <CardDescription>
                Mute notifications during specific hours
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Enable quiet hours</Label>
            <Switch
              checked={local.quietHours.enabled}
              onCheckedChange={(c) =>
                setLocal((p) =>
                  p
                    ? { ...p, quietHours: { ...p.quietHours, enabled: c } }
                    : p
                )
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">From</Label>
              <input
                type="time"
                value={local.quietHours.startTime}
                onChange={(e) =>
                  setLocal((p) =>
                    p
                      ? {
                          ...p,
                          quietHours: {
                            ...p.quietHours,
                            startTime: e.target.value,
                          },
                        }
                      : p
                  )
                }
                className="mt-1 w-full px-3 py-2 border rounded-md bg-background"
                disabled={!local.quietHours.enabled}
              />
            </div>
            <div>
              <Label className="text-sm">To</Label>
              <input
                type="time"
                value={local.quietHours.endTime}
                onChange={(e) =>
                  setLocal((p) =>
                    p
                      ? {
                          ...p,
                          quietHours: {
                            ...p.quietHours,
                            endTime: e.target.value,
                          },
                        }
                      : p
                  )
                }
                className="mt-1 w-full px-3 py-2 border rounded-md bg-background"
                disabled={!local.quietHours.enabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-300">
          Changes are saved when you click <strong>Save changes</strong>. Push
          notifications require the mobile app or a registered browser
          subscription.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-4 flex justify-end"
      >
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2 shadow-lg">
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save all changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
