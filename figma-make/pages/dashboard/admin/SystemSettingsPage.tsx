"use client";

import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Database,
  Globe,
  HardDrive,
  Lock,
  Mail,
  Save,
  Server,
  Settings,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";

// ============================================================================
// Default User for Demo (Admin)
// ============================================================================
const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  image: undefined,
  role: "admin" as const,
};

interface SystemSettingsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Settings Data Types
// ============================================================================
interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultUserRole: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
}

interface SecuritySettings {
  enforcePasswordPolicy: boolean;
  minPasswordLength: number;
  requireMFA: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  enableRateLimit: boolean;
  rateLimitRequests: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  newUserNotifications: boolean;
  securityAlerts: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
}

interface DatabaseSettings {
  connectionPoolSize: number;
  queryTimeout: number;
  enableQueryLogging: boolean;
  backupFrequency: string;
  retentionDays: number;
  enablePgVector: boolean;
}

interface AISettings {
  enableAIFeatures: boolean;
  defaultModel: string;
  maxTokensPerRequest: number;
  enableCaching: boolean;
  cacheTTL: number;
}

// ============================================================================
// Default Settings
// ============================================================================
const defaultGeneralSettings: GeneralSettings = {
  siteName: "ScholarFlow",
  siteDescription: "AI-Powered Research Paper Collaboration Hub",
  maintenanceMode: false,
  allowRegistration: true,
  defaultUserRole: "RESEARCHER",
  maxUploadSize: 50,
  allowedFileTypes: ["pdf", "docx", "doc", "txt"],
};

const defaultSecuritySettings: SecuritySettings = {
  enforcePasswordPolicy: true,
  minPasswordLength: 8,
  requireMFA: false,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  enableRateLimit: true,
  rateLimitRequests: 100,
};

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  systemAlerts: true,
  weeklyReports: true,
  newUserNotifications: true,
  securityAlerts: true,
  smtpHost: "smtp.scholarflow.com",
  smtpPort: 587,
  smtpUser: "notifications@scholarflow.com",
};

const defaultDatabaseSettings: DatabaseSettings = {
  connectionPoolSize: 20,
  queryTimeout: 30,
  enableQueryLogging: false,
  backupFrequency: "daily",
  retentionDays: 30,
  enablePgVector: true,
};

const defaultAISettings: AISettings = {
  enableAIFeatures: true,
  defaultModel: "gpt-4o-mini",
  maxTokensPerRequest: 4096,
  enableCaching: true,
  cacheTTL: 3600,
};

// ============================================================================
// Toggle Item Component (matches SettingsPage pattern)
// ============================================================================
const ToggleItem = ({
  checked,
  onCheckedChange,
  label,
  description,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

// ============================================================================
// Settings Section Component
// ============================================================================
const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full rounded-xl border bg-card"
  >
    <div className="p-6 border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// ============================================================================
// System Settings Page Component
// ============================================================================
export function SystemSettingsPage({
  onNavigate,
  role: propRole,
}: SystemSettingsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "notifications" | "database" | "ai"
  >("general");
  const [generalSettings, setGeneralSettings] = useState(
    defaultGeneralSettings
  );
  const [securitySettings, setSecuritySettings] = useState(
    defaultSecuritySettings
  );
  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings
  );
  const [databaseSettings, setDatabaseSettings] = useState(
    defaultDatabaseSettings
  );
  const [aiSettings, setAISettings] = useState(defaultAISettings);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "database", label: "Database", icon: Database },
    { id: "ai", label: "AI Features", icon: Sparkles },
  ] as const;

  const handleSave = () => {
    setSaveStatus("saving");
    // Simulate save
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/admin/settings"
    >
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">
                Configure system-wide settings and preferences
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              saveStatus === "saved"
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {saveStatus === "saving" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Settings className="h-4 w-4" />
                </motion.div>
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <SettingsSection
            title="General Settings"
            description="Basic platform configuration"
            icon={Globe}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Site Name</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onCheckedChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Default User Role
                  </label>
                  <select
                    value={generalSettings.defaultUserRole}
                    onCheckedChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        defaultUserRole: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="RESEARCHER">Researcher</option>
                    <option value="PRO_RESEARCHER">Pro Researcher</option>
                    <option value="TEAM_LEAD">Team Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Site Description</label>
                <textarea
                  value={generalSettings.siteDescription}
                  onCheckedChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      siteDescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Max Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    value={generalSettings.maxUploadSize}
                    onCheckedChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        maxUploadSize: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    value={generalSettings.allowedFileTypes.join(", ")}
                    onCheckedChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        allowedFileTypes: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                    placeholder="pdf, docx, doc"
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-6">
                <ToggleItem
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(value) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: value,
                    })
                  }
                  label="Maintenance Mode"
                  description="Disable access for non-admin users"
                />
                <ToggleItem
                  checked={generalSettings.allowRegistration}
                  onCheckedChange={(value) =>
                    setGeneralSettings({
                      ...generalSettings,
                      allowRegistration: value,
                    })
                  }
                  label="Allow Registration"
                  description="Allow new users to create accounts"
                />
              </div>
            </div>
          </SettingsSection>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <SettingsSection
            title="Security Settings"
            description="Authentication and access control"
            icon={Shield}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={securitySettings.minPasswordLength}
                    onCheckedChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        minPasswordLength: parseInt(e.target.value) || 8,
                      })
                    }
                    min={6}
                    max={32}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onCheckedChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value) || 60,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onCheckedChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        maxLoginAttempts: parseInt(e.target.value) || 5,
                      })
                    }
                    min={3}
                    max={10}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Rate Limit (requests/min)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.rateLimitRequests}
                    onCheckedChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        rateLimitRequests: parseInt(e.target.value) || 100,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-6">
                <ToggleItem
                  checked={securitySettings.enforcePasswordPolicy}
                  onCheckedChange={(value) =>
                    setSecuritySettings({
                      ...securitySettings,
                      enforcePasswordPolicy: value,
                    })
                  }
                  label="Enforce Password Policy"
                  description="Require complex passwords with special characters"
                />
                <ToggleItem
                  checked={securitySettings.requireMFA}
                  onCheckedChange={(value) =>
                    setSecuritySettings({
                      ...securitySettings,
                      requireMFA: value,
                    })
                  }
                  label="Require Multi-Factor Authentication"
                  description="Force all users to enable MFA"
                />
                <ToggleItem
                  checked={securitySettings.enableRateLimit}
                  onCheckedChange={(value) =>
                    setSecuritySettings({
                      ...securitySettings,
                      enableRateLimit: value,
                    })
                  }
                  label="Enable Rate Limiting"
                  description="Protect against brute force attacks"
                />
              </div>
            </div>
          </SettingsSection>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <SettingsSection
            title="Notification Settings"
            description="Email and alert configuration"
            icon={Bell}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.smtpHost}
                    onCheckedChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smtpHost: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SMTP Port</label>
                  <input
                    type="number"
                    value={notificationSettings.smtpPort}
                    onCheckedChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smtpPort: parseInt(e.target.value) || 587,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={notificationSettings.smtpUser}
                  onCheckedChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smtpUser: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="border-t pt-6 space-y-6">
                <ToggleItem
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: value,
                    })
                  }
                  label="Email Notifications"
                  description="Send email notifications to users"
                />
                <ToggleItem
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: value,
                    })
                  }
                  label="System Alerts"
                  description="Receive alerts for system events"
                />
                <ToggleItem
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: value,
                    })
                  }
                  label="Weekly Reports"
                  description="Send weekly usage reports to admins"
                />
                <ToggleItem
                  checked={notificationSettings.newUserNotifications}
                  onCheckedChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newUserNotifications: value,
                    })
                  }
                  label="New User Notifications"
                  description="Notify admins when new users register"
                />
                <ToggleItem
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      securityAlerts: value,
                    })
                  }
                  label="Security Alerts"
                  description="Receive alerts for suspicious activity"
                />
              </div>
            </div>
          </SettingsSection>
        )}

        {/* Database Settings */}
        {activeTab === "database" && (
          <SettingsSection
            title="Database Settings"
            description="PostgreSQL configuration and backups"
            icon={Database}
          >
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Caution: Database Settings
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Changes to database settings may affect application
                    performance. Proceed with caution.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">
                    Connection Pool Size
                  </label>
                  <input
                    type="number"
                    value={databaseSettings.connectionPoolSize}
                    onCheckedChange={(e) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        connectionPoolSize: parseInt(e.target.value) || 20,
                      })
                    }
                    min={5}
                    max={100}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Query Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={databaseSettings.queryTimeout}
                    onCheckedChange={(e) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        queryTimeout: parseInt(e.target.value) || 30,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Backup Frequency
                  </label>
                  <select
                    value={databaseSettings.backupFrequency}
                    onCheckedChange={(e) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        backupFrequency: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    value={databaseSettings.retentionDays}
                    onCheckedChange={(e) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        retentionDays: parseInt(e.target.value) || 30,
                      })
                    }
                    min={7}
                    max={365}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-6">
                <ToggleItem
                  checked={databaseSettings.enableQueryLogging}
                  onCheckedChange={(value) =>
                    setDatabaseSettings({
                      ...databaseSettings,
                      enableQueryLogging: value,
                    })
                  }
                  label="Enable Query Logging"
                  description="Log all database queries for debugging"
                />
                <ToggleItem
                  checked={databaseSettings.enablePgVector}
                  onCheckedChange={(value) =>
                    setDatabaseSettings({
                      ...databaseSettings,
                      enablePgVector: value,
                    })
                  }
                  label="Enable pgvector Extension"
                  description="Vector embeddings for AI-powered search"
                />
              </div>
            </div>
          </SettingsSection>
        )}

        {/* AI Settings */}
        {activeTab === "ai" && (
          <SettingsSection
            title="AI Features"
            description="Configure AI-powered capabilities"
            icon={Sparkles}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">
                    Default AI Model
                  </label>
                  <select
                    value={aiSettings.defaultModel}
                    onCheckedChange={(e) =>
                      setAISettings({
                        ...aiSettings,
                        defaultModel: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="gemini-2.5-flash-lite">
                      Gemini 2.5 Flash Lite
                    </option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Max Tokens per Request
                  </label>
                  <input
                    type="number"
                    value={aiSettings.maxTokensPerRequest}
                    onCheckedChange={(e) =>
                      setAISettings({
                        ...aiSettings,
                        maxTokensPerRequest: parseInt(e.target.value) || 4096,
                      })
                    }
                    min={256}
                    max={32000}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Response Cache TTL (seconds)
                  </label>
                  <input
                    type="number"
                    value={aiSettings.cacheTTL}
                    onCheckedChange={(e) =>
                      setAISettings({
                        ...aiSettings,
                        cacheTTL: parseInt(e.target.value) || 3600,
                      })
                    }
                    min={60}
                    max={86400}
                    className="mt-1 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-6">
                <ToggleItem
                  checked={aiSettings.enableAIFeatures}
                  onCheckedChange={(value) =>
                    setAISettings({ ...aiSettings, enableAIFeatures: value })
                  }
                  label="Enable AI Features"
                  description="Turn on AI-powered analysis and chat"
                />
                <ToggleItem
                  checked={aiSettings.enableCaching}
                  onCheckedChange={(value) =>
                    setAISettings({ ...aiSettings, enableCaching: value })
                  }
                  label="Enable Response Caching"
                  description="Cache AI responses to reduce costs"
                />
              </div>
            </div>
          </SettingsSection>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SystemSettingsPage;
