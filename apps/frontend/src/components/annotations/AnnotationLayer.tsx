"use client";

import { Annotation } from "@/redux/api/annotationApi";
import { cn } from "@/lib/utils";
import { MessageSquare, StickyNote, Highlighter } from "lucide-react";

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
  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case "HIGHLIGHT":
        return Highlighter;
      case "COMMENT":
        return MessageSquare;
      case "NOTE":
        return StickyNote;
      default:
        return MessageSquare;
    }
  };

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case "HIGHLIGHT":
        return "bg-yellow-200/80 border-yellow-400";
      case "COMMENT":
        return "bg-blue-200/80 border-blue-400";
      case "NOTE":
        return "bg-green-200/80 border-green-400";
      default:
        return "bg-gray-200/80 border-gray-400";
    }
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {annotations.map((annotation) => {
        const { coordinates } = annotation.anchor;
        const Icon = getAnnotationIcon(annotation.type);
        const colorClass = getAnnotationColor(annotation.type);

        return (
          <div
            key={annotation.id}
            className={cn(
              "absolute pointer-events-auto cursor-pointer group",
              colorClass,
              "border rounded-sm hover:shadow-md transition-all duration-200"
            )}
            style={{
              left: coordinates.x * scale,
              top: coordinates.y * scale,
              width: coordinates.width * scale,
              height: coordinates.height * scale,
              minHeight: "20px",
              minWidth: "20px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAnnotationClick(annotation);
            }}
          >
            {/* Annotation content */}
            <div className="relative w-full h-full p-1">
              {/* Icon for small annotations */}
              {coordinates.width * scale < 50 && (
                <div className="flex items-center justify-center w-full h-full">
                  <Icon className="h-3 w-3 text-gray-600" />
                </div>
              )}

              {/* Text preview for larger annotations */}
              {coordinates.width * scale >= 50 && (
                <div className="text-xs text-gray-700 truncate">
                  {annotation.text.length > 50
                    ? `${annotation.text.substring(0, 50)}...`
                    : annotation.text}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm" />

              {/* Reply indicator */}
              {annotation.children && annotation.children.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {annotation.children.length}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
