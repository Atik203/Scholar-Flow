"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  MessageSquare,
  Pin,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Reply,
  Calendar,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  isResolved: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  user: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  paper?: {
    id: string;
    title: string;
  };
  collection?: {
    id: string;
    name: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
  _count: {
    messages: number;
  };
  messages?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      firstName?: string;
      lastName?: string;
      image?: string;
    };
  }>;
}

interface DiscussionThreadCardProps {
  thread: DiscussionThread;
  currentUserId?: string;
  onThreadUpdate?: () => void;
  onThreadDelete?: () => void;
  onReply?: (threadId: string) => void;
}

export function DiscussionThreadCard({
  thread,
  currentUserId,
  onThreadUpdate,
  onThreadDelete,
  onReply
}: DiscussionThreadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getUserDisplayName = (user: DiscussionThread['author']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || 'Unknown User';
  };

  const getUserInitials = (user: DiscussionThread['author']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const handleToggleResolved = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/discussions/${thread.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isResolved: !thread.isResolved
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update discussion');
      }

      showSuccessToast(
        thread.isResolved ? 'Discussion marked as unresolved' : 'Discussion marked as resolved'
      );
      onThreadUpdate?.();
    } catch (error) {
      console.error('Update discussion error:', error);
      showErrorToast('Failed to update discussion. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePinned = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/discussions/${thread.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPinned: !thread.isPinned
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update discussion');
      }

      showSuccessToast(
        thread.isPinned ? 'Discussion unpinned' : 'Discussion pinned'
      );
      onThreadUpdate?.();
    } catch (error) {
      console.error('Update discussion error:', error);
      showErrorToast('Failed to update discussion. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/discussions/${thread.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete discussion');
      }

      showSuccessToast('Discussion deleted successfully');
      onThreadDelete?.();
    } catch (error) {
      console.error('Delete discussion error:', error);
      showErrorToast('Failed to delete discussion. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const isOwner = currentUserId === thread.author.id;

  return (
    <Card className={`transition-all hover:shadow-md ${thread.isPinned ? 'border-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
              <CardTitle className="text-lg leading-tight">
                {thread.title}
              </CardTitle>
              {thread.isResolved && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            
            <CardDescription className="line-clamp-2">
              {thread.content}
            </CardDescription>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleResolved} disabled={isUpdating}>
                  {thread.isResolved ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark as Unresolved
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePinned} disabled={isUpdating}>
                  <Pin className="h-4 w-4 mr-2" />
                  {thread.isPinned ? 'Unpin' : 'Pin'} Discussion
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isUpdating} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Tags */}
        {thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {thread.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={thread.author.image} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(thread.author)}
                </AvatarFallback>
              </Avatar>
              <span>{getUserDisplayName(thread.author)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
            </div>

            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{thread._count.messages} message{thread._count.messages !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onReply?.(thread.id)}
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>

        {/* Latest Message Preview */}
        {thread.messages && thread.messages.length > 0 && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <User className="h-3 w-3" />
              <span>{getUserDisplayName(thread.messages[0].author)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(thread.messages[0].createdAt), { addSuffix: true })}</span>
            </div>
            <div className="text-sm line-clamp-2">
              {thread.messages[0].content}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
