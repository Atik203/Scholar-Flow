"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Code,
  FileText,
  Lightbulb,
  Rocket,
  Search,
  Zap,
} from "lucide-react";
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function DocumentationPage() {
  const { session } = useAuth();
  const isAuthenticated = !!session;
  
  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookMarked className="h-4 w-4" />
                Documentation Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Complete guide to ScholarFlow
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Everything you need to master research paper management, from basic setup to advanced AI features and API integration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#getting-started"
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="/api" className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Reference
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Quick Start Guide</h3>
                      <p className="text-muted-foreground">
                        Set up your account and upload your first paper in minutes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Zap className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Advanced Features</h3>
                      <p className="text-muted-foreground">
                        Master AI insights, collaboration tools, and automation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Code className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Developer APIs</h3>
                      <p className="text-muted-foreground">
                        Integrate ScholarFlow with your existing workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documentation Sections */}
        <section id="getting-started" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose your documentation path
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a researcher, developer, or administrator, find the resources you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "Getting Started",
                description:
                  "Account setup, first login, uploading papers, and basic navigation through the platform.",
                color: "primary",
                href: "#basic-setup"
              },
              {
                icon: Search,
                title: "Search & Discovery",
                description:
                  "Advanced search techniques, filters, citation networks, and finding related research.",
                color: "chart-1",
                href: "#search-guide"
              },
              {
                icon: BookOpen,
                title: "Organization",
                description:
                  "Collections, tags, folders, sharing, and collaborative research management.",
                color: "chart-2",
                href: "#organization"
              },
              {
                icon: Lightbulb,
                title: "AI Features",
                description:
                  "Summaries, insights, recommendations, and intelligent paper analysis tools.",
                color: "chart-3",
                href: "#ai-features"
              },
              {
                icon: Code,
                title: "API Integration",
                description:
                  "REST APIs, webhooks, authentication, and building custom integrations.",
                color: "chart-4",
                href: "#api-docs"
              },
              {
                icon: Zap,
                title: "Advanced Workflows",
                description:
                  "Automation, batch operations, team management, and enterprise features.",
                color: "chart-5",
                href: "#advanced"
              },
            ].map(({ icon: Icon, title, description, color, href }) => (
              <Card key={title} className="hover-lift group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <Link 
                    href={href}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
                  >
                    Read docs <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular documentation topics
            </h2>
            <p className="text-xl text-muted-foreground">
              Most searched help topics and guides
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Upload Your First Paper", href: "#first-upload" },
              { title: "Create Collections", href: "#collections" },
              { title: "Share Research", href: "#sharing" },
              { title: "AI Summaries", href: "#ai-summaries" },
              { title: "Citation Export", href: "#citations" },
              { title: "Team Collaboration", href: "#collaboration" },
              { title: "API Authentication", href: "#api-auth" },
              { title: "Troubleshooting", href: "#troubleshooting" },
            ].map(({ title, href }) => (
              <Link 
                key={title}
                href={href}
                className="p-4 bg-background rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group"
              >
                <span className="font-medium group-hover:text-primary transition-colors duration-200">
                  {title}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your research journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of researchers already using ScholarFlow to accelerate their work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className="flex items-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base"
              >
                <Link href="/tutorials" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  View Tutorials
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}