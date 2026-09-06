"use client";

/**
 * Admin Plans Page
 */

import { useState } from "react";
import {
  Crown,
  DollarSign,
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
  useTogglePlanMutation,
  useUpdatePlanMutation,
  type AdminPlan,
} from "@/redux/api/adminExtendedApi";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatInterval = (interval: string) =>
  interval === "year" ? "year" : interval === "month" ? "month" : interval;

interface PlanFormState {
  id?: string;
  code: string;
  name: string;
  priceDollars: string;
  currency: string;
  interval: "month" | "year";
  active: boolean;
}

const EMPTY_FORM: PlanFormState = {
  code: "",
  name: "",
  priceDollars: "",
  currency: "USD",
  interval: "month",
  active: true,
};

export default function AdminPlansPage() {
  const { data, isLoading } = useListPlansQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [togglePlan] = useTogglePlanMutation();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);

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

    try {
      if (form.id) {
        await updatePlan({
          id: form.id,
          patch: {
            code: form.code.trim(),
            name: form.name.trim(),
            priceCents,
            currency: form.currency,
            interval: form.interval,
            active: form.active,
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
        }).unwrap();
        showSuccessToast("Plan created");
      }
      setFormOpen(false);
    } catch {
      showErrorToast("Failed", "Could not save plan");
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

  const handleDelete = async (p: AdminPlan) => {
    if (
      !confirm(
        `Delete plan "${p.name}"? Plans with active subscribers cannot be deleted.`
      )
    ) {
      return;
    }
    setBusyId(p.id);
    try {
      await deletePlan(p.id).unwrap();
      showSuccessToast("Plan deleted");
    } catch {
      showErrorToast("Failed", "Could not delete plan");
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
          {plans.map((p, i) => (
            <Card key={p.id} className="overflow-hidden">
              <div
                className={`h-2 ${
                  i === 0
                    ? "bg-slate-300"
                    : i === 1
                      ? "bg-indigo-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {i === 0 ? (
                        <Star className="h-5 w-5" />
                      ) : i === 1 ? (
                        <Zap className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <Crown className="h-5 w-5 text-purple-500" />
                      )}
                      {p.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {p.code}
                      </Badge>
                      {p.stripePriceId && (
                        <span className="ml-2 font-mono text-xs">
                          {p.stripePriceId.slice(0, 12)}…
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {!p.active && <Badge variant="secondary">Inactive</Badge>}
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
                <div className="flex items-center gap-2 pt-1">
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
                    onClick={() => handleDelete(p)}
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

      {/* Create/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit plan" : "New plan"}</DialogTitle>
            <DialogDescription>
              Changing the price creates a new Stripe price — existing
              subscribers renew at their current price until the next cycle.
              Name changes sync to the Stripe product.
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
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
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
    </div>
  );
}
