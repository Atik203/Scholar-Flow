"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/redux/auth/useAuth";
import { CheckCircle, Crown, Users, Zap, CreditCard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useGetSubscriptionQuery } from "@/redux/api/billingApi";

const PLAN_DISPLAY = {
  RESEARCHER: {
    name: "Free",
    icon: Zap,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    description: "Perfect for getting started",
    features: ["Up to 10 papers/month", "Basic AI summaries", "Personal workspace"],
  },
  PRO_RESEARCHER: {
    name: "Pro",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "For active researchers",
    features: ["Unlimited papers", "Advanced AI insights", "Team collaboration (5 members)", "Priority support"],
  },
  TEAM_LEAD: {
    name: "Team",
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "For research teams",
    features: ["Everything in Pro", "Unlimited team members", "Team analytics", "SSO integration"],
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
  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionQuery({});

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

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userRole = user.role || "RESEARCHER";
  const planDisplay = PLAN_DISPLAY[userRole as keyof typeof PLAN_DISPLAY] || PLAN_DISPLAY.RESEARCHER;
  const Icon = planDisplay.icon;
  const hasActiveSubscription = subscription && subscription.status === "ACTIVE";

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
            <p className="text-muted-foreground mt-2">Manage your subscription and billing information</p>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-lg p-3 ${planDisplay.bgColor}`}>
                    <Icon className={`h-6 w-6 ${planDisplay.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{planDisplay.name} Plan</CardTitle>
                    <CardDescription>{planDisplay.description}</CardDescription>
                  </div>
                </div>
                {hasActiveSubscription && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Plan Features</h3>
                <ul className="space-y-2">
                  {planDisplay.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {hasActiveSubscription && subscription && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscription Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {subscription.providerSubscriptionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscription ID</span>
                        <span className="font-mono text-xs">{subscription.providerSubscriptionId}</span>
                      </div>
                    )}
                    {subscription.currentPeriodEnd && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Period Ends</span>
                        <span>{formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                {hasActiveSubscription ? (
                  <ManageSubscriptionButton variant="default" />
                ) : (
                  <Link href="/pricing"><Button variant="default">Upgrade Plan</Button></Link>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{userRole.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {userRole === "RESEARCHER" && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Unlock More Features</CardTitle>
                <CardDescription>Upgrade to Pro or Team to access advanced features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Get unlimited papers, advanced AI insights, and team collaboration</p>
                  </div>
                  <Link href="/pricing">
                    <Button size="lg" className="gap-2">
                      <Crown className="h-4 w-4" />
                      View Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
