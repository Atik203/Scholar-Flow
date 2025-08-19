"use client";
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
    <section id="features" className="py-28" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Powerful features for research velocity
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Built for teams who live in the literature: automate the grind &
            amplify insight.
          </p>
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
                className="group relative rounded-xl border bg-card/50 p-6 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col gap-3">
                  <div className="h-11 w-11 inline-flex items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
