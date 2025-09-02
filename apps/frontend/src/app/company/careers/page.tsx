"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Coffee,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Rocket,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const openPositions = [
  {
    title: "Senior AI Research Scientist",
    department: "AI Research",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: "Hybrid",
    description:
      "Lead research on large language models for academic paper understanding and semantic search.",
    requirements: [
      "PhD in CS/ML/AI",
      "5+ years experience",
      "Publications in top venues",
      "Python/PyTorch",
    ],
    salary: "$180,000 - $250,000",
  },
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    description:
      "Build beautiful, responsive research interfaces using React, TypeScript, and modern web technologies.",
    requirements: [
      "5+ years React/TypeScript",
      "Design system experience",
      "Performance optimization",
      "Testing",
    ],
    salary: "$140,000 - $180,000",
  },
  {
    title: "Product Manager - Research Tools",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    remote: "Hybrid",
    description:
      "Drive product strategy for our core research productivity tools and AI-powered features.",
    requirements: [
      "3+ years PM experience",
      "Technical background",
      "User research skills",
      "B2B SaaS",
    ],
    salary: "$130,000 - $170,000",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "London, UK",
    type: "Full-time",
    remote: "Remote",
    description:
      "Scale our infrastructure to support millions of researchers worldwide with enterprise-grade reliability.",
    requirements: [
      "Kubernetes experience",
      "AWS/GCP",
      "CI/CD pipelines",
      "Monitoring & observability",
    ],
    salary: "£70,000 - £95,000",
  },
  {
    title: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: "Hybrid",
    description:
      "Design intuitive research workflows that help academics and industry researchers work more efficiently.",
    requirements: [
      "3+ years UX design",
      "Research experience",
      "Figma/Sketch",
      "User testing",
    ],
    salary: "$110,000 - $140,000",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    description:
      "Help research institutions and enterprises get maximum value from ScholarFlow.",
    requirements: [
      "2+ years CS experience",
      "Technical aptitude",
      "Academic background preferred",
      "Communication skills",
    ],
    salary: "$80,000 - $110,000",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description:
      "Comprehensive health, dental, and vision insurance. Mental health support and wellness stipend.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description:
      "$5,000 annual learning budget. Conference attendance, courses, and professional development.",
  },
  {
    icon: Home,
    title: "Flexible Work",
    description:
      "Remote-first culture with flexible hours. Co-working space allowance and home office setup.",
  },
  {
    icon: Coffee,
    title: "Time Off",
    description:
      "Unlimited PTO, 12 company holidays, and quarterly company-wide rest weeks.",
  },
  {
    icon: Rocket,
    title: "Equity & Growth",
    description:
      "Equity participation in our mission. Career growth paths and internal mobility opportunities.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Work with researchers worldwide. Annual team retreats and regular virtual social events.",
  },
];

const values = [
  {
    title: "Research First",
    description:
      "Every decision is guided by what helps researchers do their best work.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    title: "Intellectual Curiosity",
    description:
      "We encourage deep thinking, questioning assumptions, and continuous learning.",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    title: "Collaboration",
    description:
      "Great research happens through collaboration. We work together to solve hard problems.",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    title: "Impact Focus",
    description:
      "We measure success by the breakthroughs our users achieve, not vanity metrics.",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
];

const stats = [
  { value: "100+", label: "Team Members" },
  { value: "15+", label: "Countries" },
  { value: "50%", label: "PhD Holders" },
  { value: "4.9/5", label: "Glassdoor Rating" },
];

export default function CareersPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-1/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              Join the{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Research Revolution
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Help us build the future of research. Join a team of researchers,
              engineers, and designers passionate about accelerating human
              knowledge and scientific discovery.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
              >
                <Link href="#open-positions">
                  <Briefcase className="mr-2 h-5 w-5" />
                  View Open Positions
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-4">
                <Link href="/company/about">
                  <Users className="mr-2 h-5 w-5" />
                  Meet the Team
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Why Work at ScholarFlow?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a mission-driven team building tools that accelerate human
              knowledge
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6">
                Shape the Future of Research
              </h3>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  You'll work on cutting-edge AI technology that directly
                  impacts how millions of researchers discover, understand, and
                  build upon knowledge. Every feature you build accelerates
                  scientific discovery.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our team includes PhD researchers, former Google/Meta
                  engineers, and design leaders from top tech companies. You'll
                  learn from domain experts while building products that matter.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className={`p-4 rounded-lg ${value.color}`}
                  >
                    <h4 className="font-semibold mb-1">{value.title}</h4>
                    <p className="text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format"
                    alt="Team collaboration"
                    width={600}
                    height={400}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We invest in our team's well-being, growth, and success
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing team and help shape the future of research
            </p>
          </motion.div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-semibold">
                            {position.title}
                          </h3>
                          <Badge variant="secondary">
                            {position.department}
                          </Badge>
                          <Badge variant="outline">{position.type}</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            {position.remote}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {position.salary}
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3">
                          {position.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {position.requirements.map((req) => (
                            <Badge
                              key={req}
                              variant="outline"
                              className="text-xs"
                            >
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button className="whitespace-nowrap">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="whitespace-nowrap">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Don't see a perfect fit?
                </h3>
                <p className="text-muted-foreground mb-6">
                  We're always looking for exceptional talent. Send us your
                  resume and tell us how you'd like to contribute to advancing
                  research.
                </p>
                <Button variant="outline" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Send General Application
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Our Hiring Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A transparent and respectful process designed to find the best
              mutual fit
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Application Review",
                  description:
                    "We review your application and respond within 1 week. We look for passion, experience, and cultural fit.",
                  duration: "1 week",
                },
                {
                  step: "2",
                  title: "Initial Screening",
                  description:
                    "30-minute conversation with our talent team to discuss your background and interest in ScholarFlow.",
                  duration: "30 minutes",
                },
                {
                  step: "3",
                  title: "Technical/Role Interview",
                  description:
                    "Deep dive into your technical skills or role-specific expertise with the hiring manager and team members.",
                  duration: "1-2 hours",
                },
                {
                  step: "4",
                  title: "Team & Culture Fit",
                  description:
                    "Meet with potential teammates and leaders to ensure mutual cultural alignment and collaboration potential.",
                  duration: "45 minutes",
                },
                {
                  step: "5",
                  title: "Final Decision",
                  description:
                    "We make a decision within 3 days and provide detailed feedback regardless of outcome.",
                  duration: "3 days",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex gap-8 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-1 text-primary-foreground font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </div>
                    {index < 4 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-primary/50 to-chart-1/50 mt-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                          <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                            {item.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/5),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us in building the future of research. Help accelerate human
              knowledge and scientific discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="#open-positions">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Open Roles
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-4 border-border bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300"
              >
                <Link href="/company/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Questions? Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
