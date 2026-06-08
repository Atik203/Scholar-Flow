import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyPressPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Newspaper className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Company</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Press & News</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Latest news, press releases, and media coverage about ScholarFlow.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg">
                Press Kit <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="space-y-6">
            {[
              { title: "ScholarFlow Raises $10M Series A", date: "Jan 15, 2026", excerpt: "Funding to accelerate AI research tools and expand team." },
              { title: "New Semantic Search Engine Launch", date: "Dec 1, 2025", excerpt: "pgvector-powered search delivers 10x faster results." },
              { title: "Partnership with MIT Research Lab", date: "Nov 10, 2025", excerpt: "Collaboration to advance AI-assisted literature review." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.date}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
