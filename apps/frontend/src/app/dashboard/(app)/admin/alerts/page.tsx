"use client";

/**
 * Admin System Alerts Page
 */

import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useGetAlertCountsQuery, useListAlertsQuery, useResolveAlertMutation, type SystemAlertSeverity } from "@/redux/api/adminExtendedApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const SEVERITY_ICON: Record<SystemAlertSeverity, typeof Info> = {
  INFO: Info,
  WARNING: AlertTriangle,
  CRITICAL: ShieldAlert,
};
const SEVERITY_COLOR: Record<SystemAlertSeverity, string> = {
  INFO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminAlertsPage() {
  const [filter, setFilter] = useState<"all" | "unresolved">("unresolved");
  const { data, isLoading, refetch } = useListAlertsQuery({
    resolved: filter === "unresolved" ? false : undefined,
    limit: 50,
  });
  const { data: counts } = useGetAlertCountsQuery();
  const [resolve] = useResolveAlertMutation();
  const alerts = data?.data ?? [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Bell className="h-7 w-7 text-white" />}
        title="System Alerts"
        description="Auto-generated system health alerts"
      />

      {counts && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Unresolved", value: counts.data.unresolved, color: "from-blue-500 to-indigo-600" },
            { label: "Critical", value: counts.data.critical, color: "from-red-500 to-rose-600" },
            { label: "Warning", value: counts.data.warning, color: "from-amber-500 to-orange-600" },
            { label: "Info", value: counts.data.info, color: "from-emerald-500 to-teal-600" },
          ].map((s, i) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white`}
                >
                  <Bell className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="flex gap-1 p-1 bg-muted rounded-md max-w-xs">
        {(["unresolved", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-sm ${
              filter === s
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {s === "all" ? "All" : "Unresolved"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <p>All clear — no {filter === "unresolved" ? "unresolved" : ""} alerts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => {
            const Icon = SEVERITY_ICON[a.severity];
            return (
              <Card key={a.id}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${SEVERITY_COLOR[a.severity]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{a.title}</p>
                      <Badge variant="outline">{a.category}</Badge>
                      {a.resolved && (
                        <Badge className="bg-slate-100 text-slate-700">Resolved</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(a.createdAt).toLocaleString()}
                      {a.resolvedBy
                        ? ` · Resolved by ${a.resolvedBy.email}`
                        : ""}
                    </p>
                  </div>
                  {!a.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await resolve(a.id).unwrap();
                          showSuccessToast("Resolved", "Alert resolved");
                          refetch();
                        } catch {
                          showErrorToast("Failed", "Could not resolve alert");
                        }
                      }}
                    >
                      Resolve
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
