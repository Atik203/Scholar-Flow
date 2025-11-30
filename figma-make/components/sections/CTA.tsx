"use client";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Sparkles, Zap } from "lucide-react";
import React from "react";

interface CTAProps {
  onNavigate?: (path: string) => void;
}

export const CTA: React.FC<CTAProps> = ({ onNavigate }) => {
  const benefits = [
    "Unlimited paper uploads",
    "AI-powered summaries",
    "Team collaboration",
    "Priority support",
  ];

  return (
    <section
      id="pricing"
      className="py-32 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/12 via-chart-1/8 to-background" />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)] opacity-20"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_80%,var(--chart-1)_0%,transparent_50%)] opacity-15"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-primary/10 blur-xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-chart-1/10 blur-xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-gradient-to-b from-card/60 to-card/40 backdrop-blur-md p-12 md:p-16 shadow-2xl overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-1 to-purple-500" />

          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/5,transparent_70%)]" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-chart-1/10 border border-primary/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </motion.div>

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight relative"
          >
            Start accelerating your{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              research workflow
            </span>{" "}
            today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto relative"
          >
            Join 5,000+ researchers who have transformed their literature review
            process. Start free during our early access period.
          </motion.p>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 relative"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/register")}
              className="group relative inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-chart-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/faq")}
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 bg-background/50 backdrop-blur-sm text-foreground"
            >
              View FAQs
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </motion.div>

          {/* Bottom glow */}
          <div className="absolute -inset-x-4 -bottom-8 h-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};
