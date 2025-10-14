"use client";

import { CitationExportDialog } from "@/components/citations/CitationExportDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CitationExportPage() {
  const { user } = useProtectedRoute();
  const scopedPath = (segment: string) =>
    buildRoleScopedPath(user?.role, segment);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const { data: exportHistory, isLoading: isExportHistoryLoading } =
    useGetCitationExportHistoryQuery({
      limit: 50,
    });

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
    limit: 20,
  });

  const isLoading =
    isPapersLoading || isCollectionsLoading || isExportHistoryLoading;

  const papers = useMemo(() => {
    if (!papersData?.items) return [];
    return papersData.items.map((paper) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.metadata?.authors || [],
      year: paper.metadata?.year || new Date(paper.createdAt).getFullYear(),
    }));
  }, [papersData]);

  const collections = useMemo(() => {
    if (!collectionsData?.result) return [];
    return collectionsData.result.map((collection) => ({
      id: collection.id,
      name: collection.name,
      count: collection._count?.papers || 0,
    }));
  }, [collectionsData]);

  const handlePaperSelect = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="hover:bg-white/80">
              <Link href={scopedPath("/research/citations")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Citations
              </Link>
            </Button>
            <div className="h-6 border-l border-border" />
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Download className="h-6 w-6" />
                Citation Export
              </h1>
              <p className="text-sm text-muted-foreground">
                Export citations in various academic formats
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Paper Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Papers for Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Preparing paper list...
                    </p>
                  </div>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No papers available for export
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload papers or request access to start exporting
                  </p>
                </div>
              ) : (
                papers.map((paper) => (
                  <div
                    key={paper.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPapers.includes(paper.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "hover:bg-muted/60"
                    }`}
                    onClick={() => handlePaperSelect(paper.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1.5 line-clamp-2">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span>{paper.authors.join(", ") || "Unknown"}</span>
                          <span>{paper.year}</span>
                        </div>
                      </div>
                      {selectedPapers.includes(paper.id) && (
                        <Badge variant="secondary" className="shrink-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
              {(papersError || collectionsError) && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Failed to load some resources. Please refresh the page.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CitationExportDialog
                paperIds={selectedPapers}
                paperTitles={papers
                  .filter((p) => selectedPapers.includes(p.id))
                  .map((p) => p.title)}
                trigger={
                  <Button
                    disabled={selectedPapers.length === 0}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected ({selectedPapers.length})
                  </Button>
                }
              />

              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">
                  Quick Export Collections
                </h4>
                {collections.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No collections available yet.
                  </p>
                ) : (
                  collections.slice(0, 5).map((collection) => (
                    <CitationExportDialog
                      key={collection.id}
                      collectionId={collection.id}
                      collectionName={collection.name}
                      trigger={
                        <Button
                          variant="outline"
                          className="w-full justify-start text-sm"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {collection.name} ({collection.count})
                        </Button>
                      }
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Export History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading export history...
              </div>
            ) : exportHistory?.exports.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No exports yet
              </div>
            ) : (
              <div className="space-y-3">
                {exportHistory?.exports.map((exportItem) => (
                  <div key={exportItem.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{exportItem.format}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(
                          new Date(exportItem.exportedAt),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="text-sm">
                      {exportItem.paper ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="truncate">
                            {exportItem.paper.title}
                          </span>
                        </div>
                      ) : exportItem.collection ? (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
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
            <CardTitle>Supported Citation Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">BibTeX</h3>
                <p className="text-sm text-muted-foreground">
                  Standard bibliography format for LaTeX documents
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">EndNote</h3>
                <p className="text-sm text-muted-foreground">
                  EndNote reference manager format
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">APA</h3>
                <p className="text-sm text-muted-foreground">
                  American Psychological Association style
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">MLA</h3>
                <p className="text-sm text-muted-foreground">
                  Modern Language Association style
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">IEEE</h3>
                <p className="text-sm text-muted-foreground">
                  Institute of Electrical and Electronics Engineers style
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">Chicago</h3>
                <p className="text-sm text-muted-foreground">
                  Chicago Manual of Style
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium mb-1">Harvard</h3>
                <p className="text-sm text-muted-foreground">
                  Harvard referencing style
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
