"use client";

/**
 * Admin Subscribers Page
 *
 * Subscription management: list all subscribers with status/plan filters,
 * cancel at period end, reactivate, cancel now, and change plan.
 * All mutations go through Stripe on the backend + audit-logged.
 */

import { useState } from "react";
import {
  Crown,
  Pause,
  Play,
  RefreshCw,
  Search,
  Users,
  XCircle,
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
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  useCancelSubscriberAtPeriodEndMutation,
  useCancelSubscriberNowMutation,
  useChangeSubscriberPlanMutation,
  useListPlansQuery,
  useListSubscribersQuery,
  useReactivateSubscriberMutation,
} from "@/redux/api/adminExtendedApi";
import { formatCurrency } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  PAST_DUE: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  CANCELED: "border-rose-500/40 text-rose-600 dark:text-rose-400",
  EXPIRED: "text-muted-foreground",
};

export default function AdminSubscribersPage() {
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [changePlanTarget, setChangePlanTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newPriceId, setNewPriceId] = useState<string>("");

  const { data, isLoading, refetch } = useListSubscribersQuery({
    page,
    limit: 25,
    status: status === "all" ? undefined : status,
  });

  const { data: plansData } = useListPlansQuery();

  const [cancelAtEnd] = useCancelSubscriberAtPeriodEndMutation();
  const [reactivate] = useReactivateSubscriberMutation();
  const [cancelNow] = useCancelSubscriberNowMutation();
  const [changePlan] = useChangeSubscriberPlanMutation();

  const subscribers = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPage ?? 1;

  const changeablePlans = (plansData?.data ?? []).filter(
    (p) => p.active && p.stripePriceId
  );

  const runAction = async (
    id: string,
    fn: () => Promise<unknown>,
    successMessage: string
  ) => {
    setActionId(id);
    try {
      await fn();
      showSuccessToast(successMessage);
    } catch {
      showErrorToast("Failed", "Could not complete the Stripe operation");
    } finally {
      setActionId(null);
    }
  };

  const handleChangePlan = async () => {
    if (!changePlanTarget || !newPriceId) return;
    await runAction(
      changePlanTarget.id,
      () => changePlan({ id: changePlanTarget.id, priceId: newPriceId }).unwrap(),
      "Plan changed"
    );
    setChangePlanTarget(null);
    setNewPriceId("");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Users className="h-7 w-7 text-white" />}
        title="Subscribers"
        description="Manage subscriptions across all users"
        actions={
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>All subscriptions</CardTitle>
              <CardDescription>
                {total} subscriber(s) — actions go through Stripe and are
                audit-logged
              </CardDescription>
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAST_DUE">Past due</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Search className="mx-auto mb-3 h-10 w-10 opacity-40" />
              No subscribers found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Period end</TableHead>
                    <TableHead>Total spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((s) => {
                    const busy = actionId === s.subscriptionId;
                    return (
                      <TableRow key={s.subscriptionId}>
                        <TableCell>
                          <div className="font-medium">{s.userName || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.userEmail}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{s.planName || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              STATUS_BADGE[s.status] ?? "text-muted-foreground"
                            }
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{s.seats}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {s.currentPeriodEnd
                            ? new Date(s.currentPeriodEnd).toLocaleDateString()
                            : "—"}
                          {s.cancelAtPeriodEnd && (
                            <div className="text-rose-500">Cancel scheduled</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(s.totalSpent, "USD")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {s.status === "ACTIVE" && !s.cancelAtPeriodEnd && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                title="Cancel at period end"
                                onClick={() =>
                                  runAction(
                                    s.subscriptionId,
                                    () =>
                                      cancelAtEnd(s.subscriptionId).unwrap(),
                                    "Cancel scheduled at period end"
                                  )
                                }
                              >
                                <Pause className="h-3 w-3" />
                              </Button>
                            )}
                            {s.status === "ACTIVE" && s.cancelAtPeriodEnd && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                title="Reactivate"
                                onClick={() =>
                                  runAction(
                                    s.subscriptionId,
                                    () => reactivate(s.subscriptionId).unwrap(),
                                    "Subscription reactivated"
                                  )
                                }
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            {s.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                title="Change plan"
                                onClick={() => {
                                  setChangePlanTarget({
                                    id: s.subscriptionId,
                                    name: s.userEmail,
                                  });
                                  setNewPriceId("");
                                }}
                              >
                                <Crown className="h-3 w-3" />
                              </Button>
                            )}
                            {s.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={busy}
                                title="Cancel immediately"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Cancel ${s.userEmail}'s subscription immediately?`
                                    )
                                  ) {
                                    runAction(
                                      s.subscriptionId,
                                      () => cancelNow(s.subscriptionId).unwrap(),
                                      "Subscription canceled"
                                    );
                                  }
                                }}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}
                            {busy && (
                              <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                            )}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Change plan dialog */}
      <Dialog
        open={!!changePlanTarget}
        onOpenChange={(open) => {
          if (!open) setChangePlanTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
            <DialogDescription>
              {changePlanTarget
                ? `Move ${changePlanTarget.name}'s subscription to another plan. Role updates automatically via the webhook.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <Select value={newPriceId} onValueChange={setNewPriceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select target plan" />
            </SelectTrigger>
            <SelectContent>
              {changeablePlans.map((p) => (
                <SelectItem key={p.id} value={p.stripePriceId ?? ""}>
                  {p.name} — {formatCurrency(p.priceCents / 100, "USD")}/
                  {p.interval}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {changeablePlans.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No active plans with Stripe price IDs available.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangePlanTarget(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePlan}
              disabled={!newPriceId || actionId !== null}
            >
              {actionId ? "Switching..." : "Switch plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
