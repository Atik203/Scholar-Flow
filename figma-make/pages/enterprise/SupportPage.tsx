"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Headphones,
  Mail,
  MessageSquare,
  Phone,
  Rocket,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface SupportPageProps {
  onNavigate?: (path: string) => void;
}

export function SupportPage({ onNavigate }: SupportPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium mb-6">
                  <Headphones className="h-4 w-4" />
                  Dedicated Support
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                  World-class support for your team
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Enterprise customers get priority access to our expert support
                  team with guaranteed response times and dedicated success
                  managers.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                    onClick={() => onNavigate?.("/company/contact")}
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/resources/docs")}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Documentation
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div className="p-4 rounded-lg bg-chart-3/5">
                        <div className="text-3xl font-bold text-chart-3 mb-1">
                          24/7
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Support Availability
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-4/5">
                        <div className="text-3xl font-bold text-chart-4 mb-1">
                          {"<15min"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Response Time
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl font-bold text-primary mb-1">
                          99.9%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Resolution Rate
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-1/5">
                        <div className="text-3xl font-bold text-chart-1 mb-1">
                          4.9/5
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Satisfaction Score
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support Channels */}
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
                Multiple support channels
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get help the way that works best for your team.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Live Chat",
                  description: "Instant help from our support team 24/7.",
                  response: "Immediate",
                  color: "primary",
                },
                {
                  icon: Phone,
                  title: "Phone Support",
                  description: "Direct line to senior support engineers.",
                  response: "Same day",
                  color: "chart-1",
                },
                {
                  icon: Mail,
                  title: "Email Support",
                  description: "Detailed support for complex issues.",
                  response: "< 4 hours",
                  color: "chart-2",
                },
                {
                  icon: Users,
                  title: "Dedicated CSM",
                  description: "Your personal customer success manager.",
                  response: "Scheduled",
                  color: "chart-3",
                },
              ].map(
                (
                  { icon: Icon, title, description, response, color },
                  index
                ) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                      <CardContent className="p-6">
                        <div
                          className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`h-8 w-8 text-${color}`} />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">{title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <div className={`text-sm font-medium text-${color}`}>
                          Response: {response}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Support Plans */}
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
                Enterprise Support Plans
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose the level of support your organization needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Standard",
                  description: "Essential support for growing teams",
                  features: [
                    "Email & chat support",
                    "< 8 hour response time",
                    "Knowledge base access",
                    "Community forums",
                    "Standard SLA",
                  ],
                  color: "primary",
                  popular: false,
                },
                {
                  name: "Priority",
                  description: "Enhanced support for mission-critical use",
                  features: [
                    "24/7 phone & chat support",
                    "< 2 hour response time",
                    "Dedicated support queue",
                    "Quarterly reviews",
                    "Priority bug fixes",
                    "99.9% uptime SLA",
                  ],
                  color: "chart-1",
                  popular: true,
                },
                {
                  name: "Premium",
                  description: "White-glove support for enterprises",
                  features: [
                    "All Priority features",
                    "< 15 min response time",
                    "Dedicated CSM",
                    "On-site training",
                    "Custom integrations support",
                    "99.99% uptime SLA",
                  ],
                  color: "chart-2",
                  popular: false,
                },
              ].map(
                ({ name, description, features, color, popular }, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card
                      className={`h-full relative ${popular ? "border-2 border-primary shadow-xl" : ""}`}
                    >
                      {popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className={`text-xl font-bold text-${color} mb-2`}>
                          {name}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {description}
                        </p>
                        <ul className="space-y-3 mb-6">
                          {features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2"
                            >
                              <Check className={`h-5 w-5 text-${color}`} />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full ${popular ? "bg-gradient-to-r from-primary to-chart-1 hover:opacity-90" : ""}`}
                          variant={popular ? "default" : "outline"}
                        >
                          Learn More <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* SLA Details */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Service Level Agreement
              </h2>
              <p className="text-xl text-muted-foreground">
                Our commitment to your success
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Response Times",
                  description:
                    "Guaranteed response within SLA based on severity.",
                  color: "primary",
                },
                {
                  icon: Zap,
                  title: "Resolution Priority",
                  description: "Critical issues escalated to senior engineers.",
                  color: "chart-1",
                },
                {
                  icon: Shield,
                  title: "Uptime Guarantee",
                  description:
                    "99.99% uptime with financial credits if missed.",
                  color: "chart-2",
                },
                {
                  icon: Users,
                  title: "Dedicated Resources",
                  description: "Named support contacts for your organization.",
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready for world-class support?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Talk to our team about enterprise support options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/company/contact")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Contact Sales
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/enterprise")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Enterprise Overview
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
