"use client";

/**
 * Admin Payments Page
 */

import { useState } from "react";
import { CreditCard, DollarSign, RefreshCw, RotateCcw, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/customUI/PageHeader";
import { useListPaymentsQuery, useRefundPaymentMutation } from "@/redux/api/adminExtendedApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const STATUS_COLOR: Record<string, string> = {
  SUCCEEDED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const formatAmount = (cents: number, currency: string) =>
  `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}${currency !== "USD" ? ` ${currency}` : ""}`;

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useListPaymentsQuery({
    page,
    limit: 25,
    search: search || undefined,
  });
  const [refund] = useRefundPaymentMutation();
  const payments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPage ?? 1;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={<Wallet className="h-7 w-7 text-white" />}
        title="Payments"
        description="Payment history and refund management"
        actions={
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {formatAmount(
              payments
                .filter((p) => p.status === "SUCCEEDED")
                .reduce((s, p) => s + p.amountCents, 0),
              "USD"
            )}
          </p>
          <p className="text-sm text-muted-foreground">Page total</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total payments</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or transaction id..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <p className="p-12 text-center text-muted-foreground">
              No payments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{p.user.name ?? p.user.email}</div>
                        <div className="text-xs text-muted-foreground">{p.user.email}</div>
                      </td>
                      <td className="py-3 font-medium">
                        {formatAmount(p.amountCents, p.currency)}
                      </td>
                      <td className="py-3">
                        <Badge
                          className={
                            STATUS_COLOR[p.status] ?? "bg-slate-100 text-slate-700"
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        {p.status === "SUCCEEDED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={async () => {
                              if (confirm("Refund this payment?")) {
                                try {
                                  await refund(p.id).unwrap();
                                  showSuccessToast("Refunded", "Payment refunded");
                                  refetch();
                                } catch {
                                  showErrorToast("Failed", "Could not refund");
                                }
                              }
                            }}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}
