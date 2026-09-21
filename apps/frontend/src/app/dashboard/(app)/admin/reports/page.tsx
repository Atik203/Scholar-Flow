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
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Search,
  Table2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ReportDataTable } from "./ReportDataTable";
import { ReportFormDialog, type ReportFormValues } from "./ReportFormDialog";
import {
  REPORT_TYPE_LABELS as TYPE_LABELS,
  REPORT_TYPE_OPTIONS as TYPE_OPTIONS,
} from "./constants";
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
  useUpdateReportMutation,
  type AdminReport,
  type AdminReportType,
  type AdminReportFormat,
  type AdminReportStatus,
} from "@/redux/api/adminReportsApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  READY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  GENERATING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SCHEDULED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PAGE_LIMIT = 20;

const STATUS_OPTIONS: Array<{ value: AdminReportStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "READY", label: "Ready" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "GENERATING", label: "Generating" },
  { value: "FAILED", label: "Failed" },
];

const formatSchedule = (schedule: string): string => {
  switch (schedule) {
    case "0 9 * * *":
      return "Daily at 09:00";
    case "0 9 * * 1":
      return "Weekly · Monday 09:00";
    case "0 9 1 * *":
      return "Monthly · 1st at 09:00";
    default:
      return schedule;
  }
};

const formatRecipients = (recipients: string[]): string => {
  if (recipients.length === 0) return "none";
  if (recipients.length <= 2) return recipients.join(", ");
  return `${recipients.slice(0, 2).join(", ")} +${recipients.length - 2}`;
};

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AdminReportType | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<AdminReportType>("USAGE");
  const [statusFilter, setStatusFilter] = useState<AdminReportStatus | "all">(
    "all"
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminReport | null>(null);
  const [editTarget, setEditTarget] = useState<AdminReport | null>(null);

  const queryArgs = {
    search: search || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit: PAGE_LIMIT,
  };

  const { data, isLoading, refetch } = useListReportsQuery(queryArgs);
  const { data: statsData } = useGetReportStatsQuery({
    search: search || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
  });
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();
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

  /**
   * Save edits to a saved report definition
   */
  const handleEditSubmit = async (values: ReportFormValues) => {
    if (!editTarget) return;
    try {
      await updateReport({
        id: editTarget.id,
        patch: {
          name: values.name,
          description: values.description,
          format: values.format,
          schedule: values.schedule,
          recipients: values.recipients,
          enabled: values.enabled,
        },
      }).unwrap();
      showSuccessToast("Report updated", `${values.name} saved`);
      setEditTarget(null);
    } catch {
      showErrorToast("Update failed", "Could not update report");
    }
  };

  /**
   * Enable or disable a saved report without opening the edit dialog
   */
  const handleToggleEnabled = async (report: AdminReport) => {
    try {
      await updateReport({
        id: report.id,
        patch: { enabled: !report.enabled },
      }).unwrap();
      showSuccessToast(
        report.enabled ? "Report disabled" : "Report enabled",
        report.name
      );
    } catch {
      showErrorToast("Update failed", "Could not change report status");
    }
  };

  /**
   * Delete a saved report (confirm dialog, optimistic list removal)
   */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReport(deleteTarget.id).unwrap();
      showSuccessToast("Report deleted", `${deleteTarget.name} was removed`);
      setDeleteTarget(null);
    } catch {
      showErrorToast("Delete failed", "Could not delete report");
    }
  };

  /**
   * Jump to the live data table for a report's type
   */
  const handleViewData = (type: AdminReportType) => {
    setActiveTab(type);
    document
      .getElementById("live-data")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          { label: "Total Reports", value: total, icon: FileText, color: "from-indigo-500 to-purple-600", status: "all" as const },
          { label: "Ready", value: ready, icon: CheckCircle, color: "from-emerald-500 to-teal-600", status: "READY" as const },
          { label: "Scheduled", value: scheduled, icon: Calendar, color: "from-amber-500 to-orange-600", status: "SCHEDULED" as const },
          { label: "Failed", value: failed, icon: Clock, color: "from-red-500 to-rose-600", status: "FAILED" as const },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`p-5 transition-all hover:shadow-md ${
                statusFilter === s.status ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  setStatusFilter((prev) =>
                    prev === s.status ? "all" : s.status
                  );
                  setPage(1);
                }}
                aria-pressed={statusFilter === s.status}
                aria-label={`Filter reports by ${s.label}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live data preview — one table per report type */}
      <Card id="live-data">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Live Data
          </CardTitle>
          <CardDescription>
            Preview the underlying data for each report type — download CSV or
            JSON only when you need a file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as AdminReportType)}
          >
            <TabsList className="flex h-auto flex-wrap gap-1">
              {TYPE_OPTIONS.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {TYPE_LABELS[t]}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <ReportDataTable key={activeTab} type={activeTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={statusFilter === option.value ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter(option.value);
                  setPage(1);
                }}
                aria-pressed={statusFilter === option.value}
              >
                {option.label}
              </Button>
            ))}
          </div>

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
                      {TYPE_LABELS[r.type]} · {r.format} ·{" "}
                      {r.generatedAt
                        ? `Generated ${new Date(r.generatedAt).toLocaleString()}`
                        : "Not generated"}
                      {r.fileSize ? ` · ${r.fileSize}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>
                        {r.schedule
                          ? `Schedule: ${formatSchedule(r.schedule)}`
                          : "Manual"}
                      </span>
                      {r.nextRunAt && (
                        <span>
                          Next run: {new Date(r.nextRunAt).toLocaleString()}
                        </span>
                      )}
                      <span title={r.recipients.join(", ")}>
                        Recipients: {formatRecipients(r.recipients)}
                      </span>
                      {r.createdBy && (
                        <span>
                          Created by:{" "}
                          {r.createdBy.name ?? r.createdBy.email}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${STATUS_COLOR[r.status] ?? ""}`}
                  >
                    {r.status}
                  </span>
                  {!r.enabled && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Inactive
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleEnabled(r)}
                    aria-label={`${r.enabled ? "Disable" : "Enable"} report ${r.name}`}
                  >
                    <Power
                      className={`h-3 w-3 ${r.enabled ? "text-emerald-600" : "text-muted-foreground"}`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewData(r.type)}
                    className="gap-1"
                    aria-label={`View ${r.type} data for ${r.name}`}
                  >
                    <Table2 className="h-3 w-3" />
                    View data
                  </Button>
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
                    onClick={() => setEditTarget(r)}
                    aria-label={`Edit report ${r.name}`}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(r)}
                    aria-label={`Delete report ${r.name}`}
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

      {/* Edit report dialog */}
      <ReportFormDialog
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        mode="edit"
        initial={editTarget}
        isLoading={isUpdating}
        onSubmit={handleEditSubmit}
      />

      {/* Delete confirm dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete report</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `"${deleteTarget.name}" (${deleteTarget.type}) will be removed. Its schedule stops immediately.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showCreate && (
        <ReportFormDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          mode="create"
          isLoading={isCreating}
          onSubmit={async (values) => {
            try {
              await createReport({
                name: values.name,
                description: values.description,
                type: values.type,
                format: values.format,
                schedule: values.schedule,
                recipients: values.recipients,
                enabled: values.enabled,
              }).unwrap();
              showSuccessToast("Created", "Report created successfully");
              setShowCreate(false);
            } catch {
              showErrorToast("Failed", "Could not create report");
            }
          }}
        />
      )}
    </div>
  );
}
