"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function ProductPapersPage() {
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
                    {isAuthenticated ? "Go to dashboard" : "Start free today"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    See it in action
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="hover-glow border-2">
              <CardContent className="p-8">
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
                      <h3 className="font-semibold text-lg">Semantic Search</h3>
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
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for modern research
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From discovery to analysis, our platform accelerates every step of
              your research workflow.
            </p>
          </div>
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
            ].map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="hover-lift hover-glow group">
                <CardContent className="p-6">
                  <div
                    className={`p-3 rounded-lg bg-${color}/10 mb-4 group-hover:bg-${color}/20 transition-colors`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started in minutes
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to transform your research workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Import & Upload",
                description:
                  "Add papers via PDF upload, URL import, or direct database search. Our AI extracts all metadata automatically.",
                features: [
                  "PDF drag & drop",
                  "arXiv/PubMed import",
                  "Auto metadata extraction",
                ],
              },
              {
                step: "02",
                title: "Organize & Annotate",
                description:
                  "Create collections, add tags, and make notes. Our smart categorization helps you stay organized effortlessly.",
                features: [
                  "Smart collections",
                  "Collaborative folders",
                  "Rich annotations",
                ],
              },
              {
                step: "03",
                title: "Discover & Analyze",
                description:
                  "Use AI-powered search and insights to find connections, identify gaps, and accelerate your research.",
                features: [
                  "Semantic search",
                  "AI summaries",
                  "Citation analysis",
                ],
              },
            ].map(({ step, title, description, features }) => (
              <Card key={step} className="relative">
                <CardHeader>
                  <div className="text-4xl font-bold text-primary/20 mb-2">
                    {step}
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for every researcher
            </h2>
            <p className="text-xl text-muted-foreground">
              Whether you're a student, academic, or industry researcher
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "PhD Students & Postdocs",
                description:
                  "Master your literature review, track progress, and discover research gaps.",
                benefits: [
                  "Comprehensive literature tracking",
                  "Progress visualization",
                  "Advisor collaboration",
                ],
                cta: "Accelerate your research",
              },
              {
                title: "Academic Researchers",
                description:
                  "Stay current with your field, manage grant research, and collaborate globally.",
                benefits: [
                  "Field trend monitoring",
                  "Grant proposal support",
                  "International collaboration",
                ],
                cta: "Enhance your impact",
              },
              {
                title: "Industry R&D Teams",
                description:
                  "Track competitive research, evaluate prior art, and accelerate innovation.",
                benefits: [
                  "Competitive intelligence",
                  "Patent landscape analysis",
                  "Innovation acceleration",
                ],
                cta: "Drive innovation",
              },
              {
                title: "Research Institutions",
                description:
                  "Enable campus-wide collaboration, track institutional output, and reduce duplicated effort.",
                benefits: [
                  "Institution-wide libraries",
                  "Collaboration analytics",
                  "Resource optimization",
                ],
                cta: "Transform your institution",
              },
            ].map(({ title, description, benefits, cta }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-8">
                  <h3 className="font-semibold text-xl mb-3">{title}</h3>
                  <p className="text-muted-foreground mb-6">{description}</p>
                  <ul className="space-y-2 mb-6">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="group">
                    {cta}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 hover-glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to revolutionize your research?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of researchers who've already transformed their
                workflow with ScholarFlow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow text-base"
                >
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-5 w-5" />
                    {isAuthenticated
                      ? "Access your library"
                      : "Start your free library"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="/pricing" className="flex items-center gap-2">
                    View pricing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Free forever for up to 100 papers. No credit card required.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
