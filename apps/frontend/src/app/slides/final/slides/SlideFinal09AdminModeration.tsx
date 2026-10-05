import { ShieldCheck } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal09AdminModeration() {
  return (
    <FinalFeatureSlide
      icon={ShieldCheck}
      kicker="Project Update — Admin"
      title="Admin — Moderation"
      gradient="from-rose-600 to-red-700"
      shadow="shadow-rose-500/30"
      routeIcon="⚖️"
      explainer="Communities stay healthy by design — moderators review flagged content and users from one queue, keeping collaboration safe without slowing research down."
      chips={["🚩 Flag review queue", "👥 User moderation", "⚖️ Safe collaboration"]}
      route="dashboard/admin/moderation"
      shots={[
        {
          src: "/slides/admin-moderation.png",
          title: "Moderation Queue",
          badge: "⚖️ Moderation",
          description: "Flagged content and users in one workflow — review, act, and move on.",
        },
      ]}
      footer="⚖️ Trust & safety built in — not bolted on after launch"
    />
  );
}
