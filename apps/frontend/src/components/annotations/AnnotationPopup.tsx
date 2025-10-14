"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Highlighter, MessageSquare, StickyNote, X } from "lucide-react";

interface AnnotationPopupProps {
  selectedText: string;
  annotationType: "HIGHLIGHT" | "COMMENT" | "NOTE";
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
        return "text-yellow-600 bg-yellow-100";
      case "COMMENT":
        return "text-blue-600 bg-blue-100";
      case "NOTE":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "HIGHLIGHT":
        return "Add a note about this highlight...";
      case "COMMENT":
        return "Add your comment or question...";
      case "NOTE":
        return "Add your personal note...";
      default:
        return "Add your annotation...";
    }
  };

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">
                {annotationType === "HIGHLIGHT" ? "Highlight" : 
                 annotationType === "COMMENT" ? "Comment" : "Note"}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selected text preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Selected text:</div>
            <div className="text-sm font-medium line-clamp-3">
              "{selectedText}"
            </div>
          </div>

          {/* Annotation input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {annotationType === "HIGHLIGHT" ? "Add a note" : 
               annotationType === "COMMENT" ? "Your comment" : "Your note"}
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder(annotationType)}
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <div className="text-xs text-muted-foreground">
              Press Ctrl+Enter to save, Esc to cancel
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!text.trim()}
            >
              Save {annotationType === "HIGHLIGHT" ? "Highlight" : 
                   annotationType === "COMMENT" ? "Comment" : "Note"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
