"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CitationExportDialog } from "@/components/citations/CitationExportDialog";
import { ArrowLeft, Download, FileText, BookOpen, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CitationExportPage() {
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);

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

  const citationFormats = [
    { id: "bibtex", name: "BibTeX", description: "Standard bibliography format for LaTeX documents", icon: "📚" },
    { id: "endnote", name: "EndNote", description: "EndNote reference manager format", icon: "📖" },
    { id: "apa", name: "APA", description: "American Psychological Association style", icon: "📄" },
    { id: "mla", name: "MLA", description: "Modern Language Association style", icon: "📝" },
    { id: "ieee", name: "IEEE", description: "Institute of Electrical and Electronics Engineers style", icon: "⚡" },
    { id: "chicago", name: "Chicago", description: "Chicago Manual of Style", icon: "🏛️" },
    { id: "harvard", name: "Harvard", description: "Harvard referencing style", icon: "🎓" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Download className="h-8 w-8" />
            Export Citations
          </h1>
          <p className="text-muted-foreground">
            Export your research papers in various academic citation formats
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/research/citations">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Citations
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paper Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select Papers to Export
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
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Available Formats:</h4>
              <div className="grid grid-cols-1 gap-2">
                {citationFormats.map((format) => (
                  <div key={format.id} className="flex items-center gap-2 p-2 border rounded text-xs">
                    <span className="text-lg">{format.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{format.name}</div>
                      <div className="text-muted-foreground">{format.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CitationExportDialog
              paperIds={selectedPapers}
              paperTitles={mockPapers.filter(p => selectedPapers.includes(p.id)).map(p => p.title)}
              trigger={
                <Button 
                  className="w-full" 
                  disabled={selectedPapers.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected Papers
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Export Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">How to Export</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Select the papers you want to export from the list</li>
                <li>Choose your preferred citation format</li>
                <li>Click "Export Selected Papers" to download</li>
                <li>Your export will be saved to your downloads folder</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>You can select multiple papers for batch export</li>
                <li>Each format includes all necessary citation information</li>
                <li>Exports are compatible with major reference managers</li>
                <li>You can re-export papers anytime from your history</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
