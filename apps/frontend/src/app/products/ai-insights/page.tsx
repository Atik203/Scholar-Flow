"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Eye,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProductAIInsightsPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium mb-6">
                <Brain className="h-4 w-4" />
                AI Insights Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                AI that accelerates discovery
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Unlock hidden patterns in research. Get AI-powered insights,
                trend analysis, and intelligent recommendations that transform
                how you understand literature.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-5 w-5" />
                    {isAuthenticated
                      ? "Go to dashboard"
                      : "Explore AI insights"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    See AI in action
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="hover-glow border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-3/10">
                      <Brain className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Smart Analysis</h3>
                      <p className="text-muted-foreground">
                        AI analyzes patterns across millions of papers to
                        surface hidden insights.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-4/10">
                      <TrendingUp className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Trend Prediction
                      </h3>
                      <p className="text-muted-foreground">
                        Identify emerging research directions before they become
                        mainstream.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-5/10">
                      <Lightbulb className="h-6 w-6 text-chart-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Research Gaps</h3>
                      <p className="text-muted-foreground">
                        Discover unexplored areas and potential breakthrough
                        opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-powered research intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced machine learning algorithms analyze research patterns to
              provide actionable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Semantic Understanding",
                description:
                  "Deep learning models understand research context, not just keywords, for precise analysis.",
                color: "chart-3",
              },
              {
                icon: TrendingUp,
                title: "Trend Analysis",
                description:
                  "Identify emerging topics, declining areas, and predict future research directions.",
                color: "chart-4",
              },
              {
                icon: Target,
                title: "Gap Detection",
                description:
                  "Automatically discover understudied areas and potential research opportunities.",
                color: "chart-5",
              },
              {
                icon: BarChart3,
                title: "Citation Intelligence",
                description:
                  "Analyze citation networks, predict impact, and identify influential work early.",
                color: "primary",
              },
              {
                icon: Lightbulb,
                title: "Recommendation Engine",
                description:
                  "Get personalized paper recommendations based on your research interests and history.",
                color: "chart-1",
              },
              {
                icon: Sparkles,
                title: "Auto-Summarization",
                description:
                  "Generate accurate abstracts, key findings, and methodology summaries automatically.",
                color: "chart-2",
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

        {/* AI Features Deep Dive */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI insights that drive breakthroughs
            </h2>
            <p className="text-xl text-muted-foreground">
              From literature reviews to hypothesis generation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Research Landscape Mapping",
                description:
                  "Visualize entire research fields with AI-generated concept maps and relationship networks.",
                features: [
                  "Interactive concept maps",
                  "Author collaboration networks",
                  "Topic evolution timelines",
                  "Cross-disciplinary connections",
                ],
                example: "Map the entire field of quantum computing research",
                icon: Eye,
              },
              {
                title: "Competitive Intelligence",
                description:
                  "Track competitor research, identify white spaces, and monitor funding trends in your field.",
                features: [
                  "Competitor tracking",
                  "Funding analysis",
                  "Patent landscape",
                  "Market opportunity identification",
                ],
                example: "Monitor all AI safety research publications",
                icon: Target,
              },
              {
                title: "Hypothesis Generation",
                description:
                  "AI suggests novel research questions based on patterns in existing literature and identified gaps.",
                features: [
                  "Question generation",
                  "Methodology suggestions",
                  "Resource requirements",
                  "Feasibility scoring",
                ],
                example: "Generate 50 novel AI ethics research questions",
                icon: Lightbulb,
              },
              {
                title: "Impact Prediction",
                description:
                  "Predict which papers, authors, and research directions will have the highest impact.",
                features: [
                  "Citation prediction",
                  "Influence scoring",
                  "Trend forecasting",
                  "Career trajectory analysis",
                ],
                example: "Predict which 2024 papers will be highly cited",
                icon: TrendingUp,
              },
            ].map(({ title, description, features, example, icon: Icon }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-chart-3/10">
                      <Icon className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-chart-3 mb-2">
                      AI Capabilities:
                    </div>
                    <ul className="grid grid-cols-2 gap-1">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-chart-3/5 rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      Use Case:
                    </div>
                    <div className="text-sm font-medium">{example}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI in Action */}
        <section className="py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                See AI insights in action
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Real examples of how our AI transforms research workflows and
                accelerates discovery.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Literature Review in Minutes",
                    description:
                      "AI analyzes 500+ papers and generates comprehensive literature reviews with key themes and gaps.",
                    metric: "95% faster than manual review",
                  },
                  {
                    title: "Research Direction Recommendations",
                    description:
                      "Personalized suggestions for your next research project based on your expertise and field trends.",
                    metric: "78% of suggestions lead to funded projects",
                  },
                  {
                    title: "Collaboration Discovery",
                    description:
                      "Find the perfect collaborators based on research overlap, complementary skills, and success patterns.",
                    metric: "3x more successful collaborations",
                  },
                  {
                    title: "Grant Success Prediction",
                    description:
                      "AI predicts funding success probability and suggests improvements to research proposals.",
                    metric: "40% higher funding success rate",
                  },
                ].map(({ title, description, metric }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-chart-4/10 mt-1">
                      <Zap className="h-4 w-4 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-muted-foreground text-sm mb-1">
                        {description}
                      </p>
                      <div className="text-xs font-medium text-chart-4">
                        {metric}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="hover-glow">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-6 text-center">
                  AI Analysis Dashboard
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Research Gap Analysis
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        95% Complete
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Trend Prediction
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        87% Confidence
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Citation Network Mapping
                      </span>
                      <span className="text-xs text-purple-600 font-medium">
                        12,847 papers analyzed
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Discovered 23 research clusters
                    </div>
                  </div>
                  <div className="p-4 bg-chart-3/10 rounded-lg">
                    <div className="text-sm font-medium text-chart-3 mb-1">
                      🎯 New Opportunity Detected
                    </div>
                    <div className="text-xs text-muted-foreground">
                      AI-powered protein folding in drug discovery shows 89%
                      funding success rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proven research acceleration
            </h2>
            <p className="text-xl text-muted-foreground">
              Measurable impact on research productivity and discovery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: "85%",
                description: "Faster literature reviews",
                detail:
                  "AI-powered analysis reduces review time from weeks to hours",
              },
              {
                metric: "3.2x",
                description: "More research opportunities identified",
                detail: "Discover gaps and trends that manual analysis misses",
              },
              {
                metric: "67%",
                description: "Higher citation impact",
                detail:
                  "AI insights help researchers focus on high-impact directions",
              },
              {
                metric: "92%",
                description: "User satisfaction rate",
                detail:
                  "Researchers report significant productivity improvements",
              },
            ].map(({ metric, description, detail }) => (
              <Card key={metric} className="text-center hover-lift">
                <CardContent className="p-6">
                  <div className="text-3xl md:text-4xl font-bold text-chart-3 mb-2">
                    {metric}
                  </div>
                  <div className="font-semibold mb-2">{description}</div>
                  <div className="text-sm text-muted-foreground">{detail}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <Card className="bg-gradient-to-r from-chart-3/10 via-chart-4/5 to-transparent border-chart-3/20 hover-glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Unlock the power of AI for your research
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the AI-powered research revolution. Discover insights that
                traditional methods miss.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow text-base"
                >
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-5 w-5" />
                    {isAuthenticated
                      ? "Access AI insights"
                      : "Experience AI insights"}
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
                    View all products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                AI insights included in all plans. Start your free trial today.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
