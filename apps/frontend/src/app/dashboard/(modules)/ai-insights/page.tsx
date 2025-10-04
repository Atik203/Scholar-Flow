"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { Bot, FileText, MessageCircle, Users } from "lucide-react";
import Link from "next/link";

export default function AiInsightsPage() {
  const { isAuthenticated, isLoading: authLoading } = useProtectedRoute();
  const {
    data: papersResponse,
    isLoading,
    error,
  } = useListPapersQuery({
    page: 1,
    limit: 20,
  });

  if (authLoading || !isAuthenticated) {
    return null; // Loading state handled by useProtectedRoute
  }

  const papers = papersResponse?.items || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg">
              <Bot className="h-8 w-8 text-blue-600 dark:text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Insights</h1>
              <p className="text-muted-foreground">
                Chat with AI about your research papers to get insights and ask
                questions
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-white" />
                <CardTitle className="text-lg">Interactive Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Have conversations with AI about your papers. Ask questions, get
                explanations, and explore different perspectives.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg">Paper Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get AI-powered analysis of your papers including key insights,
                methodology breakdown, and research implications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-lg">Research Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Use AI as your research assistant to help with literature
                reviews, methodology questions, and research planning.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Your Papers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Your Papers</h2>
              <p className="text-muted-foreground">
                Start AI conversations with any of your uploaded papers
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/papers/upload">Upload New Paper</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Failed to load papers. Please try again.
                </p>
              </CardContent>
            </Card>
          ) : papers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50 dark:text-muted-foreground/40" />
                <h3 className="text-lg font-medium mb-2">No papers uploaded</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first paper to start using AI insights.
                </p>
                <Button asChild>
                  <Link href="/dashboard/papers/upload">Upload Paper</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper) => (
                <Card
                  key={paper.id}
                  className="hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-2 leading-tight">
                          {paper.title}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {paper.metadata?.authors?.join(", ") ||
                            "Unknown author"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          paper.processingStatus === "PROCESSED"
                            ? "default"
                            : paper.processingStatus === "PROCESSING"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs ml-2 shrink-0"
                      >
                        {paper.processingStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {paper.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {paper.abstract}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {paper.metadata?.year || "No year"}
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/papers/${paper.id}`}>
                          <Bot className="h-3 w-3 mr-1" />
                          Chat with AI
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
