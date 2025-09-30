"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Highlighter, Quote, TextCursor } from "lucide-react";
import Link from "next/link";

export default function ResearchPage() {
  const researchTools = [
    {
      title: "Text Editor",
      description: "Create and edit research papers with our rich text editor",
      icon: FileText,
      href: "/dashboard/research/editor",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "PDF Text Extraction",
      description: "Extract and process text from PDF documents",
      icon: TextCursor,
      href: "/dashboard/research/pdf-extraction",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Citations",
      description: "Manage and format citations for your research",
      icon: Quote,
      href: "/dashboard/research/citations",
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Annotations",
      description: "Annotate and highlight important sections",
      icon: Highlighter,
      href: "/dashboard/research/annotations",
      color: "bg-orange-50 border-orange-200",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Research Tools
            </h1>
            <p className="text-muted-foreground">
              Access all your research tools in one place. Create papers,
              extract text, manage citations, and more.
            </p>
          </div>

          {/* Research Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {researchTools.map((tool) => (
              <Link key={tool.title} href={tool.href}>
                <Card
                  className={`transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${tool.color}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <tool.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                    <Button
                      variant="ghost"
                      className="mt-4 p-0 h-auto font-medium"
                    >
                      Get Started →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gray-50 border-gray-200 opacity-75">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>Research Notes</span>
                  </CardTitle>
                  <CardDescription>
                    Organize your research notes and ideas
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-50 border-gray-200 opacity-75">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>Collaboration</span>
                  </CardTitle>
                  <CardDescription>
                    Collaborate with other researchers
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-50 border-gray-200 opacity-75">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>AI Assistant</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered research assistance
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
