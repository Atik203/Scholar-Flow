"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER_ROLES, hasPermission } from "@/lib/auth/roles";
import { handleSignOut } from "@/lib/auth/signout";
import {
  useDeleteAccountMutation,
  useGetUserAnalyticsQuery,
} from "@/redux/api/userApi";
import { useAuth } from "@/redux/auth/useAuth";
import {
  Bell,
  Database,
  Eye,
  Globe,
  Loader2,
  Lock,
  Monitor,
  Moon,
  Palette,
  Settings as SettingsIcon,
  Shield,
  Sun,
  Trash2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardSettingsPage() {
  const { session } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const { data: analyticsData } = useGetUserAnalyticsQuery();

  const [notifications, setNotifications] = useState({
    email: true, push: false, newPapers: true, collaborations: true, comments: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true, researchVisible: true, collectionsPublic: false,
  });

  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false, userRegistration: true, dataRetention: "365",
    maxFileSize: "100", allowGuestAccess: false,
  });

  const user = session?.user;
  const userRole = user?.role || USER_ROLES.RESEARCHER;
  const userPlan = analyticsData?.data?.plan || "FREE";

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    showSuccessToast("Notification Settings", "Your notification preferences have been updated");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
    showSuccessToast("Privacy Settings", "Your privacy settings have been updated");
  };

  const handleAdminChange = (key: string, value: boolean | string) => {
    setAdminSettings((prev) => ({ ...prev, [key]: value }));
    showSuccessToast("Admin Settings", "System settings have been updated");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ confirmDelete: true }).unwrap();
      showSuccessToast("Account Deleted", "Your account has been successfully deleted. You will be logged out.");
      await handleSignOut("/");
    } catch (error: any) {
      showErrorToast("Delete Failed", error?.data?.message || "Failed to delete account. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and application settings
            </p>
          </div>
          <RoleBadge role={userRole} size="lg" />
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className={`grid w-full ${hasPermission(userRole, "MANAGE_USERS") ? "grid-cols-6" : "grid-cols-5"}`}>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            {hasPermission(userRole, "MANAGE_USERS") && (
              <TabsTrigger value="admin" className="text-orange-600 dark:text-orange-400">Admin</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Configure your general application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" value="English (US)" readOnly className="bg-muted" />
                  <p className="text-sm text-muted-foreground">More languages coming soon</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value="UTC" readOnly className="bg-muted" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save drafts</Label>
                    <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Smart suggestions</Label>
                    <p className="text-sm text-muted-foreground">Get AI-powered research suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "email", label: "Email notifications", desc: "Receive notifications via email" },
                  { key: "push", label: "Push notifications", desc: "Get notified in your browser" },
                  { key: "newPapers", label: "New papers in collections", desc: "When papers are added to your collections" },
                  { key: "collaborations", label: "Collaboration invites", desc: "When someone invites you to collaborate" },
                  { key: "comments", label: "Comments and mentions", desc: "When someone comments or mentions you" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{label}</Label>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(v) => handleNotificationChange(key, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Privacy & Security</CardTitle>
                <CardDescription>Control your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "profileVisible", icon: Eye, label: "Public profile", desc: "Make your profile visible to other researchers" },
                  { key: "researchVisible", icon: Database, label: "Research visibility", desc: "Show your research interests publicly" },
                  { key: "collectionsPublic", icon: Globe, label: "Public collections", desc: "Make your collections discoverable" },
                ].map(({ key, icon: Icon, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div><Label>{label}</Label><p className="text-sm text-muted-foreground">{desc}</p></div>
                    </div>
                    <Switch
                      checked={privacy[key as keyof typeof privacy]}
                      onCheckedChange={(v) => handlePrivacyChange(key, v)}
                    />
                  </div>
                ))}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Data & Security</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <div><Label>Two-factor authentication</Label><p className="text-sm text-muted-foreground">Add an extra layer of security</p></div>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <div><Label>Download your data</Label><p className="text-sm text-muted-foreground">Export all your research data</p></div>
                    </div>
                    <Button variant="outline" size="sm">Request Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Appearance</CardTitle>
                <CardDescription>Customize how ScholarFlow looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className="flex items-center gap-2 h-auto p-4">
                      <Sun className="h-4 w-4" /><span>Light</span>
                    </Button>
                    <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className="flex items-center gap-2 h-auto p-4">
                      <Moon className="h-4 w-4" /><span>Dark</span>
                    </Button>
                    <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")} className="flex items-center gap-2 h-auto p-4">
                      <Monitor className="h-4 w-4" /><span>System</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Font size</Label>
                  <Input value="Medium" readOnly className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Font size customization coming soon</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Compact mode</Label><p className="text-sm text-muted-foreground">Show more content in less space</p></div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Animations</Label><p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p></div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details and subscription information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p>{session?.user?.email || "—"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={userPlan === "PRO" ? "default" : "secondary"} className="font-semibold">{userPlan}</Badge>
                        {userPlan === "FREE" && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => router.push("/pricing")}>Upgrade to PRO</Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account ID</Label>
                    <p className="font-mono text-sm">{session?.user?.id || "—"}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 className="h-5 w-5" />Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-600 dark:text-red-400">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                          {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : <><Trash2 className="h-4 w-4 mr-2" />Delete Account</>}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 dark:text-red-400">Delete Account</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-2">
                              <div>Are you absolutely sure you want to delete your account? This action cannot be undone.</div>
                              <div className="font-medium text-red-600 dark:text-red-400">This will permanently delete:</div>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Your profile and personal information</li>
                                <li>All your research papers and collections</li>
                                <li>Your collaboration history</li>
                                <li>All associated data and settings</li>
                              </ul>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : "Yes, Delete My Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {hasPermission(userRole, "MANAGE_USERS") && (
            <TabsContent value="admin">
              <div className="space-y-6">
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2"><Shield className="h-5 w-5" />System Administration</CardTitle>
                    <CardDescription>System-wide settings and configurations (Admin/Team Lead only)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { key: "systemMaintenance", label: "System Maintenance Mode", desc: "Put the system in maintenance mode for updates" },
                      { key: "userRegistration", label: "Allow User Registration", desc: "Allow new users to register accounts" },
                      { key: "allowGuestAccess", label: "Allow Guest Access", desc: "Allow guests to browse public papers without accounts" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div><Label>{label}</Label><p className="text-sm text-muted-foreground">{desc}</p></div>
                        <Switch
                          checked={adminSettings[key as keyof typeof adminSettings] as boolean}
                          onCheckedChange={(checked) => handleAdminChange(key, checked)}
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dataRetention">Data Retention (days)</Label>
                        <Input id="dataRetention" type="number" value={adminSettings.dataRetention} onChange={(e) => handleAdminChange("dataRetention", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                        <Input id="maxFileSize" type="number" value={adminSettings.maxFileSize} onChange={(e) => handleAdminChange("maxFileSize", e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2"><Users className="h-5 w-5" />User Management Actions</CardTitle>
                    <CardDescription>Bulk operations and system management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" onClick={() => showSuccessToast("Export Started", "User data export has been initiated")}>Export All Users</Button>
                      <Button variant="outline" onClick={() => showSuccessToast("Cleanup Started", "System cleanup has been initiated")}>Clean Inactive Data</Button>
                      <Button variant="destructive" onClick={() => showSuccessToast("Broadcast Sent", "System notification sent to all users")}>Send System Alert</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
