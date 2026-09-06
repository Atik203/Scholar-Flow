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
  Image as ImageIcon,
  Move,
  Trash2,
  Type,
  WrapText,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ResizableImage,
  ResizableImageComponent,
  ResizableImageNodeViewRendererProps,
} from "tiptap-extension-resizable-image";

type WrapMode = "inline" | "break";

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const editor = (props as any).editor;
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [caption, setCaption] = useState<string>(
    (props.node.attrs["data-caption"] as string) || ""
  );
  const [wrapMode, setWrapMode] = useState<WrapMode>(
    (props.node.attrs["data-wrap"] as WrapMode) || "inline"
  );

  const posX = Number(props.node.attrs["data-position-x"] ?? 0) || 0;
  const posY = Number(props.node.attrs["data-position-y"] ?? 0) || 0;
  const align =
    (props.node.attrs["data-align"] as string) || "center";

  const containerRef = useRef<HTMLDivElement>(null);
  const dragFrameRef = useRef<number>(0);

  // ================================================================
  // Attribute update helper — persists all image metadata
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

  // ================================================================
  // Drag handlers — GPU-accelerated with requestAnimationFrame
  // ================================================================
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - posX,
        y: e.clientY - posY,
      });
    },
    [posX, posY]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleDrag = (e: MouseEvent) => {
      if (dragFrameRef.current) return; // throttle to 60fps
      dragFrameRef.current = requestAnimationFrame(() => {
        const nx = Math.max(-200, Math.min(e.clientX - dragOffset.x, window.innerWidth - 200));
        const ny = Math.max(-200, Math.min(e.clientY - dragOffset.y, window.innerHeight - 200));
        updateAttrs({
          "data-position-x": Math.round(nx),
          "data-position-y": Math.round(ny),
        });
        dragFrameRef.current = 0;
      });
    };

    const handleUp = () => {
      setIsDragging(false);
      if (dragFrameRef.current) {
        cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = 0;
      }
    };

    document.addEventListener("mousemove", handleDrag, { passive: true });
    document.addEventListener("mouseup", handleUp, { once: true });

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleUp);
      if (dragFrameRef.current) {
        cancelAnimationFrame(dragFrameRef.current);
      }
    };
  }, [isDragging, dragOffset, updateAttrs]);

  // ================================================================
  // Alignment, caption, wrap
  // ================================================================
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

  const deleteImage = useCallback(() => {
    requestAnimationFrame(() => {
      editor.chain().focus().deleteSelection().run();
    });
  }, [editor]);

  const resetPosition = useCallback(() => {
    updateAttrs({ "data-position-x": 0, "data-position-y": 0 });
  }, [updateAttrs]);

  // Build style
  const imageStyle: React.CSSProperties = {
    display: wrapMode === "break" ? "block" : "inline-block",
    marginLeft: align === "center" && wrapMode === "break" ? "auto" : undefined,
    marginRight: align === "center" && wrapMode === "break" ? "auto" : undefined,
    transform: `translate(${posX}px, ${posY}px)`,
    transition: isDragging ? "none" : "transform 0.15s ease-out",
    willChange: isDragging ? "transform" : "auto",
    position: "relative",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 1000 : 1,
    textAlign: wrapMode === "break" ? (align as React.CSSProperties["textAlign"]) : undefined,
  };

  return (
    <NodeViewWrapper
      className={`scholar-image ${isDragging ? "is-dragging" : ""} wrap-${wrapMode}`}
      data-drag-handle
      ref={containerRef}
      style={imageStyle}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="image-body"
            onMouseDown={handleDragStart}
            style={{ display: "inline-block", position: "relative", outline: "none" }}
          >
            {/* Drag indicator overlay */}
            <div className="image-drag-overlay">
              <GripHorizontal className="h-4 w-4" />
            </div>

            {/* Resize handles are provided by ResizableImageComponent */}
            <ResizableImageComponent {...props} />

            {/* Caption */}
            {caption && (
              <figcaption
                className="image-caption-display"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {caption}
              </figcaption>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3" side="bottom" align="center" sideOffset={8}>
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
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1 w-10">Align:</span>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setAlignment("left")} title="Left">
                <AlignLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setAlignment("center")} title="Center">
                <AlignCenter className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setAlignment("right")} title="Right">
                <AlignRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Wrap mode */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1 w-10">Wrap:</span>
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
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={copyImageUrl}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={resetPosition}>
                <Move className="h-3 w-3 mr-1" /> Reset
              </Button>
              <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={deleteImage}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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
