"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useGetTeamSettingsQuery,
  useUpdateTeamSettingsMutation,
  type TeamSettings,
} from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  Eye,
  Globe,
  Link as LinkIcon,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS: TeamSettings = {
  general: {
    name: "My Team",
    description: "",
    visibility: "INVITE_ONLY",
    defaultRole: "RESEARCHER",
    timezone: "UTC",
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
    requireApprovalForCollections: false,
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
    allowedDomains: [],
    passwordPolicy: "strong",
  },
  integrations: {
    slackWebhook: "",
    discordWebhook: "",
    customWebhook: "",
  },
};

type TabId = "general" | "permissions" | "notifications" | "security" | "integrations" | "danger";

export default function TeamSettingsPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const { data: serverSettings } = useGetTeamSettingsQuery(undefined, { skip: !shouldFetch });
  const [updateSettings, { isLoading: saving }] = useUpdateTeamSettingsMutation();

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saved, setSaved] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState<TeamSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  if (serverSettings && !hydrated) {
    setSettings({
      general: { ...DEFAULT_SETTINGS.general, ...serverSettings.general },
      permissions: { ...DEFAULT_SETTINGS.permissions, ...serverSettings.permissions },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...serverSettings.notifications },
      security: {
        ...DEFAULT_SETTINGS.security,
        ...serverSettings.security,
        allowedDomains: serverSettings.security?.allowedDomains || [],
      },
      integrations: { ...DEFAULT_SETTINGS.integrations, ...serverSettings.integrations },
    });
    setHydrated(true);
  }

  const updateGeneral = (key: string, value: any) => {
    setSettings((s) => ({ ...s, general: { ...s.general, [key]: value } }));
  };
  const updatePermission = (key: string, value: boolean) => {
    setSettings((s) => ({ ...s, permissions: { ...s.permissions, [key]: value } }));
  };
  const updateNotification = (key: string, value: boolean) => {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
  };
  const updateSecurity = (key: string, value: any) => {
    setSettings((s) => ({ ...s, security: { ...s.security, [key]: value } }));
  };
  const updateIntegration = (key: string, value: string) => {
    setSettings((s) => ({ ...s, integrations: { ...s.integrations, [key]: value } }));
  };

  const addDomain = () => {
    if (
      newDomain &&
      !settings.security?.allowedDomains?.includes(newDomain)
    ) {
      updateSecurity("allowedDomains", [
        ...(settings.security?.allowedDomains || []),
        newDomain,
      ]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    updateSecurity(
      "allowedDomains",
      (settings.security?.allowedDomains || []).filter((d) => d !== domain)
    );
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings).unwrap();
      showSuccessToast("Team settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            Team Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team&apos;s configuration and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-green-600 text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Changes saved
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="rounded-xl border bg-card p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === tab.id
                    ? tab.id === "danger"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-purple-500/10 text-purple-600"
                    : tab.id === "danger"
                      ? "text-red-500/60 hover:bg-red-500/10"
                      : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 ml-auto transition-transform",
                    activeTab === tab.id && "rotate-90"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <SettingsCard key="general" title="General Settings" icon={SettingsIcon}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Name</label>
                    <Input
                      value={settings.general?.name || ""}
                      onChange={(e) => updateGeneral("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={settings.general?.description || ""}
                      onChange={(e) => updateGeneral("description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Visibility</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "PUBLIC", label: "Public", icon: Globe, desc: "Anyone can find and request to join" },
                        { value: "PRIVATE", label: "Private", icon: Eye, desc: "Only visible to members" },
                        { value: "INVITE_ONLY", label: "Invite Only", icon: Mail, desc: "Join by invitation only" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateGeneral("visibility", opt.value)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            settings.general?.visibility === opt.value
                              ? "bg-purple-500/10 border-purple-500/50"
                              : "bg-background hover:bg-muted"
                          )}
                        >
                          <opt.icon
                            className={cn(
                              "h-5 w-5 mb-2",
                              settings.general?.visibility === opt.value
                                ? "text-purple-500"
                                : "text-muted-foreground"
                            )}
                          />
                          <p className="font-medium text-sm">{opt.label}</p>
                          <p className="text-muted-foreground text-xs mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Role for New Members</label>
                    <select
                      value={settings.general?.defaultRole || "RESEARCHER"}
                      onChange={(e) => updateGeneral("defaultRole", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                    >
                      <option value="RESEARCHER">Researcher</option>
                      <option value="PRO_RESEARCHER">Pro Researcher</option>
                      <option value="TEAM_LEAD">Team Lead</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <select
                        value={settings.general?.timezone || "UTC"}
                        onChange={(e) => updateGeneral("timezone", e.target.value)}
                        className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Dhaka">Dhaka (BDT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={settings.general?.language || "en"}
                        onChange={(e) => updateGeneral("language", e.target.value)}
                        className="w-full h-10 px-3 rounded-md border bg-background text-sm"
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
              </SettingsCard>
            )}

            {activeTab === "permissions" && (
              <SettingsCard key="permissions" title="Member Permissions" icon={Shield}>
                <div className="space-y-2">
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersInvite}
                    onChange={(v) => updatePermission("canMembersInvite", v)}
                    label="Allow members to invite others"
                    description="Members can send invitations without admin approval"
                  />
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersCreateCollections}
                    onChange={(v) => updatePermission("canMembersCreateCollections", v)}
                    label="Allow members to create collections"
                    description="Members can organize papers into new collections"
                  />
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersShareExternally}
                    onChange={(v) => updatePermission("canMembersShareExternally", v)}
                    label="Allow external sharing"
                    description="Members can share papers and collections outside the team"
                  />
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersAccessAI}
                    onChange={(v) => updatePermission("canMembersAccessAI", v)}
                    label="Enable AI features for all members"
                    description="Members can use AI-powered insights and recommendations"
                  />
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersExportData}
                    onChange={(v) => updatePermission("canMembersExportData", v)}
                    label="Allow data export"
                    description="Members can export papers and collections"
                  />
                  <ToggleRow
                    enabled={!!settings.permissions?.canMembersDeletePapers}
                    onChange={(v) => updatePermission("canMembersDeletePapers", v)}
                    label="Allow paper deletion"
                    description="Members can permanently delete papers they uploaded"
                  />
                  <div className="pt-4 mt-4 border-t">
                    <h3 className="font-medium mb-4">Approval Workflows</h3>
                    <ToggleRow
                      enabled={!!settings.permissions?.requireApprovalForPapers}
                      onChange={(v) => updatePermission("requireApprovalForPapers", v)}
                      label="Require approval for paper uploads"
                      description="New papers need admin approval before being visible"
                    />
                    <ToggleRow
                      enabled={!!settings.permissions?.requireApprovalForCollections}
                      onChange={(v) => updatePermission("requireApprovalForCollections", v)}
                      label="Require approval for new collections"
                      description="Collection creation requires admin approval"
                    />
                  </div>
                </div>
              </SettingsCard>
            )}

            {activeTab === "notifications" && (
              <SettingsCard key="notifications" title="Team Notifications" icon={Bell}>
                <div className="space-y-2">
                  <ToggleRow
                    enabled={!!settings.notifications?.newMemberJoins}
                    onChange={(v) => updateNotification("newMemberJoins", v)}
                    label="New member joins"
                    description="Notify when someone joins the team"
                  />
                  <ToggleRow
                    enabled={!!settings.notifications?.paperUploaded}
                    onChange={(v) => updateNotification("paperUploaded", v)}
                    label="Paper uploaded"
                    description="Notify when a new paper is added"
                  />
                  <ToggleRow
                    enabled={!!settings.notifications?.collectionCreated}
                    onChange={(v) => updateNotification("collectionCreated", v)}
                    label="Collection created"
                    description="Notify when a new collection is created"
                  />
                  <ToggleRow
                    enabled={!!settings.notifications?.weeklyDigest}
                    onChange={(v) => updateNotification("weeklyDigest", v)}
                    label="Weekly digest"
                    description="Send a weekly summary of team activity"
                  />
                  <ToggleRow
                    enabled={!!settings.notifications?.activityAlerts}
                    onChange={(v) => updateNotification("activityAlerts", v)}
                    label="Activity alerts"
                    description="Real-time alerts for important activities"
                  />
                  <ToggleRow
                    enabled={!!settings.notifications?.mentionNotifications}
                    onChange={(v) => updateNotification("mentionNotifications", v)}
                    label="Mention notifications"
                    description="Notify when members are mentioned in comments"
                  />
                </div>
              </SettingsCard>
            )}

            {activeTab === "security" && (
              <SettingsCard key="security" title="Security Settings" icon={Lock}>
                <div className="space-y-6">
                  <ToggleRow
                    enabled={!!settings.security?.enforce2FA}
                    onChange={(v) => updateSecurity("enforce2FA", v)}
                    label="Enforce two-factor authentication"
                    description="Require all members to enable 2FA"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (hours)</label>
                    <select
                      value={String(settings.security?.sessionTimeout || 24)}
                      onChange={(e) =>
                        updateSecurity("sessionTimeout", parseInt(e.target.value))
                      }
                      className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                    >
                      <option value="1">1 hour</option>
                      <option value="8">8 hours</option>
                      <option value="24">24 hours</option>
                      <option value="72">72 hours</option>
                      <option value="168">7 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password Policy</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "basic", label: "Basic", desc: "8+ characters" },
                        { value: "strong", label: "Strong", desc: "12+ chars, mixed case, numbers" },
                        { value: "enterprise", label: "Enterprise", desc: "16+ chars, symbols required" },
                      ].map((p) => (
                        <button
                          key={p.value}
                          onClick={() => updateSecurity("passwordPolicy", p.value)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            settings.security?.passwordPolicy === p.value
                              ? "bg-purple-500/10 border-purple-500/50"
                              : "bg-background hover:bg-muted"
                          )}
                        >
                          <p className="font-medium text-sm">{p.label}</p>
                          <p className="text-muted-foreground text-xs mt-1">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Allowed Email Domains</label>
                    <p className="text-muted-foreground text-sm mb-3">
                      Only users with these email domains can join
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example.edu"
                      />
                      <Button onClick={addDomain} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(settings.security?.allowedDomains || []).map((domain) => (
                        <span
                          key={domain}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
                        >
                          @{domain}
                          <button
                            onClick={() => removeDomain(domain)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {(settings.security?.allowedDomains || []).length === 0 && (
                        <span className="text-muted-foreground text-sm">
                          No restrictions — any domain allowed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SettingsCard>
            )}

            {activeTab === "integrations" && (
              <SettingsCard key="integrations" title="Integrations" icon={LinkIcon}>
                <div className="space-y-6">
                  <IntegrationRow
                    name="Slack"
                    bg="#4A154B"
                    icon="#"
                    value={settings.integrations?.slackWebhook || ""}
                    onChange={(v) => updateIntegration("slackWebhook", v)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <IntegrationRow
                    name="Discord"
                    bg="#5865F2"
                    icon="D"
                    value={settings.integrations?.discordWebhook || ""}
                    onChange={(v) => updateIntegration("discordWebhook", v)}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                  <IntegrationRow
                    name="Custom Webhook"
                    bg="#6b7280"
                    icon="→"
                    value={settings.integrations?.customWebhook || ""}
                    onChange={(v) => updateIntegration("customWebhook", v)}
                    placeholder="https://your-server.com/webhook"
                  />
                </div>
              </SettingsCard>
            )}

            {activeTab === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl border border-red-500/30 bg-red-500/5 p-6"
              >
                <h2 className="text-xl font-semibold text-red-600 mb-6 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <h3 className="font-medium mb-2">Archive Team</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Archive this team to hide it from all members. You can restore it later.
                    </p>
                    <Button variant="outline" className="bg-yellow-500/10 text-yellow-700">
                      Archive Team
                    </Button>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-red-500/30">
                    <h3 className="font-medium mb-2">Delete Team</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Permanently delete this team and all its data. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Team
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              className="bg-background rounded-xl border border-red-500/30 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Delete Team?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                This will permanently delete the team &ldquo;{settings.general?.name}
                &rdquo; and all associated data including:
              </p>
              <ul className="text-muted-foreground text-sm mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  All papers and collections
                </li>
                <li className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  Member data and permissions
                </li>
                <li className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  Activity history and analytics
                </li>
              </ul>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-xl border bg-card p-6"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Icon className="h-5 w-5 text-purple-500" />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function ToggleRow({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors shrink-0",
          enabled ? "bg-purple-500" : "bg-muted"
        )}
        aria-label={label}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

function IntegrationRow({
  name,
  bg,
  icon,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  bg: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: bg }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-muted-foreground text-sm">
            Send notifications to a {name} channel
          </p>
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
