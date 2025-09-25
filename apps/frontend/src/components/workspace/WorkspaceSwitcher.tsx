"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useCreateWorkspaceMutation,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface WorkspaceSwitcherProps {
  currentWorkspaceId?: string;
}

export function WorkspaceSwitcher({
  currentWorkspaceId,
}: WorkspaceSwitcherProps) {
  const { data, isLoading } = useListWorkspacesQuery({ scope: "all" });
  const [createWorkspace, { isLoading: creating }] =
    useCreateWorkspaceMutation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const workspaces = data?.data || [];
  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      const result = await createWorkspace({
        name: newWorkspaceName.trim(),
      }).unwrap();
      showSuccessToast("Workspace created successfully");
      setNewWorkspaceName("");
      setShowCreateDialog(false);
      // Navigate to the new workspace
      router.push(`/dashboard/workspaces/${result.id}`);
    } catch (error: any) {
      showApiErrorToast(error);
    }
  };

  const handleWorkspaceSwitch = (workspaceId: string) => {
    // Determine the target route based on current pathname
    if (pathname.startsWith("/dashboard/workspaces/")) {
      router.push(`/dashboard/workspaces/${workspaceId}`);
    } else {
      // For other dashboard routes, go to workspace overview
      router.push(`/dashboard/workspaces/${workspaceId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="px-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">
                {currentWorkspace?.name || "Select Workspace"}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px]" align="start">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {workspaces.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No workspaces found
            </div>
          ) : (
            workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onSelect={() => handleWorkspaceSwitch(workspace.id)}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{workspace.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {workspace.memberCount || 1} members ·{" "}
                    {workspace.paperCount || 0} papers
                  </span>
                </div>
                {workspace.isOwner && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Owner
                  </span>
                )}
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
