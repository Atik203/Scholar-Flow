"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Coffee,
  Globe,
  GraduationCap,
  Heart,
  Rocket,
  Users,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface CareersPageProps {
  onNavigate?: (path: string) => void;
}

export function CareersPage({ onNavigate }: CareersPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-sm font-medium mb-6">
                <Briefcase className="h-4 w-4" />
                Join Our Team
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent mb-6">
                Build the future of research
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Join a passionate team transforming how millions of researchers
                discover, organize, and share knowledge.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                View Open Positions
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us */}
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
                Why join ScholarFlow?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We offer more than just a job — we offer a mission and
                community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Remote First",
                  description:
                    "Work from anywhere in the world. We believe great talent isn't bound by geography.",
                  color: "primary",
                },
                {
                  icon: Heart,
                  title: "Health & Wellness",
                  description:
                    "Comprehensive health coverage, mental health support, and wellness programs.",
                  color: "chart-1",
                },
                {
                  icon: GraduationCap,
                  title: "Learning Budget",
                  description:
                    "Annual learning stipend for courses, conferences, and professional development.",
                  color: "chart-2",
                },
                {
                  icon: Coffee,
                  title: "Work-Life Balance",
                  description:
                    "Flexible hours, unlimited PTO, and respect for your personal time.",
                  color: "chart-3",
                },
                {
                  icon: Users,
                  title: "Equity Ownership",
                  description:
                    "All employees receive equity, making everyone an owner in our success.",
                  color: "chart-4",
                },
                {
                  icon: Building2,
                  title: "Modern Stack",
                  description:
                    "Work with cutting-edge technologies and shape our technical direction.",
                  color: "chart-5",
                },
              ].map(({ icon: Icon, title, description, color }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}
                      >
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{title}</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
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
                Open Positions
              </h2>
              <p className="text-xl text-muted-foreground">
                Find your next role at ScholarFlow
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  title: "Senior Full-Stack Engineer",
                  department: "Engineering",
                  location: "Remote",
                  type: "Full-time",
                },
                {
                  title: "Machine Learning Engineer",
                  department: "AI/ML",
                  location: "Remote",
                  type: "Full-time",
                },
                {
                  title: "Product Designer",
                  department: "Design",
                  location: "Remote",
                  type: "Full-time",
                },
                {
                  title: "DevOps Engineer",
                  department: "Infrastructure",
                  location: "Remote",
                  type: "Full-time",
                },
                {
                  title: "Customer Success Manager",
                  department: "Customer Success",
                  location: "Remote (US)",
                  type: "Full-time",
                },
                {
                  title: "Technical Writer",
                  department: "Documentation",
                  location: "Remote",
                  type: "Contract",
                },
              ].map(({ title, department, location, type }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                            {title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {department}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {location}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {type}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                        >
                          Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50+", label: "Team Members", color: "primary" },
                { value: "15+", label: "Countries", color: "chart-1" },
                { value: "4.8", label: "Glassdoor Rating", color: "chart-2" },
                { value: "95%", label: "Retention Rate", color: "chart-3" },
              ].map(({ value, label, color }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div
                    className={`text-4xl md:text-5xl font-bold text-${color} mb-2`}
                  >
                    {value}
                  </div>
                  <div className="text-muted-foreground">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                Don&apos;t see your role?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                We&apos;re always looking for exceptional talent. Send us your
                resume and we&apos;ll keep you in mind for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-primary-foreground"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Send Your Resume
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/company/about")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn About Us
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
