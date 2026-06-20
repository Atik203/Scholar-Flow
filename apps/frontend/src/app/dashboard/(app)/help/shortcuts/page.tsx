"use client";

import { motion } from "motion/react";
import { ArrowLeft, Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Shortcut {
  action: string;
  combo: string[];
}

const NAVIGATION_SHORTCUTS: Shortcut[] = [
  { action: "Go to Dashboard", combo: ["G", "D"] },
  { action: "Go to Papers", combo: ["G", "P"] },
  { action: "Go to Collections", combo: ["G", "C"] },
  { action: "Go to Workspaces", combo: ["G", "W"] },
  { action: "Go to Search", combo: ["G", "S"] },
  { action: "Go to Settings", combo: ["G", ","] },
];

const PAPER_SHORTCUTS: Shortcut[] = [
  { action: "Upload a paper", combo: ["Ctrl", "U"] },
  { action: "Open paper details", combo: ["Enter"] },
  { action: "Copy citation", combo: ["Ctrl", "Shift", "C"] },
  { action: "Toggle favorite", combo: ["Ctrl", "F"] },
  { action: "Close / go back", combo: ["Esc"] },
];

const GENERAL_SHORTCUTS: Shortcut[] = [
  { action: "Command palette", combo: ["Ctrl", "K"] },
  { action: "Show this help", combo: ["?"] },
  { action: "Toggle dark mode", combo: ["Ctrl", "Shift", "D"] },
  { action: "Save changes", combo: ["Ctrl", "S"] },
  { action: "Open notifications", combo: ["Ctrl", "N"] },
];

interface ShortcutSectionProps {
  title: string;
  shortcuts: Shortcut[];
}

function ShortcutSection({ title, shortcuts }: ShortcutSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground w-1/2">
                  Action
                </th>
                <th className="pb-3 font-medium text-muted-foreground">
                  Shortcut
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map(({ action, combo }) => (
                <tr key={action} className="border-b last:border-0">
                  <td className="py-3 pr-4">{action}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {combo.map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {key}
                          </Badge>
                          {i < combo.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function KeyboardShortcutsPage() {
  const router = useRouter();

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Keyboard className="h-7 w-7" />
            Keyboard Shortcuts
          </h1>
          <p className="text-muted-foreground mt-1">
            Speed up your research workflow with these keyboard shortcuts.
          </p>
        </div>
      </div>

      <ShortcutSection title="Navigation" shortcuts={NAVIGATION_SHORTCUTS} />
      <ShortcutSection title="Papers" shortcuts={PAPER_SHORTCUTS} />
      <ShortcutSection title="General" shortcuts={GENERAL_SHORTCUTS} />
    </div>
  );
}
