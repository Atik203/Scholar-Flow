"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former Stanford professor with 15+ years in AI research. PhD in Computer Science, published 50+ papers on natural language processing.",
    image: "https://i.pravatar.cc/400?img=1",
    linkedin: "#",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "CTO & Co-founder",
    bio: "Ex-Google Research scientist specializing in machine learning systems. Led AI teams at scale, passionate about democratizing research tools.",
    image: "https://i.pravatar.cc/400?img=3",
    linkedin: "#",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Product",
    bio: "Former researcher turned product leader. PhD in Cognitive Science, understands researcher workflows and pain points intimately.",
    image: "https://i.pravatar.cc/400?img=5",
    linkedin: "#",
  },
  {
    name: "David Kim",
    role: "Head of Engineering",
    bio: "Full-stack architect with expertise in distributed systems. Previously built research platforms at Microsoft Research and Meta.",
    image: "https://i.pravatar.cc/400?img=7",
    linkedin: "#",
  },
  {
    name: "Dr. Aisha Patel",
    role: "Head of AI Research",
    bio: "AI researcher focused on academic applications. PhD from MIT, former postdoc at OpenAI, published extensively on language models.",
    image: "https://i.pravatar.cc/400?img=9",
    linkedin: "#",
  },
  {
    name: "James Thompson",
    role: "Head of Design",
    bio: "Design leader passionate about researcher experience. Previously designed tools at Notion and Figma, understands complex workflows.",
    image: "https://i.pravatar.cc/400?img=11",
    linkedin: "#",
  },
];

const values = [
  {
    icon: Target,
    title: "Research First",
    description:
      "Every decision we make is guided by what helps researchers do their best work. We're researchers building for researchers.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We push the boundaries of what's possible with AI while maintaining the rigor and accuracy that research demands.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Science advances through collaboration. We build tools that bring researchers together and amplify collective intelligence.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Cutting-edge research tools shouldn't be limited to well-funded institutions. We democratize access to powerful AI research tools.",
  },
  {
    icon: Heart,
    title: "Empathy",
    description:
      "We understand the challenges researchers face because we've lived them. Our solutions come from genuine empathy and experience.",
  },
  {
    icon: Zap,
    title: "Impact",
    description:
      "We measure success by the breakthroughs our users achieve. Every feature is designed to accelerate discovery and innovation.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "Founded",
    description:
      "Started by researchers frustrated with existing tools, backed by leading academic institutions and VCs.",
  },
  {
    year: "2023",
    title: "Beta Launch",
    description:
      "Launched closed beta with 100 researchers from top universities. Achieved 90% weekly active usage.",
  },
  {
    year: "2023",
    title: "AI Breakthrough",
    description:
      "Developed proprietary semantic search technology that outperforms traditional keyword-based systems by 300%.",
  },
  {
    year: "2024",
    title: "Public Launch",
    description:
      "Opened to the public with 10,000+ researchers in the first month. Featured in Nature, Science, and IEEE publications.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    description:
      "Expanded to support 40+ languages and established partnerships with major research institutions worldwide.",
  },
  {
    year: "2025",
    title: "Enterprise Growth",
    description:
      "Serving 500+ research institutions globally. Trusted by top pharma companies and government research labs.",
  },
];

const stats = [
  { value: "50,000+", label: "Active Researchers" },
  { value: "2M+", label: "Papers Analyzed" },
  { value: "500+", label: "Institutions" },
  { value: "40+", label: "Countries" },
];

export default function AboutPage() {
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
              About{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                ScholarFlow
              </span>
            </h1>
                          <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
                We&apos;re on a mission to accelerate human knowledge by building
                AI-powered tools that help researchers discover, understand, and
                build upon existing knowledge faster than ever before.
              </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Research is the engine of human progress, but researchers spend
                too much time on tedious tasks instead of groundbreaking
                discovery. We believe AI can change that.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                ScholarFlow was born from our own frustrations as researchers.
                We spent countless hours searching through papers, organizing
                references, and trying to keep track of complex research
                threads. We knew there had to be a better way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Democratize access to research tools
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Accelerate scientific discovery
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Foster global research collaboration
                  </span>
                </div>
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
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format"
                    alt="Research collaboration"
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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Trusted by Researchers Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform serves researchers across academia and industry
            </p>
          </motion.div>

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

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones in building the future of research
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
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
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-primary/50 to-chart-1/50 mt-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 group-hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">
                          {milestone.title}
                        </h3>
                        <span className="text-sm text-primary font-medium">
                          {milestone.year}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Researchers, engineers, and designers passionate about advancing
              human knowledge
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <Award className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Join the Research Revolution
              </h2>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the future of research. Join thousands of researchers
              already using ScholarFlow to accelerate their discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/login">Start Your Journey</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-4 border-border bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300"
              >
                <Link href="/contact">Meet the Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
