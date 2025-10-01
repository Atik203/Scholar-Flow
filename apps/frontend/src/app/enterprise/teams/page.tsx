"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Check, Crown, Shield, Users, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EnterpriseTeamsPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Team Management Suite
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Advanced team collaboration for research
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Sophisticated team management tools with role-based permissions,
                department organization, and advanced analytics for large
                research teams.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#team-features"
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-5 w-5" />
                    Explore Features
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Request Team Demo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Role-Based Access
                      </h3>
                      <p className="text-muted-foreground">
                        Granular permissions for different team roles and
                        responsibilities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Building2 className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Department Organization
                      </h3>
                      <p className="text-muted-foreground">
                        Organize teams by departments with custom hierarchies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Zap className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Advanced Analytics
                      </h3>
                      <p className="text-muted-foreground">
                        Deep insights into team performance and collaboration
                        patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Management Features */}
        <section id="team-features" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive team management tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to organize, manage, and optimize research
              teams of any size
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Permissions",
                description:
                  "Fine-grained access control with custom roles, project-level permissions, and data governance.",
                features: [
                  "Custom Role Creation",
                  "Project-level Access",
                  "Data Governance",
                  "Audit Trails",
                  "Regular Security Audits",
                ],
                color: "primary",
              },
              {
                icon: Building2,
                title: "Department Structure",
                description:
                  "Organize teams by departments, research groups, or custom hierarchies with inheritance.",
                features: [
                  "Multi-level Hierarchy",
                  "Permission Inheritance",
                  "Cross-department Collaboration",
                  "Budget Management",
                  "High Availability",
                ],
                color: "chart-1",
              },
              {
                icon: Users,
                title: "Team Analytics",
                description:
                  "Comprehensive analytics on team performance, collaboration patterns, and productivity metrics.",
                features: [
                  "Performance Dashboards",
                  "Collaboration Insights",
                  "Usage Analytics",
                  "Custom Reports",
                  "Collaboration Tools",
                ],
                color: "chart-2",
              },
              {
                icon: Zap,
                title: "Automated Workflows",
                description:
                  "Set up automated approval workflows, task assignments, and notification systems.",
                features: [
                  "Approval Workflows",
                  "Auto-assignments",
                  "Smart Notifications",
                  "Process Automation",
                  "Data Import Services",
                ],
                color: "chart-3",
              },
              {
                icon: Crown,
                title: "Admin Controls",
                description:
                  "Comprehensive admin panel with user management, system configuration, and monitoring tools.",
                features: [
                  "User Provisioning",
                  "System Configuration",
                  "Activity Monitoring",
                  "Bulk Operations",
                  "Branded Email Notifications",
                ],
                color: "chart-4",
              },
              {
                icon: Check,
                title: "Compliance Tools",
                description:
                  "Built-in compliance features for regulatory requirements and institutional policies.",
                features: [
                  "GDPR Compliance",
                  "Data Retention Policies",
                  "Access Logging",
                  "Compliance Reports",
                  "Regular Check-ins",
                ],
                color: "chart-5",
              },
            ].map(({ icon: Icon, title, description, features, color }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-chart-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Sizes & Use Cases */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scalable for teams of any size
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From small research groups to large institutions, our platform
              grows with your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                size: "Small Teams",
                range: "5-25 members",
                description:
                  "Perfect for research labs, startup teams, and focused research groups",
                features: [
                  "Simple role management",
                  "Basic collaboration tools",
                  "Shared collections",
                  "Team chat integration",
                  "Basic analytics",
                ],
                icon: Users,
                color: "primary",
              },
              {
                size: "Medium Organizations",
                range: "25-500 members",
                description:
                  "Ideal for departments, research centers, and growing institutions",
                features: [
                  "Department organization",
                  "Advanced permissions",
                  "Workflow automation",
                  "Performance analytics",
                  "Integration support",
                ],
                icon: Building2,
                color: "chart-1",
              },
              {
                size: "Large Enterprises",
                range: "500+ members",
                description:
                  "Built for universities, corporations, and multi-site organizations",
                features: [
                  "Multi-level hierarchy",
                  "Enterprise SSO",
                  "Custom compliance",
                  "Dedicated support",
                  "White-label options",
                ],
                icon: Crown,
                color: "chart-2",
              },
            ].map(
              ({ size, range, description, features, icon: Icon, color }) => (
                <Card key={size} className="hover-lift">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-6 w-6 text-${color}`} />
                    </div>
                    <h3 className="font-semibold text-xl mb-1">{size}</h3>
                    <p className="text-primary font-medium text-sm mb-3">
                      {range}
                    </p>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <ul className="space-y-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-chart-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Team transformation success stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from organizations that transformed their research
              workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                organization: "Global Research University",
                teamSize: "1,200+ researchers",
                challenge:
                  "Fragmented research data across 15 departments with no centralized collaboration",
                solution:
                  "Implemented department-based organization with cross-functional project teams",
                results: [
                  "60% increase in inter-department collaboration",
                  "40% reduction in duplicate research",
                  "25% faster project completion times",
                  "Unified access to institutional knowledge",
                ],
                quote:
                  "ScholarFlow transformed how our departments collaborate. We've eliminated research silos.",
                author: "Dr. Sarah Martinez, Research Director",
              },
              {
                organization: "BioTech Innovation Lab",
                teamSize: "85 researchers",
                challenge:
                  "Complex approval workflows and compliance requirements slowing down research",
                solution:
                  "Automated approval workflows with role-based access and compliance tracking",
                results: [
                  "70% faster approval processes",
                  "100% compliance audit success",
                  "50% reduction in administrative overhead",
                  "Streamlined regulatory submissions",
                ],
                quote:
                  "The automated workflows saved us countless hours and eliminated compliance headaches.",
                author: "Prof. Michael Chen, Lab Director",
              },
            ].map(
              ({
                organization,
                teamSize,
                challenge,
                solution,
                results,
                quote,
                author,
              }) => (
                <Card key={organization} className="p-6">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{organization}</h3>
                      <p className="text-primary text-sm font-medium">
                        {teamSize}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Challenge:</h4>
                        <p className="text-muted-foreground text-sm">
                          {challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Solution:</h4>
                        <p className="text-muted-foreground text-sm">
                          {solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Results:</h4>
                        <ul className="space-y-1">
                          {results.map((result) => (
                            <li
                              key={result}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Check className="h-3 w-3 text-chart-1 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {result}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <blockquote className="border-l-2 border-primary pl-4 mb-2">
                      <p className="text-sm italic">"{quote}"</p>
                    </blockquote>
                    <p className="text-xs text-muted-foreground">— {author}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section id="demo" className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to optimize your research teams?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              See how our team management tools can transform your
              organization's collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href="/enterprise/demo"
                  className="flex items-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Schedule Team Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/enterprise" className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Enterprise Overview
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
