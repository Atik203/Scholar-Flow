"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Check,
  Rocket,
  Scale,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "@/redux/auth/useAuth";
import Link from "next/link";

export default function EnterprisePage() {
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
                <Building2 className="h-4 w-4" />
                Enterprise Solutions 31
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Research at enterprise scale
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Powerful research management solutions designed for large
                organizations, universities, and research institutions with
                advanced security, compliance, and collaboration features.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#contact-sales"
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-5 w-5" />
                    Contact Sales
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link
                    href="#enterprise-demo"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-5 w-5" />
                    Request Demo
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
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Unlimited Scale</h3>
                      <p className="text-muted-foreground">
                        Support for millions of papers and thousands of users.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Shield className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Enterprise Security
                      </h3>
                      <p className="text-muted-foreground">
                        SOC 2, GDPR compliance with advanced access controls.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Zap className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibent text-lg">
                        Custom Integration
                      </h3>
                      <p className="text-muted-foreground">
                        Seamless integration with existing research systems.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for enterprise requirements
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything your organization needs to manage research at scale
              with security, compliance, and performance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Security",
                description:
                  "SOC 2 Type II, GDPR compliance, SSO integration, and enterprise-grade encryption.",
                features: [
                  "Single Sign-On (SSO)",
                  "Role-based Access Control",
                  "Data Encryption",
                  "Audit Logs",
                  "Regular Security Audits",
                ],
              },
              {
                icon: Scale,
                title: "Unlimited Scale",
                description:
                  "Handle millions of research papers with high-performance infrastructure and global CDN.",
                features: [
                  "Unlimited Storage",
                  "Global CDN",
                  "99.99% Uptime SLA",
                  "Auto-scaling",
                  "High Availability"
                ],
              },
              {
                icon: Users,
                title: "Team Management",
                description:
                  "Sophisticated user management with departments, permissions, and collaboration tools.",
                features: [
                  "Department Organization",
                  "Custom User Roles",
                  "Team Analytics",
                  "Bulk Operations",
                  "Collaboration Tools",
                ],
              },
              {
                icon: Zap,
                title: "Custom Integrations",
                description:
                  "Connect with existing research systems, databases, and institutional repositories.",
                features: [
                  "API Access",
                  "Webhook Support",
                  "LDAP/AD Integration",
                  "Custom Connectors",
                  "Data Import Services",
                ],
              },
              {
                icon: Building2,
                title: "White-label Options",
                description:
                  "Brand the platform with your institution's identity and custom domain.",
                features: [
                  "Custom Branding",
                  "Custom Domain",
                  "White-label UI",
                  "Institutional SSO",
                  "Branded Email Notifications",
                ],
              },
              {
                icon: Check,
                title: "Premium Support",
                description:
                  "24/7 dedicated support with guaranteed response times and account management.",
                features: [
                  "24/7 Priority Support",
                  "Dedicated Account Manager",
                  "Training Sessions",
                  "Implementation Support",
                  "Regular Check-ins",
                ],
              },
            ].map(({ icon: Icon, title, description, features }) => (
              <Card key={title} className="hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-chart-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enterprise Pricing */}
        <section className="py-16 md:py-24 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise pricing plans
            </h2>
            <p className="text-xl text-muted-foreground">
              Flexible pricing options designed for organizations of all sizes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Professional",
                price: "$49",
                period: "per user/month",
                description: "Perfect for research teams and small departments",
                features: [
                  "Up to 50 users",
                  "10GB per user storage",
                  "Advanced search & AI",
                  "Team collaboration",
                  "Email support",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "per user/month",
                description: "Comprehensive solution for large organizations",
                features: [
                  "Unlimited users",
                  "Unlimited storage",
                  "Custom integrations",
                  "SSO & advanced security",
                  "Priority support",
                ],
                cta: "Contact Sales",
                popular: true,
              },
              {
                name: "Enterprise+",
                price: "Custom",
                period: "pricing",
                description: "Tailored solutions for complex requirements",
                features: [
                  "White-label options",
                  "On-premise deployment",
                  "Custom development",
                  "Dedicated support",
                  "SLA guarantees",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map(
              ({
                name,
                price,
                period,
                description,
                features,
                cta,
                popular,
              }) => (
                <Card
                  key={name}
                  className={`relative ${popular ? "ring-2 ring-primary" : ""}`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold mb-2">{name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">{price}</span>
                        <span className="text-muted-foreground">/{period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-chart-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={popular ? "gradient" : "outline"}
                    >
                      {cta}
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by leading organizations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how top research institutions are transforming their workflows
              with ScholarFlow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "ScholarFlow transformed our research collaboration. Our publication rate increased by 40% in the first year.",
                author: "Dr. Sarah Wilson",
                title: "Research Director",
                company: "Global University",
                logo: "🏛️",
              },
              {
                quote:
                  "The enterprise security features gave us confidence to digitize our entire research library safely.",
                author: "Prof. Michael Chen",
                title: "CTO",
                company: "Tech Research Institute",
                logo: "🔬",
              },
              {
                quote:
                  "Implementation was seamless. Their team worked closely with our IT department every step of the way.",
                author: "Lisa Rodriguez",
                title: "IT Manager",
                company: "Medical Research Center",
                logo: "🏥",
              },
              {
                quote:
                  "The ROI was immediate. We saved thousands of hours in research organization and discovery.",
                author: "Dr. James Park",
                title: "Department Head",
                company: "Innovation Labs",
                logo: "💡",
              },
            ].map(({ quote, author, title, company, logo }) => (
              <Card key={author} className="p-6">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{logo}</div>
                  <blockquote className="text-lg mb-4">"{quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{author}</div>
                    <div className="text-sm text-muted-foreground">
                      {title}, {company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact-sales" className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your research organization?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss how ScholarFlow Enterprise can meet your specific
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link href="/contact-sales" className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Contact Sales Team
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link
                  href="/enterprise/demo"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Schedule Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
