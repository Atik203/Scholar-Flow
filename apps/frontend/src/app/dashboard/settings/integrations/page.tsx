"use client";

import { motion } from "motion/react";
import {
  Globe,
  Lock,
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

/**
 * IntegrationsPage
 *
 * Outbound webhooks (the real backend integration surface) are managed
 * by workspace admins from the Admin > Webhooks page. User-level Slack /
 * Discord integrations are not built yet — this page says so honestly
 * instead of faking saves.
 */

const INTEGRATIONS = [
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
    description:
      "Push events to any HTTP endpoint that accepts JSON payloads. Admin-managed.",
    icon: Webhook,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Connect Scholar-Flow with external tools and services.
        </p>
      </div>

      <div className="grid gap-4">
        {INTEGRATIONS.map(({ id, name, description, icon: Icon }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {name}
                      {id !== "webhook" && (
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
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Outbound webhooks
          </CardTitle>
          <CardDescription>
            Webhook endpoints, secrets, event subscriptions, and delivery
            history are managed by admins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/admin/webhooks">
              <Globe className="h-4 w-4" />
              Admin: Manage webhooks
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Requires the Admin role. Slack and Discord integrations are
            planned and will appear here when available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
