"use client";

import { Annotation } from "@/redux/api/annotationApi";

interface AnnotationLayerProps {
  annotations: Annotation[];
  scale: number;
  onAnnotationClick: (annotation: Annotation) => void;
  className?: string;
}

export function AnnotationLayer({
  annotations,
  scale,
  onAnnotationClick,
  className = "",
}: AnnotationLayerProps) {
  const getAnnotationStyle = (annotation: Annotation) => {
    const { coordinates } = annotation.anchor;
    const baseStyle = {
      position: "absolute" as const,
      left: `${coordinates.x}px`,
      top: `${coordinates.y}px`,
      width: `${coordinates.width}px`,
      height: `${coordinates.height}px`,
      pointerEvents: "auto" as const,
      cursor: "pointer" as const,
      zIndex: 10,
    };

    switch (annotation.type) {
      case "HIGHLIGHT":
        return {
          ...baseStyle,
          backgroundColor: "rgba(255, 255, 0, 0.3)",
          border: "1px solid rgba(255, 255, 0, 0.6)",
        };
      case "COMMENT":
        return {
          ...baseStyle,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
        };
      case "NOTE":
        return {
          ...baseStyle,
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          border: "1px solid rgba(34, 197, 94, 0.5)",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "rgba(156, 163, 175, 0.2)",
          border: "1px solid rgba(156, 163, 175, 0.5)",
        };
    }
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case "HIGHLIGHT":
        return "🖍️";
      case "COMMENT":
        return "💬";
      case "NOTE":
        return "📝";
      default:
        return "📌";
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {annotations.map((annotation) => (
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
          {/* Annotation icon overlay */}
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {getAnnotationIcon(annotation.type)}
          </div>
          
          {/* Annotation text preview on hover */}
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg p-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
            <div className="text-xs font-medium text-gray-700 mb-1">
              {annotation.user.name}
            </div>
            <div className="text-xs text-gray-600 line-clamp-3">
              {annotation.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}