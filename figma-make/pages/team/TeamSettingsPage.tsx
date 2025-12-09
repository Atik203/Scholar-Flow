"use client";

import {
  AlertTriangle,
  Bell,
  Building,
  CheckCircle,
  ChevronRight,
  Eye,
  Globe,
  Link,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// Team settings types
interface TeamSettings {
  general: {
    name: string;
    description: string;
    logo?: string;
    visibility: "public" | "private" | "invite-only";
    defaultRole: string;
    timezone: string;
    language: string;
  };
  permissions: {
    canMembersInvite: boolean;
    canMembersCreateCollections: boolean;
    canMembersShareExternally: boolean;
    canMembersAccessAI: boolean;
    canMembersExportData: boolean;
    canMembersDeletePapers: boolean;
    requireApprovalForPapers: boolean;
    requireApprovalForCollections: boolean;
  };
  notifications: {
    newMemberJoins: boolean;
    paperUploaded: boolean;
    collectionCreated: boolean;
    weeklyDigest: boolean;
    activityAlerts: boolean;
    mentionNotifications: boolean;
  };
  security: {
    enforce2FA: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
    allowedDomains: string[];
    passwordPolicy: "basic" | "strong" | "enterprise";
  };
  integrations: {
    slackWebhook?: string;
    discordWebhook?: string;
    customWebhook?: string;
  };
}

// Mock initial settings
const initialSettings: TeamSettings = {
  general: {
    name: "AI Research Lab 2024",
    description:
      "A collaborative workspace for cutting-edge AI and machine learning research focusing on transformer architectures and neural networks.",
    visibility: "invite-only",
    defaultRole: "researcher",
    timezone: "America/New_York",
    language: "en",
  },
  permissions: {
    canMembersInvite: false,
    canMembersCreateCollections: true,
    canMembersShareExternally: false,
    canMembersAccessAI: true,
    canMembersExportData: true,
    canMembersDeletePapers: false,
    requireApprovalForPapers: false,
    requireApprovalForCollections: true,
  },
  notifications: {
    newMemberJoins: true,
    paperUploaded: true,
    collectionCreated: true,
    weeklyDigest: true,
    activityAlerts: false,
    mentionNotifications: true,
  },
  security: {
    enforce2FA: false,
    sessionTimeout: 24,
    ipWhitelist: [],
    allowedDomains: ["university.edu", "research.org"],
    passwordPolicy: "strong",
  },
  integrations: {
    slackWebhook: "",
    discordWebhook: "",
    customWebhook: "",
  },
};

interface TeamSettingsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

export function TeamSettingsPage({
  onNavigate,
  role: propRole,
}: TeamSettingsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [settings, setSettings] = useState<TeamSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "permissions"
    | "notifications"
    | "security"
    | "integrations"
    | "danger"
  >("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "team_lead" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "integrations", label: "Integrations", icon: Link },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  const updateSetting = <T extends keyof TeamSettings>(
    category: T,
    key: keyof TeamSettings[T],
    value: unknown
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const addDomain = () => {
    if (newDomain && !settings.security.allowedDomains.includes(newDomain)) {
      updateSetting("security", "allowedDomains", [
        ...settings.security.allowedDomains,
        newDomain,
      ]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    updateSetting(
      "security",
      "allowedDomains",
      settings.security.allowedDomains.filter((d) => d !== domain)
    );
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 dark:border-white/5 last:border-0">
      <div>
        <p className="text-gray-900 dark:text-white font-medium">{label}</p>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <Settings className="h-6 w-6 text-gray-900 dark:text-white" />
                  </div>
                  Team Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-2">
                  Manage your team's configuration and permissions
                </p>
              </div>
              <div className="flex items-center gap-3">
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Changes saved
                  </motion.span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-gray-900 dark:text-white font-medium rounded-lg shadow-lg shadow-purple-500/25 transition-all"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 p-2 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? tab.id === "danger"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400"
                          : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                        : tab.id === "danger"
                          ? "text-red-500/60 dark:text-red-400/60 hover:bg-red-500/10"
                          : "text-gray-600 dark:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white dark:bg-white/5"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight
                      className={`h-4 w-4 ml-auto transition-transform ${
                        activeTab === tab.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {/* General Settings */}
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      General Settings
                    </h2>

                    <div className="space-y-6">
                      {/* Team Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                          Team Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Building className="h-8 w-8 text-gray-900 dark:text-white" />
                          </div>
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-gray-900 dark:text-white rounded-lg transition-colors">
                            <Upload className="h-4 w-4" />
                            Upload Logo
                          </button>
                        </div>
                      </div>

                      {/* Team Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                          Team Name
                        </label>
                        <input
                          type="text"
                          value={settings.general.name}
                          onChange={(e) =>
                            updateSetting("general", "name", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={settings.general.description}
                          onChange={(e) =>
                            updateSetting(
                              "general",
                              "description",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        />
                      </div>

                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Visibility
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              value: "public",
                              label: "Public",
                              icon: Globe,
                              desc: "Anyone can find and request to join",
                            },
                            {
                              value: "private",
                              label: "Private",
                              icon: Eye,
                              desc: "Only visible to members",
                            },
                            {
                              value: "invite-only",
                              label: "Invite Only",
                              icon: Mail,
                              desc: "Join by invitation only",
                            },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                updateSetting(
                                  "general",
                                  "visibility",
                                  option.value as
                                    | "public"
                                    | "private"
                                    | "invite-only"
                                )
                              }
                              className={`p-4 rounded-lg border text-left transition-all ${
                                settings.general.visibility === option.value
                                  ? "bg-purple-500/20 border-purple-500/50"
                                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-white/20"
                              }`}
                            >
                              <option.icon
                                className={`h-5 w-5 mb-2 ${
                                  settings.general.visibility === option.value
                                    ? "text-purple-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              />
                              <p className="text-gray-900 dark:text-white font-medium text-sm">
                                {option.label}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {option.desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Default Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Role for New Members
                        </label>
                        <select
                          value={settings.general.defaultRole}
                          onChange={(e) =>
                            updateSetting(
                              "general",
                              "defaultRole",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="researcher">Researcher</option>
                          <option value="pro_researcher">Pro Researcher</option>
                          <option value="viewer">Viewer (Read-only)</option>
                        </select>
                      </div>

                      {/* Timezone */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "timezone",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          >
                            <option value="America/New_York">
                              Eastern Time (ET)
                            </option>
                            <option value="America/Los_Angeles">
                              Pacific Time (PT)
                            </option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.general.language}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "language",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Permissions */}
                {activeTab === "permissions" && (
                  <motion.div
                    key="permissions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-400" />
                      Member Permissions
                    </h2>

                    <div className="space-y-2">
                      <ToggleSwitch
                        enabled={settings.permissions.canMembersInvite}
                        onChange={(v) =>
                          updateSetting("permissions", "canMembersInvite", v)
                        }
                        label="Allow members to invite others"
                        description="Members can send invitations without admin approval"
                      />
                      <ToggleSwitch
                        enabled={
                          settings.permissions.canMembersCreateCollections
                        }
                        onChange={(v) =>
                          updateSetting(
                            "permissions",
                            "canMembersCreateCollections",
                            v
                          )
                        }
                        label="Allow members to create collections"
                        description="Members can organize papers into new collections"
                      />
                      <ToggleSwitch
                        enabled={settings.permissions.canMembersShareExternally}
                        onChange={(v) =>
                          updateSetting(
                            "permissions",
                            "canMembersShareExternally",
                            v
                          )
                        }
                        label="Allow external sharing"
                        description="Members can share papers and collections outside the team"
                      />
                      <ToggleSwitch
                        enabled={settings.permissions.canMembersAccessAI}
                        onChange={(v) =>
                          updateSetting("permissions", "canMembersAccessAI", v)
                        }
                        label="Enable AI features for all members"
                        description="Members can use AI-powered insights and recommendations"
                      />
                      <ToggleSwitch
                        enabled={settings.permissions.canMembersExportData}
                        onChange={(v) =>
                          updateSetting(
                            "permissions",
                            "canMembersExportData",
                            v
                          )
                        }
                        label="Allow data export"
                        description="Members can export papers and collections"
                      />
                      <ToggleSwitch
                        enabled={settings.permissions.canMembersDeletePapers}
                        onChange={(v) =>
                          updateSetting(
                            "permissions",
                            "canMembersDeletePapers",
                            v
                          )
                        }
                        label="Allow paper deletion"
                        description="Members can permanently delete papers they uploaded"
                      />

                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
                        <h3 className="text-gray-900 dark:text-white font-medium mb-4">
                          Approval Workflows
                        </h3>
                        <ToggleSwitch
                          enabled={
                            settings.permissions.requireApprovalForPapers
                          }
                          onChange={(v) =>
                            updateSetting(
                              "permissions",
                              "requireApprovalForPapers",
                              v
                            )
                          }
                          label="Require approval for paper uploads"
                          description="New papers need admin approval before being visible"
                        />
                        <ToggleSwitch
                          enabled={
                            settings.permissions.requireApprovalForCollections
                          }
                          onChange={(v) =>
                            updateSetting(
                              "permissions",
                              "requireApprovalForCollections",
                              v
                            )
                          }
                          label="Require approval for new collections"
                          description="Collection creation requires admin approval"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-purple-400" />
                      Team Notifications
                    </h2>

                    <div className="space-y-2">
                      <ToggleSwitch
                        enabled={settings.notifications.newMemberJoins}
                        onChange={(v) =>
                          updateSetting("notifications", "newMemberJoins", v)
                        }
                        label="New member joins"
                        description="Notify when someone joins the team"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.paperUploaded}
                        onChange={(v) =>
                          updateSetting("notifications", "paperUploaded", v)
                        }
                        label="Paper uploaded"
                        description="Notify when a new paper is added"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.collectionCreated}
                        onChange={(v) =>
                          updateSetting("notifications", "collectionCreated", v)
                        }
                        label="Collection created"
                        description="Notify when a new collection is created"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.weeklyDigest}
                        onChange={(v) =>
                          updateSetting("notifications", "weeklyDigest", v)
                        }
                        label="Weekly digest"
                        description="Send a weekly summary of team activity"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.activityAlerts}
                        onChange={(v) =>
                          updateSetting("notifications", "activityAlerts", v)
                        }
                        label="Activity alerts"
                        description="Real-time alerts for important activities"
                      />
                      <ToggleSwitch
                        enabled={settings.notifications.mentionNotifications}
                        onChange={(v) =>
                          updateSetting(
                            "notifications",
                            "mentionNotifications",
                            v
                          )
                        }
                        label="Mention notifications"
                        description="Notify when members are mentioned in comments"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Security */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-400" />
                      Security Settings
                    </h2>

                    <div className="space-y-6">
                      <ToggleSwitch
                        enabled={settings.security.enforce2FA}
                        onChange={(v) =>
                          updateSetting("security", "enforce2FA", v)
                        }
                        label="Enforce two-factor authentication"
                        description="Require all members to enable 2FA"
                      />

                      {/* Session Timeout */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Session Timeout (hours)
                        </label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) =>
                            updateSetting(
                              "security",
                              "sessionTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value={1}>1 hour</option>
                          <option value={8}>8 hours</option>
                          <option value={24}>24 hours</option>
                          <option value={72}>72 hours</option>
                          <option value={168}>7 days</option>
                        </select>
                      </div>

                      {/* Password Policy */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password Policy
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              value: "basic",
                              label: "Basic",
                              desc: "8+ characters",
                            },
                            {
                              value: "strong",
                              label: "Strong",
                              desc: "12+ chars, mixed case, numbers",
                            },
                            {
                              value: "enterprise",
                              label: "Enterprise",
                              desc: "16+ chars, symbols required",
                            },
                          ].map((policy) => (
                            <button
                              key={policy.value}
                              onClick={() =>
                                updateSetting(
                                  "security",
                                  "passwordPolicy",
                                  policy.value as
                                    | "basic"
                                    | "strong"
                                    | "enterprise"
                                )
                              }
                              className={`p-4 rounded-lg border text-left transition-all ${
                                settings.security.passwordPolicy ===
                                policy.value
                                  ? "bg-purple-500/20 border-purple-500/50"
                                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-white/20"
                              }`}
                            >
                              <p className="text-gray-900 dark:text-white font-medium text-sm">
                                {policy.label}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {policy.desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Allowed Domains */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Allowed Email Domains
                        </label>
                        <p className="text-gray-500 text-sm mb-3">
                          Only users with these email domains can join
                        </p>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            placeholder="example.edu"
                            className="flex-1 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          />
                          <button
                            onClick={addDomain}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {settings.security.allowedDomains.map((domain) => (
                            <span
                              key={domain}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-sm text-gray-900 dark:text-white"
                            >
                              @{domain}
                              <button
                                onClick={() => removeDomain(domain)}
                                className="text-gray-600 dark:text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          {settings.security.allowedDomains.length === 0 && (
                            <span className="text-gray-500 text-sm">
                              No restrictions - any domain allowed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Integrations */}
                {activeTab === "integrations" && (
                  <motion.div
                    key="integrations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Link className="h-5 w-5 text-purple-400" />
                      Integrations
                    </h2>

                    <div className="space-y-6">
                      {/* Slack */}
                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#4A154B] flex items-center justify-center">
                            <span className="text-gray-900 dark:text-white font-bold">
                              #
                            </span>
                          </div>
                          <div>
                            <h3 className="text-gray-900 dark:text-white font-medium">
                              Slack
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Send notifications to a Slack channel
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={settings.integrations.slackWebhook || ""}
                          onChange={(e) =>
                            updateSetting(
                              "integrations",
                              "slackWebhook",
                              e.target.value
                            )
                          }
                          placeholder="https://hooks.slack.com/services/..."
                          className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>

                      {/* Discord */}
                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center">
                            <span className="text-gray-900 dark:text-white font-bold">
                              D
                            </span>
                          </div>
                          <div>
                            <h3 className="text-gray-900 dark:text-white font-medium">
                              Discord
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Send notifications to a Discord channel
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={settings.integrations.discordWebhook || ""}
                          onChange={(e) =>
                            updateSetting(
                              "integrations",
                              "discordWebhook",
                              e.target.value
                            )
                          }
                          placeholder="https://discord.com/api/webhooks/..."
                          className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>

                      {/* Custom Webhook */}
                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                            <Link className="h-5 w-5 text-gray-900 dark:text-white" />
                          </div>
                          <div>
                            <h3 className="text-gray-900 dark:text-white font-medium">
                              Custom Webhook
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Send notifications to any webhook URL
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={settings.integrations.customWebhook || ""}
                          onChange={(e) =>
                            updateSetting(
                              "integrations",
                              "customWebhook",
                              e.target.value
                            )
                          }
                          placeholder="https://your-server.com/webhook"
                          className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <motion.div
                    key="danger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-red-500/10 backdrop-blur-xl rounded-xl border border-red-500/30 p-6"
                  >
                    <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <h3 className="text-gray-900 dark:text-white font-medium mb-2">
                          Archive Team
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          Archive this team to hide it from all members. You can
                          restore it later.
                        </p>
                        <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors">
                          Archive Team
                        </button>
                      </div>

                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-red-500/30">
                        <h3 className="text-gray-900 dark:text-white font-medium mb-2">
                          Delete Team
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          Permanently delete this team and all its data. This
                          action cannot be undone.
                        </p>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete Team
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-xl border border-red-500/30 p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Delete Team?
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This will permanently delete the team "
                    {settings.general.name}" and all associated data including:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-400 text-sm mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      All papers and collections
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      Member data and permissions
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      Activity history and analytics
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        onNavigate?.("/dashboard");
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeamSettingsPage;
