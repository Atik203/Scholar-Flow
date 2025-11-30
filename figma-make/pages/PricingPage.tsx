"use client";

/**
 * PricingPage - Subscription Plans
 *
 * Enhanced with:
 * - Interactive feature comparison table
 * - Usage calculator
 * - Testimonials carousel
 * - FAQ accordion
 */

import {
  ArrowRight,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  HelpCircle,
  MessageCircle,
  Minus,
  Quote,
  Rocket,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    papers: 50,
    teamSize: 3,
    aiAnalysis: true,
    collaboration: true,
  });

  // Calculate recommended plan based on usage
  const getRecommendedPlan = () => {
    const { papers, teamSize, aiAnalysis, collaboration } = calculatorValues;
    if (papers <= 10 && teamSize <= 1) return "Free";
    if (papers <= 100 && teamSize <= 5) return "Pro";
    if (teamSize > 5 || (collaboration && papers > 100)) return "Team";
    return "Enterprise";
  };

  // Calculate estimated monthly cost
  const getEstimatedCost = () => {
    const recommended = getRecommendedPlan();
    const plan = plans.find((p) => p.name === recommended);
    if (!plan || plan.monthlyPrice === null) return "Custom";
    return `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}`;
  };

  // Testimonials data
  const testimonials = [
    {
      quote:
        "ScholarFlow has revolutionized how our team collaborates on research. The AI insights save us hours every week.",
      author: "Dr. Sarah Chen",
      title: "Associate Professor",
      institution: "MIT",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      rating: 5,
    },
    {
      quote:
        "The semantic search is incredibly powerful. I can find relevant papers in seconds instead of hours.",
      author: "Prof. James Miller",
      title: "Department Head",
      institution: "Stanford University",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      rating: 5,
    },
    {
      quote:
        "Best investment for our research department. The Team plan's analytics help us track productivity.",
      author: "Dr. Emily Watson",
      title: "Research Director",
      institution: "Oxford University",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
      rating: 5,
    },
    {
      quote:
        "Moving from spreadsheets to ScholarFlow was the best decision. Our paper management is now effortless.",
      author: "Dr. Michael Park",
      title: "Senior Researcher",
      institution: "Harvard University",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      rating: 5,
    },
  ];

  // Feature comparison data
  const comparisonFeatures = [
    {
      feature: "Paper Storage",
      free: "10 papers",
      pro: "Unlimited",
      team: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      feature: "AI Summaries",
      free: "Basic",
      pro: "Advanced",
      team: "Advanced",
      enterprise: "Custom Models",
    },
    {
      feature: "Team Members",
      free: "1",
      pro: "Up to 5",
      team: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      feature: "Semantic Search",
      free: false,
      pro: true,
      team: true,
      enterprise: true,
    },
    {
      feature: "API Access",
      free: false,
      pro: true,
      team: true,
      enterprise: true,
    },
    {
      feature: "SSO Integration",
      free: false,
      pro: false,
      team: true,
      enterprise: true,
    },
    {
      feature: "Custom Workflows",
      free: false,
      pro: false,
      team: true,
      enterprise: true,
    },
    {
      feature: "Priority Support",
      free: false,
      pro: true,
      team: true,
      enterprise: true,
    },
    {
      feature: "Dedicated Account Manager",
      free: false,
      pro: false,
      team: false,
      enterprise: true,
    },
    {
      feature: "On-premise Deployment",
      free: false,
      pro: false,
      team: false,
      enterprise: true,
    },
  ];

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

        {/* Usage Calculator */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <Button
                onClick={() => setShowCalculator(!showCalculator)}
                variant="outline"
                className="gap-2 btn-hover-glow"
              >
                <Calculator className="h-4 w-4" />
                {showCalculator ? "Hide" : "Open"} Usage Calculator
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showCalculator ? "rotate-180" : ""}`}
                />
              </Button>
            </motion.div>

            <AnimatePresence>
              {showCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      Find Your Perfect Plan
                    </h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Papers per month:{" "}
                          <span className="text-primary">
                            {calculatorValues.papers}
                          </span>
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="500"
                          value={calculatorValues.papers}
                          onChange={(e) =>
                            setCalculatorValues((prev) => ({
                              ...prev,
                              papers: parseInt(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>5</span>
                          <span>500+</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Team size:{" "}
                          <span className="text-primary">
                            {calculatorValues.teamSize}
                          </span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={calculatorValues.teamSize}
                          onChange={(e) =>
                            setCalculatorValues((prev) => ({
                              ...prev,
                              teamSize: parseInt(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1</span>
                          <span>50+</span>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calculatorValues.aiAnalysis}
                          onChange={(e) =>
                            setCalculatorValues((prev) => ({
                              ...prev,
                              aiAnalysis: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                        />
                        <span className="text-sm">
                          Need advanced AI analysis?
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calculatorValues.collaboration}
                          onChange={(e) =>
                            setCalculatorValues((prev) => ({
                              ...prev,
                              collaboration: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                        />
                        <span className="text-sm">
                          Need team collaboration?
                        </span>
                      </label>
                    </div>

                    <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl border border-primary/20 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Recommended Plan
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {getRecommendedPlan()}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        Estimated:{" "}
                        <span className="font-semibold text-foreground">
                          {getEstimatedCost()}
                        </span>
                        /month
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Feature Comparison Table */}
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold">Free</th>
                      <th className="p-4 text-center font-semibold bg-primary/5">
                        <div className="flex flex-col items-center">
                          <span>Pro</span>
                          <span className="text-xs text-primary font-normal">
                            Popular
                          </span>
                        </div>
                      </th>
                      <th className="p-4 text-center font-semibold">Team</th>
                      <th className="p-4 text-center font-semibold">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4 font-medium">{item.feature}</td>
                        <td className="p-4 text-center">
                          {typeof item.free === "boolean" ? (
                            item.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{item.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-primary/5">
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium">
                              {item.pro}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof item.team === "boolean" ? (
                            item.team ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{item.team}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof item.enterprise === "boolean" ? (
                            item.enterprise ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{item.enterprise}</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

        {/* Testimonials Carousel */}
        <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
                Trusted by Researchers Worldwide
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our customers have to say
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 md:p-12"
                >
                  <Quote className="h-12 w-12 text-primary/20 mb-6" />

                  <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                    "{testimonials[currentTestimonialIndex].quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentTestimonialIndex].avatar}
                      alt={testimonials[currentTestimonialIndex].author}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {testimonials[currentTestimonialIndex].author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonialIndex].title},{" "}
                        {testimonials[currentTestimonialIndex].institution}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[
                        ...Array(testimonials[currentTestimonialIndex].rating),
                      ].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentTestimonialIndex((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonialIndex
                          ? "w-6 bg-primary"
                          : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentTestimonialIndex((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
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
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <h3 className="text-lg font-semibold pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                          openFaqIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-14">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
