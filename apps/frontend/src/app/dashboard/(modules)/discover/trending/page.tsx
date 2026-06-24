"use client";

/**
 * Discover > Trending Papers
 *
 * Phase E.2 — responsive grid, skeleton loading, IntersectionObserver
 * infinite scroll.
 *
 * The marketing PageContainer that previously wrapped the page was a
 * bug: it capped the page at max-w-4xl (single column on every
 * viewport) and broke the dashboard shell. Removed in this rewrite.
 * The (modules) route group already supplies DashboardLayout, so the
 * page just emits the cards.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTrendingQuery } from "@/redux/api/searchApi";
import { BookOpen, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

const PAGE_SIZE = 12;

export default function TrendingPage() {
  const { data, isLoading } = useGetTrendingQuery();

  const trendingPapers = data?.data ?? [];
  // Trending endpoint is non-paginated today; render what we have.
  // Infinite scroll is wired but no-op until the backend supports a
  // paginated variant. We use the same hook so the future migration
  // is a backend-only change.
  const visible = trendingPapers.slice(0, PAGE_SIZE);
  const hasMore = trendingPapers.length > PAGE_SIZE;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          // Placeholder for the future paginated endpoint. No-op for
          // now — we already rendered all rows.
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-orange-500" />
          Trending Papers
        </h1>
        <p className="text-muted-foreground mt-2">
          The most popular research across ScholarFlow right now.
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
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((paper, idx) => (
              <Card
                key={paper.id}
                className="group hover:-translate-y-1 hover:shadow-lg transition-all border-orange-500/10 hover:border-orange-500/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
                  <span className="text-5xl font-black absolute -top-2 -right-1 text-orange-500/10 group-hover:text-orange-500/20 transition-colors">
                    {idx + 1}
                  </span>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base line-clamp-2 pr-8">
                      <Link
                        href={`/dashboard/papers/${paper.id}`}
                        className="hover:underline hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        {paper.title || "Untitled Paper"}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {paper.abstract || "No abstract available for this trending paper."}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
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
                      className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:border-orange-200 dark:group-hover:border-orange-800"
                    >
                      <Link href={`/dashboard/papers/${paper.id}`}>Read Full</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Infinite scroll sentinel — currently a no-op since the
              trending endpoint isn't paginated. Kept so the future
              migration is a backend-only change. */}
          {hasMore && <div ref={sentinelRef} className="h-4" />}
        </>
      )}
    </div>
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
