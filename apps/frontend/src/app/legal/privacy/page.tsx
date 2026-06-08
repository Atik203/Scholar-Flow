"use client";
import { motion } from "motion/react";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Privacy Policy
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
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, including your name, email address,
              institutional affiliation, and research papers you upload to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, send technical notices and support messages, and communicate
              with you about your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using AWS S3 with encryption at rest and in transit.
              We implement industry-standard security measures to protect your information from
              unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal data. We may share anonymized, aggregated data for
              analytics purposes. Your research papers remain your intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal data at any time.
              You can export your data through your account settings. Contact us for data
              deletion requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related inquiries, contact us at privacy@scholarflow.com.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
