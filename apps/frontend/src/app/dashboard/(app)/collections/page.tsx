"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyCollectionsQuery, useGetSharedCollectionsQuery } from "@/redux/api/collectionApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { motion } from "motion/react";
import { BookOpen, Building2, Calendar, Eye, FileText, FolderOpen, Globe, Loader2, Lock, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

const colorMap: Record<string, string> = { blue: "border-blue-200 bg-blue-50 dark:bg-blue-950/20", purple: "border-purple-200 bg-purple-50 dark:bg-purple-950/20", green: "border-green-200 bg-green-50 dark:bg-green-950/20", orange: "border-orange-200 bg-orange-50 dark:bg-orange-950/20", pink: "border-pink-200 bg-pink-50 dark:bg-pink-950/20", };

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");

  const { data: workspacesData } = useListWorkspacesQuery({ page: 1, limit: 50, scope: "all" });
  const { data: myCollectionsData, isLoading } = useGetMyCollectionsQuery({ page: 1, limit: 50, workspaceId: selectedWorkspace === "all" ? undefined : selectedWorkspace });
  const { data: sharedData } = useGetSharedCollectionsQuery({ page: 1, limit: 50 });

  const workspaces = workspacesData?.data || [];
  const collections = myCollectionsData?.result || [];
  const sharedCollections = sharedData?.result || [];

  const filtered = collections.filter((c) =>
    !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPapers = collections.reduce((sum, c) => sum + (c._count?.papers || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Collections</h1><p className="text-muted-foreground">Organize and share your research papers</p></div>
        <Button asChild><Link href="/dashboard/collections/create"><Plus className="mr-2 h-4 w-4" />Create Collection</Link></Button>
      </div>

      {/* Workspace Filter */}
      <div className="flex items-center gap-4">
        <Building2 className="h-5 w-5" />
        <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)} className="h-10 px-3 rounded-lg border bg-background text-sm">
          <option value="all">All workspaces</option>
          {workspaces.map((w: any) => (<option key={w.id} value={w.id}>{w.name}</option>))}
        </select>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "My Collections", value: collections.length, icon: <BookOpen className="h-4 w-4 text-blue-600" />, bg: "bg-blue-50 dark:bg-blue-950/20" },
          { title: "Public", value: collections.filter((c) => c.isPublic || c.visibility === "PUBLIC").length, icon: <Globe className="h-4 w-4 text-green-600" />, bg: "bg-green-50 dark:bg-green-950/20" },
          { title: "Total Papers", value: totalPapers, icon: <FileText className="h-4 w-4 text-purple-600" />, bg: "bg-purple-50 dark:bg-purple-950/20" },
          { title: "Private", value: collections.filter((c) => !c.isPublic && c.visibility !== "PUBLIC").length, icon: <Lock className="h-4 w-4 text-orange-600" />, bg: "bg-orange-50 dark:bg-orange-950/20" },
        ].map((stat) => (
          <motion.div key={stat.title} whileHover={{ scale: 1.02 }} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p></div>
              <div className={cn("rounded-full p-2", stat.bg)}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collections Grid */}
      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-lg">{selectedWorkspace === "all" ? "All Collections" : "Workspace Collections"}</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-40" />))}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{searchTerm ? "No collections match" : "No collections yet"}</h3>
              <p className="text-muted-foreground mb-4">{searchTerm ? "Try different keywords" : "Create your first collection"}</p>
              {!searchTerm && <Button asChild><Link href="/dashboard/collections/create"><Plus className="mr-2 h-4 w-4" />Create Collection</Link></Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((collection) => (
                <motion.div key={collection.id} whileHover={{ y: -2 }} className={cn("border rounded-xl p-4 hover:shadow-md transition-shadow", collection.color ? colorMap[collection.color] || "" : "")}>
                  <div className="flex items-start justify-between mb-3">
                    <Link href={`/dashboard/collections/${collection.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">{collection.name}</Link>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {collection.isPublic || collection.visibility === "PUBLIC" ? <><Globe className="h-3 w-3 mr-1" />Public</> : <><Lock className="h-3 w-3 mr-1" />Private</>}
                    </Badge>
                  </div>
                  {collection.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{collection._count?.papers || 0} papers</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(collection.createdAt).toLocaleDateString()}</span>
                    {collection._count?.members ? <span className="flex items-center gap-1"><Users className="h-3 w-3" />{collection._count.members}</span> : null}
                  </div>
                  {(collection.tags || []).length > 0 && <div className="flex flex-wrap gap-1 mt-3">{(collection.tags || []).slice(0, 3).map((t) => (<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>}
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline" asChild><Link href={`/dashboard/collections/${collection.id}`}><Eye className="mr-1 h-3 w-3" />View</Link></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shared Collections Quick View */}
      {sharedCollections.length > 0 && (
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-lg">Shared With You</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sharedCollections.slice(0, 3).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-muted-foreground">by {c.owner?.name || c.owner?.email || "Unknown"}</p></div>
                  <Button size="sm" variant="outline" asChild><Link href={`/dashboard/collections/${c.id}`}><Eye className="mr-1 h-3 w-3" />View</Link></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" asChild className="w-full mt-2"><Link href="/dashboard/collections/shared"><Users className="mr-2 h-4 w-4" />View All Shared</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
