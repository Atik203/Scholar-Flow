"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Hand,
  Layers,
  Link2,
  Map,
  Maximize2,
  MousePointer,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface ResearchMapPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock data for research clusters
const mockClusters = [
  {
    id: "cluster-1",
    name: "Natural Language Processing",
    papers: 45,
    color: "#6366f1",
    x: 30,
    y: 30,
    size: 120,
    subclusters: [
      { id: "sub-1-1", name: "Transformers", papers: 18, x: 20, y: 20 },
      { id: "sub-1-2", name: "Embeddings", papers: 12, x: 40, y: 25 },
      { id: "sub-1-3", name: "Attention Mechanisms", papers: 15, x: 25, y: 40 },
    ],
    keywords: ["BERT", "GPT", "LLM", "Transformers", "Language Models"],
    growth: 28,
  },
  {
    id: "cluster-2",
    name: "Computer Vision",
    papers: 32,
    color: "#10b981",
    x: 70,
    y: 25,
    size: 100,
    subclusters: [
      { id: "sub-2-1", name: "Object Detection", papers: 14, x: 65, y: 18 },
      { id: "sub-2-2", name: "Image Segmentation", papers: 10, x: 75, y: 30 },
      { id: "sub-2-3", name: "GANs", papers: 8, x: 68, y: 35 },
    ],
    keywords: ["CNN", "ResNet", "YOLO", "Vision Transformers", "Diffusion"],
    growth: 15,
  },
  {
    id: "cluster-3",
    name: "Reinforcement Learning",
    papers: 28,
    color: "#f59e0b",
    x: 50,
    y: 65,
    size: 90,
    subclusters: [
      { id: "sub-3-1", name: "Policy Gradient", papers: 12, x: 45, y: 60 },
      { id: "sub-3-2", name: "Q-Learning", papers: 9, x: 55, y: 70 },
      { id: "sub-3-3", name: "Multi-Agent", papers: 7, x: 52, y: 75 },
    ],
    keywords: ["PPO", "DQN", "RLHF", "Actor-Critic", "Reward Modeling"],
    growth: 42,
  },
  {
    id: "cluster-4",
    name: "Graph Neural Networks",
    papers: 18,
    color: "#ec4899",
    x: 20,
    y: 70,
    size: 70,
    subclusters: [
      { id: "sub-4-1", name: "GCN", papers: 8, x: 15, y: 68 },
      { id: "sub-4-2", name: "Knowledge Graphs", papers: 10, x: 25, y: 75 },
    ],
    keywords: ["GNN", "Graph Attention", "Node Embedding", "Knowledge Base"],
    growth: 35,
  },
  {
    id: "cluster-5",
    name: "Multimodal Learning",
    papers: 22,
    color: "#8b5cf6",
    x: 80,
    y: 60,
    size: 80,
    subclusters: [
      { id: "sub-5-1", name: "Vision-Language", papers: 12, x: 78, y: 55 },
      { id: "sub-5-2", name: "Audio-Visual", papers: 10, x: 82, y: 65 },
    ],
    keywords: ["CLIP", "DALL-E", "Multimodal", "Cross-modal", "VQA"],
    growth: 58,
  },
];

// Mock connections between clusters
const mockConnections = [
  { from: "cluster-1", to: "cluster-2", strength: 0.8, papers: 12 },
  { from: "cluster-1", to: "cluster-5", strength: 0.9, papers: 18 },
  { from: "cluster-2", to: "cluster-5", strength: 0.85, papers: 15 },
  { from: "cluster-1", to: "cluster-3", strength: 0.5, papers: 6 },
  { from: "cluster-3", to: "cluster-4", strength: 0.4, papers: 4 },
  { from: "cluster-4", to: "cluster-1", strength: 0.6, papers: 8 },
];

// Mock trending topics
const mockTrendingTopics = [
  { name: "Large Language Models", growth: 156, papers: 89 },
  { name: "Diffusion Models", growth: 234, papers: 67 },
  { name: "RLHF", growth: 189, papers: 45 },
  { name: "Vision Transformers", growth: 78, papers: 56 },
  { name: "Multimodal AI", growth: 145, papers: 72 },
];

// Mock recent papers
const mockRecentPapers = [
  {
    id: "1",
    title: "Scaling Language Models: A Survey",
    cluster: "NLP",
    date: "2024-11-28",
  },
  {
    id: "2",
    title: "Efficient Fine-tuning Methods",
    cluster: "NLP",
    date: "2024-11-27",
  },
  {
    id: "3",
    title: "Multi-Agent Reinforcement Learning",
    cluster: "RL",
    date: "2024-11-26",
  },
  {
    id: "4",
    title: "Vision-Language Pre-training",
    cluster: "Multimodal",
    date: "2024-11-25",
  },
];

export const ResearchMapPage: React.FC<ResearchMapPageProps> = ({
  onNavigate,
  role: propRole,
}) => {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedCluster, setSelectedCluster] = useState<
    (typeof mockClusters)[0] | null
  >(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [tool, setTool] = useState<"select" | "pan">("select");
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedClusters, setExpandedClusters] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 20));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 20));
  const handleResetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "pan") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && tool === "pan") {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleClusterExpand = (clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((id) => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  const getClusterPosition = (cluster: (typeof mockClusters)[0]) => ({
    x: cluster.x * (zoom / 100) + pan.x,
    y: cluster.y * (zoom / 100) + pan.y,
  });

  const filteredClusters = mockClusters.filter(
    (cluster) =>
      cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Research Map
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mockClusters.reduce((sum, c) => sum + c.papers, 0)}{" "}
                      papers across {mockClusters.length} clusters
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics, keywords..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clusters List */}
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Research Clusters
                </h3>
                <div className="space-y-2">
                  {filteredClusters.map((cluster) => (
                    <div key={cluster.id}>
                      <button
                        onClick={() => {
                          setSelectedCluster(cluster);
                          toggleClusterExpand(cluster.id);
                        }}
                        onMouseEnter={() => setHoveredCluster(cluster.id)}
                        onMouseLeave={() => setHoveredCluster(null)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          selectedCluster?.id === cluster.id
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cluster.color }}
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {cluster.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {cluster.papers} papers
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {cluster.growth}%
                          </span>
                          {expandedClusters.includes(cluster.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Subclusters */}
                      <AnimatePresence>
                        {expandedClusters.includes(cluster.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 mt-1"
                          >
                            {cluster.subclusters.map((sub) => (
                              <button
                                key={sub.id}
                                className="w-full flex items-center justify-between p-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md"
                              >
                                <span>{sub.name}</span>
                                <span className="text-xs">{sub.papers}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Trending Topics */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Trending Topics
                  </h3>
                  <div className="space-y-2">
                    {mockTrendingTopics.slice(0, 3).map((topic, idx) => (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {topic.name}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          +{topic.growth}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Papers */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Recent Papers
                  </h3>
                  <div className="space-y-2">
                    {mockRecentPapers.map((paper) => (
                      <button
                        key={paper.id}
                        onClick={() => onNavigate(`/papers/${paper.id}`)}
                        className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <p className="text-sm text-gray-900 dark:text-white line-clamp-1">
                          {paper.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                            {paper.cluster}
                          </span>
                          <span className="text-xs text-gray-400">
                            {paper.date}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Map Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Layers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Tool Selection */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setTool("select")}
                  className={`p-2 rounded-md transition-colors ${
                    tool === "select"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <MousePointer className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setTool("pan")}
                  className={`p-2 rounded-md transition-colors ${
                    tool === "pan"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Hand className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              {/* View Options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConnections(!showConnections)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    showConnections
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Connections
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    showLabels
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Tag className="w-4 h-4 inline mr-1" />
                  Labels
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="w-12 text-center text-sm text-gray-600 dark:text-gray-400">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Map Canvas */}
          <div
            ref={mapRef}
            className={`flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900 ${
              tool === "pan" ? "cursor-grab" : "cursor-default"
            } ${isDragging ? "cursor-grabbing" : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* SVG Connections */}
            {showConnections && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mockConnections.map((conn) => {
                  const from = mockClusters.find((c) => c.id === conn.from);
                  const to = mockClusters.find((c) => c.id === conn.to);
                  if (!from || !to) return null;

                  const fromPos = getClusterPosition(from);
                  const toPos = getClusterPosition(to);

                  return (
                    <motion.line
                      key={`${conn.from}-${conn.to}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: conn.strength * 0.5 }}
                      transition={{ duration: 1 }}
                      x1={`${fromPos.x}%`}
                      y1={`${fromPos.y}%`}
                      x2={`${toPos.x}%`}
                      y2={`${toPos.y}%`}
                      stroke="#6366f1"
                      strokeWidth={Math.max(1, conn.strength * 3)}
                      strokeDasharray={conn.strength < 0.5 ? "5,5" : "none"}
                    />
                  );
                })}
              </svg>
            )}

            {/* Cluster Nodes */}
            {mockClusters.map((cluster, idx) => {
              const pos = getClusterPosition(cluster);
              const isSelected = selectedCluster?.id === cluster.id;
              const isHovered = hoveredCluster === cluster.id;

              return (
                <motion.div
                  key={cluster.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                    isSelected || isHovered ? "z-20" : "z-10"
                  }`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  onClick={() => setSelectedCluster(cluster)}
                  onMouseEnter={() => setHoveredCluster(cluster.id)}
                  onMouseLeave={() => setHoveredCluster(null)}
                >
                  {/* Cluster Circle */}
                  <motion.div
                    animate={{
                      scale: isSelected || isHovered ? 1.1 : 1,
                      boxShadow:
                        isSelected || isHovered
                          ? `0 0 30px ${cluster.color}40`
                          : "none",
                    }}
                    className="rounded-full flex items-center justify-center transition-all"
                    style={{
                      width: cluster.size * (zoom / 100),
                      height: cluster.size * (zoom / 100),
                      backgroundColor: `${cluster.color}20`,
                      border: `3px solid ${cluster.color}`,
                    }}
                  >
                    <div className="text-center p-4">
                      <p
                        className="font-bold text-lg"
                        style={{ color: cluster.color }}
                      >
                        {cluster.papers}
                      </p>
                      {showLabels && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[80px] line-clamp-2">
                          {cluster.name}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-30 min-w-[200px]"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {cluster.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cluster.papers} papers
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cluster.keywords.slice(0, 3).map((keyword) => (
                            <span
                              key={keyword}
                              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Legend
              </h4>
              <div className="space-y-2">
                {mockClusters.slice(0, 4).map((cluster) => (
                  <div key={cluster.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {cluster.name}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-indigo-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Strong connection
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-0.5 bg-indigo-400 border-dashed border-t-2 border-indigo-400"
                    style={{ borderStyle: "dashed" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Weak connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cluster Detail Panel */}
        <AnimatePresence>
          {selectedCluster && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCluster.color}20` }}
                  >
                    <Target
                      className="w-5 h-5"
                      style={{ color: selectedCluster.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedCluster.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedCluster.papers} papers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Papers
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCluster.papers}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Growth
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      +{selectedCluster.growth}%
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Sub-topics
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCluster.subclusters.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Connections
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {
                        mockConnections.filter(
                          (c) =>
                            c.from === selectedCluster.id ||
                            c.to === selectedCluster.id
                        ).length
                      }
                    </p>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCluster.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sub-topics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Sub-topics
                  </h4>
                  <div className="space-y-2">
                    {selectedCluster.subclusters.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {sub.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {sub.papers} papers
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Clusters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Connected Clusters
                  </h4>
                  <div className="space-y-2">
                    {mockConnections
                      .filter(
                        (c) =>
                          c.from === selectedCluster.id ||
                          c.to === selectedCluster.id
                      )
                      .map((conn) => {
                        const otherId =
                          conn.from === selectedCluster.id
                            ? conn.to
                            : conn.from;
                        const other = mockClusters.find(
                          (c) => c.id === otherId
                        );
                        if (!other) return null;
                        return (
                          <button
                            key={conn.from + conn.to}
                            onClick={() => setSelectedCluster(other)}
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: other.color }}
                            />
                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                              {other.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {conn.papers} shared
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onNavigate(`/papers?cluster=${selectedCluster.id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Papers
                  </button>
                  <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ResearchMapPage;
