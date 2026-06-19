"use client";

/**
 * Admin Moderation Page
 */

import { useState } from "react";
import { Flag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useDismissReportMutation, useListReportsQuery, useResolveReportMutation, type ContentReportStatus } from "@/redux/api/adminExtendedApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<ContentReportStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  UNDER_REVIEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DISMISSED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export default function AdminModerationPage() {
  const [statusFilter, setStatusFilter] = useState<ContentReportStatus | "all">(
    "PENDING"
  );
  const { data, isLoading, refetch } = useListReportsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 50,
  });
  const [resolve] = useResolveReportMutation();
  const [dismiss] = useDismissReportMutation();
  const reports = data?.data ?? [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Shield className="h-7 w-7 text-white" />}
        title="Content Moderation"
        description="Review flagged content and user reports"
      />

      <div className="flex gap-1 p-1 bg-muted rounded-md max-w-md">
        {(["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED", "all"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as ContentReportStatus | "all")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-sm ${
                statusFilter === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reports in this view.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Badge variant="outline">{r.contentType}</Badge>
                      {r.contentTitle ?? r.contentId.slice(0, 12)}
                    </CardTitle>
                    <CardDescription>
                      Reported by {r.reporter?.email ?? "—"} ·{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_COLOR[r.status]}>
                      {r.status}
                    </Badge>
                    <Badge variant="secondary">{r.reason}</Badge>
                  </div>
                </div>
              </CardHeader>
              {r.contentPreview && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {r.contentPreview}
                  </p>
                  {r.description && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reporter note:</span>{" "}
                      {r.description}
                    </p>
                  )}
                  {r.status === "PENDING" || r.status === "UNDER_REVIEW" ? (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await resolve({ id: r.id, action: "removed" }).unwrap();
                            showSuccessToast("Resolved", "Report resolved");
                            refetch();
                          } catch {
                            showErrorToast("Failed", "Could not resolve");
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await dismiss(r.id).unwrap();
                            showSuccessToast("Dismissed", "Report dismissed");
                            refetch();
                          } catch {
                            showErrorToast("Failed", "Could not dismiss");
                          }
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
