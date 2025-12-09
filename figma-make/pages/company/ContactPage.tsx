"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Clock,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 text-chart-2 text-sm font-medium mb-6">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent mb-6">
                We&apos;d love to hear from you
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions about ScholarFlow? Need help getting started? Our
                team is here to assist you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  description: "support@scholarflow.io",
                  action: "Send Email",
                  color: "primary",
                },
                {
                  icon: MessageSquare,
                  title: "Live Chat",
                  description: "Available 24/7",
                  action: "Start Chat",
                  color: "chart-1",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  description: "+1 (555) 123-4567",
                  action: "Call Now",
                  color: "chart-2",
                },
                {
                  icon: HelpCircle,
                  title: "Help Center",
                  description: "Browse FAQs",
                  action: "View FAQs",
                  color: "chart-3",
                },
              ].map(
                ({ icon: Icon, title, description, action, color }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                      <CardContent className="p-6">
                        <div
                          className={`w-16 h-16 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`h-8 w-8 text-${color}`} />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">{title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                        >
                          {action} <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Send us a message
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours.
                </p>

                <Card className="border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Sales</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        rows={5}
                        className="w-full px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-chart-2 to-chart-3 hover:opacity-90 text-primary-foreground"
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-6">Our Offices</h3>
                  <div className="space-y-6">
                    {[
                      {
                        city: "San Francisco",
                        address: "123 Research Ave, SF, CA 94102",
                        hours: "Mon-Fri: 9am-6pm PST",
                      },
                      {
                        city: "New York",
                        address: "456 Innovation Blvd, NY, NY 10001",
                        hours: "Mon-Fri: 9am-6pm EST",
                      },
                      {
                        city: "London",
                        address: "789 Scholar Lane, London, UK EC1A 1BB",
                        hours: "Mon-Fri: 9am-6pm GMT",
                      },
                    ].map(({ city, address, hours }) => (
                      <Card
                        key={city}
                        className="hover:shadow-md transition-shadow duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{city}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4" />
                                {address}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Clock className="h-4 w-4" />
                                {hours}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="border-2 bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-xl mb-2">
                      Global Support
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Our team is distributed globally to provide 24/7 support
                      in multiple languages.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate?.("/faq")}
                    >
                      View FAQs <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
