"use client";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  Globe,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
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

interface CreateCollectionPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyWorkspaces = [
  { id: "ws-1", name: "Personal Workspace" },
  { id: "ws-2", name: "Research Lab Alpha" },
  { id: "ws-3", name: "Team Collaboration" },
];

const dummyPapers = [
  { id: "paper-1", title: "Deep Learning in NLP", authors: ["John Smith"] },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare",
    authors: ["Emily Chen"],
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances",
    authors: ["Michael Lee"],
  },
  { id: "paper-4", title: "Quantum Computing", authors: ["Sarah Johnson"] },
  {
    id: "paper-5",
    title: "Neural Network Optimization",
    authors: ["Alex Turner"],
  },
];

// ============================================================================
// Create Collection Page Component
// ============================================================================
export function CreateCollectionPage({
  onNavigate,
}: CreateCollectionPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    workspaceId: "",
  });
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePaper = (paperId: string) => {
    setSelectedPaperIds((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    // Would navigate back
  };

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/collections/create"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Collection
            </h1>
            <p className="text-muted-foreground">
              Organize your research papers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Collection Details Card */}
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5" />
              Collection Details
            </div>

            {/* Workspace Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Workspace *
              </label>
              <select
                value={formData.workspaceId}
                onChange={(e) =>
                  setFormData({ ...formData, workspaceId: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a workspace</option>
                {dummyWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Collection Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter collection name"
                required
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your collection..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {formData.isPublic ? (
                  <Globe className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">
                    {formData.isPublic
                      ? "Public Collection"
                      : "Private Collection"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.isPublic
                      ? "Anyone can view this collection"
                      : "Only you and invited members can view"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isPublic: !formData.isPublic })
                }
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  formData.isPublic ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    formData.isPublic ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Add Papers */}
          <div className="rounded-xl border bg-card p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Add Papers (Optional)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select papers to add to this collection
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dummyPapers.map((paper) => (
                <label
                  key={paper.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPaperIds.includes(paper.id)}
                    onChange={() => togglePaper(paper.id)}
                    className="rounded border-muted-foreground"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{paper.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {paper.authors.join(", ")}
                    </p>
                  </div>
                  {selectedPaperIds.includes(paper.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </label>
              ))}
            </div>
            {selectedPaperIds.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                {selectedPaperIds.length} paper(s) selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!formData.name || !formData.workspaceId || isSubmitting}
              className={cn(
                "px-6 py-2.5 rounded-lg font-medium",
                formData.name && formData.workspaceId && !isSubmitting
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Creating..." : "Create Collection"}
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
    </DashboardLayout>
  );
}

export default CreateCollectionPage;
