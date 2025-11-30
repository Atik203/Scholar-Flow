"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardWithVariants } from "../../components/ui/card";

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Our Story
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-6">
                Transforming how the world does research
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;re on a mission to democratize research and make
                scientific knowledge accessible to everyone, everywhere.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <CardWithVariants
                  variant="elevated"
                  hover="glow"
                  className="h-full border-2"
                >
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg text-muted-foreground">
                      To empower researchers, students, and knowledge workers
                      with intelligent tools that streamline their workflow,
                      enhance collaboration, and accelerate discovery.
                    </p>
                  </CardContent>
                </CardWithVariants>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <CardWithVariants
                  variant="elevated"
                  hover="glow"
                  className="h-full border-2"
                >
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-6">
                      <Lightbulb className="h-6 w-6 text-chart-1" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-lg text-muted-foreground">
                      A world where knowledge flows freely, where research
                      barriers are eliminated, and where every curious mind has
                      the tools to make groundbreaking discoveries.
                    </p>
                  </CardContent>
                </CardWithVariants>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Impact by numbers
              </h2>
              <p className="text-xl text-muted-foreground">
                Growing every day with researchers worldwide
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "100K+", label: "Researchers", color: "primary" },
                { value: "1M+", label: "Papers Managed", color: "chart-1" },
                { value: "120+", label: "Countries", color: "chart-2" },
                { value: "5K+", label: "Institutions", color: "chart-3" },
              ].map(({ value, label, color }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div
                    className={`text-4xl md:text-5xl font-bold text-${color} mb-2`}
                  >
                    {value}
                  </div>
                  <div className="text-muted-foreground">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "User First",
                  description:
                    "Every decision starts with how it impacts our users' research journey.",
                  color: "primary",
                },
                {
                  icon: Globe,
                  title: "Open Access",
                  description:
                    "We believe knowledge should be accessible to everyone, everywhere.",
                  color: "chart-1",
                },
                {
                  icon: Users,
                  title: "Collaboration",
                  description:
                    "The best discoveries happen when great minds work together.",
                  color: "chart-2",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description:
                    "We strive for the highest quality in everything we build.",
                  color: "chart-3",
                },
              ].map(({ icon: Icon, title, description, color }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <CardWithVariants
                    variant="interactive"
                    hover="lift"
                    className="h-full text-center"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className={`h-8 w-8 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground">
                Passionate people building the future of research
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Dr. Sarah Chen",
                  role: "CEO & Co-Founder",
                  color: "primary",
                },
                {
                  name: "Prof. Michael Brown",
                  role: "CTO & Co-Founder",
                  color: "chart-1",
                },
                {
                  name: "Dr. Emily Zhang",
                  role: "Head of AI",
                  color: "chart-2",
                },
                { name: "Alex Kim", role: "Head of Product", color: "chart-3" },
              ].map(({ name, role, color }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
                    <CardContent className="p-6">
                      <div
                        className={`w-20 h-20 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Users className={`h-10 w-10 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-lg">{name}</h3>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="btn-hover-glow"
                onClick={() => onNavigate?.("/company/careers")}
              >
                Join Our Team <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30 text-center">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of researchers already using ScholarFlow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hover-glow"
                  onClick={() => onNavigate?.("/company/contact")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
