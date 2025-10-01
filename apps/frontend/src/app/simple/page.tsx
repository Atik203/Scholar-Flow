"use client";

import { EditorSkeleton } from "@/components/text-editor/EditorSkeleton";
import dynamic from "next/dynamic";

// Lazy load the heavy TipTap SimpleEditor (reduces initial bundle by ~3.5MB)
const SimpleEditor = dynamic(
  () =>
    import("@/components/tiptap-templates/simple/simple-editor").then(
      (mod) => ({
        default: mod.SimpleEditor,
      })
    ),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

export default function Page() {
  return <SimpleEditor />;
}
