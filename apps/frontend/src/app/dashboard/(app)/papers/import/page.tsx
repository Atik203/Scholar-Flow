"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { useImportByFileMutation, useGetImportHistoryQuery } from "@/redux/api/importApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion } from "motion/react";
import { ArrowLeft, Book, CheckCircle, Database, FileText, Link as LinkIcon, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

const sources = [
  { key: "bibtex", label: "BibTeX", icon: Book, accepts: ".bib" },
  { key: "ris", label: "RIS", icon: FileText, accepts: ".ris" },
  { key: "zotero", label: "Zotero", icon: Database, coming: true },
  { key: "mendeley", label: "Mendeley", icon: Database, coming: true },
  { key: "endnote", label: "EndNote", icon: Database, coming: true },
];

export default function ImportPapersPage() {
  const [selectedSource, setSelectedSource] = useState("bibtex");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [content, setContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: workspacesData } = useListWorkspacesQuery({limit: 50, scope: "all" });
  const { data: historyData } = useGetImportHistoryQuery();
  const [importByFile] = useImportByFileMutation();

  const workspaces = workspacesData?.data || [];
  const history = historyData || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setContent(ev.target?.result as string || "");
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!content || !selectedWorkspace) { showErrorToast("Content and workspace required"); return; }
    setIsImporting(true);
    try {
      const result = await importByFile({ content, format: selectedSource as "bibtex" | "ris", workspaceId: selectedWorkspace }).unwrap();
      showSuccessToast(`Imported ${result.imported} of ${result.total} papers`);
      setContent("");
    } catch (e: any) { showErrorToast(e?.data?.message || "Import failed"); }
    setIsImporting(false);
  };

  const currentSource = sources.find((s) => s.key === selectedSource);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Import Papers</h1><p className="text-muted-foreground">Import papers from bibliography files, databases, and services</p></div>
      </div>

      {/* Source Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sources.map((source) => (
          <motion.button key={source.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { if (!source.coming) setSelectedSource(source.key); }}
            className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
              source.coming ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              selectedSource === source.key && !source.coming ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
            <source.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{source.label}</span>
            {source.coming && <span className="text-xs text-muted-foreground">Coming soon</span>}
          </motion.button>
        ))}
      </div>

      {/* Import Area */}
      {!currentSource?.coming && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Import from {currentSource?.label}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Workspace</label>
              <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
                <option value="">Select workspace...</option>
                {workspaces.map((w: any) => (<option key={w.id} value={w.id}>{w.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Upload file or paste content</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 mb-3" onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept={currentSource?.accepts || ".bib,.ris"} className="hidden" onChange={handleFileUpload} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Click to upload {currentSource?.label} file</p>
              </div>
              <Textarea placeholder={`Paste ${currentSource?.label} content here...`} value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="font-mono text-sm" />
            </div>
            <Button onClick={handleImport} disabled={isImporting} className="w-full">
              {isImporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Importing...</> : <>Import Papers</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Import History */}
      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Import History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium">{h.title}</p><p className="text-xs text-muted-foreground">{h.source} · {new Date(h.createdAt).toLocaleDateString()}</p></div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
