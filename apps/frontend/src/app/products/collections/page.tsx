"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function ProductCollectionsPage() {
  const { session } = useAuth();
  const isAuthenticated = !!session;
  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
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
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    {isAuthenticated ? "Go to dashboard" : "Create collections"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Explore examples
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="hover-glow border-2">
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
                        Share collections, assign reading lists, and collaborate
                        in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-3/10">
                      <Share2 className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Public Sharing</h3>
                      <p className="text-muted-foreground">
                        Make collections discoverable or keep them private with
                        granular permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Collections that work like your brain
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Intuitive organization meets powerful collaboration. Create
              structure from chaos.
            </p>
          </div>
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
            ].map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="hover-lift hover-glow group">
                <CardContent className="p-6">
                  <div
                    className={`p-3 rounded-lg bg-${color}/10 mb-4 group-hover:bg-${color}/20 transition-colors`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Collection Types */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Collections for every purpose
            </h2>
            <p className="text-xl text-muted-foreground">
              From literature reviews to reading lists, organize research your
              way
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Literature Review Collections",
                description:
                  "Systematic organization for thesis chapters, systematic reviews, and meta-analyses.",
                features: [
                  "Chronological organization",
                  "Methodology grouping",
                  "Citation tracking",
                  "Gap analysis",
                ],
                example: "PhD Thesis: ML in Healthcare (127 papers)",
              },
              {
                title: "Course Reading Lists",
                description:
                  "Curated reading materials for courses, with progress tracking and assignments.",
                features: [
                  "Week-by-week organization",
                  "Student progress tracking",
                  "Assignment integration",
                  "Discussion forums",
                ],
                example: "Advanced AI Ethics Course (45 papers)",
              },
              {
                title: "Research Project Collections",
                description:
                  "All papers related to specific grants, collaborations, or ongoing research.",
                features: [
                  "Grant milestone tracking",
                  "Collaboration tools",
                  "Version control",
                  "Progress reports",
                ],
                example: "NSF Grant: Quantum Computing (89 papers)",
              },
              {
                title: "Topic Monitoring Collections",
                description:
                  "Stay updated with emerging research in your field through automated curation.",
                features: [
                  "Alert subscriptions",
                  "Auto-additions",
                  "Trend analysis",
                  "Weekly summaries",
                ],
                example: "Emerging: Computer Vision (Auto-updated)",
              },
            ].map(({ title, description, features, example }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-3">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-primary mb-2">
                      Key Features:
                    </div>
                    <ul className="grid grid-cols-2 gap-1">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      Example Collection:
                    </div>
                    <div className="text-sm font-medium">{example}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Collaboration Features */}
        <section className="py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Collaborate without friction
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Share knowledge seamlessly with colleagues, students, and
                research teams worldwide.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Real-time Collaboration",
                    description:
                      "Multiple people can add papers, make notes, and organize simultaneously.",
                  },
                  {
                    title: "Permission Management",
                    description:
                      "Fine-grained control: view-only, comment-only, edit access, or admin rights.",
                  },
                  {
                    title: "Activity Feeds",
                    description:
                      "Stay updated with changes, new additions, and team discussions.",
                  },
                  {
                    title: "Export & Integration",
                    description:
                      "Export to Zotero, Mendeley, EndNote, or generate reading lists for LMS.",
                  },
                ].map(({ title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-chart-2/10 mt-1">
                      <ArrowRight className="h-4 w-4 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="hover-glow">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                      <div>
                        <div className="font-medium text-sm">
                          Dr. Sarah Chen
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Added 3 papers
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-chart-1/20"></div>
                      <div>
                        <div className="font-medium text-sm">
                          Prof. Ahmed Rahman
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Left a comment
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">4h ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-chart-2/20"></div>
                      <div>
                        <div className="font-medium text-sm">
                          Maria Rodriguez
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created new collection
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">1d ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <Card className="bg-gradient-to-r from-chart-1/10 via-chart-2/5 to-transparent border-chart-1/20 hover-glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Start organizing smarter today
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform scattered papers into organized knowledge. Create your
                first collection in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow text-base"
                >
                  <Link href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {isAuthenticated ? "Access your collections" : "Create your first collection"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link
                    href="/products/papers"
                    className="flex items-center gap-2"
                  >
                    Explore all products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Unlimited collections on all plans. Start free.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
