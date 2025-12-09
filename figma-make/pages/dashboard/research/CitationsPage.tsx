"use client";

/**
 * CitationsPage - Enhanced Citation Management
 *
 * Features:
 * - Interactive citation graph visualization
 * - Citation format preview with live generation
 * - AI-powered citation suggestions
 * - Batch export with multiple formats
 * - Citation impact analysis
 * - Framer Motion animations
 */

import {
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  GitBranch,
  History,
  Network,
  Quote,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface CitationsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  doi?: string;
  citationCount: number;
  selected: boolean;
}

interface CitationNode {
  id: string;
  title: string;
  year: number;
  type: "citing" | "cited" | "central";
  x: number;
  y: number;
}

interface CitationEdge {
  from: string;
  to: string;
}

// ============================================================================
// Sample Data
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

const citationFormats = [
  {
    name: "BibTeX",
    ext: ".bib",
    description: "LaTeX bibliography format",
    popular: true,
  },
  {
    name: "APA 7th",
    ext: ".txt",
    description: "American Psychological Association",
    popular: true,
  },
  {
    name: "MLA 9th",
    ext: ".txt",
    description: "Modern Language Association",
    popular: false,
  },
  {
    name: "IEEE",
    ext: ".txt",
    description: "Engineering & Computer Science",
    popular: true,
  },
  {
    name: "Chicago",
    ext: ".txt",
    description: "Chicago Manual of Style",
    popular: false,
  },
  {
    name: "Harvard",
    ext: ".txt",
    description: "Harvard referencing style",
    popular: false,
  },
  {
    name: "Vancouver",
    ext: ".txt",
    description: "Medical & scientific papers",
    popular: false,
  },
  {
    name: "ACS",
    ext: ".txt",
    description: "American Chemical Society",
    popular: false,
  },
];

const dummyPapers: Paper[] = [
  {
    id: "p1",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    journal: "NeurIPS",
    doi: "10.5555/3295222.3295349",
    citationCount: 89542,
    selected: false,
  },
  {
    id: "p2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee"],
    year: 2018,
    journal: "NAACL",
    doi: "10.18653/v1/N19-1423",
    citationCount: 67234,
    selected: false,
  },
  {
    id: "p3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann"],
    year: 2020,
    journal: "NeurIPS",
    doi: "10.5555/3495724.3495883",
    citationCount: 45123,
    selected: false,
  },
  {
    id: "p4",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["Kaiming He", "Xiangyu Zhang"],
    year: 2015,
    journal: "CVPR",
    doi: "10.1109/CVPR.2016.90",
    citationCount: 123456,
    selected: false,
  },
  {
    id: "p5",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Edward J. Hu", "Yelong Shen"],
    year: 2021,
    journal: "arXiv",
    doi: "10.48550/arXiv.2106.09685",
    citationCount: 12456,
    selected: false,
  },
];

const citationGraphNodes: CitationNode[] = [
  {
    id: "central",
    title: "Your Selected Paper",
    year: 2020,
    type: "central",
    x: 200,
    y: 150,
  },
  {
    id: "cited1",
    title: "Foundation Paper A",
    year: 2015,
    type: "cited",
    x: 80,
    y: 80,
  },
  {
    id: "cited2",
    title: "Foundation Paper B",
    year: 2016,
    type: "cited",
    x: 80,
    y: 150,
  },
  {
    id: "cited3",
    title: "Related Work C",
    year: 2018,
    type: "cited",
    x: 80,
    y: 220,
  },
  {
    id: "citing1",
    title: "Follow-up Study X",
    year: 2021,
    type: "citing",
    x: 320,
    y: 80,
  },
  {
    id: "citing2",
    title: "Extension Paper Y",
    year: 2022,
    type: "citing",
    x: 320,
    y: 150,
  },
  {
    id: "citing3",
    title: "Application Z",
    year: 2023,
    type: "citing",
    x: 320,
    y: 220,
  },
];

const citationGraphEdges: CitationEdge[] = [
  { from: "cited1", to: "central" },
  { from: "cited2", to: "central" },
  { from: "cited3", to: "central" },
  { from: "central", to: "citing1" },
  { from: "central", to: "citing2" },
  { from: "central", to: "citing3" },
];

const exportHistory = [
  {
    id: "h1",
    format: "BibTeX",
    paperCount: 5,
    date: "Jan 15, 2025",
    time: "14:30",
  },
  {
    id: "h2",
    format: "APA 7th",
    paperCount: 3,
    date: "Jan 14, 2025",
    time: "10:15",
  },
  {
    id: "h3",
    format: "IEEE",
    paperCount: 8,
    date: "Jan 12, 2025",
    time: "16:45",
  },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function generateCitation(paper: Paper, format: string): string {
  const authors = paper.authors.join(", ");
  const authorsShort =
    paper.authors.length > 3 ? `${paper.authors[0]} et al.` : authors;

  switch (format) {
    case "BibTeX":
      return `@article{${paper.id},
  title     = {${paper.title}},
  author    = {${paper.authors.join(" and ")}},
  journal   = {${paper.journal || "Journal"}},
  year      = {${paper.year}},
  doi       = {${paper.doi || ""}}
}`;
    case "APA 7th":
      return `${authorsShort} (${paper.year}). ${paper.title}. ${paper.journal || "Journal"}. https://doi.org/${paper.doi || ""}`;
    case "MLA 9th":
      return `${authorsShort}. "${paper.title}." ${paper.journal || "Journal"}, ${paper.year}.`;
    case "IEEE":
      return `${authorsShort}, "${paper.title}," ${paper.journal || "Journal"}, ${paper.year}.`;
    case "Chicago":
      return `${authorsShort}. "${paper.title}." ${paper.journal || "Journal"} (${paper.year}).`;
    case "Harvard":
      return `${authorsShort} (${paper.year}) '${paper.title}', ${paper.journal || "Journal"}.`;
    default:
      return paper.title;
  }
}

// ============================================================================
// Citation Graph Component
// ============================================================================
const CitationGraph: React.FC<{ selectedPaperId?: string }> = ({
  selectedPaperId,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 h-[300px] overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Edges */}
        {citationGraphEdges.map((edge, i) => {
          const from = citationGraphNodes.find((n) => n.id === edge.from);
          const to = citationGraphNodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </marker>
        </defs>

        {/* Nodes */}
        {citationGraphNodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === "central" ? 25 : 18}
              className={cn(
                "transition-all duration-200",
                node.type === "central"
                  ? "fill-primary"
                  : node.type === "cited"
                    ? "fill-blue-500"
                    : "fill-green-500",
                hoveredNode === node.id && "filter drop-shadow-lg"
              )}
              style={{
                transform: hoveredNode === node.id ? "scale(1.1)" : "scale(1)",
                transformOrigin: `${node.x}px ${node.y}px`,
              }}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="4"
              className="fill-white text-xs font-bold"
            >
              {node.year}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          References
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Citations
        </span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-2 right-2 bg-background border rounded-lg p-3 shadow-lg max-w-[200px]"
          >
            <p className="font-medium text-sm line-clamp-2">
              {citationGraphNodes.find((n) => n.id === hoveredNode)?.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Citations Page Component
// ============================================================================
export function CitationsPage({
  onNavigate,
  role: propRole,
}: CitationsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  // State
  const [papers, setPapers] = useState(dummyPapers);
  const [selectedFormat, setSelectedFormat] = useState("BibTeX");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showGraphView, setShowGraphView] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"papers" | "preview" | "graph">(
    "papers"
  );

  const selectedPapers = papers.filter((p) => p.selected);
  const filteredPapers = papers.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.authors.some((a) => a.toLowerCase().includes(query))
    );
  });

  const togglePaper = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAll = () => {
    setPapers((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const clearSelection = () => {
    setPapers((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const handleCopy = (id: string, text?: string) => {
    setCopiedId(id);
    if (text) navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generatedCitations = useMemo(() => {
    return selectedPapers
      .map((p) => generateCitation(p, selectedFormat))
      .join("\n\n");
  }, [selectedPapers, selectedFormat]);

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/citations"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Quote className="h-8 w-8 text-primary" />
              Citations & References
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate, preview, and export citations in multiple academic
              formats
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGraphView(!showGraphView)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors",
                showGraphView &&
                  "bg-primary text-primary-foreground border-primary"
              )}
            >
              <Network className="h-4 w-4" />
              {showGraphView ? "Hide" : "Show"} Graph
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted"
            >
              <History className="h-4 w-4" />
              History
            </motion.button>
          </div>
        </div>

        {/* Citation Graph (Collapsible) */}
        <AnimatePresence>
          {showGraphView && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Citation Network Visualization
                    {!isPremiumUser && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                        PRO
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive graph showing paper relationships
                  </p>
                </div>
                <CitationGraph selectedPaperId={selectedPapers[0]?.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Citation Format
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                {citationFormats.map((format) => (
                  <motion.button
                    key={format.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFormat(format.name)}
                    className={cn(
                      "relative p-3 rounded-xl border text-left transition-all",
                      selectedFormat === format.name
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{format.name}</span>
                      {format.popular && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {format.description}
                    </p>
                    {selectedFormat === format.name && (
                      <motion.div
                        layoutId="format-indicator"
                        className="absolute -top-1 -right-1"
                      >
                        <Check className="h-5 w-5 p-1 bg-primary text-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Papers Selection */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Select Papers
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedPapers.length} selected
                  </span>
                  {selectedPapers.length > 0 && (
                    <button
                      onClick={clearSelection}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  {selectedPapers.length < papers.length && (
                    <button
                      onClick={selectAll}
                      className="text-sm text-primary hover:underline"
                    >
                      Select all
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background"
                />
              </div>

              {/* Papers List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredPapers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => togglePaper(paper.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm",
                      paper.selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/50"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={paper.selected}
                      onChange={() => togglePaper(paper.id)}
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">
                        {paper.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {paper.authors.slice(0, 2).join(", ")}
                        {paper.authors.length > 2 &&
                          ` +${paper.authors.length - 2}`}{" "}
                        • {paper.year}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {paper.journal && (
                          <span className="bg-muted px-1.5 py-0.5 rounded">
                            {paper.journal}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {(paper.citationCount / 1000).toFixed(0)}K citations
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(
                          paper.id,
                          generateCitation(paper, selectedFormat)
                        );
                      }}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      {copiedId === paper.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Export Button */}
              <div className="mt-4 pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedPapers.length === 0}
                  onClick={() => setShowExportDialog(true)}
                  className={cn(
                    "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                    selectedPapers.length > 0
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Download className="h-5 w-5" />
                  Export {selectedPapers.length} Citation
                  {selectedPapers.length !== 1 ? "s" : ""} as {selectedFormat}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                Live Preview
              </h3>
              {selectedPapers.length > 0 ? (
                <div className="relative">
                  <div className="bg-muted/50 rounded-xl p-4 font-mono text-xs max-h-[250px] overflow-auto whitespace-pre-wrap">
                    {generatedCitations}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy("preview", generatedCitations)}
                    className="absolute top-2 right-2 p-2 bg-background border rounded-lg hover:bg-muted"
                  >
                    {copiedId === "preview" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Quote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select papers to preview citations</p>
                </div>
              )}
            </div>

            {/* AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Brain className="h-5 w-5" />
                  AI Citation Finder
                </h3>
                {!isPremiumUser && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                Find related papers to strengthen your bibliography
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-gray-900"
              >
                <Sparkles className="h-4 w-4" />
                Find Related Papers
              </motion.button>
            </motion.div>

            {/* Export History */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <History className="h-5 w-5" />
                Recent Exports
              </h3>
              <div className="space-y-2">
                {exportHistory.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{exp.format}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.paperCount} papers • {exp.date}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-background rounded-lg"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Dialog */}
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
                    <p className="text-sm text-muted-foreground">
                      {selectedPapers.length} citations in {selectedFormat}{" "}
                      format
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs max-h-64 overflow-auto mb-4 whitespace-pre-wrap">
                  {generatedCitations}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleCopy("export", generatedCitations);
                      setShowExportDialog(false);
                    }}
                    className="flex-1 py-2.5 border rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowExportDialog(false)}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default CitationsPage;
