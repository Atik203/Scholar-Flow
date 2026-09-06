"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import Link from "next/link";

import { RESEARCHER_PAGES } from "./pages.data";

export default function ResearcherPagesIndex() {
  const { isAuthenticated } = useProtectedRoute();

  if (!isAuthenticated) {
    return null;
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Researcher Pages
          </h1>
          <p className="text-muted-foreground mt-2">
            Curated workspaces and tools mapped specifically for researcher
            productivity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {RESEARCHER_PAGES.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {page.title}
                  </CardTitle>
                  <Badge variant="outline">{page.status}</Badge>
                </div>
                <CardDescription>{page.summary}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Last updated {page.updatedAt}
                </p>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/pages/${page.id}`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
