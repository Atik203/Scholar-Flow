"use client";

import { showErrorToast } from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useGetProcessingStatusQuery,
  useProcessPDFDirectMutation,
  useProcessPDFMutation,
} from "@/redux/api/paperApi";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PdfProcessingStatusProps {
  paperId: string;
  currentStatus?: "UPLOADED" | "PROCESSING" | "PROCESSED" | "FAILED";
  onStatusChange?: (status: string) => void;
  showTriggerButton?: boolean;
  compact?: boolean;
}

export function PdfProcessingStatus({
  paperId,
  currentStatus,
  onStatusChange,
  showTriggerButton = true,
  compact = false,
}: PdfProcessingStatusProps) {
  const [isPolling, setIsPolling] = useState(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    data: processingData,
    isLoading,
    error,
    refetch,
  } = useGetProcessingStatusQuery(paperId, {
    pollingInterval: isPolling ? 2000 : 0, // Poll every 2 seconds when processing
    skip: false,
    refetchOnMountOrArgChange: true, // Always refetch when component mounts
  });

  const [processPDF, { isLoading: isProcessing }] = useProcessPDFMutation();
  const [processPDFDirect, { isLoading: isProcessingDirect }] =
    useProcessPDFDirectMutation();

  const status =
    processingData?.data?.processingStatus || currentStatus || "UPLOADED";
  const processingError = processingData?.data?.processingError;
  const processedAt = processingData?.data?.processedAt;
  const chunksCount = processingData?.data?.chunksCount || 0;
  const chunks = processingData?.data?.chunks || [];

  // Start polling when status is PROCESSING
  useEffect(() => {
    const shouldPoll = status === "PROCESSING";

    // Only toggle when value changed to avoid unnecessary renders
    setIsPolling((prev) => (prev !== shouldPoll ? shouldPoll : prev));

    if (shouldPoll) {
      console.log("Starting polling for paper:", paperId);
      // create a single timeout to stop polling after 5 minutes
      if (!pollingTimeoutRef.current) {
        pollingTimeoutRef.current = setTimeout(
          () => {
            console.warn(`Polling timeout reached for paper: ${paperId}`);
            setIsPolling(false);
            if (pollingTimeoutRef.current) {
              clearTimeout(pollingTimeoutRef.current);
              pollingTimeoutRef.current = null;
            }
          },
          5 * 60 * 1000
        );
      }
    } else {
      console.log("Stopping polling for paper:", paperId, "Status:", status);
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    }

    // Cleanup when unmounting or when status changes away from PROCESSING
    return () => {
      if (!shouldPoll && pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    };
  }, [status, paperId]);

  // Notify parent component of status changes
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const handleProcessPDF = async () => {
    try {
      console.log(
        `[PdfProcessingStatus] Starting PDF processing for paper: ${paperId}`
      );
      const result = await processPDF(paperId).unwrap();
      console.log("PDF processing started:", result);
      // Start polling immediately after successful request
      setIsPolling(true);
      // Refetch to get updated status
      refetch();
    } catch (error) {
      console.error("Failed to start PDF processing:", error);
      setIsPolling(false);

      // Show user-friendly error message
      let errorMessage = "Failed to start PDF processing";

      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        const apiMessage = (error.data as any).message;
        console.error("API Error:", apiMessage);

        // Provide user-friendly messages for specific errors
        if (apiMessage.includes("No text content found in PDF")) {
          errorMessage = "Image-based PDF detected";
          showErrorToast(
            errorMessage,
            "This PDF contains only images. Text extraction is not possible for scanned documents."
          );
        } else {
          errorMessage = apiMessage;
          showErrorToast(errorMessage);
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const networkMessage = (error as any).message;
        console.error("Network Error:", networkMessage);
        errorMessage = "Network error occurred";
        showErrorToast(
          errorMessage,
          "Please check your connection and try again."
        );
      } else {
        showErrorToast(
          errorMessage,
          "An unexpected error occurred while starting processing."
        );
      }
    }
  };

  const handleProcessPDFDirect = async () => {
    try {
      console.log(
        `[PdfProcessingStatus] Starting direct PDF processing for paper: ${paperId}`
      );
      const result = await processPDFDirect(paperId).unwrap();
      console.log("Direct PDF processing completed:", result);
      // Refetch to get updated status
      refetch();
    } catch (error) {
      console.error("Failed to process PDF directly:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to process PDF";

      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        const apiMessage = (error.data as any).message;
        console.error("API Error:", apiMessage);

        // Provide user-friendly messages for specific errors
        if (apiMessage.includes("No text content found in PDF")) {
          errorMessage = "Image-based PDF detected";
          showErrorToast(
            errorMessage,
            "This PDF contains only images. Text extraction is not possible for scanned documents."
          );
        } else {
          errorMessage = apiMessage;
          showErrorToast(errorMessage);
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const networkMessage = (error as any).message;
        console.error("Network Error:", networkMessage);
        errorMessage = "Network error occurred";
        showErrorToast(
          errorMessage,
          "Please check your connection and try again."
        );
      } else {
        showErrorToast(
          errorMessage,
          "An unexpected error occurred during processing."
        );
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UPLOADED":
        return <Clock className="h-4 w-4" />;
      case "PROCESSING":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "PROCESSED":
        return <CheckCircle className="h-4 w-4" />;
      case "FAILED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: {
        variant: "secondary" as const,
        label: "Ready to Process",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
      },
      PROCESSING: {
        variant: "default" as const,
        label: "Processing",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      },
      PROCESSED: {
        variant: "outline" as const,
        label: "Processed",
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
      },
      FAILED: {
        variant: "destructive" as const,
        label: "Failed",
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const statusBadge = getStatusBadge(status);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon(status)}
        <Badge variant={statusBadge.variant} className="text-xs">
          {statusBadge.label}
        </Badge>
        {status === "PROCESSED" && chunksCount > 0 && (
          <span className="text-xs text-muted-foreground">
            ({chunksCount} chunks)
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-lg">PDF Processing Status</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
        </div>
        <CardDescription>
          {status === "UPLOADED" && "PDF is ready for text extraction"}
          {status === "PROCESSING" && "Extracting text content from PDF..."}
          {status === "PROCESSED" && `Text extraction completed successfully`}
          {status === "FAILED" && "Text extraction failed"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Processing Progress */}
        {status === "PROCESSING" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing PDF...</span>
              <span className="text-muted-foreground">
                {isPolling ? "Updating..." : "Please wait"}
              </span>
            </div>
            <Progress value={45} className="h-2" />
            <p className="text-xs text-muted-foreground">
              This may take a few moments depending on the PDF size
            </p>
            {chunksCount > 0 && (
              <p className="text-xs text-green-600">
                Found {chunksCount} text chunks so far...
              </p>
            )}
          </div>
        )}

        {/* Processing Results */}
        {status === "PROCESSED" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Text extraction completed
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {chunksCount} chunks
              </Badge>
            </div>

            {processedAt && (
              <div className="text-xs text-muted-foreground">
                Processed on: {new Date(processedAt).toLocaleString()}
              </div>
            )}

            {/* Preview of extracted chunks */}
            {chunks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Extracted Content Preview:
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {chunks.slice(0, 3).map((chunk, index) => (
                    <div
                      key={chunk.id}
                      className="p-2 bg-muted/50 rounded text-xs border-l-2 border-primary/20"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-muted-foreground">
                          Chunk {chunk.idx}
                          {chunk.page && ` (Page ${chunk.page})`}
                        </span>
                        {chunk.tokenCount && (
                          <Badge variant="secondary" className="text-xs">
                            {chunk.tokenCount} tokens
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {chunk.content.substring(0, 150)}
                        {chunk.content.length > 150 && "..."}
                      </p>
                    </div>
                  ))}
                  {chunks.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      ... and {chunks.length - 3} more chunks
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {status === "FAILED" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Processing failed
              </span>
            </div>
            {processingError && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {processingError === "No text content found in PDF"
                    ? "Image-based PDF detected"
                    : "Error details:"}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {processingError === "No text content found in PDF"
                    ? "This PDF appears to contain only images (scanned document) rather than selectable text. Text extraction is not possible for image-based PDFs."
                    : processingError}
                </p>
                {processingError === "No text content found in PDF" && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-white font-medium mb-1">
                      💡 Suggestions:
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-white space-y-1">
                      <li>
                        • Use OCR software to convert the PDF to text-based
                        format
                      </li>
                      <li>
                        • Re-scan the document with text recognition enabled
                      </li>
                      <li>
                        • Convert to a text-based PDF using tools like Adobe
                        Acrobat
                      </li>
                      <li>
                        • You can still view and download the PDF normally
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {showTriggerButton && status === "UPLOADED" && (
            <>
              <Button
                onClick={handleProcessPDF}
                disabled={isProcessing || isProcessingDirect}
                size="sm"
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Extract Text
                  </>
                )}
              </Button>
              <Button
                onClick={handleProcessPDFDirect}
                disabled={isProcessing || isProcessingDirect}
                size="sm"
                variant="outline"
                title="Process PDF directly (bypasses queue)"
              >
                {isProcessingDirect ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </>
          )}

          {status === "FAILED" && (
            <>
              <Button
                onClick={handleProcessPDF}
                disabled={isProcessing || isProcessingDirect}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Processing
                  </>
                )}
              </Button>
              <Button
                onClick={handleProcessPDFDirect}
                disabled={isProcessing || isProcessingDirect}
                size="sm"
                variant="outline"
                title="Process PDF directly (bypasses queue)"
              >
                {isProcessingDirect ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </>
          )}

          {/* Keep a single refresh button for manual updates */}
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
            variant="ghost"
            title="Refresh status"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && !processingData && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading processing status...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800 dark:text-red-200">
              Failed to load processing status
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
