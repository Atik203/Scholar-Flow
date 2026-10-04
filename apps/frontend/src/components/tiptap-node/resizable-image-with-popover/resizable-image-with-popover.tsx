import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  GripHorizontal,
  Trash2,
  Type,
  WrapText,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import {
  ResizableImage,
  ResizableImageComponent,
  ResizableImageNodeViewRendererProps,
} from "tiptap-extension-resizable-image";

type WrapMode = "inline" | "break";

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const editor = (props as any).editor;
  const [caption, setCaption] = useState<string>(
    (props.node.attrs["data-caption"] as string) || ""
  );
  const [wrapMode, setWrapMode] = useState<WrapMode>(
    (props.node.attrs["data-wrap"] as WrapMode) || "inline"
  );

  const align = (props.node.attrs["data-align"] as string) || "center";

  // ================================================================
  // Attribute update helper — persists caption/align/wrap metadata
  // ================================================================
  const updateAttrs = useCallback(
    (attrs: Record<string, unknown>) => {
      const { getPos } = props as any;
      if (typeof getPos !== "function") return;
      const pos = getPos();
      if (typeof pos !== "number") return;

      editor
        .chain()
        .focus()
        .command(({ tr }: { tr: any }) => {
          tr.setNodeMarkup(pos, undefined, {
            ...props.node.attrs,
            ...attrs,
          });
          return true;
        })
        .run();
    },
    [editor, props]
  );

  const setAlignment = useCallback(
    (value: string) => {
      updateAttrs({ "data-align": value });
    },
    [updateAttrs]
  );

  const saveCaption = useCallback(() => {
    const trimmed = caption.trim();
    updateAttrs({ "data-caption": trimmed || null });
  }, [caption, updateAttrs]);

  const toggleWrap = useCallback(() => {
    const next: WrapMode = wrapMode === "inline" ? "break" : "inline";
    setWrapMode(next);
    updateAttrs({ "data-wrap": next });
  }, [wrapMode, updateAttrs]);

  const copyImageUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.node.attrs.src);
      showSuccessToast("Image URL copied");
    } catch {
      showErrorToast("Failed to copy");
    }
  }, [props.node.attrs.src]);

  // Delete the image node by position. deleteSelection() only removes the
  // current text selection and silently does nothing once the popover has
  // focus — the classic "delete button does nothing" bug.
  const deleteImage = useCallback(() => {
    const { getPos } = props as any;
    const pos = typeof getPos === "function" ? getPos() : null;
    if (typeof pos !== "number") return;

    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + props.node.nodeSize })
      .run();
  }, [editor, props]);

  // Images stay in the document flow; alignment and wrap only affect layout.
  const imageStyle: React.CSSProperties = {
    display: wrapMode === "break" ? "block" : "inline-block",
    marginLeft: align === "center" && wrapMode === "break" ? "auto" : undefined,
    marginRight: align === "center" && wrapMode === "break" ? "auto" : undefined,
    position: "relative",
    textAlign:
      wrapMode === "break"
        ? (align as React.CSSProperties["textAlign"])
        : undefined,
  };

  return (
    <NodeViewWrapper
      className={`scholar-image wrap-${wrapMode}`}
      style={imageStyle}
    >
      <div
        className="image-body"
        style={{ display: "inline-block", position: "relative" }}
      >
        {/* Resize handles come from ResizableImageComponent. The
            `.image-component` wrapper is required by the package CSS —
            without it the handles render unstyled (the package targets
            `.image-component .image-resizer`). */}
        <div className="image-component">
          <ResizableImageComponent {...props} />
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="image-caption-display">{caption}</figcaption>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="image-options-button"
              title="Image options"
              aria-label="Image options"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripHorizontal className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-64 p-3"
            side="bottom"
            align="center"
            sideOffset={8}
          >
            <div className="space-y-2">
              {/* Caption input */}
              <div className="flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onBlur={saveCaption}
                  onKeyDown={(e) => e.key === "Enter" && saveCaption()}
                  placeholder="Add caption..."
                  className="flex-1 text-xs border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1 w-10">
                  Align:
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setAlignment("left")}
                  title="Left"
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setAlignment("center")}
                  title="Center"
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setAlignment("right")}
                  title="Right"
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Wrap mode */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1 w-10">
                  Wrap:
                </span>
                <Button
                  variant={wrapMode === "inline" ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={toggleWrap}
                >
                  <WrapText className="h-3.5 w-3.5 mr-1" />
                  {wrapMode === "inline" ? "Inline" : "Break"}
                </Button>
              </div>

              <div className="border-t pt-2 flex items-center gap-1 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={copyImageUrl}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={deleteImage}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImageWithPopover = ResizableImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-position-x": {
        default: 0,
        parseHTML: (el) => parseFloat(el.getAttribute("data-position-x") || "0"),
        renderHTML: (attrs) => ({ "data-position-x": attrs["data-position-x"] }),
      },
      "data-position-y": {
        default: 0,
        parseHTML: (el) => parseFloat(el.getAttribute("data-position-y") || "0"),
        renderHTML: (attrs) => ({ "data-position-y": attrs["data-position-y"] }),
      },
      "data-align": {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs) => ({ "data-align": attrs["data-align"] }),
      },
      "data-caption": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-caption") || null,
        renderHTML: (attrs) => {
          if (!attrs["data-caption"]) return {};
          return { "data-caption": attrs["data-caption"] };
        },
      },
      "data-wrap": {
        default: "inline",
        parseHTML: (el) => el.getAttribute("data-wrap") || "inline",
        renderHTML: (attrs) => ({ "data-wrap": attrs["data-wrap"] }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      (props) => NodeView(props as unknown as ResizableImageNodeViewRendererProps)
    );
  },
});
