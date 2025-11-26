"use client";
import {
  ArrowRight,
  LucideBrain,
  LucideFolder,
  LucideHighlighter,
  LucideSearch,
  LucideUpload,
  LucideUsers,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const features = [
  {
    title: "Smart Ingestion",
    desc: "Upload PDFs (OCR & embeddings pipeline coming) with secure processing.",
    icon: LucideUpload,
  },
  {
    title: "Semantic Search",
    desc: "Vector similarity (pgvector) surfaces the most relevant passages.",
    icon: LucideSearch,
  },
  {
    title: "AI Summaries",
    desc: "Condense papers into crisp summaries & key claims (flagged).",
    icon: LucideBrain,
  },
  {
    title: "Collaborative Collections",
    desc: "Group papers & share context with your team effortlessly.",
    icon: LucideFolder,
  },
  {
    title: "Inline Annotations",
    desc: "Highlight passages, attach notes – future threading & versioning.",
    icon: LucideHighlighter,
  },
  {
    title: "Team Ready",
    desc: "Role-based sharing & workspace isolation (Phase 2).",
    icon: LucideUsers,
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,var(--chart-1)_0%,transparent_50%)] opacity-5" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,var(--primary)_0%,transparent_50%)] opacity-8" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
              research velocity
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Built for teams who live in the literature: automate the grind &
            amplify insight.
          </p>
        </div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <FeatureCard title={f.title} description={f.desc} icon={f.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// FeatureCard component inline for self-containment
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="group relative p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] cursor-pointer">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
        <ArrowRight className="h-4 w-4" />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-[var(--chart-1)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
