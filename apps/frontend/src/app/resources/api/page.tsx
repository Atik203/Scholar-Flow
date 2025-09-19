"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Code,
  Database,
  Key,
  Rocket,
  Search,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function APIReferencePage() {
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
                <BookOpen className="h-4 w-4" />
                Developer API
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Build with ScholarFlow API
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Comprehensive REST API documentation with examples, SDKs, and
                interactive testing tools for seamless integration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link href="#quick-start" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Quick Start
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#endpoints" className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Explorer
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
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Authentication</h3>
                      <p className="text-muted-foreground">
                        Secure API keys and OAuth 2.0 integration guides.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Database className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Full CRUD Operations
                      </h3>
                      <p className="text-muted-foreground">
                        Complete paper management, search, and collaboration
                        APIs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Zap className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Real-time Updates
                      </h3>
                      <p className="text-muted-foreground">
                        Webhooks and WebSocket support for live data sync.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Categories */}
        <section id="quick-start" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete API reference
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to integrate ScholarFlow into your
              applications and workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Key,
                title: "Authentication",
                description:
                  "API key generation, OAuth flows, token refresh, and security best practices.",
                endpoints: 4,
                color: "primary",
              },
              {
                icon: Search,
                title: "Paper Management",
                description:
                  "Upload, retrieve, update, and delete research papers with full metadata support.",
                endpoints: 12,
                color: "chart-1",
              },
              {
                icon: BookOpen,
                title: "Collections API",
                description:
                  "Create and manage collections, add papers, set permissions, and share research.",
                endpoints: 8,
                color: "chart-2",
              },
              {
                icon: Zap,
                title: "Search & Discovery",
                description:
                  "Advanced search, filtering, semantic search, and recommendation algorithms.",
                endpoints: 6,
                color: "chart-3",
              },
              {
                icon: Database,
                title: "User Management",
                description:
                  "User profiles, team management, permissions, and collaboration workflows.",
                endpoints: 10,
                color: "chart-4",
              },
              {
                icon: Code,
                title: "Webhooks & Events",
                description:
                  "Real-time notifications, event subscriptions, and webhook configuration.",
                endpoints: 5,
                color: "chart-5",
              },
            ].map(({ icon: Icon, title, description, endpoints, color }) => (
              <Card key={title} className="hover-lift group cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-xl">{title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {endpoints} endpoints
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <Link
                    href={`#${title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
                  >
                    View API docs <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready-to-use code examples
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started quickly with examples in multiple programming
              languages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Upload a Paper",
                language: "JavaScript",
                description: "Upload a PDF and extract metadata automatically",
                code: `fetch('/api/papers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer TOKEN'
  },
  body: formData
})`,
              },
              {
                title: "Search Papers",
                language: "Python",
                description: "Semantic search with filters and pagination",
                code: `import requests

response = requests.get(
  'api/papers/search',
  headers={'Authorization': 'Bearer TOKEN'},
  params={'q': 'machine learning', 'limit': 10}
)`,
              },
              {
                title: "Create Collection",
                language: "cURL",
                description: "Create a new research collection with papers",
                code: `curl -X POST \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "ML Papers", "description": "..."}' \\
  https://api.scholarflow.com/collections`,
              },
              {
                title: "Get AI Summary",
                language: "Node.js",
                description: "Generate AI-powered paper summaries",
                code: `const { summary } = await fetch(
  \`/api/papers/\${paperId}/summary\`,
  {
    headers: { 'Authorization': \`Bearer \${token}\` }
  }
).then(r => r.json())`,
              },
              {
                title: "Webhook Setup",
                language: "PHP",
                description: "Configure webhooks for real-time updates",
                code: `$webhook = [
  'url' => 'https://yourapp.com/webhook',
  'events' => ['paper.uploaded', 'collection.shared'],
  'secret' => 'your_webhook_secret'
];

$ch = curl_init('api/webhooks');`,
              },
              {
                title: "Batch Operations",
                language: "Ruby",
                description: "Process multiple papers in a single request",
                code: `require 'net/http'

papers = [
  { title: "Paper 1", file: file1 },
  { title: "Paper 2", file: file2 }
]

Net::HTTP.post(uri, papers.to_json)`,
              },
            ].map(({ title, language, description, code }) => (
              <Card key={title} className="group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {language}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {description}
                  </p>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-muted-foreground whitespace-pre-wrap">
                      {code}
                    </pre>
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
              Start building today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get your API key and start integrating ScholarFlow into your
              research workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href={isAuthenticated ? "/dashboard/settings/api" : "/login"}
                  className="flex items-center gap-2"
                >
                  <Key className="h-5 w-5" />
                  {isAuthenticated ? "Get API Key" : "Sign Up for API Access"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link
                  href="/resources/tutorials"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  API Tutorials
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
