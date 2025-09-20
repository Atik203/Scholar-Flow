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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function PapersSearchPage() {
  const isProtected = useProtectedRoute();

  // Workspace state
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch workspaces for selection
  const { data: workspacesData } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    page: 1,
    limit: 50,
    workspaceId: selectedWorkspaceId || undefined,
  });

  // Auto-select first workspace if only one available
  useEffect(() => {
    const workspaces = workspacesData?.data || [];
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspacesData, selectedWorkspaceId]);

  // Filter papers based on status
  const filteredPapers = useMemo(() => {
    if (!papersData?.items) return [];
    
    let filtered = papersData.items;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((paper) => paper.processingStatus === statusFilter);
    }
    
    return filtered;
  }, [papersData?.items, statusFilter]);

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  // Calculate stats
  const totalPapers = papersData?.items?.length || 0;
  const processedPapers = papersData?.items?.filter((p) => p.processingStatus === "PROCESSED").length || 0;
  const processingPapers = papersData?.items?.filter((p) => p.processingStatus === "PROCESSING").length || 0;
  const uploadedPapers = papersData?.items?.filter((p) => p.processingStatus === "UPLOADED").length || 0;
  const failedPapers = papersData?.items?.filter((p) => p.processingStatus === "FAILED").length || 0;

  const selectedPaper = papersData?.items?.find((p) => p.id === selectedPaperId);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/papers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Papers
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Advanced Search
              </h1>
              <p className="text-muted-foreground">
                Search through extracted text content from your papers
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Selection */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <label htmlFor="workspace-select" className="text-sm font-medium">
              Workspace:
            </label>
          </div>
          <Select
            value={selectedWorkspaceId}
            onValueChange={setSelectedWorkspaceId}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a workspace to search papers" />
            </SelectTrigger>
            <SelectContent>
              {(workspacesData?.data || []).map((workspace: any) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{workspace.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {workspace.role}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Papers
                  </p>
                  <p className="text-2xl font-bold">{totalPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950/20">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Processed
                  </p>
                  <p className="text-2xl font-bold text-green-600">{processedPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Processing
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">{processingPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-yellow-50 dark:bg-yellow-950/20">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ready
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{uploadedPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950/20">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed
                  </p>
                  <p className="text-2xl font-bold text-red-600">{failedPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-red-50 dark:bg-red-950/20">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paper Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Select Paper
                </CardTitle>
                <CardDescription>
                  Choose a paper to search through its extracted content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Filter */}
                <div>
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Papers</SelectItem>
                      <SelectItem value="PROCESSED">Processed Only</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="UPLOADED">Ready to Process</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Paper List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPapers.map((paper) => {
                    const isSelected = selectedPaperId === paper.id;
                    const statusBadge = {
                      UPLOADED: { variant: "secondary" as const, label: "Ready" },
                      PROCESSING: { variant: "default" as const, label: "Processing" },
                      PROCESSED: { variant: "outline" as const, label: "Processed" },
                      FAILED: { variant: "destructive" as const, label: "Failed" },
                    }[paper.processingStatus];

                    return (
                      <Card
                        key={paper.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedPaperId(paper.id)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {paper.title}
                              </h4>
                              <Badge variant={statusBadge.variant} className="text-xs shrink-0 ml-2">
                                {statusBadge.label}
                              </Badge>
                            </div>
                            {paper.metadata?.authors && (
                              <p className="text-xs text-muted-foreground">
                                {paper.metadata.authors.slice(0, 2).join(", ")}
                                {paper.metadata.authors.length > 2 && "..."}
                              </p>
                            )}
                            {paper.metadata?.year && (
                              <p className="text-xs text-muted-foreground">
                                {paper.metadata.year}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {filteredPapers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No papers found</p>
                    </div>
                  )}
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
                      <Search className="h-5 w-5" />
                      Search in "{selectedPaper.title}"
                    </CardTitle>
                    <CardDescription>
                      Search through the extracted text content of this paper
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                {/* Extracted Text Display */}
                <ExtractedTextDisplay paperId={selectedPaper.id} />
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Paper</h3>
                    <p className="text-sm">
                      Choose a paper from the list to search through its extracted content
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}