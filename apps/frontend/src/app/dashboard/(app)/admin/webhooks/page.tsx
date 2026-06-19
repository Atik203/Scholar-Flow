"use client";

/**
 * Admin Webhooks Page
 */

import { useState } from "react";
import { Activity, Copy, Key, Plus, RefreshCw, RotateCcw, Trash2, Webhook, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useCreateEndpointMutation, useDeleteEndpointMutation, useListEndpointsQuery, useListEventTypesQuery, useRotateSecretMutation, useTestEndpointMutation } from "@/redux/api/adminWebhooksApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INACTIVE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminWebhooksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading, refetch } = useListEndpointsQuery();
  const { data: eventTypes } = useListEventTypesQuery();
  const [create] = useCreateEndpointMutation();
  const [remove] = useDeleteEndpointMutation();
  const [rotate] = useRotateSecretMutation();
  const [test] = useTestEndpointMutation();
  const endpoints = data?.data ?? [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Webhook className="h-7 w-7 text-white" />}
        title="Webhooks"
        description="Outbound webhook endpoints and delivery log"
        actions={
          <>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              New endpoint
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : endpoints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No webhook endpoints yet.</p>
            <Button
              onClick={() => setShowCreate(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first endpoint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {endpoints.map((ep) => (
            <Card key={ep.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {ep.name}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1 break-all">
                      {ep.url}
                    </CardDescription>
                  </div>
                  <Badge className={STATUS_COLOR[ep.status] ?? ""}>
                    {ep.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <p className="text-lg font-bold">{ep.totalDeliveries}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="text-lg font-bold text-red-600">
                      {ep.failedDeliveries}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Events</p>
                    <p className="text-sm font-medium">{ep.events.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Secret</p>
                    <p className="text-sm font-mono">{ep.secretPrefix}…</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await test(ep.id).unwrap();
                        showSuccessToast("Sent", "Test event fired");
                      } catch {
                        showErrorToast("Failed", "Could not fire test event");
                      }
                    }}
                    className="gap-1"
                  >
                    <Activity className="h-3 w-3" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const result = await rotate(ep.id).unwrap();
                        await navigator.clipboard.writeText(result.data._secret);
                        showSuccessToast("Rotated", "New secret copied to clipboard");
                      } catch {
                        showErrorToast("Failed", "Could not rotate secret");
                      }
                    }}
                    className="gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Rotate secret
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (confirm("Delete this webhook?")) {
                        await remove(ep.id);
                        refetch();
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && eventTypes && (
        <CreateEndpointDialog
          events={eventTypes.data.events}
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            try {
              const result = await create(payload).unwrap();
              showSuccessToast("Created", "Webhook endpoint created");
              setShowCreate(false);
              if (result.data._secret) {
                alert(
                  `Save this secret now — you will not see it again:\n\n${result.data._secret}`
                );
              }
            } catch {
              showErrorToast("Failed", "Could not create endpoint");
            }
          }}
        />
      )}
    </div>
  );
}

function CreateEndpointDialog({
  events,
  onClose,
  onCreate,
}: {
  events: Array<{ id: string; name: string; category: string }>;
  onClose: () => void;
  onCreate: (p: { name: string; url: string; events: string[] }) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">New webhook endpoint</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production API"
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Events</label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1 mt-1">
              {events.map((e) => (
                <label
                  key={e.id}
                  className="flex items-center gap-2 text-sm p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={(ev) =>
                      setSelected(
                        ev.target.checked
                          ? [...selected, e.id]
                          : selected.filter((s) => s !== e.id)
                      )
                    }
                  />
                  <span>{e.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {e.category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!name || !url || selected.length === 0}
            onClick={() => onCreate({ name, url, events: selected })}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
