"use client";

import { ResearchNote } from "@/redux/api/noteApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { 
  StickyNote, 
  Lock, 
  Globe, 
  FileText, 
  Tag,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteListProps {
  notes: ResearchNote[];
  selectedNoteId?: string | null;
  onNoteSelect: (noteId: string) => void;
  onNoteEdit?: (note: ResearchNote) => void;
  onNoteDelete?: (note: ResearchNote) => void;
  isLoading?: boolean;
  className?: string;
}

export function NoteList({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteEdit,
  onNoteDelete,
  isLoading = false,
  className = "",
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No notes yet</p>
        <p className="text-xs">Create your first research note</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {notes.map((note) => (
        <Card
          key={note.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedNoteId === note.id && "ring-2 ring-primary/20 bg-primary/5"
          )}
          onClick={() => onNoteSelect(note.id)}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate mb-1">
                  {note.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onNoteEdit?.(note);
                  }}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteDelete?.(note);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {note.isPrivate ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                <span>
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
              </div>
              
              {note.paper && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-20">
                    {note.paper.title}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
