"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateDiscussionDialog } from "@/components/discussions/CreateDiscussionDialog";
import { DiscussionThreadCard } from "@/components/discussions/DiscussionThreadCard";
import { useGetDiscussionThreadsQuery } from "@/redux/api/phase2Api";
import { MessageSquare, Plus, Search, Filter } from "lucide-react";

export default function DiscussionsPage() {
  const [filters, setFilters] = useState({
    search: "",
    isResolved: "",
    isPinned: "",
    tags: "",
  });

  const { data: discussionsData, isLoading, refetch } = useGetDiscussionThreadsQuery({
    limit: 20,
    ...(filters.isResolved && { isResolved: filters.isResolved === "true" }),
    ...(filters.isPinned && { isPinned: filters.isPinned === "true" }),
    ...(filters.tags && { tags: filters.tags.split(",").map(t => t.trim()) }),
  });

  const handleDiscussionCreated = () => {
    refetch();
  };

  const handleThreadUpdate = () => {
    refetch();
  };

  const handleThreadDelete = () => {
    refetch();
  };

  const handleReply = (threadId: string) => {
    // Navigate to thread detail page or open reply dialog
    console.log("Reply to thread:", threadId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Discussions</h1>
          <p className="text-muted-foreground">
            Collaborate and discuss research topics with your team
          </p>
        </div>
        <CreateDiscussionDialog
          workspaceId="workspace-1"
          workspaceName="Research Team"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          }
          onDiscussionCreated={handleDiscussionCreated}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filters.isResolved}
              onValueChange={(value) => setFilters(prev => ({ ...prev, isResolved: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="false">Unresolved</SelectItem>
                <SelectItem value="true">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.isPinned}
              onValueChange={(value) => setFilters(prev => ({ ...prev, isPinned: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pinned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Discussions</SelectItem>
                <SelectItem value="true">Pinned Only</SelectItem>
                <SelectItem value="false">Not Pinned</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Tags (comma-separated)"
              value={filters.tags}
              onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading discussions...
          </div>
        ) : discussionsData?.threads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Start a new discussion to collaborate with your team
              </p>
              <CreateDiscussionDialog
                workspaceId="workspace-1"
                workspaceName="Research Team"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Discussion
                  </Button>
                }
                onDiscussionCreated={handleDiscussionCreated}
              />
            </CardContent>
          </Card>
        ) : (
          discussionsData?.threads.map((thread) => (
            <DiscussionThreadCard
              key={thread.id}
              thread={thread}
              currentUserId="current-user-id"
              onThreadUpdate={handleThreadUpdate}
              onThreadDelete={handleThreadDelete}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* Discussion Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Discussion Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be respectful and constructive in your comments</li>
                <li>• Use clear, descriptive titles for discussions</li>
                <li>• Tag discussions with relevant keywords</li>
                <li>• Mark discussions as resolved when questions are answered</li>
                <li>• Pin important discussions for easy access</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Discussion Types</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Questions:</strong> Ask for clarification or help</li>
                <li>• <strong>Ideas:</strong> Share research ideas and insights</li>
                <li>• <strong>Reviews:</strong> Discuss paper findings and methodology</li>
                <li>• <strong>Collaboration:</strong> Coordinate research activities</li>
                <li>• <strong>Feedback:</strong> Provide constructive feedback</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
