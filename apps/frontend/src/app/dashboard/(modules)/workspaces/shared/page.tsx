"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useAcceptWorkspaceInvitationMutation,
  useDeclineWorkspaceInvitationMutation,
  useGetWorkspaceInvitationsReceivedQuery,
  useGetWorkspaceInvitationsSentQuery,
  useListWorkspacesQuery,
  type Workspace,
  type WorkspaceInvitation,
} from "@/redux/api/workspaceApi";
import {
  ArrowLeft,
  Building2,
  Check,
  Loader2,
  Search,
  Share2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SharedWorkspacesPage() {
  const isProtected = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");

  // API calls
  const {
    data: workspacesData,
    isLoading,
    error,
  } = useListWorkspacesQuery({
    page: 1,
    limit: 20,
    scope: "shared",
  });

  const { data: invitesReceived, isLoading: loadingReceived } =
    useGetWorkspaceInvitationsReceivedQuery({ page: 1, limit: 50 });
  const { data: invitesSent, isLoading: loadingSent } =
    useGetWorkspaceInvitationsSentQuery({ page: 1, limit: 50 });

  const [acceptInvitation, { isLoading: accepting }] =
    useAcceptWorkspaceInvitationMutation();
  const [declineInvitation, { isLoading: declining }] =
    useDeclineWorkspaceInvitationMutation();

  const filteredWorkspaces = workspacesData?.data?.filter(
    (workspace: Workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccept = async (workspaceId: string) => {
    try {
      await acceptInvitation(workspaceId).unwrap();
      showSuccessToast("Invitation accepted");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to accept invitation");
    }
  };

  const handleDecline = async (workspaceId: string) => {
    try {
      await declineInvitation(workspaceId).unwrap();
      showSuccessToast("Invitation declined");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to decline invitation");
    }
  };

  if (!isProtected) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Shared Workspaces
              </h1>
              <p className="text-muted-foreground">
                Workspaces shared with you by other users
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Failed to load workspaces
            </h2>
            <p className="text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/workspaces">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Workspaces
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Workspaces
            </h1>
            <p className="text-muted-foreground">
              Workspaces shared with you by other users
            </p>
          </div>
        </div>

        <Tabs defaultValue="shared">
          <TabsList className="grid w-fit grid-cols-3 gap-4">
            <TabsTrigger value="shared" className="px-6">
              Shared With Me
            </TabsTrigger>
            <TabsTrigger value="received" className="px-6">
              Invites Received
              {invitesReceived?.result &&
                invitesReceived.result.filter((i) => i.status === "PENDING")
                  .length > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {
                      invitesReceived.result.filter(
                        (i) => i.status === "PENDING"
                      ).length
                    }
                  </Badge>
                )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="px-6">
              Invites Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Workspaces shared with me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search shared workspaces..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Workspaces Grid */}
                {filteredWorkspaces?.length === 0 ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h2 className="text-2xl font-semibold mb-2">
                        No shared workspaces
                      </h2>
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "No workspaces match your search"
                          : "You don't have any shared workspaces yet"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-1">
                    {filteredWorkspaces?.map((workspace) => (
                      <div
                        key={workspace.id}
                        className="flex items-center justify-between border rounded p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {workspace.name}
                              <Badge variant="secondary" className="text-xs">
                                {workspace.userRole || "Member"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {workspace.memberCount} members •{" "}
                              {workspace.collectionCount} collections •{" "}
                              {workspace.paperCount} papers
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/dashboard/workspaces/${workspace.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Invitations received
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReceived ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invitesReceived?.result?.map(
                      (invite: WorkspaceInvitation) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {invite.workspaceName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Invited by{" "}
                              {invite.inviterName || invite.inviterEmail}
                              {invite.role && (
                                <>
                                  {" "}
                                  as{" "}
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {invite.role}
                                  </Badge>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(invite.invitedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                invite.status === "PENDING"
                                  ? "default"
                                  : invite.status === "ACCEPTED"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {invite.status}
                            </Badge>
                            {invite.status === "PENDING" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAccept(invite.workspaceId)
                                  }
                                  disabled={accepting}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDecline(invite.workspaceId)
                                  }
                                  disabled={declining}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {(!invitesReceived?.result ||
                      invitesReceived.result.length === 0) && (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        No invitations received.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Invitations sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSent ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invitesSent?.result?.map((invite: WorkspaceInvitation) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {invite.workspaceName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sent to {invite.inviteeName || invite.inviteeEmail}
                            {invite.role && (
                              <>
                                {" "}
                                as{" "}
                                <Badge variant="secondary" className="text-xs">
                                  {invite.role}
                                </Badge>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(invite.invitedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              invite.status === "PENDING"
                                ? "default"
                                : invite.status === "ACCEPTED"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {invite.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(!invitesSent?.result ||
                      invitesSent.result.length === 0) && (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        No invitations sent.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
