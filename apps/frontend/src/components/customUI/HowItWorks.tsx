"use client";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Folder,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import React from "react";

const steps = [
  {
    title: "1. Upload & Parse",
    desc: "Drag PDFs – we extract text, structure, and prep embeddings.",
    icon: Upload,
    mockContent: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
          <FileText className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <div className="h-3 bg-primary/20 rounded w-2/3" />
            <div className="h-2 bg-muted-foreground/20 rounded w-1/2 mt-1" />
          </div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "2. Organize & Annotate",
    desc: "Group into collections & leave contextual highlights.",
    icon: Folder,
    mockContent: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="h-5 w-5 text-blue-500" />
          <div className="h-3 bg-blue-500/20 rounded flex-1" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-2 bg-card/50 rounded border-l-4 border-l-yellow-500/50 group hover:border-l-yellow-500 transition-colors"
            >
              <div className="h-2.5 bg-foreground/15 rounded w-full" />
              <div className="h-2 bg-yellow-500/30 rounded w-2/3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "3. Search & Summarize",
    desc: "Vector similarity (coming) & AI summaries spotlight insights.",
    icon: Search,
    mockContent: (
      <div className="space-y-3">
        <div className="relative p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-primary" />
            <div className="h-2.5 bg-primary/30 rounded flex-1" />
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-foreground/20 rounded w-full" />
            <div className="h-2 bg-foreground/15 rounded w-4/5" />
          </div>
          <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
          <Brain className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-green-600/30 rounded w-3/4" />
            <div className="h-2 bg-green-600/20 rounded w-1/2" />
          </div>
        </div>
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-28 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden"
      aria-labelledby="how-heading"
    >
      {/* Enhanced background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/8),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.chart-1/6),transparent_50%)]" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mb-20">
          <motion.h2
            id="how-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            How{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              ScholarFlow
            </span>{" "}
            works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Three focused steps to transform reading into collaborative insight.
          </motion.p>
        </div>

        <div className="space-y-24">
          {steps.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-chart-1/10 border border-primary/20 flex items-center justify-center shadow-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                  </div>

                  <h3 className="font-bold text-2xl tracking-tight mb-4">
                    {step.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>

                <div className="relative group">
                  <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-primary/20">
                    <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-muted/50 via-background/80 to-muted/30 p-4 relative overflow-hidden">
                      {step.mockContent}

                      {/* Subtle overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/5" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-border/20 rounded-xl" />
                    </div>

                    {/* Enhanced glow effects */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </div>

                  {/* Bottom glow */}
                  <div className="absolute inset-x-8 -bottom-6 h-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent blur-xl rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
