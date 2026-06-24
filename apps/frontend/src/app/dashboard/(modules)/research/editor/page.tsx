"use client";

import { TextEditorDashboard } from "@/components/text-editor/TextEditorDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default function TextEditorPage() {
  return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <TextEditorDashboard />
      </Suspense>
  );
}
