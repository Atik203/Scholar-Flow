"use client";

import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionSync } from "@/hooks/useSubscriptionSync";
import { apiSlice } from "@/redux/api/apiSlice";
import { useGetSubscriptionQuery } from "@/redux/api/billingApi";
import { useAuth } from "@/redux/auth/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  RefreshCw,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const PLAN_DISPLAY = {
  RESEARCHER: {
    name: "Free",
    icon: Zap,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    description: "Perfect for getting started",
    features: [
      "Up to 10 papers/month",
      "Basic AI summaries",
      "Personal workspace",
    ],
  },
  PRO_RESEARCHER: {
    name: "Pro",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "For active researchers",
    features: [
      "Unlimited papers",
      "Advanced AI insights",
      "Team collaboration (5 members)",
      "Priority support",
    ],
  },
  TEAM_LEAD: {
    name: "Team",
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "For research teams",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Team analytics",
      "SSO integration",
    ],
  },
  ADMIN: {
    name: "Admin",
    icon: Crown,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "Administrative access",
    features: ["Full platform access", "User management", "System analytics"],
  },
};

export default function BillingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    refetch,
  } = useGetSubscriptionQuery({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get("session_id");
  const dispatch = useAppDispatch();

  // Track if user came back from Stripe portal/checkout
  const [shouldSync, setShouldSync] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // Smart subscription sync hook
  const { isPolling, attemptCount, maxAttempts } = useSubscriptionSync({
    enabled: shouldSync,
    maxAttempts: 10,
    pollingInterval: 2000,
    onSyncComplete: useCallback(() => {
      console.log("[BillingPage] Subscription sync completed successfully");
      setShouldSync(false);

      // Show success toast only once
      if (!hasShownSuccessToast) {
        toast.success("Subscription updated successfully!");
        setHasShownSuccessToast(true);
      }

      // Clean up URL (remove session_id)
      if (sessionId) {
        router.replace("/dashboard/billing");
      }
    }, [sessionId, router, hasShownSuccessToast]),
    onSyncTimeout: useCallback(() => {
      console.warn("[BillingPage] Subscription sync timed out");
      setShouldSync(false);
      toast.info(
        "Subscription data may take a moment to update. Please refresh if needed."
      );

      // Clean up URL
      if (sessionId) {
        router.replace("/dashboard/billing");
      }
    }, [sessionId, router]),
  });

  // Initial data fetch on mount
  useEffect(() => {
    // Always ensure we have fresh subscription data on mount
    refetch();
  }, [refetch]);

  // Handle return from Stripe checkout/portal
  useEffect(() => {
    if (!sessionId || !isAuthenticated) {
      return;
    }

    // User returned from Stripe - start sync polling
    console.log(
      "[BillingPage] Detected return from Stripe, starting subscription sync"
    );

    // Invalidate cache first
    dispatch(apiSlice.util.invalidateTags(["User"]));

    // Enable polling
    setShouldSync(true);
  }, [dispatch, isAuthenticated, sessionId]);

  if (!isLoading && !isAuthenticated) {
    redirect("/signin");
  }

  if (isLoading || !user || isLoadingSubscription) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userRole = user.role || "RESEARCHER";
  const planDisplay =
    PLAN_DISPLAY[userRole as keyof typeof PLAN_DISPLAY] ||
    PLAN_DISPLAY.RESEARCHER;
  const Icon = planDisplay.icon;
  const hasActiveSubscription =
    subscription && subscription.status === "ACTIVE";

  const planName = subscription?.plan?.name ?? planDisplay.name;
  const planCode = subscription?.plan?.code ?? `${userRole.toLowerCase()}`;
  const billingIntervalLabel = hasActiveSubscription
    ? planCode.includes("annual")
      ? "Annual billing"
      : "Monthly billing"
    : "No active subscription";
  const nextPeriodEnd =
    subscription?.currentPeriodEnd ?? user?.stripeCurrentPeriodEnd ?? null;
  const nextRenewalLabel = nextPeriodEnd
    ? formatDate(nextPeriodEnd)
    : "No upcoming renewal";
  const trialEndsAt = subscription?.trialEnd ?? null;
  const trialEndsLabel = trialEndsAt
    ? formatDate(trialEndsAt)
    : "No active trial";
  const seatsLabel =
    subscription?.seats && subscription.seats > 1
      ? `${subscription.seats} seats`
      : `${subscription?.seats ?? 1} seat`;

  const STATUS_META = {
    ACTIVE: {
      label: "Active",
      className:
        "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
    PAST_DUE: {
      label: "Past due",
      className:
        "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    },
    CANCELED: {
      label: "Canceled",
      className:
        "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
    },
    EXPIRED: {
      label: "Expired",
      className:
        "border border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
    },
    FREE: {
      label: "Free tier",
      className: "border border-muted/40 bg-muted/80 text-muted-foreground",
    },
  } as const;

  const statusKey =
    (subscription?.status as keyof typeof STATUS_META | undefined) ?? "FREE";
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.FREE;
  const showUpgradeCard = userRole === "RESEARCHER" && !hasActiveSubscription;

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Billing & Subscription
                </h1>
                <p className="text-muted-foreground">
                  Manage your plan, monitor billing timelines, and keep your
                  account details current.
                </p>
              </div>

              {/* Syncing indicator */}
              {isPolling && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">Syncing...</p>
                    <p className="text-xs text-muted-foreground">
                      {attemptCount}/{maxAttempts}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-chart-1/10 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-2xl p-3 shadow-sm ${planDisplay.bgColor}`}
                  >
                    <Icon className={`h-7 w-7 ${planDisplay.color}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Current plan
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight">
                      {planName}
                    </h2>
                    <p className="text-muted-foreground max-w-xl">
                      {planDisplay.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4 md:items-end">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur ${statusMeta.className}`}
                  >
                    {statusMeta.label}
                  </Badge>
                  <div className="space-y-2 text-sm text-muted-foreground md:text-right">
                    <div className="flex items-center gap-2 md:justify-end">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>{billingIntervalLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>
                        {nextPeriodEnd
                          ? `Next renewal • ${nextRenewalLabel}`
                          : "No upcoming renewal scheduled"}
                      </span>
                    </div>
                    {hasActiveSubscription && trialEndsAt && (
                      <div className="flex items-center gap-2 md:justify-end">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Trial ends • {trialEndsLabel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl">Plan benefits</CardTitle>
                  <CardDescription>
                    Everything included with your current subscription
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-3">Included features</h3>
                    <ul className="space-y-2">
                      {planDisplay.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Subscription details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">{statusMeta.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Billing interval
                        </span>
                        <span className="font-medium">
                          {hasActiveSubscription ? billingIntervalLabel : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Next renewal
                        </span>
                        <span className="font-medium">{nextRenewalLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats</span>
                        <span className="font-medium">{seatsLabel}</span>
                      </div>
                      {hasActiveSubscription && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Cancel at period end
                            </span>
                            <span className="font-medium">
                              {subscription?.cancelAtPeriodEnd
                                ? "Scheduled"
                                : "Not scheduled"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Trial period
                            </span>
                            <span className="font-medium">
                              {trialEndsLabel}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subscription ID
                        </span>
                        <span className="font-mono text-xs">
                          {subscription?.providerSubscriptionId ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  {hasActiveSubscription ? (
                    <>
                      <ManageSubscriptionButton variant="default" />
                      <Link href="/pricing">
                        <Button variant="outline">Explore plans</Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/pricing">
                      <Button size="lg" className="gap-2">
                        <Crown className="h-4 w-4" />
                        Upgrade plan
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account overview</CardTitle>
                <CardDescription>
                  Linked to your ScholarFlow profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account ID</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <Badge
                      variant="secondary"
                      className="uppercase tracking-wide"
                    >
                      {userRole.replace("_", " ")}
                    </Badge>
                  </div>
                  {user.stripeCustomerId && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Stripe customer
                      </span>
                      <span className="font-mono text-xs">
                        {user.stripeCustomerId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {showUpgradeCard && (
            <Card className="border-primary/40 bg-primary/5">
              <CardHeader>
                <CardTitle>Unlock more from ScholarFlow</CardTitle>
                <CardDescription>
                  Upgrade to Pro or Team to lift usage limits and collaborate
                  with your lab.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground max-w-xl">
                  Get unlimited paper uploads, advanced AI insights, team
                  workspaces, and priority support.
                </p>
                <Link href="/pricing">
                  <Button size="lg" className="gap-2">
                    <Zap className="h-4 w-4" />
                    View plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
