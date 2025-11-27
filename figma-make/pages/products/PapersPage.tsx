"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  Lightbulb,
  Rocket,
  Search,
  Upload,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { CardWithVariants } from "../../components/ui/card";

interface PapersPageProps {
  onNavigate?: (path: string) => void;
}

export function PapersPage({ onNavigate }: PapersPageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <FileText className="h-4 w-4" />
                  Research Papers Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  Your research library, supercharged
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Upload, organize, and analyze academic papers with AI-powered
                  insights. Transform how you discover, read, and connect
                  research.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                    onClick={() => onNavigate?.("/login")}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start free today
                  </Button>
                  <Button size="lg" variant="outline">
                    <Search className="h-5 w-5 mr-2" />
                    See it in action
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardWithVariants
                  variant="elevated"
                  hover="glow"
                  padding="lg"
                  className="border-2 shadow-xl backdrop-blur-sm"
                >
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Smart Upload</h3>
                        <p className="text-muted-foreground">
                          Drag & drop PDFs or paste arXiv links. Metadata
                          extracted automatically.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-chart-1/10">
                        <Search className="h-6 w-6 text-chart-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Semantic Search
                        </h3>
                        <p className="text-muted-foreground">
                          Find papers by concepts, not just keywords. AI
                          understands context.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-chart-2/10">
                        <Brain className="h-6 w-6 text-chart-2" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">AI Summaries</h3>
                        <p className="text-muted-foreground">
                          Generate concise summaries and extract key insights
                          instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardWithVariants>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
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
                Everything you need for modern research
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From discovery to analysis, our platform accelerates every step
                of your research workflow.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Universal Import",
                  description:
                    "Support for PDFs, URLs, DOIs, and direct database imports from arXiv, PubMed, IEEE.",
                  color: "primary",
                },
                {
                  icon: Search,
                  title: "Advanced Search",
                  description:
                    "Full-text search, citation networks, author disambiguation, and topic clustering.",
                  color: "chart-1",
                },
                {
                  icon: BookOpen,
                  title: "Smart Organization",
                  description:
                    "Auto-categorization, custom tags, folder hierarchies, and collaborative collections.",
                  color: "chart-2",
                },
                {
                  icon: Lightbulb,
                  title: "AI Insights",
                  description:
                    "Research gap analysis, trend predictions, citation recommendations, and summary generation.",
                  color: "chart-3",
                },
                {
                  icon: Zap,
                  title: "Real-time Sync",
                  description:
                    "Access your library anywhere. Cloud sync with offline reading capabilities.",
                  color: "chart-4",
                },
                {
                  icon: Brain,
                  title: "Citation Management",
                  description:
                    "Auto-generate bibliographies in any format. Track impact and citation networks.",
                  color: "chart-5",
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
                    variant="default"
                    hover="lift"
                    padding="md"
                    className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 group"
                  >
                    <div
                      className={`p-3 rounded-lg bg-${color}/10 mb-4 w-fit group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`h-6 w-6 text-${color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
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
                Get started in minutes
              </h2>
              <p className="text-xl text-muted-foreground">
                Three simple steps to transform your research workflow
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Import & Upload",
                  description:
                    "Drag and drop PDFs, paste URLs, or connect to academic databases. We handle the rest.",
                },
                {
                  step: "02",
                  title: "Organize & Discover",
                  description:
                    "AI automatically categorizes papers and suggests related research you might have missed.",
                },
                {
                  step: "03",
                  title: "Analyze & Collaborate",
                  description:
                    "Get AI insights, share with your team, and accelerate your research breakthroughs.",
                },
              ].map(({ step, title, description }, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-chart-1 text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/5),transparent_70%)]" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to supercharge your research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of researchers already using ScholarFlow to
                accelerate their work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
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
