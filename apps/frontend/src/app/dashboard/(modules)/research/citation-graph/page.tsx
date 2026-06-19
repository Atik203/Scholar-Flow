"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { motion } from "motion/react";
import {
  GitGraph,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface GraphNode {
  id: string;
  title: string;
  x: number;
  y: number;
  connections: string[];
}

export default function CitationGraphPage() {
  const { data: papersData, isLoading } = useListPapersQuery({ limit: 100 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

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
        connections:
          i > 0 ? [selected[i - 1].id] : selected.length > 1 ? [selected[selected.length - 1].id] : [],
      };
    });
  }, [papers, selectedIds]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
              <p className="text-muted-foreground">Select papers to build a citation graph</p>
            </div>
          </div>
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) =>
                node.connections.map((targetId) => {
                  const target = nodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="hsl(var(--primary) / 0.3)"
                      strokeWidth={2}
                    />
                  );
                })
              )}
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
            <Badge variant="secondary">{nodes.length} papers in graph</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
