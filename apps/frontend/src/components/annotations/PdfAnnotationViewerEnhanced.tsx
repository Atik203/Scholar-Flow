"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  Annotation,
  AnnotationAnchor,
  AnnotationType,
} from "@/redux/api/annotationApi";
import {
  useCreateAnnotationMutation,
  useDeleteAnnotationMutation,
  useGetPaperAnnotationsQuery,
  useUpdateAnnotationMutation,
} from "@/redux/api/annotationApi";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AnnotationEditDialog } from "./AnnotationEditDialog";
import { AnnotationLayerEnhanced } from "./AnnotationLayerEnhanced";
import { AnnotationList } from "./AnnotationList";
import { AnnotationPopup } from "./AnnotationPopup";
import { AnnotationToolbar } from "./AnnotationToolbar";

// Configure PDF.js worker - use jsdelivr CDN which is more reliable
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfAnnotationViewerEnhancedProps {
  fileUrl: string;
  paperId: string;
  className?: string;
}

export function PdfAnnotationViewerEnhanced({
  fileUrl,
  paperId,
  className = "",
}: PdfAnnotationViewerEnhancedProps) {
  // PDF State
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);

  // Annotation State
  const [selectedText, setSelectedText] = useState<string>("");
  const [selection, setSelection] = useState<AnnotationAnchor | null>(null);
  const [isAnnotationPopupOpen, setIsAnnotationPopupOpen] = useState(false);
  const [annotationType, setAnnotationType] =
    useState<AnnotationType>("HIGHLIGHT");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showAnnotationList, setShowAnnotationList] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null
  );

  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch annotations for this paper
  const { data: annotationsData, isLoading: annotationsLoading } =
    useGetPaperAnnotationsQuery({
      paperId,
      includeReplies: true,
    });

  // Mutations
  const [createAnnotation, { isLoading: isCreatingAnnotation }] =
    useCreateAnnotationMutation();
  const [updateAnnotation] = useUpdateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const annotations = annotationsData?.data || [];

  // Filter annotations for current page
  const currentPageAnnotations = annotations.filter(
    (annotation) => annotation.anchor.page === currentPage
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  /**
   * Convert page coordinates to viewport coordinates
   * This accounts for scale and rotation transformations
   */
  const pageToViewport = useCallback(
    (x: number, y: number, pageWidth: number, pageHeight: number) => {
      const currentScale = scale;
      const currentRotation = rotation;

      let viewportX = x;
      let viewportY = y;

      // Apply rotation transformation
      if (currentRotation === 90) {
        viewportX = y;
        viewportY = pageHeight - x;
      } else if (currentRotation === 180) {
        viewportX = pageWidth - x;
        viewportY = pageHeight - y;
      } else if (currentRotation === 270) {
        viewportX = pageWidth - y;
        viewportY = x;
      }

      // Apply scale
      return {
        x: viewportX * currentScale,
        y: viewportY * currentScale,
      };
    },
    [scale, rotation]
  );

  /**
   * Convert viewport coordinates to page coordinates
   * This reverses the page-to-viewport transformation
   */
  const viewportToPage = useCallback(
    (x: number, y: number, pageWidth: number, pageHeight: number) => {
      const currentScale = scale;
      const currentRotation = rotation;

      // Remove scale first
      let pageX = x / currentScale;
      let pageY = y / currentScale;

      // Reverse rotation transformation
      if (currentRotation === 90) {
        const temp = pageX;
        pageX = pageHeight - pageY;
        pageY = temp;
      } else if (currentRotation === 180) {
        pageX = pageWidth - pageX;
        pageY = pageHeight - pageY;
      } else if (currentRotation === 270) {
        const temp = pageX;
        pageX = pageY;
        pageY = pageWidth - temp;
      }

      return { x: pageX, y: pageY };
    },
    [scale, rotation]
  );

  /**
   * Handle text selection in PDF
   * Uses proper coordinate transformation
   */
  const handleTextSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    if (!windowSelection || !windowSelection.toString().trim()) return;

    const selectedText = windowSelection.toString().trim();
    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const pageRect = pageRef.current?.getBoundingClientRect();

    if (!pageRect) return;

    // Calculate relative coordinates
    const relativeX = rect.left - pageRect.left;
    const relativeY = rect.top - pageRect.top;
    const relativeWidth = rect.width;
    const relativeHeight = rect.height;

    // Get page dimensions (assuming standard PDF page)
    const pageWidth = pageRect.width / scale;
    const pageHeight = pageRect.height / scale;

    // Convert to page coordinates
    const topLeft = viewportToPage(relativeX, relativeY, pageWidth, pageHeight);
    const bottomRight = viewportToPage(
      relativeX + relativeWidth,
      relativeY + relativeHeight,
      pageWidth,
      pageHeight
    );

    const anchor: AnnotationAnchor = {
      page: currentPage,
      coordinates: {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      },
      selectedText,
      viewport: {
        scale,
        rotation,
      },
    };

    setSelectedText(selectedText);
    setSelection(anchor);
    setIsAnnotationPopupOpen(true);

    // Clear selection
    windowSelection.removeAllRanges();
  }, [currentPage, scale, rotation, viewportToPage]);

  /**
   * Handle area selection for AREA annotation type
   */
  const handleAreaSelection = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const pageRect = pageRef.current?.getBoundingClientRect();
      if (!pageRect) return;

      const pageWidth = pageRect.width / scale;
      const pageHeight = pageRect.height / scale;

      const topLeft = viewportToPage(
        Math.min(startX, endX),
        Math.min(startY, endY),
        pageWidth,
        pageHeight
      );
      const bottomRight = viewportToPage(
        Math.max(startX, endX),
        Math.max(startY, endY),
        pageWidth,
        pageHeight
      );

      const anchor: AnnotationAnchor = {
        page: currentPage,
        coordinates: {
          x: topLeft.x,
          y: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y,
        },
        selectedText: "Area Selection",
        viewport: {
          scale,
          rotation,
        },
      };

      setSelection(anchor);
      setIsAnnotationPopupOpen(true);
    },
    [currentPage, scale, rotation, viewportToPage]
  );

  /**
   * Handle annotation creation
   */
  const handleAnnotationCreate = useCallback(
    async (text: string) => {
      if (!selection) return;

      try {
        await createAnnotation({
          paperId,
          type: annotationType,
          anchor: selection,
          text: text.trim(),
        }).unwrap();

        showSuccessToast(`${annotationType} annotation created successfully`);
        setIsAnnotationPopupOpen(false);
        setSelection(null);
        setSelectedText("");
        setDrawingPoints([]);
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to create annotation");
      }
    },
    [selection, annotationType, paperId, createAnnotation]
  );

  /**
   * Handle annotation update
   */
  const handleAnnotationUpdate = useCallback(
    async (annotationId: string, text: string, anchor?: AnnotationAnchor) => {
      try {
        await updateAnnotation({
          id: annotationId,
          data: { text, anchor },
        }).unwrap();

        showSuccessToast("Annotation updated successfully");
        setEditingAnnotation(null);
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to update annotation");
      }
    },
    [updateAnnotation]
  );

  /**
   * Handle annotation deletion
   */
  const handleAnnotationDelete = useCallback(
    async (annotationId: string) => {
      try {
        await deleteAnnotation(annotationId).unwrap();
        showSuccessToast("Annotation deleted successfully");
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to delete annotation");
      }
    },
    [deleteAnnotation]
  );

  const handleAnnotationCancel = useCallback(() => {
    setIsAnnotationPopupOpen(false);
    setSelection(null);
    setSelectedText("");
    setDrawingPoints([]);
  }, []);

  // Navigation
  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  }, [numPages]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3.0, prev + 0.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.2);
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + H for Highlight
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault();
        setAnnotationType("HIGHLIGHT");
      }
      // Cmd/Ctrl + U for Underline
      if ((e.metaKey || e.ctrlKey) && e.key === "u") {
        e.preventDefault();
        setAnnotationType("UNDERLINE");
      }
      // Cmd/Ctrl + M for Comment
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault();
        setAnnotationType("COMMENT");
      }
      // Cmd/Ctrl + N for Note
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setAnnotationType("NOTE");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Main PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {currentPage} / {numPages}
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
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              title="Reset Zoom"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotate} title="Rotate">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentPageAnnotations.length} annotations
            </Badge>
            <Button
              variant={showAnnotationList ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAnnotationList(!showAnnotationList)}
            >
              {showAnnotationList ? "Hide" : "Show"} List
            </Button>
          </div>
        </div>

        {/* PDF Document */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="flex justify-center">
            <div
              ref={pageRef}
              className="relative bg-background shadow-2xl"
              onMouseUp={handleTextSelection}
            >
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Loading PDF...
                      </p>
                    </div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <p className="text-sm text-destructive font-medium">
                        Failed to load PDF
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please try refreshing the page
                      </p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  className="shadow-lg"
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </Document>

              {/* Annotation Overlay */}
              {showAnnotations && (
                <AnnotationLayerEnhanced
                  annotations={currentPageAnnotations}
                  scale={scale}
                  rotation={rotation}
                  pageToViewport={pageToViewport}
                  onAnnotationClick={(annotation: Annotation) => {
                    setEditingAnnotation(annotation);
                  }}
                  onAnnotationEdit={(annotation: Annotation) => {
                    setEditingAnnotation(annotation);
                  }}
                  onAnnotationDelete={handleAnnotationDelete}
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
        <div className="w-80 border-l bg-card shadow-lg">
          <AnnotationList
            annotations={annotations}
            currentPage={currentPage}
            onAnnotationClick={(annotation: Annotation) => {
              setCurrentPage(annotation.anchor.page);
            }}
            onAnnotationEdit={(annotation: Annotation) => {
              setEditingAnnotation(annotation);
            }}
            onAnnotationDelete={(annotation: Annotation) =>
              handleAnnotationDelete(annotation.id)
            }
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

      {/* Annotation Edit Dialog */}
      {editingAnnotation && (
        <AnnotationEditDialog
          annotation={editingAnnotation}
          onSave={(text: string, anchor?: AnnotationAnchor) =>
            handleAnnotationUpdate(editingAnnotation.id, text, anchor)
          }
          onCancel={() => setEditingAnnotation(null)}
          onDelete={() => {
            handleAnnotationDelete(editingAnnotation.id);
            setEditingAnnotation(null);
          }}
        />
      )}
    </div>
  );
}
