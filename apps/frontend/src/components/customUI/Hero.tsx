"use client";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { usePublicRoute } from "@/hooks/useAuthGuard";
import { getGetStartedUrl } from "@/lib/auth/redirects";
import { Typography, TypographyComponents } from "@/lib/typography";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated, isLoading } = usePublicRoute();
  const pathname = usePathname();

  const getStartedUrl = getGetStartedUrl(isAuthenticated, pathname);

  const features = [
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find papers by meaning, not just keywords",
    },
    {
      icon: FileText,
      title: "Smart Collections",
      description: "Organize research with AI-powered insights",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work together seamlessly with your team",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Get instant summaries and key insights",
    },
  ];

  const stats = [
    { number: "10K+", label: "Research Papers" },
    { number: "5K+", label: "Active Users" },
    { number: "500+", label: "Collections" },
    { number: "99%", label: "Uptime" },
  ];

  return (
    <section
      className="relative pt-32 pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,white,transparent_75%)] bg-gradient-to-br from-primary/12 via-chart-1/8 to-background" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,theme(colors.primary/10),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,theme(colors.chart-1/8),transparent_50%)]" />

      {/* Animated grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.border/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border/10)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]" />

      <PageContainer>
        {/* Main Hero Content */}
        <div className="text-center mb-20">
          <motion.div
            id="hero-heading"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <TypographyComponents.H1 className="text-4xl sm:text-5xl md:text-6xl">
              Collaborate Smarter on{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent relative">
                Research
                <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-primary/10 via-chart-1/10 to-transparent blur-2xl -z-10" />
              </span>
            </TypographyComponents.H1>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          >
            <Typography variant="lead" className="mt-6 mx-auto max-w-2xl">
              ScholarFlow centralizes your papers, semantic search, AI
              summaries, annotations, and collection sharing so your literature
              review accelerates.
            </Typography>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              variant="gradient"
              className="btn-hover-glow btn-shine btn-inner-glow shadow-xl hover:shadow-2xl transition-all duration-300"
              loading={isLoading}
              loadingText="Loading..."
            >
              <Link href={getStartedUrl}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-hover-glow btn-inner-glow backdrop-blur border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Link href="/how-it-works">How it Works</Link>
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-18"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group relative p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background hover:border-success/40 transition-all duration-300 hover:shadow-lg hover:shadow-success/10"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success mb-4 group-hover:bg-success/20 transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <TypographyComponents.H3 className="text-lg mb-2">
                {feature.title}
              </TypographyComponents.H3>
              <Typography
                variant="small"
                className="text-muted-foreground leading-relaxed"
              >
                {feature.description}
              </Typography>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="relative mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500"
        >
          <div className="text-center mb-8">
            <TypographyComponents.H2 className="text-2xl md:text-3xl mb-2">
              Trusted by Researchers Worldwide
            </TypographyComponents.H2>
            <Typography variant="muted">
              Join thousands of researchers who have transformed their workflow
            </Typography>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }
                }
                whileInView={
                  prefersReducedMotion ? {} : { opacity: 1, scale: 1 }
                }
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-center"
              >
                <Typography
                  variant="h4"
                  className={`text-3xl md:text-4xl mb-1 ${
                    index === 0
                      ? "text-info"
                      : index === 1
                        ? "text-success"
                        : index === 2
                          ? "text-warning"
                          : "text-primary"
                  }`}
                >
                  {stat.number}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  {stat.label}
                </Typography>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-border/20">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <Typography variant="small" className="text-muted-foreground">
                  99.9% Uptime
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-info" />
                <Typography variant="small" className="text-muted-foreground">
                  Enterprise Security
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-warning" />
                <Typography variant="small" className="text-muted-foreground">
                  24/7 Support
                </Typography>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-12 mx-auto h-20 w-[70%] blur-3xl rounded-full bg-gradient-to-r from-primary/30 via-chart-1/20 to-primary/30 -z-10" />
        </motion.div>
      </PageContainer>
    </section>
  );
};
