"use client";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { Typography, TypographyComponents } from "@/lib/typography";
import { motion } from "framer-motion";
import {
  LucideBrain,
  LucideFolder,
  LucideHighlighter,
  LucideSearch,
  LucideUpload,
  LucideUsers,
} from "lucide-react";
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
    <Section className="relative overflow-hidden">
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,theme(colors.chart-1/6),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,theme(colors.primary/8),transparent_50%)]" />
      <PageContainer className="relative">
        <div className="max-w-2xl">
          <TypographyComponents.H2 className="text-3xl md:text-4xl">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              research velocity
            </span>
          </TypographyComponents.H2>
          <Typography variant="lead" className="mt-4">
            Built for teams who live in the literature: automate the grind &
            amplify insight.
          </Typography>
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
              <FeatureCard
                title={f.title}
                description={f.desc}
                icon={f.icon}
                variant="filled"
                hover="lift"
                showArrow
                size="md"
              />
            </motion.div>
          ))}
        </motion.div>
      </PageContainer>
    </Section>
  );
};
