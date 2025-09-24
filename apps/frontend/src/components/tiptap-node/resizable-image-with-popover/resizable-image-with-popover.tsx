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
  Move,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ResizableImage,
  ResizableImageComponent,
  ResizableImageNodeViewRendererProps,
} from "tiptap-extension-resizable-image";

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const editor = props.editor;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const setTextAlign = useCallback(
    (textAlign: string) => {
      // Use setTimeout to avoid flushSync issues
      setTimeout(() => {
        editor.chain().focus().setTextAlign(textAlign).run();
      }, 0);
    },
    [editor]
  );

  const copyImageUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.node.attrs.src);
      showSuccessToast("Image URL copied to clipboard");
    } catch (error) {
      showErrorToast("Failed to copy image URL");
    }
  }, [props.node.attrs.src]);

  const deleteImage = useCallback(() => {
    // Use setTimeout to avoid flushSync issues
    setTimeout(() => {
      editor.chain().focus().deleteSelection().run();
    }, 0);
  }, [editor]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return; // Only allow dragging from the drag handle

      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };

      // Constrain to reasonable bounds
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 200;

      setPosition({
        x: Math.max(0, Math.min(newPosition.x, maxX)),
        y: Math.max(0, Math.min(newPosition.y, maxY)),
      });
    },
    [isDragging, dragStart]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);

      return () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  return (
    <NodeViewWrapper
      className={`image-component ${isDragging ? "dragging" : ""}`}
      data-drag-handle
      ref={containerRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.2s ease",
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? 1000 : "auto",
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div
            style={{
              display: "inline-flex",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* Drag Handle */}
            <div
              className="drag-handle"
              onMouseDown={handleDragStart}
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                background: "rgba(59, 130, 246, 0.9)",
                color: "white",
                borderRadius: "4px",
                padding: "4px",
                cursor: "move",
                zIndex: 10,
                opacity: 0.7,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              title="Drag to move image"
            >
              <Move className="h-3 w-3" />
            </div>
            <ResizableImageComponent {...props} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side="bottom" align="center">
          <div className="flex flex-col gap-2">
            {/* Text Alignment Controls */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 mr-2">Align:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTextAlign("left")}
                className="h-8 w-8 p-0"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTextAlign("center")}
                className="h-8 w-8 p-0"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTextAlign("right")}
                className="h-8 w-8 p-0"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Actions */}
            <div className="flex items-center gap-1 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={copyImageUrl}
                className="flex items-center gap-2 text-xs"
              >
                <Copy className="h-3 w-3" />
                Copy URL
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteImage}
                className="flex items-center gap-2 text-xs"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>

            {/* Reset Position */}
            <div className="flex items-center gap-1 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPosition({ x: 0, y: 0 })}
                className="flex items-center gap-2 text-xs"
              >
                <Move className="h-3 w-3" />
                Reset Position
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

export const ResizableImageWithPopover = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer((props) =>
      NodeView(props as unknown as ResizableImageNodeViewRendererProps)
    );
  },
});
