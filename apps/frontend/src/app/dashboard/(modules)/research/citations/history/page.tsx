"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetCitationExportHistoryQuery } from "@/redux/api/phase2Api";
import { Download, FileText, Calendar, User, Quote, BookOpen, ArrowLeft, Search, Filter, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CitationHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  
  const { data: exportHistory, isLoading, refetch } = useGetCitationExportHistoryQuery({ 
    limit: 100,
    ...(formatFilter && { format: formatFilter })
  });

  const filteredExports = exportHistory?.exports.filter(exportItem => {
    const matchesSearch = searchTerm === "" || 
      exportItem.paper?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exportItem.collection?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleDeleteExport = (exportId: string) => {
    // Implement delete functionality
    console.log("Delete export:", exportId);
  };

  const handleReDownload = (exportId: string) => {
    // Implement re-download functionality
    console.log("Re-download export:", exportId);
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research/citations">
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
              {filteredExports.length} export{filteredExports.length !== 1 ? 's' : ''} found
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
              <p className="text-muted-foreground">Loading export history...</p>
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
                  : "You haven't exported any citations yet"
                }
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
            <Card key={exportItem.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {exportItem.format}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(exportItem.exportedAt), 'MMM dd, yyyy HH:mm')}
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
                      Exported on {format(new Date(exportItem.exportedAt), 'MMM dd, yyyy')}
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
              <div className="text-sm text-muted-foreground">Total Exports</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {new Set(exportHistory?.exports.map(e => e.format) || []).size}
              </div>
              <div className="text-sm text-muted-foreground">Formats Used</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {exportHistory?.exports.filter(e => e.paper).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Paper Exports</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {exportHistory?.exports.filter(e => e.collection).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Collection Exports</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
