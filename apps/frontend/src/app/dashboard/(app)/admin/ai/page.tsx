"use client";

/**
 * Admin AI Provider Management
 *
 * Phase C.5 — gives admins CRUD over the AIProvider catalog (Phase C.1)
 * and the ability to set the default model for the floating AI assistant.
 *
 * Features:
 *  - List all providers (DB-driven via Phase C.3) with a per-row
 *    enabled toggle, edit button, and 'Set Default' action.
 *  - Add a new model via the dialog.
 *  - Visual indicator for which providers have a configured API key
 *    (from the Key Statuses sub-section).
 *  - Reorder is supported via displayOrder (drag-and-drop is a
 *    future enhancement; admins can update displayOrder via edit for
 *    now to keep this slice minimal).
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  Check,
  CheckCircle2,
  Edit,
  Key,
  Loader2,
  Plus,
  Power,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  useCreateAIProviderMutation,
  useDeleteAIProviderMutation,
  useListAIProvidersQuery,
  useSetDefaultAIProviderMutation,
  useUpdateAIProviderMutation,
  type AIProviderRow,
  type CreateAIProviderRequest,
} from "@/redux/api/aiProviderApi";

const emptyForm: CreateAIProviderRequest = {
  provider: "openai",
  model: "",
  displayName: "",
  description: "",
  apiKeyEnvName: "",
  enabled: true,
  isDefault: false,
  displayOrder: 0,
};

export default function AdminAIPage() {
  const { data, isLoading, refetch } = useListAIProvidersQuery();
  const [createProvider, { isLoading: creating }] = useCreateAIProviderMutation();
  const [updateProvider, { isLoading: updating }] = useUpdateAIProviderMutation();
  const [setDefault, { isLoading: settingDefault }] = useSetDefaultAIProviderMutation();
  const [deleteProvider, { isLoading: deleting }] = useDeleteAIProviderMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<AIProviderRow | null>(null);
  const [form, setForm] = useState<CreateAIProviderRequest>(emptyForm);

  const providers = data?.providers ?? [];
  const keyStatuses = data?.keyStatuses ?? [];

  const startEdit = (row: AIProviderRow) => {
    setEditing(row);
    setForm({
      provider: row.provider,
      model: row.model,
      displayName: row.displayName,
      description: row.description ?? "",
      apiKeyEnvName: row.apiKeyEnvName ?? "",
      enabled: row.enabled,
      isDefault: row.isDefault,
      displayOrder: row.displayOrder,
    });
  };

  const closeDialog = () => {
    setShowCreate(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.provider || !form.model || !form.displayName) {
      showErrorToast("Provider, model, and display name are required");
      return;
    }
    try {
      if (editing) {
        await updateProvider({
          id: editing.id,
          displayName: form.displayName,
          description: form.description ?? null,
          apiKeyEnvName: form.apiKeyEnvName ?? null,
          enabled: form.enabled,
          displayOrder: form.displayOrder,
        }).unwrap();
        showSuccessToast("Model updated");
      } else {
        await createProvider(form).unwrap();
        showSuccessToast("Model added to catalog");
      }
      closeDialog();
      refetch();
    } catch (err: any) {
      showErrorToast(err?.data?.message ?? "Failed to save model");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id).unwrap();
      showSuccessToast("Default model updated");
      refetch();
    } catch (err: any) {
      showErrorToast(err?.data?.message ?? "Failed to set default");
    }
  };

  const handleToggle = async (row: AIProviderRow) => {
    try {
      await updateProvider({ id: row.id, enabled: !row.enabled }).unwrap();
      showSuccessToast(row.enabled ? "Model disabled" : "Model enabled");
      refetch();
    } catch (err: any) {
      showErrorToast(err?.data?.message ?? "Failed to update model");
    }
  };

  const handleDelete = async (row: AIProviderRow) => {
    if (!confirm(`Delete model "${row.displayName}"? This is a soft delete.`)) return;
    try {
      await deleteProvider(row.id).unwrap();
      showSuccessToast("Model removed");
      refetch();
    } catch (err: any) {
      showErrorToast(err?.data?.message ?? "Failed to delete model");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          AI Models
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage which AI models are available in the floating assistant, AI summaries,
          and key-point extraction. Disable a model to hide it from users without
          losing its configuration.
        </p>
      </div>

      {/* Key statuses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5" />
            API Key Status
          </CardTitle>
          <CardDescription>
            Whether each provider's API key is present on the backend. We never
            display the key itself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : (
            <ul className="divide-y rounded-md border">
              {keyStatuses.map((k) => (
                <li
                  key={k.envName}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <code className="font-mono text-xs">{k.envName}</code>
                  {k.configured ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
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

      {/* Catalog list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5" />
              Model Catalog ({providers.length})
            </CardTitle>
            <CardDescription>
              Add a model to expose it in the floating AI assistant. Set a
              default to pre-select it for new users.
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center">
              <Brain className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground">
                No models configured yet. The static fallback list will be used
                until an admin adds a row.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowCreate(true)}
              >
                Add the first model
              </Button>
            </div>
          ) : (
            <ul className="divide-y rounded-md border">
              {providers.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-3 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{row.displayName}</span>
                      {row.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                          <Star className="h-3 w-3" />
                          Default
                        </span>
                      )}
                      {!row.enabled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-900/40 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 border">
                          disabled
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      <code className="font-mono">{row.provider}/{row.model}</code>
                      {row.apiKeyEnvName && (
                        <span className="ml-2">
                          env: <code className="font-mono">{row.apiKeyEnvName}</code>
                        </span>
                      )}
                      <span className="ml-2">order: {row.displayOrder}</span>
                    </div>
                    {row.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {row.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!row.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetDefault(row.id)}
                        disabled={settingDefault || !row.enabled}
                        title="Set as default"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggle(row)}
                      disabled={updating}
                      title={row.enabled ? "Disable" : "Enable"}
                    >
                      <Power
                        className={`h-4 w-4 ${
                          row.enabled ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(row)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(row)}
                      disabled={deleting || row.isDefault}
                      title={
                        row.isDefault
                          ? "Cannot delete the default model"
                          : "Delete"
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      {(showCreate || editing) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeDialog}
        >
          <div
            className="bg-card rounded-lg border shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Model" : "Add Model"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Field label="Provider key">
                <Input
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  placeholder="openai | anthropic | google | deepseek | minimax"
                  disabled={!!editing}
                />
              </Field>
              <Field label="Model id">
                <Input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="gpt-4o-mini"
                  disabled={!!editing}
                />
              </Field>
              <Field label="Display name">
                <Input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="GPT-4o Mini (OpenAI - Fast)"
                />
              </Field>
              <Field label="API key env var (optional)">
                <Input
                  value={form.apiKeyEnvName ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, apiKeyEnvName: e.target.value })
                  }
                  placeholder="OPENAI_API_KEY"
                />
              </Field>
              <Field label="Description (optional)">
                <Input
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Quick responses, good for basic questions"
                />
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  value={form.displayOrder ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: Number(e.target.value) })
                  }
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault ?? false}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                Set as default
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={creating || updating}
              >
                {(creating || updating) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editing ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}
