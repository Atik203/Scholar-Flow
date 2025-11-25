"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { AnnotationType } from "@/redux/api/annotationApi";
import {
  Highlighter,
  MessageSquare,
  Pen,
  Square,
  StickyNote,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import { useState } from "react";

interface AnnotationPopupProps {
  selectedText: string;
  annotationType: AnnotationType;
  onSave: (text: string) => void;
  onCancel: () => void;
  className?: string;
}

export function AnnotationPopup({
  selectedText,
  annotationType,
  onSave,
  onCancel,
  className = "",
}: AnnotationPopupProps) {
  const [text, setText] = useState("");

  const getAnnotationIcon = (type: AnnotationType) => {
    switch (type) {
      case "HIGHLIGHT":
        return Highlighter;
      case "UNDERLINE":
        return Underline;
      case "STRIKETHROUGH":
        return Strikethrough;
      case "AREA":
        return Square;
      case "COMMENT":
        return MessageSquare;
      case "NOTE":
        return StickyNote;
      case "INK":
        return Pen;
      default:
        return MessageSquare;
    }
  };

  const getAnnotationColor = (type: AnnotationType) => {
    switch (type) {
      case "HIGHLIGHT":
        return "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700";
      case "UNDERLINE":
        return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
      case "STRIKETHROUGH":
        return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700";
      case "AREA":
        return "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700";
      case "COMMENT":
        return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
      case "NOTE":
        return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700";
      case "INK":
        return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700";
      default:
        return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700";
    }
  };

  const getPlaceholder = (type: AnnotationType) => {
    switch (type) {
      case "HIGHLIGHT":
        return "Add a note about this highlight (optional)...";
      case "UNDERLINE":
        return "Add a note about this underlined text (optional)...";
      case "STRIKETHROUGH":
        return "Add a note about this struck-through text (optional)...";
      case "AREA":
        return "Add a note about this selected area (optional)...";
      case "COMMENT":
        return "Add your comment or question...";
      case "NOTE":
        return "Add your personal note...";
      case "INK":
        return "Add a description of your drawing (optional)...";
      default:
        return "Add your annotation...";
    }
  };

  const getTitle = (type: AnnotationType) => {
    switch (type) {
      case "HIGHLIGHT":
        return "Highlight";
      case "UNDERLINE":
        return "Underline";
      case "STRIKETHROUGH":
        return "Strikethrough";
      case "AREA":
        return "Area Selection";
      case "COMMENT":
        return "Comment";
      case "NOTE":
        return "Note";
      case "INK":
        return "Ink Drawing";
      default:
        return "Annotation";
    }
  };

  // Check if the annotation type requires text
  const isTextRequired = (type: AnnotationType) => {
    return type === "COMMENT" || type === "NOTE";
  };

  const handleSave = () => {
    // For color markings (HIGHLIGHT, UNDERLINE, STRIKETHROUGH, AREA, INK), text is optional
    // For COMMENT and NOTE, text is required
    if (!isTextRequired(annotationType) || text.trim()) {
      onSave(text.trim() || selectedText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const Icon = getAnnotationIcon(annotationType);
  const colorClass = getAnnotationColor(annotationType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                {getTitle(annotationType)}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selected text preview */}
          {selectedText && (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1 font-medium">
                Selected text:
              </div>
              <div className="text-sm font-medium line-clamp-4">
                "{selectedText}"
              </div>
            </div>
          )}

          {/* Annotation input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {annotationType === "HIGHLIGHT" ||
              annotationType === "UNDERLINE" ||
              annotationType === "STRIKETHROUGH"
                ? "Add a note"
                : annotationType === "COMMENT"
                  ? "Your comment"
                  : annotationType === "NOTE"
                    ? "Your note"
                    : annotationType === "AREA"
                      ? "Area description"
                      : "Description"}
              {!isTextRequired(annotationType) && (
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              )}
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder(annotationType)}
              className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press Ctrl+Enter to save, Esc to cancel</span>
              <span>{text.length} / 5000</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isTextRequired(annotationType) && !text.trim()}
              className="gap-2"
            >
              Save {getTitle(annotationType)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
