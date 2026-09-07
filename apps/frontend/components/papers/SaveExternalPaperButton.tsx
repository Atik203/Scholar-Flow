"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  useImportByArxivMutation,
  useImportByDOIMutation,
  useImportBySmartURLMutation,
} from "@/redux/api/importApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import type { DiscoveryItem } from "@/redux/api/searchApi";

const ARXIV_ID_RE = /^\d{4}\.\d{4,5}(?:v\d+)?$|^[a-z-]+(?:\.[a-z-]+)*\/\d{7}$/i;

function extractDoi(input: string): string | null {
  const m = input.match(/10\.\d{4,9}\/[-._;()/:a-z0-9]+/i);
  return m ? m[0].replace(/\.$/, "") : null;
}

/**
 * Save an external discovery item (arXiv/OpenAlex) into the user's first
 * accessible workspace via the existing import flow — arXiv ID, DOI, or
 * smart URL depending on what the item carries. Shows a success toast and
 * navigates to the created paper.
 */
export function SaveExternalPaperButton({
  item,
  className,
  variant = "outline",
  size = "sm",
}: {
  item: DiscoveryItem;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: workspaces } = useListWorkspacesQuery({ limit: 10, scope: "all" });
  const [importByArxiv] = useImportByArxivMutation();
  const [importByDOI] = useImportByDOIMutation();
  const [importBySmartURL] = useImportBySmartURLMutation();

  const workspace = workspaces?.data?.[0];

  const handleSave = async () => {
    if (saving || saved) return;
    if (!workspace) {
      showErrorToast("Create or join a workspace first to save papers");
      return;
    }
    setSaving(true);
    try {
      const workspaceId = workspace.id;
      const sourceInput = item.externalUrl ?? item.id;
      const doi = extractDoi(sourceInput);

      let result: { id?: string; paper?: { id?: string } } = {};
      if (item.source === "arxiv" && ARXIV_ID_RE.test(item.id)) {
        result = await importByArxiv({ arxivId: item.id, workspaceId }).unwrap();
      } else if (doi && (item.source === "openalex" || /doi\.org|10\.\d{4,9}\//i.test(sourceInput))) {
        result = await importByDOI({ doi, workspaceId }).unwrap();
      } else {
        result = await importBySmartURL({ url: sourceInput, workspaceId }).unwrap();
      }

      setSaved(true);
      showSuccessToast("Paper saved to your library");
      const paperId = result.paper?.id ?? result.id;
      if (paperId) {
        setTimeout(() => router.push(`/dashboard/papers/${paperId}`), 800);
      }
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } };
      showErrorToast(err?.data?.message || "Failed to save paper");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      variant={saved ? "secondary" : variant}
      size={size}
      className={className}
      onClick={handleSave}
      disabled={saving}
    >
      {saving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : saved ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {saved ? "Saved" : "Save to Library"}
    </Button>
  );
}