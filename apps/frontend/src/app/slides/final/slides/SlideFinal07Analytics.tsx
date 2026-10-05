import { BarChart3 } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal07Analytics() {
  return (
    <FinalFeatureSlide
      icon={BarChart3}
      kicker="Project Update — New"
      title="Analytics"
      gradient="from-purple-600 to-indigo-700"
      shadow="shadow-purple-500/30"
      routeIcon="📊"
      explainer="Progress you can measure — personal reading stats, workspace-level activity and usage tracking, all exportable for reports and evaluations."
      chips={["👤 Personal stats", "👥 Workspace activity", "📤 Exportable reports"]}
      route="dashboard/analytics"
      shots={[
        {
          src: "/slides/analytics-personal.png",
          title: "Personal Analytics",
          badge: "👤 Personal",
          description: "Reading habits at a glance — papers read, notes taken and progress over time.",
        },
        {
          src: "/slides/analytics-usage.png",
          title: "Usage Analytics",
          badge: "📊 Usage",
          description: "Platform usage broken down — what the team actually does, where it matters.",
        },
      ]}
      footer="📊 Data-driven research — individuals improve, leads get the full picture"
    />
  );
}
