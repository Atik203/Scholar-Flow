"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { useUploadPaperMutation } from "@/redux/api/paperApi";
import { useImportByDOIMutation, useImportByArxivMutation, useImportByURLMutation, useImportBySmartURLMutation } from "@/redux/api/importApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BookOpen, Check, CheckCircle, FileText, Globe, Link2, Loader2, Search, Sparkles, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

type UploadMethod = "file" | "doi" | "arxiv" | "url" | "smart-url";
type ProcessingStage = "idle" | "uploading" | "extracting" | "analyzing" | "complete" | "error";

interface FileUpload { id: string; file: File; progress: number; stage: ProcessingStage; paperId?: string; error?: string; }

const stages = [
  { key: "uploading", label: "Uploading", icon: Upload },
  { key: "extracting", label: "Extracting", icon: FileText },
  { key: "analyzing", label: "AI Analysis", icon: Sparkles },
  { key: "complete", label: "Complete", icon: CheckCircle },
];

export default function UploadPaperPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [doiInput, setDoiInput] = useState("");
  const [arxivInput, setArxivInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [smartUrlInput, setSmartUrlInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("");

  const { data: workspacesData } = useListWorkspacesQuery({limit: 50, scope: "all" });
  const [uploadPaper] = useUploadPaperMutation();
  const [importDoi] = useImportByDOIMutation();
  const [importArxiv] = useImportByArxivMutation();
  const [importUrl] = useImportByURLMutation();
  const [importSmartUrl] = useImportBySmartURLMutation();

  const workspaces = workspacesData?.data || [];

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (files.length) handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = async (files: File[]) => {
    if (!selectedWorkspace) { showErrorToast("Please select a workspace first"); return; }
    const newUploads: FileUpload[] = files.map((file) => ({ id: Math.random().toString(36).slice(2), file, progress: 0, stage: "uploading" }));
    setUploads((prev) => [...prev, ...newUploads]);

    for (const upload of newUploads) {
      try {
        updateUpload(upload.id, { stage: "uploading", progress: 30 });
        const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
        const result = await uploadPaper({ file: upload.file, workspaceId: selectedWorkspace, tags: tagList, language: language || undefined }).unwrap();
        updateUpload(upload.id, { stage: "extracting", progress: 60, paperId: result.data.paper.id });
        await new Promise((r) => setTimeout(r, 800));
        updateUpload(upload.id, { stage: "analyzing", progress: 85 });
        await new Promise((r) => setTimeout(r, 1200));
        updateUpload(upload.id, { stage: "complete", progress: 100 });
      } catch (e: any) {
        updateUpload(upload.id, { stage: "error", error: e?.message || "Upload failed" });
      }
    }
    showSuccessToast(`Uploaded ${newUploads.length} paper(s)`);
  };

  const updateUpload = (id: string, data: Partial<FileUpload>) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const removeUpload = (id: string) => { setUploads((prev) => prev.filter((u) => u.id !== id)); };

  const goToPaper = (paperId: string) => {
    router.push(`/dashboard/papers/${paperId}`);
  };

  const handleDoiImport = async () => {
    if (!doiInput.trim() || !selectedWorkspace) { showErrorToast("DOI and workspace required"); return; }
    setIsImporting(true);
    try {
      const result = await importDoi({ doi: doiInput.trim(), workspaceId: selectedWorkspace }).unwrap();
      showSuccessToast(result.hasPdf ? "Paper imported via DOI with PDF" : "Paper metadata imported (no OA PDF available)");
      setDoiInput("");
      goToPaper(result.paper.id);
    } catch (e: any) { showErrorToast(e?.data?.message || "DOI import failed"); }
    setIsImporting(false);
  };

  const handleArxivImport = async () => {
    if (!arxivInput.trim() || !selectedWorkspace) { showErrorToast("arXiv ID and workspace required"); return; }
    setIsImporting(true);
    try {
      const result = await importArxiv({ arxivId: arxivInput.trim(), workspaceId: selectedWorkspace }).unwrap();
      showSuccessToast(result.hasPdf ? "Paper imported via arXiv with PDF" : "Paper metadata imported (PDF download failed)");
      setArxivInput("");
      goToPaper(result.paper.id);
    } catch (e: any) { showErrorToast(e?.data?.message || "arXiv import failed"); }
    setIsImporting(false);
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim() || !selectedWorkspace) { showErrorToast("URL and workspace required"); return; }
    setIsImporting(true);
    try {
      const result = await importUrl({ url: urlInput.trim(), workspaceId: selectedWorkspace }).unwrap();
      showSuccessToast("Paper imported via URL");
      setUrlInput("");
      goToPaper(result.id);
    } catch (e: any) { showErrorToast(e?.data?.message || "URL import failed"); }
    setIsImporting(false);
  };

  const handleSmartUrlImport = async () => {
    if (!smartUrlInput.trim() || !selectedWorkspace) { showErrorToast("URL and workspace required"); return; }
    setIsImporting(true);
    try {
      const result = await importSmartUrl({ url: smartUrlInput.trim(), workspaceId: selectedWorkspace }).unwrap();
      showSuccessToast(result.hasPdf ? "Paper imported with PDF from " + new URL(smartUrlInput).hostname : "Paper metadata imported (PDF not available)");
      setSmartUrlInput("");
      goToPaper(result.id);
    } catch (e: any) { showErrorToast(e?.data?.message || "Import failed"); }
    setIsImporting(false);
  };

  const completedCount = uploads.filter((u) => u.stage === "complete").length;
  const errorCount = uploads.filter((u) => u.stage === "error").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Papers
          </Link>
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Papers</h1>
          <p className="text-muted-foreground">Add research papers with AI-powered metadata extraction</p>
        </div>
      </div>

      {/* Upload Method Tabs */}
      <div className="bg-card border rounded-2xl p-1">
        <div className="flex gap-1">
          {[
            { key: "file", label: "Upload File", icon: Upload },
            { key: "smart-url", label: "Smart URL", icon: Search },
            { key: "doi", label: "Import DOI", icon: Link2 },
            { key: "arxiv", label: "arXiv ID", icon: BookOpen },
            { key: "url", label: "Direct URL", icon: Globe },
          ].map((method) => (
            <motion.button key={method.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setUploadMethod(method.key as UploadMethod)}
              className={cn("flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                uploadMethod === method.key ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted")}>
              <method.icon className="h-4 w-4" />{method.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Workspace & Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Workspace</label>
          <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
            <option value="">Select workspace...</option>
            {workspaces.map((w: any) => (<option key={w.id} value={w.id}>{w.name}</option>))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
          <Input placeholder="Transformers, NLP, Deep Learning" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Language</label>
          <Input placeholder="en" value={language} onChange={(e) => setLanguage(e.target.value)} maxLength={10} />
        </div>
      </div>

      {/* Smart URL Import */}
      {uploadMethod === "smart-url" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Search className="h-5 w-5" />Smart URL Import</CardTitle>
            <p className="text-sm text-muted-foreground">Paste a URL from any supported site — we auto-detect the source</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="https://ieeexplore.ieee.org/document/... or https://arxiv.org/abs/..." value={smartUrlInput} onChange={(e) => setSmartUrlInput(e.target.value)} className="flex-1" />
              <Button onClick={handleSmartUrlImport} disabled={isImporting}>{isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}Import</Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">arXiv</span>
              <span className="px-2 py-1 bg-muted rounded">IEEE Xplore</span>
              <span className="px-2 py-1 bg-muted rounded">Semantic Scholar</span>
              <span className="px-2 py-1 bg-muted rounded">ResearchGate</span>
              <span className="px-2 py-1 bg-muted rounded">Google Scholar</span>
              <span className="px-2 py-1 bg-muted rounded">Direct PDF link</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      {uploadMethod === "file" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={cn("border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50")}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple accept=".pdf" className="hidden" onChange={handleFileSelect} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Drag & drop PDF files here</h3>
          <p className="text-sm text-muted-foreground mb-4">or click to browse. Supports PDF files up to 50MB.</p>
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Select Files</Button>
        </motion.div>
      )}

      {uploadMethod === "doi" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Import by DOI</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="10.48550/arXiv.1706.03762" value={doiInput} onChange={(e) => setDoiInput(e.target.value)} className="flex-1" />
              <Button onClick={handleDoiImport} disabled={isImporting}>{isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}Import</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Automatically searches Unpaywall and Semantic Scholar for the full PDF</p>
          </CardContent>
        </Card>
      )}

      {uploadMethod === "arxiv" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Import by arXiv ID</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="1706.03762" value={arxivInput} onChange={(e) => setArxivInput(e.target.value)} className="flex-1" />
              <Button onClick={handleArxivImport} disabled={isImporting}>{isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}Import</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Automatically downloads the PDF from arXiv.org</p>
          </CardContent>
        </Card>
      )}

      {uploadMethod === "url" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Import from Direct URL</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="https://example.com/paper.pdf" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="flex-1" />
              <Button onClick={handleUrlImport} disabled={isImporting}>{isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}Import</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">For direct PDF links. Use &ldquo;Smart URL&rdquo; for IEEE/ResearchGate/Google Scholar</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Queue */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Upload Queue ({uploads.length})</h2>
              <span className="text-sm text-muted-foreground">{completedCount} complete, {errorCount} errors</span>
            </div>
            {uploads.map((upload) => {
              const stageIdx = stages.findIndex((s) => s.key === upload.stage);
              return (
                <motion.div key={upload.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div><p className="font-medium text-sm">{upload.file.name}</p><p className="text-xs text-muted-foreground">{upload.stage === "error" ? upload.error : upload.stage}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {upload.stage === "complete" && <Check className="h-5 w-5 text-green-500" />}
                      {upload.stage === "error" && <X className="h-5 w-5 text-destructive" />}
                      {(upload.stage === "uploading" || upload.stage === "extracting" || upload.stage === "analyzing") && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                      <button onClick={() => removeUpload(upload.id)} className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                  {/* Processing stage indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    {stages.map((s, i) => {
                      const isActive = s.key === upload.stage;
                      const isComplete = i < stageIdx || upload.stage === "complete";
                      return (<div key={s.key} className="flex items-center"><div className={cn("w-2 h-2 rounded-full", isComplete ? "bg-green-500" : isActive ? "bg-primary" : "bg-muted")} />{i < stages.length - 1 && <div className={cn("w-4 h-px", i < stageIdx ? "bg-green-500" : "bg-muted")} />}</div>);
                    })}
                  </div>
                  {/* Progress bar */}
                  {upload.stage !== "complete" && upload.stage !== "error" && (
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-primary to-purple-600" initial={{ width: 0 }} animate={{ width: `${upload.progress}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
