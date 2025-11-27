"use client";

import {
  ArrowRight,
  BookOpen,
  FolderOpen,
  Globe,
  Lock,
  Rocket,
  Share2,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardWithVariants } from "../../components/ui/card";

interface CollectionsPageProps {
  onNavigate?: (path: string) => void;
}

export function CollectionsPage({ onNavigate }: CollectionsPageProps) {
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
                  <BookOpen className="h-4 w-4" />
                  Collections Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Organize research that matters
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Create smart collections, collaborate with teams, and share
                  knowledge. Turn scattered papers into organized, actionable
                  research libraries.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
                    onClick={() => onNavigate?.("/login")}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Create collections
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-hover-glow"
                  >
                    <FolderOpen className="h-5 w-5 mr-2" />
                    Explore examples
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
                          <BookOpen className="h-6 w-6 text-chart-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Smart Collections
                          </h3>
                          <p className="text-muted-foreground">
                            Auto-organize papers by topic, author, or custom
                            criteria with AI assistance.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Users className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Team Collaboration
                          </h3>
                          <p className="text-muted-foreground">
                            Share collections, assign reading lists, and
                            collaborate in real-time.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <Share2 className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Public Sharing
                          </h3>
                          <p className="text-muted-foreground">
                            Make collections discoverable or keep them private
                            with granular permissions.
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
                Collections that work like your brain
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Intuitive organization meets powerful collaboration. Create
                structure from chaos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FolderOpen,
                  title: "Flexible Organization",
                  description:
                    "Nested folders, tags, custom metadata, and AI-suggested categorization for any workflow.",
                  color: "chart-1",
                },
                {
                  icon: Users,
                  title: "Team Workspaces",
                  description:
                    "Shared collections with role-based permissions, commenting, and collaborative annotations.",
                  color: "chart-2",
                },
                {
                  icon: Tag,
                  title: "Smart Tagging",
                  description:
                    "Auto-generated tags, custom taxonomies, and cross-collection search and filtering.",
                  color: "chart-3",
                },
                {
                  icon: Globe,
                  title: "Public Discovery",
                  description:
                    "Share your collections publicly, discover others' work, and build academic networks.",
                  color: "chart-4",
                },
                {
                  icon: Lock,
                  title: "Privacy Controls",
                  description:
                    "Granular permissions: private, team-only, institution-wide, or fully public collections.",
                  color: "chart-5",
                },
                {
                  icon: Zap,
                  title: "Live Updates",
                  description:
                    "Real-time sync across devices, automated paper recommendations, and smart notifications.",
                  color: "primary",
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

        {/* Collection Types */}
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
                Collections for every purpose
              </h2>
              <p className="text-xl text-muted-foreground">
                From literature reviews to reading lists, organize research your
                way
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Literature Reviews",
                  description:
                    "Comprehensive collections for systematic reviews with built-in screening workflows.",
                  features: [
                    "Inclusion/exclusion tracking",
                    "PRISMA flow diagrams",
                    "Quality assessment tools",
                  ],
                },
                {
                  title: "Reading Lists",
                  description:
                    "Curated lists for courses, seminars, or personal learning journeys.",
                  features: [
                    "Progress tracking",
                    "Note integration",
                    "Shareable links",
                  ],
                },
                {
                  title: "Project Libraries",
                  description:
                    "Organized collections for specific research projects or grant applications.",
                  features: [
                    "Multi-author support",
                    "Version history",
                    "Export to bibliographies",
                  ],
                },
                {
                  title: "Public Portfolios",
                  description:
                    "Showcase your research interests and expertise to the academic community.",
                  features: [
                    "Public profiles",
                    "Follower system",
                    "Research networking",
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
                            <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
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
                Ready to organize your research?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create your first collection in seconds and start building your
                research library.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground btn-hover-glow btn-shine"
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
