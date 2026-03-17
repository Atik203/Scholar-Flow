"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetRecommendationsQuery } from "@/redux/api/searchApi";
import { FileText, Sparkles, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function RecommendationsPage() {
  const { data, isLoading } = useGetRecommendationsQuery();

  const recommendPapers = data?.data || [];

  return (
    <PageContainer>
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">For You</h1>
        <p className="text-muted-foreground">Personalized AI recommendations based on your activity and shared workspaces.</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : recommendPapers.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-lg">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Not enough data to generate recommendations. Start uploading papers or joining workspaces to train your feed.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl pt-4">
          {recommendPapers.map((paper) => (
            <Card key={paper.id} className="group hover:-translate-y-1 transition-all border-purple-500/10 hover:border-purple-500/40 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2">
                       <Link href={`/dashboard/papers/${paper.id}`} className="hover:underline hover:text-purple-600 dark:hover:text-purple-500">
                          {paper.title || "Untitled Paper"}
                       </Link>
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {paper.abstract || "No abstract available for this recommended paper."}
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
                  
                  <Button variant="outline" className="shrink-0 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:border-purple-200 dark:group-hover:border-purple-800" asChild>
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
