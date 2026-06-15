"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Grid3X3,
  LayoutList,
  Play,
  Plus,
  Search,
  TrendingUp,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getStatusBadge = (status: string) => {
  const map: Record<string, { color: string; label: string }> = {
    UPLOADED: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "Uploaded" },
    PROCESSING: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Processing" },
    PROCESSED: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "Processed" },
    FAILED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "Failed" },
  };
  return map[status] || map.UPLOADED;
};

export default function PapersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  const { data: workspacesData } = useListWorkspacesQuery({ page: 1, limit: 50, scope: "all" });
  const { data: papersData, isLoading } = useListPapersQuery({
    page: 1,
    limit: 100,
    workspaceId: selectedWorkspace || undefined,
  });

  const workspaces = workspacesData?.data || [];
  const papers = papersData?.items || [];

  const selectedWs = workspaces.find((w: any) => w.id === selectedWorkspace);

  const totalPapers = papersData?.meta?.total || 0;
  const processedPapers = papers.filter((p) => p.processingStatus === "PROCESSED").length;
  const processingPapers = papers.filter((p) => p.processingStatus === "PROCESSING").length;
  const totalSize = papers.reduce((acc, p) => acc + (p.file?.sizeBytes || 0), 0);

  const allTags = [...new Set(papers.flatMap((p) => p.tags || []))].sort();
  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.metadata?.authors || []).some((a: string) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !tagFilter || (p.tags || []).includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
          <p className="text-muted-foreground">Manage, organize, and explore your research collection</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/papers/search"><Search className="mr-2 h-4 w-4" />Advanced Search</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/papers/import"><Plus className="mr-2 h-4 w-4" />Import</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/papers/upload"><Upload className="mr-2 h-4 w-4" />Upload Paper</Link>
          </Button>
        </div>
      </div>

      {/* Workspace Select */}
      <div className="relative">
        <button
          onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
          className={cn(
            "w-[300px] h-10 px-3 flex items-center justify-between",
            "bg-background border rounded-lg text-sm",
            "hover:border-primary/50 transition-colors",
            wsDropdownOpen && "ring-2 ring-ring ring-offset-2",
          )}
        >
          <span className={selectedWs ? "text-foreground" : "text-muted-foreground"}>
            {selectedWs ? (
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />{selectedWs.name}
              </span>
            ) : (
              "Select a workspace to view papers"
            )}
          </span>
          <motion.div animate={{ rotate: wsDropdownOpen ? 180 : 0 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence>
          {wsDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-[300px] mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden"
            >
              {workspaces.map((w: any) => (
                <button
                  key={w.id}
                  onClick={() => { setSelectedWorkspace(w.id); setWsDropdownOpen(false); }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                    "hover:bg-accent transition-colors",
                    selectedWorkspace === w.id && "bg-accent",
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="flex-1">{w.name}</span>
                  {selectedWorkspace === w.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Papers", value: totalPapers, icon: <FileText className="h-4 w-4 text-blue-600 dark:text-white" />, bg: "bg-blue-50 dark:bg-blue-950/20" },
          { title: "Processed", value: processedPapers, icon: <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />, bg: "bg-green-50 dark:bg-green-950/20" },
          { title: "Processing", value: processingPapers, icon: <Upload className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />, bg: "bg-yellow-50 dark:bg-yellow-950/20" },
          { title: "Storage", value: `${Math.round(totalSize / (1024 * 1024))}MB`, icon: <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-50 dark:bg-purple-950/20" },
        ].map((stat) => (
          <motion.div key={stat.title} whileHover={{ scale: 1.02 }} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
              </div>
              <div className={cn("rounded-full p-2", stat.bg)}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Upload New Paper", desc: "Add research papers to your workspace with automatic processing", icon: <Plus className="h-4 w-4 text-blue-600 dark:text-white" />, bg: "bg-blue-100 dark:bg-blue-900/20", btn: "Get Started", link: "/dashboard/papers/upload", variant: "primary" },
          { title: "Advanced Search", desc: "Find papers with powerful filters and AI-powered search", icon: <Search className="h-4 w-4 text-green-600 dark:text-green-400" />, bg: "bg-green-100 dark:bg-green-900/20", btn: "Search Papers", link: "/dashboard/papers/search", variant: "outline" },
          { title: "Collections", desc: "Organize papers into collections for better management", icon: <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-100 dark:bg-purple-900/20", btn: "Manage Collections", link: "/dashboard/collections", variant: "outline" },
        ].map((action) => (
          <motion.div key={action.title} whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} className="bg-card border rounded-xl p-4 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-lg", action.bg)}>{action.icon}</div>
                <h3 className="font-medium">{action.title}</h3>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{action.desc}</p>
            <Link href={action.link}>
              <Button className="w-full" variant={action.variant === "primary" ? "default" : "outline"}>{action.btn}</Button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Papers Library */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Papers Library</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-l-lg", viewMode === "grid" ? "bg-accent" : "hover:bg-muted")}><Grid3X3 className="h-4 w-4" /></button>
                <button onClick={() => setViewMode("table")} className={cn("p-2 rounded-r-lg", viewMode === "table" ? "bg-accent" : "hover:bg-muted")}><LayoutList className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search papers by title, author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={tagFilter === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setTagFilter(null)}>All</Badge>
              {allTags.slice(0, 10).map((tag) => (
                <Badge key={tag} variant={tagFilter === tag ? "default" : "outline"} className="cursor-pointer" onClick={() => setTagFilter(tagFilter === tag ? null : tag)}>{tag}</Badge>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-16 w-full" />))}</div>
          ) : filteredPapers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{searchTerm ? "No papers match your search" : "No papers yet"}</h3>
              <p className="text-muted-foreground mb-4">{searchTerm ? "Try different keywords or filters" : "Upload your first research paper to get started"}</p>
              <Button asChild><Link href="/dashboard/papers/upload"><Upload className="mr-2 h-4 w-4" />Upload Paper</Link></Button>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="py-3 px-4 text-left font-medium">Title</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">File</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Tags</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map((paper) => {
                    const status = getStatusBadge(paper.processingStatus);
                    const authorNames = (paper.metadata?.authors || []).join(", ");
                    return (
                      <motion.tr key={paper.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{paper.title}</span>
                            {authorNames && <span className="text-sm text-muted-foreground">{authorNames}</span>}
                            {paper.citationCount ? <span className="text-xs text-muted-foreground"><TrendingUp className="inline h-3 w-3 mr-1" />{paper.citationCount.toLocaleString()} citations</span> : null}
                          </div>
                        </td>
                        <td className="py-4 px-4"><span className={cn("px-2 py-1 rounded-full text-xs font-medium", status.color)}>{status.label}</span></td>
                        <td className="py-4 px-4 text-sm">
                          <div>{paper.file?.originalFilename || "—"}</div>
                          <div className="text-muted-foreground">{formatFileSize(paper.file?.sizeBytes)}</div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <div className="flex items-center"><Calendar className="mr-1 h-3 w-3" />{formatDate(paper.createdAt)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">{(paper.tags || []).slice(0, 3).map((t) => (<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" asChild><Link href={`/dashboard/papers/${paper.id}`}><Eye className="h-4 w-4" /></Link></Button>
                            {paper.processingStatus === "UPLOADED" && (
                              <Button size="icon" variant="ghost"><Play className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.map((paper) => {
                const status = getStatusBadge(paper.processingStatus);
                return (
                  <motion.div key={paper.id} whileHover={{ y: -2 }} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link href={`/dashboard/papers/${paper.id}`} className="font-medium hover:text-primary transition-colors line-clamp-2">{paper.title}</Link>
                        {(paper.tags || []).length > 0 && <div className="flex flex-wrap gap-1 mt-2">{(paper.tags || []).slice(0, 3).map((t) => (<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>}
                      </div>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium ml-2 shrink-0", status.color)}>{status.label}</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2"><FileText className="h-3 w-3" />{paper.file?.originalFilename || "—"}</div>
                      <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />{formatDate(paper.createdAt)}</div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button size="sm" variant="outline" asChild><Link href={`/dashboard/papers/${paper.id}`}><Eye className="mr-1 h-3 w-3" />View</Link></Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
