"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Calendar, Eye, FileText, Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

export default function SearchPapersPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: papersData, isLoading } = useListPapersQuery({ limit: 100 });

  const papers = papersData?.items || [];

  const results = useMemo(() => {
    if (!activeQuery) return [];
    const q = activeQuery.toLowerCase();
    return papers
      .filter((p) => {
        const matches = p.title.toLowerCase().includes(q) ||
          (p.abstract || "").toLowerCase().includes(q) ||
          (p.metadata?.authors || []).some((a: string) => a.toLowerCase().includes(q)) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesStatus = statusFilter === "all" || p.processingStatus === statusFilter;
        return matches && matchesStatus;
      })
      .map((p) => ({
        ...p,
        relevanceScore: Math.min(100, Math.floor(
          ((p.title.toLowerCase().includes(q) ? 50 : 0) + ((p.abstract || "").toLowerCase().includes(q) ? 30 : 0) +
            ((p.tags || []).some((t) => t.toLowerCase().includes(q)) ? 20 : 0))
        )),
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }, [activeQuery, papers, statusFilter]);

  const handleSearch = () => { if (query.trim()) setActiveQuery(query.trim()); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Papers</h1>
          <p className="text-muted-foreground">Search your research library by title, author, tags, or abstract</p>
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
          <div className="flex items-center gap-2 mt-3">
            {["all", "PROCESSED", "PROCESSING", "UPLOADED", "FAILED"].map((s) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className="cursor-pointer" onClick={() => setStatusFilter(s)}>
                {s === "all" ? "All Status" : s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {activeQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{results.length} results for &ldquo;{activeQuery}&rdquo;</p>
          {results.length === 0 ? (
            <div className="text-center py-12"><Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No papers match your search</p></div>
          ) : (
            <div className="space-y-3">
              {results.map((paper) => (
                <motion.div key={paper.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/dashboard/papers/${paper.id}`} className="font-medium hover:text-primary transition-colors">{paper.title}</Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{paper.abstract || "No abstract"}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {(paper.metadata?.authors || []).length > 0 && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{(paper.metadata.authors as string[]).slice(0, 3).join(", ")}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(paper.createdAt).toLocaleDateString()}</span>
                        {paper.citationCount ? <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{paper.citationCount.toLocaleString()}</span> : null}
                      </div>
                      {(paper.tags || []).length > 0 && <div className="flex flex-wrap gap-1 mt-2">{(paper.tags || []).map((t) => (<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge variant="secondary" className="text-xs">{paper.relevanceScore}% match</Badge>
                      <Button size="sm" variant="outline" asChild><Link href={`/dashboard/papers/${paper.id}`}><Eye className="mr-1 h-3 w-3" />View</Link></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
