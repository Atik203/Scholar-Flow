"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { hasRoleAccess, USER_ROLES } from "@/lib/auth/roles";
import { useGetPaperCitationsQuery } from "@/redux/api/citationApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { motion } from "motion/react";
import {
  GitGraph,
  Plus,
  Search,
  X,
  Lock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface GraphNode {
  id: string;
  title: string;
  x: number;
  y: number;
}

function PaperCitationLines({
  paperId,
  nodesById,
  onEdges,
}: {
  paperId: string;
  nodesById: Record<string, GraphNode>;
  onEdges: (count: number) => void;
}) {
  const { data: citations } = useGetPaperCitationsQuery(paperId, {
    skip: !paperId,
  });

  useEffect(() => {
    if (citations && citations.length > 0) {
      onEdges(citations.length);
    }
  }, [citations, onEdges]);

  const source = nodesById[paperId];
  if (!source) return null;

  return (
    <>
      {(citations || []).map((citation) => {
        const target = nodesById[citation.targetPaper.id];
        if (!target) return null;
        return (
          <g key={citation.id}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="hsl(var(--primary) / 0.35)"
              strokeWidth={2}
              markerEnd="url(#arrow)"
            />
            <title>
              {source.title} cites {citation.targetPaper.title}
            </title>
          </g>
        );
      })}
    </>
  );
}

export default function CitationGraphPage() {
  const { user, isLoading: isAuthLoading } = useProtectedRoute();
  const isProOrAbove = hasRoleAccess(user?.role, USER_ROLES.PRO_RESEARCHER);
  const { data: papersData, isLoading } = useListPapersQuery({ limit: 100 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [edgeCount, setEdgeCount] = useState(0);

  useEffect(() => {
    setEdgeCount(0);
  }, [selectedIds]);

  const onEdges = useMemo(
    () => (count: number) => setEdgeCount((prev) => prev + count),
    []
  );

  const papers = useMemo(() => {
    if (!papersData?.items) return [];
    return papersData.items.map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.metadata?.authors?.join(", ") || "Unknown",
      year: p.metadata?.year || null,
    }));
  }, [papersData]);

  const filteredPapers = useMemo(
    () =>
      search
        ? papers.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          )
        : papers,
    [papers, search]
  );

  const nodes: GraphNode[] = useMemo(() => {
    const selected = papers.filter((p) => selectedIds.has(p.id));
    if (selected.length === 0) return [];
    const centerX = 380;
    const centerY = 280;
    const radius = Math.min(centerX, centerY) * 0.7;
    return selected.map((p, i) => {
      const angle = (2 * Math.PI * i) / selected.length - Math.PI / 2;
      return {
        id: p.id,
        title: p.title,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [papers, selectedIds]);

  const nodesById = useMemo(() => {
    const map: Record<string, GraphNode> = {};
    nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isProOrAbove) {
    return (
      <div className="max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Citation Graph
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Visualizing real citation relationships between your papers is
              available to Pro Researchers and above.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/billing">Upgrade to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      <div className="w-96 shrink-0 border-r bg-card flex flex-col">
        <div className="p-4 border-b space-y-3">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <GitGraph className="h-5 w-5 text-primary" />
            Citation Graph
          </h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            filteredPapers.map((paper) => {
              const isSelected = selectedIds.has(paper.id);
              return (
                <motion.div
                  key={paper.id}
                  layout
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleSelect(paper.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-2 leading-snug">
                      {paper.title}
                    </p>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-7 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(paper.id);
                      }}
                    >
                      {isSelected ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      {isSelected ? "Remove" : "Select"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paper.authors}
                    {paper.year ? ` (${paper.year})` : ""}
                  </p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 relative bg-muted/20 overflow-hidden">
        {selectedIds.size === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <GitGraph className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">
                Select papers to build a citation graph
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
                Arrows show real citation relationships between your selected
                papers.
              </p>
            </div>
          </div>
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M0,0 L0,10 L10,5 z"
                    fill="hsl(var(--primary) / 0.5)"
                  />
                </marker>
              </defs>
              {nodes.map((node) => (
                <PaperCitationLines
                  key={node.id}
                  paperId={node.id}
                  nodesById={nodesById}
                  onEdges={onEdges}
                />
              ))}
            </svg>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: node.x, top: node.y }}
              >
                <div className="bg-background border-2 border-primary/40 rounded-full w-20 h-20 flex items-center justify-center shadow-lg group-hover:border-primary group-hover:shadow-xl transition-all">
                  <span className="text-xs font-semibold text-center px-1.5 line-clamp-2 leading-tight">
                    {node.title.split(" ").slice(0, 3).join(" ")}
                  </span>
                </div>
                <button
                  onClick={() => toggleSelect(node.id)}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </>
        )}

        {nodes.length > 0 && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary">
              {nodes.length} papers in graph
              {edgeCount > 0 && ` · ${edgeCount} citation links`}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
