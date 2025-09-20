"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Download, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface PdfViewerFallbackProps {
  fileUrl: string;
  className?: string;
  originalFilename?: string;
}

export function PdfViewerFallback({
  fileUrl,
  className,
  originalFilename = "document.pdf",
}: PdfViewerFallbackProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleIframeError = () => {
    console.error("PDF iframe failed to load:", fileUrl);
    setError("PDF preview unavailable - browser may not support PDF viewing");
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    console.log("PDF iframe loaded successfully");
    setIsLoading(false);
    setError(null);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setIsLoading(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = originalFilename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, "_blank");
  };

  // Reset error state when fileUrl changes
  useEffect(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(0);
  }, [fileUrl]);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
      >
        <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">{error}</p>
        <p className="text-xs text-muted-foreground mb-4">
          Try opening in a new tab or downloading the file
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative border rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}
        <iframe
          key={retryCount} // Force re-render on retry
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-96"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
          title="PDF Preview"
          style={{ 
            border: 'none',
            minHeight: '384px' // Ensure minimum height
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenInNewTab}
            className="opacity-80 hover:opacity-100"
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="opacity-80 hover:opacity-100"
            title="Download PDF"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
