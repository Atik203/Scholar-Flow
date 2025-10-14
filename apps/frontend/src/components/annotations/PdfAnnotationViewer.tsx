"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnnotationToolbar } from "./AnnotationToolbar";
import { AnnotationLayer } from "./AnnotationLayer";
import { AnnotationList } from "./AnnotationList";
import { AnnotationPopup } from "./AnnotationPopup";
import { useGetPaperAnnotationsQuery, useCreateAnnotationMutation } from "@/redux/api/annotationApi";
import { Annotation, AnnotationAnchor } from "@/redux/api/annotationApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfAnnotationViewerProps {
  fileUrl: string;
  paperId: string;
  className?: string;
}

export function PdfAnnotationViewer({
  fileUrl,
  paperId,
  className = "",
}: PdfAnnotationViewerProps) {
  // Debug logging
  console.log("PdfAnnotationViewer props:", { fileUrl, paperId, className });

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selection, setSelection] = useState<AnnotationAnchor | null>(null);
  const [isAnnotationPopupOpen, setIsAnnotationPopupOpen] = useState(false);
  const [annotationType, setAnnotationType] = useState<"HIGHLIGHT" | "COMMENT" | "NOTE">("HIGHLIGHT");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showAnnotationList, setShowAnnotationList] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  // Fetch annotations for this paper
  const { data: annotationsData, isLoading: annotationsLoading } = useGetPaperAnnotationsQuery({
    paperId,
    includeReplies: true,
  });

  // Create annotation mutation
  const [createAnnotation, { isLoading: isCreatingAnnotation }] = useCreateAnnotationMutation();

  const annotations = annotationsData?.data || [];

  // Filter annotations for current page
  const currentPageAnnotations = annotations.filter(
    (annotation) => annotation.anchor.page === currentPage
  );

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);

      // Calculate selection coordinates relative to the page
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const pageRect = pageRef.current?.getBoundingClientRect();

      if (pageRect) {
        const anchor: AnnotationAnchor = {
          page: currentPage,
          coordinates: {
            x: (rect.left - pageRect.left) / scale,
            y: (rect.top - pageRect.top) / scale,
            width: rect.width / scale,
            height: rect.height / scale,
          },
          textRange: {
            start: range.startOffset,
            end: range.endOffset,
          },
          selectedText,
        };
        setSelection(anchor);
        setIsAnnotationPopupOpen(true);
      }
    }
  }, [currentPage, scale]);

  const onPageLoadSuccess = useCallback((page: any) => {
    // Set up text selection handling
    const textLayer = page.textLayer;
    if (textLayer) {
      textLayer.textDivs.forEach((textDiv: HTMLElement) => {
        textDiv.addEventListener("mouseup", handleTextSelection);
      });
    }
  }, [handleTextSelection]);

  const handleAnnotationCreate = useCallback(async (text: string) => {
    if (selection) {
      try {
        await createAnnotation({
          paperId,
          type: annotationType,
          anchor: selection,
          text: text.trim(),
        }).unwrap();

        showSuccessToast("Annotation saved successfully");
        setIsAnnotationPopupOpen(false);
        setSelection(null);
        setSelectedText("");
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to save annotation");
      }
    }
  }, [selection, annotationType, paperId, createAnnotation]);

  const handleAnnotationCancel = useCallback(() => {
    setIsAnnotationPopupOpen(false);
    setSelection(null);
    setSelectedText("");
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3.0, prev + 0.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
    setRotation(0);
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotate}>
              Rotate
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentPageAnnotations.length} annotations
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnnotationList(!showAnnotationList)}
            >
              {showAnnotationList ? "Hide" : "Show"} List
            </Button>
          </div>
        </div>

        {/* PDF Document */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <div ref={pageRef} className="relative">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading PDF...</p>
                    </div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <p className="text-sm text-destructive">Failed to load PDF</p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  onLoadSuccess={onPageLoadSuccess}
                  className="shadow-lg"
                />
              </Document>

              {/* Annotation Layer */}
              {showAnnotations && (
                <AnnotationLayer
                  annotations={currentPageAnnotations}
                  scale={scale}
                  onAnnotationClick={(annotation) => {
                    console.log("Annotation clicked:", annotation);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Annotation Toolbar */}
        <AnnotationToolbar
          onAnnotationTypeChange={setAnnotationType}
          selectedType={annotationType}
          onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
          showAnnotations={showAnnotations}
        />
      </div>

      {/* Annotation List Sidebar */}
      {showAnnotationList && (
        <div className="w-80 border-l bg-background">
          <AnnotationList
            annotations={annotations}
            currentPage={currentPage}
            onAnnotationClick={(annotation) => {
              setCurrentPage(annotation.anchor.page);
            }}
            onAnnotationEdit={(annotation) => {
              console.log("Edit annotation:", annotation);
            }}
            onAnnotationDelete={(annotation) => {
              console.log("Delete annotation:", annotation);
            }}
          />
        </div>
      )}

      {/* Annotation Creation Popup */}
      {isAnnotationPopupOpen && selection && (
        <AnnotationPopup
          selectedText={selectedText}
          annotationType={annotationType}
          onSave={handleAnnotationCreate}
          onCancel={handleAnnotationCancel}
        />
      )}
    </div>
  );
}
