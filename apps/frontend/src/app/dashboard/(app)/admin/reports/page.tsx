"use client";

/**
 * Admin Reports Page
 *
 * Phase 7 - reports list + create + generate (download CSV/JSON).
 * Matches the figma AdminReportsPage layout (stats + tabs + table).
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateReportMutation,
  useDeleteReportMutation,
  useGenerateReportMutation,
  useGetReportStatsQuery,
  useListReportsQuery,
  type AdminReportType,
  type AdminReportFormat,
} from "@/redux/api/adminReportsApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  READY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  GENERATING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SCHEDULED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TYPE_OPTIONS: AdminReportType[] = ["USAGE", "FINANCIAL", "USER", "CONTENT", "SYSTEM"];

const PAGE_LIMIT = 20;

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AdminReportType | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  const queryArgs = {
    search: search || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
    page,
    limit: PAGE_LIMIT,
  };

  const { data, isLoading, refetch } = useListReportsQuery(queryArgs);
  const { data: statsData } = useGetReportStatsQuery({
    search: search || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
  });
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const [deleteReport] = useDeleteReportMutation();
  const [generateReport] = useGenerateReportMutation();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const reports = data?.data ?? [];
  const totalPages = data?.meta?.totalPage ?? 1;

  const stats = statsData?.data;
  const total = stats?.total ?? data?.meta?.total ?? 0;
  const ready = stats?.ready ?? 0;
  const failed = stats?.failed ?? 0;
  const scheduled = stats?.scheduled ?? 0;

  /**
   * Generate + download a report file through the RTK blob mutation.
   * The backend streams the file with Content-Disposition: attachment.
   */
  const handleGenerate = async (reportId: string) => {
    setGeneratingId(reportId);
    try {
      const blob = await generateReport({ id: reportId }).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccessToast("Report generated", "Download started");
    } catch {
      showErrorToast("Failed", "Could not generate report");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<FileSpreadsheet className="h-7 w-7 text-white" />}
        title="Reports"
        description="Generate, schedule, and export system reports"
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: total, icon: FileText, color: "from-indigo-500 to-purple-600" },
          { label: "Ready", value: ready, icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
          { label: "Scheduled", value: scheduled, icon: Calendar, color: "from-amber-500 to-orange-600" },
          { label: "Failed", value: failed, icon: Clock, color: "from-red-500 to-rose-600" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex-1 flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(v) => {
                    setTypeFilter(v as AdminReportType | "all");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    refetch();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reports yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.type} · {r.format} ·{" "}
                      {r.generatedAt
                        ? new Date(r.generatedAt).toLocaleString()
                        : "Not generated"}
                      {r.fileSize ? ` · ${r.fileSize}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${STATUS_COLOR[r.status] ?? ""}`}
                  >
                    {r.status}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(r.id)}
                    disabled={generatingId === r.id}
                    className="gap-1"
                  >
                    {generatingId === r.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    {generatingId === r.id ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (confirm("Delete this report?")) {
                        await deleteReport(r.id);
                        refetch();
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!isLoading && reports.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showCreate && (
        <CreateReportDialog
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            try {
              await createReport(payload).unwrap();
              showSuccessToast("Created", "Report created successfully");
              setShowCreate(false);
              refetch();
            } catch {
              showErrorToast("Failed", "Could not create report");
            }
          }}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}

function CreateReportDialog({
  onClose,
  onCreate,
  isLoading,
}: {
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    type: AdminReportType;
    format: AdminReportFormat;
  }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AdminReportType>("USAGE");
  const [format, setFormat] = useState<AdminReportFormat>("CSV");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Create report</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monthly User Activity"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(v) => setType(v as AdminReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as AdminReportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            disabled={!name || isLoading}
            onClick={() => onCreate({ name, type, format })}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
