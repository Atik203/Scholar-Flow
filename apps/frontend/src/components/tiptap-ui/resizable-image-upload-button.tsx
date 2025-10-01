"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { handleImageUpload } from "@/lib/tiptap-utils";
import * as React from "react";

export interface ResizableImageUploadButtonProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: any;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
}

export const ResizableImageUploadButton = React.forwardRef<
  HTMLButtonElement,
  ResizableImageUploadButtonProps
>(({ editor: providedEditor, text, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      // Reset the input value so the same file can be selected again
      event.target.value = "";

      try {
        const url = await handleImageUpload(file);

        // Insert the image using insertContent with ResizableImage node
        const success = editor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: {
              src: url,
              alt: file.name,
              title: file.name,
              width: 400,
              height: 300,
              "data-keep-ratio": true,
            },
          })
          .run();

        if (success) {
          showSuccessToast("Image uploaded successfully!");
        } else {
          showErrorToast(
            "Failed to insert image",
            "Could not insert image into editor"
          );
        }
      } catch (error) {
        console.error("Upload failed:", error);
        showErrorToast(
          "Image upload failed",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    [editor]
  );

  const canInsert = editor?.can?.().insertContent?.({ type: "image" }) ?? false;

  if (!editor?.isEditable) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        data-style="ghost"
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label="Upload image"
        tooltip="Upload image"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        <ImagePlusIcon className="tiptap-button-icon" />
        {text && <span className="tiptap-button-text">{text}</span>}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </>
  );
});

ResizableImageUploadButton.displayName = "ResizableImageUploadButton";
