"use client";

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
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllChunksQuery,
  useGetPaperPreviewUrlQuery,
  useGetProcessingStatusQuery,
} from "@/redux/api/paperApi";
import {
  AlertCircle,
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DocumentPreview } from "./DocumentPreview";

type PaperChunk = {
  id: string;
  idx: number;
  page?: number;
  content: string;
  tokenCount?: number;
  createdAt: string;
};

interface ExtractionViewerProps {
  paperId: string;
  className?: string;
}

export function ExtractionViewer({
  paperId,
  className = "",
}: ExtractionViewerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Get processing status to determine if extraction is complete
  const {
    data: processingData,
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useGetProcessingStatusQuery(paperId, {
    refetchOnMountOrArgChange: true,
  });

  // Get preview URL with retry logic for 403 errors
  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewUrlError,
    refetch: refetchPreviewUrl,
  } = useGetPaperPreviewUrlQuery(paperId, {
    skip: !paperId, // Only skip if we don't have a paper ID
  });

  // Get raw chunks for advanced view
  const {
    data: chunksData,
    isLoading: isChunksLoading,
    error: chunksError,
    refetch: refetchChunks,
  } = useGetAllChunksQuery(paperId, {
    skip:
      !showAdvanced || processingData?.data?.processingStatus !== "PROCESSED",
  });

  const processingStatus = processingData?.data?.processingStatus;
  const chunks = useMemo(
    () => chunksData?.data?.chunks ?? [],
    [chunksData?.data?.chunks]
  ) as PaperChunk[];
  const isProcessed = processingStatus === "PROCESSED";

  // Handle preview URL expiry with automatic retry
  const handlePreviewError = useCallback(
    (error: string) => {
      if (error.includes("403") || error.includes("expired")) {
        console.log("[ExtractionViewer] Preview URL expired, retrying...");
        // Only refetch if the query has been started
        if (previewData !== undefined || isPreviewLoading) {
          refetchPreviewUrl();
        }
      } else {
        setPreviewError(error);
        showErrorToast(`Preview error: ${error}`);
      }
    },
    [refetchPreviewUrl, previewData, isPreviewLoading]
  );

  // Copy all text from chunks
  const handleCopyAllText = useCallback(async () => {
    if (!chunks.length) return;

    try {
      const allText = [...chunks]
        .sort((a: PaperChunk, b: PaperChunk) => a.idx - b.idx)
        .map((chunk: PaperChunk) => chunk.content)
        .join("\n\n");

      await navigator.clipboard.writeText(allText);
      showSuccessToast("All extracted text copied to clipboard");
    } catch (error) {
      showErrorToast("Failed to copy text to clipboard");
    }
  }, [chunks]);

  // Retry extraction process
  const handleRetryExtraction = useCallback(() => {
    try {
      // Only refetch if queries have been started
      if (processingData !== undefined || isStatusLoading) {
        refetchStatus();
      }

      // Only refetch preview if query has started (not skipped)
      if (
        processingData?.data &&
        (previewData !== undefined || isPreviewLoading)
      ) {
        refetchPreviewUrl();
      }

      // Only refetch chunks if advanced view is shown and query has started
      if (
        showAdvanced &&
        isProcessed &&
        (chunksData !== undefined || isChunksLoading)
      ) {
        refetchChunks();
      }

      showSuccessToast("Refreshing document data...");
    } catch (error) {
      console.error("[ExtractionViewer] Retry error:", error);
      showErrorToast("Failed to refresh document data");
    }
  }, [
    refetchStatus,
    refetchPreviewUrl,
    refetchChunks,
    showAdvanced,
    processingData,
    previewData,
    chunksData,
    isStatusLoading,
    isPreviewLoading,
    isChunksLoading,
    isProcessed,
  ]);

  // Validate paper ID
  if (!paperId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Invalid Paper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load document viewer - invalid paper ID.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isStatusLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                Loading document status...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Unable to load document information. Please try again.
            </p>
            <Button onClick={handleRetryExtraction} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Preview
            </CardTitle>
            <CardDescription>
              Format-preserving document view with extracted text for search
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Processing Status Badge */}
            <Badge
              variant={
                processingStatus === "PROCESSED"
                  ? "default"
                  : processingStatus === "PROCESSING"
                    ? "secondary"
                    : processingStatus === "FAILED"
                      ? "destructive"
                      : "outline"
              }
            >
              {processingStatus || "UNKNOWN"}
            </Badge>

            {/* Advanced Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4" />
              Advanced
            </Button>

            <Button variant="ghost" size="sm" onClick={handleRetryExtraction}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preview Section - Primary View */}
        {processingStatus === "PROCESSING" ? (
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Processing document...</p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a few moments for large documents
              </p>
            </div>
          </div>
        ) : processingStatus === "FAILED" ? (
          <div className="flex items-center justify-center h-64 bg-destructive/5 rounded-lg border border-destructive/20">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  Processing Failed
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {processingData?.data?.processingError ||
                    "Unknown error occurred"}
                </p>
              </div>
              <Button
                onClick={handleRetryExtraction}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Processing
              </Button>
            </div>
          </div>
        ) : isProcessed && previewData?.data?.url ? (
          // Render the document preview
          <div className="bg-muted/10 rounded-lg border">
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {previewData.data.isPreview
                      ? "PDF Preview"
                      : "Original Document"}
                  </span>
                  {previewData.data.originalMimeType && (
                    <Badge variant="outline" className="text-xs">
                      {previewData.data.originalMimeType
                        .split("/")[1]
                        ?.toUpperCase()}
                    </Badge>
                  )}
                </div>

                {isProcessed && chunks.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAllText}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Text
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-hidden">
              {isPreviewLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              ) : (
                <DocumentPreview
                  fileUrl={previewData.data.url}
                  fileName="document"
                  mimeType={previewData.data.mime}
                  className="max-h-[600px]"
                  onError={handlePreviewError}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No preview available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Document may still be processing or preview generation failed
              </p>
            </div>
          </div>
        )}

        {/* Advanced Section - Raw Text Chunks */}
        {showAdvanced && (
          <Collapsible open={showAdvanced}>
            <CollapsibleContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Advanced: Raw Extracted Text
                  </h3>
                  {chunks.length > 0 && (
                    <Badge variant="secondary">{chunks.length} chunks</Badge>
                  )}
                </div>

                {isChunksLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : chunksError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Failed to load extracted text chunks
                    </p>
                    <Button
                      onClick={refetchChunks}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : chunks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No text chunks available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[...chunks]
                      .sort((a: PaperChunk, b: PaperChunk) => a.idx - b.idx)
                      .map((chunk: PaperChunk) => (
                        <Card key={chunk.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{chunk.idx}
                              </Badge>
                              {chunk.page && (
                                <Badge variant="outline" className="text-xs">
                                  Page {chunk.page}
                                </Badge>
                              )}
                            </div>
                            {chunk.tokenCount && (
                              <Badge variant="secondary" className="text-xs">
                                {chunk.tokenCount} tokens
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {chunk.content}
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
