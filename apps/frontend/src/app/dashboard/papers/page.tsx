"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PapersList } from "@/components/papers/PapersList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { FileText, Plus, Upload } from "lucide-react";
import Link from "next/link";

export default function PapersPage() {
  const isProtected = useProtectedRoute();

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Papers</h1>
            <p className="text-muted-foreground">
              Manage your research papers and collections
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard/papers/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Paper
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upload New Paper
              </CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/papers/upload">
                <div className="text-2xl font-bold text-blue-600">+</div>
                <p className="text-xs text-muted-foreground">
                  Add research papers to your workspace
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Browse Papers
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href="#papers-list">
                <div className="text-2xl font-bold text-green-600">📚</div>
                <p className="text-xs text-muted-foreground">
                  View and manage uploaded papers
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">📁</div>
              <p className="text-xs text-muted-foreground">
                Organize papers into collections (Coming Soon)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Papers List */}
        <div id="papers-list">
          <PapersList />
        </div>
      </div>
    </DashboardLayout>
  );
}
