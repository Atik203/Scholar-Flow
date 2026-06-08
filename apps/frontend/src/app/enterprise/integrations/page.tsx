import { PageContainer, Section } from "@/components/layout/PageContainer";
import { ArrowRight, Plug, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnterpriseIntegrationsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Plug className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">Enterprise</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Integrations</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Connect ScholarFlow with your existing tools and workflows.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                Contact Sales <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Zotero & Mendeley sync",
              "Slack & Microsoft Teams notifications",
              "Google Drive & Dropbox import",
              "Overleaf & LaTeX integration",
              "GitHub & GitLab repositories",
              "Custom API webhooks",
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 text-center">
                <CheckCircle2 className="h-8 w-8 text-violet-500 mx-auto mb-3" />
                <p className="text-sm font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
