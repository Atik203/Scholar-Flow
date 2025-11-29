"use client";

import { ArrowLeft, BookOpen, Building2, Check, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

interface UploadPaperPageProps {
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
// Dummy Data
// ============================================================================
const dummyWorkspaces = [
  { id: "ws-1", name: "Personal Workspace" },
  { id: "ws-2", name: "Research Lab Alpha" },
  { id: "ws-3", name: "Team Collaboration" },
];

const dummyCollections = [
  { id: "col-1", name: "Machine Learning Papers", workspaceId: "ws-1" },
  { id: "col-2", name: "Deep Learning Research", workspaceId: "ws-1" },
  { id: "col-3", name: "NLP Studies", workspaceId: "ws-2" },
];

// ============================================================================
// Upload Paper Page Component
// ============================================================================
export function UploadPaperPage({
  onNavigate,
  role: propRole,
}: UploadPaperPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    []
  );
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.(pdf|docx|doc)$/i, ""));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.(pdf|docx|doc)$/i, ""));
      }
    }
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
      setAuthors([...authors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(i);
    }
    setIsUploading(false);
    setUploadProgress(0);
    // Reset form
    setFile(null);
    setTitle("");
    setAuthors([]);
    setYear("");
  };

  const filteredCollections = dummyCollections.filter(
    (c) => !selectedWorkspaceId || c.workspaceId === selectedWorkspaceId
  );

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/papers/upload"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Papers
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Upload Paper
              </h1>
              <p className="text-muted-foreground">
                Upload and organize your research papers
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Zone */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Upload File</h2>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    {file ? (
                      <>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                          }}
                          className="text-sm text-destructive hover:underline"
                        >
                          Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Drag and drop your file here
                          </p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse (PDF, DOCX, DOC)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Upload Progress */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-muted-foreground">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Paper Details */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Paper Details</h2>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter paper title"
                    className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="text-sm font-medium">Authors</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Add author name"
                      onKeyDown={(e) => e.key === "Enter" && addAuthor()}
                      className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addAuthor}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                      Add
                    </motion.button>
                  </div>
                  {authors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {authors.map((author, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                        >
                          {author}
                          <button
                            onClick={() => removeAuthor(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm font-medium">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value ? parseInt(e.target.value) : "")
                    }
                    placeholder="e.g., 2024"
                    min="1900"
                    max="2100"
                    className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Organization */}
          <div className="space-y-6">
            {/* Workspace Selection */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Workspace
                </h3>
                <button
                  onClick={() => setShowCreateWorkspace(true)}
                  className="text-sm text-primary hover:underline"
                >
                  + New
                </button>
              </div>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select workspace</option>
                {dummyWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Collections Selection */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Collections
                </h3>
                <button
                  onClick={() => setShowCreateCollection(true)}
                  className="text-sm text-primary hover:underline"
                >
                  + New
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCollectionIds.includes(col.id)}
                        onChange={() => toggleCollection(col.id)}
                        className="rounded border-muted-foreground"
                      />
                      <span className="text-sm">{col.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkspaceId
                      ? "No collections in this workspace"
                      : "Select a workspace first"}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!file || !title || !selectedWorkspaceId || isUploading}
              className={cn(
                "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2",
                file && title && selectedWorkspaceId && !isUploading
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Upload className="h-5 w-5" />
              {isUploading ? "Uploading..." : "Upload Paper"}
            </motion.button>
          </div>
        </div>

        {/* Create Workspace Dialog */}
        <AnimatePresence>
          {showCreateWorkspace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowCreateWorkspace(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Create Workspace</h3>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Workspace name"
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowCreateWorkspace(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Would create workspace
                      setShowCreateWorkspace(false);
                      setNewWorkspaceName("");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Collection Dialog */}
        <AnimatePresence>
          {showCreateCollection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowCreateCollection(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Create Collection
                </h3>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowCreateCollection(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateCollection(false);
                      setNewCollectionName("");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default UploadPaperPage;
