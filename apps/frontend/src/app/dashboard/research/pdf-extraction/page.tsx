"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PdfProcessingStatus } from "@/components/papers/PdfProcessingStatus";
import { ExtractedTextDisplay } from "@/components/papers/ExtractedTextDisplay";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import {
  ArrowLeft,
  Building2,
  FileText,
  Filter,
  Search,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  TextCursor,
  Microscope,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Info,
  Zap,
  FileSearch,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function PdfExtractionPage() {
  const isProtected = useProtectedRoute();
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByPage, setFilterByPage] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"idx" | "page" | "createdAt">("idx");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"extract" | "search" | "bulk">("extract");

  // Get workspaces for filtering
  const { data: workspacesData, isLoading: workspacesLoading } = useListWorkspacesQuery({});
  const workspaces = workspacesData?.data || [];

  // Get papers with processing status
  const { 
    data: papersData, 
    isLoading: papersLoading, 
    error: papersError,
    refetch: refetchPapers 
  } = useListPapersQuery({
    workspaceId: selectedWorkspaceId || undefined,
    page: 1,
    limit: 100,
  });

  const papers = papersData?.items || [];

  // Process papers by status for better organization
  const processedPapers = useMemo(() => 
    papers.filter(p => p.processingStatus === "PROCESSED"), [papers]);
  
  const processingPapers = useMemo(() => 
    papers.filter(p => p.processingStatus === "PROCESSING"), [papers]);
  
  const failedPapers = useMemo(() => 
    papers.filter(p => p.processingStatus === "FAILED"), [papers]);
  
  const uploadedPapers = useMemo(() => 
    papers.filter(p => p.processingStatus === "UPLOADED"), [papers]);

  // Get unique pages for filtering - we'll get this from the chunks API when needed
  const uniquePages: number[] = [];

  // Statistics
  const stats = useMemo(() => ({
    total: papers.length,
    processed: processedPapers.length,
    processing: processingPapers.length,
    failed: failedPapers.length,
    uploaded: uploadedPapers.length,
  }), [papers, processedPapers, processingPapers, failedPapers, uploadedPapers]);

  if (isProtected) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Microscope className="h-8 w-8" />
                PDF Text Extraction
              </h1>
              <p className="text-muted-foreground">
                Extract and search through text content from your research papers
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetchPapers()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/dashboard/papers/upload">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload New Paper
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Papers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Processed</p>
                  <p className="text-2xl font-bold">{stats.processed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-2xl font-bold">{stats.uploaded}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="extract" className="flex items-center gap-2">
              <TextCursor className="h-4 w-4" />
              Extract & Search
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Advanced Search
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Bulk Processing
            </TabsTrigger>
          </TabsList>

          {/* Extract & Search Tab */}
          <TabsContent value="extract" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Paper Selection */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Select Paper
                    </CardTitle>
                    <CardDescription>
                      Choose a paper to extract and search text from
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Workspace Filter */}
                    {workspaces && workspaces.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="workspace">Workspace</Label>
                        <Select
                          value={selectedWorkspaceId}
                          onValueChange={setSelectedWorkspaceId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All workspaces" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All workspaces</SelectItem>
                            {workspaces.map((workspace) => (
                              <SelectItem key={workspace.id} value={workspace.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {workspace.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Papers List */}
                    <div className="space-y-2">
                      <Label>Papers ({papers.length})</Label>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {papersLoading ? (
                          <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                              <Skeleton key={i} className="h-20 w-full" />
                            ))}
                          </div>
                        ) : papersError ? (
                          <div className="text-center py-4 text-red-500">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>Error loading papers</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => refetchPapers()}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        ) : papers.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No papers found</p>
                            <Link href="/dashboard/papers/upload">
                              <Button variant="outline" size="sm" className="mt-2">
                                Upload your first paper
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          papers.map((paper) => (
                            <Card
                              key={paper.id}
                              className={`cursor-pointer transition-colors ${
                                selectedPaper?.id === paper.id
                                  ? "ring-2 ring-primary"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => setSelectedPaper(paper)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                      {paper.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {paper.metadata?.authors?.join(", ") || "Unknown authors"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
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
                                        {paper.processingStatus === "PROCESSED" && (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {paper.processingStatus === "PROCESSING" && (
                                          <Clock className="h-3 w-3 mr-1" />
                                        )}
                                        {paper.processingStatus === "FAILED" && (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {paper.processingStatus}
                                      </Badge>
                                      {paper.file?.sizeBytes && (
                                        <span className="text-xs text-muted-foreground">
                                          {Math.round(paper.file.sizeBytes / 1024)} KB
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Status for Selected Paper */}
                {selectedPaper && (
                  <PdfProcessingStatus
                    paperId={selectedPaper.id}
                    currentStatus={selectedPaper.processingStatus}
                    showTriggerButton={true}
                    compact={true}
                  />
                )}
              </div>

              {/* Search and Results */}
              <div className="lg:col-span-2 space-y-4">
                {selectedPaper ? (
                  <>
                    {/* Search Controls */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TextCursor className="h-5 w-5" />
                          Extract & Search Text
                        </CardTitle>
                        <CardDescription>
                          Search through the extracted text content of "{selectedPaper.title}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Search Input */}
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
                            onClick={() => setSearchQuery("")}
                          >
                            Clear
                          </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="page-filter">Filter by Page</Label>
                            <Select
                              value={filterByPage?.toString() || ""}
                              onValueChange={(value) =>
                                setFilterByPage(value ? parseInt(value) : null)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All pages" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All pages</SelectItem>
                                {uniquePages.map((page: number) => (
                                  <SelectItem key={page} value={page.toString()}>
                                    Page {page}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="sort-field">Sort by</Label>
                            <Select
                              value={sortField}
                              onValueChange={(value: "idx" | "page" | "createdAt") =>
                                setSortField(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="idx">Chunk Order</SelectItem>
                                <SelectItem value="page">Page Number</SelectItem>
                                <SelectItem value="createdAt">Created Date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="sort-direction">Direction</Label>
                            <Select
                              value={sortDirection}
                              onValueChange={(value: "asc" | "desc") =>
                                setSortDirection(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Extracted Text Display */}
                    <ExtractedTextDisplay paperId={selectedPaper.id} />
                  </>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <TextCursor className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Select a Paper to Extract Text
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Choose a paper from the list to view and search through its extracted text content.
                      </p>
                      <Link href="/dashboard/papers/upload">
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload a Paper
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Advanced Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Advanced Search Across All Papers
                </CardTitle>
                <CardDescription>
                  Search through text content across multiple papers simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Search</h3>
                  <p>This feature will be available in the next update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Processing Tab */}
          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Bulk PDF Processing
                </CardTitle>
                <CardDescription>
                  Process multiple papers at once for efficient text extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Processing Queue */}
                  <div className="space-y-2">
                    <Label>Papers Ready for Processing ({uploadedPapers.length})</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {uploadedPapers.map((paper) => (
                        <Card key={paper.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {paper.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {paper.file?.sizeBytes ? `${Math.round(paper.file.sizeBytes / 1024)} KB` : "Unknown size"}
                              </p>
                            </div>
                            <PdfProcessingStatus
                              paperId={paper.id}
                              currentStatus={paper.processingStatus}
                              showTriggerButton={true}
                              compact={true}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Failed Papers */}
                  {failedPapers.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-red-600">Failed Papers ({failedPapers.length})</Label>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {failedPapers.map((paper) => (
                          <Card key={paper.id} className="p-3 border-red-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {paper.title}
                                </h4>
                                <p className="text-xs text-red-600">
                                  Processing failed
                                </p>
                              </div>
                              <PdfProcessingStatus
                                paperId={paper.id}
                                currentStatus={paper.processingStatus}
                                showTriggerButton={true}
                                compact={true}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}