"use client";

/**
 * ExportAnalyticsPage
 *
 * Pro+ only. A 3-step wizard that lets the user pick data, format, and
 * download a usage report. Uses the existing usage export endpoint.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Download, FileJson, FileSpreadsheet, FileText, Check, ChevronRight, Download as DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/customUI/PageHeader";
import { USER_ROLES, hasRoleAccess } from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";
import { showSuccessToast } from "@/components/providers/ToastProvider";

type Step = 1 | 2 | 3;
type DataChoice = "personal" | "usage";
type Format = "csv" | "json";

const DATA_OPTIONS: Array<{ id: DataChoice; label: string; description: string }> = [
  { id: "personal", label: "Personal analytics", description: "Reading activity, papers, achievements" },
  { id: "usage", label: "Usage metrics", description: "API calls, storage, AI credits, feature usage" },
];

const FORMAT_OPTIONS: Array<{
  id: Format;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  { id: "csv", label: "CSV", description: "Spreadsheet friendly", icon: FileSpreadsheet },
  { id: "json", label: "JSON", description: "Machine readable", icon: FileJson },
];

export default function ExportAnalyticsPage() {
  const { session } = useAuth();
  const userRole = session?.user?.role ?? USER_ROLES.RESEARCHER;
  const hasAccess = hasRoleAccess(userRole, USER_ROLES.PRO_RESEARCHER);

  const [step, setStep] = useState<Step>(1);
  const [dataChoice, setDataChoice] = useState<DataChoice>("usage");
  const [format, setFormat] = useState<Format>("csv");

  if (!hasAccess) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader
          icon={<Download className="h-7 w-7 text-white" />}
          title="Export Analytics"
          description="Download your data"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Pro feature</h3>
            <p className="text-muted-foreground">
              Exporting analytics is available on the Pro plan and above.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    if (dataChoice === "usage") {
      const url = `/api/analytics/usage/export?format=${format}`;
      window.open(url, "_blank");
    } else {
      showSuccessToast("Coming soon", "Personal export will be available in the next release.");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <PageHeader
        icon={<Download className="h-7 w-7 text-white" />}
        title="Export Analytics"
        description="Download your data as CSV or JSON"
      />

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex items-center gap-2 ${s < step ? "text-emerald-600" : s === step ? "text-indigo-600 font-medium" : "text-muted-foreground"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                s < step
                  ? "bg-emerald-100 border-emerald-500"
                  : s === step
                    ? "bg-indigo-100 border-indigo-500"
                    : "bg-slate-100 border-slate-300 dark:bg-slate-800"
              }`}
            >
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className="text-sm">
              {s === 1 ? "Data" : s === 2 ? "Format" : "Download"}
            </span>
            {s < 3 && <ChevronRight className="h-4 w-4 text-slate-300 ml-2" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Select data to export</CardTitle>
              <CardDescription>Choose what to include in the export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DATA_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDataChoice(opt.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    dataChoice === opt.id
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-sm text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </CardContent>
            <div className="p-6 pt-0 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Choose format</CardTitle>
              <CardDescription>Pick a download format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                    format === opt.id
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <opt.icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
            <div className="p-6 pt-0 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Ready to download</CardTitle>
              <CardDescription>Confirm your selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-muted-foreground">Data</span>
                <span className="text-sm font-medium">
                  {DATA_OPTIONS.find((o) => o.id === dataChoice)?.label}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-muted-foreground">Format</span>
                <span className="text-sm font-medium">
                  {FORMAT_OPTIONS.find((o) => o.id === format)?.label}
                </span>
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleDownload}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
