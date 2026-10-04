"use client";

/**
 * SemanticMatches — AI "meaning search" block.
 *
 * Calls the pgvector-backed /search/semantic endpoint (query embedding →
 * cosine distance over PaperChunk). Renders the best-matching chunk per
 * paper so users can find papers by meaning, not exact words.
 * Renders nothing when the query is empty, the backend degrades
 * (fallback), or no matches exist.
 */

import { FileText, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSemanticSearchQuery } from "@/redux/api/searchApi";

export function SemanticMatches({
  query,
  limit = 6,
  className = "",
}: {
  query: string;
  limit?: number;
  className?: string;
}) {
  const { data, isFetching } = useSemanticSearchQuery(
    { q: query, limit },
    { skip: !query.trim() }
  );

  const matches = data?.results ?? [];

  if (isFetching && matches.length === 0) {
    return (
      <div className={`rounded-xl border bg-card p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Meaning Matches</h2>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <div className="h-16 rounded-lg bg-muted animate-pulse" />
          <div className="h-16 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (data?.fallback || matches.length === 0) {
    return null;
  }

  // Results arrive ordered by distance ascending — keep the best chunk
  // per paper so one paper never fills the whole list.
  const seen = new Set<string>();
  const topMatches = matches.filter((m) => {
    if (seen.has(m.paperId)) return false;
    seen.add(m.paperId);
    return true;
  }).slice(0, 4);

  return (
    <section
      className={`rounded-xl border bg-gradient-to-br from-primary/5 via-card to-card p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Meaning Matches</h2>
        <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          AI vector search
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Found by meaning, not exact words — powered by semantic embeddings.
      </p>
      <ul className="space-y-2">
        {topMatches.map((m) => {
          const similarity = Math.max(0, Math.min(1, 1 - m.distance));
          return (
            <li key={m.id}>
              <Link
                href={`/dashboard/papers/${m.paperId}`}
                className="block rounded-lg border bg-card p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium truncate">
                    <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                    {m.title ?? "Untitled paper"}
                  </p>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {Math.round(similarity * 100)}% match
                    {m.page ? ` · p.${m.page}` : ""}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {m.content}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
