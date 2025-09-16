"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useListPapersQuery } from "@/redux/api/paperApi";
import {
  ArrowLeft,
  Brain,
  Calendar,
  FileText,
  Filter,
  Search,
  Sliders,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SearchPapersPage() {
  const isProtected = useProtectedRoute();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [yearRange, setYearRange] = useState([2020, 2025]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [semanticSearch, setSemanticSearch] = useState(false);

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    page: 1,
    limit: 50,
  });

  // Filter and search papers
  const filteredPapers = useMemo(() => {
    if (!papersData?.items) return [];

    let filtered = papersData.items;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (paper) =>
          paper.title.toLowerCase().includes(query) ||
          paper.abstract?.toLowerCase().includes(query) ||
          paper.metadata?.authors?.some((author) =>
            author.toLowerCase().includes(query)
          )
      );
    }

    // Author filter
    if (authorFilter.trim()) {
      const author = authorFilter.toLowerCase();
      filtered = filtered.filter((paper) =>
        paper.metadata?.authors?.some((a) => a.toLowerCase().includes(author))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (paper) => paper.processingStatus.toLowerCase() === statusFilter
      );
    }

    // Year filter
    filtered = filtered.filter((paper) => {
      const year = paper.metadata?.year;
      if (!year) return true;
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "status":
          return a.processingStatus.localeCompare(b.processingStatus);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    papersData?.items,
    searchQuery,
    authorFilter,
    yearRange,
    statusFilter,
    sortBy,
  ]);

  // Get unique authors for suggestions
  const allAuthors = useMemo(() => {
    if (!papersData?.items) return [];

    const authors = new Set<string>();
    papersData.items.forEach((paper) => {
      paper.metadata?.authors?.forEach((author) => {
        authors.add(author);
      });
    });

    return Array.from(authors);
  }, [papersData?.items]);

  if (!isProtected) {
    return null;
  }

  const clearFilters = () => {
    setSearchQuery("");
    setAuthorFilter("");
    setYearRange([2020, 2025]);
    setStatusFilter("all");
    setSortBy("date");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/papers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Papers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Search Papers</h1>
            <p className="text-muted-foreground">
              Find research papers using advanced filters and AI-powered search
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Search Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Search
                    </Label>
                    <Switch
                      checked={semanticSearch}
                      onCheckedChange={setSemanticSearch}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use semantic search for better results
                  </p>
                </div>

                <Separator />

                {/* Advanced Search Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      Advanced Mode
                    </Label>
                    <Switch
                      checked={advancedSearch}
                      onCheckedChange={setAdvancedSearch}
                    />
                  </div>
                </div>

                <Separator />

                {/* Author Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Author
                  </Label>
                  <Input
                    placeholder="Filter by author..."
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                  />
                  {allAuthors.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {allAuthors.slice(0, 5).map((author) => (
                        <Button
                          key={author}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                          onClick={() => setAuthorFilter(author)}
                        >
                          {author}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Processing Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="uploaded">Uploaded</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Year Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Publication Year
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={yearRange}
                      onValueChange={setYearRange}
                      min={2000}
                      max={2025}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sort Options */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Upload Date</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Search Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Search Input */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={
                          semanticSearch
                            ? "Describe what you're looking for..."
                            : "Search papers by title, content, or keywords..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 text-base"
                      />
                    </div>

                    {advancedSearch && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Exact Phrase</Label>
                            <Input placeholder={`"machine learning"`} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Exclude Words</Label>
                            <Input placeholder="NOT deprecated" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Abstract Contains</Label>
                          <Textarea placeholder="Search within paper abstracts..." />
                        </div>
                      </>
                    )}

                    {semanticSearch && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="h-4 w-4" />
                        AI-powered semantic search is enabled
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Search Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {papersLoading
                      ? "Searching..."
                      : `${filteredPapers.length} papers found`}
                  </p>
                  {(searchQuery || authorFilter || statusFilter !== "all") && (
                    <div className="flex items-center gap-2">
                      {searchQuery && (
                        <Badge variant="secondary" className="text-xs">
                          Query: "{searchQuery}"
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => setSearchQuery("")}
                          />
                        </Badge>
                      )}
                      {authorFilter && (
                        <Badge variant="secondary" className="text-xs">
                          Author: {authorFilter}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => setAuthorFilter("")}
                          />
                        </Badge>
                      )}
                      {statusFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Status: {statusFilter}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => setStatusFilter("all")}
                          />
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-4">
                {papersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPapers.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No papers found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search terms or filters
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPapers.map((paper) => (
                    <Card
                      key={paper.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/dashboard/papers/${paper.id}`}
                              className="group"
                            >
                              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                                {paper.title}
                              </h3>
                            </Link>

                            {paper.metadata?.authors &&
                              paper.metadata.authors.length > 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex flex-wrap gap-1">
                                    {paper.metadata.authors
                                      .slice(0, 3)
                                      .map((author, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {author}
                                        </Badge>
                                      ))}
                                    {paper.metadata.authors.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        +{paper.metadata.authors.length - 3}{" "}
                                        more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                            {paper.abstract && (
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {paper.abstract}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(paper.createdAt).toLocaleDateString()}
                              </div>
                              {paper.metadata?.year && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {paper.metadata.year}
                                </div>
                              )}
                              {paper.file?.sizeBytes && (
                                <div>
                                  {Math.round(
                                    (paper.file.sizeBytes / (1024 * 1024)) * 100
                                  ) / 100}{" "}
                                  MB
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge
                              variant={
                                paper.processingStatus === "PROCESSED"
                                  ? "default"
                                  : paper.processingStatus === "PROCESSING"
                                    ? "secondary"
                                    : paper.processingStatus === "FAILED"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="text-xs"
                            >
                              {paper.processingStatus}
                            </Badge>

                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/papers/${paper.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Quick Search Suggestions */}
              {!searchQuery && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Quick Search Suggestions
                    </CardTitle>
                    <CardDescription>
                      Try these popular search terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "machine learning",
                        "artificial intelligence",
                        "deep learning",
                        "neural networks",
                        "computer vision",
                        "natural language processing",
                      ].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(term)}
                          className="text-xs"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
