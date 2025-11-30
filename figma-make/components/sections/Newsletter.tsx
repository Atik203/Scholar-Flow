"use client";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  Mail,
  Newspaper,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

const stats = [
  { label: "Newsletter Subscribers", value: "25K+", icon: Mail },
  { label: "Articles Published", value: "150+", icon: BookOpen },
  { label: "Monthly Readers", value: "100K+", icon: User },
];

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section
      id="newsletter"
      className="py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--primary)_0%,transparent_50%)] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,var(--chart-1)_0%,transparent_50%)] opacity-5" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Newspaper className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Research Insights</span>
          </motion.div>

          <h2
            id="newsletter-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Stay ahead with{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              research trends
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Get weekly insights on AI in research, productivity tips, and
            exclusive feature updates. Join 25,000+ researchers.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/50 border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="relative p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-chart-1/10 to-purple-500/10 border border-primary/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-chart-1/20 to-transparent rounded-full blur-2xl" />

            <div className="relative">
              {!isSubscribed ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Weekly Newsletter
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-6">
                    Join the ScholarFlow community
                  </h3>
                  <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex-1 relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                    >
                      Subscribe
                    </motion.button>
                  </form>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    No spam, unsubscribe anytime. Read our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    You're subscribed! 🎉
                  </h3>
                  <p className="text-muted-foreground">
                    Check your inbox to confirm your subscription.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
