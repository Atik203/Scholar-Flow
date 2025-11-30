"use client";
import { ArrowRight, Check, Minus, Sparkles, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

const comparisonData = {
  features: [
    { name: "Semantic AI Search", category: "AI Features" },
    { name: "AI Paper Summaries", category: "AI Features" },
    { name: "Multi-paper Chat", category: "AI Features" },
    { name: "Deep Research Mode", category: "AI Features" },
    { name: "AI Writing Assistant", category: "AI Features" },
    { name: "Real-time Collaboration", category: "Collaboration" },
    { name: "Team Workspaces", category: "Collaboration" },
    { name: "Inline Annotations", category: "Core Features" },
    { name: "Smart Collections", category: "Core Features" },
    { name: "Citation Generation (10K+ styles)", category: "Core Features" },
    { name: "PDF Viewer with Highlights", category: "Core Features" },
    { name: "Plagiarism Detection", category: "Core Features" },
    { name: "Reference Manager Import", category: "Integration" },
    { name: "Browser Extension", category: "Integration" },
    { name: "Overleaf Integration", category: "Integration" },
    { name: "MS Word / Google Docs", category: "Integration" },
    { name: "API Access", category: "Integration" },
    { name: "SOC 2 Certified", category: "Security" },
    { name: "SSO / SAML", category: "Security" },
    { name: "24/7 Priority Support", category: "Support" },
  ],
  competitors: [
    {
      name: "ScholarFlow",
      logo: "✨",
      tagline: "AI-Powered Research Hub",
      highlight: true,
      // Semantic AI, AI Summaries, Multi-Chat, Deep Research, AI Writing, Collab, Teams, Annotations, Collections, Citations, PDF, Plagiarism, Import, Browser, Overleaf, Word/Docs, API, SOC2, SSO, Support
      features: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
    {
      name: "Paperpal",
      logo: "🤖",
      tagline: "AI Writing & Editing",
      highlight: false,
      // AI search (via 250M articles), AI summaries (partial), Chat PDF ✓, Research mode (partial), AI Writing ✓, Collab ✓, Teams (partial), Annotations (partial), Collections ✗, Citations ✓, PDF ✓, Plagiarism ✓, Import ✗, Browser ✓, Overleaf ✓, Word/Docs ✓, API ✗, SOC2 ✗, SSO ✗, Support (partial)
      features: [
        "partial",
        "partial",
        true,
        "partial",
        true,
        true,
        "partial",
        "partial",
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        false,
        false,
        "partial",
      ],
    },
    {
      name: "Zotero",
      logo: "📚",
      tagline: "Free Reference Manager",
      highlight: false,
      // No AI features, no collab, basic features, native import
      features: [
        false,
        false,
        false,
        false,
        false,
        false,
        "partial",
        true,
        true,
        true,
        true,
        false,
        "native",
        true,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
    },
    {
      name: "Mendeley",
      logo: "📖",
      tagline: "Elsevier Platform",
      highlight: false,
      // Limited AI, partial collab, basic features
      features: [
        false,
        false,
        false,
        false,
        false,
        "partial",
        "partial",
        true,
        true,
        "partial",
        true,
        false,
        "native",
        true,
        false,
        "partial",
        false,
        false,
        false,
        "partial",
      ],
    },
    {
      name: "Paperpile",
      logo: "📎",
      tagline: "Google-integrated Manager",
      highlight: false,
      // No AI, good collab, solid features
      features: [
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        false,
        "partial",
      ],
    },
  ],
};

const FeatureStatus = ({ status }: { status: boolean | string }) => {
  if (status === true) {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <Check className="h-4 w-4 text-green-500" />
      </div>
    );
  }
  if (status === "partial") {
    return (
      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
        <Minus className="h-4 w-4 text-amber-500" />
      </div>
    );
  }
  if (status === "native") {
    return <span className="text-xs text-muted-foreground">Native</span>;
  }
  return (
    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
      <X className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export const Comparison: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    ...new Set(comparisonData.features.map((f) => f.category)),
  ];

  const filteredFeatures = activeCategory
    ? comparisonData.features.filter((f) => f.category === activeCategory)
    : comparisonData.features;

  return (
    <section
      id="comparison"
      className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden"
      aria-labelledby="comparison-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary)_0%,transparent_50%)] opacity-5" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Feature Comparison</span>
          </motion.div>

          <h2
            id="comparison-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Why researchers choose{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              ScholarFlow
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            See how ScholarFlow compares to traditional reference managers.
            Built for modern research workflows with AI at its core.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === null
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-card border border-border hover:border-primary/30"
            }`}
          >
            All Features
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="overflow-x-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-6 font-semibold min-w-[200px]">
                  Features
                </th>
                {comparisonData.competitors.map((competitor) => (
                  <th
                    key={competitor.name}
                    className={`p-4 text-center min-w-[140px] ${
                      competitor.highlight
                        ? "bg-gradient-to-b from-primary/10 to-transparent"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">{competitor.logo}</span>
                      <span
                        className={`font-semibold text-sm ${
                          competitor.highlight ? "text-primary" : ""
                        }`}
                      >
                        {competitor.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {competitor.tagline}
                      </span>
                      {competitor.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium mt-1">
                          Recommended
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-primary/50" />
                      <span className="font-medium">{feature.name}</span>
                    </div>
                  </td>
                  {comparisonData.competitors.map((competitor, compIndex) => (
                    <td
                      key={competitor.name}
                      className={`p-6 text-center ${
                        competitor.highlight
                          ? "bg-gradient-to-b from-primary/5 to-transparent"
                          : ""
                      }`}
                    >
                      <div className="flex justify-center">
                        <FeatureStatus
                          status={
                            competitor.features[
                              comparisonData.features.findIndex(
                                (f) => f.name === feature.name
                              )
                            ]
                          }
                        />
                      </div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl transition-all"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </motion.button>
          <p className="mt-4 text-sm text-muted-foreground">
            14 days free • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
