"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Annotation, AnnotationAnchor } from "@/redux/api/annotationApi";
import {
  Highlighter,
  MessageSquare,
  Pen,
  Save,
  Square,
  StickyNote,
  Strikethrough,
  Trash2,
  Underline,
  X,
} from "lucide-react";
import { useState } from "react";

interface AnnotationEditDialogProps {
  annotation: Annotation;
  onSave: (text: string, anchor?: AnnotationAnchor) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function AnnotationEditDialog({
  annotation,
  onSave,
  onCancel,
  onDelete,
}: AnnotationEditDialogProps) {
  const [text, setText] = useState(annotation.text);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getAnnotationIcon = () => {
    const iconClass = "h-5 w-5";
    switch (annotation.type) {
      case "HIGHLIGHT":
        return <Highlighter className={iconClass} />;
      case "UNDERLINE":
        return <Underline className={iconClass} />;
      case "STRIKETHROUGH":
        return <Strikethrough className={iconClass} />;
      case "AREA":
        return <Square className={iconClass} />;
      case "COMMENT":
        return <MessageSquare className={iconClass} />;
      case "NOTE":
        return <StickyNote className={iconClass} />;
      case "INK":
        return <Pen className={iconClass} />;
      default:
        return <Square className={iconClass} />;
    }
  };

  const getAnnotationColor = () => {
    switch (annotation.type) {
      case "HIGHLIGHT":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "UNDERLINE":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "STRIKETHROUGH":
        return "text-red-700 bg-red-100 border-red-300";
      case "AREA":
        return "text-purple-700 bg-purple-100 border-purple-300";
      case "COMMENT":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "NOTE":
        return "text-green-700 bg-green-100 border-green-300";
      case "INK":
        return "text-gray-700 bg-gray-100 border-gray-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  const colorClass = getAnnotationColor();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${colorClass}`}>
              {getAnnotationIcon()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                Edit{" "}
                {annotation.type.charAt(0) +
                  annotation.type.slice(1).toLowerCase()}{" "}
                Annotation
              </DialogTitle>
              <DialogDescription>
                Page {annotation.anchor.page} • Created by{" "}
                {annotation.user.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected text preview */}
          {annotation.anchor.selectedText && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Selected Text
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 italic">
                    "{annotation.anchor.selectedText}"
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Annotation text editor */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Annotation Text
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your annotation text..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length} / 5000 characters
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Version {annotation.version}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Created {new Date(annotation.createdAt).toLocaleString()}
            </Badge>
            {annotation.updatedAt !== annotation.createdAt && (
              <Badge variant="outline" className="text-xs">
                Updated {new Date(annotation.updatedAt).toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Replies count */}
          {annotation.children && annotation.children.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                This annotation has {annotation.children.length}{" "}
                {annotation.children.length === 1 ? "reply" : "replies"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {/* Delete button with confirmation */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Annotation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this annotation
                  {annotation.children &&
                    annotation.children.length > 0 &&
                    ` and its ${annotation.children.length} ${annotation.children.length === 1 ? "reply" : "replies"}`}
                  .
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Save/Cancel buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!text.trim() || text === annotation.text}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
