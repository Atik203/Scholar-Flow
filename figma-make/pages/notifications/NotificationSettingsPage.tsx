"use client";

/**
 * NotificationSettingsPage - Comprehensive notification preferences management
 *
 * Features:
 * - Channel preferences (email, push, in-app)
 * - Notification type toggles
 * - Quiet hours scheduling
 * - Digest frequency settings
 * - Per-workspace notification settings
 * - Email delivery options
 * - Mobile push settings
 * - Framer Motion animations
 */

import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Folder,
  Globe,
  Info,
  Mail,
  Moon,
  Save,
  Smartphone,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface NotificationSettingsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Notification category type
interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: NotificationSetting[];
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

// Workspace notification settings
interface WorkspaceNotificationSettings {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
  emailDigest: "instant" | "daily" | "weekly" | "none";
}

// Quiet hours settings
interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: string[];
}

// Mock data for notification categories
const mockCategories: NotificationCategory[] = [
  {
    id: "papers",
    name: "Papers & Research",
    description: "Notifications about papers, uploads, and citations",
    icon: <Folder className="h-5 w-5" />,
    settings: [
      {
        id: "paper_uploaded",
        label: "Paper Uploads",
        description: "When a new paper is uploaded to your workspace",
        email: true,
        push: true,
        inApp: true,
      },
      {
        id: "paper_cited",
        label: "Paper Citations",
        description: "When your papers are cited by others",
        email: true,
        push: false,
        inApp: true,
      },
      {
        id: "paper_commented",
        label: "Paper Comments",
        description: "When someone comments on your papers",
        email: true,
        push: true,
        inApp: true,
      },
      {
        id: "paper_shared",
        label: "Paper Sharing",
        description: "When a paper is shared with you",
        email: true,
        push: true,
        inApp: true,
      },
    ],
  },
  {
    id: "collaboration",
    name: "Collaboration",
    description: "Team and workspace collaboration notifications",
    icon: <Users className="h-5 w-5" />,
    settings: [
      {
        id: "team_invitation",
        label: "Team Invitations",
        description: "When you're invited to join a team",
        email: true,
        push: true,
        inApp: true,
      },
      {
        id: "member_joined",
        label: "New Team Members",
        description: "When someone joins your team",
        email: false,
        push: false,
        inApp: true,
      },
      {
        id: "mention",
        label: "Mentions",
        description: "When you're mentioned in comments or discussions",
        email: true,
        push: true,
        inApp: true,
      },
      {
        id: "workspace_activity",
        label: "Workspace Activity",
        description: "General activity in your workspaces",
        email: false,
        push: false,
        inApp: true,
      },
    ],
  },
  {
    id: "ai_insights",
    name: "AI & Insights",
    description: "AI-powered recommendations and insights",
    icon: <Sparkles className="h-5 w-5" />,
    settings: [
      {
        id: "ai_recommendations",
        label: "Paper Recommendations",
        description: "AI-powered paper recommendations based on your research",
        email: true,
        push: false,
        inApp: true,
      },
      {
        id: "research_trends",
        label: "Research Trends",
        description: "Trending topics in your field",
        email: true,
        push: false,
        inApp: true,
      },
      {
        id: "citation_alerts",
        label: "Citation Alerts",
        description: "When relevant papers cite works in your library",
        email: true,
        push: false,
        inApp: true,
      },
    ],
  },
  {
    id: "system",
    name: "System & Security",
    description: "Account and security notifications",
    icon: <Globe className="h-5 w-5" />,
    settings: [
      {
        id: "security_alerts",
        label: "Security Alerts",
        description: "Login attempts and security-related notifications",
        email: true,
        push: true,
        inApp: true,
      },
      {
        id: "account_updates",
        label: "Account Updates",
        description: "Changes to your account settings",
        email: true,
        push: false,
        inApp: true,
      },
      {
        id: "billing",
        label: "Billing & Subscription",
        description: "Payment and subscription notifications",
        email: true,
        push: false,
        inApp: true,
      },
      {
        id: "system_updates",
        label: "System Updates",
        description: "New features and platform updates",
        email: true,
        push: false,
        inApp: true,
      },
    ],
  },
];

// Mock workspace notification settings
const mockWorkspaceSettings: WorkspaceNotificationSettings[] = [
  {
    id: "ws1",
    name: "Machine Learning Research",
    color: "blue",
    enabled: true,
    emailDigest: "daily",
  },
  {
    id: "ws2",
    name: "NLP Projects",
    color: "purple",
    enabled: true,
    emailDigest: "instant",
  },
  {
    id: "ws3",
    name: "Computer Vision",
    color: "green",
    enabled: false,
    emailDigest: "weekly",
  },
  {
    id: "ws4",
    name: "Archived Papers",
    color: "gray",
    enabled: false,
    emailDigest: "none",
  },
];

// Category accordion component
function CategoryAccordion({
  category,
  isOpen,
  onToggle,
  onSettingChange,
}: {
  category: NotificationCategory;
  isOpen: boolean;
  onToggle: () => void;
  onSettingChange: (
    categoryId: string,
    settingId: string,
    channel: "email" | "push" | "inApp",
    value: boolean
  ) => void;
}) {
  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg text-blue-600 dark:text-blue-400">
            {category.icon}
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Settings List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-gray-200 dark:border-gray-700">
              {/* Column Headers */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div>Notification</div>
                <div className="w-16 text-center">Email</div>
                <div className="w-16 text-center">Push</div>
                <div className="w-16 text-center">In-App</div>
              </div>

              {/* Settings Rows */}
              {category.settings.map((setting, index) => (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {setting.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>

                  {/* Toggle buttons */}
                  {(["email", "push", "inApp"] as const).map((channel) => (
                    <div key={channel} className="w-16 flex justify-center">
                      <button
                        onClick={() =>
                          onSettingChange(
                            category.id,
                            setting.id,
                            channel,
                            !setting[channel]
                          )
                        }
                        className={`p-2 rounded-lg transition-all ${
                          setting[channel]
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                        }`}
                      >
                        {setting[channel] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Toggle switch component
function ToggleSwitch({
  enabled,
  onChange,
  size = "md",
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "w-10 h-5" : "w-12 h-6";
  const dotSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const translate = size === "sm" ? "translate-x-5" : "translate-x-6";

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`${dimensions} rounded-full transition-colors ${
        enabled
          ? "bg-gradient-to-r from-blue-500 to-purple-500"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? (size === "sm" ? 20 : 24) : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`${dotSize} bg-white rounded-full shadow-sm`}
      />
    </button>
  );
}

export function NotificationSettingsPage({
  onNavigate,
  role: propRole,
}: NotificationSettingsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [categories, setCategories] =
    useState<NotificationCategory[]>(mockCategories);
  const [openCategories, setOpenCategories] = useState<string[]>(["papers"]);
  const [workspaceSettings, setWorkspaceSettings] = useState(
    mockWorkspaceSettings
  );
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: true,
    startTime: "22:00",
    endTime: "07:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });
  const [emailDigestFrequency, setEmailDigestFrequency] = useState<
    "instant" | "daily" | "weekly"
  >("daily");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSettingChange = (
    categoryId: string,
    settingId: string,
    channel: "email" | "push" | "inApp",
    value: boolean
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              settings: cat.settings.map((setting) =>
                setting.id === settingId
                  ? { ...setting, [channel]: value }
                  : setting
              ),
            }
          : cat
      )
    );
    setHasChanges(true);
  };

  const handleWorkspaceToggle = (workspaceId: string) => {
    setWorkspaceSettings((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId ? { ...ws, enabled: !ws.enabled } : ws
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    setShowSaveToast(true);
    setHasChanges(false);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const toggleQuietHoursDay = (day: string) => {
    setQuietHours((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
    setHasChanges(true);
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notification Settings
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Control how and when you receive notifications
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  hasChanges
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            {/* Master Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      All Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Master toggle for all notifications
                    </p>
                  </div>
                </div>
                <ToggleSwitch enabled={true} onChange={() => {}} />
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    {soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Sound Effects
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Play sounds for notifications
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={soundEnabled}
                  onChange={(value) => {
                    setSoundEnabled(value);
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Quiet Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Quiet Hours
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pause notifications during specific times
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={quietHours.enabled}
                onChange={(value) => {
                  setQuietHours((prev) => ({ ...prev, enabled: value }));
                  setHasChanges(true);
                }}
              />
            </div>

            <AnimatePresence>
              {quietHours.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Time Pickers */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          value={quietHours.startTime}
                          onChange={(e) => {
                            setQuietHours((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          value={quietHours.endTime}
                          onChange={(e) => {
                            setQuietHours((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }));
                            setHasChanges(true);
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Days Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Active Days
                    </label>
                    <div className="flex gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <button
                            key={day}
                            onClick={() => toggleQuietHoursDay(day)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              quietHours.days.includes(day)
                                ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            {day}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email Digest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Email Digest
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive a summary of notifications via email
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {(["instant", "daily", "weekly"] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => {
                    setEmailDigestFrequency(freq);
                    setHasChanges(true);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm capitalize transition-all ${
                    emailDigestFrequency === freq
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {freq === "instant" && (
                    <Zap className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {freq === "daily" && (
                    <Calendar className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {freq === "weekly" && (
                    <Calendar className="h-4 w-4 mx-auto mb-1" />
                  )}
                  {freq}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Notification Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Types
            </h2>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <CategoryAccordion
                    category={category}
                    isOpen={openCategories.includes(category.id)}
                    onToggle={() => toggleCategory(category.id)}
                    onSettingChange={handleSettingChange}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Workspace Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Folder className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Workspace Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure notifications per workspace
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {workspaceSettings.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-${workspace.color}-500`}
                      style={{
                        backgroundColor:
                          workspace.color === "blue"
                            ? "#3b82f6"
                            : workspace.color === "purple"
                              ? "#a855f7"
                              : workspace.color === "green"
                                ? "#22c55e"
                                : "#6b7280",
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {workspace.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={workspace.emailDigest}
                      onChange={(e) => {
                        setWorkspaceSettings((prev) =>
                          prev.map((ws) =>
                            ws.id === workspace.id
                              ? {
                                  ...ws,
                                  emailDigest: e.target
                                    .value as typeof workspace.emailDigest,
                                }
                              : ws
                          )
                        );
                        setHasChanges(true);
                      }}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly digest</option>
                      <option value="none">No emails</option>
                    </select>
                    <ToggleSwitch
                      enabled={workspace.enabled}
                      onChange={() => handleWorkspaceToggle(workspace.id)}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile Push Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg">
                <Smartphone className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Mobile Push Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure push notifications for mobile devices
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    To receive push notifications on your mobile device,
                    download the ScholarFlow app and enable notifications in
                    your device settings.
                  </p>
                  <button className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Download mobile app →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Toast */}
        <AnimatePresence>
          {showSaveToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">Settings saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default NotificationSettingsPage;
