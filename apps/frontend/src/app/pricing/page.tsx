"use client";
import { CardWithVariants } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/redux/api/billingApi";
import { useAuth } from "@/redux/auth/useAuth";
import { motion } from "framer-motion";
import {
  Check,
  Crown,
  Loader2,
  MessageCircle,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Stripe Price IDs from environment variables
const PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
  PRO_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL!,
  TEAM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY!,
  TEAM_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL!,
} as const;

const plans = [
  {
    name: "Free",
    description: "Perfect for individual researchers getting started",
    price: { monthly: 0, annual: 0 },
    priceId: { monthly: null, annual: null },
    icon: Star,
    popular: false,
    features: [
      "Up to 10 papers per month",
      "Basic AI summaries",
      "Personal workspace",
      "Standard search",
      "Email support",
      "Mobile app access",
    ],
    limitations: ["Limited collaboration features", "Basic export options"],
  },
  {
    name: "Pro",
    description: "Ideal for active researchers and small teams",
    price: { monthly: 29, annual: 290 },
    priceId: {
      monthly: PRICE_IDS.PRO_MONTHLY,
      annual: PRICE_IDS.PRO_ANNUAL,
    },
    icon: Zap,
    popular: true,
    features: [
      "Unlimited papers",
      "Advanced AI insights",
      "Team collaboration (up to 5)",
      "Semantic search",
      "Priority support",
      "Advanced annotations",
      "Citation management",
      "API access",
      "Custom collections",
      "Export to all formats",
    ],
    limitations: [],
  },
  {
    name: "Team",
    description: "Built for research teams and departments",
    price: { monthly: 89, annual: 890 },
    priceId: {
      monthly: PRICE_IDS.TEAM_MONTHLY,
      annual: PRICE_IDS.TEAM_ANNUAL,
    },
    icon: Users,
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced collaboration",
      "Team analytics",
      "SSO integration",
      "Admin controls",
      "Custom workflows",
      "Dedicated support",
      "Training sessions",
      "SLA guarantee",
    ],
    limitations: [],
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: { monthly: "Custom", annual: "Custom" },
    priceId: { monthly: null, annual: null },
    icon: Crown,
    popular: false,
    features: [
      "Everything in Team",
      "Custom integrations",
      "On-premise deployment",
      "Advanced security",
      "Custom AI models",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom training",
      "Compliance certifications",
      "Usage analytics",
    ],
    limitations: [],
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    question: "What&apos;s included in the free trial?",
    answer:
      "All paid plans include a 14-day free trial with full access to features. No credit card required to start.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! We offer 50% off Pro plans for verified students and faculty members. Contact us with your .edu email for details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handleSubscribe = async (planName: string, priceId: string | null) => {
    // Handle Free plan
    if (planName === "Free") {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // Handle Enterprise plan
    if (planName === "Enterprise") {
      router.push("/contact");
      return;
    }

    // Require authentication for paid plans
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      router.push("/login");
      return;
    }

    // Check if priceId is valid
    if (!priceId) {
      toast.error("Invalid price configuration. Please contact support.");
      return;
    }

    // Check if user already has active subscription
    if (
      user?.stripeSubscriptionId &&
      user?.stripeCurrentPeriodEnd &&
      new Date(user.stripeCurrentPeriodEnd) > new Date()
    ) {
      toast.info(
        "You already have an active subscription. Visit your dashboard to manage it."
      );
      router.push("/dashboard/billing");
      return;
    }

    setLoadingPlan(planName);

    try {
      const rawResult = await createCheckoutSession({
        priceId,
      }).unwrap();

      const parsedResult = (() => {
        if (typeof rawResult === "string") {
          try {
            return JSON.parse(rawResult);
          } catch (parseError) {
            console.error("Failed to parse checkout response", parseError);
            return null;
          }
        }
        return rawResult;
      })();

      const checkoutUrl = parsedResult?.data?.url ?? parsedResult?.url ?? null;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      console.error("No checkout URL in response:", rawResult);
      toast.error("Failed to create checkout session - no URL returned");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to create checkout session"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-1/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              14-day free trial
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Choose the perfect plan for your research needs. Start free,
              upgrade when you&apos;re ready. All plans include our core
              AI-powered features.
            </p>

            {/* Billing Toggle */}
            <div className="mt-10 flex items-center justify-center">
              <div className="bg-muted/50 p-1 rounded-xl border border-border/50">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    billingPeriod === "monthly"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 relative ${
                    billingPeriod === "annual"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-chart-1 text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <CardWithVariants
                  variant={plan.popular ? "gradient" : "default"}
                  hover={plan.popular ? "scale" : "lift"}
                  padding="lg"
                  className={`relative ${
                    plan.popular
                      ? "border-primary/50 bg-gradient-to-b from-primary/5 to-chart-1/5 shadow-xl scale-105"
                      : "border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold">
                      {typeof plan.price[billingPeriod] === "number" ? (
                        <>
                          ${plan.price[billingPeriod]}
                          <span className="text-lg font-normal text-muted-foreground">
                            /{billingPeriod === "monthly" ? "mo" : "year"}
                          </span>
                        </>
                      ) : (
                        plan.price[billingPeriod]
                      )}
                    </div>
                    {billingPeriod === "annual" &&
                      typeof plan.price.monthly === "number" &&
                      typeof plan.price.annual === "number" &&
                      plan.price.monthly > 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          ${Math.round(plan.price.annual / 12)}/month billed
                          annually
                        </div>
                      )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 opacity-60"
                      >
                        <div className="h-5 w-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="h-1 w-3 bg-muted-foreground rounded" />
                        </div>
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() =>
                      handleSubscribe(plan.name, plan.priceId[billingPeriod])
                    }
                    disabled={loadingPlan === plan.name}
                    variant={
                      plan.name === "Enterprise"
                        ? "outline"
                        : plan.popular
                          ? "default"
                          : "outline"
                    }
                    className={`w-full py-3 px-4 font-semibold transition-all duration-300 ${
                      plan.name === "Enterprise"
                        ? "border border-border bg-background hover:bg-primary/5"
                        : plan.popular
                          ? "bg-gradient-to-r from-primary to-chart-1 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                          : "border border-border bg-background hover:bg-primary/5 hover:border-primary/30"
                    }`}
                  >
                    {loadingPlan === plan.name ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : plan.name === "Enterprise" ? (
                      "Contact Sales"
                    ) : plan.name === "Free" ? (
                      "Get Started"
                    ) : (
                      `Start ${plan.name} Trial`
                    )}
                  </Button>
                </CardWithVariants>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Compare Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly what&apos;s included in each plan
            </p>
          </motion.div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-8">
              <div className="grid gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-primary/10 to-chart-1/10 border border-primary/20">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">
                    Need Help Choosing?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Our team can help you find the perfect plan for your
                    research needs.
                  </p>
                  <Button
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Link href="/contact">Talk to Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common pricing questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6"
                >
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/5),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of researchers accelerating their work with
              ScholarFlow. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/login">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-4 border-border bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300"
              >
                <Link href="/contact">View Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
