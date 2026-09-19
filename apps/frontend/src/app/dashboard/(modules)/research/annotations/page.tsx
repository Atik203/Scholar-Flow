"use client";

import { PdfAnnotationViewerEnhanced } from "@/components/annotations/PdfAnnotationViewerEnhanced";
import { CommentSection } from "@/components/comments/CommentSection";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { DocumentPreview } from "@/components/papers/DocumentPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  type Paper,
  useGetPaperFileUrlQuery,
  useListPapersQuery,
} from "@/redux/api/paperApi";
import {
  ArrowLeft,
  Eye,
  FileText,
  Highlighter,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  StickyNote,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAPERS_PANEL_STORAGE_KEY = "scholarflow:annotations:papers-panel";

const STATUS_BADGES = {
  PROCESSED: {
    variant: "outline" as const,
    label: "Ready",
    color: "text-green-600 dark:text-green-400",
  },
  PROCESSING: {
    variant: "default" as const,
    label: "Processing",
    color: "text-blue-600 dark:text-blue-400",
  },
  UPLOADED: {
    variant: "secondary" as const,
    label: "Uploaded",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  FAILED: {
    variant: "destructive" as const,
    label: "Failed",
    color: "text-red-600 dark:text-red-400",
  },
};

function getStatusBadge(status: string) {
  return (
    STATUS_BADGES[status as keyof typeof STATUS_BADGES] || STATUS_BADGES.UPLOADED
  );
}

function PdfPaneState({
  variant,
  description,
  onRetry,
}: {
  variant: "loading" | "error" | "missing";
  description?: string;
  onRetry?: () => void;
}) {
  if (variant === "loading") {
    return (
      <div className="min-h-[70vh] border rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  const isError = variant === "error";
  return (
    <div className="min-h-[70vh] border rounded-lg flex items-center justify-center">
      <div className="text-center">
        <FileText
          className={`h-12 w-12 mx-auto mb-4 ${
            isError ? "text-destructive" : "text-muted-foreground"
          }`}
        />
        <h3
          className={`text-lg font-semibold mb-2 ${
            isError ? "text-destructive" : ""
          }`}
        >
          {isError ? "Failed to Load PDF" : "PDF Not Available"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {description ??
            (isError
              ? "There was an error loading the PDF file for this paper."
              : "The PDF file for this paper is not available.")}
        </p>
        {isError && onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

interface PapersPanelContentProps {  papers: Paper[];
  papersLoading: boolean;
  papersError: boolean;
  selectedPaperId: string | null;
  onSelect: (paperId: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  annotatableOnly: boolean;
  onAnnotatableOnlyChange: (value: boolean) => void;
}

function PapersPanelContent({
  papers,
  papersLoading,
  papersError,
  selectedPaperId,
  onSelect,
  search,
  onSearchChange,
  annotatableOnly,
  onAnnotatableOnlyChange,
}: PapersPanelContentProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search papers..."
          className="h-8 pl-8 text-sm"
          aria-label="Search papers"
        />
      </div>

      <button
        type="button"
        onClick={() => onAnnotatableOnlyChange(!annotatableOnly)}
        aria-pressed={annotatableOnly}
        className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
          annotatableOnly
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:bg-muted/50"
        }`}
      >
        {annotatableOnly ? "Showing PDF-ready papers only" : "Show PDF-ready papers only"}
      </button>

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
          <p>{search || annotatableOnly ? "No matching papers" : "No papers available"}</p>
          <p className="text-sm">
            {search || annotatableOnly
              ? "Try a different search or filter"
              : "Upload papers to start annotating"}
          </p>
          {!search && !annotatableOnly && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/papers/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Paper
              </Link>
            </Button>
          )}
        </div>
      ) : (
        papers.map((paper) => {
          const statusBadge = getStatusBadge(paper.processingStatus);
          const hasFile = Boolean(paper.file && paper.file.originalFilename);
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
              onClick={() => hasFile && onSelect(paper.id)}
              title={!hasFile ? "No PDF file available for annotation" : ""}
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
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        <FileText className="h-3 w-3 inline mr-1" />
                        {paper.file.originalFilename}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

export default function ResearchAnnotationsPage() {
  const isProtected = useProtectedRoute();
  const [activeTab, setActiveTab] = useState<
    "preview" | "annotations" | "comments" | "notes"
  >("annotations");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isPapersOpen, setIsPapersOpen] = useState(true);
  const [isMobilePapersOpen, setIsMobilePapersOpen] = useState(false);
  const [paperSearch, setPaperSearch] = useState("");
  const [annotatableOnly, setAnnotatableOnly] = useState(false);

  // Restore the user's panel preference after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = window.localStorage.getItem(PAPERS_PANEL_STORAGE_KEY);
    if (stored === "closed") setIsPapersOpen(false);
    else if (stored === "open") setIsPapersOpen(true);
  }, []);

  const togglePapersOpen = () => {
    setIsPapersOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(
        PAPERS_PANEL_STORAGE_KEY,
        next ? "open" : "closed"
      );
      return next;
    });
  };

  // Fetch user's papers from database
  const {
    data: papersData,
    isLoading: papersLoading,
    isError: papersError,
  } = useListPapersQuery({
    limit: 50, // Get more papers for annotation
  });

  const papers = useMemo(() => papersData?.items || [], [papersData?.items]);

  const filteredPapers = papers.filter((paper) => {
    if (
      annotatableOnly &&
      !(
        paper.file?.originalFilename &&
        paper.processingStatus === "PROCESSED"
      )
    ) {
      return false;
    }

    const query = paperSearch.trim().toLowerCase();
    if (!query) return true;

    const authors = (paper.metadata?.authors || []).join(", ").toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) || authors.includes(query)
    );
  });

  const handleSelectPaper = (paperId: string) => {
    setSelectedPaperId(paperId);
    setIsMobilePapersOpen(false);
  };

  // Hook for signed file URL - fetch when a paper is selected
  const {
    data: fileUrlData,
    isFetching: isFetchingFileUrl,
    error: fileUrlError,
    refetch: refetchFileUrl,
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

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  return (
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-4 rounded-lg border">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="hover:bg-muted">
              <Link href="/dashboard/research">
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

          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobilePapersOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Papers
            {selectedPaperId && (
              <span className="ml-2 rounded-full bg-primary/15 px-1.5 text-xs text-primary">
                1
              </span>
            )}
          </Button>
        </div>

        <Sheet open={isMobilePapersOpen} onOpenChange={setIsMobilePapersOpen}>
          <SheetContent side="left" className="w-[320px] p-0 sm:max-w-[320px]">
            <SheetHeader className="px-4 pb-2 pt-4 text-left">
              <SheetTitle>Your Papers</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 pb-6">
              <PapersPanelContent
                papers={filteredPapers}
                papersLoading={papersLoading}
                papersError={papersError}
                selectedPaperId={selectedPaperId}
                onSelect={handleSelectPaper}
                search={paperSearch}
                onSearchChange={setPaperSearch}
                annotatableOnly={annotatableOnly}
                onAnnotatableOnlyChange={setAnnotatableOnly}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div
          className={`grid grid-cols-1 gap-6 items-start ${
            isPapersOpen
              ? "lg:grid-cols-[300px_minmax(0,1fr)]"
              : "lg:grid-cols-[56px_minmax(0,1fr)]"
          }`}
        >
          {/* Desktop paper panel (collapsible) */}
          <div className="hidden lg:block">
            {isPapersOpen ? (
              <Card className="shadow-sm border-border/50 lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Your Papers
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={togglePapersOpen}
                          aria-label="Collapse papers panel"
                        >
                          <PanelLeftClose className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Collapse</TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <PapersPanelContent
                    papers={filteredPapers}
                    papersLoading={papersLoading}
                    papersError={papersError}
                    selectedPaperId={selectedPaperId}
                    onSelect={handleSelectPaper}
                    search={paperSearch}
                    onSearchChange={setPaperSearch}
                    annotatableOnly={annotatableOnly}
                    onAnnotatableOnlyChange={setAnnotatableOnly}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-border/50 lg:sticky lg:top-4 flex flex-col items-center gap-1.5 p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={togglePapersOpen}
                      aria-label="Expand papers panel"
                    >
                      <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Your Papers</TooltipContent>
                </Tooltip>
                <div className="h-px w-6 bg-border" />
                {filteredPapers.slice(0, 8).map((paper) => {
                  const isReady = Boolean(
                    paper.file?.originalFilename &&
                      paper.processingStatus === "PROCESSED"
                  );
                  return (
                    <Tooltip key={paper.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={!isReady}
                          onClick={() => handleSelectPaper(paper.id)}
                          aria-label={paper.title}
                          className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                            selectedPaperId === paper.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted"
                          } ${!isReady ? "cursor-not-allowed opacity-40" : ""}`}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[240px]">
                        {paper.title}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                {filteredPapers.length > 8 && (
                  <span className="pt-1 text-[10px] text-muted-foreground">
                    +{filteredPapers.length - 8}
                  </span>
                )}
              </Card>
            )}
          </div>

          {/* Main Annotation Area */}
          <div className="min-w-0">
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
                    <nav className="flex flex-wrap gap-1 pb-px">
                      {([
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
                      ] as {
                        id: "preview" | "annotations" | "comments" | "notes";
                        label: string;
                        icon: typeof Eye;
                      }[]).map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
                        <PdfPaneState variant="loading" />
                      ) : fileUrlError ? (
                        <PdfPaneState
                          variant="error"
                          onRetry={() => void refetchFileUrl()}
                        />
                      ) : fileUrlData?.data?.url && selectedPaperId ? (
                        <div className="min-h-[70vh] border rounded-lg">
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
                        <PdfPaneState
                          variant="missing"
                          description="The PDF file for this paper is not available for preview."
                        />
                      )}
                    </>
                  )}

                  {/* Annotations Tab */}
                  {activeTab === "annotations" && (
                    <>
                      {isFetchingFileUrl ? (
                        <PdfPaneState variant="loading" />
                      ) : fileUrlError ? (
                        <PdfPaneState
                          variant="error"
                          onRetry={() => void refetchFileUrl()}
                        />
                      ) : fileUrlData?.data?.url && selectedPaperId ? (
                        <div className="min-h-[75vh] border rounded-lg overflow-hidden">
                          <PdfAnnotationViewerEnhanced
                            fileUrl={fileUrlData.data.url}
                            paperId={selectedPaperId}
                          />
                        </div>
                      ) : (
                        <PdfPaneState
                          variant="missing"
                          description="The PDF file for this paper is not available for annotation."
                        />
                      )}
                    </>
                  )}

                  {/* Comments Tab */}
                  {activeTab === "comments" && (
                    <div className="min-h-[70vh] border rounded-lg">
                      <CommentSection
                        paperId={selectedPaperId}
                        className="h-full"
                      />
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div className="min-h-[70vh] border rounded-lg">
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
  );
}
