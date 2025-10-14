"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { useGetPaperAnnotationsQuery } from "@/redux/api/annotationApi";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Plus } from "lucide-react";

interface CommentSectionProps {
  paperId: string;
  className?: string;
}

export function CommentSection({ paperId, className = "" }: CommentSectionProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Fetch comments (using annotations with type COMMENT)
  const { data: annotationsData, isLoading } = useGetPaperAnnotationsQuery({
    paperId,
    type: "COMMENT",
    includeReplies: true,
  });

  const comments = annotationsData?.data || [];

  // Separate top-level comments from replies
  const topLevelComments = comments.filter(comment => !comment.parentId);
  const repliesByParent = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, typeof comments>);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-lg">Comments</CardTitle>
            <Badge variant="secondary">{comments.length}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Comment
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Form */}
        {showCommentForm && (
          <CommentForm
            paperId={paperId}
            onSuccess={() => setShowCommentForm(false)}
            onCancel={() => setShowCommentForm(false)}
          />
        )}

        {/* Comments List */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {topLevelComments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No comments yet</p>
                <p className="text-xs">Be the first to start a discussion</p>
              </div>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <CommentItem
                    comment={comment}
                    replies={repliesByParent[comment.id] || []}
                    paperId={paperId}
                  />
                  {topLevelComments.indexOf(comment) < topLevelComments.length - 1 && (
                    <Separator />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
