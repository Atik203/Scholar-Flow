"use client";

import {
  CheckCircle,
  CreditCard,
  Crown,
  ExternalLink,
  RefreshCw,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const, // Can be: "researcher" | "pro_researcher" | "team_lead" | "admin"
};

interface BillingPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Plan Configurations
// ============================================================================
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
      "Community support",
    ],
    price: "$0",
    period: "forever",
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
      "Export capabilities",
      "API access",
    ],
    price: "$19",
    period: "month",
  },
  TEAM_LEAD: {
    name: "Team",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "For research teams",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Team analytics",
      "SSO integration",
      "Custom branding",
      "Dedicated account manager",
    ],
    price: "$49",
    period: "month",
  },
  ADMIN: {
    name: "Admin",
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Administrative access",
    features: [
      "Full platform access",
      "User management",
      "System analytics",
      "All features included",
    ],
    price: "Custom",
    period: "",
  },
};

// ============================================================================
// Dummy Data
// ============================================================================
const dummySubscription = {
  status: "ACTIVE" as const,
  plan: {
    name: "Pro",
    code: "pro_researcher_monthly",
  },
  currentPeriodEnd: "2024-03-15T00:00:00Z",
  trialEnd: null,
  seats: 1,
  cancelAtPeriodEnd: false,
};

const dummyInvoices = [
  { id: "inv-1", date: "Feb 15, 2024", amount: "$19.00", status: "Paid" },
  { id: "inv-2", date: "Jan 15, 2024", amount: "$19.00", status: "Paid" },
  { id: "inv-3", date: "Dec 15, 2023", amount: "$19.00", status: "Paid" },
];

// ============================================================================
// Billing Page Component
// ============================================================================
export function BillingPage({ onNavigate }: BillingPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // For demo, simulate different user roles
  const userRole = defaultUser.role.toUpperCase() as keyof typeof PLAN_DISPLAY;
  const planDisplay = PLAN_DISPLAY[userRole] || PLAN_DISPLAY.RESEARCHER;
  const Icon = planDisplay.icon;

  const hasActiveSubscription = userRole !== "RESEARCHER";
  const showUpgradeCard = userRole === "RESEARCHER";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const STATUS_META = {
    ACTIVE: {
      label: "Active",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
    PAST_DUE: {
      label: "Past due",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    },
    CANCELED: {
      label: "Canceled",
      className:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
    },
    FREE: {
      label: "Free tier",
      className: "border-muted/40 bg-muted/80 text-muted-foreground",
    },
  };

  const statusMeta = hasActiveSubscription
    ? STATUS_META.ACTIVE
    : STATUS_META.FREE;

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/billing"
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your plan, monitor billing timelines, and keep your account
            details current.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={cn("rounded-2xl p-3 shadow-sm", planDisplay.bgColor)}
              >
                <Icon className={cn("h-7 w-7", planDisplay.color)} />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Current plan
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {planDisplay.name}
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  {planDisplay.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <span
                className={cn(
                  "px-3 py-1.5 rounded border text-xs font-medium shadow-sm backdrop-blur",
                  statusMeta.className
                )}
              >
                {statusMeta.label}
              </span>
              <div className="space-y-2 text-sm text-muted-foreground md:text-right">
                {hasActiveSubscription && (
                  <>
                    <div className="flex items-center gap-2 md:justify-end">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>Monthly billing</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>
                        Next renewal •{" "}
                        {formatDate(dummySubscription.currentPeriodEnd)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Plan Benefits */}
          <div className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-semibold">Plan benefits</h3>
              <p className="text-muted-foreground">
                Everything included with your current subscription
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Included features</h4>
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
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Subscription details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{statusMeta.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">
                        {planDisplay.price}
                        {planDisplay.period && `/${planDisplay.period}`}
                      </span>
                    </div>
                    {hasActiveSubscription && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Next renewal
                          </span>
                          <span className="font-medium">
                            {formatDate(dummySubscription.currentPeriodEnd)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Seats</span>
                          <span className="font-medium">
                            {dummySubscription.seats} seat
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Manage Subscription */}
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold mb-4">Manage Subscription</h4>
              <div className="space-y-3">
                {hasActiveSubscription ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Manage in Stripe
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Update Payment Method
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate?.("/pricing")}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Upgrade Plan
                  </motion.button>
                )}
              </div>
            </div>

            {/* Usage Summary */}
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold mb-4">Quick Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Papers uploaded</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI tokens used</span>
                  <span className="font-medium">15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage used</span>
                  <span className="font-medium">256 MB</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/analytics")}
                className="w-full mt-4 py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                View Full Analytics
              </motion.button>
            </div>

            {/* Account Overview */}
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold mb-4">Account Overview</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Linked to your ScholarFlow profile
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{defaultUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="font-mono text-xs">usr_abc123xyz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Role</span>
                  <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium uppercase tracking-wide">
                    {defaultUser.role.replace("_", " ")}
                  </span>
                </div>
                {hasActiveSubscription && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Stripe customer
                    </span>
                    <span className="font-mono text-xs">cus_Ox7...j9K</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Card for Free Users */}
        {showUpgradeCard && (
          <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 via-background to-purple-500/5 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upgrade to Pro</h3>
                  <p className="text-muted-foreground max-w-md">
                    Get unlimited papers, advanced AI insights, team
                    collaboration, and priority support.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-center">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.("/pricing")}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade Now
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Billing History */}
        {hasActiveSubscription && (
          <div className="rounded-xl border bg-card">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Billing History</h3>
                <p className="text-muted-foreground text-sm">
                  View your past invoices and payments
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </motion.button>
            </div>
            <div className="divide-y">
              {dummyInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                      {invoice.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Plans */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Available Plans</h3>
            <p className="text-muted-foreground text-sm">
              Compare plans and find the right one for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD"] as const).map(
              (planKey) => {
                const plan = PLAN_DISPLAY[planKey];
                const PlanIcon = plan.icon;
                const isCurrentPlan = planKey === userRole;
                return (
                  <motion.div
                    key={planKey}
                    whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                    className={cn(
                      "rounded-xl border p-6",
                      isCurrentPlan
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("p-2 rounded-lg", plan.bgColor)}>
                        <PlanIcon className={cn("h-5 w-5", plan.color)} />
                      </div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      {isCurrentPlan && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full ml-auto">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      {plan.price}
                      {plan.period && (
                        <span className="text-sm text-muted-foreground font-normal">
                          /{plan.period}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="mr-2 h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {!isCurrentPlan && planKey !== "RESEARCHER" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate?.("/pricing")}
                        className={cn(
                          "w-full py-2 rounded-lg text-sm font-medium",
                          planKey === "PRO_RESEARCHER"
                            ? "bg-primary text-primary-foreground"
                            : "border hover:bg-muted"
                        )}
                      >
                        {userRole === "RESEARCHER" ? "Upgrade" : "Switch Plan"}
                      </motion.button>
                    )}
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BillingPage;
