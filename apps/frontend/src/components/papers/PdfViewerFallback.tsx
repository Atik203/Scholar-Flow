"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Download, ExternalLink } from "lucide-react";
import { useState } from "react";

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

  const handleIframeError = () => {
    setError("PDF preview unavailable");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = originalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, "_blank");
  };

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-center ${className}`}
      >
        <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="flex gap-2">
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
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-96"
          onError={handleIframeError}
          title="PDF Preview"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenInNewTab}
            className="opacity-80 hover:opacity-100"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="opacity-80 hover:opacity-100"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
