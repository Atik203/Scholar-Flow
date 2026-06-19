"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Activity, Save, Loader2, ArrowLeft, Globe, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const privacySchema = z.object({
  profileVisibility: z.enum(["public", "private", "team"]),
  showActivity: z.boolean(),
  allowDataSharing: z.boolean(),
  showInDiscover: z.boolean(),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

const visibilityItems = [
  { value: "public", label: "Public", desc: "Anyone can view", icon: Globe },
  { value: "private", label: "Private", desc: "Only you", icon: EyeOff },
  { value: "team", label: "Team", desc: "Workspace members only", icon: Users },
];

export default function PrivacySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: { profileVisibility: "public", showActivity: true, allowDataSharing: false, showInDiscover: true },
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/privacy");
      const data = await res.json();
      form.reset({ profileVisibility: data.profileVisibility ?? "public", showActivity: data.showActivity ?? true, allowDataSharing: data.allowDataSharing ?? false, showInDiscover: data.showInDiscover ?? true });
    } catch {
      showErrorToast("Failed to load privacy settings");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const onSubmit = useCallback(async (values: PrivacyFormValues) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/privacy", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) throw new Error((await res.json()).message ?? "Unknown error");
      showSuccessToast("Privacy settings saved");
    } catch (e: unknown) {
      showErrorToast("Failed to save settings", (e as Error).message);
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/security" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><EyeOff className="h-7 w-7 text-primary" />Privacy Settings</h1>
      </div>
      <p className="text-sm text-muted-foreground">Control how your profile and activity are visible to others on Scholar-Flow.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Visibility</CardTitle>
              <CardDescription>Choose who can see your profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-[280px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {visibilityItems.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="h-4 w-4" />
                              <div><p className="font-medium text-sm">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity & Data</CardTitle>
              <CardDescription>Manage what activity is visible and how your data is used.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="showActivity"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Show Activity Feed</FormLabel>
                      <FormDescription>Let others see your recent actions like uploads and collections.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowDataSharing"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Data Sharing</FormLabel>
                      <FormDescription>Share anonymized usage data to help improve Scholar-Flow.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showInDiscover"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Show in Discover</FormLabel>
                      <FormDescription>Allow your profile to appear in the Discover section.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
