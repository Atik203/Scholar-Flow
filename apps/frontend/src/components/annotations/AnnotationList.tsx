"use client";

import { Annotation } from "@/redux/api/annotationApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, StickyNote, Highlighter, Edit, Trash2, Reply } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Group annotations by page
  const annotationsByPage = annotations.reduce((acc, annotation) => {
    const page = annotation.anchor.page;
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(annotation);
    return acc;
  }, {} as Record<number, Annotation[]>);

  // Sort pages
  const sortedPages = Object.keys(annotationsByPage)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Annotations</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{annotations.length} total</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Page {currentPage}</span>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          {sortedPages.map((page) => {
            const pageAnnotations = annotationsByPage[page];
            const isCurrentPage = page === currentPage;

            return (
              <div key={page} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">Page {page}</h3>
                  <Badge variant={isCurrentPage ? "default" : "secondary"}>
                    {pageAnnotations.length}
                  </Badge>
                  {isCurrentPage && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {pageAnnotations.map((annotation) => {
                    const Icon = getAnnotationIcon(annotation.type);
                    const colorClass = getAnnotationColor(annotation.type);

                    return (
                      <Card
                        key={annotation.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md",
                          isCurrentPage && "ring-2 ring-primary/20"
                        )}
                        onClick={() => onAnnotationClick(annotation)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className={cn("p-1 rounded", colorClass)}>
                              <Icon className="h-3 w-3" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {annotation.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {annotation.user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(annotation.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>

                              <p className="text-sm text-foreground line-clamp-3">
                                {annotation.text}
                              </p>

                              {annotation.children && annotation.children.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                  <Reply className="h-3 w-3" />
                                  <span>{annotation.children.length} replies</span>
                                </div>
                              )}

                              <div className="flex items-center gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnnotationEdit(annotation);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnnotationDelete(annotation);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {annotations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No annotations yet</p>
              <p className="text-xs">Select text in the PDF to create annotations</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
