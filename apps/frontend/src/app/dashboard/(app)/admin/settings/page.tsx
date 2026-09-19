"use client";

/**
 * Admin System Settings Page
 *
 * Persisted platform configuration backed by GET/PATCH /admin/settings.
 * Every save is audited (ActivityLogEntry) by the backend.
 */

import { useEffect, useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  type SystemSettings,
} from "@/redux/api/adminExtendedApi";
import { Bell, Database, Loader2, Settings, Shield } from "lucide-react";

const SESSION_TIMEOUT_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 1440, label: "24 hours" },
  { value: 10080, label: "7 days" },
];

const STORAGE_QUOTA_OPTIONS = [10, 100, 500, 1000];

export default function AdminSettingsPage() {
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateSystemSettingsMutation();

  const [form, setForm] = useState<SystemSettings | null>(null);

  useEffect(() => {
    if (data?.data.settings) {
      setForm(data.data.settings);
    }
  }, [data]);

  const settings = data?.data.settings;
  const updatedAt = data?.data.updatedAt;
  const updatedBy = data?.data.updatedBy;

  const setField = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveSettings = async () => {
    if (!form || !settings) return;

    const patch: Partial<SystemSettings> = {};
    (Object.keys(form) as Array<keyof SystemSettings>).forEach((key) => {
      if (form[key] !== settings[key]) {
        Object.assign(patch, { [key]: form[key] });
      }
    });

    if (Object.keys(patch).length === 0) {
      showSuccessToast("No changes", "Settings are already up to date");
      return;
    }

    try {
      await updateSettings(patch).unwrap();
      showSuccessToast("Settings saved", "Platform settings updated");
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      showErrorToast(
        "Save failed",
        message && typeof message === "string"
          ? message
          : "Could not save platform settings"
      );
    }
  };

  if (isLoading || !form) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-muted-foreground" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="text-right">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Last updated {new Date(updatedAt).toLocaleString()}
              {updatedBy ? ` by ${updatedBy.email}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Manage basic platform configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                type="text"
                value={form.platformName}
                maxLength={100}
                onChange={(e) => setField("platformName", e.target.value)}
                placeholder="ScholarFlow"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={form.supportEmail}
                maxLength={200}
                onChange={(e) => setField("supportEmail", e.target.value)}
                placeholder="support@scholarflow.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and authentication options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Show a platform-wide 2FA requirement notice to users
                </p>
              </div>
              <Checkbox
                checked={form.twoFactorRequired}
                onCheckedChange={(checked) =>
                  setField("twoFactorRequired", checked === true)
                }
                aria-label="Require two-factor authentication"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Recommended auto logout after inactivity
                </p>
              </div>
              <Select
                value={String(form.sessionTimeoutMinutes)}
                onValueChange={(value) =>
                  setField("sessionTimeoutMinutes", Number(value))
                }
              >
                <SelectTrigger className="w-[160px]" aria-label="Session timeout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TIMEOUT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Send email alerts to admins
                </p>
              </div>
              <Checkbox
                checked={form.emailNotificationsEnabled}
                onCheckedChange={(checked) =>
                  setField("emailNotificationsEnabled", checked === true)
                }
                aria-label="Enable email notifications"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">User Registration Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify on new user signups
                </p>
              </div>
              <Checkbox
                checked={form.registrationAlertsEnabled}
                onCheckedChange={(checked) =>
                  setField("registrationAlertsEnabled", checked === true)
                }
                aria-label="Enable registration alerts"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Settings
            </CardTitle>
            <CardDescription>
              Configure database and storage options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">
                  Daily backups are managed by the hosting platform (Prisma
                  Postgres). Restore points are available from the database
                  console.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Storage Quota</p>
                <p className="text-sm text-muted-foreground">
                  Maximum storage per user
                </p>
              </div>
              <Select
                value={String(form.storageQuotaGb)}
                onValueChange={(value) =>
                  setField("storageQuotaGb", Number(value))
                }
              >
                <SelectTrigger className="w-[160px]" aria-label="Storage quota">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_QUOTA_OPTIONS.map((gb) => (
                    <SelectItem key={gb} value={String(gb)}>
                      {gb} GB
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
