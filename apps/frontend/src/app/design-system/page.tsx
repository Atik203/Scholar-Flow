import { DesignSystemDemo } from "@/components/customUI/DesignSystemDemo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System Demo - Scholar-Flow",
  description:
    "Showcase of Scholar-Flow's Phase 1 design system improvements including extended colors, typography scale, and layout components.",
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen">
      <DesignSystemDemo />
    </main>
  );
}
