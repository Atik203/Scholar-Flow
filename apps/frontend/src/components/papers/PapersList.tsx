"use client";

import { DocumentPreview } from "@/components/papers/DocumentPreview";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeletePaperMutation,
  useGetPaperFileUrlQuery,
  useListPapersQuery,
  useProcessPDFMutation,
  type Paper,
} from "@/redux/api/paperApi";
import { Calendar, Eye, FileText, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
// Using native date formatting to avoid external dependency

interface PapersListProps {
  searchTerm?: string;
  workspaceId?: string;
}

export function PapersList({ searchTerm = "", workspaceId }: PapersListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Get papers (workspace-scoped if workspaceId provided)
  const {
    data: papersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useListPapersQuery({
    page,
    limit,
    workspaceId,
  });

  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();
  const [processPDF, { isLoading: isProcessing }] = useProcessPDFMutation();
  const [previewPaperId, setPreviewPaperId] = useState<string | null>(null);
  const { data: previewUrlData, isFetching: previewLoading } =
    useGetPaperFileUrlQuery(previewPaperId || "", { skip: !previewPaperId });

  // Filter papers based on search term
  const filteredPapers: Paper[] = useMemo(() => {
    if (!papersData?.items || !searchTerm.trim()) {
      return papersData?.items || [];
    }

    const searchTermLower = searchTerm.toLowerCase();
    return papersData.items.filter(
      (paper) =>
        paper.title.toLowerCase().includes(searchTermLower) ||
        paper.abstract?.toLowerCase().includes(searchTermLower) ||
        paper.metadata?.authors?.some((author) =>
          author.toLowerCase().includes(searchTermLower)
        )
    );
  }, [papersData?.items, searchTerm]);

  const handleDeletePaper = async (paperId: string, paperTitle: string) => {
    try {
      await deletePaper(paperId).unwrap();
      showSuccessToast(`Paper "${paperTitle}" deleted successfully`);
    } catch (error) {
      showErrorToast("Failed to delete paper");
      console.error("Delete error:", error);
    }
  };

  const handleProcessPDF = async (paperId: string, paperTitle: string) => {
    try {
      await processPDF(paperId).unwrap();
      showSuccessToast(`PDF processing started for "${paperTitle}"`);
    } catch (error) {
      showErrorToast("Failed to start PDF processing");
      console.error("Processing error:", error);
    }
  };

  const getProcessingStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: { variant: "secondary" as const, label: "Uploaded" },
      PROCESSING: { variant: "default" as const, label: "Processing" },
      PROCESSED: { variant: "outline" as const, label: "Processed" },
      FAILED: { variant: "destructive" as const, label: "Failed" },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Papers</CardTitle>
          <CardDescription>Loading your research papers...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Papers</CardTitle>
          <CardDescription>Failed to load papers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Unable to load papers. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const papers = filteredPapers;
  const meta = papersData?.meta;

  if (papers.length === 0) {
    const isSearching = searchTerm.trim().length > 0;
    const hasWorkspace = workspaceId && workspaceId.trim().length > 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Papers</CardTitle>
          <CardDescription>
            {isSearching
              ? "No papers match your search criteria"
              : hasWorkspace
                ? "No papers found in this workspace"
                : "Select a workspace to view papers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {isSearching
                ? "Try adjusting your search terms or filters."
                : hasWorkspace
                  ? "Upload your first paper to get started with ScholarFlow."
                  : "Choose a workspace from the dropdown above to see papers."}
            </p>
            {hasWorkspace && !isSearching && (
              <Button asChild>
                <Link
                  href={`/dashboard/papers/upload${workspaceId ? `?workspaceId=${workspaceId}` : ""}`}
                >
                  Upload Paper
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Papers</CardTitle>
        <CardDescription>
          {searchTerm.trim()
            ? `${papers.length} paper${papers.length !== 1 ? "s" : ""} found matching "${searchTerm}"`
            : `${meta?.total} paper${meta?.total !== 1 ? "s" : ""} found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File Info</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => {
              const statusBadge = getProcessingStatusBadge(
                paper.processingStatus
              );
              return (
                <TableRow key={paper.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{paper.title}</span>
                      {paper.metadata.authors && (
                        <span className="text-sm text-muted-foreground">
                          {paper.metadata.authors.join(", ")}
                        </span>
                      )}
                      {paper.metadata.year && (
                        <span className="text-sm text-muted-foreground">
                          {paper.metadata.year}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{paper.file?.originalFilename || "N/A"}</span>
                      <span className="text-muted-foreground">
                        {formatFileSize(paper.file?.sizeBytes)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(paper.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/papers/${paper.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {paper.processingStatus === "UPLOADED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleProcessPDF(paper.id, paper.title)
                          }
                          disabled={isProcessing}
                          title="Start PDF processing"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {paper.file && (
                        <Dialog
                          open={previewPaperId === paper.id}
                          onOpenChange={(open) =>
                            setPreviewPaperId(open ? paper.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{paper.title}</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[80vh] overflow-auto">
                              {previewLoading && (
                                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                  Loading preview...
                                </div>
                              )}
                              {previewUrlData?.data?.url && (
                                <DocumentPreview
                                  fileUrl={previewUrlData.data.url}
                                  fileName={paper.file?.originalFilename}
                                  mimeType={paper.file?.contentType}
                                  originalFilename={
                                    paper.file?.originalFilename
                                  }
                                  className="mx-auto"
                                />
                              )}
                              {!previewLoading &&
                                !previewUrlData?.data?.url && (
                                  <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                    Preview unavailable
                                  </div>
                                )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Paper</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{paper.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeletePaper(paper.id, paper.title)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPage} • {meta.total} total papers
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= meta.totalPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
