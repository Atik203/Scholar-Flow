"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Download, Calendar, Filter, FileText, Database } from "lucide-react";
import Link from "next/link";

export default function ActivityLogExportPage() {
  const [exportConfig, setExportConfig] = useState({
    format: "json",
    dateRange: "month",
    severity: [] as string[],
    entityTypes: [] as string[],
    includeMetadata: true,
    includeUserInfo: true,
    customFields: "",
    filename: "activity-log-export"
  });

  const handleConfigChange = (field: string, value: any) => {
    setExportConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSeverityToggle = (severity: string) => {
    setExportConfig(prev => ({
      ...prev,
      severity: prev.severity.includes(severity)
        ? prev.severity.filter(s => s !== severity)
        : [...prev.severity, severity]
    }));
  };

  const handleEntityTypeToggle = (entityType: string) => {
    setExportConfig(prev => ({
      ...prev,
      entityTypes: prev.entityTypes.includes(entityType)
        ? prev.entityTypes.filter(e => e !== entityType)
        : [...prev.entityTypes, entityType]
    }));
  };

  const handleExport = () => {
    console.log("Exporting activity log with config:", exportConfig);
    // Implement actual export logic
  };

  const formatOptions = [
    { value: "json", label: "JSON", description: "Machine-readable format" },
    { value: "csv", label: "CSV", description: "Spreadsheet compatible" },
    { value: "xlsx", label: "Excel", description: "Microsoft Excel format" },
    { value: "pdf", label: "PDF", description: "Human-readable report" },
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const severityOptions = [
    { value: "INFO", label: "Info", color: "text-blue-600" },
    { value: "WARNING", label: "Warning", color: "text-yellow-600" },
    { value: "ERROR", label: "Error", color: "text-red-600" },
    { value: "CRITICAL", label: "Critical", color: "text-red-800" },
  ];

  const entityTypeOptions = [
    { value: "paper", label: "Papers" },
    { value: "collection", label: "Collections" },
    { value: "discussion", label: "Discussions" },
    { value: "annotation", label: "Annotations" },
    { value: "user", label: "Users" },
    { value: "workspace", label: "Workspaces" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research/activity-log">
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
              {/* Format Selection */}
              <div>
                <Label htmlFor="format">Export Format</Label>
                <Select
                  value={exportConfig.format}
                  onValueChange={(value) => handleConfigChange("format", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
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

              {/* Filename */}
              <div>
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={exportConfig.filename}
                  onChange={(e) => handleConfigChange("filename", e.target.value)}
                  placeholder="activity-log-export"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filter Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Severity Filter */}
              <div>
                <Label className="text-base font-medium">Severity Levels</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select which severity levels to include
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {severityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`severity-${option.value}`}
                        checked={exportConfig.severity.includes(option.value)}
                        onCheckedChange={() => handleSeverityToggle(option.value)}
                      />
                      <Label
                        htmlFor={`severity-${option.value}`}
                        className={`text-sm ${option.color}`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entity Types Filter */}
              <div>
                <Label className="text-base font-medium">Entity Types</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select which entity types to include
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {entityTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`entity-${option.value}`}
                        checked={exportConfig.entityTypes.includes(option.value)}
                        onCheckedChange={() => handleEntityTypeToggle(option.value)}
                      />
                      <Label htmlFor={`entity-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={exportConfig.includeMetadata}
                  onCheckedChange={(checked) => handleConfigChange("includeMetadata", checked)}
                />
                <Label htmlFor="includeMetadata" className="text-sm">
                  Include metadata and timestamps
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeUserInfo"
                  checked={exportConfig.includeUserInfo}
                  onCheckedChange={(checked) => handleConfigChange("includeUserInfo", checked)}
                />
                <Label htmlFor="includeUserInfo" className="text-sm">
                  Include user information
                </Label>
              </div>

              <div>
                <Label htmlFor="customFields">Custom Fields (JSON)</Label>
                <Textarea
                  id="customFields"
                  placeholder='{"includeIP": true, "includeUserAgent": false}'
                  value={exportConfig.customFields}
                  onChange={(e) => handleConfigChange("customFields", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Specify additional fields to include in the export
                </p>
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
                  <span className="font-medium">{exportConfig.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Range:</span>
                  <span className="font-medium">{exportConfig.dateRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity Levels:</span>
                  <span className="font-medium">
                    {exportConfig.severity.length === 0 ? "All" : exportConfig.severity.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entity Types:</span>
                  <span className="font-medium">
                    {exportConfig.entityTypes.length === 0 ? "All" : exportConfig.entityTypes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Records:</span>
                  <span className="font-medium">~1,247</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Export
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Export
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>activity-log-2024-01-15.json</span>
                  <span className="text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span>research-activities.csv</span>
                  <span className="text-muted-foreground">1 week ago</span>
                </div>
                <div className="flex justify-between">
                  <span>full-export.xlsx</span>
                  <span className="text-muted-foreground">2 weeks ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
