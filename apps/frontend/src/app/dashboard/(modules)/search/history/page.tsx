"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSearchHistoryQuery } from "@/redux/api/searchApi";
import { Clock, ExternalLink, Search as SearchIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function SearchHistoryPage() {
  const { data, isLoading } = useGetSearchHistoryQuery({ page: 1, limit: 30 });

  const historyEntries = data?.data || [];

  return (
    <PageContainer>
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Search History</h1>
        <p className="text-muted-foreground">View your past search queries across the platform.</p>
      </div>
      <div className="flex justify-start mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/dashboard/search">
            <ChevronLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Clock className="w-8 h-8 animate-pulse text-muted-foreground/30" />
        </div>
      ) : historyEntries.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-lg bg-muted/10">
          <SearchIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No search history</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your recent search operations will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl">
          {historyEntries.map((item) => (
            <Card key={item.id} className="group hover:border-primary/40 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 truncate">
                  <div className="p-2 bg-muted/50 rounded flex-shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium truncate pr-4">{item.query}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                      {item.filters?.type && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span className="capitalize">Type: {item.filters.type}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="secondary" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/search?q=${encodeURIComponent(item.query)}`}>
                    Research
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
