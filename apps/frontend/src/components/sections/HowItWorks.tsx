"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Upload Your Papers",
    description: "Drag and drop PDFs, DOCX, or import from arXiv, DOI, or Semantic Scholar. We handle OCR, metadata extraction, and secure cloud storage.",
    icon: "Upload",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "AI Processing & Chunking",
    description: "Our AI engine automatically extracts text, generates embeddings, and creates semantic chunks for lightning-fast search.",
    icon: "Processing",
    color: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    title: "Search & Discover",
    description: "Use semantic search to find relevant passages, or browse AI-generated summaries and key claims across your entire library.",
    icon: "Search",
    color: "from-amber-500 to-orange-500",
  },
  {
    number: "04",
    title: "Organize & Collaborate",
    description: "Create collections, add annotations, and invite team members to build shared knowledge bases with role-based access.",
    icon: "Collaborate",
    color: "from-emerald-500 to-green-500",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-primary/3" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Four steps to{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              research mastery
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From upload to insight in minutes, not hours. Our AI pipeline handles the heavy lifting so you focus on discovery.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative flex gap-6 p-8 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 via-background/50 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 px-8 py-6 text-lg">
              Learn More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
