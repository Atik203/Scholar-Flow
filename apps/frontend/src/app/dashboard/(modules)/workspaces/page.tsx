"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import {
  BookOpen,
  Building2,
  Calendar,
  Crown,
  Edit,
  Eye,
  FileText,
  Globe,
  Lock,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function WorkspacesPage() {
  const isProtected = useProtectedRoute();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { data: allData, isLoading: allLoading } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });
  const { data: ownedData, isLoading: ownedLoading } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "owned",
  });
  const { data: sharedData, isLoading: sharedLoading } = useListWorkspacesQuery(
    { page: 1, limit: 50, scope: "shared" }
  );
  const [createWorkspace, { isLoading: creating }] =
    useCreateWorkspaceMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      await createWorkspace({ name: newWorkspaceName.trim() }).unwrap();
      showSuccessToast("Workspace created successfully");
      setNewWorkspaceName("");
      setShowCreateDialog(false);
    } catch (e: any) {
      showApiErrorToast(e);
    }
  };

  const handleDeleteWorkspace = async (
    workspaceId: string,
    workspaceName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${workspaceName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteWorkspace(workspaceId).unwrap();
      showSuccessToast("Workspace deleted successfully");
    } catch (e: any) {
      showApiErrorToast(e);
    }
  };

  const WorkspaceListItem = ({ workspace }: { workspace: any }) => (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm truncate">
                  {workspace.name}
                </h3>
                {workspace.isOwner && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Crown className="h-3 w-3 mr-1" />
                    Owner
                  </Badge>
                )}
                <Badge
                  variant={workspace.isPublic ? "default" : "outline"}
                  className="text-xs px-1.5 py-0.5"
                >
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
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{workspace.memberCount || 0} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{workspace.collectionCount || 0} collections</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{workspace.paperCount || 0} papers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href={`/dashboard/workspaces/${workspace.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            {workspace.isOwner && (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/workspaces/${workspace.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleDeleteWorkspace(workspace.id, workspace.name)
                  }
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const WorkspaceGrid = ({
    data,
    isLoading,
  }: {
    data: any;
    isLoading: boolean;
  }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <div className="w-8 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const workspaces = data?.data || [];

    if (workspaces.length === 0) {
      return (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first workspace to get started.
          </p>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {workspaces.map((workspace: any) => (
          <WorkspaceListItem key={workspace.id} workspace={workspace} />
        ))}
      </div>
    );
  };

  if (!isProtected) return null;

  // Filter workspaces based on search term
  const filterWorkspaces = (workspaces: any[]) => {
    if (!searchTerm) return workspaces;
    return workspaces.filter((workspace: any) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredAllData = {
    ...allData,
    data: filterWorkspaces(allData?.data || []),
  };
  const filteredOwnedData = {
    ...ownedData,
    data: filterWorkspaces(ownedData?.data || []),
  };
  const filteredSharedData = {
    ...sharedData,
    data: filterWorkspaces(sharedData?.data || []),
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground">
              Manage your research workspaces and collaborate with others
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/workspaces/shared">
                <Users className="h-4 w-4 mr-2" />
                Browse Shared
              </Link>
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspaceName">Workspace Name</Label>
                    <Input
                      id="workspaceName"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Enter workspace name"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating || !newWorkspaceName.trim()}
                    >
                      {creating ? "Creating..." : "Create Workspace"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Workspaces</TabsTrigger>
            <TabsTrigger value="owned">Owned by Me</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <WorkspaceGrid data={filteredAllData} isLoading={allLoading} />
          </TabsContent>

          <TabsContent value="owned" className="mt-6">
            <WorkspaceGrid data={filteredOwnedData} isLoading={ownedLoading} />
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <WorkspaceGrid
              data={filteredSharedData}
              isLoading={sharedLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
