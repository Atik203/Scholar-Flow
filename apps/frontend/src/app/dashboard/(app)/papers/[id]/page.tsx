"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDeletePaperMutation, useGetPaperFileUrlQuery, useGetPaperPreviewUrlQuery, useGetPaperQuery, useProcessPDFMutation, useUpdatePaperMetadataMutation } from "@/redux/api/paperApi";
import { KeyPointsCard } from "@/components/papers/KeyPointsCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "motion/react";
import {
  ArrowLeft, Bot, Calendar, Edit, Eye, FileText, Loader2, Play, RefreshCw, Save, Trash2, Users, X,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { showApiErrorToast } from "@/lib/errorHandling";
import { showSuccessToast } from "@/components/providers/ToastProvider";

export default function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  if (!resolvedParams?.id) notFound();

  const router = useRouter();
  const [pollProcessing, setPollProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { data: paper, isLoading, error } = useGetPaperQuery(resolvedParams.id, {
    pollingInterval: pollProcessing ? 3000 : 0,
  });
  const [updateMetadata] = useUpdatePaperMetadataMutation();
  const [deletePaper] = useDeletePaperMutation();
  const [processPaper, { isLoading: isProcessing }] = useProcessPDFMutation();
  const { data: previewUrlData } = useGetPaperPreviewUrlQuery(resolvedParams.id, {
    skip: !showPreview,
  });
  const [previewLoading, setPreviewLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editTags, setEditTags] = useState("");
  const [showAiSummary, setShowAiSummary] = useState(false);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !paper) return <div className="text-center py-20"><p className="text-destructive mb-4">Paper not found</p><Button asChild variant="outline"><Link href="/dashboard/papers"><ArrowLeft className="mr-2 h-4 w-4" />Back to Papers</Link></Button></div>;

  const statusColors: Record<string, string> = {
    UPLOADED: "bg-gray-100 text-gray-700", PROCESSING: "bg-blue-100 text-blue-700",
    PROCESSED: "bg-green-100 text-green-700", FAILED: "bg-red-100 text-red-700",
  };

  const handleSaveMetadata = async () => {
    try {
      await updateMetadata({ id: paper.id, title: editTitle || paper.title, abstract: editAbstract || paper.abstract || "", tags: editTags ? editTags.split(",").map((t) => t.trim()).filter(Boolean) : paper.tags }).unwrap();
      setIsEditing(false);
    } catch (e: unknown) { showApiErrorToast(e as any); }
  };

  const handleDelete = async () => {
    try { await deletePaper(paper.id).unwrap(); router.push("/dashboard/papers"); } catch (e: unknown) { showApiErrorToast(e as any); }
  };

  const handleProcess = async () => {
    try {
      await processPaper(paper.id).unwrap();
      showSuccessToast("Processing started");
    } catch (e: unknown) { showApiErrorToast(e as any); }
  };

  useEffect(() => {
    if (!showPreview) setPreviewLoading(true);
  }, [showPreview]);

  useEffect(() => {
    if (paper?.processingStatus === "PROCESSING") {
      setPollProcessing(true);
    } else {
      setPollProcessing(false);
    }
  }, [paper?.processingStatus]);

  const startEdit = () => {
    setEditTitle(paper.title);
    setEditAbstract(paper.abstract || "");
    setEditTags((paper.tags || []).join(", "));
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/papers" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back to Papers</Link>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-2xl font-bold" />
                <Textarea value={editAbstract} onChange={(e) => setEditAbstract(e.target.value)} rows={4} />
                <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="Tags (comma separated)" />
                <div className="flex gap-2">
                  <Button onClick={handleSaveMetadata}><Save className="mr-2 h-4 w-4" />Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">{paper.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(paper.createdAt).toLocaleDateString()}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[paper.processingStatus] || "")}>{paper.processingStatus}</span>
                  {paper.citationCount ? <span>{paper.citationCount.toLocaleString()} citations</span> : null}
                </div>
                {(paper.metadata?.authors || []).length > 0 && (
                  <p className="text-sm mb-2">Authors: {(paper.metadata.authors as string[]).join(", ")}</p>
                )}
                <p className="text-sm text-muted-foreground mb-4">{paper.abstract || "No abstract available."}</p>
                {(paper.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {paper.tags!.map((t) => (<Badge key={t} variant="secondary">{t}</Badge>))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {!isEditing && <Button variant="outline" size="icon" onClick={startEdit}><Edit className="h-4 w-4" /></Button>}
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="outline" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete Paper?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {paper.file && <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}><Eye className="mr-2 h-4 w-4" />{showPreview ? "Hide Preview" : "Preview PDF"}</Button>}
          {paper.processingStatus === "UPLOADED" && (
            <Button variant="outline" size="sm" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {isProcessing ? "Starting..." : "Process"}
            </Button>
          )}
          {paper.processingStatus === "PROCESSING" && (
            <Button variant="outline" size="sm" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </Button>
          )}
          {paper.processingStatus === "FAILED" && (
            <Button variant="outline" size="sm" onClick={handleProcess} disabled={isProcessing}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowAiSummary(!showAiSummary)}><Bot className="mr-2 h-4 w-4" />{showAiSummary ? "Hide AI Summary" : "AI Summary"}</Button>
          <Button variant="outline" size="sm" asChild><Link href={`/dashboard/papers/${paper.id}/relations`}><FileText className="mr-2 h-4 w-4" />Relations</Link></Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/papers/${paper.id}/collaborate`}><Users className="mr-2 h-4 w-4" />Collaborate</Link>
          </Button>
        </div>
      </motion.div>

      {/* AI Key Points */}
      {showAiSummary && <KeyPointsCard paperId={paper.id} />}

      {/* PDF Preview */}
      {showPreview && previewUrlData?.data?.url && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Preview</CardTitle>
            {previewLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <iframe
              src={previewUrlData.data.url}
              className="w-full h-[85vh] border rounded-lg"
              title="PDF Preview"
              onLoad={() => setPreviewLoading(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* File Info */}
      {paper.file && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-lg">File Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Filename:</span> {paper.file.originalFilename || "—"}</div>
              <div><span className="text-muted-foreground">Size:</span> {paper.file.sizeBytes ? `${(paper.file.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : "—"}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }
