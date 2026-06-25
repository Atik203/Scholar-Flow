"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AnnotationType } from "@/redux/api/annotationApi";
import { Check, Highlighter, MessageSquareText, Underline, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  { value: "#FFEB3B", label: "Yellow" },
  { value: "#4CAF50", label: "Green" },
  { value: "#42A5F5", label: "Blue" },
  { value: "#F48FB1", label: "Pink" },
  { value: "#FF9800", label: "Orange" },
  { value: "#AB47BC", label: "Purple" },
];

const TYPES: { value: AnnotationType; icon: typeof Highlighter }[] = [
  { value: "HIGHLIGHT", icon: Highlighter },
  { value: "UNDERLINE", icon: Underline },
  { value: "COMMENT", icon: MessageSquareText },
];

interface AnnotationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; color: string; type: AnnotationType }) => void;
  position: { x: number; y: number } | null;
  selectedText?: string;
  defaultColor?: string;
  defaultType?: AnnotationType;
}

export function AnnotationPopup({
  isOpen,
  onClose,
  onSubmit,
  position,
  selectedText,
  defaultColor = COLORS[0].value,
  defaultType = "HIGHLIGHT",
}: AnnotationPopupProps) {
  const [text, setText] = useState("");
  const [color, setColor] = useState(defaultColor);
  const [type, setType] = useState<AnnotationType>(defaultType);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText("");
      setColor(defaultColor);
      setType(defaultType);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [isOpen, defaultColor, defaultType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, text, color, type]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), color, type });
    onClose();
  };

  if (!isOpen || !position) return null;

  const popupX = Math.max(8, position.x);
  const popupY = Math.max(8, position.y);

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute z-50 w-80 rounded-xl border bg-card/95 shadow-xl backdrop-blur-sm"
        style={{ left: popupX, top: popupY }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Arrow pointer */}
        <div className="absolute -top-2 left-6 h-3 w-3 rotate-45 border-l border-t bg-card" />

        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Add Annotation
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-3 p-3">
          {/* Type selector */}
          <div className="flex gap-1">
            {TYPES.map((t) => {
              const Icon = t.icon;
              const isActive = type === t.value;
              return (
                <Button
                  key={t.value}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="h-8 flex-1 gap-1.5 px-2 text-xs"
                  onClick={() => setType(t.value)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.value === "HIGHLIGHT"
                    ? "Highlight"
                    : t.value === "UNDERLINE"
                      ? "Underline"
                      : "Comment"}
                </Button>
              );
            })}
          </div>

          {/* Color picker */}
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  color === c.value
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>

          {/* Selected text preview */}
          {selectedText && (
            <div className="rounded-md bg-muted/60 px-2.5 py-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              &ldquo;{selectedText}&rdquo;
            </div>
          )}

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add note..."
            className="min-h-[60px] resize-none text-sm"
            rows={2}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="h-8 gap-1 text-xs"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
