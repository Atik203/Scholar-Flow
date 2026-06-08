import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Code, ArrowRight, Terminal } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResourcesAPIPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Code className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">API Reference</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              RESTful API for programmatic access to papers, collections, and AI features.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { endpoint: "GET /api/papers", desc: "List all papers with filters and pagination" },
              { endpoint: "POST /api/papers", desc: "Upload a new paper with metadata" },
              { endpoint: "GET /api/papers/:id", desc: "Retrieve paper details and content" },
              { endpoint: "GET /api/papers/:id/summary", desc: "Generate AI summary for a paper" },
              { endpoint: "GET /api/collections", desc: "List collections with membership info" },
              { endpoint: "POST /api/collections", desc: "Create a new collection" },
            ].map((item, i) => (
              <motion.div key={item.endpoint} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 font-mono text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-violet-500" />
                  <span className="text-primary font-semibold">{item.endpoint}</span>
                </div>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
