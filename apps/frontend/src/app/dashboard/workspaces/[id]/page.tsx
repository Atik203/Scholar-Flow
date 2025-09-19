"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useAddMemberMutation,
  useDeleteWorkspaceMutation,
  useGetWorkspaceQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateWorkspaceMutation,
} from "@/redux/api/workspaceApi";
import {
  BookOpen,
  Building2,
  Copy,
  Crown,
  FileText,
  Settings,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

// Workspace ID validation - accepts only pure UUID format
const isValidWorkspaceId = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function WorkspaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  // Always call all hooks at the top level
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const {
    data: workspace,
    isLoading,
    error,
  } = useGetWorkspaceQuery(id, {
    skip: !isValidWorkspaceId(id), // Skip query if invalid workspace ID
  });
  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const { data: membersData } = useListMembersQuery(
    { id },
    { skip: !isValidWorkspaceId(id) } // Skip query if invalid workspace ID
  );
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  React.useEffect(() => {
    if (workspace) {
      setNewName(workspace.name);
    }
  }, [workspace]);

  // Validate workspace ID and show error if invalid
  if (!isValidWorkspaceId(id)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Invalid Workspace</h2>
            <p className="text-muted-foreground mb-4">
              The workspace ID provided is not valid.
            </p>
            <Button asChild>
              <Link href="/dashboard/workspaces">Back to Workspaces</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === workspace?.name) {
      setEditingName(false);
      return;
    }

    try {
      await updateWorkspace({ id, name: newName.trim() }).unwrap();
      showSuccessToast("Workspace name updated");
      setEditingName(false);
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace(id).unwrap();
      showSuccessToast("Workspace deleted");
      router.push("/dashboard/workspaces");
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await addMember({ id, email: inviteEmail.trim() }).unwrap();
      showSuccessToast("Invitation sent");
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember({ id, memberId }).unwrap();
      showSuccessToast("Member removed");
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const copyWorkspaceLink = () => {
    const url = `${window.location.origin}/dashboard/workspaces/${id}`;
    navigator.clipboard.writeText(url);
    showSuccessToast("Workspace link copied to clipboard");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div>Loading workspace...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workspace) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div>Workspace not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const members = membersData?.data || [];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8" />
            <div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="text-2xl font-bold"
                  />
                  <Button size="sm" onClick={handleUpdateName}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{workspace.name}</h1>
                  {workspace.isOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingName(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              {workspace.isOwner && <Badge className="ml-2">Owner</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={copyWorkspaceLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>

            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Member to Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInviteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Send Invitation</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {workspace.isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the workspace and all its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteWorkspace}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Workspace
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace.memberCount || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace.collectionCount || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Papers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace.paperCount || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Workspace Members</CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members found
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.name || member.email}
                        </div>
                        {member.name && (
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{member.role}</Badge>
                      {member.role === "ADMIN" &&
                        workspace.ownerId === member.userId && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      {workspace.isOwner &&
                        workspace.ownerId !== member.userId && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
