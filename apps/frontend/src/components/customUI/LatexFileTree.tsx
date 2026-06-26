"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Folder,
  FolderOpen,
  FilePlus,
  Trash2,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LatexFileNode {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  order: number;
}

interface Props {
  paperId: string;
  activeFileId: string | null;
  onFileSelect: (file: LatexFileNode) => void;
  onFilesChange: (files: LatexFileNode[]) => void;
  onCompile: () => void;
}

import { API_BASE_URL as API_BASE } from "@/lib/apiUrl";

function getToken(): string | null {
  try {
    const store = (window as any).__REDUX_STORE__;
    return store?.getState()?.auth?.accessToken || null;
  } catch { return null; }
}

export function LatexFileTree({ paperId, activeFileId, onFileSelect, onFilesChange, onCompile }: Props) {
  const [files, setFiles] = useState<LatexFileNode[]>([]);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const loadFiles = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/export/latex-project/${paperId}/files`, { headers });
      const d = await r.json();
      if (d.data?.files) {
        setFiles(d.data.files);
        onFilesChange(d.data.files);
      }
    } catch { setError("Failed to load project files"); }
  }, [paperId]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    setAdding(true);
    try {
      const r = await fetch(`${API_BASE}/export/latex-project/${paperId}/files`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName.trim() }),
      });
      const d = await r.json();
      if (d.data) {
        setFiles((prev) => [...prev, d.data]);
        onFileSelect(d.data);
        setNewFileName("");
      }
    } catch {} finally { setAdding(false); }
  };

  const handleDeleteFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/export/latex-project/${paperId}/files/${fileId}`, {
        method: "DELETE",
        headers,
      });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {}
  };

  const handleSelectFile = async (file: LatexFileNode) => {
    setLoadingFileId(file.id);
    try {
      const r = await fetch(`${API_BASE}/export/latex-project/${paperId}/files/${file.id}`, { headers });
      const d = await r.json();
      if (d.data) onFileSelect(d.data);
    } catch {} finally { setLoadingFileId(null); }
  };

  // Group files by directory
  const rootFiles = files.filter((f) => !f.name.includes("/") || f.name.split("/").length === 1);
  const dirFiles = files.filter((f) => f.name.includes("/"));

  // Collect top-level directories
  const dirs = new Set(dirFiles.map((f) => f.name.split("/")[0]));

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b space-y-2">
        <div className="flex gap-1">
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="new-file.tex"
            className="h-7 text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
          />
          <Button size="sm" className="h-7 px-2" onClick={handleCreateFile} disabled={adding}>
            <FilePlus className="h-3 w-3" />
          </Button>
        </div>
        <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={onCompile}>
          Compile to PDF
        </Button>
      </div>

      {error && <p className="text-xs text-destructive px-2 py-1">{error}</p>}

      <ScrollArea className="flex-1">
        <div className="p-1 space-y-0.5">
          {/* Root-level files */}
          {rootFiles.map((f) => (
            <button
              key={f.id}
              onClick={() => handleSelectFile(f)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md hover:bg-accent transition-colors text-left group",
                activeFileId === f.id && "bg-accent font-medium"
              )}
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{f.name.replace(/^.*\//, "")}</span>
              <button
                onClick={(e) => handleDeleteFile(f.id, e)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          ))}

          {/* Directory groups */}
          {Array.from(dirs).sort().map((dir) => (
            <div key={dir}>
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                <Folder className="h-3.5 w-3.5" />
                <span className="truncate">{dir}/</span>
              </div>
              {dirFiles
                .filter((f) => f.name.startsWith(dir + "/"))
                .map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFile(f)}
                    className={cn(
                      "w-full flex items-center gap-2 pl-6 pr-2 py-1 text-xs rounded-md hover:bg-accent transition-colors text-left group",
                      activeFileId === f.id && "bg-accent font-medium"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{f.name.split("/").pop()}</span>
                    <button
                      onClick={(e) => handleDeleteFile(f.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
