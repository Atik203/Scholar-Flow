"use client";

import { SearchInput } from "@/components/ui";
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
              Search through your research papers using our Phase 2 enhanced
              search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Phase 2 Search Input */}
              <div className="max-w-2xl mx-auto">
                <SearchInput
                  placeholder="Search papers by title, author, keywords, or content..."
                  onSearch={(query) => console.log("Search query:", query)}
                  showClearButton
                  className="w-full"
                />
              </div>

              <div className="text-center py-8">
                <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Enhanced Search with Phase 2 Components
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Experience our new Phase 2 search capabilities with enhanced
                  UI components.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                      Phase 2 Features Now Available:
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Enhanced search input with clear button</li>
                      <li>• Improved UI components and animations</li>
                      <li>• Better accessibility and user experience</li>
                      <li>• Consistent design system integration</li>
                    </ul>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
