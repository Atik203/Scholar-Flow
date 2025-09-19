"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListWorkspacesQuery,
  type Workspace,
} from "@/redux/api/workspaceApi";
import { BookOpen, Building2, FileText, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SharedWorkspacesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: workspacesData,
    isLoading,
    error,
  } = useListWorkspacesQuery({
    page: 1,
    limit: 20,
    scope: "shared",
  });

  const filteredWorkspaces = workspacesData?.data?.filter(
    (workspace: Workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Shared Workspaces
              </h1>
              <p className="text-muted-foreground">
                Workspaces shared with you by other users
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Failed to load workspaces
            </h2>
            <p className="text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Workspaces
            </h1>
            <p className="text-muted-foreground">
              Workspaces shared with you by other users
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search shared workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Workspaces Grid */}
        {filteredWorkspaces?.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                No shared workspaces
              </h2>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No workspaces match your search"
                  : "You don't have any shared workspaces yet"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces?.map((workspace) => (
              <Card
                key={workspace.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {workspace.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Shared by other users
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      Shared
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{workspace.memberCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{workspace.collectionCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{workspace.paperCount}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/workspaces/${workspace.id}`}>
                        View Workspace
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
