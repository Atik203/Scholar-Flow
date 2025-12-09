"use client";

import {
  Clock,
  Crown,
  Mail,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Shield,
  Tag,
  Trash2,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface TeamMembersPageProps {
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
  onNavigate?: (path: string) => void;
}

type MemberStatus = "active" | "pending" | "inactive" | "invited";
type MemberRole = "admin" | "team_lead" | "member" | "viewer";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  lastActive?: string;
  papersCount: number;
  annotationsCount: number;
  workspaces: string[];
  invitedBy?: string;
  isCurrentUser?: boolean;
}

interface Invitation {
  id: string;
  email: string;
  role: MemberRole;
  sentAt: string;
  expiresAt: string;
  sentBy: string;
  status: "pending" | "expired" | "accepted";
}

// ============================================================================
// Sample Data
// ============================================================================
const sampleTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-15T10:00:00Z",
    lastActive: "2025-01-10T14:30:00Z",
    papersCount: 47,
    annotationsCount: 234,
    workspaces: ["AI Research Lab", "ML Foundations"],
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "Prof. Michael Rodriguez",
    email: "m.rodriguez@research.org",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "team_lead",
    status: "active",
    joinedAt: "2024-02-20T09:15:00Z",
    lastActive: "2025-01-10T11:45:00Z",
    papersCount: 32,
    annotationsCount: 156,
    workspaces: ["AI Research Lab", "NLP Studies"],
  },
  {
    id: "3",
    name: "Emily Watson",
    email: "emily.w@lab.edu",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "member",
    status: "active",
    joinedAt: "2024-03-10T14:20:00Z",
    lastActive: "2025-01-09T16:00:00Z",
    papersCount: 18,
    annotationsCount: 89,
    workspaces: ["ML Foundations"],
  },
  {
    id: "4",
    name: "James Liu",
    email: "james.liu@university.edu",
    role: "member",
    status: "active",
    joinedAt: "2024-04-05T08:30:00Z",
    lastActive: "2025-01-08T09:15:00Z",
    papersCount: 12,
    annotationsCount: 45,
    workspaces: ["AI Research Lab"],
  },
  {
    id: "5",
    name: "Ana Martinez",
    email: "ana.m@research.org",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    role: "viewer",
    status: "pending",
    joinedAt: "2025-01-05T11:00:00Z",
    papersCount: 0,
    annotationsCount: 0,
    workspaces: [],
    invitedBy: "Dr. Sarah Chen",
  },
  {
    id: "6",
    name: "Robert Kim",
    email: "r.kim@lab.edu",
    role: "member",
    status: "inactive",
    joinedAt: "2024-06-15T13:45:00Z",
    lastActive: "2024-12-01T10:00:00Z",
    papersCount: 8,
    annotationsCount: 23,
    workspaces: ["NLP Studies"],
  },
];

const sampleInvitations: Invitation[] = [
  {
    id: "inv-1",
    email: "new.researcher@university.edu",
    role: "member",
    sentAt: "2025-01-08T10:00:00Z",
    expiresAt: "2025-01-15T10:00:00Z",
    sentBy: "Dr. Sarah Chen",
    status: "pending",
  },
  {
    id: "inv-2",
    email: "collaborator@research.org",
    role: "viewer",
    sentAt: "2025-01-05T14:30:00Z",
    expiresAt: "2025-01-12T14:30:00Z",
    sentBy: "Prof. Michael Rodriguez",
    status: "pending",
  },
  {
    id: "inv-3",
    email: "old.invite@lab.edu",
    role: "member",
    sentAt: "2024-12-20T09:00:00Z",
    expiresAt: "2024-12-27T09:00:00Z",
    sentBy: "Dr. Sarah Chen",
    status: "expired",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function getRoleColor(role: MemberRole): string {
  const colors = {
    admin: "bg-red-500/10 text-red-600 border-red-200",
    team_lead: "bg-purple-500/10 text-purple-600 border-purple-200",
    member: "bg-blue-500/10 text-blue-600 border-blue-200",
    viewer: "bg-gray-500/10 text-gray-600 border-gray-200",
  };
  return colors[role];
}

function getRoleLabel(role: MemberRole): string {
  const labels = {
    admin: "Admin",
    team_lead: "Team Lead",
    member: "Member",
    viewer: "Viewer",
  };
  return labels[role];
}

function getStatusColor(status: MemberStatus): string {
  const colors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    inactive: "bg-gray-400",
    invited: "bg-blue-500",
  };
  return colors[status];
}

// ============================================================================
// Team Members Page Component
// ============================================================================
export function TeamMembersPage({
  role = "team_lead",
  onNavigate,
}: TeamMembersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MemberStatus | "all">(
    "all"
  );
  const [selectedRole, setSelectedRole] = useState<MemberRole | "all">("all");
  const [activeTab, setActiveTab] = useState<"members" | "invitations">(
    "members"
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");

  const user = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const isAdmin = role === "admin" || role === "team_lead";

  // Filter members
  const filteredMembers = sampleTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const pendingInvitations = sampleInvitations.filter(
    (inv) => inv.status === "pending"
  );

  const handleInvite = () => {
    // Simulate invitation
    console.log("Inviting:", inviteEmail, "as", inviteRole);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("member");
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Members</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their permissions
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("/team/invitations")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Invitations
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("/team/activity")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Activity
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("/team/settings")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Team Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Members",
              value: sampleTeamMembers.length,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Active",
              value: sampleTeamMembers.filter((m) => m.status === "active")
                .length,
              icon: UserCheck,
              color: "text-green-500",
            },
            {
              label: "Pending",
              value: pendingInvitations.length,
              icon: Clock,
              color: "text-yellow-500",
            },
            {
              label: "Inactive",
              value: sampleTeamMembers.filter((m) => m.status === "inactive")
                .length,
              icon: UserMinus,
              color: "text-gray-500",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "members"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Members ({sampleTeamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "invitations"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Invitations ({pendingInvitations.length})
          </button>
        </div>

        {/* Members Tab Content */}
        {activeTab === "members" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as MemberStatus | "all")
                  }
                  className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as MemberRole | "all")
                  }
                  className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            {/* Members List */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="divide-y">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-medium text-primary">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(
                            member.status
                          )}`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">
                            {member.name}
                            {member.isCurrentUser && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (You)
                              </span>
                            )}
                          </h3>
                          {member.role === "admin" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{member.papersCount} papers</span>
                          <span>•</span>
                          <span>{member.annotationsCount} annotations</span>
                          {member.lastActive && (
                            <>
                              <span>•</span>
                              <span>
                                Active {formatRelativeTime(member.lastActive)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          member.role
                        )}`}
                      >
                        {getRoleLabel(member.role)}
                      </div>

                      {/* Actions */}
                      {isAdmin && !member.isCurrentUser && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMember(member)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Workspaces */}
                    {member.workspaces.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 ml-16">
                        <span className="text-xs text-muted-foreground">
                          Workspaces:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {member.workspaces.map((ws) => (
                            <span
                              key={ws}
                              className="px-2 py-0.5 rounded bg-muted text-xs"
                            >
                              {ws}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No members found matching your filters
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Invitations Tab Content */}
        {activeTab === "invitations" && (
          <div className="space-y-4">
            {pendingInvitations.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border bg-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited by {invitation.sentBy} •{" "}
                      {formatRelativeTime(invitation.sentAt)}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                      invitation.role
                    )}`}
                  >
                    {getRoleLabel(invitation.role)}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-3 ml-14 text-xs text-muted-foreground">
                  Expires {formatDate(invitation.expiresAt)}
                </div>
              </motion.div>
            ))}

            {pendingInvitations.length === 0 && (
              <div className="rounded-xl border bg-card p-12 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending invitations</p>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite New Member
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Invite Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl border shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Invite Team Member</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInviteModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@university.edu"
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as MemberRole)
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="viewer">Viewer - Can view papers</option>
                      <option value="member">
                        Member - Can upload and annotate
                      </option>
                      <option value="team_lead">
                        Team Lead - Can manage team
                      </option>
                      <option value="admin">Admin - Full access</option>
                    </select>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-1">Permission Details</p>
                    <p className="text-muted-foreground text-xs">
                      {inviteRole === "viewer" &&
                        "Can view papers and collections. Cannot make changes."}
                      {inviteRole === "member" &&
                        "Can upload papers, create annotations, and participate in discussions."}
                      {inviteRole === "team_lead" &&
                        "All member permissions plus team management and workspace settings."}
                      {inviteRole === "admin" &&
                        "Full access including billing, integrations, and user management."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 p-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleInvite} disabled={!inviteEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Member Actions Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl border shadow-lg w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    {selectedMember.avatar ? (
                      <img
                        src={selectedMember.avatar}
                        alt={selectedMember.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-primary">
                          {selectedMember.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{selectedMember.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedMember.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left transition-colors">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Change Role
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left transition-colors">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Manage Workspaces
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left text-destructive transition-colors">
                    <UserMinus className="h-4 w-4" />
                    Remove from Team
                  </button>
                </div>
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSelectedMember(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
