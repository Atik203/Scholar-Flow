"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useAddPaperToCollectionMutation,
  useCreateCollectionMutation,
  useGetMyCollectionsQuery,
} from "@/redux/api/collectionApi";
import { useUploadPaperMutation } from "@/redux/api/paperApi";
import {
  useCreateWorkspaceMutation,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  FileText,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPaperPage() {
  const router = useRouter();
  const isProtected = useProtectedRoute();
  const [uploadPaper, { isLoading }] = useUploadPaperMutation();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [dragActive, setDragActive] = useState(false);

  // Workspace and Collection selection
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    []
  );
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  // API hooks
  const { data: workspacesData } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });
  const { data: collectionsData } = useGetMyCollectionsQuery(
    selectedWorkspaceId
      ? { workspaceId: selectedWorkspaceId, page: 1, limit: 50 }
      : { page: 1, limit: 50 },
    { skip: !selectedWorkspaceId }
  );
  const [createWorkspace, { isLoading: creatingWorkspace }] =
    useCreateWorkspaceMutation();
  const [createCollection, { isLoading: creatingCollection }] =
    useCreateCollectionMutation();
  const [addPaperToCollection] = useAddPaperToCollectionMutation();

  // Auto-select first workspace if only one available
  useEffect(() => {
    const workspaces = workspacesData?.data || [];
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspacesData, selectedWorkspaceId]);

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

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
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/msword", // DOC
      ];

      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        if (!title) {
          // Extract title from filename, removing common extensions
          setTitle(droppedFile.name.replace(/\.(pdf|docx|doc)$/i, ""));
        }
      } else {
        showErrorToast("Please select a PDF, DOCX, or DOC file");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/msword", // DOC
      ];

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        if (!title) {
          // Extract title from filename, removing common extensions
          setTitle(selectedFile.name.replace(/\.(pdf|docx|doc)$/i, ""));
        }
      } else {
        showErrorToast("Please select a PDF, DOCX, or DOC file");
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

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      const result = await createWorkspace({
        name: newWorkspaceName.trim(),
      }).unwrap();
      setSelectedWorkspaceId(result.id);
      setNewWorkspaceName("");
      setShowCreateWorkspace(false);
      showSuccessToast("Workspace created successfully");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to create workspace");
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !selectedWorkspaceId) return;

    try {
      const result = await createCollection({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || undefined,
        workspaceId: selectedWorkspaceId,
      }).unwrap();
      setSelectedCollectionIds([...selectedCollectionIds, result.id]);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setShowCreateCollection(false);
      showSuccessToast("Collection created successfully");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to create collection");
    }
  };

  const toggleCollectionSelection = (collectionId: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showErrorToast("Please select a file to upload");
      return;
    }

    if (!selectedWorkspaceId) {
      showErrorToast("Please select a workspace");
      return;
    }

    try {
      const result = await uploadPaper({
        file,
        workspaceId: selectedWorkspaceId,
        title: title.trim() || undefined,
        authors: authors.length > 0 ? authors : undefined,
        year: year || undefined,
      }).unwrap();

      showSuccessToast("Paper uploaded successfully!");

      // Add paper to selected collections
      if (selectedCollectionIds.length > 0) {
        try {
          await Promise.all(
            selectedCollectionIds.map((collectionId) =>
              addPaperToCollection({
                collectionId,
                data: { paperId: result.data.paper.id },
              }).unwrap()
            )
          );
          showSuccessToast(
            `Paper added to ${selectedCollectionIds.length} collection${selectedCollectionIds.length !== 1 ? "s" : ""}`
          );
        } catch (collectionError) {
          console.warn(
            "Failed to add paper to some collections:",
            collectionError
          );
          showErrorToast(
            "Paper uploaded but failed to add to some collections"
          );
        }
      }

      router.push(`/dashboard/papers/${result.data.paper.id}`);
    } catch (error: any) {
      console.error("Upload error:", error);

      // Extract meaningful error message
      let errorMessage = "Failed to upload paper";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 401) {
        errorMessage = "Authentication required. Please sign in again.";
      } else if (error?.status === 403) {
        errorMessage =
          "Upload feature is disabled or you don't have permission.";
      } else if (error?.status === 413) {
        errorMessage = "File is too large. Maximum size is 25MB.";
      }

      showErrorToast(errorMessage);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/papers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Papers
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Upload Paper
              </h1>
              <p className="text-muted-foreground">
                Add a new research paper to your workspace
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/papers/search">
                <Search className="mr-2 h-4 w-4" />
                Advanced Search
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Select Document File</CardTitle>
                <CardDescription>
                  Upload a PDF research paper (max 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!file ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Drop your document here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOCX, and DOC files
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workspace and Collection Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Workspace & Collections
                </CardTitle>
                <CardDescription>
                  Choose where to upload your paper and optionally add it to
                  collections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Workspace Selection */}
                <div>
                  <Label htmlFor="workspace">Workspace *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedWorkspaceId}
                      onValueChange={setSelectedWorkspaceId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select workspace" />
                      </SelectTrigger>
                      <SelectContent>
                        {workspacesData?.data?.length ? (
                          workspacesData.data.map((workspace) => (
                            <SelectItem key={workspace.id} value={workspace.id}>
                              {workspace.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-3 text-sm text-muted-foreground">
                            {workspacesData
                              ? "No workspaces available"
                              : "Loading workspaces..."}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <Dialog
                      open={showCreateWorkspace}
                      onOpenChange={setShowCreateWorkspace}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Workspace</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleCreateWorkspace}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="workspaceName">
                              Workspace Name
                            </Label>
                            <Input
                              id="workspaceName"
                              value={newWorkspaceName}
                              onChange={(e) =>
                                setNewWorkspaceName(e.target.value)
                              }
                              placeholder="Enter workspace name"
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowCreateWorkspace(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                creatingWorkspace || !newWorkspaceName.trim()
                              }
                            >
                              {creatingWorkspace ? "Creating..." : "Create"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Collection Selection */}
                {selectedWorkspaceId && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Collections (Optional)
                      </Label>
                      <Dialog
                        open={showCreateCollection}
                        onOpenChange={setShowCreateCollection}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-3 w-3 mr-1" />
                            New Collection
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Collection</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={handleCreateCollection}
                            className="space-y-4"
                          >
                            <div>
                              <Label htmlFor="collectionName">
                                Collection Name
                              </Label>
                              <Input
                                id="collectionName"
                                value={newCollectionName}
                                onChange={(e) =>
                                  setNewCollectionName(e.target.value)
                                }
                                placeholder="Enter collection name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="collectionDescription">
                                Description (Optional)
                              </Label>
                              <Input
                                id="collectionDescription"
                                value={newCollectionDescription}
                                onChange={(e) =>
                                  setNewCollectionDescription(e.target.value)
                                }
                                placeholder="Enter collection description"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateCollection(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={
                                  creatingCollection ||
                                  !newCollectionName.trim()
                                }
                              >
                                {creatingCollection ? "Creating..." : "Create"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                      {collectionsData?.result?.length ? (
                        <div className="space-y-2">
                          {collectionsData.result.map((collection) => (
                            <div
                              key={collection.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={collection.id}
                                checked={selectedCollectionIds.includes(
                                  collection.id
                                )}
                                onCheckedChange={() =>
                                  toggleCollectionSelection(collection.id)
                                }
                              />
                              <Label
                                htmlFor={collection.id}
                                className="flex-1 text-sm cursor-pointer"
                              >
                                {collection.name}
                                {collection.description && (
                                  <span className="text-muted-foreground ml-1">
                                    - {collection.description}
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No collections in this workspace yet
                        </p>
                      )}
                    </div>
                    {selectedCollectionIds.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected {selectedCollectionIds.length} collection
                        {selectedCollectionIds.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paper Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Paper Details</CardTitle>
                <CardDescription>
                  Provide information about the paper (optional but recommended)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter paper title..."
                  />
                </div>

                <div>
                  <Label>Authors</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Add author name..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addAuthor())
                      }
                    />
                    <Button type="button" onClick={addAuthor} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {authors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {authors.map((author, index) => (
                        <Badge key={index} variant="secondary">
                          {author}
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">Publication Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value ? parseInt(e.target.value) : "")
                    }
                    placeholder="e.g. 2024"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading paper...</span>
                      <span>Please wait</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || !selectedWorkspaceId || isLoading}
              >
                {isLoading ? "Uploading..." : "Upload Paper"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
