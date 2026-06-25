"use client";

import { useRef, useCallback, useEffect } from "react";
import type { Annotation, AnnotationType, AnnotationAnchor } from "@/redux/api/annotationApi";

interface AnnotationLayerEnhancedProps {
  pageIndex: number;
  annotations: Annotation[];
  scale: number;
  rotation: number;
  pageWidth: number;
  pageHeight: number;
  activeTool: AnnotationType | null;
  selectedColor: string;
  showAnnotations: boolean;
  onAnnotationClick: (annotation: Annotation) => void;
  onCreateAnnotation: (anchor: AnnotationAnchor) => void;
  isDrawingMode: boolean;
  drawingPoints: Array<{ x: number; y: number }>;
  onDrawingPointsChange: (points: Array<{ x: number; y: number }>) => void;
  onDrawingComplete: (points: Array<{ x: number; y: number }>) => void;
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${isNaN(r) ? 0 : r}, ${isNaN(g) ? 0 : g}, ${isNaN(b) ? 0 : b}, ${alpha})`;
}

function HoverCard({ annotation }: { annotation: Annotation }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[160px] max-w-[240px] bg-popover border rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: annotation.color }}
        />
        <span className="text-xs font-semibold truncate">{annotation.user.name}</span>
      </div>
      {annotation.text && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{annotation.text}</p>
      )}
    </div>
  );
}

function renderAnnotation(
  annotation: Annotation,
  pageWidth: number,
  pageHeight: number,
  onAnnotationClick: (a: Annotation) => void,
): React.ReactNode {
  const x = annotation.anchor.coordinates.x * pageWidth;
  const y = annotation.anchor.coordinates.y * pageHeight;
  const w = annotation.anchor.coordinates.width * pageWidth;
  const h = annotation.anchor.coordinates.height * pageHeight;

  const clickHandler = () => onAnnotationClick(annotation);

  switch (annotation.type) {
    case "HIGHLIGHT":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto"
          style={{ left: x, top: y, width: w, height: h, backgroundColor: hexToRgba(annotation.color, 0.3) }}
          onClick={clickHandler}
        >
          <HoverCard annotation={annotation} />
        </div>
      );

    case "UNDERLINE":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto"
          style={{ left: x, top: y, width: w, height: h }}
          onClick={clickHandler}
        >
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, backgroundColor: annotation.color }} />
          <HoverCard annotation={annotation} />
        </div>
      );

    case "STRIKETHROUGH":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto"
          style={{ left: x, top: y, width: w, height: h }}
          onClick={clickHandler}
        >
          <div
            className="absolute left-0 right-0"
            style={{ top: "50%", height: 2, backgroundColor: annotation.color, transform: "translateY(-50%)" }}
          />
          <HoverCard annotation={annotation} />
        </div>
      );

    case "AREA":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto rounded"
          style={{
            left: x,
            top: y,
            width: w,
            height: h,
            border: `2px dashed ${annotation.color}`,
            backgroundColor: hexToRgba(annotation.color, 0.1),
          }}
          onClick={clickHandler}
        >
          <HoverCard annotation={annotation} />
        </div>
      );

    case "COMMENT":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto"
          style={{ left: x, top: y, width: 28, height: 28 }}
          onClick={clickHandler}
        >
          <span className="text-lg select-none leading-none">&#x1F4AC;</span>
          <HoverCard annotation={annotation} />
        </div>
      );

    case "NOTE":
      return (
        <div
          key={annotation.id}
          className="absolute group cursor-pointer pointer-events-auto"
          style={{ left: x, top: y, width: 28, height: 28 }}
          onClick={clickHandler}
        >
          <span className="text-lg select-none leading-none">&#x1F4CC;</span>
          <HoverCard annotation={annotation} />
        </div>
      );

    case "INK":
      return null;

    default:
      return null;
  }
}

export function AnnotationLayerEnhanced({
  pageIndex,
  annotations,
  scale,
  rotation,
  pageWidth,
  pageHeight,
  activeTool,
  selectedColor,
  showAnnotations,
  onAnnotationClick,
  onCreateAnnotation,
  isDrawingMode,
  drawingPoints,
  onDrawingPointsChange,
  onDrawingComplete,
}: AnnotationLayerEnhancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const drawingPointsRef = useRef(drawingPoints);
  drawingPointsRef.current = drawingPoints;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const ann of annotations) {
      if (ann.type !== "INK" || !ann.anchor.points || ann.anchor.points.length < 2) continue;
      const pts = ann.anchor.points;
      ctx.beginPath();
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[0].x * pageWidth, pts[0].y * pageHeight);
      for (let i = 1; i < pts.length - 1; i++) {
        ctx.quadraticCurveTo(
          pts[i].x * pageWidth,
          pts[i].y * pageHeight,
          ((pts[i].x + pts[i + 1].x) / 2) * pageWidth,
          ((pts[i].y + pts[i + 1].y) / 2) * pageHeight,
        );
      }
      ctx.lineTo(pts[pts.length - 1].x * pageWidth, pts[pts.length - 1].y * pageHeight);
      ctx.stroke();
    }

    if (isDrawingMode && activeTool === "INK" && drawingPoints.length > 1) {
      const pts = drawingPoints;
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        ctx.quadraticCurveTo(
          pts[i].x,
          pts[i].y,
          (pts[i].x + pts[i + 1].x) / 2,
          (pts[i].y + pts[i + 1].y) / 2,
        );
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }
  }, [annotations, drawingPoints, isDrawingMode, activeTool, selectedColor, pageWidth, pageHeight]);

  const getCanvasPoint = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement> | PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingMode || activeTool !== "INK") return;
      isDrawing.current = true;
      onDrawingPointsChange([getCanvasPoint(e)]);
    },
    [isDrawingMode, activeTool, getCanvasPoint, onDrawingPointsChange],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      onDrawingPointsChange([...drawingPointsRef.current, getCanvasPoint(e)]);
    },
    [getCanvasPoint, onDrawingPointsChange],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const pts = drawingPointsRef.current;
    onDrawingPointsChange([]);
    if (pts.length >= 2) {
      onDrawingComplete(pts);
    }
  }, [onDrawingPointsChange, onDrawingComplete]);

  useEffect(() => {
    if (!activeTool || !["HIGHLIGHT", "UNDERLINE", "COMMENT"].includes(activeTool)) return;

    const handleSelection = () => {
      const container = containerRef.current;
      if (!container) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) return;

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (
        rect.left < containerRect.left ||
        rect.top < containerRect.top ||
        rect.right > containerRect.right ||
        rect.bottom > containerRect.bottom
      ) return;

      const anchor: AnnotationAnchor = {
        page: pageIndex,
        coordinates: {
          x: (rect.left - containerRect.left) / pageWidth,
          y: (rect.top - containerRect.top) / pageHeight,
          width: rect.width / pageWidth,
          height: rect.height / pageHeight,
        },
        selectedText: sel.toString().trim(),
        viewport: { scale, rotation },
      };

      onCreateAnnotation(anchor);
      sel.removeAllRanges();
    };

    const opts = { passive: true };
    document.addEventListener("mouseup", handleSelection, opts);
    document.addEventListener("touchend", handleSelection, opts);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [activeTool, pageIndex, pageWidth, pageHeight, scale, rotation, onCreateAnnotation]);

  if (!showAnnotations && !isDrawingMode) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ width: pageWidth, height: pageHeight }}
    >
      {showAnnotations && annotations.map((ann) => renderAnnotation(ann, pageWidth, pageHeight, onAnnotationClick))}

      <canvas
        ref={canvasRef}
        width={pageWidth}
        height={pageHeight}
        className="absolute inset-0"
        style={{
          pointerEvents: isDrawingMode && activeTool === "INK" ? "auto" : "none",
          cursor: isDrawingMode && activeTool === "INK" ? "crosshair" : "default",
          touchAction: isDrawingMode && activeTool === "INK" ? "none" : "auto",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}
