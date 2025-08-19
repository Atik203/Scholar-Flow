"use client";
import { MarketingVideo } from "@/components/marketing/MarketingVideo";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section
      className="relative pt-40 pb-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,white,transparent_75%)] bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          id="hero-heading"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          Collaborate Smarter on <span className="text-primary">Research</span>
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          Scholar-Flow centralizes your papers, semantic search, AI summaries,
          annotations, and collection sharing so your literature review
          accelerates.
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" variant="gradient">
            <a href="#features">Explore Features</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="backdrop-blur">
            <a href="#how-it-works">How it Works</a>
          </Button>
        </motion.div>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-xl border bg-gradient-to-b from-muted/40 to-background p-3 md:p-4 shadow-lg after:absolute after:inset-0 after:rounded-xl after:pointer-events-none after:bg-[radial-gradient(circle_at_85%_15%,theme(colors.primary/25),transparent_60%)]"
        >
          <div className="aspect-video w-full rounded-md overflow-hidden bg-black/5 dark:bg-white/5">
            <MarketingVideo
              highSrc="/work_in_progress_hd.webm"
              lowSrc="/work_in_progress.webm"
              label="Scholar-Flow collaborative research workflow preview"
              priority
            />
          </div>
          <div className="absolute inset-x-0 -bottom-8 mx-auto h-16 w-[60%] blur-3xl rounded-full bg-primary/20 -z-10" />
        </motion.div>
      </div>
    </section>
  );
};
