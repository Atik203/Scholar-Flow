"use client";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  Folder,
  MessageSquare,
  Play,
  Quote,
  Search,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Upload Your Papers",
    subtitle: "Smart Document Processing",
    desc: "Simply drag and drop your PDFs. Our intelligent parser extracts text, identifies structure, and prepares embeddings for semantic search.",
    icon: Upload,
    gradient: "from-blue-500 to-cyan-500",
    highlights: [
      "PDF, DOC, TXT support",
      "Auto metadata extraction",
      "Bulk upload ready",
    ],
    mockContent: (
      <div className="space-y-4">
        <motion.div
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border-2 border-dashed border-blue-500/40"
          animate={{
            borderColor: [
              "rgba(59, 130, 246, 0.4)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(59, 130, 246, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-3 bg-foreground/20 rounded-full w-2/3 mb-2" />
            <div className="h-2 bg-muted-foreground/30 rounded-full w-1/2" />
          </div>
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-medium text-green-600">
              Processing
            </span>
          </motion.div>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Text", progress: 100 },
            { label: "Metadata", progress: 80 },
            { label: "Embeddings", progress: 45 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="p-3 bg-card/50 rounded-lg border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-xs text-muted-foreground mb-2">
                {item.label}
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Organize & Annotate",
    subtitle: "Intelligent Organization",
    desc: "Create smart collections, add contextual highlights, and attach notes. Everything stays connected and searchable.",
    icon: Folder,
    gradient: "from-amber-500 to-orange-500",
    highlights: ["Smart collections", "Inline annotations", "Team sharing"],
    mockContent: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Folder className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Research Collection</div>
            <div className="text-xs text-muted-foreground">
              12 papers • 45 annotations
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { color: "border-l-yellow-500", highlight: true },
            { color: "border-l-green-500", highlight: false },
            { color: "border-l-blue-500", highlight: true },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-3 bg-card/60 rounded-lg border-l-4 ${item.color} hover:bg-card transition-colors`}
            >
              <div className="h-2.5 bg-foreground/15 rounded w-full mb-1.5" />
              {item.highlight && (
                <div className="h-2 bg-yellow-500/30 rounded w-2/3" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Search & Discover",
    subtitle: "AI-Powered Insights",
    desc: "Use semantic search to find relevant passages. Get AI-generated summaries that spotlight key insights and claims.",
    icon: Search,
    gradient: "from-purple-500 to-pink-500",
    highlights: ["Semantic search", "AI summaries", "Citation tracking"],
    mockContent: (
      <div className="space-y-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Search className="h-5 w-5 text-purple-500" />
              <div className="flex-1 h-3 bg-purple-500/20 rounded-full" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-purple-500" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-foreground/20 rounded w-full" />
              <div className="h-2 bg-foreground/15 rounded w-4/5" />
              <div className="h-2 bg-foreground/10 rounded w-3/5" />
            </div>
          </div>
        </div>
        <motion.div
          className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-green-600 mb-2">
                AI Summary
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-green-600/20 rounded w-full" />
                <div className="h-2 bg-green-600/15 rounded w-5/6" />
                <div className="h-2 bg-green-600/10 rounded w-4/6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Collaborate with Team",
    subtitle: "Real-time Collaboration",
    desc: "Invite team members, share collections, and work together in real-time. Comments, mentions, and activity tracking keep everyone aligned.",
    icon: Users,
    gradient: "from-green-500 to-teal-500",
    highlights: ["Real-time editing", "Team workspaces", "Activity feeds"],
    mockContent: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/30">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Research Team</div>
            <div className="text-xs text-muted-foreground">
              5 members • 3 online
            </div>
          </div>
          <div className="flex -space-x-2">
            {["bg-blue-500", "bg-green-500", "bg-purple-500"].map(
              (color, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-white text-xs font-medium`}
                >
                  {String.fromCharCode(65 + i)}
                </motion.div>
              )
            )}
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              user: "Alice",
              action: "commented on",
              item: "ML Research",
              time: "2m ago",
              color: "text-blue-500",
            },
            {
              user: "Bob",
              action: "added paper to",
              item: "AI Collection",
              time: "5m ago",
              color: "text-green-500",
            },
            {
              user: "Carol",
              action: "shared",
              item: "Literature Review",
              time: "12m ago",
              color: "text-purple-500",
            },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center ${activity.color} text-xs font-medium`}
              >
                {activity.user[0]}
              </div>
              <div className="flex-1 text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.item}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "05",
    title: "Generate Citations",
    subtitle: "Auto-Format References",
    desc: "Automatically generate citations in any format - APA, MLA, Chicago, IEEE, and more. Export to Word, LaTeX, or copy to clipboard instantly.",
    icon: Quote,
    gradient: "from-indigo-500 to-violet-500",
    highlights: ["50+ citation styles", "One-click export", "BibTeX support"],
    mockContent: (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">Citation Generator</span>
            </div>
            <div className="flex items-center gap-2">
              {["APA", "MLA", "IEEE"].map((style, i) => (
                <motion.button
                  key={style}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${i === 0 ? "bg-indigo-500 text-white" : "bg-muted hover:bg-muted/80"}`}
                >
                  {style}
                </motion.button>
              ))}
            </div>
          </div>
          <motion.div
            className="p-3 bg-background/60 rounded-lg border border-border/50 font-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-muted-foreground">
              Smith, J., & Johnson, A. (2024).{" "}
            </span>
            <span className="text-foreground italic">
              Machine Learning in Research
            </span>
            <span className="text-muted-foreground">
              . Journal of AI, 15(3), 234-256.
            </span>
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: FileText,
              label: "Copy",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: MessageSquare,
              label: "Word",
              color: "from-indigo-500 to-violet-500",
            },
            {
              icon: Zap,
              label: "LaTeX",
              color: "from-green-500 to-emerald-500",
            },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all"
            >
              <div
                className={`w-6 h-6 rounded-md bg-gradient-to-br ${action.color} flex items-center justify-center`}
              >
                <action.icon className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden"
      aria-labelledby="how-heading"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--chart-1)_0%,transparent_50%)] opacity-5" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-40 left-[5%] w-32 h-32 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-[10%] w-40 h-40 rounded-full bg-chart-1/10 blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Simple 5-Step Workflow</span>
          </motion.div>

          <h2
            id="how-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Your research workflow,{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Transform how you discover, organize, and collaborate on research
            papers. Get started in minutes, not hours.
          </p>
        </motion.div>

        {/* Steps Navigation - Desktop */}
        <div className="hidden lg:flex items-center justify-center gap-4 mb-16">
          {steps.map((step, i) => (
            <motion.button
              key={step.number}
              onClick={() => setActiveStep(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeStep === i
                  ? "bg-gradient-to-r from-primary/10 to-chart-1/10 border-2 border-primary/30 shadow-lg"
                  : "bg-card/50 border border-border/50 hover:border-primary/30"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.gradient} text-white font-bold text-lg shadow-lg`}
              >
                {step.number}
              </div>
              <div className="text-left">
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm text-muted-foreground">
                  {step.subtitle}
                </div>
              </div>
              {activeStep === i && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-chart-1 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Mobile Step Selector */}
            <div className="flex lg:hidden items-center gap-3 overflow-x-auto pb-4">
              {steps.map((step, i) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeStep === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Step {step.number}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${steps[activeStep].gradient} shadow-xl`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  {React.createElement(steps[activeStep].icon, {
                    className: "h-8 w-8 text-white",
                  })}
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Step {steps[activeStep].number}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {steps[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-3">
                {steps[activeStep].highlights.map((highlight, i) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${steps[activeStep].gradient}`}
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-primary font-medium group"
              >
                Learn more about this step
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Interactive Preview */}
          <motion.div
            key={`preview-${activeStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
              {/* Top bar decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-purple-500" />

              {/* Window controls */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="flex-1 mx-4 h-6 rounded-md bg-muted/50 flex items-center px-3">
                  <div className="h-2 bg-muted-foreground/30 rounded w-1/3" />
                </div>
              </div>

              {/* Mock content */}
              <div className="min-h-[300px]">
                {steps[activeStep].mockContent}
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-3 -right-3 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-lg"
              >
                <Play className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Watch Demo</span>
              </motion.div>
            </div>

            {/* Background glow */}
            <motion.div
              className={`absolute inset-0 -z-10 blur-3xl opacity-30 rounded-3xl bg-gradient-to-br ${steps[activeStep].gradient}`}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl transition-all"
            >
              Start Your Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 font-semibold transition-all flex items-center gap-2"
            >
              <Play className="h-5 w-5" />
              Watch Full Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
