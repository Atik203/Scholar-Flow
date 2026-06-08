"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { showSuccessToast } from "@/components/providers/ToastProvider";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    email: {
      mentions: true,
      comments: true,
      invites: true,
      marketing: false,
    },
    push: {
      mentions: true,
      comments: false,
      invites: true,
      system: true,
    },
    inApp: {
      all: true,
      sound: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to save preferences
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    showSuccessToast("Your notification preferences have been updated.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notifications">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">Manage how and when you receive alerts.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* In-App Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">In-App Notifications</CardTitle>
              <CardDescription>Alerts shown inside ScholarFlow</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Global Push Items</Label>
                <p className="text-sm text-muted-foreground">Receive any notifications in the app</p>
              </div>
              <Switch
                checked={settings.inApp.all}
                onCheckedChange={(c) => setSettings((s) => ({ ...s, inApp: { ...s.inApp, all: c } }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Play sound</Label>
                <p className="text-sm text-muted-foreground">Hear a gentle chime for mentions</p>
              </div>
              <Switch
                checked={settings.inApp.sound}
                disabled={!settings.inApp.all}
                onCheckedChange={(c) => setSettings((s) => ({ ...s, inApp: { ...s.inApp, sound: c } }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>Alerts sent to your registered inbox</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Mentions & Replies</Label>
                <p className="text-sm text-muted-foreground">When someone @mentions you or replies</p>
              </div>
              <Switch
                checked={settings.email.mentions}
                onCheckedChange={(c) => setSettings((s) => ({ ...s, email: { ...s.email, mentions: c } }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Workspace Invites</Label>
                <p className="text-sm text-muted-foreground">When you are invited to a new workspace for collaboration</p>
              </div>
              <Switch
                checked={settings.email.invites}
                onCheckedChange={(c) => setSettings((s) => ({ ...s, email: { ...s.email, invites: c } }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">News & Marketing</Label>
                <p className="text-sm text-muted-foreground">Feature announcements and ScholarFlow news</p>
              </div>
              <Switch
                checked={settings.email.marketing}
                onCheckedChange={(c) => setSettings((s) => ({ ...s, email: { ...s.email, marketing: c } }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" asChild>
            <Link href="/dashboard/notifications">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
