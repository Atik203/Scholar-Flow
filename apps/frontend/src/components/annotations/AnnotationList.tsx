"use client";

import { Annotation } from "@/redux/api/annotationApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Highlighter, 
  MessageSquare, 
  StickyNote, 
  Edit, 
  Trash2, 
  Calendar,
  User
} from "lucide-react";

interface AnnotationListProps {
  annotations: Annotation[];
  currentPage: number;
  onAnnotationClick: (annotation: Annotation) => void;
  onAnnotationEdit: (annotation: Annotation) => void;
  onAnnotationDelete: (annotation: Annotation) => void;
  className?: string;
}

export function AnnotationList({
  annotations,
  currentPage,
  onAnnotationClick,
  onAnnotationEdit,
  onAnnotationDelete,
  className = "",
}: AnnotationListProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group annotations by page
  const annotationsByPage = annotations.reduce((acc, annotation) => {
    const page = annotation.anchor.page;
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(annotation);
    return acc;
  }, {} as Record<number, Annotation[]>);

  const sortedPages = Object.keys(annotationsByPage)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Annotations
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          {sortedPages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No annotations yet</p>
              <p className="text-sm">Select text in the PDF to create annotations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPages.map((page) => (
                <div key={page} className="space-y-2">
                  <div className="flex items-center gap-2 sticky top-0 bg-background py-2">
                    <Badge variant="outline" className="text-xs">
                      Page {page}
                    </Badge>
                    <Separator className="flex-1" />
                  </div>

                  {annotationsByPage[page].map((annotation) => {
                    const Icon = getAnnotationIcon(annotation.type);
                    const colorClass = getAnnotationColor(annotation.type);

                    return (
                      <Card 
                        key={annotation.id} 
                        className="cursor-pointer hover:shadow-sm transition-shadow"
                        onClick={() => onAnnotationClick(annotation)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded ${colorClass}`}>
                                  <Icon className="h-3 w-3" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {annotation.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnnotationEdit(annotation);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnnotationDelete(annotation);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Selected text preview */}
                            {annotation.anchor.selectedText && (
                              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border-l-2 border-primary/20">
                                "{annotation.anchor.selectedText}"
                              </div>
                            )}

                            {/* Annotation text */}
                            <div className="text-sm text-foreground">
                              {annotation.text}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {annotation.user.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(annotation.createdAt)}
                              </div>
                            </div>

                            {/* Replies */}
                            {annotation.children && annotation.children.length > 0 && (
                              <div className="ml-4 space-y-1">
                                <Separator className="my-2" />
                                {annotation.children.map((reply) => (
                                  <div key={reply.id} className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                                    <div className="flex items-center gap-1 mb-1">
                                      <User className="h-3 w-3" />
                                      {reply.user.name}
                                    </div>
                                    <div>{reply.text}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}