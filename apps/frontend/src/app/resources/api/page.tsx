"use client";

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
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResourcesAPIPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
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
                  API Platform
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                  Build on ScholarFlow
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Comprehensive REST API documentation to integrate ScholarFlow into your research workflows.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                    >
                      <Key className="h-5 w-5 mr-2" />
                      Get API Key
                    </Button>
                  </Link>
                  <Link href="/resources/docs">
                    <Button
                      size="lg"
                      variant="outline"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      View Documentation
                    </Button>
                  </Link>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            'curl -X GET "https://api.scholarflow.io/v1/papers" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json"',
                          );
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto bg-muted/20">
                      <code className="text-chart-3">
                        {`curl -X GET "https://api.scholarflow.io/v1/papers" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json"`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

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
                Explore our API features
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive endpoints for papers, collections, users, and more.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileJson,
                  title: "RESTful API",
                  description: "Upload, retrieve, search, and manage research papers programmatically.",
                  endpoints: ["GET /papers", "POST /papers", "GET /papers/:id"],
                  color: "primary",
                },
                {
                  icon: Code,
                  title: "SDK Libraries",
                  description: "Official SDKs for JavaScript, Python, Go, and Ruby to accelerate development.",
                  endpoints: ["npm install @scholar-flow/sdk", "pip install scholarflow", "go get scholarflow"],
                  color: "chart-1",
                },
                {
                  icon: Terminal,
                  title: "Webhooks",
                  description: "Receive real-time notifications for events in your account.",
                  endpoints: ["POST /webhooks", "GET /webhooks/:id", "DELETE /webhooks/:id"],
                  color: "chart-2",
                },
                {
                  icon: Zap,
                  title: "Rate Limiting",
                  description: "Fair usage limits ensure API stability for all users.",
                  endpoints: ["1000 req/min (Pro)", "5000 req/min (Team)", "Custom (Enterprise)"],
                  color: "chart-3",
                },
                {
                  icon: Key,
                  title: "Authentication",
                  description: "Manage API keys, authentication tokens, and user sessions.",
                  endpoints: ["POST /auth/token", "DELETE /auth/revoke", "GET /auth/verify"],
                  color: "chart-4",
                },
                {
                  icon: BookOpen,
                  title: "Documentation",
                  description: "Comprehensive docs with examples, guides, and reference material.",
                  endpoints: ["OpenAPI Spec", "Postman Collection", "Migration Guides"],
                  color: "chart-5",
                },
              ].map(({ icon: Icon, title, description, endpoints, color }, index) => (
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
                      <p className="text-muted-foreground mb-4">{description}</p>
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
              ))}
            </div>
          </div>
        </section>

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
                Integration Examples
              </h2>
              <p className="text-xl text-muted-foreground">
                Get started quickly with these common integration patterns
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Paper Upload & Metadata Extraction",
                  description: "Automatically upload papers and extract metadata using the Papers API.",
                  language: "JavaScript",
                  code: "const paper = await scholarflow.papers.create({\n  file: pdfBuffer,\n  metadata: { title, authors }\n});",
                },
                {
                  title: "Semantic Search Integration",
                  description: "Implement powerful semantic search across your research library.",
                  language: "Python",
                  code: "results = client.search.semantic(\n  query='machine learning in healthcare',\n  limit=10\n)",
                },
                {
                  title: "AI Summary Generation",
                  description: "Generate AI-powered summaries for papers in your collection.",
                  language: "JavaScript",
                  code: "const summary = await scholarflow.ai.summarize({\n  paperId: 'paper_123',\n  length: 'detailed'\n});",
                },
                {
                  title: "Webhook Event Handling",
                  description: "Receive real-time notifications for paper updates and events.",
                  language: "Python",
                  code: "@app.route('/webhooks/scholarflow', methods=['POST'])\ndef handle_webhook():\n    event = request.json\n    process_event(event)",
                },
              ].map(({ title, description, language, code }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="h-5 w-5 text-chart-3" />
                        <span className="text-xs px-2 py-0.5 rounded-full bg-chart-3/10 text-chart-3 font-medium">
                          {language}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                        {title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">{description}</p>
                      <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono border border-border/50">
                        <code>{code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Ready to start building?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create your API key and start integrating ScholarFlow today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-chart-3 to-chart-4 hover:opacity-90 text-primary-foreground"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/resources/community">
                  <Button
                    size="lg"
                    variant="outline"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Developer Community
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
