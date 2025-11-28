"use client";

import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  FileText,
  MessageSquare,
  Play,
  Search,
  Share2,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface HowItWorksPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Data
// ============================================================================
const workflow = [
  {
    step: 1,
    title: "Upload Your Papers",
    description:
      "Drag and drop PDFs or import from your existing reference manager. We'll automatically extract metadata, figures, and citations.",
    icon: Upload,
    features: [
      "Bulk PDF upload",
      "Auto-metadata extraction",
      "Import from Zotero/Mendeley",
      "OCR for scanned papers",
    ],
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&auto=format",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 2,
    title: "AI-Powered Analysis",
    description:
      "Our advanced AI analyzes each paper to extract key insights, methodologies, findings, and creates semantic embeddings for intelligent search.",
    icon: Brain,
    features: [
      "Semantic analysis",
      "Key insights extraction",
      "Methodology detection",
      "Citation network mapping",
    ],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    color: "from-purple-500 to-pink-500",
  },
  {
    step: 3,
    title: "Smart Search & Discovery",
    description:
      "Find relevant papers using natural language queries. Our semantic search understands context and finds connections you might miss.",
    icon: Search,
    features: [
      "Natural language search",
      "Semantic similarity",
      "Cross-domain discovery",
      "Smart recommendations",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
    color: "from-green-500 to-emerald-500",
  },
  {
    step: 4,
    title: "Annotate & Collaborate",
    description:
      "Add annotations, highlights, and notes. Share insights with your team and collaborate in real-time on research projects.",
    icon: MessageSquare,
    features: [
      "Real-time annotations",
      "Team collaboration",
      "Version control",
      "Comment threads",
    ],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format",
    color: "from-orange-500 to-red-500",
  },
  {
    step: 5,
    title: "Generate Insights",
    description:
      "Get AI-powered summaries, research gap analysis, and automated literature reviews to accelerate your research process.",
    icon: Sparkles,
    features: [
      "AI summaries",
      "Research gap analysis",
      "Literature reviews",
      "Citation analysis",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format",
    color: "from-indigo-500 to-purple-500",
  },
  {
    step: 6,
    title: "Share & Publish",
    description:
      "Export your work in multiple formats, generate citations, and share your research with the global community.",
    icon: Share2,
    features: [
      "Multi-format export",
      "Citation generation",
      "Public sharing",
      "Publication tools",
    ],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    color: "from-teal-500 to-blue-500",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "10x Faster Research",
    description: "Reduce time spent on literature review from weeks to days",
    stat: "90%",
  },
  {
    icon: Brain,
    title: "Deeper Insights",
    description: "Discover connections and patterns you might have missed",
    stat: "300%",
  },
  {
    icon: Users,
    title: "Better Collaboration",
    description: "Seamless teamwork with real-time sync and sharing",
    stat: "5x",
  },
  {
    icon: CheckCircle,
    title: "Higher Quality",
    description: "More comprehensive and accurate research outcomes",
    stat: "95%",
  },
];

const testimonialSteps = [
  {
    step: 1,
    user: "Dr. Sarah Kim",
    role: "PhD Student, MIT",
    avatar: "https://i.pravatar.cc/80?img=5",
    comment:
      "Uploading 100+ papers took just minutes. The auto-metadata extraction saved me hours of manual work.",
  },
  {
    step: 3,
    user: "Prof. Michael Chen",
    role: "Research Director",
    avatar: "https://i.pravatar.cc/80?img=7",
    comment:
      "The semantic search found papers I never would have discovered through traditional keyword searches.",
  },
  {
    step: 4,
    user: "Dr. Lisa Rodriguez",
    role: "Postdoc, Stanford",
    avatar: "https://i.pravatar.cc/80?img=1",
    comment:
      "Real-time collaboration with my team across different time zones has been a game-changer.",
  },
];

// ============================================================================
// How It Works Page Component
// ============================================================================
export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-1/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Play className="h-4 w-4" />
              Step-by-step guide
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              How{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                ScholarFlow
              </span>{" "}
              Works
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              From upload to insight in 6 simple steps. See how ScholarFlow
              transforms your research workflow with AI-powered tools designed
              for modern researchers.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => onNavigate?.("/login")}
              >
                Try It Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 border-border bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300"
                onClick={() => onNavigate?.("/contact")}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Researchers Choose ScholarFlow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Measurable improvements in research productivity and quality
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workflow */}
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
              Your Research Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow the complete workflow from paper upload to published
              insights
            </p>
          </motion.div>

          {/* Step Navigation */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-4">
              {workflow.map((step) => (
                <Button
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  variant={activeStep === step.step ? "default" : "outline"}
                  className={`flex items-center gap-3 px-6 py-3 transition-all duration-300 ${
                    activeStep === step.step
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 hover:bg-primary/10 border border-border"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      activeStep === step.step
                        ? "bg-primary-foreground/20"
                        : "bg-primary/20"
                    }`}
                  >
                    <step.icon
                      className={`h-4 w-4 ${
                        activeStep === step.step
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    />
                  </div>
                  <span className="font-medium hidden sm:block">
                    {step.title}
                  </span>
                  <span className="sm:hidden">{step.step}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Active Step Display */}
          {workflow.map(
            (step) =>
              activeStep === step.step && (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid gap-16 lg:grid-cols-2 items-center"
                >
                  <div className={`${step.step % 2 === 0 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`}
                      >
                        <step.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Step {step.step} of 6
                        </div>
                        <h3 className="text-3xl font-bold">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="grid gap-4 mb-8">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* User Testimonial for relevant steps */}
                    {testimonialSteps.find((t) => t.step === step.step) && (
                      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={
                              testimonialSteps.find(
                                (t) => t.step === step.step
                              )!.avatar
                            }
                            alt="User avatar"
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">
                              {
                                testimonialSteps.find(
                                  (t) => t.step === step.step
                                )!.user
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {
                                testimonialSteps.find(
                                  (t) => t.step === step.step
                                )!.role
                              }
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic">
                          "
                          {
                            testimonialSteps.find((t) => t.step === step.step)!
                              .comment
                          }
                          "
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={`${step.step % 2 === 0 ? "lg:order-1" : ""}`}>
                    <div className="relative group">
                      <div
                        className={`absolute -inset-4 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-700`}
                      />
                      <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                        {/* Step indicator overlay */}
                        <div className="absolute top-4 left-4">
                          <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg font-bold text-lg`}
                          >
                            {step.step}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
          )}

          {/* Navigation arrows */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              variant="outline"
              className="px-6 py-3 border-border bg-background hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              ← Previous
            </Button>

            <div className="flex items-center gap-2">
              {workflow.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    idx + 1 === activeStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              variant="outline"
              className="px-6 py-3 border-border bg-background hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next →
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Examples */}
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
              Integrates With Your Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ScholarFlow connects with the tools you already use
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center hover:shadow-xl transition-all duration-500"
            >
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reference Managers</h3>
              <p className="text-muted-foreground mb-4">
                Import from Zotero, Mendeley, EndNote, and export to any format
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Zotero
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Mendeley
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  EndNote
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center hover:shadow-xl transition-all duration-500"
            >
              <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Writing Tools</h3>
              <p className="text-muted-foreground mb-4">
                Generate citations for LaTeX, Word, Google Docs, and more
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  LaTeX
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Word
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Docs
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center hover:shadow-xl transition-all duration-500"
            >
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Developer APIs</h3>
              <p className="text-muted-foreground mb-4">
                Custom integrations with REST APIs and webhook support
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  REST API
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Webhooks
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  SDKs
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
              Ready to Transform Your Research?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of researchers who have accelerated their work with
              ScholarFlow's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => onNavigate?.("/login")}
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 border-border bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300"
                onClick={() => onNavigate?.("/contact")}
              >
                Schedule Demo
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
