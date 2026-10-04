import { TextEditorDashboard } from "@/components/text-editor/TextEditorDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default async function EditorPaperPage(
  props: PageProps<"/dashboard/research/editor/[id]">
) {
  const { id } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <TextEditorDashboard paperId={id} />
    </Suspense>
  );
}
