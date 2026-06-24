"use client";

/**
 * Admin AI Keys — read-only key presence view.
 *
 * Spec (Issue #1): admins see which API keys are configured on the
 * backend. The actual key values are never returned.
 *
 *   ✓ OPENAI_API_KEY configured
 *   ✗ ANTHROPIC_API_KEY missing
 *   ✗ GOOGLE_API_KEY missing
 *   ✗ DEEPSEEK_API_KEY missing
 *
 * The same data powers the model catalog's per-provider status
 * indicator on /dashboard/admin/ai.
 */

import { useGetKeyStatusesQuery } from "@/redux/api/aiProviderApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Key, XCircle } from "lucide-react";

export default function AdminAIKeysPage() {
  const { data, isLoading, refetch } = useGetKeyStatusesQuery();

  const statuses = data?.keyStatuses ?? [];
  const configured = statuses.filter((s) => s.configured).length;
  const missing = statuses.length - configured;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Key className="h-8 w-8 text-amber-600" />
          API Keys
        </h1>
        <p className="text-muted-foreground mt-2">
          Whether each provider's API key is present on the backend. We never
          display the key value itself — manage those via your environment
          variables.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Configured"
          value={configured}
          tone="green"
          loading={isLoading}
        />
        <StatTile label="Missing" value={missing} tone="red" loading={isLoading} />
        <StatTile
          label="Total tracked"
          value={statuses.length}
          tone="muted"
          loading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Keys</CardTitle>
          <CardDescription>
            The set of provider keys the admin AI panel tracks. To add a new
            provider key, contact the platform admin to add it to
            <code className="mx-1 font-mono text-xs">TRACKED_ENV_KEYS</code>
            in <code className="mx-1 font-mono text-xs">aiProvider.service.ts</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : statuses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No keys tracked.
            </p>
          ) : (
            <ul className="divide-y rounded-md border">
              {statuses.map((k) => (
                <li
                  key={k.envName}
                  className="flex items-center justify-between gap-3 px-3 py-3"
                >
                  <code className="font-mono text-sm">{k.envName}</code>
                  {k.configured ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      missing
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone,
  loading,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "muted";
  loading: boolean;
}) {
  const colorClass =
    tone === "green"
      ? "text-green-600"
      : tone === "red"
        ? "text-red-600"
        : "text-muted-foreground";
  return (
    <div className="border rounded-xl p-4 text-center bg-card">
      {loading ? (
        <Skeleton className="h-8 w-12 mx-auto" />
      ) : (
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      )}
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
