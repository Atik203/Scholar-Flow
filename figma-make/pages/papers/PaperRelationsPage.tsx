"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  GitBranch,
  Layers,
  Link2,
  Maximize2,
  Quote,
  RefreshCw,
  Search,
  Share2,
  Star,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface PaperRelationsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
  paperId?: string;
}

// Mock data for current paper
const mockCurrentPaper = {
  id: "paper-001",
  title:
    "Transformer Models for Natural Language Understanding: A Comprehensive Survey",
  authors: ["Dr. Sarah Chen", "Prof. James Wilson", "Dr. Emily Rodriguez"],
  year: 2024,
  journal: "Nature Machine Intelligence",
  doi: "10.1038/s41234-024-00123",
  citations: 145,
  references: 78,
  abstract:
    "This comprehensive survey explores the evolution and applications of transformer-based models in natural language understanding tasks, covering architecture innovations, training methodologies, and real-world deployments.",
};

// Mock data for citations (papers that cite this paper)
const mockCitations = [
  {
    id: "cite-001",
    title:
      "Efficient Fine-tuning of Large Language Models for Domain Adaptation",
    authors: ["Michael Chang", "Dr. Anna Schmidt"],
    year: 2024,
    journal: "ACL 2024",
    relevance: 95,
    citationContext:
      "Building on the survey by Chen et al. (2024), we propose...",
  },
  {
    id: "cite-002",
    title: "Multi-modal Transformers for Visual Question Answering",
    authors: ["Prof. Robert Liu", "Jennifer Wu"],
    year: 2024,
    journal: "CVPR 2024",
    relevance: 88,
    citationContext:
      "Following the taxonomy presented in [Chen et al., 2024]...",
  },
  {
    id: "cite-003",
    title: "Attention Mechanisms in Low-Resource Language Processing",
    authors: ["Dr. Fatima Al-Sayed", "David Park"],
    year: 2024,
    journal: "EMNLP 2024",
    relevance: 82,
    citationContext: "As noted in the comprehensive survey [Chen et al.]...",
  },
  {
    id: "cite-004",
    title: "Transformer Efficiency: Reducing Computational Costs",
    authors: ["Dr. Alex Kumar"],
    year: 2024,
    journal: "NeurIPS 2024",
    relevance: 78,
    citationContext: "The survey by Chen et al. highlights the need for...",
  },
];

// Mock data for references (papers this paper cites)
const mockReferences = [
  {
    id: "ref-001",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "et al."],
    year: 2017,
    journal: "NeurIPS 2017",
    relevance: 100,
    category: "foundational",
  },
  {
    id: "ref-002",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "et al."],
    year: 2019,
    journal: "NAACL 2019",
    relevance: 98,
    category: "foundational",
  },
  {
    id: "ref-003",
    title: "Language Models are Few-Shot Learners",
    authors: ["Tom Brown", "et al."],
    year: 2020,
    journal: "NeurIPS 2020",
    relevance: 95,
    category: "foundational",
  },
  {
    id: "ref-004",
    title: "Training Language Models to Follow Instructions",
    authors: ["OpenAI Team"],
    year: 2022,
    journal: "arXiv",
    relevance: 90,
    category: "methodology",
  },
  {
    id: "ref-005",
    title: "Scaling Laws for Neural Language Models",
    authors: ["Jared Kaplan", "et al."],
    year: 2020,
    journal: "arXiv",
    relevance: 85,
    category: "analysis",
  },
];

// Mock data for related papers (similar but not directly connected)
const mockRelatedPapers = [
  {
    id: "related-001",
    title: "A Survey of Large Language Models",
    authors: ["Wayne Xin Zhao", "et al."],
    year: 2023,
    similarity: 92,
    sharedReferences: 34,
  },
  {
    id: "related-002",
    title: "Pre-trained Language Models: A Survey",
    authors: ["Qiu Xipeng", "et al."],
    year: 2022,
    similarity: 88,
    sharedReferences: 28,
  },
  {
    id: "related-003",
    title: "Natural Language Processing Advancements",
    authors: ["Dr. Lisa Wang"],
    year: 2024,
    similarity: 85,
    sharedReferences: 25,
  },
];

export const PaperRelationsPage: React.FC<PaperRelationsPageProps> = ({
  onNavigate,
  role: propRole,
  paperId = "paper-001",
}) => {
  const [activeTab, setActiveTab] = useState<
    "citations" | "references" | "related"
  >("citations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<
    (typeof mockCitations)[0] | null
  >(null);
  const [viewMode, setViewMode] = useState<"list" | "graph">("list");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const filterPapers = (papers: typeof mockCitations) => {
    if (!searchQuery) return papers;
    return papers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) =>
          a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  const tabs = [
    {
      id: "citations",
      label: "Cited By",
      count: mockCitations.length,
      icon: ArrowLeft,
    },
    {
      id: "references",
      label: "References",
      count: mockReferences.length,
      icon: ArrowRight,
    },
    {
      id: "related",
      label: "Related Papers",
      count: mockRelatedPapers.length,
      icon: Link2,
    },
  ];

  const PaperCard: React.FC<{
    paper:
      | (typeof mockCitations)[0]
      | (typeof mockReferences)[0]
      | (typeof mockRelatedPapers)[0];
    type: "citation" | "reference" | "related";
    index: number;
  }> = ({ paper, type, index }) => {
    const relevance =
      "relevance" in paper
        ? paper.relevance
        : "similarity" in paper
          ? paper.similarity
          : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => setSelectedPaper(paper as (typeof mockCitations)[0])}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {paper.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {paper.authors.slice(0, 2).join(", ")}
              {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
            </p>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              relevance >= 90
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : relevance >= 80
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
            }`}
          >
            {relevance}% {type === "related" ? "similar" : "relevant"}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {paper.year}
          </span>
          {"journal" in paper && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {paper.journal}
            </span>
          )}
          {"sharedReferences" in paper && (
            <span className="flex items-center gap-1">
              <Link2 className="w-4 h-4" />
              {paper.sharedReferences} shared refs
            </span>
          )}
        </div>

        {"citationContext" in paper && paper.citationContext && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              <Quote className="w-4 h-4 inline mr-1 text-indigo-500" />
              {paper.citationContext}
            </p>
          </div>
        )}

        {"category" in paper && (
          <div className="mt-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                paper.category === "foundational"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : paper.category === "methodology"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
              }`}
            >
              {paper.category}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/papers/${paper.id}`);
            }}
            className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Eye className="w-4 h-4" />
            View Paper
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
          >
            <Star className="w-4 h-4" />
            Save
          </button>
        </div>
      </motion.div>
    );
  };

  const GraphView = () => {
    // Simple graph visualization placeholder
    const nodes = [
      { id: "center", x: 50, y: 50, label: "Current Paper", type: "center" },
      ...mockCitations.slice(0, 3).map((c, i) => ({
        id: c.id,
        x: 20 + i * 25,
        y: 15,
        label: c.title.slice(0, 30) + "...",
        type: "citation",
      })),
      ...mockReferences.slice(0, 4).map((r, i) => ({
        id: r.id,
        x: 10 + i * 20,
        y: 85,
        label: r.title.slice(0, 30) + "...",
        type: "reference",
      })),
    ];

    return (
      <div
        ref={graphRef}
        className="relative w-full h-[500px] bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
      >
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes
            .filter((n) => n.type !== "center")
            .map((node) => (
              <motion.line
                key={`line-${node.id}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x1="50%"
                y1="50%"
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={node.type === "citation" ? "#6366f1" : "#10b981"}
                strokeWidth="2"
                strokeDasharray={node.type === "citation" ? "none" : "5,5"}
                opacity={0.5}
              />
            ))}
        </svg>

        {/* Nodes */}
        {nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              node.type === "center" ? "w-32 h-32" : "w-24 h-24"
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center p-2 text-center ${
                node.type === "center"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                  : node.type === "citation"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:scale-110 transition-transform"
                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:scale-110 transition-transform"
              }`}
            >
              <span className="text-[10px] font-medium line-clamp-3">
                {node.type === "center" ? "📄 Current" : node.label}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Cites This
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Referenced
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Current Paper Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Paper Relations
                  </p>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockCurrentPaper.title}
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {mockCurrentPaper.authors.join(", ")} • {mockCurrentPaper.year}{" "}
                • {mockCurrentPaper.journal}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {mockCurrentPaper.citations} citations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {mockCurrentPaper.references} references
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <a
                    href={`https://doi.org/${mockCurrentPaper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    DOI: {mockCurrentPaper.doi}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "graph" : "list")
                }
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === "list" ? (
                  <GitBranch className="w-4 h-4" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
                {viewMode === "list" ? "Graph View" : "List View"}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Graph View Controls (when in graph mode) */}
        {viewMode === "graph" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Export Graph
            </button>
          </motion.div>
        )}

        {viewMode === "graph" ? (
          <GraphView />
        ) : (
          <>
            {/* Tabs and Search */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search papers..."
                    className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Paper List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                {activeTab === "citations" &&
                  filterPapers(mockCitations).map((paper, idx) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      type="citation"
                      index={idx}
                    />
                  ))}
                {activeTab === "references" &&
                  filterPapers(mockReferences).map((paper, idx) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      type="reference"
                      index={idx}
                    />
                  ))}
                {activeTab === "related" &&
                  mockRelatedPapers.map((paper, idx) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      type="related"
                      index={idx}
                    />
                  ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Paper Detail Modal */}
        <AnimatePresence>
          {selectedPaper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPaper(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-8">
                    {selectedPaper.title}
                  </h3>
                  <button
                    onClick={() => setSelectedPaper(null)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Authors
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPaper.authors.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Year
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        {selectedPaper.year}
                      </p>
                    </div>
                    {"journal" in selectedPaper && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Journal
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPaper.journal}
                        </p>
                      </div>
                    )}
                    {"relevance" in selectedPaper && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Relevance
                        </h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {selectedPaper.relevance}%
                        </p>
                      </div>
                    )}
                  </div>

                  {"citationContext" in selectedPaper &&
                    selectedPaper.citationContext && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Citation Context
                        </h4>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-300 italic">
                            "{selectedPaper.citationContext}"
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        onNavigate(`/papers/${selectedPaper.id}`);
                        setSelectedPaper(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Paper
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Star className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default PaperRelationsPage;
