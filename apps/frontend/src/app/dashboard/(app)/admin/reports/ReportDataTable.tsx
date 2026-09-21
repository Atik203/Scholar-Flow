"use client";

/**
 * ReportDataTable — paginated live-data preview for one report type.
 * Backed by GET /admin/reports/preview; CSV/JSON downloads use the direct
 * export endpoint (no saved report required).
 */

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  useExportReportMutation,
  useGetReportPreviewQuery,
  type AdminReportType,
  type ReportCellValue,
  type ReportColumn,
} from "@/redux/api/adminReportsApi";

const PAGE_LIMIT = 25;

const formatCell = (value: ReportCellValue | undefined, column: ReportColumn) => {
  if (value === null || value === undefined || value === "") return "—";
  switch (column.format) {
    case "date": {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
    }
    case "boolean":
      return value ? "Yes" : "No";
    case "number":
      return Number(value).toLocaleString();
    default:
      return String(value);
  }
};

export function ReportDataTable({ type }: { type: AdminReportType }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [exportReport, { isLoading: isExporting }] = useExportReportMutation();

  const { data, isLoading, isError, isFetching, refetch } =
    useGetReportPreviewQuery({
      type,
      page,
      limit: PAGE_LIMIT,
      search: search.trim() || undefined,
    });

  const preview = data?.data;
  const rows = preview?.rows ?? [];
  const columns = preview?.columns ?? [];
  const meta = preview?.meta;

  const handleExport = async (format: "CSV" | "JSON") => {
    try {
      const blob = await exportReport({ type, format }).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `scholar-flow-${type.toLowerCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast("Export complete", `${type} data downloaded as ${format}`);
    } catch {
      showErrorToast("Export failed", "Could not export this report type");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${type.toLowerCase()} data...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
            aria-label={`Search ${type} report data`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            aria-label="Refresh report data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => handleExport("CSV")}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => handleExport("JSON")}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            JSON
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-muted-foreground">
          <p className="mb-3">Could not load {type.toLowerCase()} data.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          <Table2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>
            No {type.toLowerCase()} data
            {search ? " matches your search" : " yet"}.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <caption className="sr-only">{type} report data</caption>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="whitespace-nowrap text-sm"
                    >
                      {formatCell(row[column.key], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {meta.total.toLocaleString()} row{meta.total === 1 ? "" : "s"} ·
            page {meta.page} of {meta.totalPage}
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
              disabled={page >= (meta.totalPage ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
