import { BellPlus } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal08AdminAlerts() {
  return (
    <FinalFeatureSlide
      icon={BellPlus}
      kicker="Project Update — Admin"
      title="Admin — Alerts"
      gradient="from-amber-500 to-orange-600"
      shadow="shadow-amber-500/30"
      routeIcon="🚨"
      explainer="Admins see trouble before users feel it — a central alerts console surfaces system warnings, failures and things that need attention, before they become incidents."
      chips={["🚨 Central alert console", "⚠️ Warnings & failures", "✅ Actionable triage"]}
      route="dashboard/admin/alerts"
      shots={[
        {
          src: "/slides/admin-alterts.png",
          title: "Alerts Console",
          badge: "🚨 Alerts",
          description: "Every system alert in one queue — severity at a glance, nothing slips through.",
        },
      ]}
      footer="🚨 From reactive firefighting to proactive operations"
    />
  );
}
