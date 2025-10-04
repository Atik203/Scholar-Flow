"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Check, Code, Database, Settings, Zap } from "lucide-react";
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function EnterpriseIntegrationsPage() {
  const { session } = useAuth();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Settings className="h-4 w-4" />
                Custom Integrations
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Seamlessly connect your research ecosystem
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Powerful integration capabilities to connect ScholarFlow with
                your existing research tools, databases, and institutional
                systems.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#integrations"
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Explore Integrations
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link
                    href="#custom-development"
                    className="flex items-center gap-2"
                  >
                    <Code className="h-5 w-5" />
                    Custom Development
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
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Database Connectors
                      </h3>
                      <p className="text-muted-foreground">
                        Direct integration with institutional repositories and
                        databases.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Code className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        API-First Architecture
                      </h3>
                      <p className="text-muted-foreground">
                        Comprehensive REST API for building custom solutions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Settings className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Custom Workflows
                      </h3>
                      <p className="text-muted-foreground">
                        Tailored automation for your specific research
                        processes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Integration Categories */}
        <section id="integrations" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pre-built integrations & custom solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with popular research tools or build custom integrations
              tailored to your workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Research Databases",
                description:
                  "Direct integration with PubMed, arXiv, IEEE Xplore, Scopus, and institutional repositories.",
                integrations: [
                  "PubMed/MEDLINE",
                  "arXiv.org",
                  "IEEE Xplore",
                  "Scopus API",
                  "Institutional Repos",
                  "CrossRef",
                ],
                color: "primary",
              },
              {
                icon: Settings,
                title: "Identity & Access",
                description:
                  "Single Sign-On with LDAP, Active Directory, SAML, and OAuth providers.",
                integrations: [
                  "LDAP/Active Directory",
                  "SAML 2.0",
                  "OAuth 2.0",
                  "Okta",
                  "Azure AD",
                  "Google Workspace",
                ],
                color: "chart-1",
              },
              {
                icon: BookOpen,
                title: "Reference Managers",
                description:
                  "Seamless sync with popular reference management and citation tools.",
                integrations: [
                  "Zotero",
                  "Mendeley",
                  "EndNote",
                  "RefWorks",
                  "BibTeX",
                  "Citation APIs",
                ],
                color: "chart-2",
              },
              {
                icon: Code,
                title: "Development Tools",
                description:
                  "Integration with version control, project management, and development workflows.",
                integrations: [
                  "GitHub",
                  "GitLab",
                  "Jira",
                  "Slack",
                  "Microsoft Teams",
                  "CI/CD Pipelines",
                ],
                color: "chart-3",
              },
              {
                icon: Zap,
                title: "Analytics Platforms",
                description:
                  "Connect with business intelligence and analytics tools for advanced reporting.",
                integrations: [
                  "Tableau",
                  "Power BI",
                  "Google Analytics",
                  "Mixpanel",
                  "Custom BI",
                ],
                color: "chart-4",
              },
              {
                icon: Settings,
                title: "Custom Connectors",
                description:
                  "Build bespoke integrations for proprietary systems and unique workflows.",
                integrations: [
                  "Custom REST APIs",
                  "Webhook Support",
                  "ETL Pipelines",
                  "Real-time Sync",
                  "Legacy Systems",
                ],
                color: "chart-5",
              },
            ].map(({ icon: Icon, title, description, integrations, color }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Available Integrations:
                    </h4>
                    <ul className="space-y-1">
                      {integrations.map((integration) => (
                        <li
                          key={integration}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-3 w-3 text-chart-1 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {integration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Integration Process */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our integration process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From assessment to deployment, we ensure seamless integration with
              your existing systems
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Assessment",
                description:
                  "Analyze your current systems, workflows, and integration requirements.",
                duration: "1-2 weeks",
              },
              {
                step: "02",
                title: "Planning",
                description:
                  "Design integration architecture and create detailed implementation roadmap.",
                duration: "1 week",
              },
              {
                step: "03",
                title: "Development",
                description:
                  "Build and test custom connectors, APIs, and automated workflows.",
                duration: "2-8 weeks",
              },
              {
                step: "04",
                title: "Deployment",
                description:
                  "Deploy integrations, train your team, and provide ongoing support.",
                duration: "1-2 weeks",
              },
            ].map(({ step, title, description, duration }) => (
              <Card key={step} className="relative">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {description}
                  </p>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {duration}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Custom Development */}
        <section
          id="custom-development"
          className="py-16 md:py-24 bg-muted/30 rounded-2xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Custom development services
            </h2>
            <p className="text-xl text-muted-foreground">
              Tailored solutions for unique requirements and complex workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "API Development",
                description:
                  "Custom REST APIs and GraphQL endpoints for specific data access patterns",
                features: [
                  "Custom data models",
                  "Advanced query capabilities",
                  "Real-time subscriptions",
                  "Authentication & authorization",
                  "Rate limiting & monitoring",
                ],
                price: "Starting at $25K",
                timeline: "6-12 weeks",
              },
              {
                title: "Workflow Automation",
                description:
                  "Automated processes tailored to your research and approval workflows",
                features: [
                  "Custom approval chains",
                  "Conditional logic & routing",
                  "Integration with external systems",
                  "Notification & escalation rules",
                  "Audit trails & reporting",
                ],
                price: "Starting at $15K",
                timeline: "4-8 weeks",
              },
              {
                title: "Data Migration",
                description:
                  "Comprehensive data migration from legacy systems and databases",
                features: [
                  "Legacy system analysis",
                  "Data mapping & transformation",
                  "Incremental migration support",
                  "Data validation & cleanup",
                  "Rollback & recovery plans",
                ],
                price: "Starting at $20K",
                timeline: "8-16 weeks",
              },
              {
                title: "Custom Analytics",
                description:
                  "Advanced analytics dashboards and reporting tailored to your KPIs",
                features: [
                  "Custom metrics & KPIs",
                  "Real-time dashboards",
                  "Automated report generation",
                  "Data visualization",
                  "Export & sharing capabilities",
                ],
                price: "Starting at $30K",
                timeline: "8-12 weeks",
              },
            ].map(({ title, description, features, price, timeline }) => (
              <Card key={title} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>

                  <ul className="space-y-2 mb-6">
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

                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span className="font-medium">{price}</span>
                    <span>{timeline}</span>
                  </div>

                  <Button className="w-full" variant="outline">
                    Discuss Requirements
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Cases */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integration success stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-world examples of successful custom integrations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                client: "Research Medical Center",
                challenge:
                  "Needed to integrate with 5 different databases and maintain HIPAA compliance",
                solution:
                  "Custom API layer with federated search across all systems plus audit logging",
                results:
                  "90% reduction in search time, full compliance audit passed",
                integration: "Custom Medical Database Connector",
              },
              {
                client: "Tech Innovation University",
                challenge:
                  "Complex approval workflows across 12 departments with varying requirements",
                solution:
                  "Configurable workflow engine with department-specific rules and escalation",
                results: "75% faster approvals, 100% process compliance",
                integration: "Custom Workflow Automation",
              },
            ].map(({ client, challenge, solution, results, integration }) => (
              <Card key={client} className="p-6">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{client}</h3>
                    <span className="text-primary text-sm font-medium">
                      {integration}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Challenge: </span>
                      <span className="text-muted-foreground">{challenge}</span>
                    </div>
                    <div>
                      <span className="font-medium">Solution: </span>
                      <span className="text-muted-foreground">{solution}</span>
                    </div>
                    <div>
                      <span className="font-medium">Results: </span>
                      <span className="text-muted-foreground">{results}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to integrate ScholarFlow with your systems?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your integration requirements and build a solution
              that fits perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href="/contact-integrations"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  Discuss Integration Needs
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/resources/api" className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  View API Documentation
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
