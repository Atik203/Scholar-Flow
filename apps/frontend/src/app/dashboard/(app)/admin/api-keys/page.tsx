"use client";

/**
 * Admin API Keys Page
 */

import { useState } from "react";
import { Copy, Key, Plus, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useCreateApiKeyMutation, useDeleteApiKeyMutation, useListApiKeysQuery, useRevokeApiKeyMutation } from "@/redux/api/adminExtendedApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REVOKED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export default function AdminApiKeysPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading, refetch } = useListApiKeysQuery();
  const [create] = useCreateApiKeyMutation();
  const [revoke] = useRevokeApiKeyMutation();
  const [remove] = useDeleteApiKeyMutation();
  const keys = data?.data ?? [];

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

      {isLoading ? (
        <Skeleton className="h-32" />
      ) : keys.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No API keys yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <Card key={k.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                  <Key className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{k.name}</p>
                    <Badge className={STATUS_COLOR[k.status] ?? ""}>
                      {k.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {k.keyPrefix}…
                    {k.scopes.length > 0 && ` · ${k.scopes.length} scopes`}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{k.totalRequests.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">requests</p>
                </div>
                {k.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await revoke(k.id).unwrap();
                        showSuccessToast("Revoked", "API key revoked");
                        refetch();
                      } catch {
                        showErrorToast("Failed", "Could not revoke key");
                      }
                    }}
                  >
                    Revoke
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (confirm("Delete this key?")) {
                      await remove(k.id);
                      refetch();
                    }
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateKeyDialog
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            try {
              const result = await create(payload).unwrap();
              setShowCreate(false);
              alert(
                `Save this key now — you will not see it again:\n\n${result.data._secret}`
              );
              refetch();
            } catch {
              showErrorToast("Failed", "Could not create key");
            }
          }}
        />
      )}
    </div>
  );
}

function CreateKeyDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (p: { name: string; rateLimit: number }) => void;
}) {
  const [name, setName] = useState("");
  const [rateLimit, setRateLimit] = useState(1000);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">New API key</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production Integration"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Rate limit (req/hour)</label>
            <Input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!name}
            onClick={() => onCreate({ name, rateLimit })}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
