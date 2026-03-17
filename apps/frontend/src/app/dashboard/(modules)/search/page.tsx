"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalSearchQuery } from "@/redux/api/searchApi";
import { FileText, Folder, LayoutGrid, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, SyntheticEvent } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "papers" | "collections" | "workspaces">("all");

  const { data, isLoading, isFetching } = useGlobalSearchQuery(
    { q: initialQuery, type: activeTab },
    { skip: !initialQuery || initialQuery.length < 2 }
  );

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const results = data?.data;

  return (
    <PageContainer>
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Search & Discovery</h1>
        <p className="text-muted-foreground">Search across papers, collections, and workspaces.</p>
      </div>
      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for papers, collections, or workspaces..."
              className="pl-10 pr-24 h-12 text-lg rounded-full shadow-sm"
              autoFocus
            />
            <Button
              type="submit"
              className="absolute right-1 h-10 rounded-full"
              disabled={!searchInput.trim()}
            >
              Search
            </Button>
          </div>
        </form>

        {initialQuery && (
          <div className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="mt-8"
            >
              <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="papers">Papers</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              </TabsList>
            </Tabs>

            {(isLoading || isFetching) ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !results ? (
              <div className="text-center py-20 text-muted-foreground">
                No results found for "{initialQuery}".
              </div>
            ) : (
              <div className="space-y-8">
                {/* Papers Results */}
                {(activeTab === "all" || activeTab === "papers") && results.papers && results.papers.total > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Papers ({results.papers.total})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.papers.items.map((paper) => (
                        <Card key={paper.id} className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <Link href={`/dashboard/papers/${paper.id}`} className="space-y-2 block">
                              <h4 className="font-medium line-clamp-2">{paper.title}</h4>
                              {paper.source && <p className="text-xs text-muted-foreground capitalize">Source: {paper.source}</p>}
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collections Results */}
                {(activeTab === "all" || activeTab === "collections") && results.collections && results.collections.total > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Folder className="w-5 h-5 text-amber-500" />
                      Collections ({results.collections.total})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.collections.items.map((collection) => (
                        <Card key={collection.id} className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <Link href={`/dashboard/collections/${collection.id}`} className="space-y-2 block">
                              <h4 className="font-medium">{collection.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{collection.description || "No description"}</p>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workspaces Results */}
                {(activeTab === "all" || activeTab === "workspaces") && results.workspaces && results.workspaces.total > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-purple-500" />
                      Workspaces ({results.workspaces.total})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.workspaces.items.map((ws) => (
                        <Card key={ws.id} className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <Link href={`/dashboard/workspaces/${ws.id}`} className="space-y-2 block">
                              <h4 className="font-medium">{ws.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{ws.description || "No description"}</p>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State when no results in ALL categories */}
                {results && (
                  ((activeTab === "all" && !results.papers?.total && !results.collections?.total && !results.workspaces?.total) ||
                   (activeTab === "papers" && !results.papers?.total) ||
                   (activeTab === "collections" && !results.collections?.total) ||
                   (activeTab === "workspaces" && !results.workspaces?.total))
                ) && (
                  <div className="text-center py-20 bg-muted/20 border border-dashed rounded-lg">
                    <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No matches found for "{initialQuery}" in this category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!initialQuery && (
          <div className="mt-16 text-center space-y-8">
             <div className="inline-block p-6 bg-muted/30 rounded-full">
               <Search className="w-12 h-12 text-muted-foreground/40" />
             </div>
             <div className="space-y-2">
               <h2 className="text-xl font-medium tracking-tight">Start Searching</h2>
               <p className="text-muted-foreground max-w-sm mx-auto">
                 Find papers, collections, and workspaces across your ScholarFlow organization instantly.
               </p>
             </div>
             
             <div className="flex gap-4 justify-center">
               <Button variant="outline" asChild>
                 <Link href="/dashboard/discover">Discover Papers</Link>
               </Button>
               <Button variant="outline" asChild>
                 <Link href="/dashboard/search/history">Search History</Link>
               </Button>
             </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
