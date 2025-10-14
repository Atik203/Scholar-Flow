"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, BookOpen, Download, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CitationFormatsPage() {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const citationFormats = [
    {
      id: "bibtex",
      name: "BibTeX",
      description: "Standard bibliography format for LaTeX documents",
      icon: "📚",
      example: `@article{smith2024machine,
  title={Machine Learning in Healthcare: A Comprehensive Review},
  author={Smith, John and Johnson, Sarah},
  journal={Journal of Medical AI},
  volume={15},
  number={3},
  pages={123--145},
  year={2024},
  publisher={Medical AI Press}
}`,
      useCase: "LaTeX documents, academic papers, research publications"
    },
    {
      id: "endnote",
      name: "EndNote",
      description: "EndNote reference manager format",
      icon: "📖",
      example: `%0 Journal Article
%T Machine Learning in Healthcare: A Comprehensive Review
%A Smith, John
%A Johnson, Sarah
%J Journal of Medical AI
%D 2024
%V 15
%N 3
%P 123-145
%I Medical AI Press`,
      useCase: "EndNote software, reference management"
    },
    {
      id: "apa",
      name: "APA",
      description: "American Psychological Association style",
      icon: "📄",
      example: `Smith, J., & Johnson, S. (2024). Machine learning in healthcare: A comprehensive review. Journal of Medical AI, 15(3), 123-145.`,
      useCase: "Psychology, social sciences, education"
    },
    {
      id: "mla",
      name: "MLA",
      description: "Modern Language Association style",
      icon: "📝",
      example: `Smith, John, and Sarah Johnson. "Machine Learning in Healthcare: A Comprehensive Review." Journal of Medical AI, vol. 15, no. 3, 2024, pp. 123-145.`,
      useCase: "Literature, humanities, liberal arts"
    },
    {
      id: "ieee",
      name: "IEEE",
      description: "Institute of Electrical and Electronics Engineers style",
      icon: "⚡",
      example: `J. Smith and S. Johnson, "Machine Learning in Healthcare: A Comprehensive Review," Journal of Medical AI, vol. 15, no. 3, pp. 123-145, 2024.`,
      useCase: "Engineering, computer science, technology"
    },
    {
      id: "chicago",
      name: "Chicago",
      description: "Chicago Manual of Style",
      icon: "🏛️",
      example: `Smith, John, and Sarah Johnson. "Machine Learning in Healthcare: A Comprehensive Review." Journal of Medical AI 15, no. 3 (2024): 123-145.`,
      useCase: "History, literature, general academic writing"
    },
    {
      id: "harvard",
      name: "Harvard",
      description: "Harvard referencing style",
      icon: "🎓",
      example: `Smith, J. & Johnson, S. 2024, 'Machine Learning in Healthcare: A Comprehensive Review', Journal of Medical AI, vol. 15, no. 3, pp. 123-145.`,
      useCase: "General academic writing, business, law"
    }
  ];

  const handleCopyExample = (formatId: string, example: string) => {
    navigator.clipboard.writeText(example);
    setCopiedFormat(formatId);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Citation Formats Guide
          </h1>
          <p className="text-muted-foreground">
            Learn about supported citation formats and see examples
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

      {/* Format Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Citation Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {citationFormats.map((format) => (
              <div key={format.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{format.icon}</span>
                  <div>
                    <h3 className="font-medium">{format.name}</h3>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Use case:</strong> {format.useCase}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Format Examples */}
      <div className="space-y-6">
        {citationFormats.map((format) => (
          <Card key={format.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">{format.icon}</span>
                {format.name} Format
              </CardTitle>
              <p className="text-sm text-muted-foreground">{format.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Example Output:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {format.example}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyExample(format.id, format.example)}
                    >
                      {copiedFormat === format.id ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Use case: {format.useCase}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/research/citations/export">
                      <Download className="h-4 w-4 mr-1" />
                      Export in {format.name}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Format Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Format Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Format</th>
                  <th className="text-left p-2">Best For</th>
                  <th className="text-left p-2">Software</th>
                  <th className="text-left p-2">Complexity</th>
                </tr>
              </thead>
              <tbody>
                {citationFormats.map((format) => (
                  <tr key={format.id} className="border-b">
                    <td className="p-2 font-medium">{format.name}</td>
                    <td className="p-2 text-muted-foreground">{format.useCase}</td>
                    <td className="p-2 text-muted-foreground">
                      {format.id === 'bibtex' && 'LaTeX, Overleaf'}
                      {format.id === 'endnote' && 'EndNote, Zotero'}
                      {format.id === 'apa' && 'Word, Google Docs'}
                      {format.id === 'mla' && 'Word, Google Docs'}
                      {format.id === 'ieee' && 'LaTeX, Word'}
                      {format.id === 'chicago' && 'Word, Google Docs'}
                      {format.id === 'harvard' && 'Word, Google Docs'}
                    </td>
                    <td className="p-2">
                      <Badge variant={format.id === 'bibtex' || format.id === 'endnote' ? 'destructive' : 'secondary'}>
                        {format.id === 'bibtex' || format.id === 'endnote' ? 'High' : 'Low'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/research/citations/export">
                <Download className="h-4 w-4 mr-2" />
                Export Citations
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/research/citations/history">
                <FileText className="h-4 w-4 mr-2" />
                View History
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/research/citations">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Citations
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
