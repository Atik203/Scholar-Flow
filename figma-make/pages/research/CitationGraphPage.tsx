"use client";

import {
  ArrowLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  Maximize2,
  RefreshCcw,
  Search,
  Share2,
  Target,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface CitationGraphPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Default user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "pro_researcher" as const,
};

// Mock paper nodes for citation network
interface PaperNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  references: number;
  category: string;
  isUserPaper: boolean;
  x?: number;
  y?: number;
}

interface CitationLink {
  source: string;
  target: string;
  weight: number;
}

// Generate mock paper nodes
const generateMockNodes = (): PaperNode[] => [
  {
    id: "1",
    title: "Deep Learning for Medical Image Analysis",
    authors: ["Sarah Chen", "James Wilson"],
    year: 2024,
    citations: 45,
    references: 32,
    category: "Deep Learning",
    isUserPaper: true,
  },
  {
    id: "2",
    title: "Transformer Architectures: A Survey",
    authors: ["Emily Park", "Michael Torres"],
    year: 2023,
    citations: 128,
    references: 67,
    category: "NLP",
    isUserPaper: true,
  },
  {
    id: "3",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    citations: 67000,
    references: 31,
    category: "NLP",
    isUserPaper: false,
  },
  {
    id: "4",
    title: "BERT: Pre-training Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
    citations: 45000,
    references: 42,
    category: "NLP",
    isUserPaper: false,
  },
  {
    id: "5",
    title: "ResNet: Deep Residual Learning",
    authors: ["He et al."],
    year: 2015,
    citations: 120000,
    references: 28,
    category: "Computer Vision",
    isUserPaper: false,
  },
  {
    id: "6",
    title: "GAN: Generative Adversarial Networks",
    authors: ["Goodfellow et al."],
    year: 2014,
    citations: 55000,
    references: 23,
    category: "Deep Learning",
    isUserPaper: false,
  },
  {
    id: "7",
    title: "ImageNet Classification with Deep CNNs",
    authors: ["Krizhevsky et al."],
    year: 2012,
    citations: 89000,
    references: 35,
    category: "Computer Vision",
    isUserPaper: false,
  },
  {
    id: "8",
    title: "Graph Neural Networks: A Review",
    authors: ["Sarah Chen"],
    year: 2024,
    citations: 12,
    references: 45,
    category: "Graph Learning",
    isUserPaper: true,
  },
  {
    id: "9",
    title: "Reinforcement Learning: An Introduction",
    authors: ["Sutton & Barto"],
    year: 2018,
    citations: 32000,
    references: 180,
    category: "RL",
    isUserPaper: false,
  },
  {
    id: "10",
    title: "Neural Architecture Search Survey",
    authors: ["Michael Torres"],
    year: 2023,
    citations: 8,
    references: 52,
    category: "AutoML",
    isUserPaper: true,
  },
];

// Mock citation links
const mockLinks: CitationLink[] = [
  { source: "1", target: "5", weight: 3 },
  { source: "1", target: "6", weight: 2 },
  { source: "1", target: "7", weight: 4 },
  { source: "2", target: "3", weight: 5 },
  { source: "2", target: "4", weight: 4 },
  { source: "3", target: "9", weight: 2 },
  { source: "4", target: "3", weight: 5 },
  { source: "6", target: "7", weight: 3 },
  { source: "8", target: "3", weight: 2 },
  { source: "8", target: "5", weight: 3 },
  { source: "10", target: "5", weight: 4 },
  { source: "10", target: "6", weight: 2 },
  { source: "10", target: "7", weight: 3 },
];

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories", color: "bg-gray-500" },
  { id: "Deep Learning", name: "Deep Learning", color: "bg-blue-500" },
  { id: "NLP", name: "NLP", color: "bg-purple-500" },
  { id: "Computer Vision", name: "Computer Vision", color: "bg-emerald-500" },
  { id: "Graph Learning", name: "Graph Learning", color: "bg-amber-500" },
  { id: "RL", name: "Reinforcement Learning", color: "bg-rose-500" },
  { id: "AutoML", name: "AutoML", color: "bg-cyan-500" },
];

export function CitationGraphPage({
  onNavigate,
  role: propRole,
}: CitationGraphPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };
  const [nodes] = useState<PaperNode[]>(generateMockNodes);
  const [links] = useState<CitationLink[]>(mockLinks);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<PaperNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUserPapersOnly, setShowUserPapersOnly] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  // Calculate node positions in a force-directed layout simulation
  const positionedNodes = useMemo(() => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const jitter = Math.random() * 50 - 25;
      const nodeRadius = radius + (node.isUserPaper ? -50 : 30) + jitter;

      return {
        ...node,
        x: centerX + nodeRadius * Math.cos(angle),
        y: centerY + nodeRadius * Math.sin(angle),
      };
    });
  }, [nodes]);

  // Filter nodes based on search and category
  const filteredNodes = useMemo(() => {
    return positionedNodes.filter((node) => {
      const matchesSearch =
        searchQuery === "" ||
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.authors.some((a) =>
          a.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || node.category === selectedCategory;

      const matchesUserFilter = !showUserPapersOnly || node.isUserPaper;

      return matchesSearch && matchesCategory && matchesUserFilter;
    });
  }, [positionedNodes, searchQuery, selectedCategory, showUserPapersOnly]);

  // Get links for filtered nodes
  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return links.filter(
      (link) => nodeIds.has(link.source) && nodeIds.has(link.target)
    );
  }, [filteredNodes, links]);

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || "bg-gray-500";
  };

  const getNodeSize = (citations: number) => {
    if (citations > 50000) return 40;
    if (citations > 10000) return 32;
    if (citations > 1000) return 26;
    if (citations > 100) return 22;
    return 18;
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3));
  const handleResetZoom = () => setZoom(1);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const formatCitations = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate("/research")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Citation Graph
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualize citation relationships between papers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCcw
                    className={`h-5 w-5 text-gray-600 dark:text-gray-300 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-180px)]">
          {/* Left Sidebar - Filters */}
          <div className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Papers Toggle */}
            <div className="mb-6">
              <button
                onClick={() => setShowUserPapersOnly(!showUserPapersOnly)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  showUserPapersOnly
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Target className="h-4 w-4" />
                Show my papers only
              </button>
            </div>

            {/* Stats */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Graph Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Papers
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredNodes.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Connections
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredLinks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Your Papers
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredNodes.filter((n) => n.isUserPaper).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Legend
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-gray-700 shadow" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Your paper
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-700 shadow" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Referenced paper
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Citation link
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Node size = citation count
                </p>
              </div>
            </div>
          </div>

          {/* Main Graph Area */}
          <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Graph Visualization */}
            <div
              ref={graphRef}
              className="w-full h-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease-out",
              }}
            >
              <svg className="w-full h-full">
                {/* Links */}
                {filteredLinks.map((link) => {
                  const sourceNode = positionedNodes.find(
                    (n) => n.id === link.source
                  );
                  const targetNode = positionedNodes.find(
                    (n) => n.id === link.target
                  );

                  if (!sourceNode || !targetNode) return null;

                  const isHighlighted =
                    hoveredNode === link.source || hoveredNode === link.target;

                  return (
                    <motion.line
                      key={`${link.source}-${link.target}`}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeOpacity={isHighlighted ? 1 : 0.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  );
                })}

                {/* Nodes */}
                {filteredNodes.map((node, index) => {
                  const size = getNodeSize(node.citations);
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? size + 4 : size}
                        fill={
                          node.isUserPaper
                            ? "url(#userGradient)"
                            : isHovered
                              ? "#3b82f6"
                              : "#e5e7eb"
                        }
                        stroke={isSelected ? "#3b82f6" : "white"}
                        strokeWidth={isSelected ? 3 : 2}
                        className="cursor-pointer drop-shadow-md"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => setSelectedNode(node)}
                      />
                      {(isHovered || isSelected) && (
                        <text
                          x={node.x}
                          y={(node.y || 0) + size + 16}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-900 dark:fill-white pointer-events-none"
                        >
                          {node.title.length > 25
                            ? node.title.slice(0, 25) + "..."
                            : node.title}
                        </text>
                      )}
                      <text
                        x={node.x}
                        y={node.y}
                        dy="0.35em"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-white dark:fill-gray-900 pointer-events-none"
                      >
                        {formatCitations(node.citations)}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient
                    id="userGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Refreshing graph...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Selected Paper Details */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Paper Details
                  </h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white leading-snug">
                      {selectedNode.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedNode.authors.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full text-white ${getCategoryColor(
                        selectedNode.category
                      )}`}
                    >
                      {selectedNode.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedNode.year}
                    </span>
                    {selectedNode.isUserPaper && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        Your Paper
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedNode.citations.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Citations
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedNode.references}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        References
                      </p>
                    </div>
                  </div>

                  {/* Connected Papers */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Connected Papers
                    </h5>
                    <div className="space-y-2">
                      {links
                        .filter(
                          (l) =>
                            l.source === selectedNode.id ||
                            l.target === selectedNode.id
                        )
                        .slice(0, 5)
                        .map((link) => {
                          const connectedId =
                            link.source === selectedNode.id
                              ? link.target
                              : link.source;
                          const connectedNode = nodes.find(
                            (n) => n.id === connectedId
                          );
                          if (!connectedNode) return null;

                          return (
                            <button
                              key={connectedId}
                              onClick={() => setSelectedNode(connectedNode)}
                              className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${getCategoryColor(
                                  connectedNode.category
                                )}`}
                              />
                              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                                {connectedNode.title}
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => onNavigate(`/papers/${selectedNode.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Paper
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      Open in Scholar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
