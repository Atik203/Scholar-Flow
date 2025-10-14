"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Highlighter, Quote, TextCursor, MessageSquare, Activity, Download, Calendar, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function ResearchPage() {
  const researchTools = [
    {
      title: "Citations & References",
      description: "Export citations in 7 academic formats, manage export history",
      icon: Quote,
      href: "/research/citations",
      color: "bg-purple-50 border-purple-200",
      features: ["7 Formats", "Export History", "Batch Export"],
      subRoutes: [
        { title: "Export Citations", href: "/research/citations/export", icon: Download },
        { title: "Export History", href: "/research/citations/history", icon: Calendar },
        { title: "Format Guide", href: "/research/citations/formats", icon: BookOpen },
      ]
    },
    {
      title: "Research Discussions",
      description: "Threaded discussions for papers, collections, and workspaces",
      icon: MessageSquare,
      href: "/research/discussions",
      color: "bg-blue-50 border-blue-200",
      features: ["Threaded", "Real-time", "Collaboration"],
      subRoutes: [
        { title: "Create Discussion", href: "/research/discussions/create", icon: MessageSquare },
      ]
    },
    {
      title: "Activity Log",
      description: "Comprehensive activity tracking with filtering and export",
      icon: Activity,
      href: "/research/activity-log",
      color: "bg-green-50 border-green-200",
      features: ["Real-time", "Filtering", "Export"],
      subRoutes: [
        { title: "Export Log", href: "/research/activity-log/export", icon: Download },
      ]
    },
    {
      title: "PDF Annotations",
      description: "Annotate and highlight important sections in PDFs",
      icon: Highlighter,
      href: "/research/annotations",
      color: "bg-orange-50 border-orange-200",
      features: ["PDF View", "Highlights", "Comments"],
    },
    {
      title: "Text Editor",
      description: "Create and edit research papers with our rich text editor",
      icon: FileText,
      href: "/research/editor",
      color: "bg-indigo-50 border-indigo-200",
      features: ["Rich Text", "Auto-save", "Collaboration"],
    },
    {
      title: "PDF Text Extraction",
      description: "Extract and process text from PDF documents",
      icon: TextCursor,
      href: "/research/pdf-extraction",
      color: "bg-teal-50 border-teal-200",
      features: ["OCR", "Text Processing", "Metadata"],
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researchTools.map((tool) => (
              <Card
                key={tool.title}
                className={`transition-all hover:shadow-lg hover:-translate-y-1 ${tool.color}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/60 rounded-md text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Main Action */}
                  <Link href={tool.href}>
                    <Button className="w-full">
                      Open {tool.title}
                    </Button>
                  </Link>

                  {/* Sub-routes */}
                  {tool.subRoutes && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Quick Actions:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {tool.subRoutes.map((subRoute, index) => {
                          const Icon = subRoute.icon;
                          return (
                            <Link key={index} href={subRoute.href}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                              >
                                <Icon className="h-3 w-3 mr-2" />
                                {subRoute.title}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Latest Features</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Quote className="h-5 w-5 text-purple-600" />
                    <span>Citation Export System</span>
                  </CardTitle>
                  <CardDescription>
                    Export citations in 7 academic formats with batch processing and history tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">BibTeX</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">APA</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">MLA</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">+4 more</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span>Threaded Discussions</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time collaboration with threaded conversations for papers and collections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Real-time</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Threaded</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Collaboration</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Activity Logging</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive activity tracking with advanced filtering and export capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Real-time</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Filtering</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Export</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
