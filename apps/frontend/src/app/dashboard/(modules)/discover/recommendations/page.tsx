"use client";

/**
 * Discover > For You — personalized recommendations
 * External items explain why ("Because you work on X"); platform items
 * open the paper in the library.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveExternalPaperButton } from "@/components/papers/SaveExternalPaperButton";
import { useGetRecommendationsQuery } from "@/redux/api/searchApi";
import type { DiscoveryItem } from "@/redux/api/searchApi";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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
          Personalized from your tags and paper metadata — plus papers from
          your workspaces. Add tags to any paper to sharpen these results.
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
            Import a paper or create a workspace to get personalized
            recommendations.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/workspaces">Browse workspaces</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((paper) => (
            <RecommendationCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ paper }: { paper: DiscoveryItem }) {
  const isExternal = paper.kind === "external";
  const published = paper.publishedAt
    ? formatDistanceToNow(new Date(paper.publishedAt), { addSuffix: true })
    : null;

  return (
    <Card className="group hover:-translate-y-1 hover:shadow-lg transition-all border-purple-500/10 hover:border-purple-500/40">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 capitalize">
              {paper.source || (isExternal ? "external" : "library")}
            </span>
            {paper.citationCount != null && paper.citationCount > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Quote className="w-3 h-3" />
                {paper.citationCount} citations
              </span>
            )}
          </div>

          <h3 className="font-semibold text-base line-clamp-2">
            <Link
              href={isExternal ? paper.externalUrl ?? "#" : `/dashboard/papers/${paper.paperId}`}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="hover:underline hover:text-purple-600 dark:hover:text-purple-400"
            >
              {paper.title || "Untitled Paper"}
            </Link>
          </h3>

          {paper.reason && isExternal && (
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
              {paper.reason}
            </p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-3">
            {paper.abstract || "No abstract available."}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {published && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {isExternal ? "Published" : "Added"} {published}
              </div>
            )}
            {paper.source && (
              <div className="flex items-center gap-1 capitalize">
                <FileText className="w-3.5 h-3.5" />
                {paper.source}
              </div>
            )}
          </div>

          {isExternal ? (
            <div className="flex gap-2 pt-1">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link
                  href={paper.externalUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <SaveExternalPaperButton item={paper} className="flex-1" />
            </div>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:border-purple-200 dark:group-hover:border-purple-800"
            >
              <Link href={`/dashboard/papers/${paper.paperId}`}>Open</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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