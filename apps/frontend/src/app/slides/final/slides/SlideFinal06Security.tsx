import { ShieldCheck } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal06Security() {
  return (
    <FinalFeatureSlide
      icon={ShieldCheck}
      kicker="Project Update — New"
      title="Account Security"
      gradient="from-emerald-600 to-teal-700"
      shadow="shadow-emerald-500/30"
      routeIcon="🛡️"
      explainer="Research is sensitive — accounts are protected with two-factor authentication, visible active sessions, and a full login history so users always know who accessed their work."
      chips={["🔑 Two-factor auth", "💻 Active sessions", "🧾 Login history"]}
      route="dashboard/security"
      shots={[
        {
          src: "/slides/security.png",
          title: "Security Hub",
          badge: "🛡️ Security",
          description: "2FA, session management and login history — every control in one trusted place.",
        },
      ]}
      footer="🛡️ Institutional-grade trust — users see and control every access"
    />
  );
}
