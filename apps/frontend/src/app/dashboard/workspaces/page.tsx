"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useCreateWorkspaceMutation,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import {
  BookOpen,
  Building2,
  Crown,
  ExternalLink,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function WorkspacesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: allData, isLoading: allLoading } = useListWorkspacesQuery({
    page: 1,
    limit: 20,
    scope: "all",
  });
  const { data: ownedData, isLoading: ownedLoading } = useListWorkspacesQuery({
    page: 1,
    limit: 20,
    scope: "owned",
  });
  const { data: sharedData, isLoading: sharedLoading } = useListWorkspacesQuery(
    { page: 1, limit: 20, scope: "shared" }
  );
  const [createWorkspace, { isLoading: creating }] =
    useCreateWorkspaceMutation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

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

  const WorkspaceCard = ({ workspace }: { workspace: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle className="text-lg">{workspace.name}</CardTitle>
          </div>
          {workspace.isOwner && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{workspace.memberCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{workspace.collectionCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{workspace.paperCount || 0}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/workspaces/${workspace.id}`}>
              View <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace: any) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">
              Manage your research workspaces and collaborate with others
            </p>
          </div>
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Workspaces</TabsTrigger>
            <TabsTrigger value="owned">Owned by Me</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <WorkspaceGrid data={allData} isLoading={allLoading} />
          </TabsContent>

          <TabsContent value="owned" className="mt-6">
            <WorkspaceGrid data={ownedData} isLoading={ownedLoading} />
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <WorkspaceGrid data={sharedData} isLoading={sharedLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
