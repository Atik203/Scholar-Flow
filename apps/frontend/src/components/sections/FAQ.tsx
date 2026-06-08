"use client";

import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

const faqs = [
  {
    question: "What file formats does ScholarFlow support?",
    answer: "We support PDF, DOCX, DOC, and TXT files up to 50MB each. For PDFs, we use OCR to extract text from scanned documents. You can also import papers directly from arXiv, DOI, or Semantic Scholar using our metadata extraction pipeline.",
  },
  {
    question: "How does the AI summary feature work?",
    answer: "Our AI engine uses large language models to generate concise summaries of uploaded papers. It extracts key claims, methodology, findings, and limitations. All summaries are clearly marked as AI-generated and should be used as a starting point for your review, not a substitute for reading the original paper.",
  },
  {
    question: "Is my research data secure and private?",
    answer: "Absolutely. We use AWS S3 with server-side encryption (SSE-S3) for all file storage. Your data is never used to train AI models. Enterprise plans include additional security features like SSO, audit logs, and custom data retention policies. We are SOC 2 Type II certified and GDPR compliant.",
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! You can create workspaces, invite team members with role-based access (Viewer, Editor, Manager, Owner), and share collections. Real-time collaboration features include shared annotations, threaded discussions, and activity feeds. Enterprise plans support unlimited workspaces and team members.",
  },
  {
    question: "What is the difference between plans?",
    answer: "The Free plan includes 5 papers, basic search, and personal collections. Pro adds unlimited papers, AI summaries, semantic search, and 3 team members. Institutional includes unlimited everything, SSO, admin dashboard, priority support, and custom integrations. All plans include a 14-day free trial.",
  },
  {
    question: "How accurate is the semantic search?",
    answer: "Our semantic search uses pgvector and sentence-transformers embeddings to find papers based on conceptual similarity, not just keyword matching. In benchmarks, it achieves 94% precision at top-5 results for academic queries. The search understands context, synonyms, and domain-specific terminology.",
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your papers, collections, annotations, and notes in standard formats (PDF, DOCX, JSON, CSV). Citation exports support BibTeX, APA, MLA, Chicago, IEEE, and Harvard formats. Enterprise plans include automated backup and custom export pipelines.",
  },
  {
    question: "Do you offer institutional pricing?",
    answer: "Yes, we offer significant discounts for universities, research institutions, and enterprise teams. Contact our sales team for a custom quote based on your organization's size, usage patterns, and integration requirements. We also offer flexible billing (annual, monthly, or usage-based) for large deployments.",
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about ScholarFlow. Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-border/50 bg-gradient-to-b from-card/80 via-card/60 to-background/40 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
