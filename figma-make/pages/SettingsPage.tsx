"use client";

/**
 * SettingsPage - User Settings Management
 * Matches frontend/src/app/settings/page.tsx
 *
 * Enhanced with:
 * - Live preview for UI settings
 * - Settings search/filter
 * - Import/export settings
 * - AI-recommended settings
 */

import {
  Bell,
  Database,
  Download,
  Eye,
  Filter,
  Globe,
  GraduationCap,
  HelpCircle,
  Loader2,
  Lock,
  Monitor,
  Moon,
  Palette,
  Puzzle,
  Search,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

// Role display names
const roleDisplayNames: Record<string, string> = {
  researcher: "Researcher",
  pro_researcher: "Pro Researcher",
  team_lead: "Team Lead",
  admin: "Administrator",
};

interface SettingsPageProps {
  onNavigate: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

// Mock user data
const mockUser = {
  id: "user_123",
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  role: "pro_researcher",
  plan: "PRO",
};

// Check if user has permission (simplified for demo)
const hasPermission = (role: string, permission: string) => {
  if (role === "admin") return true;
  if (role === "team_lead" && permission === "MANAGE_USERS") return true;
  return false;
};

// AI-recommended settings based on user behavior
const aiRecommendations = [
  {
    id: "1",
    title: "Enable Dark Mode",
    description:
      "Based on your late-night research sessions, dark mode could reduce eye strain",
    setting: "appearance",
    icon: Moon,
    action: "Enable",
    priority: "high",
  },
  {
    id: "2",
    title: "Turn on Smart Suggestions",
    description:
      "AI can help you discover related papers based on your reading history",
    setting: "general",
    icon: Sparkles,
    action: "Enable",
    priority: "medium",
  },
  {
    id: "3",
    title: "Enable Email Digest",
    description: "Get a weekly summary instead of individual notifications",
    setting: "notifications",
    icon: Bell,
    action: "Configure",
    priority: "low",
  },
];

// All settings for search functionality
const allSettings = [
  {
    id: "language",
    name: "Language",
    tab: "general",
    keywords: ["language", "locale", "region"],
  },
  {
    id: "timezone",
    name: "Timezone",
    tab: "general",
    keywords: ["timezone", "time", "zone"],
  },
  {
    id: "autosave",
    name: "Auto-save drafts",
    tab: "general",
    keywords: ["autosave", "save", "draft", "automatic"],
  },
  {
    id: "suggestions",
    name: "Smart suggestions",
    tab: "general",
    keywords: ["smart", "suggestions", "ai", "recommendations"],
  },
  {
    id: "email",
    name: "Email notifications",
    tab: "notifications",
    keywords: ["email", "mail", "notification"],
  },
  {
    id: "push",
    name: "Push notifications",
    tab: "notifications",
    keywords: ["push", "browser", "notification"],
  },
  {
    id: "papers",
    name: "New papers in collections",
    tab: "notifications",
    keywords: ["papers", "collection", "new"],
  },
  {
    id: "collab",
    name: "Collaboration invites",
    tab: "notifications",
    keywords: ["collaboration", "invite", "team"],
  },
  {
    id: "comments",
    name: "Comments and mentions",
    tab: "notifications",
    keywords: ["comments", "mentions", "tag"],
  },
  {
    id: "profile",
    name: "Public profile",
    tab: "privacy",
    keywords: ["profile", "public", "visibility"],
  },
  {
    id: "research",
    name: "Research visibility",
    tab: "privacy",
    keywords: ["research", "visibility", "public"],
  },
  {
    id: "collections",
    name: "Public collections",
    tab: "privacy",
    keywords: ["collections", "public", "share"],
  },
  {
    id: "2fa",
    name: "Two-factor authentication",
    tab: "privacy",
    keywords: ["2fa", "two-factor", "security", "authentication"],
  },
  {
    id: "theme",
    name: "Theme",
    tab: "appearance",
    keywords: ["theme", "dark", "light", "mode", "appearance"],
  },
  {
    id: "fontsize",
    name: "Font size",
    tab: "appearance",
    keywords: ["font", "size", "text", "display"],
  },
  {
    id: "compact",
    name: "Compact mode",
    tab: "appearance",
    keywords: ["compact", "mode", "density"],
  },
  {
    id: "animations",
    name: "Animations",
    tab: "appearance",
    keywords: ["animations", "motion", "transitions"],
  },
];

// Custom Tabs implementation for this page
function SettingsTabs({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { value: string; label: string; className?: string }[];
}) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
            activeTab === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50"
          } ${tab.className || ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPage({ onNavigate, onShowToast }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showAiRecommendations, setShowAiRecommendations] = useState(true);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<
    string[]
  >([]);

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

  const userRole = mockUser.role;
  const userPlan = mockUser.plan;

  // Filter settings based on search
  const filteredSettings = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allSettings.filter(
      (setting) =>
        setting.name.toLowerCase().includes(query) ||
        setting.keywords.some((k) => k.includes(query))
    );
  }, [searchQuery]);

  // Active recommendations (not dismissed)
  const activeRecommendations = aiRecommendations.filter(
    (rec) => !dismissedRecommendations.includes(rec.id)
  );

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    onShowToast?.("Notification preferences updated", "success");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
    onShowToast?.("Privacy settings updated", "success");
  };

  const handleAdminChange = (key: string, value: boolean | string) => {
    setAdminSettings((prev) => ({ ...prev, [key]: value }));
    onShowToast?.("System settings updated", "success");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    onShowToast?.(`Theme changed to ${newTheme}`, "success");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setShowDeleteDialog(false);
    onShowToast?.("Account deleted successfully", "success");
    onNavigate("/");
  };

  const handleExportSettings = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExporting(false);
    onShowToast?.("Settings exported successfully", "success");
  };

  const handleImportSettings = async () => {
    setIsImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsImporting(false);
    onShowToast?.("Settings imported successfully", "success");
  };

  const handleDismissRecommendation = (id: string) => {
    setDismissedRecommendations([...dismissedRecommendations, id]);
  };

  const handleApplyRecommendation = (rec: (typeof aiRecommendations)[0]) => {
    setActiveTab(rec.setting);
    setDismissedRecommendations([...dismissedRecommendations, rec.id]);
    onShowToast?.(`Applied recommendation: ${rec.title}`, "success");
  };

  const handleSearchResultClick = (setting: (typeof allSettings)[0]) => {
    setActiveTab(setting.tab);
    setSearchQuery("");
  };

  const tabs = [
    { value: "general", label: "General" },
    { value: "notifications", label: "Notifications" },
    { value: "privacy", label: "Privacy" },
    { value: "appearance", label: "Appearance" },
    { value: "account", label: "Account" },
    ...(hasPermission(userRole, "MANAGE_USERS")
      ? [
          {
            value: "admin",
            label: "Admin",
            className: "text-orange-600 dark:text-orange-400",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
            <Badge
              variant="default"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              {roleDisplayNames[userRole]}
            </Badge>
          </div>
        </motion.div>

        {/* Settings Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search settings... (e.g., 'theme', 'notifications', 'privacy')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {filteredSettings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden"
                >
                  {filteredSettings.map((setting) => (
                    <button
                      key={setting.id}
                      onClick={() => handleSearchResultClick(setting)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Filter className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {setting.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {setting.tab} settings
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Import/Export Settings */}
        <motion.div
          className="mb-6 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSettings}
            disabled={isExporting}
            className="btn-hover-glow"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportSettings}
            disabled={isImporting}
            className="btn-hover-glow"
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Import Settings
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-hover-glow"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide Preview" : "Live Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/settings/integrations")}
            className="btn-hover-glow bg-gradient-to-r from-primary/5 to-chart-1/5 hover:from-primary/10 hover:to-chart-1/10 border-primary/20"
          >
            <Puzzle className="h-4 w-4 mr-2 text-primary" />
            Integrations
          </Button>
        </motion.div>

        {/* AI Recommendations */}
        <AnimatePresence>
          {showAiRecommendations && activeRecommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-br from-primary/5 to-chart-1/5 border-primary/20 dark:from-primary/10 dark:to-chart-1/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wand2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base dark:text-white">
                          AI-Recommended Settings
                        </CardTitle>
                        <CardDescription className="text-xs dark:text-gray-400">
                          Personalized suggestions based on your usage
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAiRecommendations(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-3">
                    {activeRecommendations.map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              rec.priority === "high"
                                ? "bg-green-500/10"
                                : rec.priority === "medium"
                                  ? "bg-blue-500/10"
                                  : "bg-gray-500/10"
                            }`}
                          >
                            <rec.icon
                              className={`h-5 w-5 ${
                                rec.priority === "high"
                                  ? "text-green-500"
                                  : rec.priority === "medium"
                                    ? "text-blue-500"
                                    : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {rec.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismissRecommendation(rec.id)}
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplyRecommendation(rec)}
                          >
                            {rec.action}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Preview Panel */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-2 border-dashed border-primary/30 dark:bg-gray-800 dark:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base dark:text-white">
                      Live Preview
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary">SC</span>
                      </div>
                      <div>
                        <p className="font-medium">Sample Content Preview</p>
                        <p className="text-sm opacity-70">
                          See how your settings affect the interface
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={theme === "dark" ? "outline" : "default"}>
                        Theme: {theme}
                      </Badge>
                      <Badge variant="outline">
                        Notifications: {notifications.email ? "On" : "Off"}
                      </Badge>
                      <Badge variant="outline">
                        Profile: {privacy.profileVisible ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SettingsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
                        handleNotificationChange("comments", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy */}
          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
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
                      onCheckedChange={(value) =>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-hover-glow"
                        >
                          Request Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                        onClick={() => handleThemeChange("light")}
                        className={`flex items-center gap-2 h-auto p-4 transition-all duration-300 ${theme === "light" ? "ring-2 ring-primary" : ""}`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => handleThemeChange("dark")}
                        className={`flex items-center gap-2 h-auto p-4 transition-all duration-300 ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        onClick={() => handleThemeChange("system")}
                        className={`flex items-center gap-2 h-auto p-4 transition-all duration-300 ${theme === "system" ? "ring-2 ring-primary" : ""}`}
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
            </motion.div>
          )}

          {/* Account */}
          {activeTab === "account" && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                        {mockUser.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan
                      </Label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={userPlan === "PRO" ? "default" : "secondary"}
                          className="font-semibold"
                        >
                          {userPlan}
                        </Badge>
                        {userPlan === "FREE" && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-primary"
                            onClick={() => onNavigate("/pricing")}
                          >
                            Upgrade to PRO
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Account ID
                    </Label>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {mockUser.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Help & Support
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Get help and learn how to use ScholarFlow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="dark:text-white">
                        Revisit Onboarding
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review the getting started guide and setup your
                        preferences again
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate("/onboarding")}
                      className="flex items-center gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Start Tour
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="dark:text-white">Help Center</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Browse documentation, tutorials, and FAQs
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate("/dashboard/help-center")}
                      className="flex items-center gap-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Open Help
                    </Button>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-white"
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
                  </div>
                </CardContent>
              </Card>

              {/* Delete Confirmation Dialog */}
              {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setShowDeleteDialog(false)}
                  />
                  <motion.div
                    className="relative z-50 bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                      Delete Account
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <p>
                        Are you absolutely sure you want to delete your account?
                        This action cannot be undone.
                      </p>
                      <p className="font-medium text-red-600 dark:text-red-400">
                        This will permanently delete:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Your profile and personal information</li>
                        <li>All your research papers and collections</li>
                        <li>Your collaboration history</li>
                        <li>All associated data and settings</li>
                      </ul>
                      <p className="font-medium">
                        You will be logged out immediately after deletion.
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="text-white"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Yes, Delete My Account"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* Admin Settings Tab */}
          {activeTab === "admin" && hasPermission(userRole, "MANAGE_USERS") && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                        onShowToast?.("User data export initiated", "success")
                      }
                      className="dark:border-gray-600 btn-hover-glow"
                    >
                      Export All Users
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        onShowToast?.("System cleanup initiated", "success")
                      }
                      className="dark:border-gray-600 btn-hover-glow"
                    >
                      Clean Inactive Data
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        onShowToast?.(
                          "System notification sent to all users",
                          "success"
                        )
                      }
                    >
                      Send System Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
