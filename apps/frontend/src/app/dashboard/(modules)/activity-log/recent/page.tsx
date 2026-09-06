"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActivityLogQuery, type ActivityLogEntry, type ActivitySeverity } from "@/redux/api/discussionApi";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Layers,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type FilterTab = "all" | "paper" | "collection" | "workspace";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paper", label: "Papers" },
  { key: "collection", label: "Collections" },
  { key: "workspace", label: "Workspaces" },
];

const ENTITY_ICONS: Record<string, React.ElementType> = {
  paper: FileText,
  collection: BookOpen,
  workspace: Layers,
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function severityBadge(severity: ActivitySeverity) {
  const map: Record<ActivitySeverity, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
    INFO: { variant: "secondary", icon: Info },
    WARNING: { variant: "outline", icon: AlertTriangle },
    ERROR: { variant: "destructive", icon: XCircle },
    CRITICAL: { variant: "destructive", icon: XCircle },
  };
  const { variant, icon: Icon } = map[severity] ?? map.INFO;
  return (
    <Badge variant={variant} className="gap-1 text-[10px]">
      <Icon className="h-3 w-3" />
      {severity}
    </Badge>
  );
}

function ActivityItem({ entry }: { entry: ActivityLogEntry }) {
  const Icon = ENTITY_ICONS[entry.entity.toLowerCase()] ?? FileText;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 py-3 border-b last:border-b-0"
    >
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium capitalize">{entry.action}</span>{" "}
          <span className="text-muted-foreground lowercase">{entry.entity}</span>
          {entry.details && typeof entry.details === "object" && "title" in entry.details && (
            <> — <span className="font-medium">{(entry.details as { title: string }).title}</span></>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo(entry.createdAt)}
          </span>
          {severityBadge(entry.severity)}
        </div>
      </div>
    </motion.div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 py-4 border-b last:border-b-0">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function RecentActivityPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [page, setPage] = useState(0);
  const limit = 15;

  const entity = tab === "all" ? undefined : tab;

  const { data, isLoading, isFetching } = useGetActivityLogQuery(
    { entity, limit, offset: page * limit },
    { refetchOnMountOrArgChange: true }
  );

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const hasNext = (page + 1) * limit < total;
  const hasPrev = page > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12 max-w-3xl"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recent Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Track actions across your research workspace.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(0); }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>{total} entries</span>
            {isFetching && <Skeleton className="h-4 w-4 rounded" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No activity found for this filter.</p>
          ) : (
            <div className="divide-y">
              {entries.map((entry) => (
                <ActivityItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
