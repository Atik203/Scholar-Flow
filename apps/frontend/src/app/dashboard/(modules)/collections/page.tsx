"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { resolveRoleScopedHref } from "@/lib/auth/roles";
import {
  useGetCollectionStatsQuery,
  useGetMyCollectionsQuery,
} from "@/redux/api/collectionApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import {
  BookOpen,
  Building2,
  Calendar,
  Edit,
  Eye,
  FileText,
  Globe,
  Loader2,
  Lock,
  Plus,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function CollectionsPage() {
  const { user, isAuthenticated } = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("all");

  const scopedHref = useCallback(
    (href: string) => resolveRoleScopedHref(user?.role, href),
    [user?.role]
  );

  // Fetch workspaces for selection
  const { data: workspacesData } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });

  const {
    data: collectionsData,
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useGetMyCollectionsQuery({
    page: 1,
    limit: 50,
    workspaceId:
      selectedWorkspaceId === "all" ? undefined : selectedWorkspaceId,
  });

  const { data: statsData, isLoading: statsLoading } =
    useGetCollectionStatsQuery();

  // Auto-select first workspace if only one available
  useEffect(() => {
    const workspaces = workspacesData?.data || [];
    if (
      workspaces.length === 1 &&
      (selectedWorkspaceId === "all" || !selectedWorkspaceId)
    ) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspacesData, selectedWorkspaceId]);

  if (!isAuthenticated) return null;

  const collections = collectionsData?.result || [];
  const stats = statsData || {};

  const filteredCollections = collections.filter(
    (collection: any) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organize and share your research papers
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link
                href={
                  selectedWorkspaceId && selectedWorkspaceId !== "all"
                    ? scopedHref(
                        `/dashboard/collections/create?workspaceId=${selectedWorkspaceId}`
                      )
                    : scopedHref("/dashboard/collections/create")
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Link>
            </Button>
          </div>
        </div>

        {/* Workspace Selection */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <label htmlFor="workspace-select" className="text-sm font-medium">
              Workspace:
            </label>
          </div>
          <Select
            value={selectedWorkspaceId}
            onValueChange={setSelectedWorkspaceId}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workspaces</SelectItem>
              {workspacesData?.data?.length ? (
                workspacesData.data.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))
              ) : workspacesData ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No workspaces available
                </div>
              ) : (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  Loading workspaces...
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    My Collections
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      collections.length
                    )}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950/20">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Public Collections
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      collections.filter((c: any) => c.isPublic).length
                    )}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-950/20">
                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Papers
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      collections.reduce(
                        (total: number, c: any) =>
                          total + (c._count?.papers || 0),
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-950/20">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Private Collections
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      collections.filter((c: any) => !c.isPublic).length
                    )}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-orange-50 dark:bg-orange-950/20">
                  <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-collections" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="my-collections">
                <BookOpen className="mr-2 h-4 w-4" />
                My Collections
              </TabsTrigger>
              <TabsTrigger value="shared-collections">
                <Users className="mr-2 h-4 w-4" />
                Shared Collections
              </TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <TabsContent value="my-collections">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">My Collections</CardTitle>
              </CardHeader>
              <CardContent>
                {collectionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      Loading collections...
                    </span>
                  </div>
                ) : collectionsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-4">
                      Failed to load collections
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : filteredCollections.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchTerm
                        ? "No collections found"
                        : "No collections yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Create your first collection to get started"}
                    </p>
                    {!searchTerm && (
                      <Button asChild>
                        <Link
                          href={scopedHref("/dashboard/collections/create")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Collection
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCollections.map((collection: any) => (
                      <div
                        key={collection.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium text-lg">
                                {collection.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {collection.description ||
                                  "No description provided"}
                              </p>
                              <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {collection._count?.papers || 0} papers
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Created{" "}
                                  {new Date(
                                    collection.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <Badge
                                  variant={
                                    collection.isPublic
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {collection.isPublic ? (
                                    <>
                                      <Globe className="h-3 w-3 mr-1" /> Public
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="h-3 w-3 mr-1" /> Private
                                    </>
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild size="sm">
                              <Link
                                href={`/dashboard/collections/${collection.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link
                                href={`/dashboard/collections/${collection.id}/edit`}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared-collections">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Shared Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Shared Collections
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    View collections shared with you by other users
                  </p>
                  <Button asChild>
                    <Link href={scopedHref("/dashboard/collections/shared")}>
                      <Users className="mr-2 h-4 w-4" />
                      View Shared Collections
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
