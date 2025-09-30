"use client";
import { Button } from "@/components/ui/button";
import { usePublicRoute } from "@/hooks/useAuthGuard";
import { getGetStartedUrl } from "@/lib/auth/redirects";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const CTA: React.FC = () => {
  const { isAuthenticated, isLoading, user } = usePublicRoute();
  const pathname = usePathname();

  const getStartedUrl = getGetStartedUrl(isAuthenticated, pathname, user?.role);
  return (
    <section
      id="pricing"
      className="py-32 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/12 via-chart-1/8 to-background" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/20),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_80%,theme(colors.chart-1/15),transparent_50%)]" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-sm p-12 md:p-16 shadow-2xl hover:shadow-3xl transition-all duration-500"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight relative"
          >
            Start accelerating your{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              research workflow
            </span>{" "}
            today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 text-muted-foreground max-w-2xl mx-auto relative"
          >
            Free during early access. Pricing tiers (Individual, Team, Lab)
            coming soon.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 relative"
          >
            <Button
              asChild
              size="lg"
              className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
              loading={isLoading}
              loadingText="Loading..."
            >
              <Link href={getStartedUrl}>
                {isAuthenticated ? "Go to Dashboard →" : "Get Started →"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/faq">FAQs</Link>
            </Button>
          </motion.div>

          <div className="absolute -inset-x-4 -bottom-8 h-16 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};
