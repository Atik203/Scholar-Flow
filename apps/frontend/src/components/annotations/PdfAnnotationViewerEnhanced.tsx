"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AnnotationEditDialog } from "./AnnotationEditDialog";
import { AnnotationLayerEnhanced } from "./AnnotationLayerEnhanced";
import { AnnotationList } from "./AnnotationList";
import { AnnotationPopup } from "./AnnotationPopup";
import { AnnotationToolbar } from "./AnnotationToolbar";

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
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);

  const [selectedText, setSelectedText] = useState<string>("");
  const [selection, setSelection] = useState<AnnotationAnchor | null>(null);
  const [isAnnotationPopupOpen, setIsAnnotationPopupOpen] = useState(false);
  const [annotationType, setAnnotationType] =
    useState<AnnotationType>("HIGHLIGHT");
  const [annotationColor, setAnnotationColor] = useState<string>("#FFEB3B");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showAnnotationList, setShowAnnotationList] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null
  );
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);

  const { data: annotationsData, isLoading: annotationsLoading } =
    useGetPaperAnnotationsQuery({
      paperId,
      includeReplies: true,
    });

  const [createAnnotation] = useCreateAnnotationMutation();
  const [updateAnnotation] = useUpdateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const annotations = annotationsData?.data || [];

  const currentPageAnnotations = annotations.filter(
    (annotation) => annotation.anchor.page === currentPage
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const viewportToPage = useCallback(
    (x: number, y: number, pageWidth: number, pageHeight: number) => {
      let pageX = x / scale;
      let pageY = y / scale;

      if (rotation === 90) {
        const temp = pageX;
        pageX = pageHeight - pageY;
        pageY = temp;
      } else if (rotation === 180) {
        pageX = pageWidth - pageX;
        pageY = pageHeight - pageY;
      } else if (rotation === 270) {
        const temp = pageX;
        pageX = pageY;
        pageY = pageWidth - temp;
      }

      return { x: pageX, y: pageY };
    },
    [scale, rotation]
  );

  const handleTextSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    if (!windowSelection || !windowSelection.toString().trim()) return;

    const text = windowSelection.toString().trim();
    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const pageRect = pageRef.current?.getBoundingClientRect();

    if (!pageRect) return;

    const relativeX = rect.left - pageRect.left;
    const relativeY = rect.top - pageRect.top;
    const pw = pageRect.width / scale;
    const ph = pageRect.height / scale;

    const topLeft = viewportToPage(relativeX, relativeY, pw, ph);
    const bottomRight = viewportToPage(
      relativeX + rect.width,
      relativeY + rect.height,
      pw,
      ph
    );

    const anchor: AnnotationAnchor = {
      page: currentPage,
      coordinates: {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      },
      selectedText: text,
      viewport: { scale, rotation },
    };

    setSelectedText(text);
    setSelection(anchor);
    setIsAnnotationPopupOpen(true);

    windowSelection.removeAllRanges();
  }, [currentPage, scale, rotation, viewportToPage]);

  const handleAnnotationCreate = useCallback(
    async ({ text, color, type }: { text: string; color: string; type: AnnotationType }) => {
      if (!selection) return;

      try {
        await createAnnotation({
          paperId,
          type,
          anchor: selection,
          text: text.trim(),
          color: type === "HIGHLIGHT" || type === "UNDERLINE" || type === "COMMENT" ? color : undefined,
        }).unwrap();

        showSuccessToast("Annotation created");
        setIsAnnotationPopupOpen(false);
        setSelection(null);
        setSelectedText("");
        setDrawingPoints([]);
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to create annotation");
      }
    },
    [selection, paperId, createAnnotation]
  );

  const handleAnnotationSave = useCallback(
    async (id: string, data: { text?: string; color?: string }) => {
      try {
        await updateAnnotation({ id, data }).unwrap();
        showSuccessToast("Annotation updated");
        setEditingAnnotation(null);
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to update annotation");
      }
    },
    [updateAnnotation]
  );

  const handleAnnotationDelete = useCallback(
    async (id: string) => {
      try {
        await deleteAnnotation(id).unwrap();
        showSuccessToast("Annotation deleted");
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to delete annotation");
      }
    },
    [deleteAnnotation]
  );

  const handleAnnotationReply = useCallback(
    async (parentId: string, data: { text: string; color?: string }) => {
      try {
        await createAnnotation({
          paperId,
          type: "COMMENT",
          anchor: { page: currentPage, coordinates: { x: 0, y: 0, width: 0, height: 0 } },
          text: data.text.trim(),
          parentId,
          color: data.color || "#2196F3",
        }).unwrap();
        showSuccessToast("Reply added");
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to add reply");
      }
    },
    [paperId, currentPage, createAnnotation]
  );

  const handleAnnotationCancel = useCallback(() => {
    setIsAnnotationPopupOpen(false);
    setSelection(null);
    setSelectedText("");
    setDrawingPoints([]);
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
    setScale(1.2);
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const pageJump = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const handleToolChange = useCallback(
    (tool: AnnotationType | null) => {
      if (tool === "INK") {
        setIsDrawingMode(true);
      } else {
        setIsDrawingMode(false);
      }
      if (tool) {
        setAnnotationType(tool);
      }
    },
    []
  );

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const update = () => {
      setPageWidth(el.offsetWidth);
      setPageHeight(el.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale, rotation]);

  const popupPosition = selection?.coordinates
    ? {
        x: selection.coordinates.x * scale + (pageRef.current?.getBoundingClientRect().left ?? 0),
        y: selection.coordinates.y * scale + (pageRef.current?.getBoundingClientRect().top ?? 0),
      }
    : null;

  return (
    <div className={`flex h-full ${className}`}>
      <div className="flex flex-1 flex-col">
        <AnnotationToolbar
          activeTool={annotationType}
          onToolChange={handleToolChange}
          selectedColor={annotationColor}
          onColorChange={setAnnotationColor}
          scale={scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomReset={resetZoom}
          currentPage={currentPage}
          numPages={numPages}
          onPrevPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onPageJump={pageJump}
          rotation={rotation}
          onRotate={rotate}
          showAnnotations={showAnnotations}
          onToggleAnnotations={() => setShowAnnotations((v) => !v)}
          showSidebar={showAnnotationList}
          onToggleSidebar={() => setShowAnnotationList((v) => !v)}
        />

        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="flex justify-center">
            <div ref={pageRef} className="relative bg-background shadow-2xl">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                      <p className="text-sm text-muted-foreground">Loading PDF...</p>
                    </div>
                  </div>
                }
                error={
                  <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-medium text-destructive">Failed to load PDF</p>
                      <p className="mt-1 text-xs text-muted-foreground">Please try refreshing the page</p>
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

              <AnnotationLayerEnhanced
                pageIndex={currentPage - 1}
                annotations={currentPageAnnotations}
                scale={scale}
                rotation={rotation}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
                activeTool={isDrawingMode ? "INK" : annotationType}
                selectedColor={annotationColor}
                showAnnotations={showAnnotations}
                onAnnotationClick={(annotation) => {
                  setEditingAnnotation(annotation);
                }}
                onCreateAnnotation={(anchor) => {
                  setSelection(anchor);
                  setSelectedText(anchor.selectedText || "");
                  setIsAnnotationPopupOpen(true);
                }}
                isDrawingMode={isDrawingMode}
                drawingPoints={drawingPoints}
                onDrawingPointsChange={setDrawingPoints}
                onDrawingComplete={(points) => {
                  const normalized = points.map((p) => ({
                    x: p.x / pageWidth,
                    y: p.y / pageHeight,
                  }));
                  const anchor: AnnotationAnchor = {
                    page: currentPage,
                    coordinates: { x: 0, y: 0, width: 0, height: 0 },
                    points: normalized,
                    viewport: { scale, rotation },
                  };
                  setSelection(anchor);
                  setAnnotationType("INK");
                  setIsAnnotationPopupOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showAnnotationList && (
        <div className="w-80 flex-shrink-0 border-l bg-card shadow-lg">
          <AnnotationList
            annotations={annotations}
            totalPages={numPages}
            onAnnotationClick={(annotation) => {
              setCurrentPage(annotation.anchor.page);
              setEditingAnnotation(annotation);
            }}
            onDelete={handleAnnotationDelete}
            onPageJump={(page) => setCurrentPage(page)}
            isLoading={annotationsLoading}
          />
        </div>
      )}

      <AnnotationPopup
        isOpen={isAnnotationPopupOpen}
        onClose={handleAnnotationCancel}
        onSubmit={handleAnnotationCreate}
        position={popupPosition}
        selectedText={selectedText}
        defaultColor={annotationColor}
        defaultType={annotationType}
      />

      <AnnotationEditDialog
        annotation={editingAnnotation}
        open={!!editingAnnotation}
        onOpenChange={(open) => {
          if (!open) setEditingAnnotation(null);
        }}
        onSave={handleAnnotationSave}
        onDelete={handleAnnotationDelete}
        onReply={handleAnnotationReply}
      />
    </div>
  );
}
