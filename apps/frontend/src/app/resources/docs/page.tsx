import { PageContainer, Section } from "@/components/layout/PageContainer";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResourcesDocsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Documentation</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Comprehensive guides for getting started, advanced features, and API reference.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Getting Started", desc: "Installation, account setup, and first upload.", items: ["Quick Start Guide", "Account Setup", "Upload Tutorial", "Workspace Creation"] },
              { title: "Core Features", desc: "Deep dives into paper management, search, and AI.", items: ["Semantic Search", "AI Summaries", "Collections", "Annotations"] },
              { title: "API Reference", desc: "REST API endpoints, authentication, and examples.", items: ["Authentication", "Papers API", "Collections API", "Webhooks"] },
            ].map((section, i) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50">
                <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{section.desc}</p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
