"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { useLazyExportActivityLogQuery } from "@/redux/api/discussionApi";
import { ArrowLeft, Download, FileText, Filter, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ActivityLogExportPage() {
  const [exportConfig, setExportConfig] = useState({
    format: "json" as "json" | "csv",
    dateRange: "month",
    severity: "",
    entity: "",
  });

  const [exportActivityLog, { isFetching: isExporting }] =
    useLazyExportActivityLogQuery();

  const handleConfigChange = (field: string, value: string) => {
    setExportConfig((prev) => ({ ...prev, [field]: value }));
  };

  const dateRangeToIso = (range: string): { startDate?: string; endDate?: string } => {
    const now = new Date();
    const start = new Date(now);
    switch (range) {
      case "today":
        start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString() };
      case "week": {
        const day = (now.getDay() + 6) % 7;
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString() };
      }
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString() };
      case "quarter":
        start.setMonth(Math.floor(now.getMonth() / 3) * 3, 1);
        start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString() };
      case "year":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString() };
      default:
        return {};
    }
  };

  const handleExport = async () => {
    try {
      const dateRange = dateRangeToIso(exportConfig.dateRange);
      const result = await exportActivityLog({
        format: exportConfig.format,
        ...(exportConfig.severity && {
          severity: exportConfig.severity as "INFO" | "WARNING" | "ERROR" | "CRITICAL",
        }),
        ...(exportConfig.entity && { entity: exportConfig.entity }),
        ...dateRange,
      }).unwrap();

      const mime =
        exportConfig.format === "csv" ? "text/csv" : "application/json";
      const blob = new Blob([result.content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || `activity-log.${exportConfig.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast("Activity log exported");
    } catch (error: unknown) {
      showErrorToast("Failed to export activity log");
    }
  };

  const formatOptions = [
    { value: "json", label: "JSON", description: "Machine-readable format" },
    { value: "csv", label: "CSV", description: "Spreadsheet compatible" },
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  const severityOptions = [
    { value: "", label: "All Severities" },
    { value: "INFO", label: "Info" },
    { value: "WARNING", label: "Warning" },
    { value: "ERROR", label: "Error" },
    { value: "CRITICAL", label: "Critical" },
  ];

  const entityTypeOptions = [
    { value: "", label: "All Entities" },
    { value: "paper", label: "Papers" },
    { value: "collection", label: "Collections" },
    { value: "discussion", label: "Discussions" },
    { value: "annotation", label: "Annotations" },
    { value: "user", label: "Users" },
    { value: "workspace", label: "Workspaces" },
  ];

  const preview = useMemo(
    () => ({
      format: exportConfig.format.toUpperCase(),
      dateRange:
        dateRangeOptions.find((o) => o.value === exportConfig.dateRange)
          ?.label || exportConfig.dateRange,
      severity:
        severityOptions.find((o) => o.value === exportConfig.severity)?.label ||
        "All",
      entity:
        entityTypeOptions.find((o) => o.value === exportConfig.entity)?.label ||
        "All",
    }),
    [exportConfig]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-muted">
            <Link href="/dashboard/research/activity-log">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Activity Log
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Download className="h-6 w-6" />
              Export Activity Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure and export activity log data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="format">Export Format</Label>
                <Select
                  value={exportConfig.format}
                  onValueChange={(value) =>
                    handleConfigChange("format", value as "json" | "csv")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select
                  value={exportConfig.dateRange}
                  onValueChange={(value) => handleConfigChange("dateRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={exportConfig.severity}
                  onValueChange={(value) => handleConfigChange("severity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entity">Entity Type</Label>
                <Select
                  value={exportConfig.entity}
                  onValueChange={(value) => handleConfigChange("entity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Preview & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{preview.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Range:</span>
                  <span className="font-medium">{preview.dateRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity:</span>
                  <span className="font-medium">{preview.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entity Type:</span>
                  <span className="font-medium">{preview.entity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExport}
                className="w-full"
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isExporting ? "Exporting..." : "Download Export"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
