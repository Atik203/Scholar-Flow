"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { AnnotationType } from "@/redux/api/annotationApi";
import {
  Eye,
  EyeOff,
  Highlighter,
  MessageSquare,
  Pen,
  Settings,
  Square,
  StickyNote,
  Strikethrough,
  Underline,
} from "lucide-react";

interface AnnotationToolbarProps {
  onAnnotationTypeChange: (type: AnnotationType) => void;
  selectedType: AnnotationType;
  onToggleAnnotations: () => void;
  showAnnotations: boolean;
  className?: string;
}

export function AnnotationToolbar({
  onAnnotationTypeChange,
  selectedType,
  onToggleAnnotations,
  showAnnotations,
  className = "",
}: AnnotationToolbarProps) {
  const annotationTypes: Array<{
    type: AnnotationType;
    label: string;
    icon: React.ElementType;
    description: string;
    color: string;
    shortcut?: string;
  }> = [
    {
      type: "HIGHLIGHT",
      label: "Highlight",
      icon: Highlighter,
      description: "Highlight text for reference",
      color: "bg-yellow-200",
      shortcut: "⌘H",
    },
    {
      type: "UNDERLINE",
      label: "Underline",
      icon: Underline,
      description: "Underline text",
      color: "bg-blue-200",
      shortcut: "⌘U",
    },
    {
      type: "STRIKETHROUGH",
      label: "Strikethrough",
      icon: Strikethrough,
      description: "Strike through text",
      color: "bg-red-200",
    },
    {
      type: "AREA",
      label: "Area Selection",
      icon: Square,
      description: "Select an area or region",
      color: "bg-purple-200",
    },
    {
      type: "COMMENT",
      label: "Comment",
      icon: MessageSquare,
      description: "Add a comment or question",
      color: "bg-blue-300",
      shortcut: "⌘M",
    },
    {
      type: "NOTE",
      label: "Note",
      icon: StickyNote,
      description: "Add a personal note",
      color: "bg-green-200",
      shortcut: "⌘N",
    },
    {
      type: "INK",
      label: "Ink/Drawing",
      icon: Pen,
      description: "Freehand drawing or sketch",
      color: "bg-gray-200",
    },
  ];

  const selectedAnnotation = annotationTypes.find(
    (t) => t.type === selectedType
  );

  return (
    <div
      className={`flex items-center justify-between p-3 border-t bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">
          Annotation Tools:
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[160px] justify-start"
            >
              {selectedAnnotation?.icon &&
                (() => {
                  const Icon = selectedAnnotation.icon;
                  return <Icon className="h-4 w-4" />;
                })()}
              <span className="flex-1 text-left">
                {selectedAnnotation?.label}
              </span>
              {selectedAnnotation?.shortcut && (
                <kbd className="text-xs text-muted-foreground">
                  {selectedAnnotation.shortcut}
                </kbd>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Text Annotations
              </p>
            </div>
            {annotationTypes
              .slice(0, 3)
              .map(({ type, label, icon: Icon, description, shortcut }) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => onAnnotationTypeChange(type)}
                  className="gap-3 py-2.5"
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {description}
                    </div>
                  </div>
                  {shortcut && (
                    <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border">
                      {shortcut}
                    </kbd>
                  )}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Area & Comments
              </p>
            </div>
            {annotationTypes
              .slice(3)
              .map(({ type, label, icon: Icon, description, shortcut }) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => onAnnotationTypeChange(type)}
                  className="gap-3 py-2.5"
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {description}
                    </div>
                  </div>
                  {shortcut && (
                    <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border">
                      {shortcut}
                    </kbd>
                  )}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1.5">
          {annotationTypes.slice(0, 6).map(({ type, color }) => (
            <button
              key={type}
              onClick={() => onAnnotationTypeChange(type)}
              className={`w-6 h-6 rounded-md ${color} transition-all ${
                selectedType === type
                  ? "ring-2 ring-primary ring-offset-1 scale-110"
                  : "hover:scale-105"
              }`}
              title={annotationTypes.find((t) => t.type === type)?.label}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={showAnnotations ? "default" : "outline"}
          size="sm"
          onClick={onToggleAnnotations}
          className="gap-2"
        >
          {showAnnotations ? (
            <>
              <Eye className="h-4 w-4" />
              Annotations On
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Annotations Off
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
