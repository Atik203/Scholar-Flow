"use client";

import { motion } from "motion/react";
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
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface CommunityPageProps {
  onNavigate?: (path: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-4/10 text-chart-4 text-sm font-medium mb-6">
                  <Users className="h-4 w-4" />
                  Community Hub
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent">
                  Join the research revolution
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Connect with researchers worldwide. Share knowledge, ask
                  questions, and collaborate on groundbreaking discoveries.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-4 to-chart-5 hover:opacity-90 text-primary-foreground"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Join Community
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/resources/docs")}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Discussions
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

        {/* Community Features */}
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
                Multiple ways to connect, learn, and contribute to the research
                community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Discussion Forums",
                  description:
                    "Ask questions, share insights, and engage in research discussions with peers.",
                  stats: "5K+ weekly posts",
                  color: "primary",
                },
                {
                  icon: Trophy,
                  title: "Research Challenges",
                  description:
                    "Participate in community challenges and compete with fellow researchers.",
                  stats: "Monthly competitions",
                  color: "chart-1",
                },
                {
                  icon: Star,
                  title: "Featured Papers",
                  description:
                    "Discover trending research and community-curated paper collections.",
                  stats: "100+ papers/week",
                  color: "chart-2",
                },
                {
                  icon: Users,
                  title: "Research Groups",
                  description:
                    "Join or create topic-specific groups to collaborate with like-minded researchers.",
                  stats: "500+ active groups",
                  color: "chart-3",
                },
                {
                  icon: Heart,
                  title: "Mentorship Program",
                  description:
                    "Connect with experienced researchers for guidance and career development.",
                  stats: "200+ mentors",
                  color: "chart-4",
                },
                {
                  icon: BookOpen,
                  title: "Knowledge Base",
                  description:
                    "Community-contributed guides, tutorials, and best practices.",
                  stats: "1K+ articles",
                  color: "chart-5",
                },
              ].map(
                ({ icon: Icon, title, description, stats, color }, index) => (
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
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <div className={`text-sm text-${color} font-medium`}>
                          {stats}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Recent Discussions */}
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
                Recent discussions
              </h2>
              <p className="text-xl text-muted-foreground">
                Join the conversation on trending topics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title:
                    "Best practices for organizing large paper collections?",
                  author: "Dr. Sarah Chen",
                  replies: 42,
                  views: "1.2k",
                  category: "Tips & Tricks",
                },
                {
                  title: "How to leverage AI summaries for literature reviews",
                  author: "Prof. Michael Brown",
                  replies: 38,
                  views: "980",
                  category: "AI Features",
                },
                {
                  title: "Introducing: New collaboration features for teams",
                  author: "ScholarFlow Team",
                  replies: 65,
                  views: "2.1k",
                  category: "Announcements",
                },
                {
                  title: "Research workflow automation with the API",
                  author: "Alex Kim",
                  replies: 28,
                  views: "750",
                  category: "API & Integrations",
                },
              ].map(({ title, author, replies, views, category }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {category}
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                        {title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>by {author}</span>
                        <div className="flex items-center gap-4">
                          <span>{replies} replies</span>
                          <span>{views} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Discussions <ArrowRight className="h-4 w-4 ml-2" />
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
                Ready to join the community?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with 50,000+ researchers and start collaborating today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-4 to-chart-5 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Join Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/resources/tutorials")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn More
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
