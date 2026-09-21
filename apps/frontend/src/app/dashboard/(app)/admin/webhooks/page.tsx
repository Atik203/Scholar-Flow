"use client";

/**
 * Admin Webhooks Page
 */

import { useMemo, useState } from "react";
import {
  Activity,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  Webhook,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { ConfirmDialog } from "@/components/customUI/ConfirmDialog";
import { useCreateEndpointMutation, useDeleteEndpointMutation, useListEndpointsQuery, useListEventTypesQuery, useRotateSecretMutation, useTestEndpointMutation, type WebhookEndpoint } from "@/redux/api/adminWebhooksApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INACTIVE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const maskSecret = (secret: string): string =>
  secret.length > 14
    ? `${secret.slice(0, 10)}${"•".repeat(16)}${secret.slice(-4)}`
    : "•".repeat(secret.length);

export default function AdminWebhooksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading, refetch } = useListEndpointsQuery();
  const {
    data: eventTypes,
    isError: eventTypesError,
    refetch: refetchEventTypes,
  } = useListEventTypesQuery();
  const [create, { isLoading: isCreating }] = useCreateEndpointMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteEndpointMutation();
  const [rotate] = useRotateSecretMutation();
  const [test] = useTestEndpointMutation();
  const endpoints = useMemo(() => data?.data ?? [], [data]);

  const [deleteTarget, setDeleteTarget] = useState<WebhookEndpoint | null>(
    null
  );
  // Session-only raw secrets for endpoints created/rotated on this visit
  const [revealedSecrets, setRevealedSecrets] = useState<
    Record<string, string>
  >({});
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied", `${label} copied to clipboard`);
    } catch {
      showErrorToast("Copy failed", "Could not copy to clipboard");
    }
  };

  const toggleVisible = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRotate = async (endpoint: WebhookEndpoint) => {
    try {
      const result = await rotate(endpoint.id).unwrap();
      setRevealedSecrets((prev) => ({
        ...prev,
        [endpoint.id]: result.data._secret,
      }));
      setVisibleIds((prev) => new Set(prev).add(endpoint.id));
      showSuccessToast(
        "Secret rotated",
        "Copy the new secret from the list before leaving this page"
      );
    } catch {
      showErrorToast("Failed", "Could not rotate secret");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id).unwrap();
      showSuccessToast("Deleted", "Webhook endpoint removed");
      setDeleteTarget(null);
    } catch {
      showErrorToast("Failed", "Could not delete endpoint");
    }
  };

  const handleOpenCreate = () => {
    if (!eventTypes) {
      showErrorToast(
        "Event types unavailable",
        eventTypesError
          ? "Could not load webhook event types. Retrying..."
          : "Loading event types, try again in a moment."
      );
      void refetchEventTypes();
      return;
    }
    setShowCreate(true);
  };

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
              onClick={handleOpenCreate}
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
              onClick={handleOpenCreate}
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
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Secret</p>
                    {revealedSecrets[ep.id] ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono truncate max-w-[200px]">
                          {visibleIds.has(ep.id)
                            ? revealedSecrets[ep.id]
                            : maskSecret(revealedSecrets[ep.id])}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => toggleVisible(ep.id)}
                          aria-label={
                            visibleIds.has(ep.id)
                              ? "Hide webhook secret"
                              : "Show webhook secret"
                          }
                        >
                          {visibleIds.has(ep.id) ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            copyToClipboard(
                              revealedSecrets[ep.id],
                              `${ep.name} secret`
                            )
                          }
                          aria-label={`Copy webhook secret for ${ep.name}`}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm font-mono">{ep.secretPrefix}…</p>
                    )}
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
                    onClick={() => handleRotate(ep)}
                    className="gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Rotate secret
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(ep)}
                    className="text-red-600"
                    aria-label={`Delete webhook ${ep.name}`}
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
          open={showCreate}
          events={eventTypes.data.events}
          isLoading={isCreating}
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            try {
              const result = await create(payload).unwrap();
              if (result.data._secret) {
                setRevealedSecrets((prev) => ({
                  ...prev,
                  [result.data.id]: result.data._secret,
                }));
                setVisibleIds((prev) => new Set(prev).add(result.data.id));
              }
              setShowCreate(false);
              showSuccessToast(
                "Endpoint created",
                "Copy the secret from the list before leaving this page"
              );
            } catch {
              showErrorToast("Failed", "Could not create endpoint");
            }
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete webhook endpoint"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" and its delivery history will be removed.`
            : ""
        }
        confirmLabel="Delete endpoint"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function CreateEndpointDialog({
  open,
  events,
  isLoading,
  onClose,
  onCreate,
}: {
  open: boolean;
  events: Array<{ id: string; name: string; category: string }>;
  isLoading: boolean;
  onClose: () => void;
  onCreate: (p: { name: string; url: string; events: string[] }) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleEvent = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((value) => value !== id)
    );
  };

  const handleClose = () => {
    setName("");
    setUrl("");
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New webhook endpoint</DialogTitle>
          <DialogDescription>
            We will send signed POST requests to this URL for the selected
            events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-name">Name</Label>
            <Input
              id="webhook-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production API"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL</Label>
            <Input
              id="webhook-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="space-y-2">
            <Label>Events</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
              {events.map((event) => (
                <label
                  key={event.id}
                  className="flex items-center gap-2 text-sm p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(event.id)}
                    onCheckedChange={(checked) =>
                      toggleEvent(event.id, checked === true)
                    }
                    aria-label={`Toggle ${event.name}`}
                  />
                  <span>{event.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {event.category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            disabled={!name || !url || selected.length === 0 || isLoading}
            onClick={() => onCreate({ name, url, events: selected })}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create endpoint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
