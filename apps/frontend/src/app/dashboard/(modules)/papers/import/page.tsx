"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import { useUploadPaperMutation, useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Book,
  BookOpen,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  File,
  FileText,
  FolderOpen,
  HelpCircle,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ImportSource =
  | "bibtex"
  | "ris"
  | "doi"
  | "zotero"
  | "mendeley"
  | "endnote";

interface ImportedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: string;
  status: "pending" | "importing" | "success" | "error" | "duplicate";
  errorMessage?: string;
  doi?: string;
  selected: boolean;
}

interface ImportOptions {
  downloadPdfs: boolean;
  extractMetadata: boolean;
  addToCollection: boolean;
  skipDuplicates: boolean;
}

const importSources: {
  id: ImportSource;
  name: string;
  icon: React.ReactNode;
  description: string;
  accepts?: string;
}[] = [
  {
    id: "bibtex",
    name: "BibTeX File",
    icon: <FileText className="h-6 w-6" />,
    description: "Import from .bib files exported from any reference manager",
    accepts: ".bib,.bibtex",
  },
  {
    id: "ris",
    name: "RIS File",
    icon: <File className="h-6 w-6" />,
    description: "Import from .ris format (Research Information Systems)",
    accepts: ".ris",
  },
  {
    id: "doi",
    name: "DOI / URL",
    icon: <Link2 className="h-6 w-6" />,
    description: "Import papers by pasting DOIs or paper URLs",
  },
  {
    id: "zotero",
    name: "Zotero",
    icon: <Book className="h-6 w-6" />,
    description: "Connect to your Zotero library and sync references",
  },
  {
    id: "mendeley",
    name: "Mendeley",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Import papers from your Mendeley account",
  },
  {
    id: "endnote",
    name: "EndNote",
    icon: <Database className="h-6 w-6" />,
    description: "Import from EndNote XML or RIS export files",
    accepts: ".xml,.enl",
  },
];

// Simple BibTeX parser (client-side)
function parseBibTeX(content: string): ImportedPaper[] {
  const entries: ImportedPaper[] = [];
  // Match @type{key, ... } blocks
  const regex = /@(\w+)\s*\{([^,]*),([^@]*)\}/g;
  let match;
  let idx = 0;

  while ((match = regex.exec(content)) !== null) {
    const fields = match[3];
    const getField = (name: string): string => {
      const fieldMatch = new RegExp(
        `${name}\\s*=\\s*[{"]([^}"]*)[}"]`,
        "i"
      ).exec(fields);
      return fieldMatch ? fieldMatch[1].trim() : "";
    };

    const title = getField("title");
    const authorStr = getField("author");
    const year = parseInt(getField("year")) || new Date().getFullYear();
    const doi = getField("doi");
    const journal = getField("journal") || getField("booktitle");

    if (title) {
      entries.push({
        id: `import-${idx++}`,
        title,
        authors: authorStr
          ? authorStr.split(" and ").map((a) => a.trim())
          : ["Unknown"],
        year,
        source: journal || "Unknown",
        doi: doi || undefined,
        status: "pending",
        selected: true,
      });
    }
  }

  return entries;
}

// Simple RIS parser
function parseRIS(content: string): ImportedPaper[] {
  const entries: ImportedPaper[] = [];
  const blocks = content.split(/^ER\s*-/m);
  let idx = 0;

  for (const block of blocks) {
    const getTag = (tag: string): string[] => {
      const matches = block.matchAll(new RegExp(`^${tag}\\s*-\\s*(.+)$`, "gm"));
      return Array.from(matches, (m) => m[1].trim());
    };

    const titles = getTag("TI").concat(getTag("T1"));
    const title = titles[0] || "";
    const authors = getTag("AU").concat(getTag("A1"));
    const year =
      parseInt(getTag("PY")[0] || getTag("Y1")[0] || "") ||
      new Date().getFullYear();
    const doi = getTag("DO")[0] || "";
    const journal = getTag("JO")[0] || getTag("T2")[0] || "";

    if (title) {
      entries.push({
        id: `import-${idx++}`,
        title,
        authors: authors.length > 0 ? authors : ["Unknown"],
        year,
        source: journal || "Unknown",
        doi: doi || undefined,
        status: "pending",
        selected: true,
      });
    }
  }

  return entries;
}

export default function ImportPapersPage() {
  const { user, isAuthenticated } = useProtectedRoute();
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(
    null
  );
  const [previewPapers, setPreviewPapers] = useState<ImportedPaper[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [doiInput, setDoiInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    duplicates: number;
  } | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    downloadPdfs: true,
    extractMetadata: true,
    addToCollection: false,
    skipDuplicates: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPaper] = useUploadPaperMutation();

  const { data: workspacesData } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });

  // Auto-select first workspace
  useEffect(() => {
    const workspaces = workspacesData?.data || [];
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspacesData, selectedWorkspaceId]);

  const scopedPath = useCallback(
    (segment: string) => buildRoleScopedPath(user?.role, segment),
    [user?.role]
  );

  if (!isAuthenticated) return null;

  const handleFileRead = (file: globalThis.File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let papers: ImportedPaper[] = [];

      if (file.name.endsWith(".bib") || file.name.endsWith(".bibtex")) {
        papers = parseBibTeX(content);
      } else if (file.name.endsWith(".ris")) {
        papers = parseRIS(content);
      }

      if (papers.length > 0) {
        setPreviewPapers(papers);
        setShowPreview(true);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0]);
    }
  };

  const handleSourceSelect = (source: ImportSource) => {
    setSelectedSource(source);
    if (source !== "doi") {
      // Open file dialog for file-based sources
      setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  const handleImportDOIs = () => {
    if (!doiInput.trim()) return;

    const lines = doiInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const papers: ImportedPaper[] = lines.map((line, idx) => ({
      id: `doi-${idx}`,
      title: line.startsWith("http") ? `Paper from ${new URL(line).hostname}` : `DOI: ${line}`,
      authors: ["Fetching..."],
      year: new Date().getFullYear(),
      source: line,
      doi: line.startsWith("10.") ? line : undefined,
      status: "pending" as const,
      selected: true,
    }));

    setPreviewPapers(papers);
    setShowPreview(true);
  };

  const handleStartImport = async () => {
    if (!selectedWorkspaceId) return;

    setIsImporting(true);
    let success = 0;
    let failed = 0;
    let duplicates = 0;

    const selected = previewPapers.filter((p) => p.selected && p.status === "pending");

    for (let i = 0; i < selected.length; i++) {
      const paper = selected[i];

      // Update status to importing
      setPreviewPapers((prev) =>
        prev.map((p) =>
          p.id === paper.id ? { ...p, status: "importing" as const } : p
        )
      );

      try {
        // Create a minimal text file as a placeholder for the paper
        const blob = new Blob(
          [
            `Title: ${paper.title}\nAuthors: ${paper.authors.join(", ")}\nYear: ${paper.year}\nSource: ${paper.source}${paper.doi ? `\nDOI: ${paper.doi}` : ""}`,
          ],
          { type: "text/plain" }
        );
        const file = new globalThis.File([blob], `${paper.title.slice(0, 50)}.txt`, {
          type: "text/plain",
        });

        await uploadPaper({
          workspaceId: selectedWorkspaceId,
          title: paper.title,
          authors: paper.authors,
          year: paper.year,
          source: paper.source,
          file,
        }).unwrap();

        success++;
        setPreviewPapers((prev) =>
          prev.map((p) =>
            p.id === paper.id ? { ...p, status: "success" as const } : p
          )
        );
      } catch (err: any) {
        if (err?.data?.message?.includes("duplicate")) {
          duplicates++;
          setPreviewPapers((prev) =>
            prev.map((p) =>
              p.id === paper.id
                ? { ...p, status: "duplicate" as const }
                : p
            )
          );
        } else {
          failed++;
          setPreviewPapers((prev) =>
            prev.map((p) =>
              p.id === paper.id
                ? {
                    ...p,
                    status: "error" as const,
                    errorMessage: err?.data?.message || "Import failed",
                  }
                : p
            )
          );
        }
      }
    }

    setIsImporting(false);
    setImportComplete(true);
    setImportResults({ success, failed, duplicates });
  };

  const togglePaperSelection = (paperId: string) => {
    setPreviewPapers((prev) =>
      prev.map((p) =>
        p.id === paperId ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const selectAll = () => {
    setPreviewPapers((prev) =>
      prev.map((p) => ({ ...p, selected: p.status === "pending" }))
    );
  };

  const getStatusIcon = (status: ImportedPaper["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "duplicate":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "importing":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const resetImport = () => {
    setSelectedSource(null);
    setShowPreview(false);
    setPreviewPapers([]);
    setDoiInput("");
    setImportComplete(false);
    setImportResults(null);
  };

  // Hidden file input
  const acceptTypes =
    importSources.find((s) => s.id === selectedSource)?.accepts || ".bib,.ris";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Import Papers
              </h1>
              <p className="text-muted-foreground">
                Import references from your favorite tools and formats
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={scopedPath("/papers")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              View Library
            </Link>
          </Button>
        </div>

        {/* Workspace Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <label className="text-sm font-medium">
                  Import to Workspace:
                </label>
              </div>
              <Select
                value={selectedWorkspaceId}
                onValueChange={setSelectedWorkspaceId}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  {(workspacesData?.data || []).map((workspace: any) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{workspace.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {workspace.role || workspace.userRole}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Import Source Selection */}
        {!selectedSource && !showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4">
              Choose Import Source
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {importSources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
                    onClick={() => handleSourceSelect(source.id)}
                  >
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        {source.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {source.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mt-6 p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="inline-flex p-4 rounded-2xl bg-muted mb-4">
                <Upload
                  className={`h-8 w-8 ${
                    dragActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drop files here</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop BibTeX, RIS, or EndNote files to import
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSource("bibtex");
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </Button>
            </div>
          </motion.div>
        )}

        {/* DOI Input Section */}
        {selectedSource === "doi" && !showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit mb-2"
                  onClick={() => setSelectedSource(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sources
                </Button>
                <CardTitle>Import by DOI or URL</CardTitle>
                <CardDescription>
                  Enter DOIs or paper URLs, one per line. We&apos;ll
                  automatically fetch the metadata.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={doiInput}
                  onChange={(e) => setDoiInput(e.target.value)}
                  placeholder={`10.1000/xyz123\n10.1000/abc456\nhttps://arxiv.org/abs/2301.12345`}
                  className="h-40 font-mono text-sm"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {doiInput.split("\n").filter((l) => l.trim()).length}
                    </span>{" "}
                    items detected
                  </p>
                  <Button
                    onClick={handleImportDOIs}
                    disabled={!doiInput.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Fetch Papers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Zotero/Mendeley placeholder */}
        {selectedSource &&
          ["zotero", "mendeley"].includes(selectedSource) &&
          !showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit mb-2"
                    onClick={() => setSelectedSource(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sources
                  </Button>
                  <CardTitle className="capitalize">
                    {selectedSource} Integration
                  </CardTitle>
                  <CardDescription>
                    {selectedSource === "zotero"
                      ? "Connect to your Zotero library"
                      : "Connect to your Mendeley account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 rounded-2xl bg-muted mb-4">
                      {selectedSource === "zotero" ? (
                        <Book className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Direct {selectedSource} integration is coming soon. In
                      the meantime, you can export your library as a BibTeX
                      file and import it here.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSource("bibtex")}
                    >
                      Import BibTeX Instead
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* Import Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetImport}
                disabled={isImporting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {previewPapers.length}
                  </span>{" "}
                  papers found
                </span>
                {!importComplete && (
                  <Button
                    onClick={handleStartImport}
                    disabled={
                      isImporting ||
                      !selectedWorkspaceId ||
                      previewPapers.filter((p) => p.selected && p.status === "pending").length === 0
                    }
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Import{" "}
                        {
                          previewPapers.filter(
                            (p) => p.selected && p.status === "pending"
                          ).length
                        }{" "}
                        Papers
                      </>
                    )}
                  </Button>
                )}
                {importComplete && (
                  <Button onClick={resetImport}>
                    <Plus className="h-4 w-4 mr-2" />
                    Import More
                  </Button>
                )}
              </div>
            </div>

            {/* Import Results */}
            {importResults && (
              <Card className="border-emerald-200 dark:border-emerald-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold">Import Complete!</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                      <p className="text-2xl font-bold text-emerald-600">
                        {importResults.success}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Imported
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                      <p className="text-2xl font-bold text-amber-600">
                        {importResults.duplicates}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duplicates
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <p className="text-2xl font-bold text-red-600">
                        {importResults.failed}
                      </p>
                      <p className="text-sm text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Stats */}
            {!importComplete && (
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {
                        previewPapers.filter(
                          (p) => p.status === "pending" && p.selected
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ready to Import
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {
                        previewPapers.filter((p) => p.status === "duplicate")
                          .length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duplicates
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {
                        previewPapers.filter((p) => p.status === "error")
                          .length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Papers List */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Papers to Import</CardTitle>
                  {!importComplete && (
                    <div className="flex items-center gap-2 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAll}
                        disabled={isImporting}
                      >
                        Select All
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="divide-y">
                  {previewPapers.map((paper, index) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
                    >
                      {!importComplete && (
                        <input
                          type="checkbox"
                          checked={paper.selected}
                          onChange={() => togglePaperSelection(paper.id)}
                          disabled={
                            paper.status !== "pending" || isImporting
                          }
                          className="mt-1 h-4 w-4 rounded border-border"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{paper.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {paper.authors.join(", ")} • {paper.year}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{paper.source}</span>
                              {paper.doi && (
                                <span className="font-mono">
                                  DOI: {paper.doi}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(paper.status)}
                            {paper.status === "duplicate" && (
                              <span className="text-xs text-amber-500 font-medium">
                                Already exists
                              </span>
                            )}
                            {paper.status === "success" && (
                              <span className="text-xs text-emerald-500 font-medium">
                                Imported
                              </span>
                            )}
                          </div>
                        </div>

                        {paper.errorMessage && (
                          <div className="mt-2 p-2 rounded-lg bg-destructive/10 text-sm text-destructive">
                            {paper.errorMessage}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Import Options */}
            {!importComplete && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Import Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "extractMetadata" as const,
                        label: "Extract Metadata",
                        desc: "Enrich with abstract, keywords, citations",
                      },
                      {
                        key: "skipDuplicates" as const,
                        label: "Skip Duplicates",
                        desc: "Don't import papers already in library",
                      },
                      {
                        key: "downloadPdfs" as const,
                        label: "Download PDFs",
                        desc: "Automatically fetch available PDFs",
                      },
                      {
                        key: "addToCollection" as const,
                        label: "Add to Collection",
                        desc: "Automatically organize imported papers",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:border-primary/30 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={importOptions[opt.key]}
                          onChange={(e) =>
                            setImportOptions((prev) => ({
                              ...prev,
                              [opt.key]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-border"
                        />
                        <div>
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {opt.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Help Section */}
        <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Need Help Importing?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to export references from your favorite tools or
                  troubleshoot common issues.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="link" className="h-auto p-0 text-primary">
                    Export from Zotero{" "}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                  <Button variant="link" className="h-auto p-0 text-primary">
                    Export from Mendeley{" "}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                  <Button variant="link" className="h-auto p-0 text-primary">
                    View FAQ <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
