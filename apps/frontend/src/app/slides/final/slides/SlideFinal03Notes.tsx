import { NotebookPen } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal03Notes() {
  return (
    <FinalFeatureSlide
      icon={NotebookPen}
      kicker="Project Update — New"
      title="Research Notes"
      explainer="Every paper gets a living notebook — hierarchical notes organized per paper, so observations, ideas and reading progress stay attached to the source instead of scattered across files."
      chips={["📓 Notebook hierarchy", "📎 Linked to papers", "📝 Rich-text editing"]}
      route="dashboard/notes"
      routeIcon="📓"
      shots={[
        {
          src: "/slides/notes.png",
          title: "Notes Workspace",
          badge: "📓 Notes",
          description: "Browse, create and organize research notes — each note tied to its paper with full rich-text editing.",
        },
      ]}
      footer="💡 Notes turn passive reading into structured, searchable knowledge"
    />
  );
}
