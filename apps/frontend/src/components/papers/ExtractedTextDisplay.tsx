"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllChunksQuery,
  useGetProcessingStatusQuery,
} from "@/redux/api/paperApi";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Filter,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useMemo, useState } from "react";

interface ExtractedTextDisplayProps {
  paperId: string;
  className?: string;
}

type SortField = "idx" | "page" | "tokenCount" | "createdAt";
type SortDirection = "asc" | "desc";

export function ExtractedTextDisplay({
  paperId,
  className,
}: ExtractedTextDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("idx");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const [filterByPage, setFilterByPage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"continuous" | "chunks">(
    "continuous"
  );

  const {
    data: processingData,
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useGetProcessingStatusQuery(paperId, {
    refetchOnMountOrArgChange: true, // Always refetch when component mounts
  });

  const {
    data: chunksData,
    isLoading: isChunksLoading,
    error: chunksError,
    refetch: refetchChunks,
  } = useGetAllChunksQuery(paperId, {
    skip: processingData?.data?.processingStatus !== "PROCESSED", // Only fetch chunks when processing is complete
  });

  const processingStatus = processingData?.data?.processingStatus;
  const chunksCount = processingData?.data?.chunksCount || 0;
  // Memoize chunks to keep reference stable across renders for dependent hooks
  const chunks = useMemo(() => chunksData?.data?.chunks ?? [], [chunksData]);

  // Debug logging
  console.log("ExtractedTextDisplay - Paper ID:", paperId);
  console.log("ExtractedTextDisplay - Processing Status:", processingStatus);
  console.log("ExtractedTextDisplay - Chunks Count:", chunksCount);
  console.log("ExtractedTextDisplay - Chunks:", chunks);

  // Filter and sort chunks
  const filteredAndSortedChunks = useMemo(() => {
    let filtered = chunks;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chunk) =>
        chunk.content.toLowerCase().includes(query)
      );
    }

    // Filter by page
    if (filterByPage !== null) {
      filtered = filtered.filter((chunk) => chunk.page === filterByPage);
    }

    // Sort chunks (create a copy to avoid mutating read-only array)
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [chunks, searchQuery, filterByPage, sortField, sortDirection]);

  // Get unique pages for filtering
  const uniquePages = useMemo(() => {
    const pages = chunks
      .map((chunk) => chunk.page)
      .filter((page): page is number => page !== undefined)
      .sort((a, b) => a - b);
    return [...new Set(pages)];
  }, [chunks]);

  // For continuous view, enforce natural reading order: page asc, idx asc
  const orderedForContinuous = useMemo(() => {
    const arr = [...filteredAndSortedChunks];
    return arr.sort((a, b) => {
      const pa = a.page ?? Number.MAX_SAFE_INTEGER;
      const pb = b.page ?? Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      return (a.idx ?? 0) - (b.idx ?? 0);
    });
  }, [filteredAndSortedChunks]);

  const combinedText = useMemo(() => {
    return orderedForContinuous
      .map((c) => c.content?.trim?.() ?? "")
      .join("\n\n");
  }, [orderedForContinuous]);

  const toggleChunkExpansion = (chunkId: string) => {
    const newExpanded = new Set(expandedChunks);
    if (newExpanded.has(chunkId)) {
      newExpanded.delete(chunkId);
    } else {
      newExpanded.add(chunkId);
    }
    setExpandedChunks(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  if (processingStatus !== "PROCESSED") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Text
          </CardTitle>
          <CardDescription>
            Text content will be available after PDF processing is complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {processingStatus === "PROCESSING"
                ? "Processing PDF..."
                : processingStatus === "FAILED"
                  ? "Processing failed"
                  : "PDF not processed yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processingStatus === "PROCESSED" && isChunksLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Loading extracted text...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusError || chunksError || chunks.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            {statusError || chunksError ? (
              <div className="space-y-2">
                <p>Failed to load extracted text</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchStatus();
                    refetchChunks();
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>No extracted text available</p>
                <p className="text-xs">
                  Status: {processingStatus || "Unknown"}
                </p>
                {processingStatus === "PROCESSED" && chunksCount === 0 && (
                  <p className="text-xs text-orange-600">
                    Processing completed but no chunks were found
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Text
            </CardTitle>
            <CardDescription>
              {chunks.length} text chunks extracted from PDF
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredAndSortedChunks.length} of {chunks.length} chunks
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                refetchStatus();
                refetchChunks();
              }}
              disabled={isChunksLoading || isStatusLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isChunksLoading || isStatusLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search, Filter, and View Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in extracted text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Filter by page:
              </span>
              <select
                value={filterByPage || ""}
                onChange={(e) =>
                  setFilterByPage(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="px-2 py-1 text-sm rounded-md border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:bg-muted/50"
              >
                <option value="">All pages</option>
                {uniquePages.map((page) => (
                  <option key={page} value={page}>
                    Page {page}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("idx")}
                className="h-8"
              >
                Index {getSortIcon("idx")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("page")}
                className="h-8"
              >
                Page {getSortIcon("page")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("tokenCount")}
                className="h-8"
              >
                Tokens {getSortIcon("tokenCount")}
              </Button>
            </div>

            {/* View mode toggle */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="inline-flex rounded-md border border-input bg-muted/40 p-1">
                <Button
                  variant={viewMode === "continuous" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("continuous")}
                >
                  Continuous
                </Button>
                <Button
                  variant={viewMode === "chunks" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("chunks")}
                >
                  Chunks
                </Button>
              </div>
              {viewMode === "continuous" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => navigator.clipboard.writeText(combinedText)}
                  title="Copy all text"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Display */}
        <ScrollArea className="h-[600px] w-full">
          {viewMode === "continuous" ? (
            <div className="pr-4">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <div
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{
                    textAlign: "justify",
                    textJustify: "inter-word" as any,
                  }}
                >
                  {combinedText}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {filteredAndSortedChunks.map((chunk) => {
                const isExpanded = expandedChunks.has(chunk.id);
                const shouldTruncate =
                  !isExpanded && chunk.content.length > 300;

                return (
                  <Card
                    key={chunk.id}
                    className="border-l-4 border-l-primary/20"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Chunk {chunk.idx}
                          </Badge>
                          {chunk.page && (
                            <Badge variant="outline" className="text-xs">
                              Page {chunk.page}
                            </Badge>
                          )}
                          {chunk.tokenCount && (
                            <Badge variant="outline" className="text-xs">
                              {chunk.tokenCount} tokens
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleChunkExpansion(chunk.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {shouldTruncate
                            ? `${chunk.content.substring(0, 300)}...`
                            : chunk.content}
                        </p>
                      </div>
                      {shouldTruncate && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleChunkExpansion(chunk.id)}
                          className="p-0 h-auto text-xs mt-2"
                        >
                          Show more
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {filteredAndSortedChunks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chunks match your search criteria</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterByPage(null);
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
