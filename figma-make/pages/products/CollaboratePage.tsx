"use client";

import {
  ArrowRight,
  Calendar,
  GitBranch,
  Globe,
  MessageSquare,
  Rocket,
  Share2,
  Target,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardWithVariants } from "../../components/ui/card";

interface CollaboratePageProps {
  onNavigate?: (path: string) => void;
}

export function CollaboratePage({ onNavigate }: CollaboratePageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 text-chart-2 text-sm font-medium mb-6">
                  <Users className="h-4 w-4" />
                  Collaboration Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
                  Research together, achieve more
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Connect researchers worldwide. Collaborate on projects, share
                  insights, and accelerate discovery through seamless teamwork.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-2 to-chart-3 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                    onClick={() => onNavigate?.("/login")}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start collaborating
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-hover-glow"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Watch demo
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
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Users className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Team Workspaces
                          </h3>
                          <p className="text-muted-foreground">
                            Private or public workspaces with role-based access
                            and project management.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <MessageSquare className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Real-time Communication
                          </h3>
                          <p className="text-muted-foreground">
                            Built-in chat, video calls, and annotation
                            discussions for seamless collaboration.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-4/10">
                          <GitBranch className="h-6 w-6 text-chart-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Version Control
                          </h3>
                          <p className="text-muted-foreground">
                            Track changes, manage paper versions, and maintain
                            research integrity.
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

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Collaboration without barriers
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From local teams to global consortiums, enable seamless research
                collaboration at any scale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Project Teams",
                  description:
                    "Create dedicated spaces for grants, papers, or long-term research initiatives with full member management.",
                  color: "chart-2",
                },
                {
                  icon: MessageSquare,
                  title: "Integrated Communication",
                  description:
                    "Chat, video calls, annotation comments, and discussion threads all in one platform.",
                  color: "chart-3",
                },
                {
                  icon: Share2,
                  title: "Knowledge Sharing",
                  description:
                    "Share libraries, exchange insights, and build on each other's work with proper attribution.",
                  color: "chart-4",
                },
                {
                  icon: Calendar,
                  title: "Project Management",
                  description:
                    "Track milestones, assign tasks, set deadlines, and monitor progress across all research activities.",
                  color: "chart-5",
                },
                {
                  icon: Globe,
                  title: "Global Networking",
                  description:
                    "Connect with researchers worldwide, discover collaborators, and join international projects.",
                  color: "primary",
                },
                {
                  icon: Zap,
                  title: "Real-time Sync",
                  description:
                    "Instant updates across all devices, automatic conflict resolution, and seamless offline access.",
                  color: "chart-1",
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
                    className="h-full group"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`p-3 rounded-lg bg-${color}/10 mb-4 w-fit group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration Types */}
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
                Every type of research collaboration
              </h2>
              <p className="text-xl text-muted-foreground">
                From peer review to multi-institutional projects
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Academic Research Groups",
                  description:
                    "Perfect for lab teams, PhD cohorts, and departmental research initiatives.",
                  features: [
                    "Mentor-student workflows",
                    "Group annotations",
                    "Shared bibliographies",
                  ],
                },
                {
                  title: "Multi-Institutional Projects",
                  description:
                    "Seamless collaboration across universities, countries, and time zones.",
                  features: [
                    "Cross-institution access",
                    "Federated authentication",
                    "Compliance-ready",
                  ],
                },
                {
                  title: "Industry-Academia Partnerships",
                  description:
                    "Bridge the gap between academic research and industry applications.",
                  features: [
                    "IP protection options",
                    "Controlled sharing",
                    "NDA workflows",
                  ],
                },
                {
                  title: "Open Science Initiatives",
                  description:
                    "Support open access, preprint sharing, and transparent research practices.",
                  features: [
                    "Public collections",
                    "DOI integration",
                    "FAIR data principles",
                  ],
                },
              ].map(({ title, description, features }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <CardWithVariants
                    variant="elevated"
                    hover="glow"
                    className="h-full"
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Target className="h-4 w-4 text-chart-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </CardWithVariants>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to collaborate smarter?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join research teams around the world already using ScholarFlow
                for seamless collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-2 to-chart-3 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hover-glow"
                  onClick={() => onNavigate?.("/pricing")}
                >
                  View Pricing
                  <ArrowRight className="h-5 w-5 ml-2" />
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
