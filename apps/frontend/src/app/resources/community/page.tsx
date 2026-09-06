"use client";

import {
  ArrowRight,
  BookOpen,
  Heart,
  MessageSquare,
  Rocket,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResourcesCommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-4/10 text-chart-4 text-sm font-medium mb-6">
                  <Users className="h-4 w-4" />
                  Community Hub
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent">
                  Connect with fellow researchers
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Connect with researchers worldwide. Share knowledge, ask questions, and collaborate on groundbreaking discoveries.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-chart-4 to-chart-5 hover:opacity-90 text-primary-foreground"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Join Community
                    </Button>
                  </Link>
                  <Link href="/resources/docs">
                    <Button
                      size="lg"
                      variant="outline"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Browse Discussions
                    </Button>
                  </Link>
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
                      <div className="p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl font-bold text-primary mb-1">
                          50K+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active Members
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-1/5">
                        <div className="text-3xl font-bold text-chart-1 mb-1">
                          15K+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Discussions
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-2/5">
                        <div className="text-3xl font-bold text-chart-2 mb-1">
                          120+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Countries
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-chart-3/5">
                        <div className="text-3xl font-bold text-chart-3 mb-1">
                          2K+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Contributors
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

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
                Engage with the community
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Multiple ways to connect, learn, and contribute to the research community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Discussion Forums",
                  description: "Ask questions, share insights, and engage in research discussions with peers.",
                  stats: "5K+ weekly posts",
                  color: "primary",
                },
                {
                  icon: Trophy,
                  title: "Research Challenges",
                  description: "Participate in community challenges and compete with fellow researchers.",
                  stats: "Monthly competitions",
                  color: "chart-1",
                },
                {
                  icon: Star,
                  title: "Featured Papers",
                  description: "Discover trending research and community-curated paper collections.",
                  stats: "100+ papers/week",
                  color: "chart-2",
                },
                {
                  icon: Users,
                  title: "Research Groups",
                  description: "Join or create topic-specific groups to collaborate with like-minded researchers.",
                  stats: "500+ active groups",
                  color: "chart-3",
                },
                {
                  icon: Heart,
                  title: "Mentorship Program",
                  description: "Connect with experienced researchers for guidance and career development.",
                  stats: "200+ mentors",
                  color: "chart-4",
                },
                {
                  icon: BookOpen,
                  title: "Knowledge Base",
                  description: "Community-contributed guides, tutorials, and best practices.",
                  stats: "1K+ articles",
                  color: "chart-5",
                },
              ].map(({ icon: Icon, title, description, stats, color }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground mb-4">{description}</p>
                      <div className={`text-sm text-${color} font-medium`}>
                        {stats}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Community Stats
              </h2>
              <p className="text-xl text-muted-foreground">
                Our growing community of researchers and contributors
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "10K+", label: "Members", color: "primary" },
                { value: "500+", label: "Groups", color: "chart-1" },
                { value: "50+", label: "Events", color: "chart-2" },
                { value: "1K+", label: "Projects", color: "chart-3" },
              ].map(({ value, label, color }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={`p-6 rounded-2xl bg-${color}/5 border border-${color}/10 text-center`}>
                    <div className={`text-4xl font-bold text-${color}`}>{value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Ready to join the community?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with 50,000+ researchers and start collaborating today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-4 to-chart-5 hover:opacity-90 text-primary-foreground"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Join Now
                  </Button>
                </Link>
                <Link href="/resources/tutorials">
                  <Button
                    size="lg"
                    variant="outline"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
