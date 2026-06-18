"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  useDeleteExportMutation,
  useExportCitationsMutation,
  useGetHistoryQuery,
  useGetManagerViewQuery,
  useListFormatsQuery,
  type CitationFormatName,
  type CitationPaper,
} from "@/redux/api/citationApi";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAuth } from "@/redux/auth/useAuth";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Brain, Check, CheckCircle2, Copy, Download, FileText, GitBranch, History, Loader2, Network, Quote, Search, Sparkles, TrendingUp, X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

type Tab = "papers" | "preview" | "graph" | "history";

function generateCitation(paper: CitationPaper, format: CitationFormatName): string {
  const authors = paper.authors || [];
  const authorsShort = authors.length > 3 ? `${authors[0]} et al.` : authors.join(", ");
  const year = paper.year || "n.d.";
  const journal = paper.journal || "Journal";
  switch (format) {
    case "BIBTEX":
      return `@article{${paper.id.slice(0, 8)},\n  title     = {${paper.title}},\n  author    = {${authors.join(" and ")}},\n  journal   = {${journal}},\n  year      = {${year}},\n  doi       = {${paper.doi || ""}}\n}`;
    case "APA":
      return `${authorsShort} (${year}). ${paper.title}. ${journal}. https://doi.org/${paper.doi || ""}`;
    case "MLA":
      return `${authorsShort}. "${paper.title}." ${journal}, ${year}.`;
    case "IEEE":
      return `${authorsShort}, "${paper.title}," ${journal}, ${year}.`;
    case "CHICAGO":
      return `${authorsShort}. "${paper.title}." ${journal} (${year}).`;
    case "HARVARD":
      return `${authorsShort} (${year}) '${paper.title}', ${journal}.`;
    case "VANCOUVER":
      return `${authors.join(", ")}. ${paper.title}. ${journal} ${year}. doi:${paper.doi || ""}.`;
    case "ACS":
      return `${authors.join("; ")}. ${paper.title}. ${journal} ${year}. DOI: ${paper.doi || ""}.`;
    case "ENDNOTE":
      return `%0 Journal Article\n%T ${paper.title}\n%A ${authors.join("\n%A ")}\n%J ${journal}\n%D ${year}\n%R doi:${paper.doi || ""}`;
    default:
      return paper.title;
  }
}

const CitationGraph: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const nodes = [
    { id: "central", x: 200, y: 150, type: "central", year: 2020 },
    { id: "cited1", x: 80, y: 80, type: "cited", year: 2015 },
    { id: "cited2", x: 80, y: 150, type: "cited", year: 2016 },
    { id: "cited3", x: 80, y: 220, type: "cited", year: 2018 },
    { id: "citing1", x: 320, y: 80, type: "citing", year: 2021 },
    { id: "citing2", x: 320, y: 150, type: "citing", year: 2022 },
    { id: "citing3", x: 320, y: 220, type: "citing", year: 2023 },
  ];
  const edges = [
    { from: "cited1", to: "central" },
    { from: "cited2", to: "central" },
    { from: "cited3", to: "central" },
    { from: "central", to: "citing1" },
    { from: "central", to: "citing2" },
    { from: "central", to: "citing3" },
  ];
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 h-[300px] overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from)!;
          const to = nodes.find((n) => n.id === e.to)!;
          return (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="currentColor" strokeWidth="2" className="text-muted-foreground"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <circle
              cx={n.x} cy={n.y} r={n.type === "central" ? 25 : 18}
              className={cn(
                n.type === "central" ? "fill-primary" : n.type === "cited" ? "fill-blue-500" : "fill-green-500"
              )}
            />
            <text x={n.x} y={n.y} textAnchor="middle" dy="4" className="fill-white text-xs font-bold">
              {n.year}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500" />References</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary" />Selected</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" />Citations</span>
      </div>
      {!isPremium && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
          PRO
        </div>
      )}
    </div>
  );
};

export default function CitationsPage() {
  const token = useAppSelector(selectAccessToken);
  const { session } = useAuth();
  const userRole = (session?.user as any)?.role || "RESEARCHER";
  const isPremium = ["PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"].includes(userRole);

  const { data: formatsData } = useListFormatsQuery(undefined, { skip: !token });
  const { data: managerData, isLoading: loadingManager, refetch: refetchManager } = useGetManagerViewQuery({ limit: 200 }, { skip: !token });
  const { data: historyData, refetch: refetchHistory } = useGetHistoryQuery({ limit: 50 }, { skip: !token });
  const [exportMutation, { isLoading: exporting }] = useExportCitationsMutation();
  const [deleteExport] = useDeleteExportMutation();

  const formats = formatsData?.data || [];
  const papers: CitationPaper[] = managerData?.data?.papers || [];
  const exports = historyData?.exports || [];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const [selectedFormat, setSelectedFormat] = useState<CitationFormatName>("BIBTEX");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>("papers");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // When formats load, default to first popular one if current is unavailable
  useEffect(() => {
    if (formats.length > 0 && !formats.find((f) => f.name === selectedFormat)) {
      setSelectedFormat(formats[0].name as CitationFormatName);
    }
  }, [formats, selectedFormat]);

  const filteredPapers = useMemo(() => {
    if (!debouncedSearch) return papers;
    const q = debouncedSearch.toLowerCase();
    return papers.filter(
      (p) => p.title.toLowerCase().includes(q) || p.authors.some((a) => a.toLowerCase().includes(q))
    );
  }, [papers, debouncedSearch]);

  const selectedPapers = papers.filter((p) => selectedIds.has(p.id));
  const generatedCitations = useMemo(
    () => selectedPapers.map((p) => generateCitation(p, selectedFormat)).join("\n\n"),
    [selectedPapers, selectedFormat]
  );

  const togglePaper = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const selectAll = () => setSelectedIds(new Set(filteredPapers.map((p) => p.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleCopy = (key: string, text?: string) => {
    setCopied(key);
    if (text) navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleExport = async () => {
    if (selectedPapers.length === 0) {
      showErrorToast("Select at least one paper");
      return;
    }
    try {
      const res = await exportMutation({
        paperIds: Array.from(selectedIds),
        format: selectedFormat,
      }).unwrap();
      setShowExportDialog(true);
      refetchHistory();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Export failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Quote className="h-8 w-8 text-primary" />Citations & References
          </h1>
          <p className="text-muted-foreground mt-1">Generate, preview, and export citations in multiple academic formats</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={tab === "graph" ? "default" : "outline"}
            onClick={() => setTab(tab === "graph" ? "papers" : "graph")}
          >
            <Network className="h-4 w-4 mr-2" />{tab === "graph" ? "Hide" : "Show"} Graph
          </Button>
          <Button variant={tab === "history" ? "default" : "outline"} onClick={() => setTab(tab === "history" ? "papers" : "history")}>
            <History className="h-4 w-4 mr-2" />History
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {tab === "graph" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />Citation Network Visualization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {/* TODO: Phase 8 — wire to real Citation model */}
                    Interactive graph (illustrative — Phase 8 wires to live data)
                  </p>
                </div>
                <CitationGraph isPremium={isPremium} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {tab === "history" ? (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><History className="h-5 w-5" />Export History</h3>
            {exports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No exports yet. Select papers and export to see them here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exports.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium text-sm">{exp.format}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.paper?.title || exp.collection?.name || "Multiple papers"} • {new Date(exp.exportedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={async () => { try { await deleteExport(exp.id).unwrap(); refetchHistory(); } catch {} }} aria-label="Delete export">
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5" />Citation Format</h3>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {formats.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)
                  ) : (
                    formats.map((format) => (
                      <motion.button
                        key={format.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFormat(format.name as CitationFormatName)}
                        className={cn(
                          "relative p-3 rounded-xl border text-left transition-all",
                          selectedFormat === format.name ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{format.name}</span>
                          {format.popular && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">Popular</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{format.description}</p>
                        {selectedFormat === format.name && (
                          <motion.div layoutId="format-indicator" className="absolute -top-1 -right-1">
                            <Check className="h-5 w-5 p-1 bg-primary text-white rounded-full" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5" />Select Papers</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
                    {selectedIds.size > 0 && (
                      <Button variant="link" size="sm" onClick={clearSelection}>Clear</Button>
                    )}
                    {selectedIds.size < filteredPapers.length && (
                      <Button variant="link" size="sm" onClick={selectAll}>Select all</Button>
                    )}
                  </div>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..." className="pl-10" />
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {loadingManager ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)
                  ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      {papers.length === 0 ? "No papers in your library yet. Upload papers first." : "No papers match your search."}
                    </div>
                  ) : (
                    filteredPapers.map((p, i) => {
                      const sel = selectedIds.has(p.id);
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => togglePaper(p.id)}
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm",
                            sel ? "border-primary bg-primary/5 ring-1 ring-primary/50" : "hover:bg-muted/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={sel}
                            onChange={() => togglePaper(p.id)}
                            className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium line-clamp-1">{p.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {(p.authors || []).slice(0, 2).join(", ")}{(p.authors || []).length > 2 && ` +${(p.authors || []).length - 2}`} • {p.year || "n.d."}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              {p.journal && <span className="bg-muted px-1.5 py-0.5 rounded">{p.journal}</span>}
                              {p.citationCount > 0 && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {p.citationCount >= 1000 ? `${(p.citationCount / 1000).toFixed(0)}K` : p.citationCount} citations
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); handleCopy(p.id, generateCitation(p, selectedFormat)); }}
                            aria-label="Copy citation"
                          >
                            {copied === p.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button
                    disabled={selectedIds.size === 0 || exporting}
                    onClick={handleExport}
                    className={cn(
                      "w-full",
                      selectedIds.size > 0 && "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    )}
                    size="lg"
                  >
                    {exporting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Download className="h-5 w-5 mr-2" />}
                    Export {selectedIds.size} Citation{selectedIds.size !== 1 ? "s" : ""} as {selectedFormat}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Live Preview</h3>
                {selectedPapers.length > 0 ? (
                  <div className="relative">
                    <div className="bg-muted/50 rounded-xl p-4 font-mono text-xs max-h-[250px] overflow-auto whitespace-pre-wrap">
                      {generatedCitations}
                    </div>
                    <Button variant="outline" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy("preview", generatedCitations)} aria-label="Copy preview">
                      {copied === "preview" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Quote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Select papers to preview citations</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Brain className="h-5 w-5" />AI Citation Finder
                </h3>
                {!isPremium && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">PRO</span>
                )}
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">Find related papers to strengthen your bibliography</p>
              <Button variant="outline" className="w-full bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300" disabled>
                <Sparkles className="h-4 w-4 mr-2" />Find Related Papers (Phase 8)
              </Button>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><History className="h-5 w-5" />Recent Exports</h3>
                {exports.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">No recent exports</div>
                ) : (
                  <div className="space-y-2">
                    {exports.slice(0, 5).map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{exp.format}</p>
                          <p className="text-xs text-muted-foreground">{new Date(exp.exportedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showExportDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowExportDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Export Ready</h3>
                  <p className="text-sm text-muted-foreground">{selectedPapers.length} citations in {selectedFormat} format</p>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs max-h-64 overflow-auto mb-4 whitespace-pre-wrap">
                {generatedCitations}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { handleCopy("export", generatedCitations); setShowExportDialog(false); }}>
                  <Copy className="h-4 w-4 mr-2" />Copy to Clipboard
                </Button>
                <Button className="flex-1" onClick={() => { showSuccessToast("Saved to your history"); setShowExportDialog(false); }}>
                  <Download className="h-4 w-4 mr-2" />Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
