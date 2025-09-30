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
import { showApiErrorToast } from "@/lib/errorHandling";
import { useCreateWorkspaceMutation } from "@/redux/api/workspaceApi";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateWorkspacePage() {
  const [name, setName] = useState("");
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showErrorToast("Workspace name is required");
      return;
    }

    try {
      const result = await createWorkspace({ name: name.trim() }).unwrap();
      showSuccessToast("Workspace created successfully!");
      router.push(`/dashboard/workspaces/${result.id}`);
    } catch (error) {
      showApiErrorToast(error as any);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Workspace
            </h1>
            <p className="text-muted-foreground">
              Set up a new workspace to organize your research and collaborate
              with others
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/dashboard/workspaces">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspaces
          </Link>
        </Button>

        {/* Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Workspace Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter workspace name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={120}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Choose a descriptive name for your workspace (2-120
                  characters)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading || !name.trim()}>
                  {isLoading ? "Creating..." : "Create Workspace"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/workspaces">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">What is a workspace?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • A shared space for organizing research papers and
                  collections
                </li>
                <li>• Collaborate with team members and share resources</li>
                <li>• Manage permissions and access controls</li>
                <li>• Track activity and progress across projects</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
