"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import {
  useDeleteCitationExportMutation,
  useGetCitationExportHistoryQuery,
  useLazyDownloadCitationExportQuery,
} from "@/redux/api/phase2Api";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Filter,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CitationHistoryPage() {
  const { user } = useProtectedRoute();
  const scopedPath = (segment: string) =>
    buildRoleScopedPath(user?.role, segment);
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("");

  const {
    data: exportHistory,
    isLoading,
    refetch,
  } = useGetCitationExportHistoryQuery({
    limit: 100,
    ...(formatFilter && { format: formatFilter }),
  });

  const [deleteExport, { isLoading: isDeleting }] =
    useDeleteCitationExportMutation();
  const [downloadExport] = useLazyDownloadCitationExportQuery();

  const filteredExports =
    exportHistory?.exports.filter((exportItem) => {
      const matchesSearch =
        searchTerm === "" ||
        exportItem.paper?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        exportItem.collection?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    }) || [];

  const handleDeleteExport = async (exportId: string) => {
    if (!confirm("Are you sure you want to delete this export?")) {
      return;
    }

    try {
      await deleteExport(exportId).unwrap();
      showSuccessToast("Export deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Delete export error:", error);
      const errorMessage =
        error?.data?.message || "Failed to delete export. Please try again.";
      showErrorToast(errorMessage);
    }
  };

  const handleReDownload = async (exportId: string) => {
    try {
      const result = await downloadExport(exportId).unwrap();

      // Create a blob from the content
      const blob = new Blob([result.content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(`Downloaded ${result.filename}`);
    } catch (error: any) {
      console.error("Download export error:", error);
      const errorMessage =
        error?.data?.message || "Failed to download export. Please try again.";
      showErrorToast(errorMessage);
    }
  };

  const formatOptions = [
    { value: "", label: "All Formats" },
    { value: "BIBTEX", label: "BibTeX" },
    { value: "ENDNOTE", label: "EndNote" },
    { value: "APA", label: "APA" },
    { value: "MLA", label: "MLA" },
    { value: "IEEE", label: "IEEE" },
    { value: "CHICAGO", label: "Chicago" },
    { value: "HARVARD", label: "Harvard" },
  ];

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
                <Calendar className="h-6 w-6" />
                Export History
              </h1>
              <p className="text-sm text-muted-foreground">
                View and manage your citation export history
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <Calendar className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="text-sm text-muted-foreground flex items-center">
                {filteredExports.length} export
                {filteredExports.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export History List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading export history...
                </p>
              </CardContent>
            </Card>
          ) : filteredExports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No exports found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || formatFilter
                    ? "No exports match your current filters"
                    : "You haven't exported any citations yet"}
                </p>
                <Button asChild>
                  <Link href="/research/citations/export">
                    <Download className="h-4 w-4 mr-2" />
                    Create First Export
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredExports.map((exportItem) => (
              <Card
                key={exportItem.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {exportItem.format}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(exportItem.exportedAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {exportItem.paper ? (
                          <>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {exportItem.paper.title}
                            </span>
                          </>
                        ) : exportItem.collection ? (
                          <>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {exportItem.collection.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              Multiple Papers
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Exported on{" "}
                        {format(
                          new Date(exportItem.exportedAt),
                          "MMM dd, yyyy"
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReDownload(exportItem.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteExport(exportItem.id)}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Export Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Export Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {exportHistory?.exports.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Exports
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {
                    new Set(exportHistory?.exports.map((e) => e.format) || [])
                      .size
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Formats Used
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {exportHistory?.exports.filter((e) => e.paper).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Paper Exports
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {exportHistory?.exports.filter((e) => e.collection).length ||
                    0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Collection Exports
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
