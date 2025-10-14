"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, FileText, Calendar, Filter, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ActivityLogExportPage() {
  const [exportConfig, setExportConfig] = useState({
    format: "json",
    dateRange: "all",
    severity: "all",
    entityType: "all",
    includeMetadata: true,
    includeUserInfo: true,
    includeTimestamps: true,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Exporting with config:", exportConfig);
      // Implement actual export logic here
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats = [
    { id: "json", name: "JSON", description: "Machine-readable format", icon: "📄" },
    { id: "csv", name: "CSV", description: "Spreadsheet format", icon: "📊" },
    { id: "excel", name: "Excel", description: "Microsoft Excel format", icon: "📈" },
    { id: "pdf", name: "PDF", description: "Portable document format", icon: "📋" },
  ];

  const dateRanges = [
    { id: "all", name: "All Time" },
    { id: "today", name: "Today" },
    { id: "week", name: "This Week" },
    { id: "month", name: "This Month" },
    { id: "quarter", name: "This Quarter" },
    { id: "year", name: "This Year" },
    { id: "custom", name: "Custom Range" },
  ];

  const severityLevels = [
    { id: "all", name: "All Severities" },
    { id: "INFO", name: "Info Only" },
    { id: "WARNING", name: "Warnings and Above" },
    { id: "ERROR", name: "Errors and Above" },
    { id: "CRITICAL", name: "Critical Only" },
  ];

  const entityTypes = [
    { id: "all", name: "All Entities" },
    { id: "paper", name: "Papers" },
    { id: "collection", name: "Collections" },
    { id: "discussion", name: "Discussions" },
    { id: "annotation", name: "Annotations" },
    { id: "user", name: "Users" },
    { id: "workspace", name: "Workspaces" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Download className="h-8 w-8" />
            Export Activity Log
          </h1>
          <p className="text-muted-foreground">
            Export your research activity data in various formats
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/research/activity-log">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activity Log
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Export Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {exportFormats.map((format) => (
                  <div
                    key={format.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      exportConfig.format === format.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: format.id }))}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{format.icon}</div>
                      <div className="font-medium text-sm">{format.name}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select
                  value={exportConfig.dateRange}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity Level</label>
                <Select
                  value={exportConfig.severity}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Entity Type</label>
                <Select
                  value={exportConfig.entityType}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, entityType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Custom Search</label>
                <Input
                  placeholder="Search activities..."
                  onChange={(e) => console.log("Search:", e.target.value)}
                />
              </div>
            </div>

            {/* Export Options */}
            <div>
              <label className="text-sm font-medium mb-3 block">Export Options</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeMetadata}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include metadata</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeUserInfo}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeUserInfo: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include user information</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeTimestamps}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeTimestamps: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include timestamps</span>
                </label>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Activity Log
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Format:</span>
                <Badge variant="outline">
                  {exportFormats.find(f => f.id === exportConfig.format)?.name}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Date Range:</span>
                <span className="text-muted-foreground">
                  {dateRanges.find(r => r.id === exportConfig.dateRange)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Severity:</span>
                <span className="text-muted-foreground">
                  {severityLevels.find(s => s.id === exportConfig.severity)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Entity Type:</span>
                <span className="text-muted-foreground">
                  {entityTypes.find(t => t.id === exportConfig.entityType)?.name}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Estimated Export</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• ~1,247 activities</div>
                <div>• ~2.3 MB file size</div>
                <div>• ~30 seconds to generate</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Recent Exports</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>activity_log_2024.json</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span>research_activities.csv</span>
                  <span className="text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex justify-between">
                  <span>full_export.pdf</span>
                  <span className="text-muted-foreground">3 days ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No previous exports found</p>
            <p className="text-sm">Your export history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
