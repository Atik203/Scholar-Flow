"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useGetPublicCollectionsQuery } from "@/redux/api/collectionApi";
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

export default function SharedCollectionsPage() {
  const isProtected = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch public collections
  const { data: collectionsData, isLoading: collectionsLoading, error: collectionsError } = useGetPublicCollectionsQuery({
    page: 1,
    limit: 100,
  });

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  const collections = collectionsData?.result || [];

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Collections
            </h1>
            <p className="text-muted-foreground">
              Discover collections shared by other researchers
            </p>
          </div>
        </div>

        {/* Collections List */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Public Collections</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {collectionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading collections...</span>
              </div>
            ) : collectionsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Error loading collections</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm ? "No collections found" : "No public collections yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try adjusting your search terms"
                    : "Be the first to share a public collection"
                  }
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/collections/create">
                      Create Collection
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCollections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{collection.name}</CardTitle>
                        </div>
                        <Badge variant="default">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
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
      </div>
    </DashboardLayout>
  );
}
