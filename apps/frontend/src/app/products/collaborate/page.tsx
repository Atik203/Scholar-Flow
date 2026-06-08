import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Users, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsCollaboratePage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Product</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Seamless{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Collaboration</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Work together with your team in real-time. Annotate, discuss, and build shared knowledge.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
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
              <h2 className="text-3xl font-bold mb-4">Team-First Research</h2>
              <p className="text-muted-foreground mb-6">
                Built for research teams of all sizes. From PhD students to enterprise labs, ScholarFlow makes collaboration effortless.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time annotations and threaded discussions",
                  "Role-based access control (Viewer, Editor, Manager)",
                  "Activity feeds and change notifications",
                  "Workspace isolation for multi-project teams",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Team Workspaces</div>
                  <div className="text-sm text-muted-foreground">Isolated projects with members</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Discussions</div>
                  <div className="text-sm text-muted-foreground">Threaded conversations per paper</div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
