"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Image,
  Mail,
  Newspaper,
  Rocket,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface PressPageProps {
  onNavigate?: (path: string) => void;
}

export function PressPage({ onNavigate }: PressPageProps) {
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium mb-6">
                <Newspaper className="h-4 w-4" />
                Press & Media
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent mb-6">
                ScholarFlow in the news
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Latest announcements, press releases, and media coverage about
                ScholarFlow&apos;s mission to transform research.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Press Team
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Latest Press Releases */}
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
                Latest Press Releases
              </h2>
              <p className="text-xl text-muted-foreground">
                Official announcements from ScholarFlow
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  date: "September 15, 2025",
                  title:
                    "ScholarFlow Raises $25M Series B to Expand AI Research Tools",
                  excerpt:
                    "Funding will accelerate development of AI-powered features and global expansion.",
                  category: "Funding",
                },
                {
                  date: "August 28, 2025",
                  title:
                    "ScholarFlow Partners with Leading Universities Worldwide",
                  excerpt:
                    "Partnership brings AI-powered research tools to over 50 universities across 20 countries.",
                  category: "Partnership",
                },
                {
                  date: "July 10, 2025",
                  title:
                    "Introducing ScholarFlow Enterprise: Research at Scale",
                  excerpt:
                    "New enterprise tier offers advanced features for large research institutions.",
                  category: "Product",
                },
                {
                  date: "June 5, 2025",
                  title:
                    "ScholarFlow Reaches 100,000 Active Researchers Milestone",
                  excerpt:
                    "Platform growth highlights demand for intelligent research management tools.",
                  category: "Milestone",
                },
              ].map(({ date, title, excerpt, category }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              {category}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {date}
                            </span>
                          </div>
                          <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors duration-200">
                            {title}
                          </h3>
                          <p className="text-muted-foreground">{excerpt}</p>
                        </div>
                        <Button variant="ghost" className="shrink-0">
                          Read More <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Coverage */}
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
                Media Coverage
              </h2>
              <p className="text-xl text-muted-foreground">
                What others are saying about ScholarFlow
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  source: "TechCrunch",
                  title: "ScholarFlow is Revolutionizing Academic Research",
                  quote:
                    "The platform combines AI intelligence with researcher-friendly design...",
                },
                {
                  source: "Nature",
                  title: "AI Tools That Scientists Actually Use",
                  quote:
                    "ScholarFlow stands out for its intuitive approach to research management...",
                },
                {
                  source: "Forbes",
                  title: "Top 10 EdTech Startups to Watch in 2025",
                  quote:
                    "ScholarFlow's innovative approach puts it at the forefront of research tech...",
                },
              ].map(({ source, title, quote }, index) => (
                <motion.div
                  key={source}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-lg">{source}</span>
                      </div>
                      <h3 className="font-medium mb-3 group-hover:text-primary transition-colors duration-200">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground italic mb-4">
                        &quot;{quote}&quot;
                      </p>
                      <Button variant="ghost" size="sm">
                        Read Article <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
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
                Awards & Recognition
              </h2>
              <p className="text-xl text-muted-foreground">
                Honored by industry leaders
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Trophy,
                  title: "Best EdTech Startup",
                  org: "TechCrunch Disrupt 2025",
                  color: "primary",
                },
                {
                  icon: Award,
                  title: "Innovation Award",
                  org: "Research Tools Summit",
                  color: "chart-1",
                },
                {
                  icon: Trophy,
                  title: "Top 50 AI Companies",
                  org: "CB Insights 2025",
                  color: "chart-2",
                },
                {
                  icon: Award,
                  title: "Best UX Design",
                  org: "Product Hunt",
                  color: "chart-3",
                },
              ].map(({ icon: Icon, title, org, color }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className={`h-8 w-8 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{org}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Media Kit
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Download our press kit for logos, screenshots, and brand
                  guidelines.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Press Kit
                  </Button>
                  <Button size="lg" variant="outline">
                    <Image className="h-5 w-5 mr-2" />
                    Brand Guidelines
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h3 className="font-semibold text-xl mb-6">
                      Press Contact
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>press@scholarflow.io</span>
                      </div>
                      <p className="text-muted-foreground">
                        For press inquiries, interviews, or speaking requests,
                        please reach out to our communications team.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate?.("/company/contact")}
                      >
                        Contact Us <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
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
                Experience ScholarFlow yourself
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the platform that&apos;s transforming how researchers work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/login")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/company/about")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  About Us
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
