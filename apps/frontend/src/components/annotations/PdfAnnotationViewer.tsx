"use client";

import { PdfAnnotationViewerEnhanced } from "./PdfAnnotationViewerEnhanced";

interface PdfAnnotationViewerProps {
  fileUrl: string;
  paperId: string;
  className?: string;
}

export function PdfAnnotationViewer({
  fileUrl,
  paperId,
  className,
}: PdfAnnotationViewerProps) {
  return (
    <PdfAnnotationViewerEnhanced
      fileUrl={fileUrl}
      paperId={paperId}
      className={className}
    />
  );
}
