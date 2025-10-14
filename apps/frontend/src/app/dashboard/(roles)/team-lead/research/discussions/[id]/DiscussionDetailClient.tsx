"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetDiscussionThreadQuery } from "@/redux/api/phase2Api";
import { ArrowLeft, MessageSquare, Pin, CheckCircle, Reply, MoreHorizontal, Edit, Trash2, Flag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface DiscussionDetailClientProps {
  threadId: string;
}

export default function DiscussionDetailClient({ threadId }: DiscussionDetailClientProps) {
  const [replyText, setReplyText] = useState("");
  const { data: discussion, isLoading } = useGetDiscussionThreadQuery(threadId);

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Sending reply:", replyText);
      setReplyText("");
    }
  };

  const handlePin = () => {
    console.log("Toggling pin status");
  };

  const handleResolve = () => {
    console.log("Toggling resolve status");
  };

  const handleDelete = () => {
    console.log("Deleting discussion");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Discussion not found</h3>
          <p className="text-muted-foreground mb-4">
            The discussion you're looking for doesn't exist or has been deleted
          </p>
          <Button asChild>
            <Link href="/research/discussions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discussions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/research/discussions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discussions
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              {discussion.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{discussion.tags.join(", ")}</Badge>
              {discussion.isPinned && (
                <Badge variant="secondary">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {discussion.isResolved && (
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePin}>
            <Pin className="h-4 w-4 mr-1" />
            {discussion.isPinned ? "Unpin" : "Pin"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleResolve}>
            <CheckCircle className="h-4 w-4 mr-1" />
            {discussion.isResolved ? "Reopen" : "Resolve"}
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Discussion */}
        <div className="lg:col-span-3 space-y-4">
          {/* Original Post */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {discussion.author.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{discussion.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(discussion.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{discussion.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            <h3 className="font-medium">Replies ({discussion.messages.length})</h3>
            {discussion.messages.map((message: any) => (
              <Card key={message.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {message.author.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{message.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Reply className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-sm">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReplyText("")}>
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={!replyText.trim()}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Discussion Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discussion Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(discussion.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Last Activity</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(discussion.updatedAt), 'MMM dd, yyyy')}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Participants</div>
                <div className="text-sm text-muted-foreground">
                  {discussion.participants.length} members
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="flex gap-1 mt-1">
                  {discussion.isPinned && (
                    <Badge variant="secondary" className="text-xs">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {discussion.isResolved && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {discussion.participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {participant.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handlePin}>
                <Pin className="h-4 w-4 mr-2" />
                {discussion.isPinned ? "Unpin Discussion" : "Pin Discussion"}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleResolve}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {discussion.isResolved ? "Reopen Discussion" : "Mark as Resolved"}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Flag className="h-4 w-4 mr-2" />
                Report Discussion
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
