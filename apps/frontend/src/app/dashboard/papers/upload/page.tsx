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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useUploadPaperMutation } from "@/redux/api/paperApi";
import { FileText, Plus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        if (!title) {
          setTitle(droppedFile.name.replace(/\.pdf$/i, ""));
        }
      } else {
        showErrorToast("Please select a PDF file");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        if (!title) {
          setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
        }
      } else {
        showErrorToast("Please select a PDF file");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showErrorToast("Please select a file to upload");
      return;
    }

    try {
      const result = await uploadPaper({
        file,
        title: title.trim() || undefined,
        authors: authors.length > 0 ? authors : undefined,
        year: year || undefined,
      }).unwrap();

      showSuccessToast("Paper uploaded successfully!");
      router.push(`/dashboard/papers/${result.data.paper.id}`);
    } catch (error) {
      showErrorToast("Failed to upload paper");
      console.error("Upload error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Paper</h1>
          <p className="text-muted-foreground">
            Add a new research paper to your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Select PDF File</CardTitle>
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
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drop your PDF here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Only PDF files are supported
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
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
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Uploading..." : "Upload Paper"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
