"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListMyDiscussionsQuery } from "@/redux/api/discussionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { useGetUserAnnotationsQuery } from "@/redux/api/annotationApi";
import { useAuth } from "@/redux/auth/useAuth";
import {
  BookOpen,
  Clock,
  FileText,
  Layers,
  MessageSquare,
  Pencil,
  Plus,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { label: "Upload Paper", icon: Upload, href: "/dashboard/papers/upload", color: "bg-blue-500" },
  { label: "New Collection", icon: Plus, href: "/dashboard/collections/create", color: "bg-green-500" },
  { label: "New Workspace", icon: Layers, href: "/dashboard/workspaces/create", color: "bg-purple-500" },
  { label: "Start Discussion", icon: MessageSquare, href: "/dashboard/discussions/new", color: "bg-orange-500" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-8 w-14" />
    </div>
  );
}

function WeeklyChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="w-full bg-primary/60 rounded-t-md min-h-[4px]"
          />
          <span className="text-[10px] text-muted-foreground">{WEEKDAYS[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function EnhancedDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Researcher";

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({ limit: 10 });
  const { data: collectionsData, isLoading: collectionsLoading } = useGetMyCollectionsQuery({ limit: 5, page: 1 });
  const { data: workspacesData, isLoading: workspacesLoading } = useListWorkspacesQuery({ limit: 20 });
  const { data: discussionsData } = useListMyDiscussionsQuery({ limit: 20 });
  const { data: annotationsData } = useGetUserAnnotationsQuery({ page: 1, limit: 1000 });

  const totalPapers = papersData?.items?.length ?? 0;
  const totalCollections = collectionsData?.meta?.total ?? 0;
  const totalWorkspaces = workspacesData?.data?.length ?? 0;
  const totalDiscussions = discussionsData?.data?.total ?? 0;
  const totalAnnotations = annotationsData?.data?.length ?? 0;
  const recentPapers = papersData?.items ?? [];

  const weeklyData = [3, 7, 4, 9, 5, 2, 6];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
          <p className="text-sm text-muted-foreground mt-1">Your research at a glance.</p>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {papersLoading ? <StatCardSkeleton /> : <StatCard label="Papers Uploaded" value={totalPapers} icon={FileText} color="text-blue-600" />}
        {collectionsLoading ? <StatCardSkeleton /> : <StatCard label="Collections" value={totalCollections} icon={BookOpen} color="text-orange-600" />}
        {workspacesLoading ? <StatCardSkeleton /> : <StatCard label="Workspaces" value={totalWorkspaces} icon={Layers} color="text-purple-600" />}
        <StatCard label="Annotations" value={totalAnnotations} icon={Pencil} color="text-emerald-600" />
        <StatCard label="Discussions" value={totalDiscussions} icon={MessageSquare} color="text-rose-600" />
        <StatCard label="Reading Time" value={12} icon={Clock} color="text-amber-600" />
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top-Left: Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1.5 group hover:border-primary/50">
                  <div className={`h-9 w-9 rounded-lg ${action.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Top-Right: Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" /> Weekly Activity
            </CardTitle>
            <CardDescription>Papers uploaded this week</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <WeeklyChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Bottom-Left: Recent Papers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Recent Papers
              </CardTitle>
              <CardDescription>Your latest uploads</CardDescription>
            </div>
            <Link href="/dashboard/papers" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentPapers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No papers yet.</p>
            ) : (
              <div className="space-y-2">
                {recentPapers.slice(0, 5).map((paper) => (
                  <Link key={paper.id} href={`/dashboard/papers/${paper.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{paper.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {paper.metadata?.authors?.slice(0, 2).join(", ") || "Unknown"} {paper.metadata?.year && `· ${paper.metadata.year}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom-Right: Top Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Top Collaborators
            </CardTitle>
            <CardDescription>People you work with most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Dr. Sarah Chen", papers: 12, role: "Co-author" },
                { name: "Prof. James Liu", papers: 8, role: "Reviewer" },
                { name: "Maria Garcia", papers: 5, role: "Co-author" },
              ].map((collab) => (
                <div key={collab.name} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {collab.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{collab.name}</p>
                    <p className="text-xs text-muted-foreground">{collab.role} · {collab.papers} papers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
