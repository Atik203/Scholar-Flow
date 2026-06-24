"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Compass, Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" />
          Discover
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore new research and trending topics.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Search Call to Action */}
        <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Global Search
            </CardTitle>
            <CardDescription className="text-base text-foreground/80 mt-2">
              Quickly find papers, collections, workspaces, notes, and people
              across the entire ScholarFlow platform using our advanced
              full-text + AI search engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" asChild className="mt-2 shadow-md">
              <Link href="/dashboard/search">Start Searching</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trending Papers */}
        <Card className="group hover:-translate-y-1 transition-all hover:shadow-md border-muted/60">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle>Trending Research</CardTitle>
            <CardDescription className="line-clamp-2">
              Discover the most discussed and heavily cited papers hitting
              the platform this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full"
              asChild
            >
              <Link href="/dashboard/discover/trending">View Trending</Link>
            </Button>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="group hover:-translate-y-1 transition-all hover:shadow-md border-muted/60">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/40 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>For You</CardTitle>
            <CardDescription className="line-clamp-2">
              Personalized AI-powered recommendations based on your shared
              workspaces and reading history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full"
              asChild
            >
              <Link href="/dashboard/discover/recommendations">
                See Recommendations
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Browse Collections (placeholder) */}
        <Card className="group hover:-translate-y-1 transition-all hover:shadow-md border-muted/60">
          <CardHeader>
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950/40 rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle>Browse Collections</CardTitle>
            <CardDescription className="line-clamp-2">
              Explore public collections curated by community experts in
              various fields of study.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full"
              disabled
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
