"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBadge, getRoleLabel } from "@/components/team/RoleBadge";
import { StatusDot } from "@/components/team/StatusDot";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useGetTeamMembersQuery,
  useGetTeamStatsQuery,
  useRemoveTeamMemberMutation,
  useSendTeamInvitationMutation,
  useUpdateTeamMemberMutation,
  type TeamMember,
} from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Clock,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  Tag,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function TeamMembersPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "pending" | "inactive">(
    "all"
  );
  const [selectedRole, setSelectedRole] = useState<
    "all" | "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN"
  >("all");
  const [activeTab, setActiveTab] = useState<"members" | "invitations">("members");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data, isLoading } = useGetTeamMembersQuery(
    {
      limit: 50,
      search: searchQuery || undefined,
      role: selectedRole !== "all" ? selectedRole : undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    },
    { skip: !shouldFetch }
  );
  const { data: stats } = useGetTeamStatsQuery(undefined, { skip: !shouldFetch });
  const [sendInvite] = useSendTeamInvitationMutation();
  const [removeMember] = useRemoveTeamMemberMutation();
  const [updateMember] = useUpdateTeamMemberMutation();

  const members = data?.data || [];
  const filteredMembers = members.filter((m) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !m.name?.toLowerCase().includes(q) &&
        !m.email?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (selectedStatus !== "all" && m.status !== selectedStatus) return false;
    if (selectedRole !== "all" && m.role !== selectedRole) return false;
    return true;
  });

  const handleInvite = async ({
    email,
    role,
  }: {
    email: string;
    role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  }) => {
    try {
      await sendInvite({ email, role }).unwrap();
      showSuccessToast("Invitation sent");
      setShowInviteModal(false);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleRemove = async (member: TeamMember) => {
    try {
      await removeMember(member.id).unwrap();
      showSuccessToast(`${member.name} removed from team`);
      setSelectedMember(null);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleChangeRole = async (
    member: TeamMember,
    newRole: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN"
  ) => {
    try {
      await updateMember({ userId: member.id, role: newRole }).unwrap();
      showSuccessToast(`Role updated for ${member.name}`);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  return (
    <div className="space-y-6 p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Quick Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/team/invitations">
            <Mail className="h-4 w-4 mr-2" />
            Invitations
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/team/activity">
            <Clock className="h-4 w-4 mr-2" />
            Activity
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/team/settings">
            <Shield className="h-4 w-4 mr-2" />
            Team Settings
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Members",
            value: stats?.totalMembers ?? members.length,
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "Active",
            value: stats?.activeMembers ?? members.filter((m) => m.status === "active").length,
            icon: UserCheck,
            color: "text-green-500",
          },
          {
            label: "Pending",
            value: stats?.pendingInvitations ?? 0,
            icon: Clock,
            color: "text-yellow-500",
          },
          {
            label: "Inactive",
            value: stats?.inactiveMembers ?? members.filter((m) => m.status === "inactive").length,
            icon: UserMinus,
            color: "text-gray-500",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
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
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "members"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "invitations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Invitations ({stats?.pendingInvitations ?? 0})
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="h-10 px-3 rounded-md border bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="h-10 px-3 rounded-md border bg-background text-sm"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="PRO_RESEARCHER">Pro Researcher</option>
                <option value="RESEARCHER">Researcher</option>
              </select>
            </div>
          </div>

          {/* Members List */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No members found matching your filters
              </p>
            </div>
          ) : (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="divide-y">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with status dot */}
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.image || undefined} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-base font-medium">
                            {member.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <StatusDot
                          status={member.status as any}
                          className="absolute -bottom-0.5 -right-0.5"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{member.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Last active {formatRelativeTime(member.lastActive)}</span>
                          <span>•</span>
                          <span>{member.workspaceCount ?? 0} workspaces</span>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <RoleBadge role={member.role.toLowerCase().replace("_", "_")} />

                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMember(member)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Workspace chips */}
                    {member.workspaces && member.workspaces.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 ml-16">
                        <span className="text-xs text-muted-foreground">Workspaces:</span>
                        <div className="flex flex-wrap gap-1">
                          {member.workspaces.slice(0, 4).map((ws) => (
                            <Link
                              key={ws.id}
                              href={`/dashboard/workspaces/${ws.id}`}
                              className="px-2 py-0.5 rounded bg-muted text-xs hover:bg-muted/70"
                            >
                              {ws.name}
                            </Link>
                          ))}
                          {member.workspaces.length > 4 && (
                            <span className="text-xs text-muted-foreground">
                              +{member.workspaces.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Invitations Tab — link out */}
      {activeTab === "invitations" && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            View and manage all team invitations on the invitations page
          </p>
          <Button asChild>
            <Link href="/dashboard/team/invitations">Go to Invitations</Link>
          </Button>
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSend={handleInvite}
      />

      {/* Member Actions Modal */}
      <MemberActionsModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onChangeRole={handleChangeRole}
        onRemove={handleRemove}
      />
    </div>
  );
}

// ============================================================================
// Invite Modal
// ============================================================================

function InviteModal({
  isOpen,
  onClose,
  onSend,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    email: string;
    role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN">(
    "RESEARCHER"
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
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
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                >
                  <option value="VIEWER" disabled>
                    Viewer (use workspace invite)
                  </option>
                  <option value="RESEARCHER">Researcher — Can upload and annotate</option>
                  <option value="PRO_RESEARCHER">
                    Pro Researcher — All member permissions
                  </option>
                  <option value="TEAM_LEAD">Team Lead — Can manage team</option>
                  <option value="ADMIN">Admin — Full access</option>
                </select>
                <p className="mt-2 text-xs text-muted-foreground">
                  {role === "RESEARCHER" &&
                    "Can upload papers, create annotations, and participate in discussions."}
                  {role === "PRO_RESEARCHER" &&
                    "All member permissions plus advanced research tools and AI features."}
                  {role === "TEAM_LEAD" &&
                    "All member permissions plus team management and workspace settings."}
                  {role === "ADMIN" &&
                    "Full access including billing, integrations, and user management."}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSend({ email, role })} disabled={!email.trim()}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Member Actions Modal
// ============================================================================

function MemberActionsModal({
  member,
  onClose,
  onChangeRole,
  onRemove,
}: {
  member: TeamMember | null;
  onClose: () => void;
  onChangeRole: (
    member: TeamMember,
    role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN"
  ) => void;
  onRemove: (member: TeamMember) => void;
}) {
  if (!member) return null;
  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
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
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.image || undefined} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {member.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Link
                href={`/dashboard/team/collaborator/${member.id}`}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left transition-colors"
                onClick={onClose}
              >
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                View Profile
              </Link>
              <div className="px-4 py-2">
                <label className="text-sm font-medium">Change Role</label>
                <select
                  value={member.role}
                  onChange={(e) =>
                    onChangeRole(member, e.target.value as any)
                  }
                  className="w-full h-9 px-2 mt-1 rounded-md border bg-background text-sm"
                >
                  <option value="RESEARCHER">Researcher</option>
                  <option value="PRO_RESEARCHER">Pro Researcher</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <Link
                href="/dashboard/workspaces"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left transition-colors"
                onClick={onClose}
              >
                <Tag className="h-4 w-4 text-muted-foreground" />
                Manage Workspaces
              </Link>
              <button
                onClick={() => onRemove(member)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left text-destructive transition-colors"
              >
                <UserMinus className="h-4 w-4" />
                Remove from Team
              </button>
            </div>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
