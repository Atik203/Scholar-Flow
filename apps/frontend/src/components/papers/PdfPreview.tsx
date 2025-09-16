"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// Types from react-pdf v10 are limited; using loose typing for onLoadSuccess
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";

// react-pdf SSR handling: load components dynamically to avoid SSR issues
const PDFDocument = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
});
const PDFPage = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

// Configure PDF.js worker after component mount
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { pdfjs } from "react-pdf";
import { PdfViewerFallback } from "./PdfViewerFallback";

interface PdfPreviewProps {
  fileUrl: string;
  className?: string;
  page?: number;
  onTotalPages?: (n: number) => void;
}

export function PdfPreview({
  fileUrl,
  className,
  page = 1,
  onTotalPages,
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Configure worker once on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use exact version that matches react-pdf's pdfjs-dist dependency
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.93/build/pdf.worker.min.js`;
      console.info("[PdfPreview] Configured CDN worker v5.3.93");
    }
  }, []);

  useEffect(() => {
    setError(null);
    setLoading(true);
  }, [fileUrl]);

  const handleLoadSuccess = (params: any) => {
    setNumPages(params.numPages);
    setLoading(false);
    onTotalPages?.(params.numPages);
  };

  const handleError = (e: any) => {
    console.error("PDF preview error, switching to fallback", e);
    setUseFallback(true);
    setLoading(false);
  };

  // Use fallback viewer if react-pdf fails
  if (useFallback) {
    return <PdfViewerFallback fileUrl={fileUrl} className={className} />;
  }

  return (
    <div className={className}>
      {loading && !error && (
        <div
          className="flex items-center justify-center h-64 text-muted-foreground"
          role="status"
        >
          <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading preview...
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-destructive">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm mb-2">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError(null);
              setUseFallback(false);
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {!error && (
        <PDFDocument
          file={fileUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleError}
          loading={null}
          error={null}
          noData={
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
              No PDF data
            </div>
          }
        >
          <PDFPage
            pageNumber={page}
            width={400}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </PDFDocument>
      )}
      {numPages && numPages > 1 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Page {page} of {numPages}
        </p>
      )}
      <div className="mt-2 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUseFallback(true)}
          className="text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Switch to Simple Viewer
        </Button>
      </div>
    </div>
  );
}
