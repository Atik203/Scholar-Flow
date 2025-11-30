"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CreditCard,
  HelpCircle,
  Rocket,
  Search,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";

interface FAQPageProps {
  onNavigate?: (path: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  faqs: FAQItem[];
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const categories: FAQCategory[] = [
    {
      icon: HelpCircle,
      title: "Getting Started",
      description: "New to ScholarFlow? Start here.",
      color: "primary",
      faqs: [
        {
          question: "What is ScholarFlow?",
          answer:
            "ScholarFlow is an AI-powered research paper management platform that helps researchers organize, discover, and collaborate on academic papers. It includes features like smart search, AI summaries, collections, and team collaboration.",
        },
        {
          question: "How do I create an account?",
          answer:
            "Click the 'Get Started' button on our homepage. You can sign up with your email address or use Google/GitHub authentication for faster access. No credit card is required for the free plan.",
        },
        {
          question: "Is ScholarFlow free to use?",
          answer:
            "Yes! We offer a generous free plan that includes up to 50 papers, basic organization, and essential features. For more advanced features like AI summaries and unlimited papers, you can upgrade to Pro.",
        },
        {
          question: "What file formats are supported?",
          answer:
            "ScholarFlow supports PDF files, which is the standard format for academic papers. We automatically extract metadata, abstracts, and text content for search and AI features.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Features & AI",
      description: "Learn about our powerful features.",
      color: "chart-1",
      faqs: [
        {
          question: "How does the AI summary feature work?",
          answer:
            "Our AI analyzes the full text of your papers and generates concise, accurate summaries highlighting key findings, methodology, and conclusions. You can customize summary length and focus areas.",
        },
        {
          question: "What is semantic search?",
          answer:
            "Semantic search understands the meaning of your query, not just keywords. So searching for 'machine learning in healthcare' will find papers about 'AI diagnosis' or 'neural networks for medical imaging' even if they don't contain your exact words.",
        },
        {
          question: "Can I annotate PDFs in ScholarFlow?",
          answer:
            "Yes! Pro and Team plans include PDF annotation features. You can highlight text, add notes, and share annotations with your team members.",
        },
        {
          question: "How do collections work?",
          answer:
            "Collections are like smart folders for organizing papers. You can create collections by topic, project, or any criteria. Papers can belong to multiple collections, and you can share collections with team members.",
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Pricing & Billing",
      description: "Questions about plans and payments.",
      color: "chart-2",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can pay by invoice with NET-30 terms.",
        },
        {
          question: "Can I change my plan at any time?",
          answer:
            "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle.",
        },
        {
          question: "Is there a student discount?",
          answer:
            "Yes! Students with a valid .edu email address get 50% off Pro and Team plans. Contact our support team with proof of enrollment to apply the discount.",
        },
        {
          question: "What's your refund policy?",
          answer:
            "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund, no questions asked.",
        },
      ],
    },
    {
      icon: Users,
      title: "Teams & Collaboration",
      description: "Working together on research.",
      color: "chart-3",
      faqs: [
        {
          question: "How do I invite team members?",
          answer:
            "From your team settings, click 'Invite Members' and enter their email addresses. They'll receive an invitation to join your team. You can set their role and permissions during the invite process.",
        },
        {
          question: "What roles are available for team members?",
          answer:
            "We offer three roles: Admin (full access), Member (can view and edit papers), and Viewer (read-only access). You can customize permissions for each role in team settings.",
        },
        {
          question: "Can I share collections with people outside my team?",
          answer:
            "Yes! You can create public links to share collections with anyone. You can also set permissions for external viewers, including view-only or commenting access.",
        },
        {
          question: "How does real-time collaboration work?",
          answer:
            "Team members can work on the same collection simultaneously. Changes sync in real-time, and you'll see who's currently viewing or editing. Comments and annotations are also shared instantly.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keeping your research safe.",
      color: "chart-4",
      faqs: [
        {
          question: "How is my data protected?",
          answer:
            "All data is encrypted at rest and in transit using AES-256 encryption. We use SOC 2 certified infrastructure and conduct regular security audits. Your papers are stored securely in geographically distributed data centers.",
        },
        {
          question: "Who can access my papers?",
          answer:
            "Only you and team members you explicitly grant access to can see your papers. We never share your research with third parties or use it for training AI models.",
        },
        {
          question: "Is ScholarFlow GDPR compliant?",
          answer:
            "Yes, we are fully GDPR compliant. You can export or delete all your data at any time. We also offer data residency options for EU customers on Enterprise plans.",
        },
        {
          question: "Do you offer SSO/SAML?",
          answer:
            "Yes, Enterprise plans include SSO/SAML integration with identity providers like Okta, Azure AD, and Google Workspace. This enables secure, centralized authentication for your organization.",
        },
      ],
    },
    {
      icon: Settings,
      title: "Technical & API",
      description: "Developer and integration questions.",
      color: "chart-5",
      faqs: [
        {
          question: "Does ScholarFlow have an API?",
          answer:
            "Yes! We offer a comprehensive REST API for Pro and higher plans. You can programmatically manage papers, collections, and search. Full documentation is available at docs.scholarflow.io/api.",
        },
        {
          question: "What integrations are available?",
          answer:
            "We integrate with Zotero, Mendeley, EndNote, Google Drive, Dropbox, and more. Enterprise plans can request custom integrations with internal systems.",
        },
        {
          question: "Can I import papers from other tools?",
          answer:
            "Yes! We support importing from Zotero, Mendeley, EndNote, and BibTeX files. You can also bulk upload PDFs directly to your library.",
        },
        {
          question: "Is there a browser extension?",
          answer:
            "Yes! Our Chrome and Firefox extensions let you save papers directly from the web with one click. The extension automatically extracts metadata and adds papers to your library.",
        },
      ],
    },
  ];

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) =>
      selectedCategory ? category.title === selectedCategory : true
    );

  const totalFAQs = filteredCategories.reduce(
    (acc, cat) => acc + cat.faqs.length,
    0
  );

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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-6">
                How can we help you?
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Find answers to common questions about ScholarFlow features,
                pricing, and more.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Selection */}
        <section className="py-8">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 hover:bg-primary/10 border border-border"
                }`}
              >
                All Questions
              </button>
              {categories.map(({ title, icon: Icon, color }) => (
                <button
                  key={title}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === title ? null : title
                    )
                  }
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === title
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 hover:bg-primary/10 border border-border"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${selectedCategory === title ? "text-primary-foreground" : `text-${color}`}`}
                  />
                  {title}
                </button>
              ))}
            </div>

            {searchQuery && (
              <p className="text-center mt-4 text-muted-foreground">
                Found {totalFAQs} results for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {filteredCategories.map(
                ({ icon: Icon, title, description, color, faqs }) =>
                  faqs.length > 0 && (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}
                        >
                          <Icon className={`h-6 w-6 text-${color}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{title}</h2>
                          <p className="text-muted-foreground">{description}</p>
                        </div>
                      </div>

                      <div className="space-y-4 max-w-4xl">
                        {faqs.map(({ question, answer }, index) => {
                          const faqId = `${title}-${question}`;
                          const isOpen = openFAQs.has(faqId);

                          return (
                            <motion.div
                              key={question}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.6,
                              }}
                              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-500"
                            >
                              <button
                                onClick={() => toggleFAQ(faqId)}
                                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div
                                      className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${color}/20 to-chart-1/20 border border-${color}/30 flex items-center justify-center`}
                                    >
                                      <Icon
                                        className={`h-4 w-4 text-${color}`}
                                      />
                                    </div>
                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                      {question}
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
                                      {answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )
              )}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still need help?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Can&apos;t find what you&apos;re looking for? Our support team
                is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground"
                  onClick={() => onNavigate?.("/company/contact")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate?.("/resources/docs")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Documentation
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
