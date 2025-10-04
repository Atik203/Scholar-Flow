"use client";

import { PdfViewerFallback } from "./PdfViewerFallback";

interface PdfPreviewProps {
  fileUrl: string;
  className?: string;
  page?: number;
  onTotalPages?: (n: number) => void;
  originalFilename?: string;
}

/**
 * Simple PDF Preview component that uses iframe-based fallback viewer only.
 * No react-pdf dependencies to avoid worker errors.
 */
export function PdfPreview({
  fileUrl,
  className,
  originalFilename,
}: PdfPreviewProps) {
  return (
    <PdfViewerFallback
      fileUrl={fileUrl}
      className={className}
      originalFilename={originalFilename}
    />
  );
}
