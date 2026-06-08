import { PageContainer, Section } from "@/components/layout/PageContainer";
import { HelpCircle, ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResourcesTutorialsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Tutorials</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Step-by-step video and written guides to master ScholarFlow.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Getting Started", duration: "5 min", level: "Beginner" },
              { title: "Semantic Search", duration: "8 min", level: "Intermediate" },
              { title: "AI Summaries", duration: "6 min", level: "Beginner" },
              { title: "Team Collaboration", duration: "10 min", level: "Intermediate" },
              { title: "Advanced Collections", duration: "12 min", level: "Advanced" },
              { title: "API Integration", duration: "15 min", level: "Advanced" },
            ].map((tutorial, i) => (
              <motion.div key={tutorial.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{tutorial.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{tutorial.level}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
