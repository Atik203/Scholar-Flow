"use client";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";

interface HeroProps {
  onNavigate?: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
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

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("/login");
    }
  };

  const handleHowItWorks = () => {
    if (onNavigate) {
      onNavigate("/how-it-works");
    }
  };

  return (
    <section
      className="relative pt-32 pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,white,transparent_75%)] bg-gradient-to-br from-primary/12 via-[var(--chart-1)]/8 to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,var(--primary)_0%,transparent_50%)] opacity-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,var(--chart-1)_0%,transparent_50%)] opacity-8" />

      {/* Animated grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(circle_at_center,white,transparent_70%)] opacity-10" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-20">
          <motion.div
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Collaborate Smarter on{" "}
              <span className="bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent relative">
                Research
                <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-primary/10 via-[var(--chart-1)]/10 to-transparent blur-2xl -z-10" />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            ScholarFlow centralizes your papers, semantic search, AI summaries,
            annotations, and collection sharing so your literature review
            accelerates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="gradient"
              className="shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="backdrop-blur border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              onClick={handleHowItWorks}
            >
              How it Works
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-18"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group relative p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background hover:border-success/40 transition-all duration-300 hover:shadow-lg hover:shadow-success/10"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success mb-4 group-hover:bg-success/20 transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="relative mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-b from-muted/50 via-background/80 to-background p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Trusted by Researchers Worldwide
            </h2>
            <p className="text-muted-foreground">
              Join thousands of researchers who have transformed their workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-center"
              >
                <div
                  className={`text-3xl md:text-4xl font-bold mb-1 ${
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
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-border/20">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">
                  99.9% Uptime
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-info" />
                <span className="text-sm text-muted-foreground">
                  Enterprise Security
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-12 mx-auto h-20 w-[70%] blur-3xl rounded-full bg-gradient-to-r from-primary/30 via-[var(--chart-1)]/20 to-primary/30 -z-10" />
        </motion.div>
      </div>
    </section>
  );
};
