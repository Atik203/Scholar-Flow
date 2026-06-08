"use client";
import { motion } from "motion/react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Terms of Service
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
            <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using ScholarFlow, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree not to use the
              platform for any unlawful purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of all content you upload to ScholarFlow. We claim no
              intellectual property rights over your research papers or data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted service.
              We reserve the right to modify or discontinue features with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScholarFlow shall not be liable for any indirect, incidental, or consequential
              damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, contact us at legal@scholarflow.com.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
