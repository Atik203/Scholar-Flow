import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Brain, Sparkles, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsAIInsightsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Brain className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">Product</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              AI{" "}
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Leverage AI to extract key insights, generate summaries, and discover connections across your research library.
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">AI-Powered Research</h2>
              <p className="text-muted-foreground mb-6">
                Our AI engine reads, understands, and connects your papers to surface insights you might have missed.
              </p>
              <ul className="space-y-3">
                {[
                  "Automatic paper summarization with key claims",
                  "Semantic similarity between papers",
                  "Citation network analysis and recommendations",
                  "Research gap identification",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Smart Summaries</div>
                  <div className="text-sm text-muted-foreground">Key claims in seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Real-time Insights</div>
                  <div className="text-sm text-muted-foreground">Chat with your papers</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Contextual Understanding</div>
                  <div className="text-sm text-muted-foreground">Domain-aware responses</div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
