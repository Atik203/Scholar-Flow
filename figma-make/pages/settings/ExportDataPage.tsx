"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileArchive,
  FileJson,
  FileText,
  HardDrive,
  Info,
  Loader2,
  Mail,
  RefreshCcw,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface ExportDataPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "researcher" as const,
};

// Export options
interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  dataSize: string;
  items: number;
  lastExport?: string;
}

const exportOptions: ExportOption[] = [
  {
    id: "papers",
    name: "Research Papers",
    description:
      "All uploaded papers with metadata, annotations, and highlights",
    icon: FileText,
    dataSize: "2.4 GB",
    items: 156,
    lastExport: "Dec 15, 2024",
  },
  {
    id: "collections",
    name: "Collections",
    description:
      "Collection structure, paper assignments, and sharing settings",
    icon: Database,
    dataSize: "12 MB",
    items: 24,
    lastExport: "Dec 20, 2024",
  },
  {
    id: "notes",
    name: "Research Notes",
    description: "All notes, summaries, and research observations",
    icon: FileText,
    dataSize: "48 MB",
    items: 312,
  },
  {
    id: "account",
    name: "Account Data",
    description: "Profile information, settings, and preferences",
    icon: Settings,
    dataSize: "1.2 MB",
    items: 1,
    lastExport: "Dec 1, 2024",
  },
  {
    id: "activity",
    name: "Activity History",
    description: "Login history, actions, and audit log",
    icon: Clock,
    dataSize: "8 MB",
    items: 2847,
  },
];

// Export formats
const exportFormats = [
  {
    id: "json",
    name: "JSON",
    description: "Machine-readable format",
    icon: FileJson,
  },
  {
    id: "zip",
    name: "ZIP Archive",
    description: "Compressed with folders",
    icon: FileArchive,
  },
];

// Previous exports
interface PreviousExport {
  id: string;
  date: string;
  type: string;
  format: string;
  size: string;
  status: "completed" | "processing" | "failed";
  downloadUrl?: string;
}

const previousExports: PreviousExport[] = [
  {
    id: "1",
    date: "Dec 20, 2024",
    type: "Full Account Export",
    format: "ZIP",
    size: "2.6 GB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "2",
    date: "Dec 15, 2024",
    type: "Papers Only",
    format: "JSON",
    size: "2.4 GB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "3",
    date: "Dec 10, 2024",
    type: "Collections & Notes",
    format: "ZIP",
    size: "62 MB",
    status: "completed",
    downloadUrl: "#",
  },
];

// Storage stats
const storageStats = {
  used: 2.8,
  total: 10,
  breakdown: [
    { name: "Papers", size: 2.4, color: "bg-blue-500" },
    { name: "Notes", size: 0.28, color: "bg-emerald-500" },
    { name: "Collections", size: 0.08, color: "bg-purple-500" },
    { name: "Other", size: 0.04, color: "bg-amber-500" },
  ],
};

export function ExportDataPage({
  onNavigate,
  role: propRole,
}: ExportDataPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("zip");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);

  const handleToggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === exportOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(exportOptions.map((opt) => opt.id));
    }
  };

  const handleExport = () => {
    if (selectedOptions.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const totalSelectedSize = exportOptions
    .filter((opt) => selectedOptions.includes(opt.id))
    .reduce((acc, opt) => {
      const size = parseFloat(opt.dataSize);
      const unit = opt.dataSize.includes("GB") ? 1000 : 1;
      return acc + size * unit;
    }, 0);

  const formatSize = (sizeMB: number) => {
    if (sizeMB >= 1000) return `${(sizeMB / 1000).toFixed(1)} GB`;
    return `${sizeMB.toFixed(0)} MB`;
  };

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pb-12">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("/settings")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Export Your Data
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download a copy of your ScholarFlow data
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* GDPR Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Your Data, Your Rights
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Under GDPR and other privacy regulations, you have the right
                  to download a copy of all your personal data. This export
                  includes all information you've provided and content you've
                  created on ScholarFlow.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Storage Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Storage Usage
              </h3>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {storageStats.used} GB of {storageStats.total} GB used
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((storageStats.used / storageStats.total) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                {storageStats.breakdown.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.size / storageStats.total) * 100}%`,
                    }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={`h-full ${item.color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {storageStats.breakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name} (
                    {item.size >= 1
                      ? `${item.size} GB`
                      : `${(item.size * 1000).toFixed(0)} MB`}
                    )
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Select Data to Export
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {selectedOptions.length === exportOptions.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {exportOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handleToggleOption(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center pt-1">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedOptions.includes(option.id)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedOptions.includes(option.id) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedOptions.includes(option.id)
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <option.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {option.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{option.items.toLocaleString()} items</span>
                        <span>~{option.dataSize}</span>
                        {option.lastExport && (
                          <span>Last exported: {option.lastExport}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Export Format */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Export Format
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedFormat === format.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedFormat === format.id
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <format.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Email Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Email when ready
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll notify you at {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSendEmail(!sendEmail)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  sendEmail ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    sendEmail ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Export Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            {!isExporting && !exportComplete ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedOptions.length > 0
                      ? `${selectedOptions.length} items selected (~${formatSize(totalSelectedSize)})`
                      : "Select data to export"}
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={selectedOptions.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Start Export
                </button>
              </div>
            ) : isExporting ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Preparing your export...
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(exportProgress, 100)}%` }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {exportProgress.toFixed(0)}% complete
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Export Complete!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your data is ready for download
                </p>
                <div className="flex justify-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                    <Download className="h-5 w-5" />
                    Download Export
                  </button>
                  <button
                    onClick={() => {
                      setExportComplete(false);
                      setExportProgress(0);
                      setSelectedOptions([]);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    New Export
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Previous Exports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Previous Exports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Exports are available for 30 days
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {previousExports.map((export_, index) => (
                <motion.div
                  key={export_.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FileArchive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {export_.type}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{export_.date}</span>
                        <span>{export_.format}</span>
                        <span>{export_.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {export_.status === "completed" && (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 rounded-full">
                          <CheckCircle className="h-3 w-3" />
                          Ready
                        </span>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Download className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {export_.status === "processing" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 rounded-full">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                      </span>
                    )}
                    {export_.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30 rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </span>
                    )}
                    <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Large exports may take a few minutes to prepare. You can close
              this page and we'll email you when your export is ready for
              download. Exports are securely stored and automatically deleted
              after 30 days.
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
