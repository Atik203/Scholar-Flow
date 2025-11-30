"use client";

import { ArrowLeft, Building2 } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface CreateWorkspacePageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Create Workspace Page Component
// ============================================================================
export function CreateWorkspacePage({
  onNavigate,
  role: propRole,
}: CreateWorkspacePageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setName("");
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/workspaces/create"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Workspace
          </h1>
          <p className="text-muted-foreground">
            Set up a new workspace to organize your research and collaborate
            with others
          </p>
        </div>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspaces
        </motion.button>

        {/* Creation Form */}
        <div className="rounded-xl border bg-card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Workspace Details
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Workspace Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter workspace name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={120}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Choose a descriptive name for your workspace (2-120
                  characters)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || !name.trim()}
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-medium",
                    name.trim() && !isSubmitting
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Creating..." : "Create Workspace"}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">What is a workspace?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>A shared space for
              organizing research papers and collections
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
    </DashboardLayout>
  );
}

export default CreateWorkspacePage;
