"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Highlighter,
  MessageSquare,
  StickyNote,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";

interface AnnotationToolbarProps {
  onAnnotationTypeChange: (type: "HIGHLIGHT" | "COMMENT" | "NOTE") => void;
  selectedType: "HIGHLIGHT" | "COMMENT" | "NOTE";
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
  const annotationTypes = [
    {
      type: "HIGHLIGHT" as const,
      label: "Highlight",
      icon: Highlighter,
      description: "Highlight text for reference",
      color: "bg-yellow-200",
    },
    {
      type: "COMMENT" as const,
      label: "Comment",
      icon: MessageSquare,
      description: "Add a comment or question",
      color: "bg-blue-200",
    },
    {
      type: "NOTE" as const,
      label: "Note",
      icon: StickyNote,
      description: "Add a personal note",
      color: "bg-green-200",
    },
  ];

  return (
    <div className={`flex items-center justify-between p-3 border-t bg-background ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Annotation Mode:</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {annotationTypes.find(t => t.type === selectedType)?.icon && (
                <annotationTypes.find(t => t.type === selectedType)!.icon className="h-4 w-4" />
              )}
              {annotationTypes.find(t => t.type === selectedType)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {annotationTypes.map(({ type, label, icon: Icon, description }) => (
              <DropdownMenuItem
                key={type}
                onClick={() => onAnnotationTypeChange(type)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          {annotationTypes.map(({ type, color }) => (
            <div
              key={type}
              className={`w-3 h-3 rounded-full ${color} ${
                selectedType === type ? "ring-2 ring-primary" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAnnotations}
          className="gap-2"
        >
          {showAnnotations ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showAnnotations ? "Hide" : "Show"} Annotations
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
