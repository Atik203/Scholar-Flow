"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DiscussionThreadCard } from "@/components/discussions/DiscussionThreadCard";
import { ArrowLeft, MessageSquare, Pin, CheckCircle, Reply, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DiscussionDetailPage() {
  const params = useParams();
  const discussionId = params.id as string;
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Mock data - replace with actual API call
  const discussion = {
    id: discussionId,
    title: "Machine Learning Model Performance Analysis",
    content: "I've been working on a machine learning model for healthcare prediction and I'm seeing some interesting results. The model achieves 85% accuracy on the validation set, but I'm concerned about potential overfitting. Has anyone encountered similar issues with healthcare datasets?",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      avatar: null
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:45:00Z",
    isPinned: true,
    isResolved: false,
    tags: ["machine-learning", "healthcare", "model-performance"],
    entityType: "paper",
    entity: {
      id: "paper-1",
      title: "Machine Learning in Healthcare: A Comprehensive Review"
    },
    messageCount: 8,
    messages: [
      {
        id: "msg-1",
        content: "Great question! I've worked with similar healthcare datasets and overfitting is indeed a common concern. Have you tried using cross-validation with different folds?",
        author: {
          id: "user-2",
          name: "Dr. Michael Chen",
          email: "michael.chen@example.com",
          avatar: null
        },
        createdAt: "2024-01-15T11:15:00Z",
        isReply: false
      },
      {
        id: "msg-2",
        content: "I agree with Michael. Also, consider using regularization techniques like L1 or L2. What's your current dataset size?",
        author: {
          id: "user-3",
          name: "Dr. Emily Rodriguez",
          email: "emily.rodriguez@example.com",
          avatar: null
        },
        createdAt: "2024-01-15T12:30:00Z",
        isReply: false
      },
      {
        id: "msg-3",
        content: "Thanks for the suggestions! My dataset has about 10,000 samples. I'll try implementing L2 regularization.",
        author: {
          id: "user-1",
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@example.com",
          avatar: null
        },
        createdAt: "2024-01-15T13:20:00Z",
        isReply: true
      }
    ]
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Posting reply:", replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleMarkResolved = () => {
    console.log("Marking discussion as resolved");
  };

  const handlePinToggle = () => {
    console.log("Toggling pin status");
  };

  const handleDelete = () => {
    console.log("Deleting discussion");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research/discussions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discussions
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Discussion Details
            </h1>
            <p className="text-sm text-muted-foreground">
              {discussion.entityType === "paper" && `Related to: ${discussion.entity.title}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePinToggle}
          >
            <Pin className="h-4 w-4 mr-2" />
            {discussion.isPinned ? "Unpin" : "Pin"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkResolved}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {discussion.isResolved ? "Reopen" : "Mark Resolved"}
          </Button>
        </div>
      </div>

      {/* Main Discussion */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{discussion.title}</CardTitle>
                {discussion.isPinned && (
                  <Badge variant="secondary" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {discussion.isResolved && (
                  <Badge variant="outline" className="text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={discussion.author.avatar || undefined} />
                    <AvatarFallback>
                      {discussion.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{discussion.author.name}</span>
                </div>
                <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                <span>{discussion.messageCount} replies</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-sm leading-relaxed">{discussion.content}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {discussion.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Replies ({discussion.messages.length})</h3>
        
        {discussion.messages.map((message) => (
          <Card key={message.id} className={message.isReply ? "ml-8 border-l-2 border-primary/20" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.author.avatar || undefined} />
                  <AvatarFallback>
                    {message.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                    {message.isReply && (
                      <Badge variant="outline" className="text-xs">
                        Reply
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {message.content}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Reply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReply} disabled={!replyText.trim()}>
              <Reply className="h-4 w-4 mr-2" />
              Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
