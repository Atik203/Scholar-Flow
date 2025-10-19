"use client";

import { Annotation, AnnotationType } from "@/redux/api/annotationApi";
import {
  Highlighter,
  MessageSquare,
  Pen,
  Square,
  StickyNote,
  Strikethrough,
  Underline,
} from "lucide-react";

interface AnnotationLayerEnhancedProps {
  annotations: Annotation[];
  scale: number;
  rotation: number;
  pageToViewport: (
    x: number,
    y: number,
    pageWidth: number,
    pageHeight: number
  ) => { x: number; y: number };
  onAnnotationClick: (annotation: Annotation) => void;
  onAnnotationEdit: (annotation: Annotation) => void;
  onAnnotationDelete: (annotationId: string) => void;
  className?: string;
}

export function AnnotationLayerEnhanced({
  annotations,
  scale,
  rotation,
  pageToViewport,
  onAnnotationClick,
  onAnnotationEdit,
  onAnnotationDelete,
  className = "",
}: AnnotationLayerEnhancedProps) {
  const getAnnotationStyle = (annotation: Annotation) => {
    const { coordinates } = annotation.anchor;

    // Use stored viewport or current viewport
    const annotationScale = annotation.anchor.viewport?.scale || 1;
    const annotationRotation = annotation.anchor.viewport?.rotation || 0;

    // Calculate position with current scale
    const scaleRatio = scale / annotationScale;

    const left = coordinates.x * scale;
    const top = coordinates.y * scale;
    const width = coordinates.width * scale;
    const height = coordinates.height * scale;

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "auto",
      cursor: "pointer",
      transition: "opacity 0.2s",
      zIndex: 10,
    };

    switch (annotation.type) {
      case "HIGHLIGHT":
        return {
          ...baseStyle,
          backgroundColor: "rgba(255, 255, 0, 0.35)",
          border: "1px solid rgba(255, 193, 7, 0.6)",
          mixBlendMode: "multiply" as const,
        };
      case "UNDERLINE":
        return {
          ...baseStyle,
          height: "3px",
          top: `${top + height - 3}px`,
          backgroundColor: "rgba(33, 150, 243, 0.8)",
          borderRadius: "1px",
        };
      case "STRIKETHROUGH":
        return {
          ...baseStyle,
          height: "2px",
          top: `${top + height / 2}px`,
          backgroundColor: "rgba(244, 67, 54, 0.8)",
          borderRadius: "1px",
        };
      case "AREA":
        return {
          ...baseStyle,
          backgroundColor: "rgba(156, 39, 176, 0.15)",
          border: "2px dashed rgba(156, 39, 176, 0.6)",
          borderRadius: "4px",
        };
      case "COMMENT":
        return {
          ...baseStyle,
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          border: "2px solid rgba(33, 150, 243, 0.5)",
          borderRadius: "4px",
        };
      case "NOTE":
        return {
          ...baseStyle,
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          border: "2px solid rgba(76, 175, 80, 0.5)",
          borderRadius: "4px",
        };
      case "INK":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: "none",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "rgba(158, 158, 158, 0.2)",
          border: "1px solid rgba(158, 158, 158, 0.5)",
        };
    }
  };

  const getAnnotationIcon = (type: AnnotationType) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "HIGHLIGHT":
        return <Highlighter className={iconClass} />;
      case "UNDERLINE":
        return <Underline className={iconClass} />;
      case "STRIKETHROUGH":
        return <Strikethrough className={iconClass} />;
      case "AREA":
        return <Square className={iconClass} />;
      case "COMMENT":
        return <MessageSquare className={iconClass} />;
      case "NOTE":
        return <StickyNote className={iconClass} />;
      case "INK":
        return <Pen className={iconClass} />;
      default:
        return <Square className={iconClass} />;
    }
  };

  const getAnnotationColor = (type: AnnotationType) => {
    switch (type) {
      case "HIGHLIGHT":
        return "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700";
      case "UNDERLINE":
        return "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
      case "STRIKETHROUGH":
        return "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700";
      case "AREA":
        return "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700";
      case "COMMENT":
        return "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
      case "NOTE":
        return "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700";
      case "INK":
        return "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700";
      default:
        return "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700";
    }
  };

  // Render INK annotation (freehand drawing)
  const renderInkAnnotation = (annotation: Annotation) => {
    if (!annotation.anchor.points || annotation.anchor.points.length === 0) {
      return null;
    }

    const points = annotation.anchor.points
      .map((p) => `${p.x * scale},${p.y * scale}`)
      .join(" ");

    return (
      <svg
        key={annotation.id}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <polyline
          points={points}
          fill="none"
          stroke="rgba(33, 150, 243, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {annotations.map((annotation) => {
        if (annotation.type === "INK") {
          return renderInkAnnotation(annotation);
        }

        const colorClass = getAnnotationColor(annotation.type);

        return (
          <div
            key={annotation.id}
            style={getAnnotationStyle(annotation)}
            onClick={(e) => {
              e.stopPropagation();
              onAnnotationClick(annotation);
            }}
            className="group hover:opacity-80 transition-opacity"
            title={`${annotation.type}: ${annotation.text}`}
          >
            {/* Annotation icon badge */}
            <div
              className={`absolute -top-3 -right-3 rounded-full p-1.5 shadow-md border ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            >
              {getAnnotationIcon(annotation.type)}
            </div>

            {/* Annotation hover card */}
            <div className="absolute top-full left-0 mt-2 bg-card dark:bg-card border rounded-lg shadow-xl p-3 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded ${colorClass}`}>
                  {getAnnotationIcon(annotation.type)}
                </div>
                <div>
                  <div className="text-xs font-semibold">
                    {annotation.user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(annotation.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {annotation.anchor.selectedText && (
                <div className="text-xs italic mb-2 p-2 bg-muted/50 rounded border-l-2 border-muted-foreground/30">
                  "{annotation.anchor.selectedText}"
                </div>
              )}
              <div className="text-xs line-clamp-3">
                {annotation.text}
              </div>
              {annotation.children && annotation.children.length > 0 && (
                <div className="text-xs text-primary mt-2 font-medium">
                  {annotation.children.length}{" "}
                  {annotation.children.length === 1 ? "reply" : "replies"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
