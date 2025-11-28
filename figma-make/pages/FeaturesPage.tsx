"use client";

import {
  Bot,
  Brain,
  FileSearch,
  GitBranch,
  Globe,
  Lock,
  MessageSquare,
  Search,
  Share2,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface FeaturesPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Data
// ============================================================================
const features = [
  {
    icon: Bot,
    title: "AI-Powered Research Assistant",
    description:
      "Get intelligent summaries, key insights extraction, and automated literature reviews powered by advanced AI models.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    benefits: [
      "Save 70% research time",
      "Identify key findings instantly",
      "Generate comprehensive summaries",
    ],
  },
  {
    icon: Search,
    title: "Semantic Paper Search",
    description:
      "Find relevant papers using natural language queries and semantic understanding, not just keyword matching.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
    benefits: [
      "Natural language queries",
      "Contextual relevance",
      "Cross-domain discovery",
    ],
  },
  {
    icon: MessageSquare,
    title: "Smart Annotation System",
    description:
      "Collaborative annotations with AI-enhanced insights, linking related concepts across your research library.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&auto=format",
    benefits: [
      "Real-time collaboration",
      "AI-suggested connections",
      "Version control",
    ],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share research spaces, collaborate on annotations, and maintain synchronized knowledge across your team.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format",
    benefits: ["Real-time sync", "Permission controls", "Activity tracking"],
  },
  {
    icon: Brain,
    title: "Knowledge Graph Mapping",
    description:
      "Visualize connections between papers, authors, and concepts to discover hidden research patterns.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format",
    benefits: [
      "Visual relationship mapping",
      "Pattern recognition",
      "Research gap identification",
    ],
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description:
      "Extract tables, figures, and key data points automatically with advanced document parsing.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    benefits: [
      "Automatic data extraction",
      "Figure analysis",
      "Citation parsing",
    ],
  },
];

const additionalFeatures = [
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Research papers in 40+ languages supported",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect with your existing research tools",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes and collaborate like developers",
  },
  {
    icon: Target,
    title: "Smart Recommendations",
    description: "AI-curated paper suggestions based on your research",
  },
  {
    icon: Share2,
    title: "Publication Ready",
    description: "Export citations and bibliographies instantly",
  },
];

// ============================================================================
// Features Page Component
// ============================================================================
export function FeaturesPage({ onNavigate }: FeaturesPageProps) {
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
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              Research Features Built for{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Modern Scholars
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Discover the comprehensive suite of AI-powered tools designed to
              accelerate your research workflow and enhance collaboration across
              academic and industry teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to revolutionize your research process
            </p>
          </motion.div>

          <div className="grid gap-16 lg:gap-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`grid gap-8 lg:gap-16 lg:grid-cols-2 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-chart-1" />
                        <span className="text-foreground font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
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
              Additional Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extended features to support every aspect of your research journey
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
