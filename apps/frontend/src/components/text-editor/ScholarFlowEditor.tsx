"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import {
  AlertCircle,
  Clock,
  Download,
  FileText,
  Save,
  Send,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// TipTap Extensions
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { StarterKit } from "@tiptap/starter-kit";

// TipTap UI Components
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// TipTap Node Extensions
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// Hooks
import { useIsMobile } from "@/hooks/use-mobile";

// Lib
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// Redux API
import {
  useExportPaperDocxMutation,
  useExportPaperPdfMutation,
  useGetEditorPaperQuery,
  usePublishDraftMutation,
  useUpdateEditorContentMutation,
} from "@/redux/api/paperApi";

// Components
import { ShareModal } from "./ShareModal";

// Utils
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";

interface ScholarFlowEditorProps {
  paperId: string;
  onBack: () => void;
}

export function ScholarFlowEditor({ paperId, onBack }: ScholarFlowEditorProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Redux hooks
  const {
    data: paperResponse,
    isLoading,
    error,
  } = useGetEditorPaperQuery(paperId);
  const [updateContent, { isLoading: isSaving }] =
    useUpdateEditorContentMutation();
  const [exportPaperPdf, { isLoading: isExportingPdf }] =
    useExportPaperPdfMutation();
  const [exportPaperDocx, { isLoading: isExportingDocx }] =
    useExportPaperDocxMutation();
  const [publishDraft, { isLoading: isPublishing }] = usePublishDraftMutation();

  const paper = paperResponse?.data;

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Paper content editor",
        class:
          "scholar-flow-editor prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 5,
        upload: handleImageUpload,
        onError: (error) => {
          console.error("Upload failed:", error);
          showErrorToast("Image upload failed", error.message);
        },
      }),
    ],
    content: "",
    onUpdate: () => {
      setHasUnsavedChanges(true);
      // Trigger debounced auto-save
      if (debouncedAutoSaveTimeoutId) {
        clearTimeout(debouncedAutoSaveTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        // Auto-save logic will be called here
        if (hasUnsavedChanges && !isSaving && editor) {
          handleAutoSave();
        }
      }, 2000);
      setDebouncedAutoSaveTimeoutId(timeoutId);
    },
  });

  // Auto-save function
  const handleAutoSave = useCallback(async () => {
    if (!editor || !hasUnsavedChanges || isSaving) return;

    try {
      const content = editor.getHTML();
      await updateContent({
        id: paperId,
        content,
        title,
        isDraft: true,
      }).unwrap();

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error: any) {
      console.error("Auto-save failed:", error);
      showErrorToast("Auto-save failed", error?.data?.message);
    }
  }, [editor, paperId, hasUnsavedChanges, isSaving, updateContent, title]);

  // Debounced auto-save - wait for user to stop typing
  const [debouncedAutoSaveTimeoutId, setDebouncedAutoSaveTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  // Initialize editor content when paper data is loaded
  useEffect(() => {
    if (paper && editor) {
      setTitle(paper.title);
      if (paper.contentHtml) {
        editor.commands.setContent(paper.contentHtml);
      }
      setHasUnsavedChanges(false);
    }
  }, [paper, editor]);

  // Manual save
  const handleSave = async () => {
    if (!editor) return;

    try {
      const content = editor.getHTML();
      await updateContent({
        id: paperId,
        content,
        title,
        isDraft: true,
      }).unwrap();

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      showSuccessToast("Paper saved successfully!");
    } catch (error: any) {
      console.error("Save failed:", error);
      showErrorToast("Failed to save paper", error?.data?.message);
    }
  };

  // Publish draft
  const handlePublish = async () => {
    if (!paper) return;

    try {
      await publishDraft({
        id: paperId,
        title,
      }).unwrap();

      showSuccessToast("Paper published successfully!");
    } catch (error: any) {
      console.error("Publish failed:", error);
      showErrorToast("Failed to publish paper", error?.data?.message);
    }
  };

  // Export functions
  const handleExportPdf = async () => {
    try {
      const response = await exportPaperPdf(paperId);
      if ("data" in response && response.data) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "paper"}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccessToast("PDF exported successfully!");
      } else {
        throw response.error;
      }
    } catch (error: any) {
      console.error("PDF export failed:", error);
      showErrorToast(
        "Failed to export PDF",
        error?.data?.message || "Unknown error"
      );
    }
  };

  const handleExportDocx = async () => {
    try {
      const response = await exportPaperDocx(paperId);
      if ("data" in response && response.data) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "paper"}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccessToast("DOCX exported successfully!");
      } else {
        throw response.error;
      }
    } catch (error: any) {
      console.error("DOCX export failed:", error);
      showErrorToast(
        "Failed to export DOCX",
        error?.data?.message || "Unknown error"
      );
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedAutoSaveTimeoutId) {
        clearTimeout(debouncedAutoSaveTimeoutId);
      }
    };
  }, [debouncedAutoSaveTimeoutId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <p>Paper not found or you don't have access.</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            className="text-2xl font-bold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-200 focus:rounded px-2 py-1 w-full max-w-2xl"
            placeholder="Untitled Paper"
          />
          <div className="flex items-center gap-4 mt-2">
            <Badge variant={paper.isDraft ? "secondary" : "default"}>
              {paper.isDraft ? "Draft" : "Published"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : "Not saved"}
              {hasUnsavedChanges && (
                <span className="text-orange-600">• Unsaved changes</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            variant="outline"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {paper.isDraft && (
            <Button onClick={handlePublish} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}

          <Button
            onClick={handleExportPdf}
            variant="outline"
            size="sm"
            disabled={isExportingPdf}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExportingPdf ? "Exporting..." : "PDF"}
          </Button>

          <Button
            onClick={handleExportDocx}
            variant="outline"
            size="sm"
            disabled={isExportingDocx}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isExportingDocx ? "Exporting..." : "DOCX"}
          </Button>

          <Button
            onClick={() => setIsShareModalOpen(true)}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardContent className="p-0">
          <EditorContext.Provider value={{ editor }}>
            {/* Toolbar */}
            <Toolbar className="border-b">
              <Spacer />

              <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                <ListDropdownMenu
                  types={["bulletList", "orderedList", "taskList"]}
                  portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <ImageUploadButton text="Image" />
              </ToolbarGroup>

              <Spacer />
            </Toolbar>

            {/* Editor Content */}
            <div className="p-6">
              <EditorContent
                editor={editor}
                role="presentation"
                className="min-h-[500px] focus-within:outline-none"
              />
            </div>
          </EditorContext.Provider>
        </CardContent>
      </Card>

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
          Auto-saving...
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        paperId={paperId}
        paperTitle={title}
        isPublished={paper?.isPublished || false}
      />
    </div>
  );
}
