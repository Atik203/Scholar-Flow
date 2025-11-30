"use client";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  FileText,
  Loader2,
  Search,
  Share2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface SharedWorkspacesPageProps {
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
// Dummy Data
// ============================================================================
const dummySharedWorkspaces = [
  {
    id: "ws-1",
    name: "Research Lab Alpha",
    owner: "John Smith",
    memberRole: "EDITOR",
    memberCount: 5,
    collectionCount: 3,
    paperCount: 42,
  },
  {
    id: "ws-2",
    name: "NLP Studies Group",
    owner: "Jane Doe",
    memberRole: "VIEWER",
    memberCount: 8,
    collectionCount: 5,
    paperCount: 28,
  },
];

const dummyReceivedInvites = [
  {
    id: "inv-1",
    workspaceId: "ws-3",
    workspaceName: "Computer Vision Team",
    invitedBy: "Emily Chen",
    invitedAt: "2024-03-15",
    role: "EDITOR",
  },
  {
    id: "inv-2",
    workspaceId: "ws-4",
    workspaceName: "AI Research Collective",
    invitedBy: "Robert Brown",
    invitedAt: "2024-03-18",
    role: "VIEWER",
  },
];

const dummySentInvites = [
  {
    id: "sent-1",
    workspaceId: "ws-5",
    workspaceName: "My Team Workspace",
    invitedEmail: "alice@example.com",
    status: "PENDING",
    sentAt: "2024-03-10",
    role: "EDITOR",
  },
  {
    id: "sent-2",
    workspaceId: "ws-5",
    workspaceName: "My Team Workspace",
    invitedEmail: "bob@example.com",
    status: "ACCEPTED",
    sentAt: "2024-03-08",
    role: "VIEWER",
  },
];

// ============================================================================
// Shared Workspaces Page Component
// ============================================================================
export function SharedWorkspacesPage({
  onNavigate,
  role: propRole,
}: SharedWorkspacesPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [activeTab, setActiveTab] = useState<"shared" | "received" | "sent">(
    "shared"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);

  const handleAccept = async (workspaceId: string) => {
    setProcessingInvite(workspaceId);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingInvite(null);
  };

  const handleDecline = async (workspaceId: string) => {
    setProcessingInvite(workspaceId);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingInvite(null);
  };

  const filteredWorkspaces = dummySharedWorkspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/workspaces/shared"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Workspaces
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Workspaces
            </h1>
            <p className="text-muted-foreground">
              Workspaces shared with you by other users
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: "shared", label: "Shared With Me" },
            { id: "received", label: "Received Invites" },
            { id: "sent", label: "Sent Invites" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "shared" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search workspaces..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Workspaces Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkspaces.map((workspace) => (
                <motion.div
                  key={workspace.id}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border bg-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workspace.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {workspace.owner}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                      {workspace.memberRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {workspace.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {workspace.collectionCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {workspace.paperCount}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Open Workspace
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {filteredWorkspaces.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No shared workspaces</p>
                <p className="text-sm mt-1">
                  Workspaces shared with you will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "received" && (
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Pending Invitations
              </h3>
            </div>
            <div className="p-4">
              {dummyReceivedInvites.length > 0 ? (
                <ul className="space-y-3">
                  {dummyReceivedInvites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.workspaceName}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited by {invite.invitedBy} as {invite.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invite.invitedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAccept(invite.workspaceId)}
                          disabled={processingInvite === invite.workspaceId}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                        >
                          {processingInvite === invite.workspaceId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDecline(invite.workspaceId)}
                          disabled={processingInvite === invite.workspaceId}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending invitations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sent" && (
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Sent Invitations
              </h3>
            </div>
            <div className="p-4">
              {dummySentInvites.length > 0 ? (
                <ul className="space-y-3">
                  {dummySentInvites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.workspaceName}</p>
                          <p className="text-sm text-muted-foreground">
                            To: {invite.invitedEmail} • Role: {invite.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sent: {invite.sentAt}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          invite.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        )}
                      >
                        {invite.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sent invitations.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SharedWorkspacesPage;
