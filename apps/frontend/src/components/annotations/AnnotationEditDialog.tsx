"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Reply, Send, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Annotation } from "@/redux/api/annotationApi";

interface AnnotationEditDialogProps {
  annotation: Annotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: { text?: string; color?: string }) => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, data: { text: string; color?: string }) => void;
}

const COLORS = [
  "#FFEB3B",
  "#4CAF50",
  "#2196F3",
  "#E91E63",
  "#FF9800",
  "#9C27B0",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AnnotationEditDialog({
  annotation,
  open,
  onOpenChange,
  onSave,
  onDelete,
  onReply,
}: AnnotationEditDialogProps) {
  const [text, setText] = useState(annotation?.text ?? "");
  const [color, setColor] = useState(annotation?.color ?? COLORS[0]);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  if (!annotation) return null;

  const handleSave = () => {
    onSave(annotation.id, { text: text.trim() || undefined, color });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(annotation.id);
    onOpenChange(false);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(annotation.id, { text: replyText.trim() });
    setReplyText("");
    setShowReply(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: annotation.color + "20",
                color: annotation.color,
                border: `1px solid ${annotation.color}40`,
              }}
            >
              {annotation.type}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="size-5">
                <AvatarImage src={annotation.user.image} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(annotation.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {annotation.user.name}
              </span>
              <span>&middot;</span>
              <span>
                {formatDistanceToNow(new Date(annotation.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <DialogTitle className="sr-only">Edit Annotation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {annotation.anchor.selectedText && (
            <div className="border-l-2 border-muted pl-4 py-2 text-sm text-muted-foreground italic">
              &ldquo;{annotation.anchor.selectedText}&rdquo;
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Color
            </span>
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="size-6 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: c === color ? c : "transparent",
                    boxShadow:
                      c === color
                        ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${c}`
                        : "none",
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Edit annotation text..."
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right">
              {text.length} characters
            </p>
          </div>

          {annotation.children && annotation.children.length > 0 && (
            <div className="space-y-3 border-l-2 border-muted pl-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Replies ({annotation.children.length})
              </p>
              {annotation.children.map((reply) => (
                <div key={reply.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="size-4">
                      <AvatarImage src={reply.user.image} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(reply.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {reply.user.name}
                    </span>
                    <span>&middot;</span>
                    <span>
                      {formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span
                      className="ml-auto size-2 rounded-full"
                      style={{ backgroundColor: reply.color || COLORS[0] }}
                    />
                  </div>
                  <p className="text-sm pl-6">{reply.text}</p>
                </div>
              ))}
            </div>
          )}

          {showReply && (
            <div className="flex gap-2 pl-4">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] resize-none text-sm"
                autoFocus
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="shrink-0 self-end"
              >
                <Send className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            {!showReply && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReply(true)}
                className="gap-1.5"
              >
                <Reply className="size-4" />
                Reply
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!text.trim() && !color}
              className="gap-1.5"
            >
              <Save className="size-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
