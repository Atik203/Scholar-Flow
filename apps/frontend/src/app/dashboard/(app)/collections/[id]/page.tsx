"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCollectionPapersQuery, useGetCollectionQuery, useDeleteCollectionMutation, useInviteMemberMutation, useRemovePaperFromCollectionMutation, useAddPaperToCollectionMutation, useUpdateCollectionPaperMutation } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Calendar, Check, Eye, FileText, Globe, Grid3X3, LayoutList, Loader2, Lock, MoreHorizontal, Plus, Search, Star, Trash2, UserPlus, Users, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  if (!resolvedParams?.id) notFound();

  const { data: collection, isLoading } = useGetCollectionQuery(resolvedParams.id);
  const { data: papersData } = useGetCollectionPapersQuery({ collectionId: resolvedParams.id, page: 1, limit: 50 });
  const { data: allPapers } = useListPapersQuery({ limit: 100 });
  const [deleteCollection] = useDeleteCollectionMutation();
  const [inviteMember] = useInviteMemberMutation();
  const [removePaper] = useRemovePaperFromCollectionMutation();
  const [addPaper] = useAddPaperToCollectionMutation();
  const [updatePaper] = useUpdateCollectionPaperMutation();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!collection) return <div className="text-center py-20"><p className="text-destructive">Collection not found</p><Button asChild variant="outline"><Link href="/dashboard/collections"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button></div>;

  const papers = papersData?.result || [];
  const userPapers = allPapers?.items || [];
  const availablePapers = userPapers.filter((p) => !papers.some((cp: any) => cp.paper?.id === p.id || cp.paperId === p.id));

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try { await inviteMember({ id: resolvedParams.id, email: inviteEmail }).unwrap(); showSuccessToast("Invitation sent"); setInviteEmail(""); setShowInvite(false); }
    catch (e: any) { showErrorToast(e?.data?.message || "Failed to send invite"); }
  };

  const handleRemovePaper = async (paperId: string) => {
    try { await removePaper({ collectionId: resolvedParams.id, paperId }).unwrap(); showSuccessToast("Paper removed"); }
    catch { showErrorToast("Failed to remove paper"); }
  };

  const handleAddPaper = async (paperId: string) => {
    try { await addPaper({ collectionId: resolvedParams.id, data: { paperId } }).unwrap(); showSuccessToast("Paper added"); setShowAddPaper(false); }
    catch { showErrorToast("Failed to add paper"); }
  };

  const toggleStar = async (collectionInfo: any) => {
    try { await updatePaper({ collectionId: resolvedParams.id, paperId: collectionInfo.paperId || collectionInfo.paper?.id, isStarred: !collectionInfo.isStarred }).unwrap(); }
    catch { showErrorToast("Failed to update"); }
  };

  const handleBulkRemove = async () => {
    for (const paperId of selectedPapers) await handleRemovePaper(paperId);
    setSelectedPapers(new Set());
    setBulkMode(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/collections" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
          <p className="text-muted-foreground">{collection.description || "No description"}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{collection.isPublic || collection.visibility === "PUBLIC" ? <><Globe className="h-3 w-3 mr-1" />Public</> : <><Lock className="h-3 w-3 mr-1" />Private</>}</Badge>
          <Button variant="outline" size="sm" onClick={() => setShowInvite(!showInvite)}><UserPlus className="mr-1 h-4 w-4" />Invite</Button>
          <Button variant="outline" size="sm" onClick={() => setShowAddPaper(!showAddPaper)}><Plus className="mr-1 h-4 w-4" />Add Papers</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Collection?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteCollection(resolvedParams.id)}>Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInvite && (
        <Card><CardContent className="pt-4">
          <div className="flex gap-2"><Input placeholder="email@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            <Button onClick={handleInvite}>Send Invite</Button><Button variant="ghost" size="icon" onClick={() => setShowInvite(false)}><X className="h-4 w-4" /></Button></div>
        </CardContent></Card>
      )}

      {/* Add Papers Dialog */}
      {showAddPaper && (
        <Card><CardHeader className="pb-2"><CardTitle className="text-lg">Add Papers</CardTitle></CardHeader><CardContent>
          <Input placeholder="Search your papers..." value={addSearch} onChange={(e) => setAddSearch(e.target.value)} className="mb-3" />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {availablePapers.filter((p) => !addSearch || p.title.toLowerCase().includes(addSearch.toLowerCase())).slice(0, 10).map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-2">
                <span className="text-sm flex-1 line-clamp-1">{p.title}</span>
                <Button size="sm" onClick={() => handleAddPaper(p.id)}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      {/* Stats + View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><FileText className="h-4 w-4" />{papers.length} papers</span>
          {collection._count?.members ? <span className="flex items-center gap-1"><Users className="h-4 w-4" />{collection._count.members} members</span> : null}
        </div>
        <div className="flex items-center gap-2">
          {bulkMode && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm">{selectedPapers.size} selected</span>
              <Button size="sm" variant="destructive" onClick={handleBulkRemove}>Remove</Button>
              <Button size="sm" variant="outline" onClick={() => { setBulkMode(false); setSelectedPapers(new Set()); }}>Cancel</Button>
            </div>
          )}
          <Button size="sm" variant="outline" onClick={() => setBulkMode(!bulkMode)}>{bulkMode ? "Exit Bulk" : "Bulk Select"}</Button>
          <div className="flex items-center border rounded-lg">
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-l-lg", viewMode === "grid" ? "bg-accent" : "")}><Grid3X3 className="h-4 w-4" /></button>
            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-r-lg", viewMode === "list" ? "bg-accent" : "")}><LayoutList className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Papers */}
      {papers.length === 0 ? (
        <div className="text-center py-12"><FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No papers in this collection yet</p></div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((cp: any) => {
            const p = cp.paper || cp;
            const statusBadge: Record<string, string> = { TO_READ: "bg-blue-100 text-blue-700", READING: "bg-yellow-100 text-yellow-700", COMPLETED: "bg-green-100 text-green-700", ARCHIVED: "bg-gray-100 text-gray-700" };
            return (
              <motion.div key={cp.id} whileHover={{ y: -2 }} className="border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  {bulkMode && <Checkbox checked={selectedPapers.has(p.id)} onCheckedChange={(c) => {
                    const next = new Set(selectedPapers); c ? next.add(p.id) : next.delete(p.id); setSelectedPapers(next);
                  }} />}
                  <div className="flex-1">
                    <Link href={`/dashboard/papers/${p.id}`} className="font-medium hover:text-primary line-clamp-1">{p.title}</Link>
                    <p className="text-xs text-muted-foreground mt-1">{(p.metadata?.authors || []).join(", ") || "—"}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.processingStatus && <Badge variant="secondary" className="text-xs">{p.processingStatus}</Badge>}
                      {cp.status && <Badge className={cn("text-xs", statusBadge[cp.status] || "")}>{cp.status.replace("_", " ")}</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => toggleStar(cp)}><Star className={cn("h-4 w-4", cp.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} /></button>
                    {!bulkMode && <button onClick={() => handleRemovePaper(p.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {papers.map((cp: any) => {
            const p = cp.paper || cp;
            return (
              <motion.div key={cp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3 flex-1">
                  {bulkMode && <Checkbox checked={selectedPapers.has(p.id)} onCheckedChange={(c) => {
                    const next = new Set(selectedPapers); c ? next.add(p.id) : next.delete(p.id); setSelectedPapers(next);
                  }} />}
                  <div>
                    <Link href={`/dashboard/papers/${p.id}`} className="font-medium text-sm hover:text-primary">{p.title}</Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      {cp.status && <Badge className="text-xs" variant="secondary">{cp.status.replace("_", " ")}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStar(cp)}><Star className={cn("h-4 w-4", cp.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} /></button>
                  {!bulkMode && <button onClick={() => handleRemovePaper(p.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
