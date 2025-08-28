"use client";

import { FloatingInput, ScholarForm, SelectField } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function CollectionsCreatePage() {
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
            <Plus className="h-8 w-8" />
            Create Collection
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Organize your research papers into collections
          </p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Create New Collection
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Use our Phase 2 enhanced form components to create your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <ScholarForm.Root
                onSubmit={(data) => console.log("Collection data:", data)}
              >
                <div className="space-y-6">
                  <div>
                    <ScholarForm.Label htmlFor="name" required>
                      Collection Name
                    </ScholarForm.Label>
                    <FloatingInput
                      id="name"
                      label="Collection Name"
                      placeholder="Enter collection name"
                      required
                      helperText="Choose a descriptive name for your collection"
                    />
                  </div>

                  <div>
                    <ScholarForm.Label htmlFor="description">
                      Description
                    </ScholarForm.Label>
                    <FloatingInput
                      id="description"
                      label="Description"
                      placeholder="Describe what this collection is about"
                      helperText="Optional: Add a description to help organize your research"
                    />
                  </div>

                  <div>
                    <ScholarForm.Label htmlFor="category">
                      Category
                    </ScholarForm.Label>
                    <SelectField
                      options={[
                        { value: "research", label: "Research Papers" },
                        { value: "review", label: "Literature Review" },
                        { value: "project", label: "Project Related" },
                        { value: "personal", label: "Personal Interest" },
                        { value: "other", label: "Other" },
                      ]}
                      placeholder="Select a category"
                      searchable
                      helperText="Choose a category that best describes your collection"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Collection
                    </Button>
                  </div>
                </div>
              </ScholarForm.Root>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
