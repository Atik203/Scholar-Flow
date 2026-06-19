"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/providers/ToastProvider";

type Format = "csv" | "json";

const FORMATS: Array<{
  id: Format;
  label: string;
  description: string;
  icon: typeof FileSpreadsheet;
}> = [
  { id: "csv", label: "CSV", description: "Spreadsheet-friendly format", icon: FileSpreadsheet },
  { id: "json", label: "JSON", description: "Machine-readable format", icon: FileJson },
];

export default function ExportPage() {
  const [format, setFormat] = useState<Format>("csv");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setDownloadUrl(null);
    setFilename(null);

    try {
      const res = await fetch("/api/user/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition");
      const fallback = `scholarflow-export-${Date.now()}.${format}`;
      const name = disposition?.match(/filename="?([^"]+)"?/)?.[1] || fallback;

      setDownloadUrl(url);
      setFilename(name);
      showSuccessToast("Export ready", `Your ${format.toUpperCase()} export is ready to download.`);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      showErrorToast("Export failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground mt-1">
          Download your research papers, collections, and account data.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Export format</CardTitle>
            <CardDescription>
              Choose the format for your exported data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {FORMATS.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormat(id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                    format === id
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "border-muted hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleExport}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export as {format.toUpperCase()}
                </>
              )}
            </Button>

            {filename && downloadUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
              >
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Downloaded:{" "}
                  <span className="font-mono">{filename}</span>
                </p>
                <a
                  href={downloadUrl}
                  download={filename}
                  className="text-xs text-emerald-600 dark:text-emerald-500 underline mt-1 inline-block"
                >
                  Click here if download didn&apos;t start automatically
                </a>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
