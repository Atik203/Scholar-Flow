"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PapersList } from "@/components/papers/PapersList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useListPapersQuery } from "@/redux/api/paperApi";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Filter,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PapersPage() {
  const isProtected = useProtectedRoute();
  const [searchTerm, setSearchTerm] = useState("");

  // Get papers for stats
  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    page: 1,
    limit: 100, // Get more papers for stats
  });

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  // Calculate stats
  const totalPapers = papersData?.meta?.total || 0;
  const processedPapers =
    papersData?.items?.filter((p) => p.processingStatus === "PROCESSED")
      .length || 0;
  const processingPapers =
    papersData?.items?.filter((p) => p.processingStatus === "PROCESSING")
      .length || 0;
  const totalSize =
    papersData?.items?.reduce(
      (acc, paper) => acc + (paper.file?.sizeBytes || 0),
      0
    ) || 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Research Papers
            </h1>
            <p className="text-muted-foreground">
              Manage, organize, and explore your research collection
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/papers/search">
                <Search className="mr-2 h-4 w-4" />
                Advanced Search
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/papers/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Paper
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Papers
                  </p>
                  <p className="text-2xl font-bold">{totalPapers}</p>
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
                    Processed
                  </p>
                  <p className="text-2xl font-bold">{processedPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-950/20">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Processing
                  </p>
                  <p className="text-2xl font-bold">{processingPapers}</p>
                </div>
                <div className="rounded-full p-2 bg-yellow-50 dark:bg-yellow-950/20">
                  <Upload className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Storage
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(totalSize / (1024 * 1024))}MB
                  </p>
                </div>
                <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-950/20">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Upload New Paper
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                Add research papers to your workspace with automatic processing
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard/papers/upload">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  Advanced Search
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                Find papers with powerful filters and AI-powered search
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/papers/search">Search Papers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Collections
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                Organize papers into collections for better management
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/collections">Manage Collections</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Papers Library</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search papers by title, author, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Separator className="mb-6" />
            <div id="papers-list">
              <PapersList searchTerm={searchTerm} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
