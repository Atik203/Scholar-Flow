"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  Newspaper,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const pressReleases = [
  {
    title:
      "ScholarFlow Raises $50M Series B to Accelerate AI-Powered Research Tools",
    date: "2024-12-15",
    summary:
      "Led by Andreessen Horowitz with participation from Google Ventures, the funding will expand our AI research team and global reach.",
    category: "Funding",
    featured: true,
  },
  {
    title:
      "ScholarFlow Partners with MIT to Launch AI Research Assistant Program",
    date: "2024-11-22",
    summary:
      "Collaboration aims to develop next-generation AI tools specifically designed for academic research workflows.",
    category: "Partnership",
    featured: false,
  },
  {
    title:
      "ScholarFlow Launches Enterprise AI Platform for Research Institutions",
    date: "2024-10-08",
    summary:
      "New enterprise features include advanced security, custom integrations, and dedicated support for large research organizations.",
    category: "Product",
    featured: false,
  },
  {
    title: "ScholarFlow Reaches 100,000 Active Researchers Milestone",
    date: "2024-09-15",
    summary:
      "Platform now serves researchers from over 500 institutions across 40 countries, with 10M+ papers analyzed.",
    category: "Milestone",
    featured: false,
  },
];

const newsArticles = [
  {
    title: "How AI is Revolutionizing Academic Research",
    publication: "Nature",
    date: "2024-12-10",
    excerpt:
      "ScholarFlow's semantic search technology is helping researchers discover connections they never would have found manually...",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format",
  },
  {
    title: "The Future of Research Collaboration",
    publication: "Science Magazine",
    date: "2024-11-28",
    excerpt:
      "New tools are breaking down silos between research institutions and enabling global collaboration at unprecedented scale...",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop&auto=format",
  },
  {
    title: "Startup Spotlight: ScholarFlow",
    publication: "TechCrunch",
    date: "2024-11-15",
    excerpt:
      "Founded by researchers for researchers, ScholarFlow is solving real pain points in academic workflows...",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format",
  },
  {
    title: "AI Tools Transform Literature Reviews",
    publication: "IEEE Spectrum",
    date: "2024-10-30",
    excerpt:
      "Machine learning algorithms are reducing literature review time from weeks to hours while improving comprehensiveness...",
    url: "#",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop&auto=format",
  },
];

const awards = [
  {
    title: "Best AI Innovation in Research",
    organization: "AI Excellence Awards 2024",
    date: "2024",
    description:
      "Recognized for breakthrough semantic search technology in academic research.",
  },
  {
    title: "Top 100 EdTech Companies",
    organization: "EdTech Breakthrough",
    date: "2024",
    description:
      "Listed among the most innovative educational technology companies globally.",
  },
  {
    title: "Fast Company Most Innovative Companies",
    organization: "Fast Company",
    date: "2024",
    description:
      "Featured in the AI category for transforming research workflows.",
  },
  {
    title: "Y Combinator Top Company",
    organization: "Y Combinator",
    date: "2023",
    description:
      "Graduated from the world's most prestigious startup accelerator program.",
  },
];

const mediaKit = [
  {
    title: "Company Logos",
    description: "High-resolution logos in various formats",
    type: "ZIP",
    size: "2.4 MB",
  },
  {
    title: "Product Screenshots",
    description: "Latest product interface screenshots",
    type: "ZIP",
    size: "15.8 MB",
  },
  {
    title: "Executive Photos",
    description: "Professional headshots of leadership team",
    type: "ZIP",
    size: "8.2 MB",
  },
  {
    title: "Fact Sheet",
    description: "Company overview and key statistics",
    type: "PDF",
    size: "890 KB",
  },
];

const stats = [
  { value: "100K+", label: "Active Users" },
  { value: "10M+", label: "Papers Analyzed" },
  { value: "500+", label: "Institutions" },
  { value: "40+", label: "Countries" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-1/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              Press &{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                News
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Latest news, announcements, and media coverage about ScholarFlow's
              mission to accelerate research and scientific discovery worldwide.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
              >
                <Link href="#press-releases">
                  <Newspaper className="mr-2 h-5 w-5" />
                  Latest Releases
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-4">
                <Link href="#media-kit">
                  <Download className="mr-2 h-5 w-5" />
                  Media Kit
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">
              ScholarFlow by the Numbers
            </h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section id="press-releases" className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Press Releases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Official company announcements and major updates
            </p>
          </motion.div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card
                  className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${release.featured ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge
                            variant={release.featured ? "default" : "secondary"}
                          >
                            {release.category}
                          </Badge>
                          {release.featured && (
                            <Badge className="bg-gradient-to-r from-primary to-chart-1">
                              Featured
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(release.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                          {release.title}
                        </h3>

                        <p className="text-muted-foreground mb-4">
                          {release.summary}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button variant="outline" className="whitespace-nowrap">
                          <FileText className="mr-2 h-4 w-4" />
                          Read Full Release
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              In the News
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What the media is saying about ScholarFlow and the future of
              research
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{article.publication}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      Read full article
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Awards & Recognition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry recognition for our innovation in research technology
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {award.title}
                        </h3>
                        <p className="text-primary font-medium mb-2">
                          {award.organization}
                        </p>
                        <p className="text-muted-foreground text-sm mb-2">
                          {award.description}
                        </p>
                        <Badge variant="outline">{award.date}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section
        id="media-kit"
        className="py-24 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Media Kit
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download official logos, images, and materials for press coverage
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mediaKit.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {item.type === "ZIP" ? (
                        <ImageIcon className="h-8 w-8 text-primary" />
                      ) : (
                        <FileText className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{item.type}</Badge>
                      <span>{item.size}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4 p-0 h-auto text-primary"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-primary/5 via-chart-1/5 to-primary/5 border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-8 lg:grid-cols-2 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Press Inquiries</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      For media inquiries, interview requests, or additional
                      information, please contact our press team. We typically
                      respond within 24 hours.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          press@scholarflow.ai
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <span className="font-medium">Available worldwide</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          Executive interviews available
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Contact Press Team
                      </Button>
                      <Button size="lg" variant="outline">
                        <Video className="mr-2 h-5 w-5" />
                        Schedule Interview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
