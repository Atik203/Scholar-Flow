"use client";

/**
 * Admin Audit Log Page
 *
 * Phase 7 - paginated audit log with severity/category filters + summary.
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Info,
  Search,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useGetAuditSummaryQuery, useListAuditEntriesQuery, type AuditSeverity } from "@/redux/api/adminAuditApi";

const SEVERITY_ICON: Record<AuditSeverity, typeof Info> = {
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: AlertTriangle,
  CRITICAL: AlertTriangle,
};

const SEVERITY_COLOR: Record<AuditSeverity, string> = {
  INFO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CRITICAL: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<AuditSeverity | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListAuditEntriesQuery({
    page,
    limit: 25,
    search: search || undefined,
    severity: severity === "all" ? undefined : severity,
  });
  const { data: summaryData } = useGetAuditSummaryQuery({});

  const entries = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPage ?? 1;
  const summary = summaryData?.data;

  const handleExport = (format: "csv" | "json") => {
    const params = new URLSearchParams({ format });
    if (severity !== "all") params.set("severity", severity);
    if (search) params.set("search", search);
    window.open(`/api/admin/audit-log/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Shield className="h-7 w-7 text-white" />}
        title="Audit Log"
        description="System-wide activity and security events"
        actions={
          <>
            <Button variant="outline" onClick={() => handleExport("csv")} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("json")} className="gap-2">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </>
        }
      />

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-2xl font-bold">{summary.total}</p>
            <p className="text-sm text-muted-foreground">Total events</p>
          </Card>
          {summary.bySeverity.map((s) => (
            <Card key={s.severity} className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${SEVERITY_COLOR[s.severity as AuditSeverity] ?? ""}`}
                >
                  {s.severity}
                </span>
              </div>
              <p className="text-2xl font-bold">{s.count}</p>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex-1 flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit log..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-1 p-1 bg-muted rounded-md">
              {(["all", "INFO", "WARNING", "ERROR", "CRITICAL"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSeverity(s as AuditSeverity | "all");
                    setPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-sm ${
                    severity === s
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No audit entries match your filters.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {entries.map((e) => {
                const Icon = SEVERITY_ICON[e.severity];
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div
                      className={`p-2 rounded-lg ${SEVERITY_COLOR[e.severity]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {e.entity}
                        </Badge>
                        <span className="text-sm font-medium">{e.action}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {e.user?.email ?? "system"} ·{" "}
                        {new Date(e.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
