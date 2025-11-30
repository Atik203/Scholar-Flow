"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Code,
  Copy,
  FileJson,
  Key,
  Rocket,
  Terminal,
  Zap,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface APIPageProps {
  onNavigate?: (path: string) => void;
}

export function APIPage({ onNavigate }: APIPageProps) {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium mb-6">
                  <Code className="h-4 w-4" />
                  Developer Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                  Build powerful integrations
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Comprehensive REST API documentation to integrate ScholarFlow
                  into your research workflows.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    Get API Key
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
                <Card className="border-2 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Quick Start</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto bg-muted/20">
                      <code className="text-chart-3">
                        {`curl -X GET "https://api.scholarflow.io/v1/papers" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
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
                Explore our API endpoints
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive endpoints for papers, collections, users, and
                more.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileJson,
                  title: "Papers API",
                  description:
                    "Upload, retrieve, search, and manage research papers programmatically.",
                  endpoints: ["GET /papers", "POST /papers", "GET /papers/:id"],
                  color: "primary",
                },
                {
                  icon: BookOpen,
                  title: "Collections API",
                  description:
                    "Create and manage collections, add papers, and set sharing permissions.",
                  endpoints: [
                    "GET /collections",
                    "POST /collections",
                    "PUT /collections/:id",
                  ],
                  color: "chart-1",
                },
                {
                  icon: Code,
                  title: "Search API",
                  description:
                    "Semantic and keyword search across your entire research library.",
                  endpoints: [
                    "GET /search",
                    "POST /search/semantic",
                    "GET /search/suggest",
                  ],
                  color: "chart-2",
                },
                {
                  icon: Zap,
                  title: "AI API",
                  description:
                    "Generate summaries, extract insights, and get recommendations.",
                  endpoints: [
                    "POST /ai/summarize",
                    "POST /ai/insights",
                    "GET /ai/recommendations",
                  ],
                  color: "chart-3",
                },
                {
                  icon: Key,
                  title: "Auth API",
                  description:
                    "Manage API keys, authentication tokens, and user sessions.",
                  endpoints: [
                    "POST /auth/token",
                    "DELETE /auth/revoke",
                    "GET /auth/verify",
                  ],
                  color: "chart-4",
                },
                {
                  icon: Terminal,
                  title: "Webhooks",
                  description:
                    "Receive real-time notifications for events in your account.",
                  endpoints: [
                    "POST /webhooks",
                    "GET /webhooks/:id",
                    "DELETE /webhooks/:id",
                  ],
                  color: "chart-5",
                },
              ].map(
                (
                  { icon: Icon, title, description, endpoints, color },
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
                        <h3 className="font-semibold text-xl mb-2">{title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <div className="space-y-2">
                          {endpoints.map((endpoint) => (
                            <div
                              key={endpoint}
                              className="text-xs font-mono bg-muted px-2 py-1 rounded"
                            >
                              {endpoint}
                            </div>
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

        {/* Code Examples */}
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
                SDKs & Code Examples
              </h2>
              <p className="text-xl text-muted-foreground">
                Official SDKs and examples in popular programming languages
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "JavaScript/TypeScript",
                  icon: "🟨",
                  version: "v2.1.0",
                },
                { name: "Python", icon: "🐍", version: "v1.8.0" },
                { name: "Go", icon: "🔵", version: "v1.3.0" },
                { name: "Ruby", icon: "💎", version: "v1.2.0" },
              ].map(({ name, icon, version }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{icon}</div>
                      <h3 className="font-semibold text-lg mb-1">{name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {version}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                      >
                        View SDK <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
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
                Ready to start building?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create your API key and start integrating ScholarFlow today.
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
                  onClick={() => onNavigate?.("/resources/community")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Developer Community
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
