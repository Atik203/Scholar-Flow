"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { hasRoleAccess, USER_ROLES } from "@/lib/auth/roles";
import { FileText, Highlighter, Quote, TextCursor, MessageSquare, Activity, Download, Calendar, BookOpen, GitGraph, Globe, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface ResearchTool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  features: string[];
  subRoutes?: { title: string; href: string; icon: LucideIcon }[];
}

export default function ResearchPage() {
  const { user, isLoading } = useProtectedRoute();
  const isProOrAbove = hasRoleAccess(user?.role, USER_ROLES.PRO_RESEARCHER);

  const researchTools: ResearchTool[] = [
    {
      title: "Citations & References",
      description: "Export citations in 7 academic formats, manage export history",
      icon: Quote,
      href: "/dashboard/research/citations",
      color: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900",
      features: ["7 Formats", "Export History", "Batch Export"],
      subRoutes: [
        { title: "Export Citations", href: "/dashboard/research/citations/export", icon: Download },
        { title: "Export History", href: "/dashboard/research/citations/history", icon: Calendar },
        { title: "Format Guide", href: "/dashboard/research/citations/formats", icon: BookOpen },
      ],
    },
    {
      title: "PDF Text Extraction",
      description: "Extract and process text from PDF documents",
      icon: TextCursor,
      href: "/dashboard/research/pdf-extraction",
      color: "bg-teal-50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-900",
      features: ["OCR", "Text Processing", "Metadata"],
    },
    {
      title: "Text Editor",
      description: "Create and edit research papers with our rich text editor",
      icon: FileText,
      href: "/dashboard/research/editor",
      color: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900",
      features: ["Rich Text", "Auto-save", "Collaboration"],
    },
    {
      title: "PDF Annotations",
      description: "Annotate and highlight important sections in PDFs",
      icon: Highlighter,
      href: "/dashboard/research/annotations",
      color: "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900",
      features: ["PDF View", "Highlights", "Comments"],
    },
    {
      title: "Research Discussions",
      description: "Threaded discussions for papers, collections, and workspaces",
      icon: MessageSquare,
      href: "/dashboard/discussions",
      color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
      features: ["Threaded", "Real-time", "Collaboration"],
      subRoutes: [
        { title: "All Discussions", href: "/dashboard/discussions", icon: MessageSquare },
        { title: "Create Discussion", href: "/dashboard/discussions/new", icon: MessageSquare },
      ],
    },
    {
      title: "Activity Log",
      description: "Comprehensive activity tracking with filtering and export",
      icon: Activity,
      href: "/dashboard/research/activity-log",
      color: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
      features: ["Real-time", "Filtering", "Export"],
      subRoutes: [
        { title: "Export Log", href: "/dashboard/research/activity-log/export", icon: Download },
      ],
    },
  ];

  const proTools: ResearchTool[] = [
    {
      title: "Citation Graph",
      description: "Visualize real citation relationships between your papers",
      icon: GitGraph,
      href: "/dashboard/research/citation-graph",
      color: "bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900",
      features: ["Real Edges", "Paper Selection", "Pro Only"],
    },
    {
      title: "Research Map",
      description: "Explore your research landscape by topic frequency",
      icon: Globe,
      href: "/dashboard/research/map",
      color: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-900",
      features: ["Topic Cloud", "Tag Filtering", "Pro Only"],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

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
            {[...researchTools, ...(isProOrAbove ? proTools : [])].map((tool) => (
              <Card
                key={tool.title}
                className={`transition-all hover:shadow-lg hover:-translate-y-1 ${tool.color}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-foreground/10 shadow-sm">
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
                        className="px-2 py-1 bg-white/60 dark:bg-foreground/5 rounded-md text-xs font-medium"
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
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Quote className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Citation Export System</span>
                  </CardTitle>
                  <CardDescription>
                    Export citations in 7 academic formats with batch processing and history tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-md text-xs">BibTeX</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-md text-xs">APA</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-md text-xs">MLA</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-md text-xs">+4 more</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Threaded Discussions</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time collaboration with threaded conversations for papers and collections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md text-xs">Real-time</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md text-xs">Threaded</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md text-xs">Collaboration</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Activity Logging</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive activity tracking with advanced filtering and export capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-md text-xs">Real-time</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-md text-xs">Filtering</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-md text-xs">Export</span>
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
