"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  MessageCircle,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  showSuccessToast,
} from "@/components/providers/ToastProvider";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: typeof Globe;
  comingSoon?: boolean;
};

const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Post notifications to a Slack channel via incoming webhook.",
    icon: MessageCircle,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send alerts and updates to a Discord server channel.",
    icon: MessageCircle,
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Push events to any HTTP endpoint that accepts JSON payloads.",
    icon: Webhook,
  },
];

type IntegrationState = Record<
  string,
  { enabled: boolean; url: string }
>;

export default function IntegrationsPage() {
  const [state, setState] = useState<IntegrationState>({
    slack: { enabled: false, url: "" },
    discord: { enabled: false, url: "" },
    webhook: { enabled: false, url: "" },
  });

  const update = (
    id: string,
    patch: Partial<IntegrationState[string]>
  ) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const handleSave = (id: string) => {
    const integration = INTEGRATIONS.find((i) => i.id === id);
    showSuccessToast(
      "Integration saved",
      `${integration?.name} settings have been updated.`
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Connect Scholar-Flow with external tools and services.
        </p>
      </div>

      <div className="grid gap-4">
        {INTEGRATIONS.map(({ id, name, description, icon: Icon, comingSoon }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {name}
                        {comingSoon && (
                          <Badge variant="secondary" className="text-xs">
                            Coming soon
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={state[id].enabled}
                    onCheckedChange={(v) => update(id, { enabled: v })}
                    disabled={comingSoon}
                  />
                </div>
              </CardHeader>
              {!comingSoon && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`url-${id}`}>Webhook URL</Label>
                    <Input
                      id={`url-${id}`}
                      type="url"
                      placeholder={
                        id === "slack"
                          ? "https://hooks.slack.com/services/..."
                          : id === "discord"
                            ? "https://discord.com/api/webhooks/..."
                            : "https://your-service.com/webhook"
                      }
                      value={state[id].url}
                      onChange={(e) => update(id, { url: e.target.value })}
                      disabled={!state[id].enabled}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSave(id)}
                    disabled={!state[id].enabled}
                  >
                    Save configuration
                  </Button>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Backend integration endpoints are currently in development. Configuration
        will be persisted once the API endpoints are available.
      </p>
    </div>
  );
}
