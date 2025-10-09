"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateAnnotationMutation } from "@/redux/api/annotationApi";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { Loader2, Send, X } from "lucide-react";

interface CommentFormProps {
  paperId: string;
  parentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

export function CommentForm({
  paperId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Write your comment...",
  className = "",
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createAnnotation] = useCreateAnnotationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await createAnnotation({
        paperId,
        type: "COMMENT",
        text: text.trim(),
        parentId,
        anchor: {
          page: 1, // Default to page 1 for general comments
          coordinates: { x: 0, y: 0, width: 0, height: 0 },
        },
      }).unwrap();

      showSuccessToast("Comment added successfully");
      setText("");
      onSuccess();
    } catch (error: any) {
      showErrorToast(error.data?.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="comment-text">
          {parentId ? "Reply to comment" : "Add a comment"}
        </Label>
        <Textarea
          id="comment-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
          autoFocus
        />
        <div className="text-xs text-muted-foreground">
          Press Ctrl+Enter to submit, Esc to cancel
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!text.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-1" />
          )}
          {parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
