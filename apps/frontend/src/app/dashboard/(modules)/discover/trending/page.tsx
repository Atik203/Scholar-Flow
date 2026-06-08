"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetTrendingQuery } from "@/redux/api/searchApi";
import { FileText, TrendingUp, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function TrendingPage() {
  const { data, isLoading } = useGetTrendingQuery();

  const trendingPapers = data?.data || [];

  return (
    <PageContainer>
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Trending Papers</h1>
        <p className="text-muted-foreground">The most popular research across ScholarFlow right now.</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : trendingPapers.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-lg">
          <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">It's quiet. Check back later to see what the community is reading.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl pt-4">
          {trendingPapers.map((paper, idx) => (
            <Card key={paper.id} className="group hover:-translate-y-1 transition-all border-orange-500/10 hover:border-orange-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-5">
                <span className="text-6xl font-black absolute -top-4 -right-2 text-orange-900 dark:text-orange-100">
                  {idx + 1}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2">
                       <Link href={`/dashboard/papers/${paper.id}`} className="hover:underline hover:text-orange-600 dark:hover:text-orange-500">
                          {paper.title || "Untitled Paper"}
                       </Link>
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {paper.abstract || "No abstract available for this trending paper."}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                      {paper.createdAt && (
                         <div className="flex items-center gap-1">
                           <BookOpen className="w-3.5 h-3.5" />
                           Added {formatDistanceToNow(new Date(paper.createdAt), { addSuffix: true })}
                         </div>
                      )}
                      
                      {paper.source && (
                        <div className="flex items-center gap-1 capitalize">
                          <FileText className="w-3.5 h-3.5" />
                          Source: {paper.source}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="shrink-0 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:border-orange-200 dark:group-hover:border-orange-800" asChild>
                    <Link href={`/dashboard/papers/${paper.id}`}>Read Full</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
