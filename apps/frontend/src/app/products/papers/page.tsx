import { PageContainer, Section } from "@/components/layout/PageContainer";
import { FileText, Upload, Search, Brain, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsPapersPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <PageContainer className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Product</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Research{" "}
              <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
                Papers
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Upload, organize, and analyze academic papers with AI-powered metadata extraction and semantic search.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Smart Paper Management</h2>
              <p className="text-muted-foreground mb-6">
                Our AI engine automatically extracts metadata, generates summaries, and creates semantic embeddings for every paper you upload.
              </p>
              <ul className="space-y-3">
                {[
                  "Automatic metadata extraction (title, authors, abstract)",
                  "OCR for scanned PDFs with 99%+ accuracy",
                  "Semantic chunking for precise search",
                  "Full-text search across all documents",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-2xl blur-2xl" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Upload Papers</div>
                    <div className="text-sm text-muted-foreground">PDF, DOCX, TXT supported</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Semantic Search</div>
                    <div className="text-sm text-muted-foreground">Find by meaning, not keywords</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Summaries</div>
                    <div className="text-sm text-muted-foreground">Key claims in seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      <Section>
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your research library efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Bulk Upload", desc: "Upload hundreds of papers at once with drag-and-drop." },
              { icon: Search, title: "Full-Text Search", desc: "Search across all your papers with instant results." },
              { icon: Brain, title: "AI Summaries", desc: "Get condensed summaries of any paper in seconds." },
              { icon: Sparkles, title: "Smart Collections", desc: "Auto-organize papers by topic, author, or keyword." },
              { icon: FileText, title: "Citation Export", desc: "Export citations in BibTeX, APA, MLA, and more." },
              { icon: CheckCircle2, title: "Version Control", desc: "Track changes and annotations across versions." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
