"use client";
import { motion } from "motion/react";
import {
  ArrowRight,
  LucideBrain,
  LucideFolder,
  LucideHighlighter,
  LucideSearch,
  LucideUpload,
  LucideUsers,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";

const features = [
  {
    title: "Smart Ingestion",
    desc: "Upload PDFs (OCR & embeddings pipeline coming) with secure processing.",
    icon: LucideUpload,
    gradient: "from-blue-500 to-cyan-500",
    stats: "10K+ papers processed",
  },
  {
    title: "Semantic Search",
    desc: "Vector similarity (pgvector) surfaces the most relevant passages.",
    icon: LucideSearch,
    gradient: "from-violet-500 to-purple-500",
    stats: "0.3s avg search time",
  },
  {
    title: "AI Summaries",
    desc: "Condense papers into crisp summaries & key claims (flagged).",
    icon: LucideBrain,
    gradient: "from-amber-500 to-orange-500",
    stats: "85% time saved",
  },
  {
    title: "Collaborative Collections",
    desc: "Group papers & share context with your team effortlessly.",
    icon: LucideFolder,
    gradient: "from-emerald-500 to-green-500",
    stats: "500+ teams active",
  },
  {
    title: "Inline Annotations",
    desc: "Highlight passages, attach notes – future threading & versioning.",
    icon: LucideHighlighter,
    gradient: "from-pink-500 to-rose-500",
    stats: "1M+ annotations",
  },
  {
    title: "Team Ready",
    desc: "Role-based sharing & workspace isolation (Phase 2).",
    icon: LucideUsers,
    gradient: "from-indigo-500 to-blue-500",
    stats: "Enterprise grade",
  },
];

export const Features: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,var(--chart-1)_0%,transparent_50%)] opacity-10"
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,var(--primary)_0%,transparent_50%)] opacity-10"
        animate={{ opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-40 left-[5%] w-24 h-24 rounded-full bg-primary/10 blur-2xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-[10%] w-32 h-32 rounded-full bg-chart-1/10 blur-2xl"
        animate={{ y: [0, 25, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              research velocity
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Built for teams who live in the literature: automate the grind &
            amplify insight with AI-powered tools.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <FeatureCard
                title={f.title}
                description={f.desc}
                icon={f.icon}
                gradient={f.gradient}
                stats={f.stats}
                isHovered={hoveredIndex === i}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-4xl p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-card/60 via-card/40 to-background/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-purple-500 rounded-t-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "6", label: "Core Features", color: "text-primary" },
                { value: "AI", label: "Powered Search", color: "text-chart-1" },
                {
                  value: "Real-time",
                  label: "Collaboration",
                  color: "text-purple-500",
                },
                {
                  value: "Secure",
                  label: "& Private",
                  color: "text-green-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="space-y-1"
                >
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced FeatureCard component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  stats: string;
  isHovered: boolean;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  stats,
  isHovered,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-card/80 via-card/60 to-background/40 backdrop-blur-sm overflow-hidden cursor-pointer"
    >
      {/* Animated border gradient */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300`}
        style={{ opacity: isHovered ? 0.1 : 0 }}
      />

      {/* Top accent line */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />

      {/* Icon with gradient background */}
      <motion.div
        className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} shadow-lg mb-5`}
        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="h-6 w-6 text-white" />
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/20"
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>

      {/* Stats badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`}
        />
        {stats}
      </motion.div>

      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-6 right-6 flex items-center text-primary"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="h-5 w-5" />
      </motion.div>

      {/* Corner sparkle decoration */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: isHovered ? 180 : 0, scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Sparkles
          className={`h-4 w-4 text-muted-foreground/30 ${isHovered ? "text-primary/50" : ""}`}
        />
      </motion.div>
    </motion.div>
  );
};
