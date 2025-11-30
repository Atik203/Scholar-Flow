"use client";
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

const faqs = [
  {
    question: "How does ScholarFlow's AI-powered search work?",
    answer:
      "Our semantic search uses advanced embeddings to understand the meaning behind your queries, not just keywords. When you search for a concept, ScholarFlow finds relevant passages across all your papers, even if they use different terminology. It's like having a research assistant who has read every paper in your library.",
    category: "AI Features",
  },
  {
    question: "Can I collaborate with my research team in real-time?",
    answer:
      "Absolutely! ScholarFlow is built for collaboration. You can create shared workspaces, add team members with different permission levels, annotate papers together, and see each other's highlights and notes in real-time. All changes sync instantly across devices.",
    category: "Collaboration",
  },
  {
    question: "What file formats are supported for paper uploads?",
    answer:
      "We support PDF, DOC, DOCX, and TXT files. Our intelligent parser automatically extracts text, identifies document structure, and generates embeddings for semantic search. Bulk uploads are supported, and metadata is extracted automatically when available.",
    category: "Getting Started",
  },
  {
    question: "Is my research data secure?",
    answer:
      "Security is our top priority. All data is encrypted at rest and in transit using AES-256 encryption. We're SOC 2 Type II certified, GDPR compliant, and offer SSO integration for enterprise customers. Your research never leaves our secure infrastructure unless you explicitly export it.",
    category: "Security",
  },
  {
    question: "How does the citation generator work?",
    answer:
      "Simply select any paper in your library, and ScholarFlow can generate citations in over 50 styles including APA, MLA, Chicago, IEEE, and more. Export to BibTeX, Word, or copy directly to your clipboard. Citations are automatically formatted and can be bulk exported for your entire collection.",
    category: "Features",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "The 14-day free trial includes full access to all Pro features: unlimited papers, AI summaries, semantic search, team collaboration (up to 5 members), and priority support. No credit card required to start. Cancel anytime during the trial.",
    category: "Pricing",
  },
  {
    question: "Can I import papers from Zotero, Mendeley, or EndNote?",
    answer:
      "Yes! We support direct imports from Zotero, Mendeley, EndNote, and other reference managers. Simply export your library and import it into ScholarFlow. We'll preserve your folder structure, tags, and notes. One-click sync is coming soon.",
    category: "Integration",
  },
  {
    question: "How does the AI summarization feature work?",
    answer:
      "Our AI reads your papers and generates concise summaries highlighting key findings, methodology, and conclusions. You can ask follow-up questions about any paper, compare multiple papers, and get AI-powered insights about research trends across your collection.",
    category: "AI Features",
  },
];

const categories = ["All", ...new Set(faqs.map((faq) => faq.category))];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section
      id="faq"
      className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,var(--primary)_0%,transparent_50%)] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,var(--chart-1)_0%,transparent_50%)] opacity-5" />

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
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Common Questions</span>
          </motion.div>

          <h2
            id="faq-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about ScholarFlow. Can't find what
            you're looking for? Chat with our support team.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card border border-border hover:border-primary/30 hover:bg-card/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "border-primary/30 bg-gradient-to-r from-primary/5 to-chart-1/5 shadow-lg"
                      : "border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card/80"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          openIndex === index
                            ? "bg-gradient-to-br from-primary to-chart-1 text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-primary/70 mb-1 block">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-foreground">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-colors ${
                          openIndex === index
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pl-20">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-card/80 to-card/60 border border-border/50 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-1">Still have questions?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is here to help 24/7
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
