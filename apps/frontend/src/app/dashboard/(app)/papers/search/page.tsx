"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalSearchQuery } from "@/redux/api/searchApi";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Calendar, Eye, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SearchPapersPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGlobalSearchQuery(
    { q: activeQuery, type: "papers", page, limit: 10 },
    { skip: !activeQuery }
  );

  const papers = data?.data?.papers?.items ?? [];
  const total = data?.data?.papers?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const handleSearch = () => {
    if (query.trim()) {
      setActiveQuery(query.trim());
      setPage(1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Papers</h1>
          <p className="text-muted-foreground">Backend search across your papers and shared workspaces</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search papers..." value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="pl-10" />
            </div>
            <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" />Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {activeQuery && (
        <div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Search failed. Please try again.</p>
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No papers match &ldquo;{activeQuery}&rdquo;</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{total} result(s) for &ldquo;{activeQuery}&rdquo;</p>
              <div className="space-y-3">
                {papers.map((paper) => (
                  <motion.div key={paper.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/dashboard/papers/${paper.id}`} className="font-medium hover:text-primary transition-colors">{paper.title}</Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{paper.abstract || paper.excerpt || "No abstract"}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {(() => {
                            const authors = paper.metadata?.authors as
                              | string[]
                              | undefined;
                            const tags = paper.metadata?.tags as
                              | string[]
                              | undefined;
                            return (
                              <>
                                {authors?.length ? (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {authors.slice(0, 3).join(", ")}
                                  </span>
                                ) : null}
                                {paper.createdAt ? (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(paper.createdAt).toLocaleDateString()}
                                  </span>
                                ) : null}
                                {tags?.length ? (
                                  <span className="flex flex-wrap gap-1">
                                    {tags.slice(0, 4).map((t) => (
                                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                    ))}
                                  </span>
                                ) : null}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/papers/${paper.id}`}><Eye className="mr-1 h-3 w-3" />View</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!activeQuery && (
        <div className="text-center py-16">
          <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">Enter a query to search your papers and shared workspaces.</p>
        </div>
      )}
    </div>
  );
}
