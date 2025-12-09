"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Code,
  Lightbulb,
  Rocket,
  Search,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardWithVariants } from "../../components/ui/card";

interface DocsPageProps {
  onNavigate?: (path: string) => void;
}

export function DocsPage({ onNavigate }: DocsPageProps) {
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
                  <BookMarked className="h-4 w-4" />
                  Documentation Hub
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  Complete guide to ScholarFlow
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Everything you need to master research paper management, from
                  basic setup to advanced AI features and API integration.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-hover-glow"
                    onClick={() => onNavigate?.("/resources/api")}
                  >
                    <Code className="h-5 w-5 mr-2" />
                    API Reference
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
                        <div className="p-3 rounded-lg bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Quick Start Guide
                          </h3>
                          <p className="text-muted-foreground">
                            Set up your account and upload your first paper in
                            minutes.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-1/10">
                          <Zap className="h-6 w-6 text-chart-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Advanced Features
                          </h3>
                          <p className="text-muted-foreground">
                            Master AI insights, collaboration tools, and
                            automation.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Code className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Developer APIs
                          </h3>
                          <p className="text-muted-foreground">
                            Integrate ScholarFlow with your existing workflows.
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

        {/* Documentation Sections */}
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
                Choose your documentation path
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're a researcher, developer, or administrator, find
                the resources you need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Rocket,
                  title: "Getting Started",
                  description:
                    "Account setup, first login, uploading papers, and basic navigation through the platform.",
                  color: "primary",
                },
                {
                  icon: Search,
                  title: "Search & Discovery",
                  description:
                    "Advanced search techniques, filters, citation networks, and finding related research.",
                  color: "chart-1",
                },
                {
                  icon: BookOpen,
                  title: "Organization",
                  description:
                    "Collections, tags, folders, sharing, and collaborative research management.",
                  color: "chart-2",
                },
                {
                  icon: Lightbulb,
                  title: "AI Features",
                  description:
                    "Summaries, insights, recommendations, and intelligent paper analysis tools.",
                  color: "chart-3",
                },
                {
                  icon: Code,
                  title: "API Integration",
                  description:
                    "REST APIs, webhooks, authentication, and building custom integrations.",
                  color: "chart-4",
                },
                {
                  icon: Zap,
                  title: "Advanced Workflows",
                  description:
                    "Automation, batch operations, team management, and enterprise features.",
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
                    variant="interactive"
                    hover="lift"
                    className="h-full group cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200">
                        Read docs <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular documentation topics
              </h2>
              <p className="text-xl text-muted-foreground">
                Most searched help topics and guides
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Upload Your First Paper" },
                { title: "Create Collections" },
                { title: "Share Research" },
                { title: "AI Summaries" },
                { title: "Citation Export" },
                { title: "Team Collaboration" },
                { title: "API Authentication" },
                { title: "Troubleshooting" },
              ].map(({ title }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="p-4 bg-background rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                >
                  <span className="font-medium group-hover:text-primary transition-colors duration-200">
                    {title}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200" />
                </motion.div>
              ))}
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
                Ready to start your research journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of researchers already using ScholarFlow to
                accelerate their work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hover-glow"
                  onClick={() => onNavigate?.("/resources/tutorials")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Tutorials
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
