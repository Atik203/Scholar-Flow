"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum(["general", "demo", "support", "partnership"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    value: "hello@scholarflow.ai",
    href: "mailto:hello@scholarflow.ai",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team during business hours",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with support Monday-Friday, 9am-6pm PST",
    value: "Available now",
    href: "#",
  },
  {
    icon: Calendar,
    title: "Schedule Demo",
    description: "Book a personalized demo with our product team",
    value: "30-min sessions",
    href: "/demo",
  },
];

const officeLocations = [
  {
    city: "San Francisco",
    address: "123 Research Drive, Suite 400\nSan Francisco, CA 94105",
    timezone: "PST",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
  },
  {
    city: "Boston",
    address: "456 Innovation Ave, Floor 8\nBoston, MA 02115",
    timezone: "EST",
    image:
      "https://images.unsplash.com/photo-1554047675-c2e9b6b86e92?w=400&h=300&fit=crop&auto=format",
  },
  {
    city: "London",
    address: "789 Academic Square\nLondon EC1A 1BB, UK",
    timezone: "GMT",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&auto=format",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form submitted:", data);
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
    setIsSubmitting(false);
  };

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
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Ready to revolutionize your research workflow? We'd love to hear
              from you. Reach out to discuss how ScholarFlow can accelerate your
              team's productivity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the method that works best for you
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {method.description}
                </p>
                <p className="text-primary font-medium">{method.value}</p>

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      {...register("company")}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      {...register("inquiryType")}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request Demo</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      {...register("subject")}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Brief subject line"
                    />
                    {errors.subject && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder="Tell us more about your needs..."
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Our Offices</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Visit us at one of our global locations or schedule a virtual
                  meeting.
                </p>

                <div className="space-y-8">
                  {officeLocations.map((office, index) => (
                    <motion.div
                      key={office.city}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-500"
                    >
                      <div className="grid md:grid-cols-2">
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h4 className="text-lg font-semibold">
                              {office.city}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              ({office.timezone})
                            </span>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {office.address}
                          </p>
                          <div className="flex items-center gap-2 mt-4 text-sm text-primary">
                            <Clock className="h-4 w-4" />
                            Mon-Fri 9AM-6PM
                          </div>
                        </div>
                        <div className="relative h-48 md:h-auto">
                          <img
                            src={office.image}
                            alt={`${office.city} office`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-12 p-6 rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 to-chart-1/5">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Need Quick Answers?</h4>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Check out our FAQ section for instant answers to common
                    questions.
                  </p>
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Browse FAQ →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
