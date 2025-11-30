"use client";

/**
 * TeamInvitationsPage - Manage team and workspace invitations
 *
 * Features:
 * - Pending invitations list
 * - Accept/decline invitations
 * - Invitation details with workspace info
 * - Invitation history
 * - Invite team members
 * - Invitation link generation
 * - Role-based invitation filtering
 * - Framer Motion animations
 */

import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Folder,
  Link,
  Mail,
  RefreshCw,
  Search,
  Send,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface TeamInvitationsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Invitation types
interface Invitation {
  id: string;
  type: "received" | "sent";
  workspace: {
    id: string;
    name: string;
    color: string;
    membersCount: number;
    image?: string;
  };
  inviter?: {
    name: string;
    email: string;
    avatar?: string;
  };
  invitee?: {
    name: string;
    email: string;
    avatar?: string;
  };
  role: "viewer" | "editor" | "admin";
  status: "pending" | "accepted" | "declined" | "expired";
  message?: string;
  createdAt: Date;
  expiresAt: Date;
}

// Mock invitations data
const mockInvitations: Invitation[] = [
  {
    id: "inv1",
    type: "received",
    workspace: {
      id: "ws1",
      name: "Machine Learning Research Group",
      color: "blue",
      membersCount: 12,
    },
    inviter: {
      name: "Dr. James Wilson",
      email: "j.wilson@mit.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    },
    role: "editor",
    status: "pending",
    message:
      "Hi Sarah! We'd love to have you join our ML research group. Your expertise in NLP would be invaluable.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  },
  {
    id: "inv2",
    type: "received",
    workspace: {
      id: "ws2",
      name: "Computer Vision Lab",
      color: "purple",
      membersCount: 8,
    },
    inviter: {
      name: "Prof. Emily Chen",
      email: "e.chen@stanford.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    role: "viewer",
    status: "pending",
    message: "Join us for our upcoming CV project collaboration!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
  },
  {
    id: "inv3",
    type: "sent",
    workspace: {
      id: "ws3",
      name: "NLP Projects",
      color: "green",
      membersCount: 5,
    },
    invitee: {
      name: "Dr. Michael Brown",
      email: "m.brown@berkeley.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    role: "editor",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "inv4",
    type: "sent",
    workspace: {
      id: "ws3",
      name: "NLP Projects",
      color: "green",
      membersCount: 5,
    },
    invitee: {
      name: "Lisa Anderson",
      email: "l.anderson@harvard.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    },
    role: "viewer",
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: "inv5",
    type: "received",
    workspace: {
      id: "ws4",
      name: "Deep Learning Workshop",
      color: "amber",
      membersCount: 20,
    },
    inviter: {
      name: "Dr. Robert Kim",
      email: "r.kim@caltech.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
    role: "admin",
    status: "expired",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // Expired 7 days ago
  },
];

// Invite modal component
function InviteModal({
  isOpen,
  onClose,
  workspaces,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaces: { id: string; name: string; color: string }[];
}) {
  const [email, setEmail] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    workspaces[0]?.id || ""
  );
  const [role, setRole] = useState<"viewer" | "editor" | "admin">("editor");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite Team Member
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@university.edu"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Workspace Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Workspace
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["viewer", "editor", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all ${
                    role === r
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {role === "viewer" && "Can view papers and collections"}
              {role === "editor" && "Can add, edit, and organize papers"}
              {role === "admin" && "Full access including member management"}
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Personal Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal note to your invitation..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!email || isSending}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSending ? "Sending..." : "Send Invitation"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Invitation card component
function InvitationCard({
  invitation,
  onAccept,
  onDecline,
  onResend,
  onCancel,
}: {
  invitation: Invitation;
  onAccept?: () => void;
  onDecline?: () => void;
  onResend?: () => void;
  onCancel?: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const isReceived = invitation.type === "received";
  const isPending = invitation.status === "pending";
  const isExpired = invitation.status === "expired";

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getExpiresIn = (date: Date) => {
    const diff = date.getTime() - Date.now();
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days left`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours left`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400";
      case "editor":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadge = () => {
    switch (invitation.status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
            <Check className="h-3 w-3" />
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
            <X className="h-3 w-3" />
            Declined
          </span>
        );
      case "expired":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" />
            Expired
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  const getWorkspaceColor = (color: string) => {
    switch (color) {
      case "blue":
        return "#3b82f6";
      case "purple":
        return "#a855f7";
      case "green":
        return "#22c55e";
      case "amber":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${
        isExpired ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Workspace Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor:
              getWorkspaceColor(invitation.workspace.color) + "20",
          }}
        >
          <Folder
            className="h-6 w-6"
            style={{ color: getWorkspaceColor(invitation.workspace.color) }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {invitation.workspace.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(invitation.role)}`}
                >
                  {invitation.role}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              <div>{getTimeAgo(invitation.createdAt)}</div>
              {isPending && (
                <div className="text-amber-600 dark:text-amber-400 mt-1">
                  {getExpiresIn(invitation.expiresAt)}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 mt-3">
            <img
              src={
                isReceived
                  ? invitation.inviter?.avatar
                  : invitation.invitee?.avatar
              }
              alt=""
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isReceived ? (
                <>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {invitation.inviter?.name}
                  </span>{" "}
                  invited you
                </>
              ) : (
                <>
                  Sent to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {invitation.invitee?.name}
                  </span>
                </>
              )}
            </span>
          </div>

          {/* Message */}
          {invitation.message && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 italic">
              "{invitation.message}"
            </p>
          )}

          {/* Actions */}
          {isPending && (
            <div className="flex items-center gap-2 mt-4">
              {isReceived ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAccept}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600"
                  >
                    <UserCheck className="h-4 w-4" />
                    Accept
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDecline}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <UserMinus className="h-4 w-4" />
                    Decline
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onResend}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                    Cancel
                  </motion.button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TeamInvitationsPage({
  onNavigate,
  role: propRole,
}: TeamInvitationsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [filter, setFilter] = useState<"all" | "received" | "sent">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "declined" | "expired"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "team_lead" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  // Available workspaces for inviting
  const workspaces = [
    { id: "ws3", name: "NLP Projects", color: "green" },
    { id: "ws5", name: "Research Group", color: "blue" },
    { id: "ws6", name: "Conference Papers", color: "purple" },
  ];

  // Filter invitations
  const filteredInvitations = invitations.filter((inv) => {
    // Type filter
    if (filter !== "all" && inv.type !== filter) return false;
    // Status filter
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesWorkspace = inv.workspace.name.toLowerCase().includes(query);
      const matchesPerson =
        inv.type === "received"
          ? inv.inviter?.name.toLowerCase().includes(query)
          : inv.invitee?.name.toLowerCase().includes(query);
      return matchesWorkspace || matchesPerson;
    }
    return true;
  });

  // Statistics
  const pendingReceived = invitations.filter(
    (i) => i.type === "received" && i.status === "pending"
  ).length;
  const pendingSent = invitations.filter(
    (i) => i.type === "sent" && i.status === "pending"
  ).length;

  const handleAccept = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "accepted" as const } : inv
      )
    );
  };

  const handleDecline = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "declined" as const } : inv
      )
    );
  };

  const handleCancel = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://scholarflow.app/invite/abc123");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Team Invitations
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Manage your workspace invitations and team collaborations
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600"
              >
                <UserPlus className="h-5 w-5" />
                Invite Member
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingReceived}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending Received
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingSent}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending Sent
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {invitations.filter((i) => i.status === "accepted").length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Accepted Total
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Invite Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Shareable Invite Link
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Anyone with this link can request to join your workspace
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invitations..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              {(["all", "received", "sent"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all ${
                    filter === f
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>

          {/* Invitations List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredInvitations.length > 0 ? (
                filteredInvitations.map((invitation, index) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                  >
                    <InvitationCard
                      invitation={invitation}
                      onAccept={() => handleAccept(invitation.id)}
                      onDecline={() => handleDecline(invitation.id)}
                      onResend={() => {}}
                      onCancel={() => handleCancel(invitation.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No invitations found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "You don't have any invitations yet"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite Someone
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            workspaces={workspaces}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default TeamInvitationsPage;
