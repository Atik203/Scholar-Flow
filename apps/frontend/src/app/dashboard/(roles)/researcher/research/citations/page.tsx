"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CitationExportDialog } from "@/components/citations/CitationExportDialog";
import { useGetCitationExportHistoryQuery } from "@/redux/api/phase2Api";
import { Download, FileText, Calendar, User, Quote, BookOpen, Layers } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CitationsPage() {
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const { data: exportHistory, isLoading } = useGetCitationExportHistoryQuery({ limit: 20 });

  const handlePaperSelect = (paperId: string) => {
    setSelectedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const mockPapers = [
    { id: "1", title: "Machine Learning in Healthcare: A Comprehensive Review", authors: ["Dr. Smith", "Dr. Johnson"], year: 2024 },
    { id: "2", title: "Deep Learning Approaches for Natural Language Processing", authors: ["Dr. Brown", "Dr. Davis"], year: 2023 },
    { id: "3", title: "Blockchain Technology in Supply Chain Management", authors: ["Dr. Wilson", "Dr. Miller"], year: 2024 },
    { id: "4", title: "Artificial Intelligence Ethics and Bias", authors: ["Dr. Garcia", "Dr. Martinez"], year: 2023 },
    { id: "5", title: "Quantum Computing: Current State and Future Prospects", authors: ["Dr. Anderson", "Dr. Taylor"], year: 2024 },
  ];

  const mockCollections = [
    { id: "1", name: "AI Research Papers", count: 12 },
    { id: "2", name: "Healthcare Technology", count: 8 },
    { id: "3", name: "Blockchain Studies", count: 15 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Quote className="h-8 w-8" />
            Citations & References
          </h1>
          <p className="text-muted-foreground">
            Manage and export citations in various academic formats
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/research">
            <Button variant="outline">
              <Layers className="h-4 w-4 mr-2" />
              Back to Research
            </Button>
          </Link>
          <Link href="/research/citations/formats">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Formats
            </Button>
          </Link>
          <Link href="/research/citations/history">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </Link>
          <CitationExportDialog
            paperIds={selectedPapers}
            paperTitles={mockPapers.filter(p => selectedPapers.includes(p.id)).map(p => p.title)}
            trigger={
              <Button disabled={selectedPapers.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedPapers.length})
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paper Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Papers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPapers.map((paper) => (
              <div
                key={paper.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPapers.includes(paper.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handlePaperSelect(paper.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{paper.authors.join(", ")}</span>
                      <span>{paper.year}</span>
                    </div>
                  </div>
                  {selectedPapers.includes(paper.id) && (
                    <Badge variant="secondary" className="ml-2">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CitationExportDialog
              collectionId="1"
              collectionName="AI Research Papers"
              trigger={
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Collection
                </Button>
              }
            />
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Import Citations
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Citation Manager
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Exports
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
                        {format(new Date(exportItem.exportedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="text-sm">
                      {exportItem.paper ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{exportItem.paper.title}</span>
                        </div>
                      ) : exportItem.collection ? (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{exportItem.collection.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Multiple papers</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Collections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCollections.map((collection) => (
              <div key={collection.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{collection.name}</h3>
                    <p className="text-xs text-muted-foreground">{collection.count} papers</p>
                  </div>
                  <CitationExportDialog
                    collectionId={collection.id}
                    collectionName={collection.name}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
  );
}
