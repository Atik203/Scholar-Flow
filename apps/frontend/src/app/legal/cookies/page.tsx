"use client";
import { motion } from "motion/react";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Cookie className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Cookies Policy
          </h1>
          <p className="text-muted-foreground mb-2">Last updated: January 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-gray dark:prose-invert max-w-none mt-12 space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help
              us provide a better experience by remembering your preferences and session information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication and security, preference cookies to remember
              your settings, and analytics cookies to understand how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Essential:</strong> Required for basic platform functionality including authentication</li>
              <li><strong>Preference:</strong> Remember your theme, language, and display settings</li>
              <li><strong>Analytics:</strong> Help us improve the platform by understanding usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies through your browser settings. Disabling essential
              cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use limited third-party cookies for analytics (Vercel Analytics) and authentication
              (OAuth providers). These services have their own privacy policies.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
