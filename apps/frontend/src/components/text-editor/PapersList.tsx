"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeletePaperMutation,
  useListEditorPapersQuery,
} from "@/redux/api/paperApi";
import { useAuth } from "@/redux/auth/useAuth";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Edit,
  Eye,
  FileText,
  MoreVertical,
  Search,
  Share,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PapersListProps {
  onPaperSelect: (paperId: string) => void;
}

export function PapersList({ onPaperSelect }: PapersListProps) {
  const { session, status } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "drafts" | "published"
  >("all");

  // Get filter parameters for API call
  const getFilterParams = () => {
    const params: { workspaceId?: string; isDraft?: boolean } = {};

    if (activeFilter === "drafts") {
      params.isDraft = true;
    } else if (activeFilter === "published") {
      params.isDraft = false;
    }

    return params;
  };

  // API hooks - only call when session is loaded
  const {
    data: papersResponse,
    isLoading,
    error,
    refetch,
  } = useListEditorPapersQuery(getFilterParams(), {
    skip: status === "loading" || !session, // Skip query until session is ready
  });
  const [deletePaper] = useDeletePaperMutation();

  const papers = papersResponse?.data || [];

  // Refetch when filter changes and session is ready
  useEffect(() => {
    if (session && refetch) {
      refetch();
    }
  }, [activeFilter, session, refetch]);

  // Delete paper
  const handleDelete = async (paperId: string) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;

    try {
      await deletePaper(paperId).unwrap();
      showSuccessToast("Paper deleted successfully");
      refetch(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting paper:", error);
      showErrorToast(
        "Failed to delete paper",
        error?.data?.message || "Please try again later."
      );
    }
  };

  // Filter papers based on search and active filter
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = paper.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "drafts" && paper.isDraft) ||
      (activeFilter === "published" && paper.isPublished);

    return matchesSearch && matchesFilter;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">
          Please sign in to view your papers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value as any)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No papers found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? "No papers match your search criteria."
                : "You haven't created any papers yet. Start by creating your first paper!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <Card
              key={paper.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle
                      className="text-base line-clamp-2 hover:text-primary"
                      onClick={() => onPaperSelect(paper.id)}
                    >
                      {paper.title || "Untitled Paper"}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={paper.isDraft ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {paper.isDraft ? "Draft" : "Published"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(paper.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPaperSelect(paper.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(paper.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>
                    Created{" "}
                    {formatDistanceToNow(new Date(paper.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onPaperSelect(paper.id)}
                  >
                    Open →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
