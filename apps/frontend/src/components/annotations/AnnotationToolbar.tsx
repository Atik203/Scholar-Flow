"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AnnotationType } from "@/redux/api/annotationApi";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Highlighter,
  MessageSquareText,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Square,
  Strikethrough,
  Underline,
} from "lucide-react";

export const HIGHLIGHT_COLORS = [
  { hex: "#FFEB3B", name: "Yellow" },
  { hex: "#4CAF50", name: "Green" },
  { hex: "#2196F3", name: "Blue" },
  { hex: "#E91E63", name: "Pink" },
  { hex: "#FF9800", name: "Orange" },
  { hex: "#9C27B0", name: "Purple" },
];

interface AnnotationToolbarProps {
  activeTool: AnnotationType | null;
  onToolChange: (tool: AnnotationType | null) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  currentPage: number;
  numPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageJump: (page: number) => void;
  rotation: number;
  onRotate: () => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

const TOOLS: Array<{ type: AnnotationType; icon: typeof Highlighter; label: string }> = [
  { type: "HIGHLIGHT", icon: Highlighter, label: "Highlight" },
  { type: "UNDERLINE", icon: Underline, label: "Underline" },
  { type: "STRIKETHROUGH", icon: Strikethrough, label: "Strikethrough" },
  { type: "COMMENT", icon: MessageSquareText, label: "Comment" },
  { type: "AREA", icon: Square, label: "Area" },
  { type: "INK", icon: Pencil, label: "Draw" },
];

export function AnnotationToolbar({
  activeTool,
  onToolChange,
  selectedColor,
  onColorChange,
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  currentPage,
  numPages,
  onPrevPage,
  onNextPage,
  onPageJump,
  rotation,
  onRotate,
  showAnnotations,
  onToggleAnnotations,
  showSidebar,
  onToggleSidebar,
}: AnnotationToolbarProps) {
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1.5 rounded-t-lg border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Annotation tools */}
      <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.type;
          return (
            <button
              key={tool.type}
              onClick={() => onToolChange(isActive ? null : tool.type)}
              className={`flex h-7 items-center gap-1 rounded px-2 text-xs transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={tool.label}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Color picker */}
      <div className="flex items-center gap-0.5">
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c.hex}
            onClick={() => onColorChange(c.hex)}
            className={`h-5 w-5 rounded-full border-2 transition-all ${
              selectedColor === c.hex
                ? "border-foreground scale-110"
                : "border-transparent hover:scale-110"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomOut} title="Zoom out">
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <button
          onClick={onZoomReset}
          className="min-w-[4rem] text-center text-xs tabular-nums hover:underline"
          title="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomIn} title="Zoom in">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrevPage} disabled={currentPage <= 1} title="Previous page">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="flex items-center gap-0.5 text-xs tabular-nums">
          <input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (v >= 1 && v <= numPages) onPageJump(v);
            }}
            className="w-7 rounded border bg-transparent p-0 text-center text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-muted-foreground">/ {numPages}</span>
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNextPage} disabled={currentPage >= numPages} title="Next page">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Rotate */}
      <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={onRotate} title="Rotate">
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{rotation}°</span>
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant={showAnnotations ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onToggleAnnotations}
        >
          <Eraser className="mr-1 h-3.5 w-3.5" />
          Annotations
        </Button>
        <Button
          variant={showSidebar ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onToggleSidebar}
        >
          List
        </Button>
      </div>
    </div>
  );
}
