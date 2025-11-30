"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Building2,
  Check,
  Globe,
  Headphones,
  Lock,
  Rocket,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface EnterprisePageProps {
  onNavigate?: (path: string) => void;
}

export function EnterprisePage({ onNavigate }: EnterprisePageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Building2 className="h-4 w-4" />
                  Enterprise Solutions
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  Research at enterprise scale
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Power your institution with advanced security, dedicated
                  support, and custom integrations for teams of any size.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Request Demo
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/company/contact")}
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    Contact Sales
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
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">
                        Trusted by leading institutions
                      </h3>
                      <p className="text-muted-foreground">
                        5,000+ organizations worldwide
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl font-bold text-primary mb-1">
                          99.99%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Uptime SLA
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-1/5">
                        <div className="text-3xl font-bold text-chart-1 mb-1">
                          SOC 2
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Certified
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-2/5">
                        <div className="text-3xl font-bold text-chart-2 mb-1">
                          24/7
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Support
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-3/5">
                        <div className="text-3xl font-bold text-chart-3 mb-1">
                          GDPR
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Compliant
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
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
                Enterprise-grade features
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything your institution needs to manage research at scale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Advanced Security",
                  description:
                    "SSO, SAML 2.0, encryption at rest and in transit, and comprehensive audit logs.",
                  color: "primary",
                },
                {
                  icon: Users,
                  title: "Team Management",
                  description:
                    "Granular permissions, department organization, and centralized administration.",
                  color: "chart-1",
                },
                {
                  icon: Zap,
                  title: "Custom Integrations",
                  description:
                    "Connect with your existing tools via API, webhooks, and pre-built connectors.",
                  color: "chart-2",
                },
                {
                  icon: Lock,
                  title: "Data Governance",
                  description:
                    "Data residency options, retention policies, and compliance controls.",
                  color: "chart-3",
                },
                {
                  icon: Headphones,
                  title: "Dedicated Support",
                  description:
                    "24/7 priority support, dedicated customer success manager, and SLA guarantees.",
                  color: "chart-4",
                },
                {
                  icon: Globe,
                  title: "Global Infrastructure",
                  description:
                    "Multi-region deployment, CDN acceleration, and 99.99% uptime guarantee.",
                  color: "chart-5",
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

        {/* Pricing Tiers */}
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
                Enterprise Plans
              </h2>
              <p className="text-xl text-muted-foreground">
                Flexible pricing for organizations of all sizes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Team",
                  price: "$49",
                  period: "per user/month",
                  description: "For growing research teams",
                  features: [
                    "Up to 50 team members",
                    "SSO authentication",
                    "Priority support",
                    "Advanced analytics",
                    "API access",
                  ],
                  color: "primary",
                  popular: false,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "contact sales",
                  description: "For large institutions",
                  features: [
                    "Unlimited team members",
                    "SAML 2.0 SSO",
                    "24/7 dedicated support",
                    "Custom integrations",
                    "Data residency options",
                    "Dedicated account manager",
                  ],
                  color: "chart-1",
                  popular: true,
                },
                {
                  name: "Academic",
                  price: "Special",
                  period: "academic pricing",
                  description: "For universities & research institutions",
                  features: [
                    "Institution-wide licensing",
                    "Student discounts",
                    "Library integration",
                    "Research compliance tools",
                    "Grant reporting features",
                  ],
                  color: "chart-2",
                  popular: false,
                },
              ].map(
                (
                  {
                    name,
                    price,
                    period,
                    description,
                    features,
                    color,
                    popular,
                  },
                  index
                ) => (
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
                        <div className="mb-4">
                          <span className="text-4xl font-bold">{price}</span>
                          <span className="text-muted-foreground ml-2">
                            {period}
                          </span>
                        </div>
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
                          {price === "Custom" || price === "Special"
                            ? "Contact Sales"
                            : "Start Free Trial"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
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
                Ready to scale your research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Schedule a demo and see how ScholarFlow can transform your
                institution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Request Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/pricing")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  View All Plans
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
