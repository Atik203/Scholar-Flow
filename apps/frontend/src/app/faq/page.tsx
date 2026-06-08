import { PageContainer, Section } from "@/components/layout/PageContainer";
import { HelpCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { FAQ } from "@/components/sections/FAQ";

export default function FAQPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">FAQ</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">questions</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Everything you need to know about ScholarFlow.
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      <FAQ />
    </>
  );
}
