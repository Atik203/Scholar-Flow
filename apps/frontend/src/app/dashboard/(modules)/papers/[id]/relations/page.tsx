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
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { buildRoleScopedPath } from "@/lib/auth/roles";
import { useGetPaperQuery } from "@/redux/api/paperApi";
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
  Loader2,
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
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types for relations data
interface CitationPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  relevance: number;
  citationContext?: string;
}

interface ReferencePaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  relevance: number;
  category: "foundational" | "methodology" | "analysis" | "other";
}

interface RelatedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  similarity: number;
  sharedReferences: number;
}

// In a real implementation, these would come from API endpoints
// For now, we derive some data from the paper's metadata
function generateRelationsFromPaper(paper: any): {
  citations: CitationPaper[];
  references: ReferencePaper[];
  related: RelatedPaper[];
} {
  // These would normally come from a dedicated backend endpoint
  // For now, return empty arrays — the UI gracefully handles empty states
  return {
    citations: [],
    references: [],
    related: [],
  };
}

export default function PaperRelationsPage() {
  const { user, isAuthenticated } = useProtectedRoute();
  const params = useParams();
  const paperId = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const {
    data: paper,
    isLoading,
    error,
  } = useGetPaperQuery(paperId, { skip: !paperId });

  const [activeTab, setActiveTab] = useState<
    "citations" | "references" | "related"
  >("citations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<
    CitationPaper | ReferencePaper | RelatedPaper | null
  >(null);
  const [viewMode, setViewMode] = useState<"list" | "graph">("list");
  const [zoom, setZoom] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  const scopedPath = useCallback(
    (segment: string) => buildRoleScopedPath(user?.role, segment),
    [user?.role]
  );

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !paper) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Paper Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The paper you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have access to it.
            </p>
            <Button asChild>
              <Link href={scopedPath("/papers")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Papers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const relations = generateRelationsFromPaper(paper);

  const tabs = [
    {
      id: "citations" as const,
      label: "Cited By",
      count: relations.citations.length,
      icon: ArrowLeft,
    },
    {
      id: "references" as const,
      label: "References",
      count: relations.references.length,
      icon: ArrowRight,
    },
    {
      id: "related" as const,
      label: "Related Papers",
      count: relations.related.length,
      icon: Link2,
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const filterPapers = <T extends { title: string; authors: string[] }>(
    papers: T[]
  ): T[] => {
    if (!searchQuery) return papers;
    return papers.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authors.some((a) =>
          a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  const PaperCard = ({
    paper: cardPaper,
    type,
    index,
  }: {
    paper: CitationPaper | ReferencePaper | RelatedPaper;
    type: "citation" | "reference" | "related";
    index: number;
  }) => {
    const relevance =
      "relevance" in cardPaper
        ? cardPaper.relevance
        : "similarity" in cardPaper
          ? cardPaper.similarity
          : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className="cursor-pointer hover:shadow-lg transition-all group"
          onClick={() => setSelectedPaper(cardPaper)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {cardPaper.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {cardPaper.authors.slice(0, 2).join(", ")}
                  {cardPaper.authors.length > 2 &&
                    ` +${cardPaper.authors.length - 2} more`}
                </p>
              </div>
              <Badge
                variant={
                  relevance >= 90
                    ? "default"
                    : relevance >= 80
                      ? "secondary"
                      : "outline"
                }
                className="ml-2"
              >
                {relevance}%{" "}
                {type === "related" ? "similar" : "relevant"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {cardPaper.year}
              </span>
              {"journal" in cardPaper && cardPaper.journal && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {cardPaper.journal}
                </span>
              )}
              {"sharedReferences" in cardPaper && (
                <span className="flex items-center gap-1">
                  <Link2 className="w-4 h-4" />
                  {cardPaper.sharedReferences} shared refs
                </span>
              )}
            </div>

            {"citationContext" in cardPaper && cardPaper.citationContext && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground italic">
                  <Quote className="w-4 h-4 inline mr-1 text-primary" />
                  {cardPaper.citationContext}
                </p>
              </div>
            )}

            {"category" in cardPaper && (
              <div className="mt-3">
                <Badge
                  variant="outline"
                  className={
                    cardPaper.category === "foundational"
                      ? "border-purple-300 text-purple-600"
                      : cardPaper.category === "methodology"
                        ? "border-blue-300 text-blue-600"
                        : ""
                  }
                >
                  {cardPaper.category}
                </Badge>
              </div>
            )}

            <Separator className="my-3" />
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                asChild
              >
                <Link href={scopedPath(`/papers/${cardPaper.id}`)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Paper
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-auto p-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const GraphView = () => {
    const allPapers = [
      ...relations.citations.slice(0, 3).map((c) => ({
        ...c,
        type: "citation" as const,
      })),
      ...relations.references.slice(0, 4).map((r) => ({
        ...r,
        type: "reference" as const,
      })),
    ];

    if (allPapers.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Relations Yet</h3>
            <p className="text-muted-foreground">
              Citation and reference data will appear here once available.
            </p>
          </CardContent>
        </Card>
      );
    }

    const nodes = [
      { id: "center", x: 50, y: 50, label: "Current Paper", type: "center" as const },
      ...allPapers.map((p, i) => ({
        id: p.id,
        x: p.type === "citation" ? 20 + i * 25 : 10 + (i - relations.citations.length) * 20,
        y: p.type === "citation" ? 15 : 85,
        label: p.title.slice(0, 30) + "...",
        type: p.type,
      })),
    ];

    return (
      <div
        ref={graphRef}
        className="relative w-full h-[500px] bg-muted/30 rounded-xl border overflow-hidden"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "center",
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes
            .filter((n) => n.type !== "center")
            .map((node) => (
              <line
                key={`line-${node.id}`}
                x1="50%"
                y1="50%"
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={
                  node.type === "citation"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--chart-2))"
                }
                strokeWidth="2"
                strokeDasharray={node.type === "citation" ? "none" : "5,5"}
                opacity={0.5}
              />
            ))}
        </svg>

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
                  ? "bg-gradient-to-br from-primary to-chart-1 text-primary-foreground shadow-lg"
                  : node.type === "citation"
                    ? "bg-primary/10 text-primary hover:scale-110 transition-transform"
                    : "bg-chart-2/10 text-chart-2 hover:scale-110 transition-transform"
              }`}
            >
              <span className="text-[10px] font-medium line-clamp-3">
                {node.type === "center" ? "📄 Current" : node.label}
              </span>
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-4 right-4 bg-card rounded-lg p-3 shadow-lg border">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Cites This</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Referenced</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentPapers =
    activeTab === "citations"
      ? filterPapers(relations.citations)
      : activeTab === "references"
        ? filterPapers(relations.references)
        : filterPapers(relations.related);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Current Paper Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Paper Relations
                      </p>
                      <h1 className="text-xl font-bold">{paper.title}</h1>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {paper.metadata?.authors?.join(", ") || "Unknown authors"} •{" "}
                    {paper.metadata?.year || "Unknown year"}
                    {paper.metadata?.source && ` • ${paper.metadata.source}`}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        {relations.citations.length} citations
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-chart-2" />
                      <span className="text-sm font-medium">
                        {relations.references.length} references
                      </span>
                    </div>
                    {paper.doi && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          DOI: {paper.doi}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "list" ? "graph" : "list")
                    }
                  >
                    {viewMode === "list" ? (
                      <GitBranch className="w-4 h-4 mr-2" />
                    ) : (
                      <Layers className="w-4 h-4 mr-2" />
                    )}
                    {viewMode === "list" ? "Graph View" : "List View"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graph View Controls */}
        {viewMode === "graph" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12 text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(100)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Graph
            </Button>
          </motion.div>
        )}

        {viewMode === "graph" ? (
          <GraphView />
        ) : (
          <>
            {/* Tabs and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="gap-2"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <Badge
                      variant={activeTab === tab.id ? "secondary" : "outline"}
                      className="ml-1"
                    >
                      {tab.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Papers List */}
            {currentPapers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeTab === "citations" &&
                  filterPapers(relations.citations).map((p, idx) => (
                    <PaperCard key={p.id} paper={p} type="citation" index={idx} />
                  ))}
                {activeTab === "references" &&
                  filterPapers(relations.references).map((p, idx) => (
                    <PaperCard key={p.id} paper={p} type="reference" index={idx} />
                  ))}
                {activeTab === "related" &&
                  filterPapers(relations.related).map((p, idx) => (
                    <PaperCard key={p.id} paper={p} type="related" index={idx} />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No {activeTab === "citations" ? "Citations" : activeTab === "references" ? "References" : "Related Papers"} Yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {activeTab === "citations"
                      ? "Papers that cite this paper will appear here once citation data is available."
                      : activeTab === "references"
                        ? "Papers referenced by this paper will appear here once reference data is extracted."
                        : "Similar papers will appear here once recommendation data is available."}
                  </p>
                </CardContent>
              </Card>
            )}
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
                className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold pr-8">
                    {selectedPaper.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPaper(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Authors
                    </h4>
                    <p>{selectedPaper.authors.join(", ")}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Year
                      </h4>
                      <p>{selectedPaper.year}</p>
                    </div>
                    {"journal" in selectedPaper && selectedPaper.journal && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Journal
                        </h4>
                        <p>{selectedPaper.journal}</p>
                      </div>
                    )}
                    {"relevance" in selectedPaper && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Relevance
                        </h4>
                        <p className="text-primary font-semibold">
                          {selectedPaper.relevance}%
                        </p>
                      </div>
                    )}
                  </div>

                  {"citationContext" in selectedPaper &&
                    selectedPaper.citationContext && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Citation Context
                        </h4>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-muted-foreground italic">
                            &ldquo;{selectedPaper.citationContext}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}

                  <Separator />
                  <div className="flex items-center gap-3">
                    <Button className="flex-1" asChild>
                      <Link
                        href={scopedPath(`/papers/${selectedPaper.id}`)}
                        onClick={() => setSelectedPaper(null)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Paper
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline">
                      <Star className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
