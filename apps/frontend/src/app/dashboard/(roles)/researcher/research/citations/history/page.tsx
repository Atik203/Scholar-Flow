"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCitationExportHistoryQuery } from "@/redux/api/phase2Api";
import { ArrowLeft, Download, FileText, Calendar, BookOpen, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CitationHistoryPage() {
  const { data: exportHistory, isLoading, refetch } = useGetCitationExportHistoryQuery({ limit: 50 });

  const handleReDownload = (exportId: string) => {
    console.log("Re-downloading export:", exportId);
    // Implement re-download logic
  };

  const handleDeleteExport = (exportId: string) => {
    console.log("Deleting export:", exportId);
    // Implement delete logic
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Export History
          </h1>
          <p className="text-muted-foreground">
            View and manage your previous citation exports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/research/citations">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Citations
            </Button>
          </Link>
        </div>
      </div>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{exportHistory?.exports.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Exports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory?.exports.filter(e => e.collection).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Collection Exports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory?.exports.filter(e => e.paper).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Paper Exports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory?.exports.filter(e => e.downloadedAt).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Downloaded</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading export history...</p>
            </div>
          ) : exportHistory?.exports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No exports yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by exporting some citations from your research papers
              </p>
              <Button asChild>
                <Link href="/research/citations/export">
                  <Download className="h-4 w-4 mr-2" />
                  Export Citations
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {exportHistory?.exports.map((exportItem) => (
                <div key={exportItem.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {exportItem.format}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(exportItem.exportedAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {exportItem.downloadedAt && (
                        <Badge variant="secondary" className="text-xs">
                          Downloaded
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReDownload(exportItem.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Re-download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteExport(exportItem.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {exportItem.paper ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{exportItem.paper.title}</span>
                      </div>
                    ) : exportItem.collection ? (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{exportItem.collection.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({exportItem.collection.paperCount} papers)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Multiple papers</span>
                        <span className="text-xs text-muted-foreground">
                          ({exportItem.paperCount} papers)
                        </span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      File size: {exportItem.fileSize || 'Unknown'} | 
                      Export ID: {exportItem.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Management */}
      <Card>
        <CardHeader>
          <CardTitle>Export Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Re-download Exports</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You can re-download any of your previous exports. This is useful if you've lost the original file or need it again.
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Bulk Download
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Clean Up Old Exports</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Remove old exports to free up storage space. Exports older than 1 year are automatically archived.
              </p>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Up
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
