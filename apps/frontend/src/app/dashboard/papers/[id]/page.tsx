"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PdfPreview } from "@/components/papers/PdfPreview";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useDeletePaperMutation,
  useGetPaperFileUrlQuery,
  useGetPaperQuery,
  useUpdatePaperMetadataMutation,
} from "@/redux/api/paperApi";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  FileText,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

interface PaperDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PaperDetailPage({ params }: PaperDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isProtected = useProtectedRoute();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editAuthors, setEditAuthors] = useState<string[]>([]);
  const [editYear, setEditYear] = useState<number | "">("");
  const [newAuthor, setNewAuthor] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const {
    data: paper,
    isLoading,
    isError,
    error,
  } = useGetPaperQuery(resolvedParams.id);

  const [updateMetadata, { isLoading: isUpdating }] =
    useUpdatePaperMetadataMutation();
  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();

  // Hook for signed file URL must be declared unconditionally
  const { data: fileUrlData, isFetching: isFetchingFileUrl } =
    useGetPaperFileUrlQuery(resolvedParams.id, { skip: !showPreview });

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  const startEditing = () => {
    if (paper) {
      setEditTitle(paper.title);
      setEditAbstract(paper.abstract || "");
      setEditAuthors(paper.metadata.authors || []);
      setEditYear(paper.metadata.year || "");
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewAuthor("");
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !editAuthors.includes(newAuthor.trim())) {
      setEditAuthors([...editAuthors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    setEditAuthors(editAuthors.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!paper) return;

    try {
      await updateMetadata({
        id: paper.id,
        title: editTitle.trim() || undefined,
        abstract: editAbstract.trim() || undefined,
        authors: editAuthors.length > 0 ? editAuthors : undefined,
        year: editYear || undefined,
      }).unwrap();

      setIsEditing(false);
      showSuccessToast("Paper metadata updated successfully");
    } catch (error) {
      showErrorToast("Failed to update paper metadata");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (!paper) return;

    try {
      await deletePaper(paper.id).unwrap();
      showSuccessToast("Paper deleted successfully");
      router.push("/dashboard/papers");
    } catch (error) {
      showErrorToast("Failed to delete paper");
      console.error("Delete error:", error);
    }
  };

  const getProcessingStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: {
        variant: "secondary" as const,
        label: "Uploaded",
        color: "text-yellow-600",
      },
      PROCESSING: {
        variant: "default" as const,
        label: "Processing",
        color: "text-blue-600",
      },
      PROCESSED: {
        variant: "outline" as const,
        label: "Processed",
        color: "text-green-600",
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        color: "text-red-600",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !paper) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Paper Not Found</CardTitle>
              <CardDescription>
                The paper you're looking for doesn't exist or you don't have
                access to it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/papers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Papers
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const statusBadge = getProcessingStatusBadge(paper.processingStatus);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/papers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Papers
            </Link>
          </Button>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <Button onClick={startEditing} disabled={isUpdating}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Paper</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{paper.title}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button onClick={cancelEditing} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Paper Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="abstract">Abstract</Label>
                          <Textarea
                            id="abstract"
                            value={editAbstract}
                            onChange={(e) => setEditAbstract(e.target.value)}
                            rows={4}
                            placeholder="Enter paper abstract..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CardTitle className="text-2xl leading-tight">
                          {paper.title}
                        </CardTitle>
                        {paper.abstract && (
                          <CardDescription className="mt-4 text-base leading-relaxed">
                            {paper.abstract}
                          </CardDescription>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge variant={statusBadge.variant} className="ml-4">
                    {statusBadge.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Authors */}
                <div>
                  <Label className="text-sm font-medium">Authors</Label>
                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <div className="flex space-x-2">
                        <Input
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          placeholder="Add author name..."
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addAuthor())
                          }
                        />
                        <Button type="button" onClick={addAuthor} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {editAuthors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editAuthors.map((author, index) => (
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
                  ) : (
                    <div className="mt-2">
                      {paper.metadata.authors &&
                      paper.metadata.authors.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {paper.metadata.authors.map((author, index) => (
                            <Badge key={index} variant="outline">
                              <User className="mr-1 h-3 w-3" />
                              {author}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No authors specified
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div>
                  <Label className="text-sm font-medium">
                    Publication Year
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={editYear}
                      onChange={(e) =>
                        setEditYear(
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2">
                      {paper.metadata.year ? (
                        <Badge variant="outline">
                          <Calendar className="mr-1 h-3 w-3" />
                          {paper.metadata.year}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paper.file ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">
                          {paper.file.originalFilename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(paper.file.sizeBytes)}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Content Type:</span>
                        <span className="text-muted-foreground">
                          {paper.file.contentType || "application/pdf"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="text-muted-foreground capitalize">
                          {paper.file.storageProvider}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Dialog open={showPreview} onOpenChange={setShowPreview}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            disabled={isFetchingFileUrl}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {isFetchingFileUrl ? "Loading..." : "Preview PDF"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{paper.title}</DialogTitle>
                          </DialogHeader>
                          <div className="max-h-[80vh] overflow-auto">
                            {fileUrlData?.data?.url ? (
                              <PdfPreview
                                fileUrl={fileUrlData.data.url}
                                className="mx-auto"
                              />
                            ) : (
                              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                Generating preview...
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {/* Future: Add download/preview buttons */}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No file information available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Paper Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={statusBadge.variant} className="text-xs">
                    {statusBadge.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="text-muted-foreground capitalize">
                    {paper.source || "Upload"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-muted-foreground">
                    {formatDate(paper.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span className="text-muted-foreground">
                    {formatDate(paper.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
