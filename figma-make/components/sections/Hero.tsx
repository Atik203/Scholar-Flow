"use client";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  GraduationCap,
  Microscope,
  Search,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface HeroProps {
  onNavigate?: (path: string) => void;
}

// Floating particle component
const FloatingParticle = ({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: number;
}) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-primary/30 to-chart-1/30 blur-sm"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Typing effect hook
const useTypewriter = (
  words: string[],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000
) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < word.length) {
            setCurrentText(word.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(word.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return currentText;
};

// Animated counter component with IntersectionObserver
const AnimatedCounter = ({
  target,
  suffix = "",
  duration = 2,
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(
      () => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(
            decimals > 0
              ? parseFloat(current.toFixed(decimals))
              : Math.floor(current)
          );
        }
      },
      (duration * 1000) / steps
    );

    return () => clearInterval(timer);
  }, [isVisible, target, duration, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const typedWord = useTypewriter(
    ["Research", "Discovery", "Innovation", "Collaboration"],
    120,
    80,
    2500
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find papers by meaning, not just keywords",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0,
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Get instant summaries and key insights",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: FileText,
      title: "Smart Collections",
      description: "Organize research with AI-powered insights",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work together seamlessly with your team",
      gradient: "from-orange-500 to-amber-500",
      delay: 0.3,
    },
  ];

  const stats = [
    {
      number: 50,
      suffix: "K+",
      label: "Research Papers",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      number: 12,
      suffix: "K+",
      label: "Active Researchers",
      icon: Users,
      color: "text-green-500",
    },
    {
      number: 3.5,
      suffix: "K+",
      label: "Collections Created",
      icon: FileText,
      color: "text-amber-500",
    },
    {
      number: 99.9,
      suffix: "%",
      label: "Uptime SLA",
      icon: Zap,
      color: "text-purple-500",
    },
  ];

  // University/Institution data with logos
  const trustedInstitutions = [
    { name: "MIT", fullName: "Massachusetts Institute of Technology" },
    { name: "Stanford", fullName: "Stanford University" },
    { name: "Harvard", fullName: "Harvard University" },
    { name: "Oxford", fullName: "University of Oxford" },
    { name: "Cambridge", fullName: "University of Cambridge" },
    { name: "Berkeley", fullName: "UC Berkeley" },
    { name: "Princeton", fullName: "Princeton University" },
    { name: "Yale", fullName: "Yale University" },
    { name: "Caltech", fullName: "California Institute of Technology" },
    { name: "ETH Zürich", fullName: "ETH Zürich" },
  ];

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("/register");
    }
  };

  const handleHowItWorks = () => {
    if (onNavigate) {
      onNavigate("/how-it-works");
    }
  };

  return (
    <section
      className="relative pt-28 pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-background to-background" />

      {/* Mouse-following gradient */}
      <motion.div
        className="pointer-events-none absolute -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 via-chart-1/15 to-purple-500/10 blur-3xl"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <FloatingParticle delay={0} duration={4} x="10%" y="20%" size={8} />
        <FloatingParticle delay={0.5} duration={5} x="85%" y="15%" size={12} />
        <FloatingParticle delay={1} duration={4.5} x="70%" y="60%" size={6} />
        <FloatingParticle
          delay={1.5}
          duration={5.5}
          x="20%"
          y="70%"
          size={10}
        />
        <FloatingParticle delay={2} duration={4} x="50%" y="30%" size={8} />
        <FloatingParticle delay={0.3} duration={6} x="90%" y="80%" size={14} />
        <FloatingParticle delay={1.2} duration={5} x="5%" y="50%" size={10} />
        <FloatingParticle delay={0.8} duration={4.5} x="40%" y="85%" size={8} />
      </div>

      {/* Animated grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)] opacity-20" />

      {/* Decorative orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl -z-10"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Announcement Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-chart-1/10 to-purple-500/10 border border-primary/20 backdrop-blur-sm cursor-pointer group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium">
              <span className="text-primary">New:</span> AI-powered paper
              summaries now available
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </motion.div>

        {/* Main Hero Content */}
        <div className="text-center mb-20">
          <motion.div
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Collaborate Smarter on{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {typedWord}
                </span>
                <motion.span
                  className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.span
                  className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-primary/20 via-chart-1/15 to-purple-500/20 blur-2xl -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="mt-8 mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            ScholarFlow centralizes your papers, semantic search, AI summaries,
            annotations, and collection sharing so your literature review
            accelerates —{" "}
            <span className="text-foreground font-medium">10x faster</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 px-8 py-6 text-lg group"
                onClick={handleGetStarted}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 px-8 py-6 text-lg"
                onClick={handleHowItWorks}
              >
                <Microscope className="h-5 w-5 mr-2" />
                See How it Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Trustpilot Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            {/* Trustpilot Badge */}
            <motion.div
              className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-card/80 to-card/60 border border-border/50 backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.6 + i * 0.08,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-6 h-6 bg-[#00B67A] flex items-center justify-center"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                      }}
                    >
                      <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  TrustScore <strong className="text-foreground">4.8</strong>
                </span>
              </div>

              <div className="h-10 w-px bg-border" />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#00B67A]">
                    Excellent
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Based on</span>
                  <span className="font-semibold text-foreground">
                    2,847 reviews
                  </span>
                  <svg className="h-4 w-auto" viewBox="0 0 126 31" fill="none">
                    <path d="M21.1 0H0v30.8h21.1V0z" fill="#00B67A" />
                    <path d="M52.1 0H31v30.8h21.1V0z" fill="#00B67A" />
                    <path d="M83.1 0H62v30.8h21.1V0z" fill="#00B67A" />
                    <path d="M114.1 0H93v30.8h21.1V0z" fill="#00B67A" />
                    <path
                      d="M10.5 21.3l-3.2 2.4 1.2-3.8-3.2-2.3h4l1.2-3.8 1.2 3.8h4l-3.2 2.3 1.2 3.8-3.2-2.4z"
                      fill="#fff"
                    />
                    <path
                      d="M41.5 21.3l-3.2 2.4 1.2-3.8-3.2-2.3h4l1.2-3.8 1.2 3.8h4l-3.2 2.3 1.2 3.8-3.2-2.4z"
                      fill="#fff"
                    />
                    <path
                      d="M72.5 21.3l-3.2 2.4 1.2-3.8-3.2-2.3h4l1.2-3.8 1.2 3.8h4l-3.2 2.3 1.2 3.8-3.2-2.4z"
                      fill="#fff"
                    />
                    <path
                      d="M103.5 21.3l-3.2 2.4 1.2-3.8-3.2-2.3h4l1.2-3.8 1.2 3.8h4l-3.2 2.3 1.2 3.8-3.2-2.4z"
                      fill="#fff"
                    />
                    <path d="M125.1 0H104v30.8h21.1V0z" fill="#DCDCE6" />
                    <path
                      d="M114.6 13.8l1.2 3.8h4l-3.2 2.3 1.2 3.8-3.2-2.4v-7.5z"
                      fill="#00B67A"
                    />
                    <path
                      d="M114.6 21.3l-3.2 2.4 1.2-3.8-3.2-2.3h4l1.2-3.8v7.5z"
                      fill="#fff"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Additional Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <motion.span
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </motion.span>
              <motion.span
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                14-day free trial
              </motion.span>
              <motion.span
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancel anytime
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 via-background/50 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
            >
              {/* Hover gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <motion.div
                className={`relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="h-4 w-4 text-primary" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mx-auto max-w-5xl rounded-3xl border border-border/50 bg-gradient-to-b from-muted/30 via-background/80 to-background backdrop-blur-md p-10 md:p-14 shadow-2xl overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-chart-1 to-purple-500" />

          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              <Zap className="h-4 w-4" />
              Trusted Platform
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
              Trusted by Researchers Worldwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of researchers who have transformed their workflow
              with ScholarFlow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 mb-3 ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <div
                  className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}
                >
                  <AnimatedCounter
                    target={stat.number}
                    suffix={stat.suffix}
                    decimals={
                      stat.label === "Uptime SLA" ||
                      stat.label === "Collections Created"
                        ? 1
                        : 0
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-10 pt-8 border-t border-border/30">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                {
                  icon: CheckCircle2,
                  text: "99.9% Uptime SLA",
                  color: "text-green-500",
                },
                {
                  icon: CheckCircle2,
                  text: "SOC 2 Certified",
                  color: "text-blue-500",
                },
                {
                  icon: CheckCircle2,
                  text: "24/7 Support",
                  color: "text-amber-500",
                },
                {
                  icon: CheckCircle2,
                  text: "GDPR Compliant",
                  color: "text-purple-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-2"
                >
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* University Logos - Infinite Marquee */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-center text-xs text-muted-foreground mb-6">
              TRUSTED BY RESEARCHERS FROM TOP INSTITUTIONS
            </p>

            {/* Marquee Container */}
            <div className="relative overflow-hidden">
              {/* Gradient Overlays for smooth fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              {/* Marquee Track */}
              <div className="flex animate-marquee">
                {/* First set of logos */}
                {[...trustedInstitutions, ...trustedInstitutions].map(
                  (institution, i) => (
                    <div
                      key={`${institution.name}-${i}`}
                      className="flex-shrink-0 mx-8 group"
                    >
                      <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-chart-1/20 transition-all">
                          <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                            {institution.name}
                          </div>
                          <div className="text-xs text-muted-foreground hidden sm:block">
                            {institution.fullName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute inset-x-0 -bottom-20 mx-auto h-32 w-[80%] blur-3xl rounded-full bg-gradient-to-r from-primary/20 via-chart-1/15 to-purple-500/20 -z-10" />
        </motion.div>
      </div>
    </section>
  );
};
