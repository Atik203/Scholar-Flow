"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColorPicker,
  getWorkspaceColor,
  type WorkspaceColor,
} from "@/components/workspace/WorkspaceCard";
import { showApiErrorToast } from "@/lib/errorHandling";
import { useCreateWorkspaceMutation } from "@/redux/api/workspaceApi";
import { ArrowLeft, Building2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function CreateWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState<WorkspaceColor>("blue");
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
  const colorMeta = getWorkspaceColor(color);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await createWorkspace({ name: name.trim(), color }).unwrap();
      showSuccessToast("Workspace created successfully");
      router.push(`/dashboard/workspaces/${result.id}`);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Create New Workspace</h1>
        <p className="text-muted-foreground">
          Set up a new workspace to organize your research and collaborate with others
        </p>
      </div>

      {/* Back Button */}
      <Link
        href="/dashboard/workspaces"
        className="inline-flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workspaces
      </Link>

      {/* Creation Form */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorMeta.gradient)}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Workspace Details</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Workspace Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter workspace name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
              />
              <p className="text-sm text-muted-foreground">
                Choose a descriptive name for your workspace (2–120 characters)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color Theme</label>
              <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className="flex gap-4 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !name.trim()}
                className={cn(
                  "px-6 py-2.5 rounded-lg font-medium",
                  name.trim() && !isLoading
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isLoading ? "Creating…" : "Create Workspace"}
              </motion.button>
              <Link
                href="/dashboard/workspaces"
                className="px-6 py-2.5 border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">What is a workspace?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            A shared space for organizing research papers and collections
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Collaborate with team members and share resources
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Manage permissions and access controls
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Track activity and progress across projects
          </li>
        </ul>
      </div>
    </div>
  );
}
