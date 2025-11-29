"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  EyeOff,
  Fingerprint,
  Globe,
  History,
  Key,
  Laptop,
  LogOut,
  Monitor,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tablet,
  User,
} from "lucide-react";
import React, { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface SecurityDashboardPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "password_change"
    | "2fa_enabled"
    | "session_expired"
    | "suspicious"
    | "api_key";
  description: string;
  timestamp: string;
  location: string;
  device: string;
  ip: string;
  success: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: "good" | "warning" | "critical";
  action?: string;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "login",
    description: "Successful login from new device",
    timestamp: "2 hours ago",
    location: "San Francisco, CA",
    device: "MacBook Pro",
    ip: "192.168.1.105",
    success: true,
  },
  {
    id: "2",
    type: "password_change",
    description: "Password changed successfully",
    timestamp: "Yesterday",
    location: "San Francisco, CA",
    device: "MacBook Pro",
    ip: "192.168.1.105",
    success: true,
  },
  {
    id: "3",
    type: "suspicious",
    description: "Blocked login attempt from unknown location",
    timestamp: "2 days ago",
    location: "Lagos, Nigeria",
    device: "Unknown",
    ip: "41.190.2.45",
    success: false,
  },
  {
    id: "4",
    type: "2fa_enabled",
    description: "Two-factor authentication enabled",
    timestamp: "1 week ago",
    location: "San Francisco, CA",
    device: "iPhone 15 Pro",
    ip: "192.168.1.110",
    success: true,
  },
  {
    id: "5",
    type: "api_key",
    description: "New API key generated",
    timestamp: "2 weeks ago",
    location: "San Francisco, CA",
    device: "MacBook Pro",
    ip: "192.168.1.105",
    success: true,
  },
];

const mockActiveSessions: ActiveSession[] = [
  {
    id: "s1",
    device: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 120",
    location: "San Francisco, CA",
    ip: "192.168.1.105",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "s2",
    device: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari",
    location: "San Francisco, CA",
    ip: "192.168.1.110",
    lastActive: "5 minutes ago",
    isCurrent: false,
  },
  {
    id: "s3",
    device: "Windows Desktop",
    deviceType: "desktop",
    browser: "Firefox 121",
    location: "New York, NY",
    ip: "45.67.89.123",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

const mockSecurityChecks: SecurityCheck[] = [
  {
    id: "c1",
    name: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
    status: "good",
  },
  {
    id: "c2",
    name: "Password Strength",
    description: "Your password meets all security requirements",
    status: "good",
  },
  {
    id: "c3",
    name: "Recovery Email",
    description: "Add a recovery email for account recovery",
    status: "warning",
    action: "Add email",
  },
  {
    id: "c4",
    name: "Trusted Devices",
    description: "Review devices that have access to your account",
    status: "warning",
    action: "Review",
  },
  {
    id: "c5",
    name: "API Keys",
    description: "Some API keys haven't been used in 90 days",
    status: "warning",
    action: "Review keys",
  },
];

const eventTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  login: {
    icon: <User className="h-4 w-4" />,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  },
  password_change: {
    icon: <Key className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  },
  "2fa_enabled": {
    icon: <Shield className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
  },
  session_expired: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-900/30",
  },
  suspicious: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-red-500 bg-red-100 dark:bg-red-900/30",
  },
  api_key: {
    icon: <Key className="h-4 w-4" />,
    color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
  },
};

const deviceTypeIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="h-5 w-5" />,
  mobile: <Smartphone className="h-5 w-5" />,
  tablet: <Tablet className="h-5 w-5" />,
};

const defaultUser = {
  name: "John Researcher",
  email: "john@research.edu",
  role: "pro_researcher" as const,
};

export function SecurityDashboardPage({
  onNavigate,
  role: propRole,
}: SecurityDashboardPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(
    null
  );
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const securityScore = 85;
  const goodChecks = mockSecurityChecks.filter(
    (c) => c.status === "good"
  ).length;
  const warningChecks = mockSecurityChecks.filter(
    (c) => c.status === "warning"
  ).length;

  const handleRevokeSession = (session: ActiveSession) => {
    setSelectedSession(session);
    setShowRevokeModal(true);
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Security
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account security and privacy settings
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("/privacy")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                     text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Privacy Settings
          </button>
        </motion.div>

        {/* Security Score & Quick Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Security Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
              Security Score
            </h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-100 dark:text-slate-700"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 56 * (1 - securityScore / 100),
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {securityScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="text-center">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                           bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              >
                <ShieldCheck className="h-4 w-4" />
                Good
              </span>
            </div>
          </motion.div>

          {/* Security Checks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Security Checklist
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle className="h-4 w-4" /> {goodChecks} passed
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <AlertTriangle className="h-4 w-4" /> {warningChecks} warnings
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {mockSecurityChecks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        check.status === "good"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"
                          : check.status === "warning"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500"
                            : "bg-red-100 dark:bg-red-900/30 text-red-500"
                      }`}
                    >
                      {check.status === "good" ? (
                        <Check className="h-4 w-4" />
                      ) : check.status === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {check.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {check.description}
                      </p>
                    </div>
                  </div>
                  {check.action && (
                    <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      {check.action}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: "Change Password",
              icon: <Key className="h-5 w-5" />,
              color: "from-blue-500 to-indigo-600",
              path: "/settings",
            },
            {
              label: "Setup 2FA",
              icon: <Fingerprint className="h-5 w-5" />,
              color: "from-emerald-500 to-teal-600",
              path: "/security/2fa",
            },
            {
              label: "Active Sessions",
              icon: <Monitor className="h-5 w-5" />,
              color: "from-purple-500 to-violet-600",
              path: "/security/sessions",
            },
            {
              label: "Privacy Settings",
              icon: <EyeOff className="h-5 w-5" />,
              color: "from-amber-500 to-orange-600",
              path: "/privacy",
            },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => onNavigate(action.path)}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800
                       border border-slate-200 dark:border-slate-700
                       hover:shadow-lg transition-shadow group"
            >
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white`}
              >
                {action.icon}
              </div>
              <span className="font-medium text-slate-900 dark:text-white">
                {action.label}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </motion.button>
          ))}
        </motion.div>

        {/* Active Sessions & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-indigo-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Active Sessions
                </h2>
              </div>
              <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                Sign out all
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {mockActiveSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${
                        session.isCurrent
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                      }`}
                    >
                      {deviceTypeIcons[session.deviceType]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {session.device}
                        </p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {session.browser} • {session.location}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {session.ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {session.lastActive}
                        </span>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Recent Security Activity
                </h2>
              </div>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
              {mockSecurityEvents.map((event, index) => {
                const config = eventTypeConfig[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedEvent(
                        expandedEvent === event.id ? null : event.id
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {event.description}
                          </p>
                          {!event.success && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{event.timestamp}</span>
                          <span>{event.location}</span>
                        </div>

                        <AnimatePresence>
                          {expandedEvent === event.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700"
                            >
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-slate-400">
                                    Device:
                                  </span>
                                  <span className="ml-2 text-slate-600 dark:text-slate-300">
                                    {event.device}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400">IP:</span>
                                  <span className="ml-2 text-slate-600 dark:text-slate-300 font-mono">
                                    {event.ip}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          expandedEvent === event.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                   border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
              <ShieldAlert className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Security Tips
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Enable two-factor authentication for an extra layer of
                  protection
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Review your active sessions regularly and remove unfamiliar
                  devices
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Use a unique, strong password and consider a password manager
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Revoke Session Modal */}
        <AnimatePresence>
          {showRevokeModal && selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRevokeModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                    <LogOut className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Sign Out Device
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {selectedSession.device}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to sign out this device? The user will
                  need to sign in again to access their account.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRevokeModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 
                             text-slate-700 dark:text-slate-300 font-medium
                             hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowRevokeModal(false);
                      // Handle revoke
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium
                             hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default SecurityDashboardPage;
