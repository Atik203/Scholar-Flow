"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useGetWorkspaceQuery,
  useUpdateWorkspaceMutation,
} from "@/redux/api/workspaceApi";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkspaceEditPage() {
  const isProtected = useProtectedRoute();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: workspace, isLoading, error } = useGetWorkspaceQuery(id);
  const [updateWorkspace, { isLoading: isUpdating }] =
    useUpdateWorkspaceMutation();

  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || "",
      });
    }
  }, [workspace]);

  if (!isProtected) return null;

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
            The workspace you're trying to edit doesn't exist or you don't have
            permission.
          </p>
          <Button asChild>
            <Link href="/dashboard/workspaces">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workspaces
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showErrorToast("Workspace name is required");
      return;
    }
    try {
      await updateWorkspace({
        id,
        name: formData.name,
        description: formData.description,
      }).unwrap();
      showSuccessToast("Workspace updated successfully");
      router.push(`/dashboard/workspaces/${id}`);
    } catch (err: any) {
      showErrorToast(
        err?.data?.message || err?.message || "Failed to update workspace"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/workspaces/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workspace
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Workspace
            </h1>
            <p className="text-muted-foreground">
              Update "{workspace.name}" details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" /> Workspace Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Research Lab"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this workspace..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/dashboard/workspaces/${id}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!formData.name.trim() || isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
