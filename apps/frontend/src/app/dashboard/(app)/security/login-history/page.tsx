"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, Globe, Monitor, Smartphone, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetLoginHistoryQuery, type LoginHistoryEntry } from "@/redux/api/loginHistoryApi";

const PROVIDER_LABELS: Record<string, string> = {
  credentials: "Password",
  google: "Google",
  github: "GitHub",
  "magic-link": "Magic Link",
};

const PROVIDER_COLORS: Record<string, string> = {
  credentials: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  google: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  github: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "magic-link": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function DeviceIcon({ device }: { device: string | null }) {
  if (!device || device === "Unknown") return <Globe className="h-4 w-4 text-muted-foreground" />;
  if (device === "Mobile" || device === "Tablet") return <Smartphone className="h-4 w-4 text-muted-foreground" />;
  return <Monitor className="h-4 w-4 text-muted-foreground" />;
}

function LoginRow({ entry }: { entry: LoginHistoryEntry }) {
  const date = new Date(entry.createdAt);
  const timeStr = date.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <DeviceIcon device={entry.device} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`text-[11px] font-medium ${PROVIDER_COLORS[entry.provider] || ""}`}>
              {PROVIDER_LABELS[entry.provider] || entry.provider}
            </Badge>
            {entry.device && entry.device !== "Unknown" && (
              <span className="text-xs text-muted-foreground">{entry.device}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeStr}</span>
            {entry.ip && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span>{entry.ip}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

export default function LoginHistoryPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, error } = useGetLoginHistoryQuery({
    limit: 20,
    cursor,
  });

  const items = data?.data?.items ?? [];
  const nextCursor = data?.data?.cursor ?? null;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/security"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-orange-500" />Login Activity
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review recent sign-ins to your account.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            Recent Sign-Ins
          </CardTitle>
          <CardDescription>
            Your most recent login events, newest first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Failed to load login history. Please try again.
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No login history recorded yet.
            </div>
          ) : (
            <div>
              {items.map((entry) => (
                <LoginRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}

          {nextCursor && items.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => setCursor(nextCursor)}
              >
                {isFetching ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
