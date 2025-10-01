"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
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
import { useDeleteAccountMutation } from "@/redux/api/userApi";
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
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newPapers: true,
    collaborations: true,
    comments: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    researchVisible: true,
    collectionsPublic: false,
  });

  // Admin/Team Lead settings
  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false,
    userRegistration: true,
    dataRetention: "365",
    maxFileSize: "100",
    allowGuestAccess: false,
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const userRole = user.role || USER_ROLES.RESEARCHER;

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    showSuccessToast(
      "Notification Settings",
      "Your notification preferences have been updated"
    );
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
    showSuccessToast(
      "Privacy Settings",
      "Your privacy settings have been updated"
    );
  };

  const handleAdminChange = (key: string, value: boolean | string) => {
    setAdminSettings((prev) => ({ ...prev, [key]: value }));
    showSuccessToast("Admin Settings", "System settings have been updated");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ confirmDelete: true }).unwrap();

      showSuccessToast(
        "Account Deleted",
        "Your account has been successfully deleted. You will be logged out."
      );

      // Sign out and redirect to home page with full cleanup
      await handleSignOut("/");
    } catch (error: any) {
      console.error("Delete account error:", error);
      const errorMessage =
        error?.data?.message || "Failed to delete account. Please try again.";
      showErrorToast("Delete Failed", errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <SettingsIcon className="h-8 w-8" />
                Settings
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account preferences and application settings
              </p>
            </div>
            <RoleBadge role={userRole} size="lg" />
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList
            className={`grid w-full ${hasPermission(userRole, "MANAGE_USERS") ? "grid-cols-6" : "grid-cols-5"} dark:bg-gray-800`}
          >
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            {hasPermission(userRole, "MANAGE_USERS") && (
              <TabsTrigger
                value="admin"
                className="text-orange-600 dark:text-orange-400"
              >
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  General Preferences
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Configure your general application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value="English (US)"
                    readOnly
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    More languages coming soon
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value="UTC"
                    readOnly
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save drafts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically save your work as you type
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Smart suggestions</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get AI-powered research suggestions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Choose how you want to be notified about activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value: boolean) =>
                      handleNotificationChange("email", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value: boolean) =>
                      handleNotificationChange("push", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New papers in collections</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When papers are added to your collections
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newPapers}
                    onCheckedChange={(value: boolean) =>
                      handleNotificationChange("newPapers", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Collaboration invites</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When someone invites you to collaborate
                    </p>
                  </div>
                  <Switch
                    checked={notifications.collaborations}
                    onCheckedChange={(value: boolean) =>
                      handleNotificationChange("collaborations", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comments and mentions</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When someone comments or mentions you
                    </p>
                  </div>
                  <Switch
                    checked={notifications.comments}
                    onCheckedChange={(value: boolean) =>
                      handleNotificationChange("comments", value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Control your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <div>
                      <Label>Public profile</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make your profile visible to other researchers
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(value: boolean) =>
                      handlePrivacyChange("profileVisible", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <div>
                      <Label>Research visibility</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Show your research interests publicly
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.researchVisible}
                    onCheckedChange={(value: boolean) =>
                      handlePrivacyChange("researchVisible", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div>
                      <Label>Public collections</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make your collections discoverable
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.collectionsPublic}
                    onCheckedChange={(value: boolean) =>
                      handlePrivacyChange("collectionsPublic", value)
                    }
                  />
                </div>

                <div className="border-t pt-6 dark:border-gray-700">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-white">
                      Data & Security
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <div>
                          <Label>Two-factor authentication</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-400" />
                        <div>
                          <Label>Download your data</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Export all your research data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Request Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Customize how ScholarFlow looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2 h-auto p-4"
                    >
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2 h-auto p-4"
                    >
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2 h-auto p-4"
                    >
                      <Monitor className="h-4 w-4" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font size</Label>
                  <Input
                    value="Medium"
                    readOnly
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Font size customization coming soon
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show more content in less space
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    Account Information
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Your account details and subscription information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </Label>
                      <p className="text-gray-900 dark:text-white">
                        {session.user.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan
                      </Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Free</Badge>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Account ID
                    </Label>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {session.user.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-600 dark:text-red-400">
                        Delete Account
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 dark:text-red-400">
                            Delete Account
                          </AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-2">
                              <div>
                                Are you absolutely sure you want to delete your
                                account? This action cannot be undone.
                              </div>
                              <div className="font-medium text-red-600 dark:text-red-400">
                                This will permanently delete:
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Your profile and personal information</li>
                                <li>
                                  All your research papers and collections
                                </li>
                                <li>Your collaboration history</li>
                                <li>All associated data and settings</li>
                              </ul>
                              <div className="font-medium">
                                You will be logged out immediately after
                                deletion.
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Yes, Delete My Account"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Settings Tab */}
          {hasPermission(userRole, "MANAGE_USERS") && (
            <TabsContent value="admin">
              <div className="space-y-6">
                <Card className="border-orange-200 dark:border-orange-800 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      System Administration
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      System-wide settings and configurations (Admin/Team Lead
                      only)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium dark:text-white">
                          System Maintenance Mode
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Put the system in maintenance mode for updates
                        </p>
                      </div>
                      <Switch
                        checked={adminSettings.systemMaintenance}
                        onCheckedChange={(checked) =>
                          handleAdminChange("systemMaintenance", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium dark:text-white">
                          Allow User Registration
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow new users to register accounts
                        </p>
                      </div>
                      <Switch
                        checked={adminSettings.userRegistration}
                        onCheckedChange={(checked) =>
                          handleAdminChange("userRegistration", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium dark:text-white">
                          Allow Guest Access
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow guests to browse public papers without accounts
                        </p>
                      </div>
                      <Switch
                        checked={adminSettings.allowGuestAccess}
                        onCheckedChange={(checked) =>
                          handleAdminChange("allowGuestAccess", checked)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="dataRetention"
                          className="dark:text-gray-300"
                        >
                          Data Retention (days)
                        </Label>
                        <Input
                          id="dataRetention"
                          type="number"
                          value={adminSettings.dataRetention}
                          onChange={(e) =>
                            handleAdminChange("dataRetention", e.target.value)
                          }
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxFileSize"
                          className="dark:text-gray-300"
                        >
                          Max File Size (MB)
                        </Label>
                        <Input
                          id="maxFileSize"
                          type="number"
                          value={adminSettings.maxFileSize}
                          onChange={(e) =>
                            handleAdminChange("maxFileSize", e.target.value)
                          }
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management Actions
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Bulk operations and system management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() =>
                          showSuccessToast(
                            "Export Started",
                            "User data export has been initiated"
                          )
                        }
                        className="dark:border-gray-600"
                      >
                        Export All Users
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          showSuccessToast(
                            "Cleanup Started",
                            "System cleanup has been initiated"
                          )
                        }
                        className="dark:border-gray-600"
                      >
                        Clean Inactive Data
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          showSuccessToast(
                            "Broadcast Sent",
                            "System notification sent to all users"
                          )
                        }
                      >
                        Send System Alert
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
