"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Play,
  Rocket,
  Search,
  Video,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface TutorialsPageProps {
  onNavigate?: (path: string) => void;
}

export function TutorialsPage({ onNavigate }: TutorialsPageProps) {
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
                  <HelpCircle className="h-4 w-4" />
                  Learning Center
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  Master research workflows
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Step-by-step tutorials, video guides, and interactive lessons
                  to help you become a ScholarFlow power user.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/resources/docs")}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    View Documentation
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
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Video Tutorials
                          </h3>
                          <p className="text-muted-foreground">
                            Watch and learn with our comprehensive video
                            library.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-1/10">
                          <BookOpen className="h-6 w-6 text-chart-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Interactive Guides
                          </h3>
                          <p className="text-muted-foreground">
                            Learn by doing with hands-on, step-by-step
                            tutorials.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Zap className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Pro Tips</h3>
                          <p className="text-muted-foreground">
                            Advanced techniques and shortcuts from expert users.
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

        {/* Tutorial Categories */}
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
                Learn at your own pace
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From beginner basics to advanced research techniques, we have
                tutorials for every skill level.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Rocket,
                  title: "Getting Started",
                  description:
                    "First steps with ScholarFlow: account setup, uploading papers, and basic navigation.",
                  duration: "15 min",
                  lessons: 5,
                  level: "Beginner",
                  color: "primary",
                },
                {
                  icon: Search,
                  title: "Advanced Search",
                  description:
                    "Master search filters, boolean operators, and semantic search for better discovery.",
                  duration: "25 min",
                  lessons: 8,
                  level: "Intermediate",
                  color: "chart-1",
                },
                {
                  icon: BookOpen,
                  title: "Collections & Organization",
                  description:
                    "Create collections, tag papers, and set up collaborative research spaces.",
                  duration: "20 min",
                  lessons: 6,
                  level: "Beginner",
                  color: "chart-2",
                },
                {
                  icon: Zap,
                  title: "AI-Powered Features",
                  description:
                    "Leverage AI summaries, insights, and recommendations to accelerate research.",
                  duration: "30 min",
                  lessons: 10,
                  level: "Intermediate",
                  color: "chart-3",
                },
                {
                  icon: Video,
                  title: "Team Collaboration",
                  description:
                    "Share research, manage team permissions, and collaborate effectively.",
                  duration: "35 min",
                  lessons: 12,
                  level: "Advanced",
                  color: "chart-4",
                },
                {
                  icon: HelpCircle,
                  title: "API Integration",
                  description:
                    "Build custom integrations and automate workflows with our REST API.",
                  duration: "45 min",
                  lessons: 15,
                  level: "Advanced",
                  color: "chart-5",
                },
              ].map(
                (
                  {
                    icon: Icon,
                    title,
                    description,
                    duration,
                    lessons,
                    level,
                    color,
                  },
                  index
                ) => (
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
                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full bg-${color}/10 text-${color} font-medium`}
                          >
                            {level}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {duration} • {lessons} lessons
                          </span>
                        </div>
                        <h3 className="font-semibold text-xl mb-2">{title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                        >
                          Start Tutorial <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Popular Tutorials */}
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
                Most popular tutorials
              </h2>
              <p className="text-xl text-muted-foreground">
                Top-rated tutorials from our community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Upload Your First Research Paper",
                  description:
                    "Learn how to upload PDFs, extract metadata, and organize your first paper.",
                  duration: "8 min",
                  rating: "4.9",
                  views: "12.5k",
                },
                {
                  title: "Create Smart Collections",
                  description:
                    "Set up collections with auto-tagging and smart filtering rules.",
                  duration: "12 min",
                  rating: "4.8",
                  views: "8.2k",
                },
                {
                  title: "AI Summary Generation",
                  description:
                    "Generate and customize AI-powered summaries for faster comprehension.",
                  duration: "15 min",
                  rating: "4.9",
                  views: "15.1k",
                },
                {
                  title: "Collaborative Research Spaces",
                  description:
                    "Set up team workspaces and manage collaborative research projects.",
                  duration: "20 min",
                  rating: "4.7",
                  views: "6.8k",
                },
              ].map(
                ({ title, description, duration, rating, views }, index) => (
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
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                            {title}
                          </h3>
                          <Play className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>{duration}</span>
                          <div className="flex items-center gap-4">
                            <span>⭐ {rating}</span>
                            <span>{views} views</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
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
                Ready to become a power user?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start with our beginner tutorials and work your way up to
                advanced techniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/resources/community")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Join Community
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
