"use client";

import { PdfAnnotationViewerEnhanced } from "@/components/annotations/PdfAnnotationViewerEnhanced";
import { CommentSection } from "@/components/comments/CommentSection";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { DocumentPreview } from "@/components/papers/DocumentPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useGetPaperFileUrlQuery,
  useListPapersQuery,
} from "@/redux/api/paperApi";
import {
  ArrowLeft,
  Eye,
  FileText,
  Highlighter,
  MessageSquare,
  StickyNote,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ResearchAnnotationsPage() {
  const isProtected = useProtectedRoute();
  const [activeTab, setActiveTab] = useState<
    "preview" | "annotations" | "comments" | "notes"
  >("preview");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  // Fetch user's papers from database
  const {
    data: papersData,
    isLoading: papersLoading,
    isError: papersError,
  } = useListPapersQuery({
    page: 1,
    limit: 50, // Get more papers for annotation
  });

  const papers = useMemo(() => papersData?.items || [], [papersData?.items]);

  // Hook for signed file URL - fetch when a paper is selected
  const {
    data: fileUrlData,
    isFetching: isFetchingFileUrl,
    error: fileUrlError,
  } = useGetPaperFileUrlQuery(selectedPaperId!, { skip: !selectedPaperId });

  // Auto-select first paper with PDF file if none selected
  useEffect(() => {
    if (!selectedPaperId && papers.length > 0) {
      const firstPaperWithFile = papers.find(
        (paper) =>
          paper.file &&
          paper.file.originalFilename &&
          paper.processingStatus === "PROCESSED"
      );
      if (firstPaperWithFile) {
        setSelectedPaperId(firstPaperWithFile.id);
      }
    }
  }, [papers, selectedPaperId]);

  // Debug logging
  useEffect(() => {
    if (selectedPaperId) {
      console.log("Selected paper ID:", selectedPaperId);
      console.log("File URL data:", fileUrlData);
      console.log("File URL error:", fileUrlError);
      console.log("Is fetching file URL:", isFetchingFileUrl);
    }
  }, [selectedPaperId, fileUrlData, fileUrlError, isFetchingFileUrl]);

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PROCESSED: {
        variant: "outline" as const,
        label: "Ready",
        color: "text-green-600",
      },
      PROCESSING: {
        variant: "default" as const,
        label: "Processing",
        color: "text-blue-600",
      },
      UPLOADED: {
        variant: "secondary" as const,
        label: "Uploaded",
        color: "text-yellow-600",
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        color: "text-red-600",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="hover:bg-white/80">
              <Link href="/dashboard/researcher/research">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Research Tools
              </Link>
            </Button>
            <div className="h-6 border-l border-border" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                PDF Annotations
              </h1>
              <p className="text-sm text-muted-foreground">
                Annotate, highlight, and collaborate on your research papers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Paper Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Papers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {papersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : papersError ? (
                  <div className="text-center py-8 text-destructive">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Failed to load papers</p>
                    <p className="text-sm">Please try refreshing the page</p>
                  </div>
                ) : papers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No papers available</p>
                    <p className="text-sm">Upload papers to start annotating</p>
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/papers/upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Paper
                      </Link>
                    </Button>
                  </div>
                ) : (
                  papers.map((paper) => {
                    const statusBadge = getStatusBadge(paper.processingStatus);
                    const hasFile = paper.file && paper.file.originalFilename;
                    const authors = paper.metadata?.authors || [];
                    const year = paper.metadata?.year;

                    return (
                      <Card
                        key={paper.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPaperId === paper.id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        } ${!hasFile ? "opacity-60" : ""}`}
                        onClick={() => hasFile && setSelectedPaperId(paper.id)}
                        title={
                          !hasFile ? "No PDF file available for annotation" : ""
                        }
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {paper.title}
                              </h3>
                              <Badge
                                variant={statusBadge.variant}
                                className="text-xs shrink-0 ml-2"
                              >
                                {statusBadge.label}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {authors.length > 0 && (
                                <div className="line-clamp-1">
                                  {authors.slice(0, 2).join(", ")}
                                  {authors.length > 2 && "..."}
                                </div>
                              )}
                              {year && <div>{year}</div>}
                              {paper.file && (
                                <div className="text-xs text-blue-600 mt-1">
                                  📄 {paper.file.originalFilename}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Annotation Area */}
          <div className="lg:col-span-3">
            {!selectedPaperId ? (
              <Card className="shadow-sm border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Highlighter className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a Paper to Annotate
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Choose a paper from the sidebar to start adding annotations,
                    comments, and notes.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {papers.find((p) => p.id === selectedPaperId)?.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(() => {
                          const paper = papers.find(
                            (p) => p.id === selectedPaperId
                          );
                          const authors = paper?.metadata?.authors || [];
                          const year = paper?.metadata?.year;
                          return `${authors.slice(0, 2).join(", ")}${authors.length > 2 ? "..." : ""}${year ? ` • ${year}` : ""}`;
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b mt-4">
                    <nav className="flex space-x-8">
                      {[
                        { id: "preview", label: "Preview", icon: Eye },
                        {
                          id: "annotations",
                          label: "Annotations",
                          icon: Highlighter,
                        },
                        {
                          id: "comments",
                          label: "Comments",
                          icon: MessageSquare,
                        },
                        { id: "notes", label: "Notes", icon: StickyNote },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {/* Preview Tab */}
                  {activeTab === "preview" && (
                    <>
                      {isFetchingFileUrl ? (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">
                              Loading PDF...
                            </p>
                          </div>
                        </div>
                      ) : fileUrlError ? (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-destructive">
                              Failed to Load PDF
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              There was an error loading the PDF file for this
                              paper.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => window.location.reload()}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        </div>
                      ) : fileUrlData?.data?.url && selectedPaperId ? (
                        <div className="h-[600px] border rounded-lg">
                          <DocumentPreview
                            fileUrl={fileUrlData.data.url}
                            fileName={
                              papers.find((p) => p.id === selectedPaperId)?.file
                                ?.originalFilename
                            }
                            mimeType={
                              papers.find((p) => p.id === selectedPaperId)?.file
                                ?.contentType
                            }
                            originalFilename={
                              papers.find((p) => p.id === selectedPaperId)?.file
                                ?.originalFilename
                            }
                            className="h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                              PDF Not Available
                            </h3>
                            <p className="text-muted-foreground">
                              The PDF file for this paper is not available for
                              preview.
                            </p>
                            <div className="mt-4 text-xs text-muted-foreground">
                              <p>Paper ID: {selectedPaperId}</p>
                              <p>
                                File URL Data:{" "}
                                {fileUrlData ? "Available" : "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Annotations Tab */}
                  {activeTab === "annotations" && (
                    <>
                      {isFetchingFileUrl ? (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">
                              Loading PDF...
                            </p>
                          </div>
                        </div>
                      ) : fileUrlError ? (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-destructive">
                              Failed to Load PDF
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              There was an error loading the PDF file for this
                              paper.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => window.location.reload()}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        </div>
                      ) : fileUrlData?.data?.url && selectedPaperId ? (
                        <div className="h-[600px] border rounded-lg overflow-hidden">
                          <PdfAnnotationViewerEnhanced
                            fileUrl={fileUrlData.data.url}
                            paperId={selectedPaperId}
                            className="h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-[600px] border rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                              PDF Not Available
                            </h3>
                            <p className="text-muted-foreground">
                              The PDF file for this paper is not available for
                              annotation.
                            </p>
                            <div className="mt-4 text-xs text-muted-foreground">
                              <p>Paper ID: {selectedPaperId}</p>
                              <p>
                                File URL Data:{" "}
                                {fileUrlData ? "Available" : "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Comments Tab */}
                  {activeTab === "comments" && (
                    <div className="h-[600px] border rounded-lg">
                      <CommentSection
                        paperId={selectedPaperId}
                        className="h-full"
                      />
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div className="h-[600px] border rounded-lg">
                      <NotesPanel
                        paperId={selectedPaperId}
                        className="h-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
