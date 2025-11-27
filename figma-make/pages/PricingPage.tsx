"use client";

import {
  ArrowRight,
  Check,
  Crown,
  HelpCircle,
  MessageCircle,
  Rocket,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";
import { CardWithVariants } from "../components/ui/card";

interface PricingPageProps {
  onNavigate?: (path: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      description: "Perfect for individual researchers getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Star,
      features: [
        "Up to 10 papers per month",
        "Basic AI summaries",
        "Personal workspace",
        "Standard search",
        "Email support",
        "Mobile app access",
      ],
      limitations: ["Limited collaboration features", "Basic export options"],
      color: "primary",
      popular: false,
      cta: "Get Started",
    },
    {
      name: "Pro",
      description: "Ideal for active researchers and small teams",
      monthlyPrice: 29,
      annualPrice: 24,
      icon: Zap,
      features: [
        "Unlimited papers",
        "Advanced AI insights",
        "Team collaboration (up to 5)",
        "Semantic search",
        "Priority support",
        "Advanced annotations",
        "Citation management",
        "API access",
      ],
      limitations: [],
      color: "chart-1",
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Team",
      description: "Built for research teams and departments",
      monthlyPrice: 89,
      annualPrice: 74,
      icon: Users,
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced collaboration",
        "Team analytics",
        "SSO integration",
        "Admin controls",
        "Custom workflows",
        "Dedicated support",
      ],
      limitations: [],
      color: "chart-2",
      popular: false,
      cta: "Start Team Trial",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      monthlyPrice: null,
      annualPrice: null,
      icon: Crown,
      features: [
        "Everything in Team",
        "Custom integrations",
        "On-premise deployment",
        "Advanced security",
        "Custom AI models",
        "Dedicated account manager",
        "24/7 phone support",
        "Compliance certifications",
      ],
      limitations: [],
      color: "chart-3",
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const faqs = [
    {
      question: "Can I try ScholarFlow before committing?",
      answer:
        "Yes! We offer a 14-day free trial on all paid plans. No credit card required to start.",
    },
    {
      question: "What happens when I exceed my paper limit?",
      answer:
        "On the Free plan, you'll be prompted to upgrade when you reach 50 papers. Your existing papers remain accessible.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
    },
    {
      question: "Is there a student discount?",
      answer:
        "Yes! Students with a valid .edu email get 50% off Pro and Team plans. Contact us to apply.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-20">
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
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                      !isAnnual
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 relative ${
                      isAnnual
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
                    className={`relative h-full ${
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
                        {plan.monthlyPrice !== null ? (
                          <>
                            ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                            <span className="text-lg font-normal text-muted-foreground">
                              /{isAnnual ? "year" : "mo"}
                            </span>
                          </>
                        ) : (
                          "Custom"
                        )}
                      </div>
                      {isAnnual &&
                        plan.monthlyPrice !== null &&
                        plan.monthlyPrice > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            ${Math.round((plan.annualPrice ?? 0) / 12)}/month
                            billed annually
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
                      onClick={() => onNavigate?.("/login")}
                      variant={
                        plan.name === "Enterprise"
                          ? "outline"
                          : plan.popular
                            ? "gradient"
                            : "outline"
                      }
                      className={`w-full py-3 px-4 font-semibold transition-all duration-300 ${
                        plan.name === "Enterprise"
                          ? "border border-border bg-background hover:bg-primary/5"
                          : plan.popular
                            ? "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                            : "border border-border bg-background hover:bg-primary/5 hover:border-primary/30"
                      }`}
                    >
                      {plan.cta}
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
                      onClick={() => onNavigate?.("/company/contact")}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Talk to Sales
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
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
                    className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => onNavigate?.("/faq")}>
                View All FAQs <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start free today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/company/contact")}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
