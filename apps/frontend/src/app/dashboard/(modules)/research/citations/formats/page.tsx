"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, BookOpen, Download, Info } from "lucide-react";
import Link from "next/link";

export default function CitationFormatsPage() {
  const citationFormats = [
    {
      id: "bibtex",
      name: "BibTeX",
      description: "Standard bibliography format for LaTeX documents",
      features: ["LaTeX integration", "Academic standard", "Widely supported"],
      example: "@article{smith2024ml,\n  title={Machine Learning in Healthcare},\n  author={Smith, John and Johnson, Jane},\n  journal={Journal of Medical AI},\n  year={2024}\n}",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      id: "endnote",
      name: "EndNote",
      description: "EndNote reference manager format",
      features: ["EndNote compatibility", "Research management", "Citation tools"],
      example: "%0 Journal Article\n%T Machine Learning in Healthcare\n%A Smith, John\n%A Johnson, Jane\n%J Journal of Medical AI\n%D 2024",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      id: "apa",
      name: "APA",
      description: "American Psychological Association style",
      features: ["Psychology standard", "Social sciences", "Author-date format"],
      example: "Smith, J., & Johnson, J. (2024). Machine learning in healthcare: A comprehensive review. Journal of Medical AI, 15(3), 123-145.",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      id: "mla",
      name: "MLA",
      description: "Modern Language Association style",
      features: ["Humanities standard", "Literature studies", "Works cited format"],
      example: "Smith, John, and Jane Johnson. \"Machine Learning in Healthcare: A Comprehensive Review.\" Journal of Medical AI, vol. 15, no. 3, 2024, pp. 123-145.",
      icon: FileText,
      color: "text-orange-600"
    },
    {
      id: "ieee",
      name: "IEEE",
      description: "Institute of Electrical and Electronics Engineers style",
      features: ["Engineering standard", "Technical papers", "Numbered citations"],
      example: "[1] J. Smith and J. Johnson, \"Machine learning in healthcare: A comprehensive review,\" Journal of Medical AI, vol. 15, no. 3, pp. 123-145, 2024.",
      icon: FileText,
      color: "text-red-600"
    },
    {
      id: "chicago",
      name: "Chicago",
      description: "Chicago Manual of Style",
      features: ["General purpose", "Notes and bibliography", "Flexible format"],
      example: "Smith, John, and Jane Johnson. \"Machine Learning in Healthcare: A Comprehensive Review.\" Journal of Medical AI 15, no. 3 (2024): 123-145.",
      icon: FileText,
      color: "text-indigo-600"
    },
    {
      id: "harvard",
      name: "Harvard",
      description: "Harvard referencing style",
      features: ["Author-date system", "Widely used", "Academic standard"],
      example: "Smith, J. & Johnson, J. 2024, 'Machine learning in healthcare: A comprehensive review', Journal of Medical AI, vol. 15, no. 3, pp. 123-145.",
      icon: FileText,
      color: "text-teal-600"
    }
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
              <FileText className="h-6 w-6" />
              Citation Formats
            </h1>
            <p className="text-sm text-muted-foreground">
              Learn about supported citation formats and their features
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/research/citations/export">
              <Download className="h-4 w-4 mr-2" />
              Start Export
            </Link>
          </Button>
        </div>
      </div>

      {/* Format Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Format Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Supported Formats</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Academic Coverage</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">Auto</div>
              <div className="text-sm text-muted-foreground">Format Detection</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {citationFormats.map((format) => {
          const Icon = format.icon;
          return (
            <Card key={format.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${format.color}`} />
                    <CardTitle className="text-lg">{format.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {format.id.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {format.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Example Output</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {format.example}
                    </pre>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    asChild
                  >
                    <Link href={`/research/citations/export?format=${format.id}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Export in {format.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">When to Use Each Format</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>BibTeX:</strong> LaTeX documents, academic papers</li>
                <li><strong>EndNote:</strong> Research management, large bibliographies</li>
                <li><strong>APA:</strong> Psychology, social sciences, education</li>
                <li><strong>MLA:</strong> Literature, humanities, language studies</li>
                <li><strong>IEEE:</strong> Engineering, computer science, technology</li>
                <li><strong>Chicago:</strong> History, general academic writing</li>
                <li><strong>Harvard:</strong> General academic writing, business</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Always verify citations before submission</li>
                <li>• Check journal requirements for specific formats</li>
                <li>• Use consistent formatting throughout your work</li>
                <li>• Keep your reference list updated</li>
                <li>• Export regularly to avoid data loss</li>
                <li>• Use collections to organize related papers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
