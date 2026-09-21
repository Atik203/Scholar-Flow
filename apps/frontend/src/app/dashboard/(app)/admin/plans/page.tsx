"use client";

/**
 * Admin Plans Page
 */

import { useState } from "react";
import {
  AlertTriangle,
  Copy,
  Crown,
  DollarSign,
  Link2,
  Pencil,
  Plus,
  Power,
  Star,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PageHeader } from "@/components/customUI/PageHeader";
import {
  useCreatePlanMutation,
  useDeletePlanMutation,
  useListPlansQuery,
  useSyncStripePlanMutation,
  useTogglePlanMutation,
  useUpdatePlanMutation,
  type AdminPlan,
} from "@/redux/api/adminExtendedApi";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatInterval = (interval: string) =>
  interval === "year" ? "year" : interval === "month" ? "month" : interval;

const getPlanVisual = (code: string) => {
  const tier = code.split("_")[0];
  switch (tier) {
    case "pro":
      return {
        accent: "bg-indigo-500",
        Icon: Zap,
        iconClass: "text-indigo-500",
      };
    case "team":
      return {
        accent: "bg-gradient-to-r from-emerald-500 to-teal-500",
        Icon: Users,
        iconClass: "text-emerald-500",
      };
    case "enterprise":
      return {
        accent: "bg-gradient-to-r from-purple-500 to-pink-500",
        Icon: Crown,
        iconClass: "text-purple-500",
      };
    case "free":
    default:
      return { accent: "bg-slate-300", Icon: Star, iconClass: "" };
  }
};

interface PlanFormState {
  id?: string;
  code: string;
  name: string;
  priceDollars: string;
  currency: string;
  interval: "month" | "year";
  active: boolean;
  featuresText: string;
  stripeLinked: boolean;
}

const EMPTY_FORM: PlanFormState = {
  code: "",
  name: "",
  priceDollars: "",
  currency: "USD",
  interval: "month",
  active: true,
  featuresText: "",
  stripeLinked: false,
};

export default function AdminPlansPage() {
  const { data, isLoading } = useListPlansQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [togglePlan] = useTogglePlanMutation();
  const [syncStripe] = useSyncStripePlanMutation();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<AdminPlan | null>(null);

  const plans = data?.data ?? [];

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (p: AdminPlan) => {
    setForm({
      id: p.id,
      code: p.code,
      name: p.name,
      priceDollars: (p.priceCents / 100).toFixed(2),
      currency: p.currency,
      interval: p.interval === "year" ? "year" : "month",
      active: p.active,
      featuresText: (p.features?.list ?? []).join("\n"),
      stripeLinked: Boolean(p.stripePriceId),
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim() || form.priceDollars === "") {
      showErrorToast("Missing fields", "Code, name, and price are required");
      return;
    }

    const priceCents = Math.round(parseFloat(form.priceDollars) * 100);
    if (Number.isNaN(priceCents) || priceCents < 0) {
      showErrorToast("Invalid price");
      return;
    }

    const features = {
      list: form.featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (form.id) {
        await updatePlan({
          id: form.id,
          patch: {
            ...(form.stripeLinked ? {} : { code: form.code.trim() }),
            name: form.name.trim(),
            priceCents,
            currency: form.currency,
            interval: form.interval,
            active: form.active,
            features,
          },
        }).unwrap();
        showSuccessToast("Plan updated");
      } else {
        await createPlan({
          code: form.code.trim(),
          name: form.name.trim(),
          priceCents,
          currency: form.currency,
          interval: form.interval,
          active: form.active,
          features,
        }).unwrap();
        showSuccessToast("Plan created");
      }
      setFormOpen(false);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      showErrorToast(
        "Failed",
        typeof message === "string" ? message : "Could not save plan"
      );
    }
  };

  const handleSyncStripe = async (p: AdminPlan) => {
    setBusyId(p.id);
    try {
      const result = await syncStripe(p.id).unwrap();
      showSuccessToast(
        result.data.created ? "Linked to Stripe" : "Already linked",
        result.data.created
          ? "Stripe product and price created for this plan"
          : "Existing Stripe price is valid"
      );
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      showErrorToast(
        "Link failed",
        typeof message === "string"
          ? message
          : "Could not link plan to Stripe"
      );
    } finally {
      setBusyId(null);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied", `${label} copied to clipboard`);
    } catch {
      showErrorToast("Copy failed", "Could not copy to clipboard");
    }
  };

  const handleToggle = async (p: AdminPlan) => {
    setBusyId(p.id);
    try {
      await togglePlan(p.id).unwrap();
      showSuccessToast(p.active ? "Plan deactivated" : "Plan activated");
    } catch {
      showErrorToast("Failed", "Could not toggle plan");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deletePlan(deleteTarget.id).unwrap();
      showSuccessToast("Plan deleted", `${deleteTarget.name} was removed`);
      setDeleteTarget(null);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      showErrorToast(
        "Delete failed",
        typeof message === "string" ? message : "Could not delete plan"
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Crown className="h-7 w-7 text-white" />}
        title="Plans"
        description="Subscription plan management"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New plan
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No plans configured yet. Create your first plan.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => {
            const visual = getPlanVisual(p.code);
            const priceId = p.stripePriceId;
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className={`h-2 ${visual.accent}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <visual.Icon className={`h-5 w-5 ${visual.iconClass}`} />
                        {p.name}
                      </CardTitle>
                      <CardDescription>
                        <span className="inline-flex items-center gap-1 mt-1">
                          <Badge variant="outline">{p.code}</Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={() =>
                              copyToClipboard(p.code, "Plan code")
                            }
                            aria-label={`Copy plan code ${p.code}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </span>
                        {priceId && (
                          <span className="ml-2 inline-flex items-center gap-1 font-mono text-xs">
                            {priceId.slice(0, 12)}…
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5"
                              onClick={() =>
                                copyToClipboard(priceId, "Stripe price ID")
                              }
                              aria-label={`Copy Stripe price ID for ${p.name}`}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {!p.active && <Badge variant="secondary">Inactive</Badge>}
                      {!p.stripePriceId && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-amber-500/50 text-amber-600 dark:text-amber-400"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          No Stripe price
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">
                      {formatPrice(p.priceCents)}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{formatInterval(p.interval)}
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        Paying
                      </div>
                      <p className="text-xl font-bold">{p.activeSubscribers}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        MRR
                      </div>
                      <p className="text-xl font-bold">
                        {formatPrice(p.monthlyRevenueCents)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {!p.stripePriceId && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-amber-500/50 text-amber-700 dark:text-amber-400"
                        disabled={busyId === p.id}
                        onClick={() => handleSyncStripe(p)}
                      >
                        <Link2 className="h-3 w-3" />
                        Link to Stripe
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={busyId === p.id}
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={busyId === p.id}
                      onClick={() => handleToggle(p)}
                    >
                      <Power className="h-3 w-3" />
                      {p.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-destructive"
                      disabled={busyId === p.id}
                      onClick={() => setDeleteTarget(p)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit plan" : "New plan"}</DialogTitle>
            <DialogDescription>
              Priced plans are provisioned in Stripe automatically (product +
              price). Changing the price creates a new Stripe price and archives
              the old one; name changes sync to the Stripe product. Codes are
              locked once a plan is linked to Stripe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-code">Code</Label>
                <Input
                  id="plan-code"
                  placeholder="pro_monthly"
                  value={form.code}
                  disabled={form.stripeLinked}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
                {form.stripeLinked && (
                  <p className="text-xs text-muted-foreground">
                    Locked — the code is the tier key used by checkout and
                    webhooks.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-name">Name</Label>
                <Input
                  id="plan-name"
                  placeholder="Pro"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price ($)</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="29.00"
                  value={form.priceDollars}
                  onChange={(e) =>
                    setForm({ ...form, priceDollars: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-currency">Currency</Label>
                <Input
                  id="plan-currency"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <Select
                  value={form.interval}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      interval: value as "month" | "year",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4"
              />
              Active (available for checkout)
            </label>
            <div className="space-y-2">
              <Label htmlFor="plan-features">Features (one per line)</Label>
              <textarea
                id="plan-features"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={"Unlimited papers\nAdvanced AI insights\nPriority support"}
                value={form.featuresText}
                onChange={(e) =>
                  setForm({ ...form, featuresText: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Shown on the public pricing cards for Pro and Team plans.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {form.id ? "Save changes" : "Create plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete confirm dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete plan</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `"${deleteTarget.name}" (${deleteTarget.code}) will be removed from the plan catalog. Plans with active subscribers cannot be deleted — deactivate them instead.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={busyId === deleteTarget?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={busyId === deleteTarget?.id}
            >
              {busyId === deleteTarget?.id ? "Deleting..." : "Delete plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
