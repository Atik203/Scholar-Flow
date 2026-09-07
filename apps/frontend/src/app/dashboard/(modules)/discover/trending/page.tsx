"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveExternalPaperButton } from "@/components/papers/SaveExternalPaperButton";
import { useGetTrendingQuery } from "@/redux/api/searchApi";
import type { DiscoveryItem } from "@/redux/api/searchApi";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Quote,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 12;

export default function TrendingPage() {
  const { data, isLoading } = useGetTrendingQuery();

  const trendingPapers = data?.data ?? [];
  const visible = trendingPapers.slice(0, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-orange-500" />
          Trending Papers
        </h1>
        <p className="text-muted-foreground mt-2">
          Live from the research world — highly cited recent works, plus what
          your team is reading.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      ) : trendingPapers.length === 0 ? (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <TrendingUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">
            It&apos;s quiet. Check back later to see what the community is reading.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((paper, idx) => (
            <TrendingCard key={paper.id} paper={paper} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrendingCard({ paper, rank }: { paper: DiscoveryItem; rank: number }) {
  const isExternal = paper.kind === "external";
  const published = paper.publishedAt
    ? formatDistanceToNow(new Date(paper.publishedAt), { addSuffix: true })
    : null;

  return (
    <Card className="group hover:-translate-y-1 hover:shadow-lg transition-all border-orange-500/10 hover:border-orange-500/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
        <span className="text-5xl font-black absolute -top-2 -right-1 text-orange-500/10 group-hover:text-orange-500/20 transition-colors">
          {rank}
        </span>
      </div>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 pr-8">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 capitalize">
              {paper.source || (isExternal ? "external" : "library")}
            </span>
            {paper.citationCount != null && paper.citationCount > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Quote className="w-3 h-3" />
                {paper.citationCount} citations
              </span>
            )}
          </div>

          <h3 className="font-semibold text-base line-clamp-2 pr-8">
            <Link
              href={isExternal ? paper.externalUrl ?? "#" : `/dashboard/papers/${paper.paperId}`}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="hover:underline hover:text-orange-600 dark:hover:text-orange-400"
            >
              {paper.title || "Untitled Paper"}
            </Link>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {paper.abstract ||
              "No abstract available for this trending paper."}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
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
              className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:border-orange-200 dark:group-hover:border-orange-800"
            >
              <Link href={`/dashboard/papers/${paper.paperId}`}>Read Full</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingCardSkeleton() {
  return (
    <Card className="border-orange-500/10">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}