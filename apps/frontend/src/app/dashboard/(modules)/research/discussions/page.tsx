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
import { MessageSquare, Plus, Search, Filter, ArrowLeft, Layers, Pin, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResearchDiscussionsPage() {
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Research
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Research Discussions
            </h1>
            <p className="text-sm text-muted-foreground">
              Collaborate and discuss research topics with your team
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/research/discussions/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{discussionsData?.threads.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Discussions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {discussionsData?.threads.filter(t => t.isPinned).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Pinned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {discussionsData?.threads.filter(t => t.isResolved).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {discussionsData?.threads.filter(t => !t.isResolved).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading discussions...</p>
            </CardContent>
          </Card>
        ) : discussionsData?.threads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Start a new discussion to collaborate with your team
              </p>
              <Button asChild>
                <Link href="/research/discussions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Discussion
                </Link>
              </Button>
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
