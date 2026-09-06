"use client";

import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkspaceColor, type WorkspaceColor } from "@/components/workspace/WorkspaceCard";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useAcceptWorkspaceInvitationMutation,
  useDeclineWorkspaceInvitationMutation,
  useGetWorkspaceInvitationsReceivedQuery,
  useGetWorkspaceInvitationsSentQuery,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

type TabKey = "shared" | "received" | "sent";

const TABS: { id: TabKey; label: string }[] = [
  { id: "shared", label: "Shared With Me" },
  { id: "received", label: "Received Invites" },
  { id: "sent", label: "Sent Invites" },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SharedWorkspacesPage() {
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;
  const [activeTab, setActiveTab] = useState<TabKey>("shared");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: sharedData, isLoading: sharedLoading } = useListWorkspacesQuery(
    { limit: 50, scope: "shared" },
    { skip: !shouldFetch }
  );
  const { data: receivedData, isLoading: receivedLoading, refetch: refetchReceived } =
    useGetWorkspaceInvitationsReceivedQuery({ page: 1, limit: 50 }, { skip: !shouldFetch });
  const { data: sentData, isLoading: sentLoading, refetch: refetchSent } =
    useGetWorkspaceInvitationsSentQuery({ page: 1, limit: 50 }, { skip: !shouldFetch });

  const [acceptInvite] = useAcceptWorkspaceInvitationMutation();
  const [declineInvite] = useDeclineWorkspaceInvitationMutation();

  const sharedWorkspaces = (sharedData?.data || []).filter((w) => !w.isOwner);

  const filteredShared = sharedWorkspaces.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const received = receivedData?.result || [];
  const sent = sentData?.result || [];

  const handleAccept = async (workspaceId: string) => {
    setProcessingId(workspaceId);
    try {
      await acceptInvite(workspaceId).unwrap();
      showSuccessToast("Invitation accepted");
      refetchReceived();
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (workspaceId: string) => {
    setProcessingId(workspaceId);
    try {
      await declineInvite(workspaceId).unwrap();
      showSuccessToast("Invitation declined");
      refetchReceived();
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/workspaces"
          className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Workspaces
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Workspaces</h1>
          <p className="text-muted-foreground">
            Workspaces shared with you by other users
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workspaces…"
              className="pl-10"
            />
          </div>

          {sharedLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : filteredShared.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No shared workspaces</p>
              <p className="text-sm mt-1">Workspaces shared with you will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredShared.map((workspace) => {
                const colorMeta = getWorkspaceColor(workspace.color as WorkspaceColor);
                return (
                  <div
                    key={workspace.id}
                    className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/dashboard/workspaces/${workspace.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorMeta.gradient)}>
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{workspace.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            By owner
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {workspace.memberCount || 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {workspace.collectionCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {workspace.paperCount || 0}
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/workspaces/${workspace.id}`);
                      }}
                    >
                      Open Workspace
                    </Button>
                  </div>
                );
              })}
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
            {receivedLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : received.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending invitations.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {received
                  .filter((inv) => inv.status === "PENDING")
                  .map((invite) => (
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
                            Invited by {invite.inviterName || "someone"} as {invite.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(invite.invitedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleAccept(invite.workspaceId)}
                          disabled={processingId === invite.workspaceId}
                          className="bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200"
                        >
                          {processingId === invite.workspaceId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDecline(invite.workspaceId)}
                          disabled={processingId === invite.workspaceId}
                          className="bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
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
            {sentLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : sent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sent invitations.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {sent.map((invite) => (
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
                          To: {invite.inviteeEmail} • Role: {invite.role}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sent: {formatDate(invite.invitedAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        invite.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : invite.status === "DECLINED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}
                    >
                      {invite.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
