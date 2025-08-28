"use client";
import { PageContainer, Section } from "@/components/layout/PageContainer";
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
    <Section
      id="features"
      className="relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,theme(colors.chart-1/6),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,theme(colors.primary/8),transparent_50%)]" />
      <PageContainer className="relative">
        <div className="max-w-2xl">
          <TypographyComponents.H2
            id="features-heading"
            className="text-3xl md:text-4xl"
          >
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
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm overflow-hidden hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-chart-1/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col gap-3">
                  <div className="h-12 w-12 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-chart-1/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-chart-1/15 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <TypographyComponents.H3 className="text-base group-hover:text-primary/90 transition-colors">
                    {f.title}
                  </TypographyComponents.H3>
                  <Typography
                    variant="small"
                    className="text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors"
                  >
                    {f.desc}
                  </Typography>
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageContainer>
    </Section>
  );
};
