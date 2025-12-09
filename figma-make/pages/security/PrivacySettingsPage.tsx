"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  History,
  Lock,
  Mail,
  RefreshCw,
  Settings,
  Share2,
  Shield,
  Trash2,
  Users,
  UserX,
} from "lucide-react";
import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface PrivacySettingsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock data
const mockPrivacySettings = {
  profileVisibility: "public" as "public" | "team" | "private",
  showEmail: false,
  showActivity: true,
  showResearchInterests: true,
  showPublications: true,
  showCitations: false,
  allowTagging: true,
  allowMentions: true,
  showOnlineStatus: true,
};

const mockDataSharing = {
  shareWithTeam: true,
  shareAnonymousUsage: true,
  shareResearchTrends: false,
  allowAIAnalysis: true,
  allowThirdPartyIntegrations: false,
  allowEmailMarketing: false,
  allowProductUpdates: true,
};

const mockDataRetention = {
  searchHistoryDays: 90,
  activityLogDays: 365,
  deletedPapersDays: 30,
  sessionDataDays: 7,
};

const mockConnectedApps = [
  {
    id: "1",
    name: "Zotero",
    icon: "📚",
    connectedAt: "2024-10-15",
    permissions: ["Read papers", "Write citations"],
    lastAccess: "2024-11-25",
  },
  {
    id: "2",
    name: "Google Scholar",
    icon: "🎓",
    connectedAt: "2024-09-20",
    permissions: ["Read profile", "Import papers"],
    lastAccess: "2024-11-28",
  },
  {
    id: "3",
    name: "ORCID",
    icon: "🆔",
    connectedAt: "2024-08-05",
    permissions: ["Read profile", "Write publications"],
    lastAccess: "2024-11-27",
  },
];

const mockDataExportHistory = [
  {
    id: "1",
    type: "Full Export",
    requestedAt: "2024-11-20",
    status: "completed",
    size: "245 MB",
    expiresAt: "2024-12-20",
  },
  {
    id: "2",
    type: "Papers Only",
    requestedAt: "2024-10-15",
    status: "completed",
    size: "180 MB",
    expiresAt: "2024-11-15",
  },
  {
    id: "3",
    type: "Research Notes",
    requestedAt: "2024-11-28",
    status: "processing",
    size: "-",
    expiresAt: "-",
  },
];

export const PrivacySettingsPage: React.FC<PrivacySettingsPageProps> = ({
  onNavigate,
  role = "researcher",
}) => {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [privacySettings, setPrivacySettings] = useState(mockPrivacySettings);
  const [dataSharing, setDataSharing] = useState(mockDataSharing);
  const [dataRetention, setDataRetention] = useState(mockDataRetention);
  const [connectedApps, setConnectedApps] = useState(mockConnectedApps);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const mockUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const sections = [
    { id: "profile", label: "Profile Privacy", icon: Eye },
    { id: "data-sharing", label: "Data Sharing", icon: Share2 },
    { id: "connected-apps", label: "Connected Apps", icon: ExternalLink },
    { id: "data-retention", label: "Data Retention", icon: Database },
    { id: "export-delete", label: "Export & Delete", icon: Download },
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleDisconnectApp = (appId: string) => {
    setConnectedApps(connectedApps.filter((app) => app.id !== appId));
    setShowDisconnectModal(null);
  };

  const handleExportData = (type: string) => {
    console.log("Exporting data:", type);
    setShowExportModal(false);
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion requested");
    setShowDeleteConfirm(false);
  };

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
  }> = ({ enabled, onChange, label, description, disabled = false }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1 pr-4">
        <p
          className={`font-medium ${disabled ? "text-gray-400" : "text-gray-900 dark:text-white"}`}
        >
          {label}
        </p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${enabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"}`}
      >
        <motion.span
          initial={false}
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0"
        />
      </button>
    </div>
  );

  const ProfilePrivacySection = () => (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          Profile Visibility
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["public", "team", "private"] as const).map((visibility) => (
            <button
              key={visibility}
              onClick={() =>
                setPrivacySettings({
                  ...privacySettings,
                  profileVisibility: visibility,
                })
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                privacySettings.profileVisibility === visibility
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {visibility === "public" && (
                  <Globe className="w-5 h-5 text-green-500" />
                )}
                {visibility === "team" && (
                  <Users className="w-5 h-5 text-blue-500" />
                )}
                {visibility === "private" && (
                  <Lock className="w-5 h-5 text-orange-500" />
                )}
                <span className="font-medium capitalize text-gray-900 dark:text-white">
                  {visibility}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
                {visibility === "public" && "Anyone can view your profile"}
                {visibility === "team" && "Only team members can view"}
                {visibility === "private" && "Only you can view your profile"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Elements Visibility */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-500" />
          Profile Elements
        </h3>
        <ToggleSwitch
          enabled={privacySettings.showEmail}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, showEmail: value })
          }
          label="Show Email Address"
          description="Display your email on your public profile"
        />
        <ToggleSwitch
          enabled={privacySettings.showActivity}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, showActivity: value })
          }
          label="Show Recent Activity"
          description="Let others see your recent papers and collections"
        />
        <ToggleSwitch
          enabled={privacySettings.showResearchInterests}
          onChange={(value) =>
            setPrivacySettings({
              ...privacySettings,
              showResearchInterests: value,
            })
          }
          label="Show Research Interests"
          description="Display your research areas and topics"
        />
        <ToggleSwitch
          enabled={privacySettings.showPublications}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, showPublications: value })
          }
          label="Show Publications"
          description="Show your publication count and h-index"
        />
        <ToggleSwitch
          enabled={privacySettings.showCitations}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, showCitations: value })
          }
          label="Show Citation Metrics"
          description="Display your citation statistics"
        />
      </div>

      {/* Interaction Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Interaction Settings
        </h3>
        <ToggleSwitch
          enabled={privacySettings.allowTagging}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, allowTagging: value })
          }
          label="Allow Tagging"
          description="Let team members tag you in papers and notes"
        />
        <ToggleSwitch
          enabled={privacySettings.allowMentions}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, allowMentions: value })
          }
          label="Allow Mentions"
          description="Allow @mentions in discussions and comments"
        />
        <ToggleSwitch
          enabled={privacySettings.showOnlineStatus}
          onChange={(value) =>
            setPrivacySettings({ ...privacySettings, showOnlineStatus: value })
          }
          label="Show Online Status"
          description="Display when you're online to team members"
        />
      </div>
    </div>
  );

  const DataSharingSection = () => (
    <div className="space-y-6">
      {/* Research Data Sharing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-500" />
          Research Data Sharing
        </h3>
        <ToggleSwitch
          enabled={dataSharing.shareWithTeam}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, shareWithTeam: value })
          }
          label="Share with Team"
          description="Share your research activity with team members"
        />
        <ToggleSwitch
          enabled={dataSharing.shareAnonymousUsage}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, shareAnonymousUsage: value })
          }
          label="Anonymous Usage Statistics"
          description="Help improve ScholarFlow by sharing anonymous usage data"
        />
        <ToggleSwitch
          enabled={dataSharing.shareResearchTrends}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, shareResearchTrends: value })
          }
          label="Research Trends Contribution"
          description="Contribute to global research trend analysis (anonymized)"
        />
      </div>

      {/* AI & Integrations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          AI & Integrations
        </h3>
        <ToggleSwitch
          enabled={dataSharing.allowAIAnalysis}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, allowAIAnalysis: value })
          }
          label="AI Paper Analysis"
          description="Allow AI to analyze your papers for better insights"
        />
        <ToggleSwitch
          enabled={dataSharing.allowThirdPartyIntegrations}
          onChange={(value) =>
            setDataSharing({
              ...dataSharing,
              allowThirdPartyIntegrations: value,
            })
          }
          label="Third-Party Integrations"
          description="Allow connected apps to access your data"
        />
      </div>

      {/* Communication Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          Communication Preferences
        </h3>
        <ToggleSwitch
          enabled={dataSharing.allowEmailMarketing}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, allowEmailMarketing: value })
          }
          label="Marketing Emails"
          description="Receive promotional emails and research news"
        />
        <ToggleSwitch
          enabled={dataSharing.allowProductUpdates}
          onChange={(value) =>
            setDataSharing({ ...dataSharing, allowProductUpdates: value })
          }
          label="Product Updates"
          description="Get notified about new features and improvements"
        />
      </div>
    </div>
  );

  const ConnectedAppsSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-indigo-500" />
            Connected Applications
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {connectedApps.length} apps connected
          </span>
        </div>

        <div className="space-y-4">
          {connectedApps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{app.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {app.name}
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connected {new Date(app.connectedAt).toLocaleDateString()}
                    </p>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last access{" "}
                      {new Date(app.lastAccess).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === app.id ? null : app.id
                    )
                  }
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Permissions
                  <ChevronDown
                    className={`w-4 h-4 inline ml-1 transition-transform ${
                      expandedSection === app.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setShowDisconnectModal(app.id)}
                  className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          ))}

          {connectedApps.length === 0 && (
            <div className="text-center py-8">
              <ExternalLink className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No apps connected
              </p>
              <button
                onClick={() => onNavigate("/settings/integrations")}
                className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
              >
                Browse integrations
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {expandedSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                App Permissions
              </h5>
              <ul className="space-y-2">
                {connectedApps
                  .find((app) => app.id === expandedSection)
                  ?.permissions.map((perm, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {perm}
                    </li>
                  ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add New App */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect More Apps
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enhance your research workflow by connecting with more tools and
          services.
        </p>
        <button
          onClick={() => onNavigate("/settings/integrations")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Browse Integrations
        </button>
      </div>
    </div>
  );

  const DataRetentionSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          Data Retention Settings
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Control how long we keep your data. Shorter retention means less data
          stored but may affect features that rely on history.
        </p>

        {[
          {
            key: "searchHistoryDays",
            label: "Search History",
            description: "How long to keep your search queries",
            options: [7, 30, 90, 180, 365],
          },
          {
            key: "activityLogDays",
            label: "Activity Log",
            description: "Duration to maintain activity records",
            options: [30, 90, 180, 365, 730],
          },
          {
            key: "deletedPapersDays",
            label: "Deleted Papers",
            description: "Recovery period for deleted papers",
            options: [7, 14, 30, 60, 90],
          },
          {
            key: "sessionDataDays",
            label: "Session Data",
            description: "Login session history retention",
            options: [1, 7, 14, 30, 90],
          },
        ].map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {setting.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
            <select
              value={dataRetention[setting.key as keyof typeof dataRetention]}
              onChange={(e) =>
                setDataRetention({
                  ...dataRetention,
                  [setting.key]: parseInt(e.target.value),
                })
              }
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {setting.options.map((days) => (
                <option key={days} value={days}>
                  {days < 30
                    ? `${days} day${days > 1 ? "s" : ""}`
                    : days < 365
                      ? `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""}`
                      : `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Data Cleanup */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          Data Cleanup
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Manually clear specific types of data from your account.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Clear Search History",
              icon: History,
              count: "234 queries",
            },
            {
              label: "Clear Reading History",
              icon: FileText,
              count: "89 papers",
            },
            {
              label: "Clear AI Conversations",
              icon: Settings,
              count: "12 chats",
            },
            {
              label: "Clear Downloaded Files",
              icon: Download,
              count: "1.2 GB",
            },
          ].map((item, idx) => (
            <button
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count}
                  </p>
                </div>
              </div>
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ExportDeleteSection = () => (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-500" />
          Export Your Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Download a copy of your data in machine-readable format. This includes
          papers, collections, notes, and profile information.
        </p>
        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Request Data Export
        </button>

        {/* Export History */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Export History
          </h4>
          <div className="space-y-3">
            {mockDataExportHistory.map((export_) => (
              <div
                key={export_.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {export_.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-5 h-5 text-indigo-500" />
                    </motion.div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {export_.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Requested{" "}
                      {new Date(export_.requestedAt).toLocaleDateString()}
                      {export_.status === "completed" && ` • ${export_.size}`}
                    </p>
                  </div>
                </div>
                {export_.status === "completed" && (
                  <button className="px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Delete Account
        </h3>
        <p className="text-red-700 dark:text-red-400 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">
            What will be deleted:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
            <li>• All uploaded papers and documents</li>
            <li>• Collections and research notes</li>
            <li>• Account settings and preferences</li>
            <li>• Subscription and billing history</li>
            <li>• Team memberships (you'll be removed from all teams)</li>
          </ul>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfilePrivacySection />;
      case "data-sharing":
        return <DataSharingSection />;
      case "connected-apps":
        return <ConnectedAppsSection />;
      case "data-retention":
        return <DataRetentionSection />;
      case "export-delete":
        return <ExportDeleteSection />;
      default:
        return <ProfilePrivacySection />;
    }
  };

  return (
    <DashboardLayout user={mockUser} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Privacy Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Control your privacy, data sharing, and account security
              </p>
            </div>
          </div>

          {lastSaved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Last saved {lastSaved.toLocaleTimeString()}
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              <nav className="divide-y divide-gray-100 dark:divide-gray-700">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>

              {/* Save Button */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Export Your Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose what data you'd like to export. The export will be
                prepared and you'll receive an email when it's ready.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  {
                    id: "full",
                    label: "Full Export",
                    desc: "All data including papers, notes, and settings",
                  },
                  {
                    id: "papers",
                    label: "Papers Only",
                    desc: "All uploaded papers and metadata",
                  },
                  {
                    id: "notes",
                    label: "Research Notes",
                    desc: "Notes, annotations, and highlights",
                  },
                  {
                    id: "profile",
                    label: "Profile Data",
                    desc: "Account info and preferences",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleExportData(option.id)}
                    className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.desc}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Delete Account?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                This action is permanent and cannot be undone. All your data
                will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disconnect App Modal */}
      <AnimatePresence>
        {showDisconnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDisconnectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <UserX className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Disconnect App?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                This app will no longer have access to your ScholarFlow data.
                You can reconnect it anytime from the integrations page.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisconnectModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDisconnectApp(showDisconnectModal)}
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default PrivacySettingsPage;
