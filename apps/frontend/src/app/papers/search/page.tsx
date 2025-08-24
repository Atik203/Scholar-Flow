"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, FileSearch, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function PapersSearchPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Search className="h-8 w-8" />
            Search Papers
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find and explore research papers in your library
          </p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Paper Search</CardTitle>
            <CardDescription className="dark:text-gray-400">
              This feature is coming soon in Phase 1 of ScholarFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Advanced Search Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We're building powerful search capabilities to help you find
                exactly what you're looking for in your research library.
              </p>
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Planned Features:
                  </h4>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Full-text search across all papers</li>
                    <li>• Filter by author, date, keywords</li>
                    <li>• Semantic search using AI</li>
                    <li>• Advanced query builders</li>
                  </ul>
                </div>
                <Button asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
