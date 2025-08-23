"use client";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  HelpCircle,
  Lock,
  Search,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    id: "general",
    name: "General",
    icon: HelpCircle,
    color: "text-blue-500",
  },
  {
    id: "features",
    name: "Features",
    icon: Zap,
    color: "text-primary",
  },
  {
    id: "pricing",
    name: "Pricing & Billing",
    icon: CreditCard,
    color: "text-green-500",
  },
  {
    id: "collaboration",
    name: "Team & Collaboration",
    icon: Users,
    color: "text-purple-500",
  },
  {
    id: "security",
    name: "Security & Privacy",
    icon: Lock,
    color: "text-red-500",
  },
  {
    id: "technical",
    name: "Technical",
    icon: Settings,
    color: "text-orange-500",
  },
];

const faqs = [
  // General
  {
    category: "general",
    question: "What is ScholarFlow?",
    answer:
      "ScholarFlow is an AI-powered research collaboration platform that helps researchers organize, annotate, and collaborate on academic papers. It combines semantic search, intelligent summaries, and collaborative tools to accelerate research workflows.",
  },
  {
    category: "general",
    question: "Who is ScholarFlow designed for?",
    answer:
      "ScholarFlow is built for researchers across academia and industry, including PhD students, postdocs, faculty members, research teams, and R&D departments. It's designed to support both individual researchers and collaborative teams.",
  },
  {
    category: "general",
    question: "How is ScholarFlow different from other reference managers?",
    answer:
      "Unlike traditional reference managers, ScholarFlow uses AI to provide semantic search, intelligent summaries, and contextual insights. It focuses on understanding and connecting ideas across papers rather than just organizing citations.",
  },
  {
    category: "general",
    question: "Do I need to install any software?",
    answer:
      "No! ScholarFlow is a web-based platform accessible from any modern browser. We also offer mobile apps for iOS and Android to access your research on the go.",
  },

  // Features
  {
    category: "features",
    question: "How does the AI-powered search work?",
    answer:
      "Our semantic search uses advanced language models to understand the meaning and context of your queries, not just keywords. This allows you to find relevant papers even when they use different terminology or approach topics from different angles.",
  },
  {
    category: "features",
    question: "What file formats does ScholarFlow support?",
    answer:
      "ScholarFlow supports PDF files, which covers the vast majority of academic papers. We automatically extract text, figures, tables, and metadata. We're working on support for additional formats like Word documents and PowerPoint presentations.",
  },
  {
    category: "features",
    question: "Can I import my existing library from other tools?",
    answer:
      "Yes! We support imports from Zotero, Mendeley, EndNote, and BibTeX files. You can also bulk upload PDFs and we'll automatically extract metadata and organize them for you.",
  },
  {
    category: "features",
    question: "How accurate are the AI summaries?",
    answer:
      "Our AI summaries are highly accurate for identifying key findings, methodologies, and conclusions. However, we always recommend reading the original papers for critical research decisions. The summaries are designed to help you quickly assess relevance and prioritize your reading.",
  },
  {
    category: "features",
    question: "Can I export my annotations and notes?",
    answer:
      "Absolutely! You can export your annotations, notes, and bibliographies in various formats including Word, PDF, BibTeX, and RIS. We believe in data portability and never lock you into our platform.",
  },

  // Pricing
  {
    category: "pricing",
    question: "Is there a free plan?",
    answer:
      "Yes! Our free plan allows you to upload up to 10 papers per month with basic AI summaries and personal workspace features. It's perfect for trying out ScholarFlow and light research usage.",
  },
  {
    category: "pricing",
    question: "What's included in the free trial?",
    answer:
      "All paid plans include a 14-day free trial with full access to premium features including unlimited papers, advanced AI insights, team collaboration, and priority support. No credit card required to start.",
  },
  {
    category: "pricing",
    question: "Do you offer student discounts?",
    answer:
      "Yes! We offer 50% off Pro plans for verified students and faculty members. Contact us with your institutional email address to apply for the academic discount.",
  },
  {
    category: "pricing",
    question: "Can I change my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences. There are no long-term contracts or cancellation fees.",
  },
  {
    category: "pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice with NET 30 terms.",
  },

  // Collaboration
  {
    category: "collaboration",
    question: "How does team collaboration work?",
    answer:
      "Team members can share workspaces, collaborate on annotations in real-time, and maintain synchronized knowledge bases. You can set different permission levels and track team activity to see who's contributing what insights.",
  },
  {
    category: "collaboration",
    question: "Can I control who sees what in my team?",
    answer:
      "Yes! We offer granular permission controls. You can create private workspaces, share specific collections, and set read-only or edit permissions for different team members. Enterprise plans include advanced admin controls.",
  },
  {
    category: "collaboration",
    question: "How many team members can I add?",
    answer:
      "The Pro plan supports up to 5 team members, Team plan supports unlimited members, and Enterprise plans include custom user limits. All team members get full access to collaborative features within your plan limits.",
  },
  {
    category: "collaboration",
    question: "Can external collaborators access my research?",
    answer:
      "Yes! You can invite external collaborators with specific permissions. They can view and comment on papers without needing their own ScholarFlow subscription, making it easy to collaborate with colleagues at other institutions.",
  },

  // Security
  {
    category: "security",
    question: "How secure is my research data?",
    answer:
      "We take security very seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We're SOC 2 compliant and undergo regular security audits. Your research data is never used to train AI models.",
  },
  {
    category: "security",
    question: "Where is my data stored?",
    answer:
      "Data is stored in secure data centers in the US and EU (depending on your location) with full redundancy and backup systems. Enterprise customers can choose specific data residency requirements and even on-premise deployment options.",
  },
  {
    category: "security",
    question: "Do you use my papers to train AI models?",
    answer:
      "No, never. Your uploaded papers and research data are strictly private and are never used for training AI models or shared with third parties. We use only publicly available datasets for our AI training.",
  },
  {
    category: "security",
    question: "Can I delete my data?",
    answer:
      "Yes, you have complete control over your data. You can delete individual papers, annotations, or your entire account at any time. We provide data export tools and honor all deletion requests within 30 days.",
  },

  // Technical
  {
    category: "technical",
    question: "What browsers are supported?",
    answer:
      "ScholarFlow works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience. Mobile browsers are also fully supported.",
  },
  {
    category: "technical",
    question: "Is there an API available?",
    answer:
      "Yes! Pro and higher plans include API access for integrating ScholarFlow with your existing research tools and workflows. We provide comprehensive documentation and SDKs for popular programming languages.",
  },
  {
    category: "technical",
    question: "What are the system requirements?",
    answer:
      "ScholarFlow is web-based, so you just need a modern browser and internet connection. For optimal performance, we recommend at least 4GB RAM and a stable broadband connection for large file uploads.",
  },
  {
    category: "technical",
    question: "Do you offer single sign-on (SSO)?",
    answer:
      "Yes! Team and Enterprise plans include SSO integration with popular providers like Google Workspace, Microsoft 365, Okta, and custom SAML providers. This makes it easy to integrate with your institutional authentication.",
  },
  {
    category: "technical",
    question: "What if I need help or training?",
    answer:
      "We offer multiple support channels: email support for all users, priority support for paid plans, live chat for Team/Enterprise customers, and dedicated training sessions for Enterprise accounts. We also have comprehensive documentation and video tutorials.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Find quick answers to common questions about ScholarFlow&apos;s
              features, pricing, security, and more. Can&apos;t find what
              you&apos;re looking for? Contact our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg dark:text-white dark:placeholder:text-white/60"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-xl transition-all duration-300 dark:text-white btn-hover-glow ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 hover:bg-primary/10 border border-border"
                }`}
              >
                All Questions
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 dark:text-white btn-hover-glow ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 hover:bg-primary/10 border border-border"
                  }`}
                >
                  <category.icon
                    className={`h-4 w-4 ${selectedCategory === category.id ? "text-primary-foreground" : category.color}`}
                  />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No questions found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse different
                  categories.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => {
                  const isOpen = openItems.has(index);
                  const category = faqCategories.find(
                    (cat) => cat.id === faq.category
                  );

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-500"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {category && (
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                                <category.icon
                                  className={`h-4 w-4 ${category.color}`}
                                />
                              </div>
                            )}
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                          </div>
                          <div className="ml-4">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </div>
                        </div>
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-muted-foreground leading-relaxed pl-11">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/5),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we&apos;ll
              respond within 24 hours.
            </p>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all duration-500">
                <HelpCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Comprehensive guides and tutorials
                </p>
                <a
                  href="/docs"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Browse Docs →
                </a>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all duration-500">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Connect with other researchers
                </p>
                <a
                  href="/community"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Join Community →
                </a>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all duration-500">
                <Search className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Get personalized help from our team
                </p>
                <a
                  href="/contact"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Contact Us →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
