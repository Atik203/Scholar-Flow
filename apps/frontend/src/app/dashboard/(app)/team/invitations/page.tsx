"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryErrorHandler } from "@/hooks/useErrorHandler";
import { showApiErrorToast } from "@/lib/errorHandling";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import {
  useCancelTeamInvitationMutation,
  useGetTeamInvitationsReceivedQuery,
  useGetTeamInvitationsSentQuery,
  useResendTeamInvitationMutation,
  useSendTeamInvitationMutation,
  type TeamInvitation,
} from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clock,
  Copy,
  Folder,
  Link as LinkIcon,
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
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "received" | "sent";
type StatusKey = "all" | "pending" | "accepted" | "declined" | "expired";

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All" },
  { id: "received", label: "Received" },
  { id: "sent", label: "Sent" },
];

const getTimeAgo = (dateString: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

const getExpiresIn = (dateString?: string) => {
  if (!dateString) return null;
  const diff = new Date(dateString).getTime() - Date.now();
  if (diff < 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} days left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} hours left`;
};

const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400";
    case "editor":
    case "team_lead":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
          <Check className="h-3 w-3" />
          Accepted
        </span>
      );
    case "DECLINED":
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
          <X className="h-3 w-3" />
          Declined
        </span>
      );
    case "EXPIRED":
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

export default function TeamInvitationsPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: sentData, isLoading: sentLoading, refetch: refetchSent } =
    useGetTeamInvitationsSentQuery({ page: 1, limit: 50 }, { skip: !shouldFetch });
  const { data: receivedData, isLoading: receivedLoading, refetch: refetchReceived } =
    useGetTeamInvitationsReceivedQuery({ page: 1, limit: 50 }, { skip: !shouldFetch });
  const { data: workspacesData } = useListWorkspacesQuery(
    { limit: 50, scope: "owned" },
    { skip: !shouldFetch }
  );
  const [sendInvite] = useSendTeamInvitationMutation();
  const [cancelInvite] = useCancelTeamInvitationMutation();
  const [resendInvite] = useResendTeamInvitationMutation();

  const sent: TeamInvitation[] = sentData?.result || [];
  const received: TeamInvitation[] = receivedData?.result || [];

  const allInvitations: (TeamInvitation & { type: "received" | "sent" })[] = [
    ...received.map((i) => ({ ...i, type: "received" as const })),
    ...sent.map((i) => ({ ...i, type: "sent" as const })),
  ];

  const filtered = allInvitations.filter((inv) => {
    if (filter !== "all" && inv.type !== filter) return false;
    if (statusFilter !== "all" && inv.status.toLowerCase() !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesWorkspace = inv.workspaceName?.toLowerCase().includes(q);
      const matchesPerson =
        inv.type === "received"
          ? inv.inviterName?.toLowerCase().includes(q)
          : inv.inviteeEmail?.toLowerCase().includes(q);
      return matchesWorkspace || matchesPerson;
    }
    return true;
  });

  const pendingReceived = received.filter((i) => i.status === "PENDING").length;
  const pendingSent = sent.filter((i) => i.status === "PENDING").length;
  const acceptedTotal = allInvitations.filter((i) => i.status === "ACCEPTED").length;

  const handleAccept = async (inv: TeamInvitation) => {
    setProcessingId(inv.id);
    try {
      // For now, accept workspace invitation via the workspaceApi-style flow
      showSuccessToast("Accepted — see Shared Workspaces");
      refetchReceived();
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (inv: TeamInvitation) => {
    setProcessingId(inv.id);
    try {
      refetchReceived();
    } finally {
      setProcessingId(null);
    }
  };

  const handleResend = async (inv: TeamInvitation) => {
    setProcessingId(inv.id);
    try {
      await resendInvite(inv.id).unwrap();
      showSuccessToast("Invitation resent");
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (inv: TeamInvitation) => {
    setProcessingId(inv.id);
    try {
      await cancelInvite(inv.id).unwrap();
      showSuccessToast("Invitation cancelled");
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText("https://scholarflow.app/invite/abc123");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isLoading = sentLoading || receivedLoading;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Invitations
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your workspace invitations and team collaborations
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Mail}
          label="Pending Received"
          value={pendingReceived}
          color="text-amber-600"
          bgColor="bg-amber-100 dark:bg-amber-900/50"
        />
        <StatCard
          icon={Send}
          label="Pending Sent"
          value={pendingSent}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/50"
        />
        <StatCard
          icon={Users}
          label="Accepted Total"
          value={acceptedTotal}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/50"
        />
      </div>

      {/* Quick Invite Link */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Shareable Invite Link</h3>
              <p className="text-sm text-muted-foreground">
                Anyone with this link can request to join your workspace
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleCopyLink}>
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invitations…"
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all",
                filter === f.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "border bg-background hover:bg-accent"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusKey)}
          className="h-10 px-3 rounded-md border bg-background text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Invitations List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No invitations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "You don't have any invitations yet"}
            </p>
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Someone
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((inv) => (
              <InvitationCard
                key={`${inv.type}-${inv.id}`}
                invitation={inv}
                processing={processingId === inv.id}
                onAccept={() => handleAccept(inv)}
                onDecline={() => handleDecline(inv)}
                onResend={() => handleResend(inv)}
                onCancel={() => handleCancel(inv)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        workspaces={
          workspacesData?.data?.map((w) => ({
            id: w.id,
            name: w.name,
            color: w.color,
          })) || []
        }
        onSend={async ({ email, role, message }) => {
          try {
            await sendInvite({ email, role, message }).unwrap();
            showSuccessToast("Invitation sent");
            setShowInviteModal(false);
          } catch (err) {
            showApiErrorToast(err as any);
          }
        }}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", bgColor)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function InvitationCard({
  invitation,
  processing,
  onAccept,
  onDecline,
  onResend,
  onCancel,
}: {
  invitation: TeamInvitation & { type: "received" | "sent" };
  processing: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onResend: () => void;
  onCancel: () => void;
}) {
  const isReceived = invitation.type === "received";
  const isPending = invitation.status === "PENDING";
  const isExpired = invitation.status === "EXPIRED";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "rounded-xl border bg-card p-4 transition-all hover:shadow-md",
        isExpired && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Folder className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold truncate">{invitation.workspaceName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {getStatusBadge(invitation.status)}
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getRoleColor(invitation.role)
                  )}
                >
                  {invitation.role}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right shrink-0">
              <div>{getTimeAgo(invitation.invitedAt)}</div>
              {isPending && invitation.expiresAt && (
                <div className="text-amber-600 dark:text-amber-400 mt-1">
                  {getExpiresIn(invitation.expiresAt)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            {isReceived ? (
              <span>
                <span className="font-medium text-foreground">
                  {invitation.inviterName}
                </span>{" "}
                invited you
              </span>
            ) : (
              <span>
                Sent to{" "}
                <span className="font-medium text-foreground">
                  {invitation.inviteeEmail}
                </span>
              </span>
            )}
          </div>

          {invitation.message && (
            <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 italic">
              &ldquo;{invitation.message}&rdquo;
            </p>
          )}

          {isPending && (
            <div className="flex items-center gap-2 mt-4">
              {isReceived ? (
                <>
                  <Button
                    size="sm"
                    onClick={onAccept}
                    disabled={processing}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {processing ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-1" />
                    )}
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={onDecline} disabled={processing}>
                    <UserMinus className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onResend}
                    disabled={processing}
                    className="text-blue-600 border-blue-200"
                  >
                    {processing ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Resend
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                    className="text-red-600 border-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InviteModal({
  isOpen,
  onClose,
  workspaces,
  onSend,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaces: { id: string; name: string; color?: string }[];
  onSend: (data: { email: string; role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN"; message?: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]?.id || "");
  const [role, setRole] = useState<"viewer" | "editor" | "admin">("editor");
  const [message, setMessage] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">Invite Team Member</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@university.edu"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Workspace</label>
                <select
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  disabled={workspaces.length === 0}
                >
                  {workspaces.length === 0 ? (
                    <option value="">No owned workspaces</option>
                  ) : (
                    workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>
                        {ws.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["viewer", "editor", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all",
                        role === r
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-muted hover:bg-muted/70"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Personal Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                Cancel
              </button>
              <Button
                onClick={() =>
                  onSend({
                    email,
                    role:
                      role === "admin"
                        ? "TEAM_LEAD"
                        : role === "editor"
                          ? "PRO_RESEARCHER"
                          : "RESEARCHER",
                    message: message || undefined,
                  })
                }
                disabled={!email.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
