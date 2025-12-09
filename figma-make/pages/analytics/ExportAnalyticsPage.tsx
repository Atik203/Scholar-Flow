"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  Check,
  CheckCircle,
  Clock,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
  Folder,
  History,
  Loader2,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface ExportAnalyticsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type ExportFormat = "csv" | "xlsx" | "json" | "pdf";
type ExportScope = "personal" | "workspace" | "all";
type DateRange = "7d" | "30d" | "90d" | "1y" | "custom";

// Mock export templates
const mockTemplates = [
  {
    id: "1",
    name: "Publication Summary",
    description: "Overview of papers, citations, and impact metrics",
    metrics: ["papers", "citations", "h-index", "downloads"],
    format: "pdf" as ExportFormat,
    scope: "personal" as ExportScope,
    icon: FileText,
    popular: true,
  },
  {
    id: "2",
    name: "Collaboration Report",
    description: "Team activity, contributions, and collaboration patterns",
    metrics: ["collaborators", "shared_papers", "comments", "team_activity"],
    format: "xlsx" as ExportFormat,
    scope: "workspace" as ExportScope,
    icon: Users,
    popular: true,
  },
  {
    id: "3",
    name: "Research Analytics",
    description: "Detailed breakdown of research activity and trends",
    metrics: [
      "papers_by_month",
      "citations_trend",
      "topic_distribution",
      "venues",
    ],
    format: "csv" as ExportFormat,
    scope: "personal" as ExportScope,
    icon: BarChart3,
    popular: false,
  },
  {
    id: "4",
    name: "Collection Statistics",
    description: "Paper collections, organization, and usage statistics",
    metrics: [
      "collections",
      "papers_per_collection",
      "tags",
      "reading_progress",
    ],
    format: "json" as ExportFormat,
    scope: "personal" as ExportScope,
    icon: Folder,
    popular: false,
  },
];

// Mock available metrics
const mockMetrics = [
  { id: "papers", name: "Total Papers", category: "papers" },
  { id: "citations", name: "Total Citations", category: "papers" },
  { id: "h_index", name: "h-Index", category: "papers" },
  { id: "downloads", name: "Paper Downloads", category: "papers" },
  { id: "papers_by_month", name: "Papers by Month", category: "trends" },
  { id: "citations_trend", name: "Citation Trends", category: "trends" },
  { id: "topic_distribution", name: "Topic Distribution", category: "trends" },
  { id: "collaborators", name: "Collaborators", category: "team" },
  { id: "shared_papers", name: "Shared Papers", category: "team" },
  { id: "team_activity", name: "Team Activity", category: "team" },
  { id: "collections", name: "Collections", category: "organization" },
  { id: "tags", name: "Tags Usage", category: "organization" },
  { id: "reading_progress", name: "Reading Progress", category: "activity" },
  { id: "annotations", name: "Annotations Made", category: "activity" },
  { id: "search_history", name: "Search History", category: "activity" },
];

// Mock export history
const mockExportHistory = [
  {
    id: "1",
    name: "Publication Summary Q4 2024",
    format: "pdf" as ExportFormat,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    size: "2.4 MB",
    status: "completed" as const,
  },
  {
    id: "2",
    name: "Monthly Analytics Report",
    format: "xlsx" as ExportFormat,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    size: "1.8 MB",
    status: "completed" as const,
  },
  {
    id: "3",
    name: "Research Data Export",
    format: "json" as ExportFormat,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    size: "856 KB",
    status: "completed" as const,
  },
  {
    id: "4",
    name: "Team Collaboration Report",
    format: "csv" as ExportFormat,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    size: "324 KB",
    status: "completed" as const,
  },
];

export const ExportAnalyticsPage: React.FC<ExportAnalyticsPageProps> = ({
  onNavigate,
  role = "pro_researcher",
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
  const [selectedScope, setSelectedScope] = useState<ExportScope>("personal");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [customName, setCustomName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "templates" | "custom" | "history"
  >("templates");

  const mockUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const formatIcons = {
    csv: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    json: FileJson,
    pdf: FileType,
  };

  const formatColors = {
    csv: "text-green-600 bg-green-100 dark:bg-green-900/30",
    xlsx: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    json: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    pdf: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };

  const dateRangeOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "1y", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((m) => m !== metricId)
        : [...prev, metricId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    setIsExporting(false);
    setExportProgress(0);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const metricsByCategory = mockMetrics.reduce(
    (acc, metric) => {
      if (!acc[metric.category]) acc[metric.category] = [];
      acc[metric.category].push(metric);
      return acc;
    },
    {} as Record<string, typeof mockMetrics>
  );

  return (
    <DashboardLayout user={mockUser} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Export Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Download your research data and reports
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1"
          >
            <div className="flex">
              {[
                { id: "templates", label: "Templates", icon: FileText },
                { id: "custom", label: "Custom Export", icon: Settings },
                { id: "history", label: "Export History", icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Templates Tab */}
            {activeTab === "templates" && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {mockTemplates.map((template, idx) => {
                  const Icon = template.icon;
                  const FormatIcon = formatIcons[template.format];
                  const isSelected = selectedTemplate === template.id;

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() =>
                        setSelectedTemplate(isSelected ? null : template.id)
                      }
                      className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-500 shadow-lg"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-indigo-100 dark:bg-indigo-900/30"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {template.name}
                              </h3>
                              {template.popular && (
                                <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${formatColors[template.format]}`}
                          >
                            <FormatIcon className="w-3 h-3" />
                            {template.format.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {template.scope === "personal"
                              ? "Personal"
                              : "Workspace"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {template.metrics.length} metrics
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {selectedTemplate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Export Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date Range
                        </label>
                        <select
                          value={dateRange}
                          onChange={(e) =>
                            setDateRange(e.target.value as DateRange)
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          {dateRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Format
                        </label>
                        <select
                          value={selectedFormat}
                          onChange={(e) =>
                            setSelectedFormat(e.target.value as ExportFormat)
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pdf">PDF Report</option>
                          <option value="xlsx">Excel Spreadsheet</option>
                          <option value="csv">CSV File</option>
                          <option value="json">JSON Data</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          File Name
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="analytics-export"
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Exporting... {exportProgress}%
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Export Now
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Custom Export Tab */}
            {activeTab === "custom" && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Configuration Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Export Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scope
                      </label>
                      <select
                        value={selectedScope}
                        onChange={(e) =>
                          setSelectedScope(e.target.value as ExportScope)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="personal">Personal Data</option>
                        <option value="workspace">Workspace Data</option>
                        <option value="all">All Data</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) =>
                          setDateRange(e.target.value as DateRange)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        {dateRangeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Format
                      </label>
                      <select
                        value={selectedFormat}
                        onChange={(e) =>
                          setSelectedFormat(e.target.value as ExportFormat)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pdf">PDF Report</option>
                        <option value="xlsx">Excel Spreadsheet</option>
                        <option value="csv">CSV File</option>
                        <option value="json">JSON Data</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="custom-export"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Select Metrics
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedMetrics.length} selected
                    </span>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(metricsByCategory).map(
                      ([category, metrics]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 capitalize">
                            {category}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {metrics.map((metric) => {
                              const isSelected = selectedMetrics.includes(
                                metric.id
                              );
                              return (
                                <button
                                  key={metric.id}
                                  onClick={() => toggleMetric(metric.id)}
                                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                                    isSelected
                                      ? "bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700"
                                      : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "border-gray-300 dark:border-gray-500"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm ${isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}
                                  >
                                    {metric.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isExporting || selectedMetrics.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Exporting... {exportProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Export Custom Report
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Recent Exports
                  </h3>
                  <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Clear All
                  </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {mockExportHistory.map((export_, idx) => {
                    const FormatIcon = formatIcons[export_.format];
                    return (
                      <motion.div
                        key={export_.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${formatColors[export_.format]}`}
                            >
                              <FormatIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {export_.name}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(export_.createdAt)}
                                </span>
                                <span>{export_.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportAnalyticsPage;
