"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Check,
  Clock,
  HelpCircle,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EnterpriseSupportPage() {
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
                <Shield className="h-4 w-4" />
                Enterprise Support
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Always-on support for your research mission
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Get priority support, dedicated success management, and 24/7
                assistance to ensure your research operations run smoothly.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#support-plans"
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    View Support Plans
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link
                    href="#contact-support"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Contact Support Now
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
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        24/7 Availability
                      </h3>
                      <p className="text-muted-foreground">
                        Round-the-clock support for critical research
                        operations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Users className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Dedicated Success Manager
                      </h3>
                      <p className="text-muted-foreground">
                        Personal support specialist who knows your setup.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Shield className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">SLA Guarantees</h3>
                      <p className="text-muted-foreground">
                        Contractual response times and uptime commitments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support Plans */}
        <section id="support-plans" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Support plans tailored to your needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From standard business support to premium white-glove service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Standard",
                price: "Included",
                subtitle: "with Enterprise plans",
                description: "Essential support for established teams",
                features: [
                  "Email & chat support",
                  "Business hours (9-5 local time)",
                  "48-hour response time",
                  "Knowledge base access",
                  "Community forum access",
                  "Basic training materials",
                ],
                color: "muted",
                popular: false,
              },
              {
                name: "Premium",
                price: "$2,500",
                subtitle: "per month",
                description: "Priority support with faster resolution",
                features: [
                  "Phone, email & chat support",
                  "Extended hours (6am-10pm local)",
                  "8-hour response time",
                  "Priority queue processing",
                  "Dedicated success manager",
                  "Custom training sessions",
                  "Health checks & optimization",
                ],
                color: "primary",
                popular: true,
              },
              {
                name: "White Glove",
                price: "$7,500",
                subtitle: "per month",
                description: "Ultimate support with proactive management",
                features: [
                  "24/7 phone, email & chat",
                  "1-hour response time",
                  "Named technical contacts",
                  "Proactive monitoring",
                  "Quarterly business reviews",
                  "Custom integrations support",
                  "Emergency escalation hotline",
                  "On-site visits (if needed)",
                ],
                color: "chart-1",
                popular: false,
              },
            ].map(
              ({
                name,
                price,
                subtitle,
                description,
                features,
                color,
                popular,
              }) => (
                <Card
                  key={name}
                  className={`relative ${popular ? "border-primary shadow-lg" : ""}`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-xl mb-2">{name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">{price}</span>
                        <span className="text-muted-foreground ml-1">
                          {subtitle}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {description}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm"
                        >
                          <Check
                            className={`h-4 w-4 text-${color} flex-shrink-0`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={popular ? "default" : "outline"}
                    >
                      {popular ? "Start Premium Support" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Multiple ways to get help
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the support channel that works best for your situation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Live Chat",
                description: "Instant help for quick questions and guidance",
                availability: "Business hours",
                responseTime: "< 2 minutes",
                color: "primary",
              },
              {
                icon: Phone,
                title: "Phone Support",
                description: "Direct line to our technical specialists",
                availability: "Premium+ plans",
                responseTime: "Immediate",
                color: "chart-1",
              },
              {
                icon: HelpCircle,
                title: "Ticket System",
                description: "Detailed support with full context tracking",
                availability: "24/7 submission",
                responseTime: "SLA-based",
                color: "chart-2",
              },
              {
                icon: BookOpen,
                title: "Knowledge Base",
                description: "Self-service articles and troubleshooting guides",
                availability: "Always available",
                responseTime: "Instant",
                color: "chart-3",
              },
            ].map(
              ({
                icon: Icon,
                title,
                description,
                availability,
                responseTime,
                color,
              }) => (
                <Card key={title} className="text-center">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`h-6 w-6 text-${color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {description}
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Availability:
                        </span>
                        <span>{availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response:</span>
                        <span>{responseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* Support Process */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How we resolve your issues
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our systematic approach ensures fast resolution and prevents
              future problems
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Triage",
                description:
                  "Immediate assessment of issue severity and impact on your operations",
                duration: "< 15 minutes",
              },
              {
                step: "02",
                title: "Diagnose",
                description:
                  "Deep technical analysis using logs, monitoring data, and system health",
                duration: "30-60 minutes",
              },
              {
                step: "03",
                title: "Resolve",
                description:
                  "Fix implementation with testing in isolated environment first",
                duration: "SLA-based",
              },
              {
                step: "04",
                title: "Follow-up",
                description:
                  "Validation of fix and recommendations to prevent recurrence",
                duration: "24-48 hours",
              },
            ].map(({ step, title, description, duration }) => (
              <Card key={step} className="text-center">
                <CardContent className="p-6">
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

        {/* SLA Commitments */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Service level commitments
            </h2>
            <p className="text-xl text-muted-foreground">
              Clear expectations and guaranteed response times
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">
                    Issue Severity
                  </th>
                  <th className="text-center p-4 font-semibold">Standard</th>
                  <th className="text-center p-4 font-semibold">Premium</th>
                  <th className="text-center p-4 font-semibold">White Glove</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    severity: "Critical (P1)",
                    description: "System down, data loss, security breach",
                    standard: "24 hours",
                    premium: "4 hours",
                    whiteGlove: "1 hour",
                  },
                  {
                    severity: "High (P2)",
                    description: "Major feature broken, significant impact",
                    standard: "48 hours",
                    premium: "8 hours",
                    whiteGlove: "2 hours",
                  },
                  {
                    severity: "Medium (P3)",
                    description: "Minor feature issues, workaround available",
                    standard: "72 hours",
                    premium: "24 hours",
                    whiteGlove: "4 hours",
                  },
                  {
                    severity: "Low (P4)",
                    description:
                      "Questions, enhancement requests, documentation",
                    standard: "5 days",
                    premium: "48 hours",
                    whiteGlove: "8 hours",
                  },
                ].map(
                  ({
                    severity,
                    description,
                    standard,
                    premium,
                    whiteGlove,
                  }) => (
                    <tr key={severity} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{severity}</div>
                          <div className="text-sm text-muted-foreground">
                            {description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">{standard}</td>
                      <td className="p-4 text-center font-medium text-primary">
                        {premium}
                      </td>
                      <td className="p-4 text-center font-medium text-chart-1">
                        {whiteGlove}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Success Team */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet your success team
            </h2>
            <p className="text-xl text-muted-foreground">
              Dedicated specialists focused on your success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                role: "Customer Success Manager",
                name: "Sarah Chen",
                description:
                  "Your primary point of contact for strategic guidance and account management",
                expertise: [
                  "Research workflows",
                  "Team optimization",
                  "Strategic planning",
                ],
                image: "/team/sarah-chen.jpg",
              },
              {
                role: "Technical Support Lead",
                name: "Marcus Rodriguez",
                description:
                  "Lead engineer for complex technical issues and integrations",
                expertise: [
                  "System architecture",
                  "API integrations",
                  "Performance optimization",
                ],
                image: "/team/marcus-rodriguez.jpg",
              },
              {
                role: "Training Specialist",
                name: "Dr. Emily Watson",
                description:
                  "PhD researcher who creates custom training for your team's needs",
                expertise: [
                  "User adoption",
                  "Best practices",
                  "Custom workflows",
                ],
                image: "/team/emily-watson.jpg",
              },
            ].map(({ role, name, description, expertise }) => (
              <Card key={name}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-1 mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-semibold text-lg">{name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">
                    {role}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {description}
                  </p>
                  <div className="space-y-1">
                    <h4 className="font-medium text-xs">Expertise:</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {expertise.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support CTA */}
        <section id="contact-support" className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to upgrade your support experience?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get the peace of mind that comes with enterprise-grade support for
              your research operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href="/contact-support"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  Contact Support Sales
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="#support-plans" className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Compare Support Plans
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
