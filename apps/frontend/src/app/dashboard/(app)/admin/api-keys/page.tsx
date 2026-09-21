"use client";

/**
 * Admin API Keys Page
 *
 * Modern table view with create dialog (name/description/scopes/rate limit/expiry),
 * session-scoped key reveal (eye + copy) and confirm dialogs for revoke/delete.
 * Raw keys are hashed server-side — they are only available right after
 * creation, in this page's memory, and never persisted to storage.
 */

import { useMemo, useState } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/customUI/PageHeader";
import { ConfirmDialog } from "@/components/customUI/ConfirmDialog";
import {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useListApiKeysQuery,
  useRevokeApiKeyMutation,
  type AdminApiKey,
} from "@/redux/api/adminExtendedApi";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REVOKED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const SCOPE_OPTIONS = [
  "papers:read",
  "papers:write",
  "collections:read",
  "ai:use",
  "analytics:read",
  "webhooks:manage",
];

const EXPIRY_OPTIONS = [
  { value: "never", label: "Never expires" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
];

const maskSecret = (secret: string): string =>
  secret.length > 14
    ? `${secret.slice(0, 10)}${"•".repeat(16)}${secret.slice(-4)}`
    : "•".repeat(secret.length);

const formatDate = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString() : "—";

const formatDateTime = (value: string | null): string =>
  value ? new Date(value).toLocaleString() : "Never";

interface CreateKeyPayload {
  name: string;
  description?: string;
  scopes: string[];
  rateLimit: number;
  expiresAt?: string;
}

export default function AdminApiKeysPage() {
  const { data, isLoading } = useListApiKeysQuery();
  const [createKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [revokeKey, { isLoading: isRevoking }] = useRevokeApiKeyMutation();
  const [deleteKey, { isLoading: isDeleting }] = useDeleteApiKeyMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<AdminApiKey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminApiKey | null>(null);
  const [search, setSearch] = useState("");

  // Session-only raw secrets for keys created in this page visit
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  const keys = data?.data ?? [];

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return keys;
    return keys.filter(
      (key) =>
        key.name.toLowerCase().includes(query) ||
        (key.description ?? "").toLowerCase().includes(query) ||
        key.keyPrefix.toLowerCase().includes(query)
    );
  }, [keys, search]);

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

  const handleCreate = async (payload: CreateKeyPayload) => {
    try {
      const result = await createKey(payload).unwrap();
      setRevealedKeys((prev) => ({
        ...prev,
        [result.data.id]: result.data._secret,
      }));
      setVisibleIds((prev) => new Set(prev).add(result.data.id));
      setShowCreate(false);
      showSuccessToast(
        "API key created",
        "Copy it from the list — it stays available until you leave this page"
      );
    } catch {
      showErrorToast("Failed", "Could not create key");
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await revokeKey(revokeTarget.id).unwrap();
      showSuccessToast("Key revoked", `${revokeTarget.name} can no longer be used`);
      setRevokeTarget(null);
    } catch {
      showErrorToast("Failed", "Could not revoke key");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteKey(deleteTarget.id).unwrap();
      showSuccessToast("Key deleted", `${deleteTarget.name} was removed`);
      setDeleteTarget(null);
    } catch {
      showErrorToast("Failed", "Could not delete key");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Key className="h-7 w-7 text-white" />}
        title="API Keys"
        description="Manage integration API keys"
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New key
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search API keys"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Raw keys are shown once at creation — copy them from the list
              before leaving this page.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {keys.length === 0
                  ? "No API keys yet."
                  : "No keys match your search."}
              </p>
              {keys.length === 0 && (
                <Button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first key
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <caption className="sr-only">Integration API keys</caption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="text-right">Rate limit</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeys.map((key) => {
                    const secret = revealedKeys[key.id];
                    const isVisible = visibleIds.has(key.id);
                    return (
                      <TableRow key={key.id}>
                        <TableCell>
                          <p className="font-medium">{key.name}</p>
                          {key.description && (
                            <p className="text-xs text-muted-foreground max-w-[220px] truncate">
                              {key.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {secret ? (
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs max-w-[230px] truncate">
                                {isVisible ? secret : maskSecret(secret)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => toggleVisible(key.id)}
                                aria-label={
                                  isVisible ? "Hide API key" : "Show API key"
                                }
                              >
                                {isVisible ? (
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
                                  copyToClipboard(secret, key.name)
                                }
                                aria-label={`Copy API key ${key.name}`}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-muted-foreground">
                              {key.keyPrefix}…
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLOR[key.status] ?? ""}>
                            {key.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {key.scopes.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              none
                            </span>
                          ) : (
                            <span
                              className="text-xs text-muted-foreground"
                              title={key.scopes.join(", ")}
                            >
                              {key.scopes.length} scope
                              {key.scopes.length === 1 ? "" : "s"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {key.totalRequests.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {key.rateLimit.toLocaleString()}/hr
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(key.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(key.lastUsedAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(key.expiresAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {key.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRevokeTarget(key)}
                              >
                                Revoke
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive h-8 w-8"
                              onClick={() => setDeleteTarget(key)}
                              aria-label={`Delete API key ${key.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateKeyDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        isLoading={isCreating}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Revoke API key"
        description={
          revokeTarget
            ? `"${revokeTarget.name}" will stop working immediately. Integrations using it must switch to a new key.`
            : ""
        }
        confirmLabel="Revoke key"
        destructive
        isLoading={isRevoking}
        onConfirm={handleRevoke}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete API key"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed from the list.`
            : ""
        }
        confirmLabel="Delete key"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function CreateKeyDialog({
  open,
  onClose,
  isLoading,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (payload: CreateKeyPayload) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState("1000");
  const [expiry, setExpiry] = useState("never");

  const reset = () => {
    setName("");
    setDescription("");
    setScopes([]);
    setRateLimit("1000");
    setExpiry("never");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleScope = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const handleSubmit = () => {
    const parsedRateLimit = Number(rateLimit);
    if (!name.trim() || Number.isNaN(parsedRateLimit) || parsedRateLimit < 1) {
      showErrorToast(
        "Missing fields",
        "Name and a valid rate limit are required"
      );
      return;
    }

    const days = expiry === "never" ? 0 : Number(expiry);
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      scopes,
      rateLimit: parsedRateLimit,
      expiresAt:
        days > 0
          ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New API key</DialogTitle>
          <DialogDescription>
            The raw key is shown once after creation — copy it from the list
            before leaving the page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">Name</Label>
            <Input
              id="api-key-name"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production Integration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key-description">Description</Label>
            <Input
              id="api-key-description"
              value={description}
              maxLength={300}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this key is used for (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Scopes</Label>
            <div className="flex flex-wrap gap-2">
              {SCOPE_OPTIONS.map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => toggleScope(scope)}
                  aria-pressed={scopes.includes(scope)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    scopes.includes(scope)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Scopes are informational today — integrations enforce their own
              permissions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-rate-limit">Rate limit (req/hour)</Label>
              <Input
                id="api-key-rate-limit"
                type="number"
                min={1}
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key-expiry">Expiry</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger id="api-key-expiry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
