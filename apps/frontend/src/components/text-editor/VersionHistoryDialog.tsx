"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPaperVersionsQuery,
  useRestorePaperVersionMutation,
} from "@/redux/api/paperApi";
import { showErrorToast } from "@/components/providers/ToastProvider";
import { History, RotateCcw, Clock, FileText } from "lucide-react";
import { useState } from "react";

interface VersionHistoryDialogProps {
  paperId: string;
  open: boolean;
  onClose: () => void;
  // Called after the restore succeeds; the parent refetches the paper and
  // re-seeds the editor instead of doing a hard page reload.
  onRestored: () => void;
}

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VersionHistoryDialog({
  paperId,
  open,
  onClose,
  onRestored,
}: VersionHistoryDialogProps) {
  const { data: versions, isLoading } = useGetPaperVersionsQuery(paperId);
  const [restoreVersion, { isLoading: isRestoring }] =
    useRestorePaperVersionMutation();
  // Version waiting for explicit confirmation — restoring overwrites the
  // current editor content, so never do it on a single click.
  const [pendingRestore, setPendingRestore] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleRestore = async () => {
    if (!pendingRestore) return;
    try {
      await restoreVersion({ paperId, versionId: pendingRestore.id }).unwrap();
      setPendingRestore(null);
      onClose();
      onRestored();
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to restore version");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Auto-saved snapshots from each edit. Restore any previous version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))
          ) : !versions || versions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <History className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No saved versions yet.</p>
              <p className="text-xs mt-1">
                Versions are created automatically when you save your paper.
              </p>
            </div>
          ) : (
            versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {v.title || `Version ${v.version}`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(v.savedAt)}
                    <span className="text-muted-foreground/50">|</span>
                    {formatBytes(v.sizeBytes)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPendingRestore({
                      id: v.id,
                      label: v.title || `Version ${v.version}`,
                    })
                  }
                  disabled={isRestoring}
                  className="flex-shrink-0"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>

      <AlertDialog
        open={pendingRestore !== null}
        onOpenChange={(v) => !v && setPendingRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              Restoring <strong>{pendingRestore?.label}</strong> replaces the
              current editor content. Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleRestore();
              }}
              disabled={isRestoring}
            >
              {isRestoring ? "Restoring…" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
