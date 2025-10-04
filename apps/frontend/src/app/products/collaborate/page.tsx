"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function ProductCollaboratePage() {
  const { session } = useAuth();
  const isAuthenticated = !!session;
  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
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
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    {isAuthenticated ? "Go to dashboard" : "Start collaborating"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Watch demo
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="hover-glow border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Users className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Team Workspaces</h3>
                      <p className="text-muted-foreground">
                        Private or public workspaces with role-based access and
                        project management.
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
                        Built-in chat, video calls, and annotation discussions
                        for seamless collaboration.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-4/10">
                      <GitBranch className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Version Control</h3>
                      <p className="text-muted-foreground">
                        Track changes, manage paper versions, and maintain
                        research integrity.
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
              Collaboration without barriers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From local teams to global consortiums, enable seamless research
              collaboration at any scale.
            </p>
          </div>
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

        {/* Collaboration Types */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Every type of research collaboration
            </h2>
            <p className="text-xl text-muted-foreground">
              From peer review to multi-institutional projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Academic Research Groups",
                description:
                  "Multi-PI projects, lab collaborations, and cross-institutional research initiatives.",
                features: [
                  "Grant management",
                  "Publication tracking",
                  "Resource sharing",
                  "Progress reporting",
                ],
                metrics: "Average 40% faster publication",
                icon: Target,
              },
              {
                title: "Peer Review & Editorial",
                description:
                  "Streamlined peer review processes with secure, anonymous collaboration tools.",
                features: [
                  "Anonymous review",
                  "Version comparison",
                  "Editorial workflows",
                  "Deadline tracking",
                ],
                metrics: "50% reduction in review time",
                icon: MessageSquare,
              },
              {
                title: "Student Supervision",
                description:
                  "Mentor-student relationships with progress tracking and structured feedback systems.",
                features: [
                  "Milestone tracking",
                  "Feedback loops",
                  "Resource sharing",
                  "Progress visualization",
                ],
                metrics: "90% of students report better guidance",
                icon: Users,
              },
              {
                title: "Industry Partnerships",
                description:
                  "Academia-industry collaboration with IP protection and controlled access.",
                features: [
                  "IP protection",
                  "Controlled access",
                  "NDA compliance",
                  "Commercial licensing",
                ],
                metrics: "3x faster technology transfer",
                icon: Share2,
              },
            ].map(({ title, description, features, metrics, icon: Icon }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Icon className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-chart-2 mb-2">
                      Key Capabilities:
                    </div>
                    <ul className="grid grid-cols-2 gap-1">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-chart-2/5 rounded-lg">
                    <div className="text-sm font-medium text-chart-2">
                      {metrics}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powering breakthrough research
            </h2>
            <p className="text-xl text-muted-foreground">
              See how research teams accelerate discovery with ScholarFlow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "MIT AI Lab",
                description:
                  "Reduced collaboration overhead by 60% across 15 research groups",
                quote:
                  "ScholarFlow transformed how our lab collaborates. We ship papers 40% faster now.",
                author: "Dr. Sarah Chen, Principal Investigator",
                metric: "40% faster publication",
              },
              {
                title: "European Cancer Consortium",
                description:
                  "Coordinated 12-institution study with 200+ researchers across 8 countries",
                quote:
                  "Managing our multi-site clinical research became effortless with ScholarFlow.",
                author: "Prof. Hans Mueller, Project Coordinator",
                metric: "200+ researchers connected",
              },
              {
                title: "Stanford Graduate Program",
                description:
                  "Enhanced mentor-student relationships across 500+ PhD students",
                quote:
                  "Students get better guidance and complete their dissertations 20% faster.",
                author: "Dr. Maria Rodriguez, Graduate Director",
                metric: "20% faster completion",
              },
            ].map(({ title, description, quote, author, metric }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <blockquote className="border-l-4 border-chart-2 pl-4 mb-4">
                    <p className="text-sm italic">"{quote}"</p>
                    <footer className="text-xs text-muted-foreground mt-2">
                      — {author}
                    </footer>
                  </blockquote>
                  <div className="p-2 bg-chart-2/10 rounded text-center">
                    <div className="text-sm font-medium text-chart-2">
                      {metric}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Integration & Security */}
        <section className="py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise-ready collaboration
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Security, compliance, and integration features that scale with
                your research needs.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Enterprise Security",
                    description:
                      "SOC 2 compliance, end-to-end encryption, and enterprise SSO integration.",
                  },
                  {
                    title: "API Integration",
                    description:
                      "Connect with institutional systems, ORCID, funding databases, and more.",
                  },
                  {
                    title: "Compliance Ready",
                    description:
                      "GDPR, HIPAA, and research data governance compliance built-in.",
                  },
                  {
                    title: "24/7 Support",
                    description:
                      "Dedicated support for research institutions with SLA guarantees.",
                  },
                ].map(({ title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-chart-3/10 mt-1">
                      <ArrowRight className="h-4 w-4 text-chart-3" />
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
                <h3 className="font-semibold text-lg mb-6 text-center">
                  Security & Compliance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "SOC 2 Type II",
                    "GDPR Compliant",
                    "HIPAA Ready",
                    "End-to-End Encryption",
                    "Enterprise SSO",
                    "Audit Logs",
                    "Data Residency",
                    "99.9% Uptime SLA",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <Card className="bg-gradient-to-r from-chart-2/10 via-chart-3/5 to-transparent border-chart-2/20 hover-glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform research collaboration?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join leading research institutions worldwide. Start
                collaborating in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow text-base"
                >
                  <Link href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {isAuthenticated ? "Access your workspace" : "Start your team workspace"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    Contact sales
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Free for teams up to 5 members. Enterprise plans available.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
