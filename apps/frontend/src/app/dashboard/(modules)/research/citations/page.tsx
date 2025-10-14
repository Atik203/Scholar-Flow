"use client";

import { CitationExportDialog } from "@/components/citations/CitationExportDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useGetCitationExportHistoryQuery } from "@/redux/api/phase2Api";
import { format } from "date-fns";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export default function CitationsPage() {
  const { user, isAuthenticated } = useProtectedRoute();
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);

  // Fetch real data from backend
  const {
    data: papersData,
    isLoading: isPapersLoading,
    error: papersError,
  } = useListPapersQuery({
    page: 1,
    limit: 50,
  });
  const {
    data: collectionsData,
    isLoading: isCollectionsLoading,
    error: collectionsError,
  } = useGetMyCollectionsQuery({
    page: 1,
    limit: 10,
  });
  const {
    data: exportHistory,
    isLoading: isExportHistoryLoading,
    error: exportHistoryError,
  } = useGetCitationExportHistoryQuery({
    limit: 10,
  });

  const scopedPath = useCallback(
    (segment: string) => buildRoleScopedPath(user?.role, segment),
    [user?.role]
  );

  // Transform papers data for UI
  const papers = useMemo(() => {
    if (!papersData?.items) return [];
    return papersData.items.map((paper) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.metadata?.authors || [],
      year: paper.metadata?.year || new Date(paper.createdAt).getFullYear(),
    }));
  }, [papersData]);

  // Transform collections data for UI
  const collections = useMemo(() => {
    if (!collectionsData?.result) return [];
    return collectionsData.result.map((collection) => ({
      id: collection.id,
      name: collection.name,
      count: collection._count?.papers || 0,
    }));
  }, [collectionsData]);

  // Handle loading and error states
  const isLoading =
    isPapersLoading || isCollectionsLoading || isExportHistoryLoading;

  // Only show error if we actually have an error AND no data loaded
  const hasError =
    (papersError && !papersData) ||
    (collectionsError && !collectionsData) ||
    (exportHistoryError && !exportHistory);

  if (!isAuthenticated) {
    return null;
  }

  const handlePaperSelect = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const citationFormats = [
    {
      name: "BibTeX",
      description: "Standard bibliography format for LaTeX documents",
      recommended: true,
    },
    {
      name: "EndNote",
      description: "EndNote reference manager format",
      recommended: false,
    },
    {
      name: "APA",
      description: "American Psychological Association style",
      recommended: true,
    },
    {
      name: "MLA",
      description: "Modern Language Association style",
      recommended: false,
    },
    {
      name: "IEEE",
      description: "Institute of Electrical and Electronics Engineers style",
      recommended: true,
    },
    {
      name: "Chicago",
      description: "Chicago Manual of Style",
      recommended: false,
    },
    {
      name: "Harvard",
      description: "Harvard referencing style",
      recommended: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Error Alert */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load some data. Please refresh the page or try again
              later.
            </AlertDescription>
          </Alert>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Quote className="h-8 w-8 text-primary" />
              Citations & References
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and export citations in various academic formats
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={scopedPath("/research/citations/formats")}>
                <FileText className="h-4 w-4 mr-2" />
                View Formats
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={scopedPath("/research/citations/history")}>
                <Calendar className="h-4 w-4 mr-2" />
                Export History
              </Link>
            </Button>
            <CitationExportDialog
              paperIds={selectedPapers}
              paperTitles={papers
                .filter((p) => selectedPapers.includes(p.id))
                .map((p) => p.title)}
              trigger={
                <Button disabled={selectedPapers.length === 0} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedPapers.length})
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Papers
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{papers.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for citation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collections.length}</div>
              <p className="text-xs text-muted-foreground">
                Organized collections
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exports</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exportHistory?.exports.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total citations exported
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedPapers.length}</div>
              <p className="text-xs text-muted-foreground">
                Papers ready to export
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Paper Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Research Papers
              </CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {selectedPapers.length} of {papers.length} selected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading papers...
                  </p>
                </div>
              </div>
            ) : papers.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No papers available
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload papers to start creating citations
                </p>
              </div>
            ) : (
              papers.map((paper) => (
                <div
                  key={paper.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedPapers.includes(paper.id)
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:bg-muted/50 hover:border-muted-foreground/20"
                  }`}
                  onClick={() => handlePaperSelect(paper.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1.5 line-clamp-2">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Quote className="h-3 w-3" />
                          {paper.authors.join(", ") || "Unknown Author"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {paper.year}
                        </span>
                      </div>
                    </div>
                    {selectedPapers.includes(paper.id) && (
                      <Badge variant="default" className="shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isExportHistoryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading export history...
                    </p>
                  </div>
                </div>
              ) : exportHistory?.exports.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No exports yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start by selecting papers and exporting citations
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory?.exports.map((exportItem) => (
                    <div
                      key={exportItem.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{exportItem.format}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(exportItem.exportedAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="text-sm">
                        {exportItem.paper ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">
                              {exportItem.paper.title}
                            </span>
                          </div>
                        ) : exportItem.collection ? (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{exportItem.collection.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Multiple papers
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Citation Formats Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supported Citation Formats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {citationFormats.map((format) => (
                  <div
                    key={format.name}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          {format.name}
                          {format.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
