"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Folder,
  Rocket,
  Settings,
  Shield,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface TeamsPageProps {
  onNavigate?: (path: string) => void;
}

export function TeamsPage({ onNavigate }: TeamsPageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-sm font-medium mb-6">
                  <Users className="h-4 w-4" />
                  Team Management
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Manage teams of any size
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Organize departments, control permissions, and scale your
                  research organization with powerful team management tools.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/company/contact")}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
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
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-1/10">
                          <Building2 className="h-6 w-6 text-chart-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Department Organization
                          </h3>
                          <p className="text-muted-foreground">
                            Structure teams by department, project, or research
                            focus.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Shield className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Granular Permissions
                          </h3>
                          <p className="text-muted-foreground">
                            Control access at the user, team, and resource
                            level.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <BarChart3 className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Usage Analytics
                          </h3>
                          <p className="text-muted-foreground">
                            Track adoption, engagement, and research output
                            metrics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Features */}
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
                Built for team collaboration
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tools designed to help teams work together effectively.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: UserPlus,
                  title: "Easy Onboarding",
                  description:
                    "Invite team members with one click. SSO integration for seamless access.",
                  color: "primary",
                },
                {
                  icon: Folder,
                  title: "Shared Collections",
                  description:
                    "Create team collections that everyone can access and contribute to.",
                  color: "chart-1",
                },
                {
                  icon: Shield,
                  title: "Role-Based Access",
                  description:
                    "Define roles with specific permissions for different team members.",
                  color: "chart-2",
                },
                {
                  icon: Settings,
                  title: "Admin Controls",
                  description:
                    "Centralized dashboard for managing users, settings, and compliance.",
                  color: "chart-3",
                },
                {
                  icon: BarChart3,
                  title: "Team Analytics",
                  description:
                    "Track team activity, paper contributions, and collaboration patterns.",
                  color: "chart-4",
                },
                {
                  icon: Zap,
                  title: "Automation",
                  description:
                    "Automate workflows, paper assignments, and notification rules.",
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

        {/* Scale Section */}
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
                Scale with confidence
              </h2>
              <p className="text-xl text-muted-foreground">
                From small teams to entire institutions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  size: "Small Teams",
                  users: "5-20 users",
                  description:
                    "Perfect for research groups and small departments. Easy setup, instant collaboration.",
                  features: [
                    "Shared collections",
                    "Basic analytics",
                    "Email support",
                  ],
                  color: "primary",
                },
                {
                  size: "Growing Organizations",
                  users: "20-200 users",
                  description:
                    "For departments and mid-sized institutions. Advanced controls and integrations.",
                  features: [
                    "Multiple departments",
                    "SSO authentication",
                    "Priority support",
                  ],
                  color: "chart-1",
                },
                {
                  size: "Enterprise",
                  users: "200+ users",
                  description:
                    "Full-scale deployment for universities and large research organizations.",
                  features: [
                    "Unlimited departments",
                    "Custom integrations",
                    "Dedicated success manager",
                  ],
                  color: "chart-2",
                },
              ].map(({ size, users, description, features, color }, index) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`text-sm font-medium text-${color} mb-2`}>
                        {users}
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{size}</h3>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ArrowRight className={`h-4 w-4 text-${color}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                      >
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                Ready to empower your team?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start a free trial and see how ScholarFlow transforms team
                collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
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
