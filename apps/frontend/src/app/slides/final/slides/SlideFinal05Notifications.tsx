import { BellRing } from "lucide-react";
import FinalFeatureSlide from "./FinalFeatureSlide";

export default function SlideFinal05Notifications() {
  return (
    <FinalFeatureSlide
      icon={BellRing}
      kicker="Project Update — New"
      title="Notifications"
      explainer="Nobody misses a beat — a real SSE-powered stream pushes mentions, shares and updates instantly, with a full center to catch up and per-user settings to control the noise."
      chips={["📡 Real-time SSE stream", "🔔 Bell + center + history", "⚙️ Per-user settings"]}
      route="dashboard/notifications"
      routeIcon="🔔"
      shots={[
        {
          src: "/slides/notification-center.png",
          title: "Notification Center",
          badge: "🔔 Inbox",
          description: "Every mention, share and update in one inbox — read, unread and history included.",
        },
        {
          src: "/slides/notification-setting.png",
          title: "Notification Settings",
          badge: "⚙️ Control",
          description: "Each user tunes exactly what notifies them — collaboration without the spam.",
        },
      ]}
      footer="📡 Server-sent events — instant delivery, zero polling, full user control"
    />
  );
}
