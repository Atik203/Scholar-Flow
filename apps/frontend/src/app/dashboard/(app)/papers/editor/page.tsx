"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListEditorPapersQuery, useCreateEditorPaperMutation } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Loader2, Plus, Save, Edit, Eye, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

export default function PaperEditorPage() {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: workspacesData } = useListWorkspacesQuery({limit: 50, scope: "all" });
  const { data: editorData, isLoading } = useListEditorPapersQuery({});
  const [createEditorPaper] = useCreateEditorPaperMutation();

  const workspaces = workspacesData?.data || [];
  const papers = editorData?.data || [];

  const handleCreate = async () => {
    if (!newTitle.trim() || !selectedWorkspace) { showErrorToast("Title and workspace required"); return; }
    setIsCreating(true);
    try {
      const result = await createEditorPaper({ workspaceId: selectedWorkspace, title: newTitle.trim() }).unwrap();
      showSuccessToast("Paper created");
      router.push(`/dashboard/papers/${result.data.paper.id}/collaborate`);
    } catch (e: any) { showErrorToast(e?.data?.message || "Failed to create"); }
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Paper Editor</h1><p className="text-muted-foreground">Write and edit your research papers</p></div>
      </div>

      {/* Create New */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Create New Paper</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="h-10 px-3 rounded-lg border bg-background text-sm">
              <option value="">Select workspace...</option>
              {workspaces.map((w: any) => (<option key={w.id} value={w.id}>{w.name}</option>))}
            </select>
            <div className="flex gap-2">
              <Input placeholder="Paper title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="flex-1" />
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Create
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Papers */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Your Papers</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
            papers.length === 0 ? (
              <div className="text-center py-8"><FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No papers yet</p></div>
            ) : (
              <div className="space-y-2">
                {papers.map((paper: any) => (
                  <motion.div key={paper.id} whileHover={{ y: -1 }} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Link href={`/dashboard/papers/${paper.id}/collaborate`} className="font-medium text-sm hover:text-primary">{paper.title}</Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary text-xs">{paper.isDraft ? "Draft" : "Published"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild><Link href={`/dashboard/papers/${paper.id}/collaborate`}><Edit className="mr-1 h-3 w-3" />Edit</Link></Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

function Input({ placeholder, value, onChange, className }: { placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; className?: string }) {
  return <input placeholder={placeholder} value={value} onChange={onChange} className={cn("h-10 px-3 rounded-lg border bg-background text-sm", className)} />;
}
