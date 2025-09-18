"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useGetCollectionQuery, useGetCollectionPapersQuery } from "@/redux/api/collectionApi";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Search,
  Globe,
  Lock,
  Calendar,
  FileText,
  User,
  Settings,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const isProtected = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  // Fetch collection data
  const { 
    data: collection, 
    isLoading: collectionLoading, 
    error: collectionError 
  } = useGetCollectionQuery(resolvedParams.id);

  // Fetch collection papers
  const { 
    data: papersData, 
    isLoading: papersLoading, 
    error: papersError 
  } = useGetCollectionPapersQuery({ 
    collectionId: resolvedParams.id, 
    page: 1, 
    limit: 100 
  });

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  if (collectionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading collection...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (collectionError || !collection) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Collection not found</h3>
          <p className="text-muted-foreground mb-4">
            The collection you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const papers = papersData?.result || [];
  const filteredPapers = papers.filter((paper: any) =>
    paper.paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paper.paper.abstract || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paper.paper.metadata?.authors || []).some((author: string) => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">
                {collection.name}
              </h1>
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
            <p className="text-muted-foreground">
              {collection.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Collection Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Papers
                  </p>
                  <p className="text-2xl font-bold">{collection._count?.papers || 0}</p>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950/20">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Owner
                  </p>
                  <p className="text-sm font-medium">{collection.owner.name}</p>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-950/20">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-950/20">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-medium">
                    {collection.isPublic ? "Public" : "Private"}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-orange-50 dark:bg-orange-950/20">
                  {collection.isPublic ? (
                    <Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Papers Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Papers in Collection</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Papers
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search papers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {papersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading papers...</span>
              </div>
            ) : papersError ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Failed to load papers</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No papers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "No papers match your search criteria"
                    : "This collection doesn't have any papers yet"
                  }
                </p>
                {!searchTerm && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Papers
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPapers.map((collectionPaper: any) => {
                  const paper = collectionPaper.paper;
                  return (
                    <Card key={collectionPaper.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-2">{paper.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {paper.abstract || "No abstract available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Authors: {(paper.metadata?.authors || []).join(", ") || "Unknown"}
                              </span>
                              <span>
                                Year: {paper.metadata?.year || "Unknown"}
                              </span>
                              {paper.file && (
                                <span>
                                  Size: {Math.round(paper.file.sizeBytes / (1024 * 1024))}MB
                                </span>
                              )}
                              <span>
                                Added: {new Date(collectionPaper.addedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="outline">
                              {paper.processingStatus}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
