"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Code,
  Database,
  FileCode,
  GitBranch,
  Globe,
  Link,
  Plug,
  Rocket,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface IntegrationsPageProps {
  onNavigate?: (path: string) => void;
}

export function IntegrationsPage({ onNavigate }: IntegrationsPageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 text-chart-2 text-sm font-medium mb-6">
                  <Plug className="h-4 w-4" />
                  Custom Integrations
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
                  Connect your entire research stack
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Seamlessly integrate ScholarFlow with your existing tools,
                  databases, and workflows through our powerful API and
                  pre-built connectors.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-2 to-chart-3 hover:opacity-90 text-primary-foreground"
                    onClick={() => onNavigate?.("/resources/api")}
                  >
                    <Code className="h-5 w-5 mr-2" />
                    View API Docs
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("/company/contact")}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Contact Sales
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
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <Link className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Pre-built Connectors
                          </h3>
                          <p className="text-muted-foreground">
                            Ready-to-use integrations with popular research
                            tools.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <FileCode className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">REST API</h3>
                          <p className="text-muted-foreground">
                            Full-featured API for custom integrations.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-4/10">
                          <Zap className="h-6 w-6 text-chart-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Webhooks</h3>
                          <p className="text-muted-foreground">
                            Real-time event notifications for automation.
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

        {/* Integration Categories */}
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
                Integration Categories
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with the tools your team already uses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Databases & Storage",
                  description:
                    "Connect with institutional repositories, cloud storage, and research databases.",
                  tools: [
                    "AWS S3",
                    "Google Cloud",
                    "Azure",
                    "Institutional Repos",
                  ],
                  color: "primary",
                },
                {
                  icon: Globe,
                  title: "Reference Managers",
                  description:
                    "Sync with popular reference management and citation tools.",
                  tools: ["Zotero", "Mendeley", "EndNote", "BibTeX"],
                  color: "chart-1",
                },
                {
                  icon: GitBranch,
                  title: "Version Control",
                  description:
                    "Integrate with code repositories for reproducible research.",
                  tools: ["GitHub", "GitLab", "Bitbucket", "DVC"],
                  color: "chart-2",
                },
                {
                  icon: FileCode,
                  title: "Documentation",
                  description:
                    "Connect with writing and documentation platforms.",
                  tools: ["Overleaf", "Google Docs", "Notion", "Confluence"],
                  color: "chart-3",
                },
                {
                  icon: Plug,
                  title: "Authentication",
                  description:
                    "Enterprise SSO and identity provider integrations.",
                  tools: ["Okta", "Azure AD", "SAML 2.0", "LDAP"],
                  color: "chart-4",
                },
                {
                  icon: Zap,
                  title: "Automation",
                  description:
                    "Connect with automation and workflow platforms.",
                  tools: ["Zapier", "n8n", "Make", "Custom Webhooks"],
                  color: "chart-5",
                },
              ].map(
                ({ icon: Icon, title, description, tools, color }, index) => (
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
                        <div className="flex flex-wrap gap-2">
                          {tools.map((tool) => (
                            <span
                              key={tool}
                              className="text-xs px-2 py-1 rounded-full bg-muted"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Integration Process */}
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
                Custom Integration Process
              </h2>
              <p className="text-xl text-muted-foreground">
                We work with your team to build exactly what you need
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description:
                    "We understand your existing tools and integration requirements.",
                  color: "primary",
                },
                {
                  step: "02",
                  title: "Design",
                  description:
                    "Our team designs a custom integration architecture.",
                  color: "chart-1",
                },
                {
                  step: "03",
                  title: "Build",
                  description:
                    "We develop and test the integration with your systems.",
                  color: "chart-2",
                },
                {
                  step: "04",
                  title: "Deploy",
                  description:
                    "Launch with full documentation and ongoing support.",
                  color: "chart-3",
                },
              ].map(({ step, title, description, color }, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className={`text-2xl font-bold text-${color}`}>
                      {step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </motion.div>
              ))}
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
                Ready to integrate?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Talk to our team about your integration needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-2 to-chart-3 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/company/contact")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Contact Sales
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/resources/api")}
                >
                  <Code className="h-5 w-5 mr-2" />
                  View API Docs
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
