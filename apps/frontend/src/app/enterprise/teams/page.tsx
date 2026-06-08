import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnterpriseTeamsPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Enterprise</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Team Management</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Advanced collaboration tools for research teams of any size.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                Contact Sales <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Unlimited workspaces with custom branding",
              "Role-based access control (Viewer, Editor, Manager, Owner)",
              "Activity feeds and audit logs",
              "Bulk user provisioning via CSV or SCIM",
              "Custom data retention policies",
              "Dedicated support manager",
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
