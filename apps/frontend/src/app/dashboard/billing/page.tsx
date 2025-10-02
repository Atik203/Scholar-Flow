"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { redirectToCheckout } from "@/lib/stripe";
import {
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useGetSubscriptionQuery,
  useManagePlanMutation,
} from "@/redux/api/billingApi";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLAN_DISPLAY = {
  free: {
    name: "Free",
    icon: Zap,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    description: "Perfect for getting started",
    features: ["Up to 10 papers/month", "Basic AI summaries", "Personal workspace"],
  },
  pro: {
    name: "Pro",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "For active researchers",
    features: ["Unlimited papers", "Advanced AI insights", "Team collaboration (5 members)", "Priority support"],
  },
  team: {
    name: "Team",
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "For research teams",
    features: ["Everything in Pro", "Unlimited team members", "Team analytics", "SSO integration"],
  },
  enterprise: {
    name: "Enterprise",
    icon: Crown,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "For large organizations",
    features: ["Everything in Team", "Custom integrations", "Dedicated support", "SLA guarantee"],
  },
};

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<{
    tier: "pro" | "team" | "enterprise";
    interval: "monthly" | "annual";
  } | null>(null);

  // Query current subscription
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    refetch,
  } = useGetSubscriptionQuery({});

  // Mutations
  const [createCheckout, { isLoading: isCreatingCheckout }] =
    useCreateCheckoutSessionMutation();
  const [createPortal, { isLoading: isCreatingPortal }] =
    useCreatePortalSessionMutation();
  const [managePlan, { isLoading: isManagingPlan }] = useManagePlanMutation();

  const handleUpgrade = async (
    tier: "pro" | "team" | "enterprise",
    interval: "monthly" | "annual"
  ) => {
    try {
      setSelectedPlan({ tier, interval });
      const result = await createCheckout({
        planTier: tier,
        interval,
      }).unwrap();

      // Redirect to Stripe Checkout
      await redirectToCheckout(result.url);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create checkout session");
      setSelectedPlan(null);
    }
  };

  const handleManagePayment = async () => {
    try {
      const result = await createPortal({}).unwrap();
      window.location.href = result.url;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to open billing portal");
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel? You'll still have access until the end of your billing period."
      )
    ) {
      return;
    }

    try {
      await managePlan({ action: "cancel" }).unwrap();
      toast.success("Subscription will be canceled at period end");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel subscription");
    }
  };

  const handleReactivate = async () => {
    try {
      await managePlan({ action: "reactivate" }).unwrap();
      toast.success("Subscription reactivated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reactivate subscription");
    }
  };

  if (isLoadingSubscription) {
    return (
      <div className="container mx-auto py-10 max-w-6xl px-4">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan?.code || "free";
  const planDisplay =
    PLAN_DISPLAY[currentPlan as keyof typeof PLAN_DISPLAY] || PLAN_DISPLAY.free;
  const Icon = planDisplay.icon;

  return (
    <div className="container mx-auto py-10 max-w-6xl px-4">
      <div className="space-y-8">
        {/* Header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-chart-1/10 p-8 border border-primary/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)]" />
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your subscription, billing, and payment methods
            </p>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${planDisplay.bgColor}`}>
                    <Icon className={`h-8 w-8 ${planDisplay.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {planDisplay.name} Plan
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {planDisplay.description}
                    </CardDescription>
                  </div>
                </div>
                {subscription && (
                  <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Active</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription ? (
                <>
                  {/* Subscription Details Grid */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <p className="text-lg font-semibold capitalize flex items-center gap-2">
                        {subscription.status === "ACTIVE" && (
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                        {subscription.status.toLowerCase().replace("_", " ")}
                      </p>
                    </div>

                    {subscription.currentPeriodEnd && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {subscription.cancelAtPeriodEnd
                            ? "Cancels on"
                            : "Renews on"}
                        </p>
                        <p className="text-lg font-semibold">
                          {new Date(
                            subscription.currentPeriodEnd
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}

                    {subscription.trialEnd &&
                      new Date(subscription.trialEnd) > new Date() && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Trial Ends
                          </p>
                          <p className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            {new Date(subscription.trialEnd).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Team Seats
                      </p>
                      <p className="text-lg font-semibold">
                        {subscription.seats} {subscription.seats === 1 ? "seat" : "seats"}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Your Plan Includes
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {planDisplay.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Warning */}
                  {subscription.cancelAtPeriodEnd && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-yellow-500/10 border-2 border-yellow-500/20 rounded-xl p-4"
                    >
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                        ⚠️ Your subscription is scheduled to cancel. You'll still
                        have access until{" "}
                        {new Date(
                          subscription.currentPeriodEnd!
                        ).toLocaleDateString()}
                        .
                      </p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      onClick={handleManagePayment}
                      disabled={isCreatingPortal}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {isCreatingPortal ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Manage Payment Methods
                    </Button>

                    {subscription.cancelAtPeriodEnd ? (
                      <Button
                        onClick={handleReactivate}
                        disabled={isManagingPlan}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-chart-1"
                      >
                        {isManagingPlan && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Reactivate Subscription
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCancelSubscription}
                        disabled={isManagingPlan}
                        variant="destructive"
                        size="lg"
                      >
                        {isManagingPlan && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl p-6">
                    <p className="text-sm font-medium mb-3">
                      You're currently on the Free plan. Upgrade to unlock:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {PLAN_DISPLAY.pro.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Options */}
        {currentPlan === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                14-day free trial
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pro Plan */}
              <Card className="border-2 border-primary/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Pro Plan</CardTitle>
                      <CardDescription>For active researchers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">$29</p>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      or $290/year (save 17%)
                    </p>
                  </div>

                  <div className="space-y-2">
                    {PLAN_DISPLAY.pro.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={() => handleUpgrade("pro", "monthly")}
                      disabled={isCreatingCheckout}
                      className="w-full bg-gradient-to-r from-primary to-chart-1"
                      size="lg"
                    >
                      {selectedPlan?.tier === "pro" &&
                        selectedPlan.interval === "monthly" && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                      Start Monthly Trial
                    </Button>
                    <Button
                      onClick={() => handleUpgrade("pro", "annual")}
                      disabled={isCreatingCheckout}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      {selectedPlan?.tier === "pro" &&
                        selectedPlan.interval === "annual" && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                      Start Annual Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Team Plan */}
              <Card className="border-2 border-chart-1/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-chart-1/10">
                      <Users className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Team Plan</CardTitle>
                      <CardDescription>For research teams</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">$89</p>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      or $890/year (save 17%)
                    </p>
                  </div>

                  <div className="space-y-2">
                    {PLAN_DISPLAY.team.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={() => handleUpgrade("team", "monthly")}
                      disabled={isCreatingCheckout}
                      className="w-full bg-gradient-to-r from-chart-1 to-primary"
                      size="lg"
                    >
                      {selectedPlan?.tier === "team" &&
                        selectedPlan.interval === "monthly" && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                      Start Monthly Trial
                    </Button>
                    <Button
                      onClick={() => handleUpgrade("team", "annual")}
                      disabled={isCreatingCheckout}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      {selectedPlan?.tier === "team" &&
                        selectedPlan.interval === "annual" && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                      Start Annual Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              All payments are securely processed by Stripe. Your payment information
              is encrypted and never stored on our servers. Cancel anytime with no
              hidden fees.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
