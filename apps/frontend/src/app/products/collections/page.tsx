import { PageContainer, Section } from "@/components/layout/PageContainer";
import { FolderOpen, Users, Share2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsCollectionsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <FolderOpen className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Product</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Smart{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Collections</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Organize papers into curated collections, share with your team, and collaborate on research projects.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
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
              <h2 className="text-3xl font-bold mb-4">Collaborative Organization</h2>
              <p className="text-muted-foreground mb-6">
                Create collections for projects, topics, or research areas. Invite collaborators and manage permissions with granular control.
              </p>
              <ul className="space-y-3">
                {[
                  "Create unlimited collections with custom metadata",
                  "Invite collaborators with view or edit permissions",
                  "Track changes and contributions in real-time",
                  "Export collections as bibliographies or reports",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Collections</div>
                  <div className="text-sm text-muted-foreground">Organize by project or topic</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Sharing</div>
                  <div className="text-sm text-muted-foreground">Public or private links</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Collaboration</div>
                  <div className="text-sm text-muted-foreground">Real-time team editing</div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
