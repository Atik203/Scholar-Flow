"use client";

import { CitationExportDialog } from "@/components/citations/CitationExportDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import { useGetCitationExportHistoryQuery } from "@/redux/api/phase2Api";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileInput,
  FileText,
  Quote,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

export default function CitationsPage() {
  const { user, isAuthenticated } = useProtectedRoute();
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const { data: exportHistory, isLoading } = useGetCitationExportHistoryQuery({
    limit: 10,
  });

  const scopedPath = useCallback(
    (segment: string) => buildRoleScopedPath(user?.role, segment),
    [user?.role]
  );

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

  const mockPapers = [
    {
      id: "1",
      title: "Machine Learning in Healthcare: A Comprehensive Review",
      authors: ["Dr. Smith", "Dr. Johnson"],
      year: 2024,
    },
    {
      id: "2",
      title: "Deep Learning Approaches for Natural Language Processing",
      authors: ["Dr. Brown", "Dr. Davis"],
      year: 2023,
    },
    {
      id: "3",
      title: "Blockchain Technology in Supply Chain Management",
      authors: ["Dr. Wilson", "Dr. Miller"],
      year: 2024,
    },
    {
      id: "4",
      title: "Artificial Intelligence Ethics and Bias",
      authors: ["Dr. Garcia", "Dr. Martinez"],
      year: 2023,
    },
    {
      id: "5",
      title: "Quantum Computing: Current State and Future Prospects",
      authors: ["Dr. Anderson", "Dr. Taylor"],
      year: 2024,
    },
  ];

  const mockCollections = [
    { id: "1", name: "AI Research Papers", count: 12 },
    { id: "2", name: "Healthcare Technology", count: 8 },
    { id: "3", name: "Blockchain Studies", count: 15 },
  ];

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
              paperTitles={mockPapers
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
              <div className="text-2xl font-bold">{mockPapers.length}</div>
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
              <div className="text-2xl font-bold">{mockCollections.length}</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paper Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Research Papers
                </CardTitle>
                <Badge variant="secondary" className="ml-auto">
                  {selectedPapers.length} of {mockPapers.length} selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPapers.map((paper) => (
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
                          {paper.authors.join(", ")}
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
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions & Collections */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CitationExportDialog
                  collectionId="1"
                  collectionName="AI Research Papers"
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Collection
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <FileInput className="h-4 w-4 mr-2" />
                  Import Citations
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Citation Manager
                </Button>
              </CardContent>
            </Card>

            {/* Collections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Collections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {collection.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {collection.count} papers
                        </p>
                      </div>
                      <CitationExportDialog
                        collectionId={collection.id}
                        collectionName={collection.name}
                        trigger={
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

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
              {isLoading ? (
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
