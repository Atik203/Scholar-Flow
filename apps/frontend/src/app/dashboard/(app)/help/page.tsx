"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronDown,
  Keyboard,
  LifeBuoy,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "How do I upload a research paper?",
    answer:
      "Navigate to the Papers section from the sidebar and click \"Upload Paper.\" You can drag and drop a PDF file or select one from your computer. Scholar-Flow will automatically extract the title, authors, and abstract using AI.",
  },
  {
    question: "How do I share a collection with my team?",
    answer:
      "Open the collection you want to share, click the \"Share\" button in the top-right corner, enter your teammate's email address, and choose their permission level (View or Edit). They will receive an email invitation.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "You can export your papers and citations in CSV and JSON formats from the Settings > Export page. PDF exports for documents edited in the text editor are available from the editor toolbar.",
  },
  {
    question: "How does semantic search work?",
    answer:
      "Semantic search uses AI embeddings (pgvector) to find papers based on meaning rather than exact keywords. Type a natural language query in the search bar, and Scholar-Flow will surface the most relevant papers even if they don't contain your exact search terms.",
  },
  {
    question: "How do I upgrade my plan?",
    answer:
      "Go to Settings > Billing or visit the Pricing page. You can upgrade to Pro Researcher or Team Lead at any time. Your existing data and settings will be preserved during the upgrade. Billing is handled securely via Stripe.",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LifeBuoy className="h-7 w-7" />
          Help Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Find answers to common questions about using Scholar-Flow.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to the most common questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {FAQS.map((faq, idx) => (
              <Collapsible
                key={idx}
                open={openIdx === idx}
                onOpenChange={(open) => setOpenIdx(open ? idx : null)}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 transition-colors">
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription>
              Speed up your workflow with hotkeys.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/help/shortcuts")}
            >
              View shortcuts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Reach out to the Scholar-Flow team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                (window.location.href = "mailto:support@scholarflow.com")
              }
            >
              Email support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
