"use client";

/**
 * Discover > For You — AI-recommended papers
 *
 * Phase E.3 — responsive grid + skeleton loading.
 * Previously used a single-column <PageContainer> which broke the
 * dashboard layout. The (modules) route group already supplies
 * DashboardLayout, so the page just emits the cards.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecommendationsQuery } from "@/redux/api/searchApi";
import { BookOpen, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function RecommendationsPage() {
  const { data, isLoading } = useGetRecommendationsQuery();

  const recommendations = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-500" />
          For You
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalized recommendations based on your shared workspaces and
          reading history.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">
            Join or create a workspace to get personalized recommendations.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/workspaces">Browse workspaces</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((paper) => (
            <Card
              key={paper.id}
              className="group hover:-translate-y-1 hover:shadow-lg transition-all border-purple-500/10 hover:border-purple-500/40"
            >
              <CardContent className="p-5">
                <div className="space-y-3">
                  <h3 className="font-semibold text-base line-clamp-2">
                    <Link
                      href={`/dashboard/papers/${paper.id}`}
                      className="hover:underline hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      {paper.title || "Untitled Paper"}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {paper.abstract || "No abstract available."}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {paper.createdAt && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Added {formatDistanceToNow(new Date(paper.createdAt), { addSuffix: true })}
                      </div>
                    )}
                    {paper.source && (
                      <div className="flex items-center gap-1 capitalize">
                        <FileText className="w-3.5 h-3.5" />
                        {paper.source}
                      </div>
                    )}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:border-purple-200 dark:group-hover:border-purple-800"
                  >
                    <Link href={`/dashboard/papers/${paper.id}`}>Open</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCardSkeleton() {
  return (
    <Card className="border-purple-500/10">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
