"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export const CTA: React.FC = () => {
  return (
    <section
      id="pricing"
      className="py-32 relative"
      aria-labelledby="cta-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-radial from-primary/15 via-background to-background" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Start accelerating your research workflow today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-6 text-muted-foreground max-w-2xl mx-auto"
        >
          Free during early access. Pricing tiers (Individual, Team, Lab) coming
          soon.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow hover:shadow-lg transition-shadow"
          >
            Launch App →
          </Link>
          <a
            href="#faq"
            className="inline-flex items-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            FAQs
          </a>
        </motion.div>
      </div>
    </section>
  );
};
