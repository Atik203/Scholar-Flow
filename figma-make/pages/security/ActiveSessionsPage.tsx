"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  Laptop,
  LogOut,
  MapPin,
  Monitor,
  RefreshCcw,
  Shield,
  Smartphone,
  Tablet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface ActiveSessionsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "researcher" as const,
};

// Mock sessions data
interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  loginTime: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

const mockSessions: Session[] = [
  {
    id: "1",
    device: 'MacBook Pro 16"',
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "macOS Sonoma",
    location: "San Francisco, CA",
    ip: "192.168.1.***",
    lastActive: "Active now",
    loginTime: "Dec 28, 2024, 9:00 AM",
    isCurrent: true,
    isTrusted: true,
  },
  {
    id: "2",
    device: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    location: "San Francisco, CA",
    ip: "192.168.1.***",
    lastActive: "2 hours ago",
    loginTime: "Dec 27, 2024, 8:30 AM",
    isCurrent: false,
    isTrusted: true,
  },
  {
    id: "3",
    device: "Windows Desktop",
    deviceType: "desktop",
    browser: "Edge 120",
    os: "Windows 11",
    location: "Berkeley, CA",
    ip: "10.0.0.***",
    lastActive: "5 hours ago",
    loginTime: "Dec 26, 2024, 2:15 PM",
    isCurrent: false,
    isTrusted: true,
  },
  {
    id: "4",
    device: "iPad Pro",
    deviceType: "tablet",
    browser: "Safari 17",
    os: "iPadOS 17",
    location: "Oakland, CA",
    ip: "172.16.0.***",
    lastActive: "1 day ago",
    loginTime: "Dec 25, 2024, 11:00 AM",
    isCurrent: false,
    isTrusted: false,
  },
  {
    id: "5",
    device: "Android Phone",
    deviceType: "mobile",
    browser: "Chrome 120",
    os: "Android 14",
    location: "Los Angeles, CA",
    ip: "192.168.2.***",
    lastActive: "3 days ago",
    loginTime: "Dec 22, 2024, 4:45 PM",
    isCurrent: false,
    isTrusted: false,
  },
];

// Session statistics
const sessionStats = {
  totalSessions: 5,
  trustedDevices: 3,
  activeToday: 2,
  locationsUsed: 4,
};

export function ActiveSessionsPage({
  onNavigate,
  role: propRole,
}: ActiveSessionsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    setShowRevokeModal(false);
    setSelectedSession(null);
  };

  const handleRevokeAllOther = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    setShowRevokeAllModal(false);
  };

  const handleToggleTrust = (sessionId: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId ? { ...s, isTrusted: !s.isTrusted } : s
      )
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="h-5 w-5" />;
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pb-12">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate("/security")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Active Sessions
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage devices signed into your account
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCcw
                  className={`h-5 w-5 text-gray-600 dark:text-gray-300 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Sessions",
                value: sessions.length,
                icon: Monitor,
                color: "text-blue-500",
              },
              {
                label: "Trusted Devices",
                value: sessions.filter((s) => s.isTrusted).length,
                icon: Shield,
                color: "text-emerald-500",
              },
              {
                label: "Active Today",
                value: sessions.filter(
                  (s) =>
                    s.lastActive.includes("now") ||
                    s.lastActive.includes("hour")
                ).length,
                icon: Clock,
                color: "text-purple-500",
              },
              {
                label: "Locations",
                value: new Set(sessions.map((s) => s.location)).size,
                icon: MapPin,
                color: "text-amber-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current Session */}
          {currentSession && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Session
              </h2>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                    {getDeviceIcon(currentSession.deviceType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {currentSession.device}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Current
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {currentSession.browser} • {currentSession.os}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {currentSession.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {currentSession.ip}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Other Sessions ({otherSessions.length})
              </h2>
              {otherSessions.length > 0 && (
                <button
                  onClick={() => setShowRevokeAllModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out all other sessions
                </button>
              )}
            </div>

            {otherSessions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No other active sessions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're only signed in on this device
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                {otherSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          session.isTrusted
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {session.device}
                          </h3>
                          {session.isTrusted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                              <Shield className="h-3 w-3" />
                              Trusted
                            </span>
                          )}
                          {!session.isTrusted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full">
                              <AlertTriangle className="h-3 w-3" />
                              Unverified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          {session.browser} • {session.os}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {session.lastActive}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {session.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            {session.ip}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTrust(session.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            session.isTrusted
                              ? "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          title={
                            session.isTrusted ? "Remove trust" : "Trust device"
                          }
                        >
                          <Shield className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setShowRevokeModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Security Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                    Sign out of sessions you don't recognize
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                    Enable two-factor authentication for extra security
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                    Use unique passwords for your account
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                    Review sessions regularly to catch unauthorized access
                  </li>
                </ul>
                <button
                  onClick={() => onNavigate("/security/2fa")}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Set up two-factor authentication
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revoke Session Modal */}
        <AnimatePresence>
          {showRevokeModal && selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRevokeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sign out this device?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedSession.device}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  This will sign out of the session on{" "}
                  <strong>{selectedSession.device}</strong>. Anyone using this
                  device will need to sign in again.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRevokeModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRevokeSession(selectedSession.id)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revoke All Modal */}
        <AnimatePresence>
          {showRevokeAllModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRevokeAllModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sign out all other sessions?
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  This will sign out of all sessions except your current one.
                  You'll need to sign in again on other devices.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRevokeAllModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevokeAllOther}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    Sign out all
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
