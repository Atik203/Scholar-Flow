import { MessagesSquare } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal04Discussions() {
  return (
    <FinalFeatureSlide
      icon={MessagesSquare}
      kicker="Project Update — New"
      title="Live Discussions"
      explainer="Teams debate papers in place — threaded discussions with a real-time live feed, so questions, answers and decisions stay in context instead of lost in chat apps."
      chips={["🧵 Threaded replies", "⚡ Real-time live feed", "👥 Workspace-scoped"]}
      route="dashboard/discussions"
      routeIcon="💬"
      shots={[
        {
          src: "/slides/discussion.png",
          title: "Discussion Board",
          badge: "💬 Discussions",
          description: "All paper discussions in one board — follow threads across the workspace.",
        },
        {
          src: "/slides/discussion-details-live.png",
          title: "Live Thread View",
          badge: "⚡ Live",
          description: "Thread detail with live updates — replies appear instantly for every participant.",
        },
      ]}
      footer="🤝 Decisions stay where the research lives — no more lost chat history"
    />
  );
}
