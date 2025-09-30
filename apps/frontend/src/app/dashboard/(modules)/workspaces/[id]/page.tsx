"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import { showApiErrorToast } from "@/lib/errorHandling";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceQuery,
  useInviteWorkspaceMemberMutation,
  useListMembersQuery,
  useUpdateWorkspaceMutation,
} from "@/redux/api/workspaceApi";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Copy,
  Crown,
  Edit,
  FileText,
  Globe,
  Loader2,
  Lock,
  Settings,
  Share2,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkspaceDetailPage() {
  const isProtected = useProtectedRoute();
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role || "";
  const params = useParams();
  const id = params.id as string;

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<
    "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN"
  >("RESEARCHER");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const {
    data: workspace,
    isLoading,
    error,
    refetch,
  } = useGetWorkspaceQuery(id);

  const [inviteWorkspaceMember] = useInviteWorkspaceMemberMutation();
  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const { data: membersData } = useListMembersQuery({ id });
  const { data: collectionsData } = useGetMyCollectionsQuery({
    workspaceId: id,
    page: 1,
    limit: 10,
  });
  const { data: papersData } = useListPapersQuery({
    workspaceId: id,
    page: 1,
    limit: 10,
  });

  const handleEditWorkspace = () => {
    if (!workspace) return;
    setEditName(workspace.name);
    setEditDescription(workspace.description || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateWorkspace({
        id,
        name: editName,
        description: editDescription,
      }).unwrap();
      showSuccessToast("Workspace updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      showApiErrorToast({ message: "Please enter a valid email" });
      return;
    }

    try {
      await inviteWorkspaceMember({
        id,
        email: inviteEmail.trim(),
        role: inviteRole,
      }).unwrap();

      refetch();
      showSuccessToast("Invitation sent successfully");
      setInviteEmail("");
      setInviteRole("RESEARCHER");
      setIsInviteDialogOpen(false);
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWorkspace(id).unwrap();
      showSuccessToast("Workspace deleted successfully");
      router.push(buildRoleScopedPath(userRole, "/workspaces"));
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  if (!isProtected) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading workspace...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workspace) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Workspace not found</h3>
          <p className="text-muted-foreground mb-4">
            The workspace you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Button asChild>
            <Link href={buildRoleScopedPath(userRole, "/workspaces")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspaces
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Permission checking - workspace uses role-based access
  const isOwner = workspace.userRole === "ADMIN" || workspace.isOwner;
  const canManage = isOwner || workspace.userRole === "TEAM_LEAD";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={buildRoleScopedPath(userRole, "/workspaces")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspaces
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">
                {workspace.name}
              </h1>
              <Badge variant={workspace.isPublic ? "default" : "secondary"}>
                {workspace.isPublic ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              {workspace.userRole && (
                <Badge variant={isOwner ? "default" : "outline"}>
                  {isOwner ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Owner
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      {workspace.userRole}
                    </>
                  )}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {workspace.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Workspace</DialogTitle>
                  <DialogDescription>
                    Share this workspace with others
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/workspaces/${workspace.id}`}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/dashboard/workspaces/${workspace.id}`
                        );
                        showSuccessToast("Link copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite People
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {canManage && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/workspaces/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditWorkspace}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Workspace
                  </DropdownMenuItem>
                  {canManage && (
                    <DropdownMenuItem
                      onClick={() => setIsInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Members
                    </DropdownMenuItem>
                  )}
                  {isOwner && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Workspace
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace?.memberCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{membersData?.data?.length || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace?.collectionCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Research collections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Papers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workspace?.paperCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total papers</p>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Collections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Recent Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collectionsData?.result
                      ?.slice(0, 3)
                      .map((collection: any) => (
                        <div
                          key={collection.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {collection.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {collection.paperCount || 0} papers
                            </p>
                          </div>
                          <Button asChild size="sm" variant="ghost">
                            <Link
                              href={`/dashboard/collections/${collection.id}`}
                            >
                              View
                            </Link>
                          </Button>
                        </div>
                      )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        No collections yet
                      </div>
                    )}
                  </div>
                  {collectionsData?.result &&
                    collectionsData.result.length > 3 && (
                      <div className="mt-4 pt-4 border-t">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/dashboard/collections">
                            View All Collections
                          </Link>
                        </Button>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Recent Papers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Papers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {papersData?.items?.slice(0, 3).map((paper: any) => (
                      <div
                        key={paper.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{paper.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(paper.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/papers/${paper.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        No papers yet
                      </div>
                    )}
                  </div>
                  {papersData?.items && papersData.items.length > 3 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard/papers">View All Papers</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/dashboard/papers/upload">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Paper
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/collections/create">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Collection
                    </Link>
                  </Button>
                  {canManage && (
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Members
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Workspace Collections
                </CardTitle>
                <Button asChild size="sm">
                  <Link href="/dashboard/collections/create">
                    Create Collection
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collectionsData?.result?.map((collection: any) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{collection.paperCount || 0} papers</span>
                          <span>
                            Created{" "}
                            {new Date(
                              collection.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/collections/${collection.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No collections in this workspace yet.</p>
                      <Button asChild className="mt-4">
                        <Link href="/dashboard/collections/create">
                          Create Your First Collection
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="papers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Workspace Papers
                </CardTitle>
                <Button asChild size="sm">
                  <Link href="/dashboard/papers/upload">Upload Paper</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {papersData?.items?.map((paper: any) => (
                    <div
                      key={paper.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{paper.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {paper.abstract || "No abstract available"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            Uploaded{" "}
                            {new Date(paper.createdAt).toLocaleDateString()}
                          </span>
                          {paper.processingStatus && (
                            <Badge variant="secondary" className="text-xs">
                              {paper.processingStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/papers/${paper.id}`}>View</Link>
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No papers in this workspace yet.</p>
                      <Button asChild className="mt-4">
                        <Link href="/dashboard/papers/upload">
                          Upload Your First Paper
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Workspace Members
                </CardTitle>
                {canManage && (
                  <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {membersData?.data?.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.name || member.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{member.role}</Badge>
                        {member.userId === workspace?.ownerId && (
                          <Badge variant="default">
                            <Crown className="h-3 w-3 mr-1" />
                            Owner
                          </Badge>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      No members found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite a member to this workspace with a specific role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(value: any) => setInviteRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESEARCHER">
                    <div>
                      <div className="font-medium">Researcher</div>
                      <div className="text-xs text-muted-foreground">
                        Can view and contribute to research
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PRO_RESEARCHER">
                    <div>
                      <div className="font-medium">Pro Researcher</div>
                      <div className="text-xs text-muted-foreground">
                        Advanced research capabilities and collaboration
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="TEAM_LEAD">
                    <div>
                      <div className="font-medium">Team Lead</div>
                      <div className="text-xs text-muted-foreground">
                        Can manage team members and workspace settings
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-xs text-muted-foreground">
                        Full workspace administration access
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update your workspace name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Workspace name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Workspace description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Workspace
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              workspace <strong>{workspace?.name}</strong> and all of its data,
              including collections, papers, and member access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirm-delete">
                Type <strong>{workspace?.name}</strong> to confirm deletion:
              </Label>
              <Input
                id="confirm-delete"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type workspace name here"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteConfirmText !== workspace?.name}
            >
              Delete Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
