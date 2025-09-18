"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useSearchCollectionsQuery } from "@/redux/api/collectionApi";
import {
  BookOpen,
  Search,
  Globe,
  Lock,
  Calendar,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SearchCollectionsPage() {
  const isProtected = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  // Search collections when query is submitted
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchCollectionsQuery(
    { q: query, page: 1, limit: 50 },
    { skip: !query.trim() }
  );

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  const collections = searchData?.result || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setQuery(searchTerm.trim());
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Search Collections
            </h1>
            <p className="text-muted-foreground">
              Find collections by name, description, or content
            </p>
          </div>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!searchTerm.trim()}>
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {query && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Search Results for "{query}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Searching collections...</span>
                </div>
              ) : searchError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">Error searching collections</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No collections found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try different search terms or create a new collection
                  </p>
                  <Button asChild>
                    <Link href="/collections/create">
                      Create Collection
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <Card key={collection.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">{collection.name}</CardTitle>
                          </div>
                          <Badge variant={collection.isPublic ? "default" : "secondary"}>
                            {collection.isPublic ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                              </>
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {collection.description || "No description provided"}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {collection._count?.papers || 0} papers
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(collection.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          By: {collection.owner.name}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link href={`/collections/${collection.id}`}>
                              View Collection
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Tips */}
        {!query && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Search by:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Collection name</li>
                    <li>• Description content</li>
                    <li>• Research topics</li>
                    <li>• Author names</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Examples:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "machine learning"</li>
                    <li>• "computer vision"</li>
                    <li>• "natural language processing"</li>
                    <li>• "deep learning"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
