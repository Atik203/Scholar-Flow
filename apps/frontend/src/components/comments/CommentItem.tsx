"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentForm } from "./CommentForm";
import { useUpdateAnnotationMutation, useDeleteAnnotationMutation } from "@/redux/api/annotationApi";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { formatDistanceToNow } from "date-fns";
import { 
  Edit, 
  Trash2, 
  Reply, 
  MoreVertical, 
  Check, 
  X,
  MessageSquare 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  comment: any; // Annotation type
  replies: any[];
  paperId: string;
  className?: string;
}

export function CommentItem({ 
  comment, 
  replies, 
  paperId, 
  className = "" 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const [updateAnnotation] = useUpdateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    try {
      await updateAnnotation({
        id: comment.id,
        data: { text: editText.trim() }
      }).unwrap();

      showSuccessToast("Comment updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      showErrorToast(error.data?.message || "Failed to update comment");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteAnnotation(comment.id).unwrap();
        showSuccessToast("Comment deleted successfully");
      } catch (error: any) {
        showErrorToast(error.data?.message || "Failed to delete comment");
      }
    }
  };

  const handleReplySuccess = () => {
    setIsReplying(false);
  };

  const isOwner = comment.user.id === comment.userId; // This should be current user ID

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Comment */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.image} />
              <AvatarFallback>
                {comment.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.version > 1 && (
                  <Badge variant="outline" className="text-xs">
                    edited
                  </Badge>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded-md resize-none min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {comment.text}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplying(!isReplying)}
                      className="h-7 px-2 text-xs"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>

                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={handleDelete}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-8">
          <CommentForm
            paperId={paperId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setIsReplying(false)}
            placeholder={`Reply to ${comment.user.name}...`}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-8 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              paperId={paperId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
