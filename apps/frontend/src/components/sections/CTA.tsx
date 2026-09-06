"use client";

import { ArrowRight, LayoutDashboard, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/redux/auth/useAuth";

export const CTA: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const ctaHref = isAuthenticated
    ? user?.onboardingCompleted
      ? "/dashboard"
      : "/onboarding"
    : "/register";
  const ctaLabel = isAuthenticated
    ? user?.onboardingCompleted
      ? "Go to Dashboard"
      : "Finish Onboarding"
    : "Start Free Trial";
  const CtaIcon =
    isAuthenticated && user?.onboardingCompleted ? LayoutDashboard : Zap;
  const ctaSubtext = isAuthenticated
    ? user?.onboardingCompleted
      ? "Pick up where you left off. Your research workspace is ready."
      : "A few quick steps to personalize your experience."
    : "Join thousands of researchers who have transformed their workflow. Start your 14-day free trial today — no credit card required.";

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-1/10 to-purple-500/10" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_50%)] opacity-20"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <CtaIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {isAuthenticated ? "Welcome back" : "Ready to accelerate?"}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {isAuthenticated ? (
              <>
                Continue your{" "}
                <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
                  research
                </span>{" "}
                journey
              </>
            ) : (
              <>
                Start your research{" "}
                <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
                  revolution
                </span>
              </>
            )}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            {ctaSubtext}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 px-10 py-7 text-lg group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {ctaLabel}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href={isAuthenticated ? "/dashboard" : "/pricing"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 px-10 py-7 text-lg"
                >
                  {isAuthenticated ? "Open Dashboard" : "View Pricing"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
