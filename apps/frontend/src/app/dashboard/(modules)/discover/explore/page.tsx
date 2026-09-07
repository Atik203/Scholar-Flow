"use client";

/**
 * Discover > Explore — browse live research by arXiv category.
 * External data only: nothing here touches the user's library.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveExternalPaperButton } from "@/components/papers/SaveExternalPaperButton";
import {
  EXPLORE_CATEGORIES,
  useGetExploreQuery,
} from "@/redux/api/searchApi";
import type { DiscoveryItem } from "@/redux/api/searchApi";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Quote,
} from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const [category, setCategory] = useState("cs.AI");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetExploreQuery({
    category,
    page,
    limit: PAGE_SIZE,
  });

  const items = data?.data ?? [];
  const lastPage = isError || items.length < PAGE_SIZE;

  const selectCategory = (next: string) => {
    if (next === category) return;
    setCategory(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Compass className="h-8 w-8 text-teal-500" />
          Explore
        </h1>
        <p className="text-muted-foreground mt-2">
          Live research from arXiv — pick a field to browse the latest
          submissions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(EXPLORE_CATEGORIES).map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={category === value ? "default" : "outline"}
            onClick={() => selectCategory(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExploreCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <Compass className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">
            Could not reach the live feed right now — try again later.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <Compass className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">Nothing published here yet.</p>
        </div>
      ) : (
        <div
          className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {items.map((item) => (
            <ExploreCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page}
            {data?.meta?.totalPage ? ` of ${data.meta.totalPage}` : ""}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={lastPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ExploreCard({ item }: { item: DiscoveryItem }) {
  const published = item.publishedAt
    ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })
    : null;

  return (
    <Card className="group hover:-translate-y-1 hover:shadow-lg transition-all border-teal-500/10 hover:border-teal-500/40">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 capitalize">
              {item.source ?? "external"}
            </span>
            {item.citationCount != null && item.citationCount > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Quote className="w-3 h-3" />
                {item.citationCount} citations
              </span>
            )}
          </div>

          <h3 className="font-semibold text-base leading-snug">
            <Link
              href={item.externalUrl ?? "#"}
              target={item.externalUrl ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="hover:underline hover:text-teal-600 dark:hover:text-teal-400"
            >
              {item.title}
            </Link>
          </h3>

          {item.abstract && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.abstract}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
            {published && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {published}
              </span>
            )}
            {item.authors && item.authors.length > 0 && (
              <span className="truncate max-w-[60%]">
                {item.authors.slice(0, 3).join(", ")}
                {item.authors.length > 3 ? " et al." : ""}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link
                href={item.externalUrl ?? "#"}
                target={item.externalUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                Open
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <SaveExternalPaperButton item={item} className="flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExploreCardSkeleton() {
  return (
    <Card className="border-teal-500/10">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}