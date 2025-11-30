"use client";

import {
  ArrowRight,
  BarChart3,
  Brain,
  Eye,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardWithVariants } from "../../components/ui/card";

interface AIInsightsPageProps {
  onNavigate?: (path: string) => void;
}

export function AIInsightsPage({ onNavigate }: AIInsightsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium mb-6">
                  <Brain className="h-4 w-4" />
                  AI Insights Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                  AI that accelerates discovery
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Unlock hidden patterns in research. Get AI-powered insights,
                  trend analysis, and intelligent recommendations that transform
                  how you understand literature.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                    onClick={() => onNavigate?.("/login")}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Explore AI insights
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-hover-glow"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    See AI in action
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <Brain className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Smart Analysis
                          </h3>
                          <p className="text-muted-foreground">
                            AI analyzes patterns across millions of papers to
                            surface hidden insights.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-4/10">
                          <TrendingUp className="h-6 w-6 text-chart-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Trend Prediction
                          </h3>
                          <p className="text-muted-foreground">
                            Identify emerging research directions before they
                            become mainstream.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-5/10">
                          <Lightbulb className="h-6 w-6 text-chart-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Research Gaps
                          </h3>
                          <p className="text-muted-foreground">
                            Discover unexplored areas and potential breakthrough
                            opportunities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                AI-powered research intelligence
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced machine learning algorithms analyze research patterns
                to provide actionable insights.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Semantic Understanding",
                  description:
                    "Deep learning models understand research context, not just keywords, for precise analysis.",
                  color: "chart-3",
                },
                {
                  icon: TrendingUp,
                  title: "Trend Analysis",
                  description:
                    "Identify emerging topics, declining areas, and predict future research directions.",
                  color: "chart-4",
                },
                {
                  icon: Target,
                  title: "Gap Detection",
                  description:
                    "Automatically discover understudied areas and potential research opportunities.",
                  color: "chart-5",
                },
                {
                  icon: BarChart3,
                  title: "Citation Intelligence",
                  description:
                    "Analyze citation networks, predict impact, and identify influential work early.",
                  color: "primary",
                },
                {
                  icon: Lightbulb,
                  title: "Recommendation Engine",
                  description:
                    "Get personalized paper recommendations based on your research interests and history.",
                  color: "chart-1",
                },
                {
                  icon: Sparkles,
                  title: "Auto-Summarization",
                  description:
                    "Generate accurate abstracts, key findings, and methodology summaries automatically.",
                  color: "chart-2",
                },
              ].map(({ icon: Icon, title, description, color }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <CardWithVariants
                    variant="interactive"
                    hover="lift"
                    className="h-full group"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`p-3 rounded-lg bg-${color}/10 mb-4 w-fit group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Deep Dive */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                AI insights that drive breakthroughs
              </h2>
              <p className="text-xl text-muted-foreground">
                From literature reviews to hypothesis generation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Automated Literature Reviews",
                  description:
                    "AI scans thousands of papers to identify the most relevant work for your research area.",
                  features: [
                    "Comprehensive coverage",
                    "Citation prioritization",
                    "Gap identification",
                  ],
                },
                {
                  title: "Research Trend Forecasting",
                  description:
                    "Predictive models analyze publication patterns to forecast emerging research areas.",
                  features: [
                    "Emerging topic detection",
                    "Funding trend analysis",
                    "Collaboration opportunities",
                  ],
                },
                {
                  title: "Methodology Extraction",
                  description:
                    "AI extracts and compares research methodologies across papers for meta-analysis.",
                  features: [
                    "Method comparison",
                    "Reproducibility assessment",
                    "Best practice identification",
                  ],
                },
                {
                  title: "Hypothesis Generation",
                  description:
                    "AI suggests potential research directions based on gaps and connections in literature.",
                  features: [
                    "Cross-field connections",
                    "Novel combinations",
                    "Testable hypotheses",
                  ],
                },
              ].map(({ title, description, features }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <CardWithVariants
                    variant="elevated"
                    hover="glow"
                    className="h-full"
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Eye className="h-4 w-4 text-chart-3" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to unlock AI-powered research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience the future of research with intelligent insights and
                automated analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hover-glow"
                  onClick={() => onNavigate?.("/pricing")}
                >
                  View Pricing
                  <ArrowRight className="h-5 w-5 ml-2" />
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
